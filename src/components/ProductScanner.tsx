import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Edit3,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  FileText,
  RefreshCw,
  QrCode,
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Product } from '../types';
import { api } from '../lib/api';

interface ProductScannerProps {
  onSelectProduct: (product: Product) => void;
  onAnalyzeCustomProduct: (product: Product) => void;
  onVerifyQrCode: (code: string) => void;
  products: Product[];
}

export const ProductScanner: React.FC<ProductScannerProps> = ({
  onSelectProduct,
  onAnalyzeCustomProduct,
  onVerifyQrCode,
  products,
}) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'camera_qr' | 'upload_ocr' | 'manual'>('demo');
  const [ocrLoading, setOcrLoading] = useState<boolean>(false);
  const [ocrImagePreview, setOcrImagePreview] = useState<string | null>(null);
  const [ocrExtractedData, setOcrExtractedData] = useState<Partial<Product> | null>(null);
  const [manualCodeInput, setManualCodeInput] = useState<string>('');

  // Editable Form State for OCR / Manual Input
  const [editForm, setEditForm] = useState<{
    product_name: string;
    brand: string;
    category: string;
    serving_size_g: number;
    package_size_g: number;
    sugar_per_serving_g: number;
    sugar_per_100g_g: number;
    salt_per_100g_g: number;
    fat_per_100g_g: number;
    saturated_fat_per_100g_g: number;
    protein_per_100g_g: number;
    ingredients_str: string;
    claims_str: string;
    fssai_license_number: string;
  }>({
    product_name: '',
    brand: '',
    category: 'Biscuits',
    serving_size_g: 25,
    package_size_g: 100,
    sugar_per_serving_g: 8,
    sugar_per_100g_g: 32,
    salt_per_100g_g: 0.5,
    fat_per_100g_g: 15,
    saturated_fat_per_100g_g: 6,
    protein_per_100g_g: 5,
    ingredients_str: 'Refined wheat flour, sugar, glucose syrup, hydrogenated vegetable oil',
    claims_str: 'No Artificial Colours, 100% Natural',
    fssai_license_number: '10014022002891',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize html5-qrcode scanner when on camera tab
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (activeTab === 'camera_qr') {
      const qrRegionId = 'qr-camera-stream-container';
      try {
        scanner = new Html5QrcodeScanner(
          qrRegionId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
          },
          false
        );

        scanner.render(
          (decodedText) => {
            console.log('QR Scanned:', decodedText);
            if (scanner) {
              scanner.clear().catch(console.error);
            }
            onVerifyQrCode(decodedText);
          },
          (error) => {
            // benign background scanning ticks
          }
        );
      } catch (e) {
        console.warn('Could not initialize live QR scanner:', e);
      }
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [activeTab]);

  // Handle OCR Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setOcrImagePreview(base64Data);
      setOcrLoading(true);

      try {
        const extracted = await api.extractOcr(base64Data, file.type);
        setOcrExtractedData(extracted);

        // Populate editable form
        setEditForm({
          product_name: extracted.product_name || 'Scanned Product',
          brand: extracted.brand || 'Detected Brand',
          category: extracted.category || 'Biscuits',
          serving_size_g: extracted.nutrition?.serving_size_g || 25,
          package_size_g: extracted.nutrition?.package_size_g || 100,
          sugar_per_serving_g: extracted.nutrition?.sugar_per_serving_g || 8,
          sugar_per_100g_g: extracted.nutrition?.sugar_per_100g_g || 32,
          salt_per_100g_g: extracted.nutrition?.salt_per_100g_g || 0.5,
          fat_per_100g_g: extracted.nutrition?.fat_per_100g_g || 15,
          saturated_fat_per_100g_g: extracted.nutrition?.saturated_fat_per_100g_g || 6,
          protein_per_100g_g: extracted.nutrition?.protein_per_100g_g || 5,
          ingredients_str: extracted.ingredients?.join(', ') || '',
          claims_str: extracted.claims?.join(', ') || '',
          fssai_license_number: extracted.fssai_license_number || '10014022002891',
        });
      } catch (err: any) {
        console.error('OCR Error:', err);
      } finally {
        setOcrLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRunAnalysisFromForm = () => {
    const customProduct: Product = {
      product_id: `CUSTOM-${Date.now()}`,
      product_name: editForm.product_name || 'Scanned Packaged Food',
      brand: editForm.brand || 'Brand',
      category: editForm.category || 'Snack',
      nutrition: {
        serving_size_g: Number(editForm.serving_size_g) || 25,
        package_size_g: Number(editForm.package_size_g) || 100,
        sugar_per_serving_g: Number(editForm.sugar_per_serving_g) || 0,
        sugar_per_100g_g: Number(editForm.sugar_per_100g_g) || 0,
        salt_per_100g_g: Number(editForm.salt_per_100g_g) || 0,
        fat_per_100g_g: Number(editForm.fat_per_100g_g) || 0,
        saturated_fat_per_100g_g: Number(editForm.saturated_fat_per_100g_g) || 0,
        protein_per_100g_g: Number(editForm.protein_per_100g_g) || 0,
      },
      ingredients: editForm.ingredients_str
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean),
      claims: editForm.claims_str
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      fssai_license_number: editForm.fssai_license_number || '10014022002891',
      batch_number: 'DEMO-BATCH-001',
      manufacturing_date: '2026-07-01',
      expiry_date: '2027-04-01',
    };

    onAnalyzeCustomProduct(customProduct);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Explainable Food Label Verification & Deception Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Understand the label. Verify the product.
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Scan a food label to expose disguised serving sizes, hidden sugar aliases, deceptive front-of-pack claims, and verify serialized QR batch authenticity.
        </p>
      </div>

      {/* Primary Action Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-xs">
          <button
            id="tab-demo-products"
            onClick={() => setActiveTab('demo')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'demo'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Demo Products
          </button>
          <button
            id="tab-camera-qr"
            onClick={() => setActiveTab('camera_qr')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'camera_qr'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            Scan QR Code
          </button>
          <button
            id="tab-upload-ocr"
            onClick={() => setActiveTab('upload_ocr')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'upload_ocr'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            Upload Label (OCR)
          </button>
          <button
            id="tab-manual-input"
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'manual'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-4 h-4 text-emerald-600" />
            Manual Input
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: DEMO PRODUCTS */}
      {activeTab === 'demo' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Curated Packaged Food Demo Dataset
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Click any product to trigger the Truth Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              const sugarWhole = Math.round(((p.nutrition.sugar_per_100g_g * p.nutrition.package_size_g) / 100) * 10) / 10;
              const servings = Math.round((p.nutrition.package_size_g / p.nutrition.serving_size_g) * 10) / 10;

              return (
                <div
                  key={p.product_id}
                  id={`card-product-${p.product_id}`}
                  onClick={() => onSelectProduct(p)}
                  className="bg-white border border-slate-200 hover:border-emerald-500/80 rounded-2xl p-5 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base mt-1 group-hover:text-emerald-700 transition-colors">
                          {p.product_name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{p.brand}</p>
                      </div>
                      <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {p.product_id}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>

                    {/* Claims badges */}
                    {p.claims.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {p.claims.map((claim, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200"
                          >
                            "{claim}"
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quick Metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Servings</div>
                        <div className="font-bold text-slate-800">{servings}x</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Sugar/Serv</div>
                        <div className="font-bold text-slate-800">{p.nutrition.sugar_per_serving_g}g</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Pack Sugar</div>
                        <div className="font-bold text-amber-700">{sugarWhole}g</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect Truth Findings</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: CAMERA QR SCANNER */}
      {activeTab === 'camera_qr' && (
        <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-bold text-slate-900 text-lg">Live QR Code Scanner</h3>
            <p className="text-xs text-slate-500">
              Point your camera at a serialized package QR code to verify authenticity, duplicates, and batch recall status.
            </p>
          </div>

          {/* Video Stream Container */}
          <div className="bg-slate-950 rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center relative">
            <div id="qr-camera-stream-container" className="w-full"></div>
          </div>

          {/* Fallback Manual Code Input */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700">Or Enter Unit Code Manually:</label>
            <div className="flex gap-2">
              <input
                id="input-manual-unit-code"
                type="text"
                value={manualCodeInput}
                onChange={(e) => setManualCodeInput(e.target.value)}
                placeholder="e.g. LTE-UNIT-001-A9F2"
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                id="btn-verify-manual-code"
                onClick={() => {
                  if (manualCodeInput) onVerifyQrCode(manualCodeInput);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: UPLOAD LABEL (OCR) */}
      {activeTab === 'upload_ocr' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Upload Food Packaging / Nutrition Label</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PNG, JPG, or JPEG photos of ingredients list, nutrition table, or front claims.
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Select Image File
              </button>
            </div>
          </div>

          {/* OCR Processing & Review Form */}
          {ocrLoading && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3">
              <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-800">
                Extracting structured label fields using Gemini OCR...
              </p>
              <p className="text-xs text-slate-500">
                Detecting ingredients, serving portions, sugar quantities, and marketing claims.
              </p>
            </div>
          )}

          {/* Review & Edit OCR Extracted Form */}
          {ocrExtractedData && !ocrLoading && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Review & Edit Extracted Label Data
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verify OCR results below before triggering the Truth Engine.
                  </p>
                </div>
                {ocrImagePreview && (
                  <img
                    src={ocrImagePreview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={editForm.product_name}
                    onChange={(e) => setEditForm({ ...editForm, product_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editForm.brand}
                    onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Serving Size (g/ml)</label>
                  <input
                    type="number"
                    value={editForm.serving_size_g}
                    onChange={(e) =>
                      setEditForm({ ...editForm, serving_size_g: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Package Size (g/ml)</label>
                  <input
                    type="number"
                    value={editForm.package_size_g}
                    onChange={(e) =>
                      setEditForm({ ...editForm, package_size_g: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sugar per Serving (g)</label>
                  <input
                    type="number"
                    value={editForm.sugar_per_serving_g}
                    onChange={(e) =>
                      setEditForm({ ...editForm, sugar_per_serving_g: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sugar per 100g (g)</label>
                  <input
                    type="number"
                    value={editForm.sugar_per_100g_g}
                    onChange={(e) =>
                      setEditForm({ ...editForm, sugar_per_100g_g: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ingredients List (comma separated)
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.ingredients_str}
                    onChange={(e) => setEditForm({ ...editForm, ingredients_str: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Marketing Claims on Pack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.claims_str}
                    onChange={(e) => setEditForm({ ...editForm, claims_str: e.target.value })}
                    placeholder="e.g. No Added Sugar, 100% Natural, High Protein"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <button
                id="btn-analyze-ocr-product"
                onClick={handleRunAnalysisFromForm}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Analyze With Truth Engine
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: MANUAL INPUT */}
      {activeTab === 'manual' && (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Enter Food Label Details Manually</h3>
            <p className="text-xs text-slate-500">
              Input custom label values to test serving-size calculations and deception detection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
              <input
                type="text"
                value={editForm.product_name}
                onChange={(e) => setEditForm({ ...editForm, product_name: e.target.value })}
                placeholder="e.g. Crunchy Choco Cookies"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
              <input
                type="text"
                value={editForm.brand}
                onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                placeholder="e.g. Organic Foods"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Serving Size (g/ml)</label>
              <input
                type="number"
                value={editForm.serving_size_g}
                onChange={(e) => setEditForm({ ...editForm, serving_size_g: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Package Size (g/ml)</label>
              <input
                type="number"
                value={editForm.package_size_g}
                onChange={(e) => setEditForm({ ...editForm, package_size_g: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sugar per Serving (g)</label>
              <input
                type="number"
                value={editForm.sugar_per_serving_g}
                onChange={(e) =>
                  setEditForm({ ...editForm, sugar_per_serving_g: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sugar per 100g (g)</label>
              <input
                type="number"
                value={editForm.sugar_per_100g_g}
                onChange={(e) =>
                  setEditForm({ ...editForm, sugar_per_100g_g: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ingredients List (comma separated)
              </label>
              <textarea
                rows={2}
                value={editForm.ingredients_str}
                onChange={(e) => setEditForm({ ...editForm, ingredients_str: e.target.value })}
                placeholder="wheat flour, glucose syrup, invert sugar, palm oil"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Marketing Claims (comma separated)
              </label>
              <input
                type="text"
                value={editForm.claims_str}
                onChange={(e) => setEditForm({ ...editForm, claims_str: e.target.value })}
                placeholder="e.g. No Added Sugar, 100% Natural"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <button
            id="btn-analyze-manual-product"
            onClick={handleRunAnalysisFromForm}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Analyze With Truth Engine
          </button>
        </div>
      )}
    </div>
  );
};
