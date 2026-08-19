import React, { useState, useEffect } from 'react';
import {
  QrCode,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  Sparkles,
  Search,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import QRCode from 'qrcode';
import { QRVerificationResult, SerializedUnit, ProductBatch } from '../types';
import { api, getSessionId } from '../lib/api';

interface QRVerifierProps {
  onSelectProduct: (productId: string) => void;
  defaultCode?: string;
}

export const QRVerifier: React.FC<QRVerifierProps> = ({ onSelectProduct, defaultCode }) => {
  const [inputCode, setInputCode] = useState<string>(defaultCode || 'LTE-UNIT-001-A9F2');
  const [result, setResult] = useState<QRVerificationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState<string>('');
  const [customSessionId, setCustomSessionId] = useState<string>('');

  const currentSessionId = getSessionId();

  // Generate visual QR code whenever inputCode changes
  useEffect(() => {
    if (inputCode) {
      QRCode.toDataURL(inputCode, { width: 220, margin: 2 })
        .then(setGeneratedQrDataUrl)
        .catch(console.error);
    }
  }, [inputCode]);

  useEffect(() => {
    if (defaultCode) {
      handleVerify(defaultCode);
    }
  }, [defaultCode]);

  const handleVerify = async (codeToTest?: string, sessionToUse?: string) => {
    const targetCode = codeToTest || inputCode;
    if (!targetCode) return;

    setLoading(true);
    try {
      const res = await api.verifyQr(targetCode, sessionToUse || (customSessionId ? customSessionId : undefined));
      setResult(res);
    } catch (err) {
      console.error('QR verification failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              VERIFIED — FIRST RECORDED SCAN
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">Authenticity & Batch Status Validated</p>
          </div>
        );
      case 'ALREADY_VERIFIED':
        return (
          <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              ALREADY VERIFIED (SAME SESSION)
            </div>
            <p className="text-xs text-blue-100 mt-0.5">Repeat scan by current user device</p>
          </div>
        );
      case 'POSSIBLE_DUPLICATE':
        return (
          <div className="bg-amber-600 text-white px-4 py-2 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              POSSIBLE DUPLICATE (SUSPICIOUS CODE REUSE)
            </div>
            <p className="text-xs text-amber-100 mt-0.5">Code previously scanned on different device/session</p>
          </div>
        );
      case 'RECALLED_BATCH':
        return (
          <div className="bg-rose-600 text-white px-4 py-2 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
              <AlertOctagon className="w-5 h-5" />
              RECALLED BATCH — DO NOT CONSUME
            </div>
            <p className="text-xs text-rose-100 mt-0.5">Product unit belongs to an active regulatory recall</p>
          </div>
        );
      case 'INVALID_CODE':
      default:
        return (
          <div className="bg-slate-700 text-white px-4 py-2 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
              <HelpCircle className="w-5 h-5" />
              UNRECOGNIZED QR CODE
            </div>
            <p className="text-xs text-slate-300 mt-0.5">Code does not match registered unit registry</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-600" />
            Serialized QR Authenticity & Anti-Duplication Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Proof-of-concept unit-level serialization verifying first scans, customer repeat scans, suspicious multi-device duplication, and real-time batch recalls.
          </p>
        </div>

        {/* Quick Test Scenarios for Judges */}
        <div className="pt-4 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Quick Judge Demo Scenarios (1-Click Test):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <button
              id="btn-test-case-a"
              onClick={() => {
                setInputCode('LTE-UNIT-001-A9F2');
                handleVerify('LTE-UNIT-001-A9F2', 'judge-session-1');
              }}
              className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition-colors"
            >
              <div className="font-bold text-emerald-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Case A: First Scan
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5">Unit 001 (Brand new)</p>
            </button>

            <button
              id="btn-test-case-b"
              onClick={() => {
                setInputCode('LTE-UNIT-002-B8E3');
                handleVerify('LTE-UNIT-002-B8E3', 'demo-session-judge-1');
              }}
              className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-left transition-colors"
            >
              <div className="font-bold text-blue-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Case B: Repeat Scan
              </div>
              <p className="text-[11px] text-blue-700 mt-0.5">Unit 002 (Same session)</p>
            </button>

            <button
              id="btn-test-case-c"
              onClick={() => {
                setInputCode('LTE-UNIT-003-C7D4');
                handleVerify('LTE-UNIT-003-C7D4', 'divergent-device-session-99');
              }}
              className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-colors"
            >
              <div className="font-bold text-amber-900 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Case C: Duplicate Reuse
              </div>
              <p className="text-[11px] text-amber-700 mt-0.5">Unit 003 (Different session)</p>
            </button>

            <button
              id="btn-test-case-recall"
              onClick={() => {
                setInputCode('LTE-UNIT-010-J0G1');
                handleVerify('LTE-UNIT-010-J0G1');
              }}
              className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-left transition-colors"
            >
              <div className="font-bold text-rose-900 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" /> Case D: Recalled Batch
              </div>
              <p className="text-[11px] text-rose-700 mt-0.5">Unit 010 (Batch 002 Recalled)</p>
            </button>
          </div>
        </div>
      </div>

      {/* Main Verification Input & Live Visual QR Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Input & Trigger */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Serialized Unit Code to Verify:
            </label>
            <div className="flex gap-2">
              <input
                id="input-qr-code-to-verify"
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter LTE-UNIT-xxx..."
                className="flex-1 px-4 py-2.5 text-sm font-mono font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                id="btn-trigger-qr-verify"
                disabled={loading}
                onClick={() => handleVerify()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs flex items-center gap-2 disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Checking...' : 'Verify Code'}
              </button>
            </div>
          </div>

          {/* Verification Result Display */}
          {result && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {getStatusBadge(result.status)}

              {/* Explainability Block */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm">{result.explainability.why}</div>
                <div className="text-slate-600">
                  <strong>Evidence Log: </strong>
                  {result.explainability.evidence}
                </div>
                <div className="text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
                  <strong>Consumer Recommendation: </strong>
                  {result.explainability.recommendation}
                </div>
              </div>

              {/* Linked Product & Batch Info */}
              {result.product && result.batch && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {result.product.product_name}
                      </h4>
                      <p className="text-xs text-slate-500">Brand: {result.product.brand}</p>
                    </div>
                    <button
                      onClick={() => onSelectProduct(result.product!.product_id)}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors"
                    >
                      <span>View Truth Report</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Batch ID</div>
                      <div className="font-bold text-slate-800">{result.batch.batch_id}</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Batch Status</div>
                      <div
                        className={`font-bold ${
                          result.batch.status === 'RECALLED' ? 'text-rose-600' : 'text-emerald-700'
                        }`}
                      >
                        {result.batch.status}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Total Scans</div>
                      <div className="font-bold text-slate-800">{result.unit?.scan_count || 1}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Live Printable QR Display */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 text-center shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">Real-time Scannable QR</h3>
            <p className="text-xs text-slate-500">Scan this QR directly using phone camera</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-center">
            {generatedQrDataUrl ? (
              <img
                src={generatedQrDataUrl}
                alt="Live Generated QR"
                className="w-44 h-44 object-contain shadow-xs rounded-lg bg-white p-2 border border-slate-200"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-slate-400 text-xs">
                Generating QR...
              </div>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-500 truncate bg-slate-100 py-1.5 px-2 rounded-lg">
            {inputCode}
          </div>
        </div>
      </div>
    </div>
  );
};
