/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { ProductScanner } from './components/ProductScanner';
import { TruthReportView } from './components/TruthReportView';
import { ProductComparison } from './components/ProductComparison';
import { QRVerifier } from './components/QRVerifier';
import { AdminDashboard } from './components/AdminDashboard';
import { TestSuiteView } from './components/TestSuiteView';
import { JudgeDemoGuide } from './components/JudgeDemoGuide';
import { DocumentationView } from './components/DocumentationView';
import { Product, TruthReport } from './types';
import { api } from './lib/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scanner');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedReport, setSelectedReport] = useState<TruthReport | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [comparisonProductA, setComparisonProductA] = useState<Product | undefined>(undefined);
  const [defaultQrCode, setDefaultQrCode] = useState<string>('LTE-UNIT-001-A9F2');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSelectProduct = async (productOrId: Product | string) => {
    const id = typeof productOrId === 'string' ? productOrId : productOrId.product_id;
    try {
      const { product, report } = await api.getProduct(id);
      setSelectedProduct(product);
      setSelectedReport(report);
      setActiveTab('scanner');
    } catch (err) {
      console.error('Error loading product report:', err);
    }
  };

  const handleAnalyzeCustomProduct = async (customProduct: Product) => {
    try {
      const report = await api.analyzeProduct(customProduct);
      setSelectedProduct(customProduct);
      setSelectedReport(report);
      setActiveTab('scanner');
      showToast(`Analyzed ${customProduct.product_name} successfully!`);
    } catch (err) {
      console.error('Error analyzing custom product:', err);
    }
  };

  const handleVerifyQrCode = (code: string) => {
    setDefaultQrCode(code);
    setActiveTab('qr_verify');
  };

  const handleCompareWithAnother = (product: Product) => {
    setComparisonProductA(product);
    setActiveTab('compare');
  };

  const handleTriggerBatchRecall = async (
    batchId: string,
    status: 'ACTIVE' | 'RECALLED',
    reason?: string
  ) => {
    try {
      await api.setBatchStatus(batchId, status, reason);
      showToast(`Batch ${batchId} status updated to ${status}`);
      await loadProducts();
    } catch (err) {
      console.error('Batch status update failed:', err);
    }
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await api.resetDemo();
      await loadProducts();
      setSelectedProduct(null);
      setSelectedReport(null);
      setDefaultQrCode('LTE-UNIT-001-A9F2');
      showToast('Demo dataset, units, and batches reset to clean initial state!');
    } catch (err) {
      console.error('Failed to reset demo:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'scanner') {
            // Keep report state or allow returning
          }
        }}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-semibold text-slate-600">
                Initializing Label Truth Engine...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* View: Scanner / Truth Report */}
            {activeTab === 'scanner' && (
              <>
                {selectedReport && selectedProduct ? (
                  <TruthReportView
                    report={selectedReport}
                    onBack={() => {
                      setSelectedProduct(null);
                      setSelectedReport(null);
                    }}
                    onCompareWithAnother={handleCompareWithAnother}
                    onVerifyQr={(batch) => handleVerifyQrCode(`LTE-UNIT-001-A9F2`)}
                  />
                ) : (
                  <ProductScanner
                    onSelectProduct={handleSelectProduct}
                    onAnalyzeCustomProduct={handleAnalyzeCustomProduct}
                    onVerifyQrCode={handleVerifyQrCode}
                    products={products}
                  />
                )}
              </>
            )}

            {/* View: Products Catalogue */}
            {activeTab === 'products' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">
                      Curated Food Products Directory
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Explore packaged food samples with pre-verified labels and FoSCoS registrations.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {products.length} Products Available
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => {
                    const servings =
                      Math.round((p.nutrition.package_size_g / p.nutrition.serving_size_g) * 10) /
                      10;
                    const wholeSugar =
                      Math.round(
                        ((p.nutrition.sugar_per_100g_g * p.nutrition.package_size_g) / 100) * 10
                      ) / 10;

                    return (
                      <div
                        key={p.product_id}
                        onClick={() => handleSelectProduct(p)}
                        className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-6 space-y-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {p.category}
                            </span>
                            <span className="text-xs font-mono text-slate-400">
                              {p.product_id}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-lg">{p.product_name}</h3>
                          <p className="text-xs text-slate-500 font-medium">{p.brand}</p>
                          <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-slate-100">
                          <div className="bg-slate-50 p-2 rounded-lg">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">
                              Servings
                            </div>
                            <div className="font-bold text-slate-800">{servings}x</div>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">
                              Sugar/100g
                            </div>
                            <div className="font-bold text-slate-800">
                              {p.nutrition.sugar_per_100g_g}g
                            </div>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg">
                            <div className="text-slate-400 text-[10px] uppercase font-bold">
                              Pack Sugar
                            </div>
                            <div className="font-bold text-amber-700">{wholeSugar}g</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View: Product Comparison */}
            {activeTab === 'compare' && (
              <ProductComparison
                products={products}
                initialProductA={comparisonProductA}
              />
            )}

            {/* View: QR Verification */}
            {activeTab === 'qr_verify' && (
              <QRVerifier
                onSelectProduct={(id) => handleSelectProduct(id)}
                defaultCode={defaultQrCode}
              />
            )}

            {/* View: Admin Dashboard */}
            {activeTab === 'admin' && (
              <AdminDashboard
                products={products}
                onSelectProduct={(id) => handleSelectProduct(id)}
                onVerifyQrCode={handleVerifyQrCode}
              />
            )}

            {/* View: Automated Test Suite */}
            {activeTab === 'tests' && <TestSuiteView />}

            {/* View: SIH Judge Demo Flow Guide */}
            {activeTab === 'judge_guide' && (
              <JudgeDemoGuide
                products={products}
                onSelectProduct={(id) => handleSelectProduct(id)}
                onNavigateToTab={(tab) => setActiveTab(tab)}
                onVerifyQrCode={(code, session) => {
                  setDefaultQrCode(code);
                  setActiveTab('qr_verify');
                }}
                onTriggerBatchRecall={handleTriggerBatchRecall}
                onResetDemo={handleResetDemo}
              />
            )}

            {/* View: Documentation */}
            {activeTab === 'docs' && <DocumentationView />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Label Truth Engine</span>
            <span>• Smart India Hackathon (SIH) MVP</span>
          </div>
          <div className="text-slate-400">
            FoSCoS Curated Demo Registry • Explainable Transparency Rule Engine
          </div>
        </div>
      </footer>
    </div>
  );
}
