import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  AlertOctagon,
  ArrowLeft,
  Columns,
  QrCode,
  Flame,
  Scale,
  Sparkles,
  Percent,
  Check,
  ChevronRight,
} from 'lucide-react';
import { TruthReport, Product, Severity } from '../types';

interface TruthReportViewProps {
  report: TruthReport;
  onBack: () => void;
  onCompareWithAnother: (product: Product) => void;
  onVerifyQr: (batchId: string) => void;
}

export const TruthReportView: React.FC<TruthReportViewProps> = ({
  report,
  onBack,
  onCompareWithAnother,
  onVerifyQr,
}) => {
  const { product, servings_count, calculated_whole_package, sugar_analysis, findings, summary, fssai_status } = report;
  const nutrition = product.nutrition;

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified Factual
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Transparency Alert
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            Compliance Alert
          </span>
        );
      case 'info':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            Informational Finding
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top navigation actions */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-scanner"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Scanner
        </button>

        <div className="flex items-center gap-2">
          <button
            id="btn-compare-current-product"
            onClick={() => onCompareWithAnother(product)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          >
            <Columns className="w-4 h-4 text-emerald-600" />
            Compare This Product
          </button>

          <button
            id="btn-verify-product-qr"
            onClick={() => onVerifyQr(product.batch_number)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            Verify Unit QR Code
          </button>
        </div>
      </div>

      {/* Product Hero & Transparency Score Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                {product.category}
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: {product.product_id}</span>
              <span className="text-xs text-slate-500">Batch: {product.batch_number}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.product_name}
            </h1>
            <p className="text-sm font-medium text-slate-600">
              Brand: <span className="font-semibold text-slate-800">{product.brand}</span>
              {product.manufacturer_name && (
                <span className="text-xs text-slate-400 ml-2">({product.manufacturer_name})</span>
              )}
            </p>

            {/* Claims list */}
            {product.claims.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-slate-400 font-medium">Front Claims:</span>
                {product.claims.map((claim, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-amber-50 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200"
                  >
                    "{claim}"
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Transparency Score Gauge */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center min-w-[200px] shrink-0">
            <div className="text-[11px] uppercase font-bold tracking-wider text-slate-500 mb-1">
              Transparency Score
            </div>
            <div className="text-4xl font-extrabold text-slate-900">
              {summary.overall_transparency_score}
              <span className="text-lg text-slate-400 font-normal">/100</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {summary.warning_count} alerts • {summary.info_count} findings
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: SERVING SIZE ANALYSIS (RULE 1) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Serving Size Breakdown & Multiplier</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Rule: SERVING_SIZE_001</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase">Single Serving Size</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {nutrition.serving_size_g}
              <span className="text-sm font-normal text-slate-500">{product.package_unit || 'g'}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">As stated on label</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase">Total Package Size</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {nutrition.package_size_g}
              <span className="text-sm font-normal text-slate-500">{product.package_unit || 'g'}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Net content weight</div>
          </div>

          <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200">
            <div className="text-xs font-bold text-emerald-800 uppercase">Number of Servings</div>
            <div className="text-2xl font-bold text-emerald-900 mt-1">
              {servings_count}
              <span className="text-sm font-normal text-emerald-700"> servings</span>
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5 font-mono">
              {nutrition.package_size_g} ÷ {nutrition.serving_size_g}
            </div>
          </div>

          <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200">
            <div className="text-xs font-bold text-amber-800 uppercase">Full Pack Multiplier</div>
            <div className="text-2xl font-bold text-amber-900 mt-1">{servings_count}x</div>
            <div className="text-[11px] text-amber-700 mt-0.5">Nutrient multiplier</div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <strong>Explainability Note:</strong> Nutrition facts on food labels are presented per single serving ({nutrition.serving_size_g}{product.package_unit || 'g'}). However, this entire package contains {servings_count} servings. If you consume the entire package in one sitting, your sugar and calorie intake will be {servings_count} times higher than the single-serving values displayed on the front.
        </p>
      </div>

      {/* SECTION 2: DEDICATED SUGAR TRANSPARENCY PANEL (RULE 3) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
              S
            </div>
            <h2 className="text-lg font-bold text-slate-900">Sugar Transparency Panel</h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
            WHO Daily Reference: 25g Max
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase">Per Serving ({nutrition.serving_size_g}{product.package_unit || 'g'})</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {sugar_analysis.sugar_per_serving_g}g
            </div>
            <div className="text-xs text-slate-600 mt-1">
              <strong>{sugar_analysis.who_daily_limit_percentage_per_serving}%</strong> of WHO 25g daily limit
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${Math.min(100, sugar_analysis.who_daily_limit_percentage_per_serving)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase">Per 100g (Normalized Density)</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {sugar_analysis.sugar_per_100g}g
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {sugar_analysis.sugar_per_100g > 20 ? (
                <span className="text-rose-600 font-bold">High Sugar Food (&gt;20g/100g)</span>
              ) : (
                <span className="text-emerald-700 font-medium">Moderate / Standard Density</span>
              )}
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <div className="text-xs text-amber-800 font-semibold uppercase flex items-center justify-between">
              <span>Whole Package Sugar</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-mono">Calculated</span>
            </div>
            <div className="text-3xl font-extrabold text-amber-950 mt-1">
              {sugar_analysis.whole_package_sugar_g}g
            </div>
            <div className="text-xs text-amber-900 mt-1 font-semibold">
              {sugar_analysis.who_daily_limit_percentage_whole_package}% of WHO Daily Limit
            </div>
            <div className="w-full bg-amber-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  sugar_analysis.who_daily_limit_percentage_whole_package > 100
                    ? 'bg-rose-600'
                    : 'bg-amber-600'
                }`}
                style={{ width: `${Math.min(100, sugar_analysis.who_daily_limit_percentage_whole_package)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Identified Sugar Aliases List */}
        {sugar_analysis.detected_sugar_aliases.length > 0 && (
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Sugar & Sweetener Derivatives Identified in Ingredient List:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sugar_analysis.detected_sugar_aliases.map((alias, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-amber-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{alias.term}</span>
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      {alias.alias_type}
                    </span>
                  </div>
                  <p className="text-slate-600">{alias.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: EXPLAINABLE TRUTH FINDINGS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Explainable Transparency Findings</h2>
            <p className="text-xs text-slate-500">
              Each finding is generated deterministically by the rule engine with calculation evidence.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {findings.length} findings evaluated
          </span>
        </div>

        <div className="space-y-3">
          {findings.map((finding, idx) => (
            <div
              key={idx}
              className={`bg-white border rounded-2xl p-5 space-y-3 transition-all ${
                finding.severity === 'critical'
                  ? 'border-rose-200 shadow-xs'
                  : finding.severity === 'warning'
                  ? 'border-amber-200 shadow-xs'
                  : finding.severity === 'verified'
                  ? 'border-emerald-200 shadow-xs'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  {getSeverityBadge(finding.severity)}
                  <span className="text-xs font-bold text-slate-700">{finding.category}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  {finding.rule_id}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{finding.title}</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{finding.explanation}</p>
              </div>

              {/* Evidence & Calculation Box */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 font-mono">
                <div className="text-slate-500 font-bold uppercase text-[10px]">Evidence:</div>
                <div className="text-slate-800">{finding.evidence}</div>
                {finding.calculation && (
                  <div className="pt-1 text-emerald-800">
                    <span className="text-slate-500 font-bold">Calculation: </span>
                    {finding.calculation}
                  </div>
                )}
              </div>

              {finding.recommendation && (
                <div className="text-xs text-slate-600 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Consumer Guidance:</strong> {finding.recommendation}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: COMPLETE NUTRITION FACTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900">Nutritional Facts & Density Normalization</h2>
          <span className="text-xs text-slate-500">Per 100g vs Per Serving</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                <th className="py-2.5 font-bold">Nutrient</th>
                <th className="py-2.5 font-bold">Per Serving ({nutrition.serving_size_g}{product.package_unit || 'g'})</th>
                <th className="py-2.5 font-bold">Per 100{product.package_unit || 'g'}</th>
                <th className="py-2.5 font-bold">Calculated Whole Pack ({nutrition.package_size_g}{product.package_unit || 'g'})</th>
                <th className="py-2.5 font-bold">Traffic-Light Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 font-semibold text-slate-900">Energy (Calories)</td>
                <td className="py-3">
                  {nutrition.energy_kcal_per_100g
                    ? `${Math.round((nutrition.energy_kcal_per_100g * nutrition.serving_size_g) / 100)} kcal`
                    : 'N/A'}
                </td>
                <td className="py-3">{nutrition.energy_kcal_per_100g || 'N/A'} kcal</td>
                <td className="py-3 font-bold text-slate-900">
                  {calculated_whole_package.total_calories_kcal
                    ? `${calculated_whole_package.total_calories_kcal} kcal`
                    : 'N/A'}
                </td>
                <td className="py-3 text-slate-500">Standard Energy</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Total Sugars</td>
                <td className="py-3">{nutrition.sugar_per_serving_g}g</td>
                <td className="py-3">{nutrition.sugar_per_100g_g}g</td>
                <td className="py-3 font-bold text-amber-700">{calculated_whole_package.total_sugar_g}g</td>
                <td className="py-3">
                  {nutrition.sugar_per_100g_g > 20 ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
                      High Sugar
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      Moderate
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Total Fat</td>
                <td className="py-3">{Math.round(((nutrition.fat_per_100g_g * nutrition.serving_size_g) / 100) * 10) / 10}g</td>
                <td className="py-3">{nutrition.fat_per_100g_g}g</td>
                <td className="py-3 font-bold">{calculated_whole_package.total_fat_g || 'N/A'}g</td>
                <td className="py-3 text-slate-500">Fat content</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Saturated Fat</td>
                <td className="py-3">
                  {Math.round(((nutrition.saturated_fat_per_100g_g * nutrition.serving_size_g) / 100) * 10) / 10}g
                </td>
                <td className="py-3">{nutrition.saturated_fat_per_100g_g}g</td>
                <td className="py-3 font-bold">
                  {Math.round(((nutrition.saturated_fat_per_100g_g * nutrition.package_size_g) / 100) * 10) / 10}g
                </td>
                <td className="py-3">
                  {nutrition.saturated_fat_per_100g_g > 8 ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
                      High Sat Fat
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      Low/Moderate
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Salt / Sodium</td>
                <td className="py-3">
                  {Math.round(((nutrition.salt_per_100g_g * nutrition.serving_size_g) / 100) * 100) / 100}g
                </td>
                <td className="py-3">{nutrition.salt_per_100g_g}g</td>
                <td className="py-3 font-bold">{calculated_whole_package.total_salt_g || 'N/A'}g</td>
                <td className="py-3">
                  {nutrition.salt_per_100g_g > 1.5 ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
                      High Salt
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      Standard
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Protein</td>
                <td className="py-3">
                  {Math.round(((nutrition.protein_per_100g_g * nutrition.serving_size_g) / 100) * 10) / 10}g
                </td>
                <td className="py-3">{nutrition.protein_per_100g_g}g</td>
                <td className="py-3 font-bold">
                  {Math.round(((nutrition.protein_per_100g_g * nutrition.package_size_g) / 100) * 10) / 10}g
                </td>
                <td className="py-3 text-slate-500">Protein content</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: CURATED FSSAI VERIFICATION STATUS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">FSSAI Regulatory License Verification</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Curated FoSCoS Subset</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">License Number:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {fssai_status.license_number || 'Unspecified'}
              </span>
            </div>
            <p className="text-xs text-slate-600">{fssai_status.note}</p>
          </div>

          <div>
            {fssai_status.verified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Verified Active in FoSCoS Demo
              </span>
            ) : fssai_status.record?.status === 'SUSPENDED' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                License Suspended on Record
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold">
                Curated Demo Subset
              </span>
            )}
          </div>
        </div>

        <p className="text-[11px] text-slate-500 italic">
          * Note: As designated under Scenario A (MVP), this verification is cross-referenced against our curated FoSCoS dataset. Universal nationwide live FSSAI API integration is designated under Scenario B (Production Roadmap).
        </p>
      </div>
    </div>
  );
};
