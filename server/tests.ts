import { FullTestSuiteResult, TestResultItem, Product } from '../src/types';
import { TruthEngine } from './engine';
import { db } from './db';

export function runAutomatedTestSuite(): FullTestSuiteResult {
  const results: TestResultItem[] = [];

  // TEST 1: Serving-size calculation
  try {
    const testProduct: Product = {
      product_id: 'TEST-001',
      product_name: 'Test Cookies',
      brand: 'Test Brand',
      category: 'Biscuits',
      nutrition: {
        serving_size_g: 25,
        package_size_g: 100,
        sugar_per_serving_g: 8,
        sugar_per_100g_g: 32,
        salt_per_100g_g: 0.5,
        fat_per_100g_g: 10,
        saturated_fat_per_100g_g: 5,
        protein_per_100g_g: 4,
      },
      ingredients: ['wheat flour', 'sugar'],
      claims: [],
      fssai_license_number: '10014022002891',
      batch_number: 'TEST-B1',
      manufacturing_date: '2026-01-01',
      expiry_date: '2027-01-01',
    };

    const report = TruthEngine.analyze(testProduct);
    const passed = report.servings_count === 4;
    results.push({
      id: 'TEST-1-SERVING-SIZE',
      name: 'Serving Size Division Calculation',
      passed,
      expected: '4 servings (100g / 25g)',
      actual: `${report.servings_count} servings`,
      details: 'Calculated package size divided by stated serving portion.',
    });
  } catch (err: any) {
    results.push({
      id: 'TEST-1-SERVING-SIZE',
      name: 'Serving Size Division Calculation',
      passed: false,
      expected: '4 servings',
      actual: `Error: ${err.message}`,
      details: 'Failed with unhandled exception.',
    });
  }

  // TEST 2: Whole-package nutrient calculation
  try {
    const testProduct: Product = {
      product_id: 'TEST-002',
      product_name: 'Test Pack',
      brand: 'Test Brand',
      category: 'Biscuits',
      nutrition: {
        serving_size_g: 25,
        package_size_g: 100,
        sugar_per_serving_g: 8,
        sugar_per_100g_g: 32,
        salt_per_100g_g: 0.5,
        fat_per_100g_g: 10,
        saturated_fat_per_100g_g: 5,
        protein_per_100g_g: 4,
      },
      ingredients: ['wheat flour'],
      claims: [],
      fssai_license_number: '10014022002891',
      batch_number: 'TEST-B1',
      manufacturing_date: '2026-01-01',
      expiry_date: '2027-01-01',
    };

    const report = TruthEngine.analyze(testProduct);
    const wholeSugar = report.calculated_whole_package.total_sugar_g;
    const passed = wholeSugar === 32;
    results.push({
      id: 'TEST-2-WHOLE-PACKAGE',
      name: 'Whole-Package Nutrient Normalization',
      passed,
      expected: '32g total sugar in 100g pack',
      actual: `${wholeSugar}g total sugar`,
      details: 'Computed (32g/100g) * 100g package size.',
    });
  } catch (err: any) {
    results.push({
      id: 'TEST-2-WHOLE-PACKAGE',
      name: 'Whole-Package Nutrient Normalization',
      passed: false,
      expected: '32g',
      actual: `Error: ${err.message}`,
      details: 'Calculation error.',
    });
  }

  // TEST 3: Ingredient alias detection
  try {
    const testProduct: Product = {
      product_id: 'TEST-003',
      product_name: 'Granola Bar',
      brand: 'Test Brand',
      category: 'Breakfast cereal',
      nutrition: {
        serving_size_g: 30,
        package_size_g: 90,
        sugar_per_serving_g: 6,
        sugar_per_100g_g: 20,
        salt_per_100g_g: 0.2,
        fat_per_100g_g: 8,
        saturated_fat_per_100g_g: 2,
        protein_per_100g_g: 5,
      },
      ingredients: ['oats', 'glucose syrup', 'invert sugar', 'date syrup'],
      claims: [],
      fssai_license_number: '10014022002891',
      batch_number: 'TEST-B1',
      manufacturing_date: '2026-01-01',
      expiry_date: '2027-01-01',
    };

    const report = TruthEngine.analyze(testProduct);
    const detectedAliases = report.sugar_analysis.detected_sugar_aliases;
    const passed = detectedAliases.length >= 3;
    results.push({
      id: 'TEST-3-INGREDIENT-ALIASES',
      name: 'Sugar Derivative & Alias Detection',
      passed,
      expected: 'At least 3 aliases detected (glucose syrup, invert sugar, date syrup)',
      actual: `${detectedAliases.length} aliases detected: ${detectedAliases.map((a) => a.term).join(', ')}`,
      details: 'Scanned ingredient array against knowledge base dictionary.',
    });
  } catch (err: any) {
    results.push({
      id: 'TEST-3-INGREDIENT-ALIASES',
      name: 'Sugar Derivative & Alias Detection',
      passed: false,
      expected: '>= 3 aliases',
      actual: `Error: ${err.message}`,
      details: 'Detection failed.',
    });
  }

  // TEST 4: Marketing claim analysis
  try {
    const testProduct: Product = {
      product_id: 'TEST-004',
      product_name: 'Sugar Free Cereal',
      brand: 'Health Co',
      category: 'Breakfast cereal',
      nutrition: {
        serving_size_g: 30,
        package_size_g: 300,
        sugar_per_serving_g: 7,
        sugar_per_100g_g: 23,
        salt_per_100g_g: 0.1,
        fat_per_100g_g: 4,
        saturated_fat_per_100g_g: 1,
        protein_per_100g_g: 6,
      },
      ingredients: ['rolled oats', 'date syrup', 'apple juice concentrate'],
      claims: ['No Added Sugar', '100% Natural'],
      fssai_license_number: '10014022002891',
      batch_number: 'TEST-B1',
      manufacturing_date: '2026-01-01',
      expiry_date: '2027-01-01',
    };

    const report = TruthEngine.analyze(testProduct);
    const claimAlert = report.findings.find((f) => f.rule_id === 'CLAIM_001');
    const passed = !!claimAlert && claimAlert.severity === 'warning';
    results.push({
      id: 'TEST-4-CLAIM-SCRUTINY',
      name: 'Marketing Claim vs Ingredient Scrutiny',
      passed,
      expected: 'Warning finding for "No Added Sugar" with date syrup/juice concentrate',
      actual: claimAlert ? `Finding generated: ${claimAlert.title}` : 'No claim alert generated',
      details: 'Detected concentrated fruit sugars conflicting with front-of-pack claim.',
    });
  } catch (err: any) {
    results.push({
      id: 'TEST-4-CLAIM-SCRUTINY',
      name: 'Marketing Claim vs Ingredient Scrutiny',
      passed: false,
      expected: 'Warning finding',
      actual: `Error: ${err.message}`,
      details: 'Scrutiny rule threw error.',
    });
  }

  // TEST 5: Missing / zero data fallback handling
  try {
    const minimalProduct: Product = {
      product_id: 'TEST-005',
      product_name: 'Minimal Info Snack',
      brand: 'Basic Foods',
      category: 'Snack',
      nutrition: {
        serving_size_g: 0,
        package_size_g: 50,
        sugar_per_serving_g: 0,
        sugar_per_100g_g: 0,
        salt_per_100g_g: 0,
        fat_per_100g_g: 0,
        saturated_fat_per_100g_g: 0,
        protein_per_100g_g: 0,
      },
      ingredients: [],
      claims: [],
      fssai_license_number: '',
      batch_number: '',
      manufacturing_date: '',
      expiry_date: '',
    };

    const report = TruthEngine.analyze(minimalProduct);
    const passed =
      !isNaN(report.servings_count) &&
      isFinite(report.servings_count) &&
      report.servings_count >= 1;
    results.push({
      id: 'TEST-5-ZERO-FALLBACK',
      name: 'Missing Data & Division-by-Zero Protection',
      passed,
      expected: 'Graceful fallback to serving_count >= 1 without NaN / crashing',
      actual: `Servings: ${report.servings_count}, Score: ${report.summary.overall_transparency_score}`,
      details: 'Ensured Math.max guarding prevents runtime divide-by-zero crashes.',
    });
  } catch (err: any) {
    results.push({
      id: 'TEST-5-ZERO-FALLBACK',
      name: 'Missing Data & Division-by-Zero Protection',
      passed: false,
      expected: 'No crash',
      actual: `Error: ${err.message}`,
      details: 'Runtime crash occurred.',
    });
  }

  // Database / QR Unit Tests
  // Prepare fresh test unit in db
  const testUnitCode = `TEST-SUITE-UNIT-${Date.now()}`;
  db.createUnit({
    unit_id: 'TEST-UNIT-99',
    product_id: 'DEMO-P001',
    batch_id: 'DEMO-BATCH-001',
    unique_code: testUnitCode,
    created_at: new Date().toISOString(),
    status: 'ACTIVE',
    scan_count: 0,
  });

  // TEST 6: First QR scan
  try {
    const scan1 = db.recordScan(testUnitCode, 'judge-session-alpha', '10.0.0.1');
    const passed = scan1.status === 'VERIFIED' && scan1.unit?.scan_count === 1;
    results.push({
      id: 'TEST-6-QR-FIRST-SCAN',
      name: 'QR Case A: First Recorded Scan',
      passed,
      expected: 'Status: VERIFIED, scan_count = 1',
      actual: `Status: ${scan1.status}, scan_count = ${scan1.unit?.scan_count}`,
      details: 'Recorded brand new unit scan with authenticated verification.',
    });
  } catch (err: any) {
    results.push({
      id: 'TEST-6-QR-FIRST-SCAN',
      name: 'QR Case A: First Recorded Scan',
      passed: false,
      expected: 'VERIFIED',
      actual: `Error: ${err.message}`,
      details: 'Scan failed.',
    });
  }

  // TEST 7: Repeat QR scan from same session
  try {
    const scan2 = db.recordScan(testUnitCode, 'judge-session-alpha', '10.0.0.1');
    const passed = scan2.status === 'ALREADY_VERIFIED';
    results.push({
      id: 'TEST-7-QR-SAME-SESSION-REPEAT',
      name: 'QR Case B: Same Session Repeat Scan',
      passed,
      expected: 'Status: ALREADY_VERIFIED (Benign customer re-check)',
      actual: `Status: ${scan2.status}`,
      details: 'Recognized same session ID without falsely raising counterfeit alarms.',
    });
  } catch (err: any) {
    results.push({
      id: 'TEST-7-QR-SAME-SESSION-REPEAT',
      name: 'QR Case B: Same Session Repeat Scan',
      passed: false,
      expected: 'ALREADY_VERIFIED',
      actual: `Error: ${err.message}`,
      details: 'Repeat scan failed.',
    });
  }

  // TEST 8: Suspicious QR reuse from different session
  try {
    const scan3 = db.recordScan(
      testUnitCode,
      'different-remote-device-beta',
      '198.51.100.99'
    );
    const passed = scan3.status === 'POSSIBLE_DUPLICATE';
    results.push({
      id: 'TEST-8-QR-SUSPICIOUS-REUSE',
      name: 'QR Case C: Suspicious Code Reuse Detection',
      passed,
      expected: 'Status: POSSIBLE_DUPLICATE (Code scanned on different device/session)',
      actual: `Status: ${scan3.status}`,
      details: 'Triggered multi-device duplicate scan alert with full evidence log.',
    });
  } catch (err: any) {
    results.push({
      id: 'TEST-8-QR-SUSPICIOUS-REUSE',
      name: 'QR Case C: Suspicious Code Reuse Detection',
      passed: false,
      expected: 'POSSIBLE_DUPLICATE',
      actual: `Error: ${err.message}`,
      details: 'Suspicious duplicate test failed.',
    });
  }

  // TEST 9: Recalled batch scan
  try {
    const recalledScan = db.recordScan('LTE-UNIT-010-J0G1', 'judge-session-gamma');
    const passed =
      recalledScan.status === 'RECALLED_BATCH' &&
      recalledScan.explainability.why.includes('RECALLED');
    results.push({
      id: 'TEST-9-BATCH-RECALL-BLOCK',
      name: 'Batch Traceability & Live Recall Alert',
      passed,
      expected: 'Status: RECALLED_BATCH with authoritative warning and recall reason',
      actual: `Status: ${recalledScan.status}`,
      details: 'Correctly blocked recalled unit under Batch 002 with recall context.',
    });
  } catch (err: any) {
    results.push({
      id: 'TEST-9-BATCH-RECALL-BLOCK',
      name: 'Batch Traceability & Live Recall Alert',
      passed: false,
      expected: 'RECALLED_BATCH',
      actual: `Error: ${err.message}`,
      details: 'Recall scan failed.',
    });
  }

  // TEST 10: Unknown / invalid QR code
  try {
    const unknownScan = db.recordScan('NON-EXISTENT-FAKE-QR-CODE', 'session-any');
    const passed =
      unknownScan.status === 'INVALID_CODE' &&
      unknownScan.explainability.why.includes('not recognized');
    results.push({
      id: 'TEST-10-INVALID-QR-HANDLING',
      name: 'Unregistered Code & Tamper Defense',
      passed,
      expected: 'Status: INVALID_CODE with unverified advisory message',
      actual: `Status: ${unknownScan.status}`,
      details: 'Handled nonexistent QR code safely without server exceptions.',
    });
  } catch (err: any) {
    results.push({
      id: 'TEST-10-INVALID-QR-HANDLING',
      name: 'Unregistered Code & Tamper Defense',
      passed: false,
      expected: 'INVALID_CODE',
      actual: `Error: ${err.message}`,
      details: 'Invalid code handling threw error.',
    });
  }

  const passedTests = results.filter((r) => r.passed).length;

  return {
    timestamp: new Date().toISOString(),
    total_tests: results.length,
    passed_tests: passedTests,
    failed_tests: results.length - passedTests,
    results,
  };
}
