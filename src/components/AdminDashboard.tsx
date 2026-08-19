import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
  Plus,
  QrCode,
  RotateCcw,
  ShieldAlert,
  Activity,
  Package,
  Layers,
} from 'lucide-react';
import { Product, ProductBatch, SerializedUnit, ScanEvent } from '../types';
import { api } from '../lib/api';

interface AdminDashboardProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
  onVerifyQrCode: (code: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onSelectProduct,
  onVerifyQrCode,
}) => {
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [units, setUnits] = useState<SerializedUnit[]>([]);
  const [scanEvents, setScanEvents] = useState<ScanEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New Unit Form State
  const [selectedProductForUnit, setSelectedProductForUnit] = useState<string>(
    products[0]?.product_id || 'DEMO-P001'
  );
  const [selectedBatchForUnit, setSelectedBatchForUnit] = useState<string>('DEMO-BATCH-001');

  // Recall modal / state
  const [recallModalBatch, setRecallModalBatch] = useState<ProductBatch | null>(null);
  const [recallReasonInput, setRecallReasonInput] = useState<string>(
    'Quality audit: Ingredient declaration discrepancy & seal audit'
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [batchesRes, unitsRes, eventsRes] = await Promise.all([
        api.getBatches(),
        api.getUnits(),
        api.getScanEvents(),
      ]);
      setBatches(batchesRes);
      setUnits(unitsRes);
      setScanEvents(eventsRes);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleBatchRecall = async (batch: ProductBatch) => {
    const nextStatus = batch.status === 'RECALLED' ? 'ACTIVE' : 'RECALLED';
    try {
      await api.setBatchStatus(
        batch.batch_id,
        nextStatus,
        nextStatus === 'RECALLED' ? recallReasonInput : undefined
      );
      setRecallModalBatch(null);
      await loadData();
    } catch (err) {
      console.error('Batch status update failed:', err);
    }
  };

  const handleCreateNewUnit = async () => {
    try {
      await api.createUnit(selectedProductForUnit, selectedBatchForUnit);
      await loadData();
    } catch (err) {
      console.error('Failed to create unit:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Admin & Traceability Recall Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time batch status toggles, serialized unit inventory, and live scan audit logging.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Refresh Live Data
        </button>
      </div>

      {/* SECTION 1: BATCH MANAGEMENT & LIVE RECALL CONTROLS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Production Batches & Instant Recall Control
            </h2>
            <p className="text-xs text-slate-500">
              Triggering a recall immediately cascades to all serialized units under that batch.
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {batches.length} Batches
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {batches.map((batch) => {
            const isRecalled = batch.status === 'RECALLED';
            return (
              <div
                key={batch.batch_id}
                id={`card-admin-batch-${batch.batch_id}`}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isRecalled
                    ? 'bg-rose-50/70 border-rose-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {batch.batch_id}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                        {batch.product_name}
                      </h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isRecalled
                          ? 'bg-rose-600 text-white'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {batch.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div>
                      <span className="text-slate-400">Mfg Date: </span>
                      {batch.manufacturing_date}
                    </div>
                    <div>
                      <span className="text-slate-400">Expiry Date: </span>
                      {batch.expiry_date}
                    </div>
                    <div>
                      <span className="text-slate-400">Total Units: </span>
                      <strong className="text-slate-800">{batch.total_units} units</strong>
                    </div>
                  </div>

                  {isRecalled && (
                    <div className="bg-white/80 p-2.5 rounded-lg border border-rose-200 text-xs text-rose-900 space-y-0.5">
                      <div className="font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Recall Notice:
                      </div>
                      <p className="text-[11px] leading-tight">{batch.recall_reason}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100">
                  <button
                    id={`btn-toggle-recall-${batch.batch_id}`}
                    onClick={() => {
                      if (isRecalled) {
                        handleToggleBatchRecall(batch);
                      } else {
                        setRecallModalBatch(batch);
                      }
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs ${
                      isRecalled
                        ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                        : 'bg-rose-600 hover:bg-rose-700 text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {isRecalled ? 'Reactivate Batch to ACTIVE' : 'Trigger Live Recall'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECALL REASON MODAL */}
      {recallModalBatch && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 text-lg">Confirm Live Batch Recall</h3>
            </div>
            <p className="text-xs text-slate-600">
              You are about to issue a regulatory recall for Batch{' '}
              <strong>{recallModalBatch.batch_id}</strong> ({recallModalBatch.product_name}). All subsequent customer scans will be warned in red immediately.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Recall Reason Directive:</label>
              <textarea
                rows={3}
                value={recallReasonInput}
                onChange={(e) => setRecallReasonInput(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRecallModalBatch(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleBatchRecall(recallModalBatch)}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Issue Live Recall
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SERIALIZED UNITS REGISTRY & GENERATOR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              Serialized Units Registry (QR Codes)
            </h2>
            <p className="text-xs text-slate-500">
              Each unit possesses a unique tracking code assigned at packaging.
            </p>
          </div>

          {/* Quick Generator */}
          <div className="flex items-center gap-2">
            <select
              value={selectedProductForUnit}
              onChange={(e) => setSelectedProductForUnit(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
            >
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.product_name}
                </option>
              ))}
            </select>

            <select
              value={selectedBatchForUnit}
              onChange={(e) => setSelectedBatchForUnit(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
            >
              {batches.map((b) => (
                <option key={b.batch_id} value={b.batch_id}>
                  {b.batch_id}
                </option>
              ))}
            </select>

            <button
              id="btn-generate-serialized-unit"
              onClick={handleCreateNewUnit}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Mint Unit
            </button>
          </div>
        </div>

        {/* Units Table */}
        <div className="overflow-x-auto max-h-[300px]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2 px-3 font-bold">Unit ID</th>
                <th className="py-2 px-3 font-bold">Serialized QR Code</th>
                <th className="py-2 px-3 font-bold">Batch ID</th>
                <th className="py-2 px-3 font-bold">Status</th>
                <th className="py-2 px-3 font-bold">Total Scans</th>
                <th className="py-2 px-3 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {units.map((u) => (
                <tr key={u.unique_code} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold">{u.unit_id}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-800 font-semibold">
                    {u.unique_code}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{u.batch_id}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'RECALLED'
                          ? 'bg-rose-100 text-rose-800'
                          : u.status === 'FLAGGED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold">{u.scan_count}</td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => onVerifyQrCode(u.unique_code)}
                      className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 flex items-center gap-1"
                    >
                      <QrCode className="w-3 h-3 text-emerald-600" />
                      Test Scan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: SCAN AUDIT EVENTS LOG */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            Live Scan Audit Log & Anomaly Stream
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {scanEvents.length} Recorded Events
          </span>
        </div>

        <div className="overflow-x-auto max-h-[300px]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2 px-3 font-bold">Timestamp</th>
                <th className="py-2 px-3 font-bold">Unit Code</th>
                <th className="py-2 px-3 font-bold">Session / Device</th>
                <th className="py-2 px-3 font-bold">Result Status</th>
                <th className="py-2 px-3 font-bold">Risk Level</th>
                <th className="py-2 px-3 font-bold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {scanEvents.map((evt) => (
                <tr key={evt.event_id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-slate-500 font-mono">
                    {new Date(evt.scanned_at).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                    {evt.unit_code}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500 truncate max-w-[120px]">
                    {evt.session_id}
                  </td>
                  <td className="py-2.5 px-3 font-semibold">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        evt.result_status === 'FIRST_SCAN_VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : evt.result_status === 'REPEAT_SCAN_SAME_SESSION'
                          ? 'bg-blue-100 text-blue-800'
                          : evt.result_status === 'RECALLED_BATCH'
                          ? 'bg-rose-100 text-rose-800 font-bold'
                          : 'bg-amber-100 text-amber-800 font-bold'
                      }`}
                    >
                      {evt.result_status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-bold uppercase text-[10px] ${
                        evt.risk_level === 'high'
                          ? 'text-rose-600'
                          : evt.risk_level === 'medium'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {evt.risk_level}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-[200px] truncate">
                    {evt.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
