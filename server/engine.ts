import {
  Product,
  TruthReport,
  TruthFinding,
  CuratedFssaiRecord,
} from '../src/types';
import { db } from './db';

const WHO_DAILY_FREE_SUGAR_LIMIT_G = 25; // 25g daily recommended upper limit by WHO

export class TruthEngine {
  public static analyze(product: Product): TruthReport {
    const findings: TruthFinding[] = [];
    const nutrition = product.nutrition;

    // 1. Serving Size Calculation
    const servingSize = Math.max(nutrition.serving_size_g, 1);
    const packageSize = Math.max(nutrition.package_size_g, servingSize);
    const rawServingsCount = packageSize / servingSize;
    const servingsCount = Math.round(rawServingsCount * 10) / 10;

    // Whole Package Nutrients Calculation
    const wholePackageSugar =
      nutrition.sugar_per_100g_g !== undefined
        ? Math.round(((nutrition.sugar_per_100g_g * packageSize) / 100) * 10) / 10
        : Math.round(nutrition.sugar_per_serving_g * servingsCount * 10) / 10;

    const wholePackageCalories =
      nutrition.energy_kcal_per_100g !== undefined
        ? Math.round((nutrition.energy_kcal_per_100g * packageSize) / 100)
        : undefined;

    const wholePackageFat =
      nutrition.fat_per_100g_g !== undefined
        ? Math.round(((nutrition.fat_per_100g_g * packageSize) / 100) * 10) / 10
        : undefined;

    const wholePackageSalt =
      nutrition.salt_per_100g_g !== undefined
        ? Math.round(((nutrition.salt_per_100g_g * packageSize) / 100) * 10) / 10
        : undefined;

    // RULE 1: SERVING SIZE ANALYSIS
    findings.push({
      rule_id: 'SERVING_SIZE_001',
      category: 'Serving Size',
      severity: 'info',
      title: 'Serving Count & Proportion Breakdown',
      explanation: `This package contains approximately ${servingsCount} standard servings. Total nutritional intake multiplies if consumed in one sitting.`,
      evidence: `Package Size: ${packageSize}${product.package_unit || 'g'} | Serving Size: ${servingSize}${product.package_unit || 'g'}`,
      calculation: `${packageSize} / ${servingSize} = ${servingsCount} servings`,
      recommendation: 'Check whether you typically eat the entire package or just one stated serving.',
    });

    if (servingsCount > 1.5 && packageSize <= 120) {
      findings.push({
        rule_id: 'SERVING_SIZE_002',
        category: 'Serving Size',
        severity: 'warning',
        title: 'Single-Pack Multi-Serving Presentation',
        explanation:
          'This snack is packaged in a compact single-use format, but the nutrition facts are divided into multiple portions. Consumers often consume the entire pack, receiving multiple times the stated nutrients.',
        evidence: `Compact pack of ${packageSize}${product.package_unit || 'g'} is divided into ${servingsCount} servings (${servingSize}${product.package_unit || 'g'} each).`,
        calculation: `Consuming whole pack yields ${wholePackageSugar}g sugar (${Math.round(wholePackageSugar / nutrition.sugar_per_serving_g)}x the front serving display).`,
        recommendation:
          'Evaluate nutrition based on whole-package figures if you intend to eat this in a single session.',
      });
    }

    // RULE 2: INGREDIENT ALIAS & HIDDEN SWEETENER DETECTION
    const knowledgeBase = db.getIngredientKnowledgeBase();
    const ingredientsLower = product.ingredients.map((i) => i.toLowerCase());
    const detectedSugarAliases: { term: string; alias_type: string; notes: string }[] = [];
    const detectedAdditives: { term: string; category: string; explanation: string }[] = [];

    knowledgeBase.forEach((item) => {
      const match = ingredientsLower.find(
        (ing) => ing.includes(item.term) || item.term.includes(ing)
      );
      if (match) {
        if (item.category === 'sugar_alias') {
          detectedSugarAliases.push({
            term: item.displayName,
            alias_type: 'Concentrated / Free Sugar Derivative',
            notes: item.explanation,
          });
        } else {
          detectedAdditives.push({
            term: item.displayName,
            category: item.category,
            explanation: item.explanation,
          });
        }
      }
    });

    if (detectedSugarAliases.length > 0) {
      findings.push({
        rule_id: 'ING_ALIAS_SUGAR_001',
        category: 'Sugar & Sweeteners',
        severity: detectedSugarAliases.length >= 2 ? 'warning' : 'info',
        title: `${detectedSugarAliases.length} Sugar-Related Ingredient(s) Detected`,
        explanation:
          'Manufacturers often use multiple distinct sugar derivatives (such as syrups, concentrates, and malts) so that no single sugar appears as the primary first ingredient on the label.',
        evidence: `Identified terms in ingredient list: ${detectedSugarAliases.map((a) => a.term).join(', ')}.`,
        triggered_terms: detectedSugarAliases.map((a) => a.term),
        recommendation:
          'Sum up the combined effect of all sugar derivatives rather than evaluating table sugar alone.',
      });
    }

    detectedAdditives.forEach((additive) => {
      if (additive.category === 'unhealthy_fat') {
        findings.push({
          rule_id: 'ING_ALIAS_FAT_001',
          category: 'Ingredients & Additives',
          severity: 'warning',
          title: `Industrial Fat Detected: ${additive.term}`,
          explanation: additive.explanation,
          evidence: `Ingredient present: "${additive.term}"`,
          recommendation: 'Check saturated fat and trans-fat declarations carefully.',
        });
      } else if (additive.category === 'preservative_salt') {
        findings.push({
          rule_id: 'ING_ALIAS_SALT_001',
          category: 'Ingredients & Additives',
          severity: 'info',
          title: `Flavor Enhancer / Sodium Additive: ${additive.term}`,
          explanation: additive.explanation,
          evidence: `Ingredient present: "${additive.term}"`,
        });
      }
    });

    // RULE 3: SUGAR TRANSPARENCY & WHO DAILY LIMIT
    const whoServingPct = Math.round(
      (nutrition.sugar_per_serving_g / WHO_DAILY_FREE_SUGAR_LIMIT_G) * 100
    );
    const whoWholePct = Math.round(
      (wholePackageSugar / WHO_DAILY_FREE_SUGAR_LIMIT_G) * 100
    );

    if (whoWholePct >= 100) {
      findings.push({
        rule_id: 'SUGAR_001',
        category: 'Sugar & Sweeteners',
        severity: 'warning',
        title: 'Whole Package Exceeds 100% of WHO Daily Added Sugar Limit',
        explanation: `The World Health Organization (WHO) recommends limiting daily free sugars to under 25g. Consuming this entire pack provides ${wholePackageSugar}g of sugar (${whoWholePct}% of the full day's limit).`,
        evidence: `Sugar in whole package: ${wholePackageSugar}g. WHO Daily Reference Limit: 25g.`,
        calculation: `(${wholePackageSugar}g / 25g) * 100 = ${whoWholePct}% of daily limit`,
        recommendation: 'Consider portioning this food over multiple days or sharing it.',
      });
    } else if (whoServingPct >= 40) {
      findings.push({
        rule_id: 'SUGAR_002',
        category: 'Sugar & Sweeteners',
        severity: 'info',
        title: 'High Sugar Proportion per Serving',
        explanation: `A single serving provides ${whoServingPct}% of the recommended daily limit for free sugars (${nutrition.sugar_per_serving_g}g).`,
        evidence: `Per Serving Sugar: ${nutrition.sugar_per_serving_g}g (${whoServingPct}% of 25g guideline).`,
        calculation: `(${nutrition.sugar_per_serving_g}g / 25g) * 100 = ${whoServingPct}%`,
      });
    }

    // RULE 4: MARKETING CLAIM ANALYSIS
    const claims = product.claims.map((c) => c.toLowerCase());

    // Claim Check: "No Added Sugar" / "Zero Sugar"
    const hasNoAddedSugarClaim = claims.some(
      (c) =>
        c.includes('no added sugar') ||
        c.includes('zero added sugar') ||
        c.includes('no added refined sugar')
    );

    if (hasNoAddedSugarClaim) {
      // Check if concentrated syrups or concentrates are present
      const concentratedSugars = detectedSugarAliases.filter(
        (a) =>
          !a.term.toLowerCase().includes('stevia') &&
          !a.term.toLowerCase().includes('erythritol')
      );

      if (concentratedSugars.length > 0) {
        findings.push({
          rule_id: 'CLAIM_001',
          category: 'Marketing Claims',
          severity: 'warning',
          title: 'Claim "No Added Sugar" Requires Scrutiny',
          explanation:
            'While the product may not contain table cane sugar (sucrose), it incorporates concentrated sugar alternatives (like syrups or juice concentrates) that behave metabolically as free sugars.',
          evidence: `Claim on pack: "${product.claims.find((c) =>
            c.toLowerCase().includes('sugar')
          )}". Detected free sugar ingredients: ${concentratedSugars
            .map((s) => s.term)
            .join(', ')}.`,
          recommendation:
            'Review total sugar per 100g (${nutrition.sugar_per_100g_g}g) rather than relying solely on the front claim.',
        });
      } else {
        findings.push({
          rule_id: 'CLAIM_001_VALID',
          category: 'Marketing Claims',
          severity: 'verified',
          title: 'Claim "No Added Sugar" Consistent with Ingredients',
          explanation:
            'No added free sugar syrups or cane sugars were detected in the ingredient analysis.',
          evidence: `Sugar per 100g is ${nutrition.sugar_per_100g_g}g with non-caloric/natural base.`,
        });
      }
    }

    // Claim Check: "High Protein"
    const hasHighProteinClaim = claims.some((c) => c.includes('protein'));
    if (hasHighProteinClaim) {
      const proteinPer100g = nutrition.protein_per_100g_g;
      const proteinPerServing =
        Math.round(((proteinPer100g * servingSize) / 100) * 10) / 10;

      if (proteinPerServing >= 10 || proteinPer100g >= 15) {
        findings.push({
          rule_id: 'CLAIM_002',
          category: 'Marketing Claims',
          severity: 'verified',
          title: `Verified High Protein Content (${proteinPerServing}g per serving)`,
          explanation:
            'The nutritional declaration confirms significant protein concentration satisfying statutory high-protein criteria.',
          evidence: `Protein: ${proteinPer100g}g per 100g (${proteinPerServing}g per ${servingSize}${product.package_unit || 'g'} serving).`,
        });
      } else {
        findings.push({
          rule_id: 'CLAIM_002_ALERT',
          category: 'Marketing Claims',
          severity: 'warning',
          title: 'High Protein Claim Needs Context',
          explanation: `Protein content is ${proteinPerServing}g per serving (${proteinPer100g}g/100g), which may not represent a dense primary protein source relative to total calories.`,
          evidence: `Protein is ${proteinPerServing}g per serving.`,
        });
      }
    }

    // Claim Check: "100% Natural"
    const hasNaturalClaim = claims.some(
      (c) => c.includes('natural') || c.includes('100% pure')
    );
    if (hasNaturalClaim) {
      const artificialAdditives = ingredientsLower.filter(
        (ing) =>
          ing.includes('ins ') ||
          ing.includes('preservative') ||
          ing.includes('maltodextrin') ||
          ing.includes('artificial') ||
          ing.includes('hydrogenated')
      );

      if (artificialAdditives.length > 0) {
        findings.push({
          rule_id: 'CLAIM_003',
          category: 'Marketing Claims',
          severity: 'warning',
          title: 'Claim "Natural / 100% Pure" vs Industrial Processing Agents',
          explanation:
            'The package displays natural branding, but the ingredient list discloses industrial additives, food codes (INS), or heavily processed isolates.',
          evidence: `Detected processing agents / INS numbers: ${artificialAdditives.join(
            ', '
          )}.`,
          recommendation:
            'Note that "natural" is often used as a marketing descriptor rather than a strict certified standard.',
        });
      }
    }

    // RULE 5: FSSAI REGISTRATION CHECK
    const fssaiRecord = db.getFssaiRecord(product.fssai_license_number);
    let fssaiNote = '';
    let fssaiVerified = false;

    if (fssaiRecord) {
      fssaiVerified = fssaiRecord.status === 'VALID';
      fssaiNote = `Verified against curated FoSCoS demo registry. License Status: ${fssaiRecord.status}. Registered to: ${fssaiRecord.company_name}.`;

      findings.push({
        rule_id: 'FSSAI_001',
        category: 'Regulatory & FSSAI',
        severity: fssaiRecord.status === 'VALID' ? 'verified' : 'critical',
        title:
          fssaiRecord.status === 'VALID'
            ? 'FSSAI License Verified (Curated Demo Dataset)'
            : `FSSAI License Status Alert: ${fssaiRecord.status}`,
        explanation: `License #${product.fssai_license_number} matches ${fssaiRecord.company_name} on record. Source: ${fssaiRecord.verification_source}.`,
        evidence: `License: ${product.fssai_license_number} | Category: ${fssaiRecord.permitted_categories.join(', ')} | Validated on: ${fssaiRecord.last_verified_date}`,
        recommendation:
          fssaiRecord.status === 'VALID'
            ? 'Standard curated regulatory confirmation.'
            : 'Check product authenticity or regulatory compliance notices.',
      });
    } else {
      fssaiNote =
        'License not found in curated SIH demo registry. (Note: MVP verifies against curated dataset, not live nationwide FSSAI database).';
      findings.push({
        rule_id: 'FSSAI_002',
        category: 'Regulatory & FSSAI',
        severity: 'info',
        title: 'FSSAI License Unchecked in Curated Subset',
        explanation:
          'This license number is not included in our pre-verified curated demo dataset. (Scenario A MVP constraint).',
        evidence: `License #${product.fssai_license_number}`,
        recommendation: 'Official live FoSCoS verification is designated for Production Roadmap.',
      });
    }

    // RULE 6: HFSS NUTRI-PROFILE (High Fat, Sugar, Salt per 100g)
    if (nutrition.sugar_per_100g_g > 20) {
      findings.push({
        rule_id: 'HFSS_SUGAR_001',
        category: 'Nutrition Profile',
        severity: 'warning',
        title: `High Sugar Density (${nutrition.sugar_per_100g_g}g per 100g)`,
        explanation:
          'Over 20% of the product weight is composed of sugars. Under international traffic-light labeling, this qualifies as a High-Sugar food.',
        evidence: `${nutrition.sugar_per_100g_g}g sugar / 100g`,
      });
    }

    if (nutrition.salt_per_100g_g > 1.5) {
      findings.push({
        rule_id: 'HFSS_SALT_001',
        category: 'Nutrition Profile',
        severity: 'warning',
        title: `High Salt / Sodium Density (${nutrition.salt_per_100g_g}g salt per 100g)`,
        explanation:
          'Salt exceeds 1.5g per 100g (equivalent to >600mg sodium), representing a high-sodium snack.',
        evidence: `${nutrition.salt_per_100g_g}g salt / 100g`,
      });
    }

    if (nutrition.saturated_fat_per_100g_g > 8) {
      findings.push({
        rule_id: 'HFSS_FAT_001',
        category: 'Nutrition Profile',
        severity: 'warning',
        title: `High Saturated Fat (${nutrition.saturated_fat_per_100g_g}g per 100g)`,
        explanation:
          'Saturated fatty acids constitute a significant portion of the total product mass.',
        evidence: `${nutrition.saturated_fat_per_100g_g}g saturated fat / 100g`,
      });
    }

    // Summary counts
    const criticalCount = findings.filter((f) => f.severity === 'critical').length;
    const warningCount = findings.filter((f) => f.severity === 'warning').length;
    const infoCount = findings.filter((f) => f.severity === 'info').length;

    // Explainable Transparency Score (100 base minus weights)
    let score = 100;
    score -= criticalCount * 30;
    score -= warningCount * 12;
    score = Math.max(10, Math.min(100, score));

    return {
      product,
      servings_count: servingsCount,
      calculated_whole_package: {
        total_sugar_g: wholePackageSugar,
        total_calories_kcal: wholePackageCalories,
        total_fat_g: wholePackageFat,
        total_salt_g: wholePackageSalt,
      },
      sugar_analysis: {
        sugar_per_serving_g: nutrition.sugar_per_serving_g,
        sugar_per_100g: nutrition.sugar_per_100g_g,
        whole_package_sugar_g: wholePackageSugar,
        who_daily_limit_percentage_per_serving: whoServingPct,
        who_daily_limit_percentage_whole_package: whoWholePct,
        detected_sugar_aliases: detectedSugarAliases,
      },
      findings,
      summary: {
        total_alerts: findings.length,
        critical_count: criticalCount,
        warning_count: warningCount,
        info_count: infoCount,
        overall_transparency_score: score,
      },
      fssai_status: {
        license_number: product.fssai_license_number,
        verified: fssaiVerified,
        record: fssaiRecord,
        note: fssaiNote,
      },
    };
  }

  // Product Comparison Engine
  public static compare(productA: Product, productB: Product) {
    const reportA = TruthEngine.analyze(productA);
    const reportB = TruthEngine.analyze(productB);

    const sugarA = productA.nutrition.sugar_per_100g_g;
    const sugarB = productB.nutrition.sugar_per_100g_g;
    const sugarDiff = Math.round((sugarB - sugarA) * 10) / 10;
    const sugarDiffPct =
      sugarA > 0 ? Math.round(((sugarB - sugarA) / sugarA) * 100) : 0;

    const saltA = productA.nutrition.salt_per_100g_g;
    const saltB = productB.nutrition.salt_per_100g_g;
    const saltDiff = Math.round((saltB - saltA) * 100) / 100;

    const fatA = productA.nutrition.fat_per_100g_g;
    const fatB = productB.nutrition.fat_per_100g_g;
    const fatDiff = Math.round((fatB - fatA) * 10) / 10;

    const satFatA = productA.nutrition.saturated_fat_per_100g_g;
    const satFatB = productB.nutrition.saturated_fat_per_100g_g;
    const satFatDiff = Math.round((satFatB - satFatA) * 10) / 10;

    const proteinA = productA.nutrition.protein_per_100g_g;
    const proteinB = productB.nutrition.protein_per_100g_g;
    const proteinDiff = Math.round((proteinB - proteinA) * 10) / 10;

    const servingsA = productA.nutrition.package_size_g / productA.nutrition.serving_size_g;
    const servingsB = productB.nutrition.package_size_g / productB.nutrition.serving_size_g;
    const servingsDiff = Math.round((servingsB - servingsA) * 10) / 10;

    const factualTakeaways: string[] = [];

    if (sugarDiff < 0) {
      factualTakeaways.push(
        `"${productB.product_name}" contains ${Math.abs(sugarDiff)}g less sugar per 100g (${Math.abs(sugarDiffPct)}% lower sugar density) than "${productA.product_name}".`
      );
    } else if (sugarDiff > 0) {
      factualTakeaways.push(
        `"${productA.product_name}" contains ${sugarDiff}g less sugar per 100g (${sugarDiffPct}% lower sugar density) than "${productB.product_name}".`
      );
    } else {
      factualTakeaways.push('Both products have equal sugar density per 100g.');
    }

    if (proteinDiff > 2) {
      factualTakeaways.push(
        `"${productB.product_name}" offers ${proteinDiff}g more protein per 100g.`
      );
    } else if (proteinDiff < -2) {
      factualTakeaways.push(
        `"${productA.product_name}" offers ${Math.abs(proteinDiff)}g more protein per 100g.`
      );
    }

    if (saltDiff < -0.5) {
      factualTakeaways.push(
        `"${productB.product_name}" has substantially lower sodium/salt content.`
      );
    } else if (saltDiff > 0.5) {
      factualTakeaways.push(
        `"${productA.product_name}" has substantially lower sodium/salt content.`
      );
    }

    return {
      product_a: productA,
      product_b: productB,
      report_a: reportA,
      report_b: reportB,
      differences: {
        sugar_diff_per_100g: sugarDiff,
        sugar_diff_pct: sugarDiffPct,
        salt_diff_per_100g: saltDiff,
        fat_diff_per_100g: fatDiff,
        sat_fat_diff_per_100g: satFatDiff,
        protein_diff_per_100g: proteinDiff,
        servings_diff: servingsDiff,
      },
      factual_takeaways: factualTakeaways,
    };
  }
}
