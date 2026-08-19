import React, { useState, useEffect } from 'react';
import { Columns, ArrowRight, Check, Sparkles, Scale, Info } from 'lucide-react';
import { Product, ComparisonReport } from '../types';
import { api } from '../lib/api';

interface ProductComparisonProps {
  products: Product[];
  initialProductA?: Product;
  initialProductB?: Product;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  initialProductA,
  initialProductB,
}) => {
  const [selectedIdA, setSelectedIdA] = useState<string>(
    initialProductA?.product_id || products[0]?.product_id || 'DEMO-P001'
  );
  const [selectedIdB, setSelectedIdB] = useState<string>(
    initialProductB?.product_id || products[1]?.product_id || 'DEMO-P002'
  );
  const [comparison, setComparison] = useState<ComparisonReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchComparison = async () => {
      const pA = products.find((p) => p.product_id === selectedIdA);
      const pB = products.find((p) => p.product_id === selectedIdB);
      if (!pA || !pB) return;

      setLoading(true);
      try {
        const res = await api.compareProducts(pA, pB);
        setComparison(res);
      } catch (err) {
        console.error('Comparison error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [selectedIdA, selectedIdB, products]);

  if (!comparison) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
        Loading product comparison data...
      </div>
    );
  }

  const { product_a, product_b, report_a, report_b, differences, factual_takeaways } = comparison;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Product Selectors */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Columns className="w-5 h-5 text-emerald-600" />
            Side-by-Side Product Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compare normalized nutrition density per 100g, serving sizes, and transparency findings between two products.
          </p>
        </div>

        {/* Product Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product A Selector */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Product A (Baseline)
            </label>
            <select
              id="select-product-a"
              value={selectedIdA}
              onChange={(e) => setSelectedIdA(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.product_name} ({p.brand})
                </option>
              ))}
            </select>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
              <span className="font-semibold">{product_a.category}</span> • {product_a.nutrition.package_size_g}{product_a.package_unit || 'g'} pack
            </div>
          </div>

          {/* Product B Selector */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Product B (Comparison)
            </label>
            <select
              id="select-product-b"
              value={selectedIdB}
              onChange={(e) => setSelectedIdB(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.product_name} ({p.brand})
                </option>
              ))}
            </select>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
              <span className="font-semibold">{product_b.category}</span> • {product_b.nutrition.package_size_g}{product_b.package_unit || 'g'} pack
            </div>
          </div>
        </div>
      </div>

      {/* Factual Takeaways Box */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          Objective Factual Comparison Takeaways
        </h3>
        <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-950">
          {factual_takeaways.map((takeaway, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Normalized Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            Normalized Comparison (Per 100g / 100ml)
          </h3>
          <span className="text-xs text-slate-400 font-medium">Standardized Density</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                <th className="py-2.5 font-bold">Metric</th>
                <th className="py-2.5 font-bold">{product_a.product_name} (A)</th>
                <th className="py-2.5 font-bold">{product_b.product_name} (B)</th>
                <th className="py-2.5 font-bold">Difference (B vs A)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              <tr>
                <td className="py-3 font-semibold text-slate-900">Total Sugar (per 100g)</td>
                <td className="py-3">{product_a.nutrition.sugar_per_100g_g}g</td>
                <td className="py-3">{product_b.nutrition.sugar_per_100g_g}g</td>
                <td className="py-3 font-bold">
                  {differences.sugar_diff_per_100g < 0 ? (
                    <span className="text-emerald-700">
                      {differences.sugar_diff_per_100g}g ({differences.sugar_diff_pct}%)
                    </span>
                  ) : differences.sugar_diff_per_100g > 0 ? (
                    <span className="text-rose-600">
                      +{differences.sugar_diff_per_100g}g (+{differences.sugar_diff_pct}%)
                    </span>
                  ) : (
                    <span className="text-slate-500">0g (Equal)</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Protein (per 100g)</td>
                <td className="py-3">{product_a.nutrition.protein_per_100g_g}g</td>
                <td className="py-3">{product_b.nutrition.protein_per_100g_g}g</td>
                <td className="py-3 font-bold">
                  {differences.protein_diff_per_100g > 0 ? (
                    <span className="text-emerald-700">+{differences.protein_diff_per_100g}g</span>
                  ) : differences.protein_diff_per_100g < 0 ? (
                    <span className="text-slate-600">{differences.protein_diff_per_100g}g</span>
                  ) : (
                    <span className="text-slate-500">Equal</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Salt / Sodium (per 100g)</td>
                <td className="py-3">{product_a.nutrition.salt_per_100g_g}g</td>
                <td className="py-3">{product_b.nutrition.salt_per_100g_g}g</td>
                <td className="py-3 font-bold">
                  {differences.salt_diff_per_100g < 0 ? (
                    <span className="text-emerald-700">{differences.salt_diff_per_100g}g</span>
                  ) : differences.salt_diff_per_100g > 0 ? (
                    <span className="text-rose-600">+{differences.salt_diff_per_100g}g</span>
                  ) : (
                    <span className="text-slate-500">Equal</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Saturated Fat (per 100g)</td>
                <td className="py-3">{product_a.nutrition.saturated_fat_per_100g_g}g</td>
                <td className="py-3">{product_b.nutrition.saturated_fat_per_100g_g}g</td>
                <td className="py-3 font-bold">
                  {differences.sat_fat_diff_per_100g < 0 ? (
                    <span className="text-emerald-700">{differences.sat_fat_diff_per_100g}g</span>
                  ) : differences.sat_fat_diff_per_100g > 0 ? (
                    <span className="text-rose-600">+{differences.sat_fat_diff_per_100g}g</span>
                  ) : (
                    <span className="text-slate-500">Equal</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Serving Size</td>
                <td className="py-3">{product_a.nutrition.serving_size_g}{product_a.package_unit || 'g'}</td>
                <td className="py-3">{product_b.nutrition.serving_size_g}{product_b.package_unit || 'g'}</td>
                <td className="py-3 text-slate-500">-</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Servings per Package</td>
                <td className="py-3">{report_a.servings_count} servings</td>
                <td className="py-3">{report_b.servings_count} servings</td>
                <td className="py-3 text-slate-600">{differences.servings_diff} servings diff</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Transparency Alerts</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
                    {report_a.findings.length} findings
                  </span>
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
                    {report_b.findings.length} findings
                  </span>
                </td>
                <td className="py-3 text-slate-500">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
