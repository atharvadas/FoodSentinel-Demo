import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldCheck,
  Search,
  Columns,
  QrCode,
  SlidersHorizontal,
  FileCheck,
} from 'lucide-react';
import { Product } from '../types';

interface JudgeDemoGuideProps {
  onSelectProduct: (productId: string) => void;
  onNavigateToTab: (tab: any) => void;
  onVerifyQrCode: (code: string, customSession?: string) => void;
  onTriggerBatchRecall: (batchId: string, status: 'ACTIVE' | 'RECALLED', reason?: string) => void;
  onResetDemo: () => void;
  products: Product[];
}

export const JudgeDemoGuide: React.FC<JudgeDemoGuideProps> = ({
  onSelectProduct,
  onNavigateToTab,
  onVerifyQrCode,
  onTriggerBatchRecall,
  onResetDemo,
  products,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      title: 'Step 1: Open Application & Architecture Overview',
      desc: 'Introduce the core problem: Misleading front-of-pack food claims, disguised serving sizes, hidden sugar aliases, and lack of verifiable unit-level traceability.',
      actionLabel: 'Go to Scanner Dashboard',
      actionIcon: Search,
      onExecute: () => onNavigateToTab('scanner'),
      tag: 'Introduction',
    },
    {
      step: 2,
      title: 'Step 2 & 3: Select/Scan Demo Product A',
      desc: 'Select "ChocoCrunch Filled Biscuits" (or upload a label photo) to inspect structured nutritional facts and ingredient lists.',
      actionLabel: 'Select ChocoCrunch Biscuits (DEMO-P001)',
      actionIcon: FileCheck,
      onExecute: () => onSelectProduct('DEMO-P001'),
      tag: 'Data Extraction',
    },
    {
      step: 4,
      title: 'Step 4 & 5: Explainable Serving Size Analysis',
      desc: 'Review Rule SERVING_SIZE_001. Show how a 100g compact pack contains 4 servings (25g each), exposing that single-sitting consumption quadruples sugar intake.',
      actionLabel: 'Inspect Serving Size Breakdown',
      actionIcon: ArrowRight,
      onExecute: () => onSelectProduct('DEMO-P001'),
      tag: 'Truth Engine',
    },
    {
      step: 6,
      title: 'Step 6: Dedicated Sugar Transparency Panel',
      desc: 'Explain whole-package calculation: 9g sugar/serving × 4 servings = 36g total sugar (144% of the WHO 25g/day adult guideline).',
      actionLabel: 'View Sugar Transparency Panel',
      actionIcon: ArrowRight,
      onExecute: () => onSelectProduct('DEMO-P001'),
      tag: 'Sugar Transparency',
    },
    {
      step: 7,
      title: 'Step 7: Ingredient Alias Detection',
      desc: 'Expose multiple disguised sugar derivatives in ChocoCrunch (glucose syrup, invert syrup) and industrial hydrogenated vegetable oil.',
      actionLabel: 'Highlight Ingredient Aliases',
      actionIcon: ArrowRight,
      onExecute: () => onSelectProduct('DEMO-P001'),
      tag: 'Ingredient Aliases',
    },
    {
      step: 8,
      title: 'Step 8: Marketing Claim Scrutiny',
      desc: 'Switch to "FitMorning Honey & Nut Granola" (DEMO-P002) claiming "No Added Refined Sugar" to show how concentrated date syrup and juice concentrates trigger scrutiny.',
      actionLabel: 'Analyze FitMorning Granola (DEMO-P002)',
      actionIcon: AlertTriangle,
      onExecute: () => onSelectProduct('DEMO-P002'),
      tag: 'Claim Analysis',
    },
    {
      step: 9,
      title: 'Step 9: Side-by-Side Product Comparison',
      desc: 'Compare ChocoCrunch Biscuits (P001) with ProPeak Protein Bar (P005) or Granola (P002) to demonstrate normalized per-100g metric comparisons and unbiased takeaways.',
      actionLabel: 'Open Product Comparison Tool',
      actionIcon: Columns,
      onExecute: () => onNavigateToTab('compare'),
      tag: 'Comparison',
    },
    {
      step: 10,
      title: 'Step 10: QR Case A — First Recorded Scan (VERIFIED)',
      desc: 'Scan brand new pristine unit "LTE-UNIT-001-A9F2". System validates digital certificate, records initial timestamp, and issues VERIFIED badge.',
      actionLabel: 'Scan Unit 001 (First Scan)',
      actionIcon: QrCode,
      onExecute: () => {
        onNavigateToTab('qr_verify');
        onVerifyQrCode('LTE-UNIT-001-A9F2', 'judge-session-1');
      },
      tag: 'QR Authenticity',
    },
    {
      step: 11,
      title: 'Step 11: QR Case B — Repeat Scan Same Session (ALREADY VERIFIED)',
      desc: 'Scan "LTE-UNIT-001-A9F2" again from the same session/device. Recognized as a harmless customer re-check without falsely claiming counterfeit.',
      actionLabel: 'Re-scan Unit 001 (Same Session)',
      actionIcon: CheckCircle2,
      onExecute: () => {
        onNavigateToTab('qr_verify');
        onVerifyQrCode('LTE-UNIT-001-A9F2', 'judge-session-1');
      },
      tag: 'QR Authenticity',
    },
    {
      step: 12,
      title: 'Step 12: QR Case C — Suspicious Duplicate Reuse (POSSIBLE DUPLICATE)',
      desc: 'Scan "LTE-UNIT-003-C7D4" or simulate a scan from an unauthorized second device/session. System flags suspicious code duplication.',
      actionLabel: 'Scan Unit 003 (Duplicate Reuse)',
      actionIcon: AlertTriangle,
      onExecute: () => {
        onNavigateToTab('qr_verify');
        onVerifyQrCode('LTE-UNIT-003-C7D4', 'external-session-divergent-device');
      },
      tag: 'Anti-Duplication',
    },
    {
      step: 13,
      title: 'Step 13: Open Admin & Batch Recall Center',
      desc: 'Demonstrate backend administrative control: View production batches, units registry, and real-time audit logs.',
      actionLabel: 'Open Admin Dashboard',
      actionIcon: SlidersHorizontal,
      onExecute: () => onNavigateToTab('admin'),
      tag: 'Traceability',
    },
    {
      step: 14,
      title: 'Step 14: Trigger Live Batch Recall',
      desc: 'Change DEMO-BATCH-001 status from ACTIVE to RECALLED due to simulated quality audit.',
      actionLabel: 'Recall DEMO-BATCH-001 Now',
      actionIcon: AlertTriangle,
      onExecute: () => {
        onTriggerBatchRecall('DEMO-BATCH-001', 'RECALLED', 'Simulated SIH Live Demo: Allergen labeling mismatch');
        onNavigateToTab('admin');
      },
      tag: 'Recall Control',
    },
    {
      step: 15,
      title: 'Step 15: Scan Unit Under Recalled Batch (RECALLED BATCH)',
      desc: 'Scan Unit 001 or Unit 005 which belongs to Batch 001. Watch the consumer warning appear instantly in red with recall directives!',
      actionLabel: 'Scan Recalled Unit (LTE-UNIT-001-A9F2)',
      actionIcon: ShieldCheck,
      onExecute: () => {
        onNavigateToTab('qr_verify');
        onVerifyQrCode('LTE-UNIT-001-A9F2', 'judge-session-1');
      },
      tag: 'Consumer Protection',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-amber-500 text-white rounded-lg">
                <Sparkles className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-900">
                SIH Judge Live Demo Workflow Guide
              </h1>
            </div>
            <p className="text-sm text-slate-600">
              Interactive 15-step demonstration flow tailored for Smart India Hackathon jury evaluation.
            </p>
          </div>

          <button
            onClick={onResetDemo}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Demo State for Judges
          </button>
        </div>
      </div>

      {/* Step Navigator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left column: Step list */}
        <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 space-y-2 max-h-[700px] overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            Demo Sequence (15 Steps)
          </div>
          {steps.map((s) => {
            const isCurrent = currentStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                  isCurrent
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-200 font-semibold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isCurrent ? 'bg-white text-amber-600' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {s.step}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm line-clamp-1">{s.title.split(':')[1] || s.title}</div>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isCurrent ? 'bg-amber-600 text-amber-100' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {s.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right column: Active Step Details & 1-Click Trigger */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          {(() => {
            const active = steps.find((s) => s.step === currentStep) || steps[0];
            const Icon = active.actionIcon;

            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                      Step {active.step} of {steps.length}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{active.tag}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentStep === 1}
                      onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-30"
                    >
                      Previous
                    </button>
                    <button
                      disabled={currentStep === steps.length}
                      onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
                      className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-slate-900">{active.title}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {active.desc}
                  </p>
                </div>

                {/* Judge talking points */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <ShieldCheck className="w-4 h-4" /> SIH Evaluation Defense Point:
                  </span>
                  <p>
                    {active.step <= 4 &&
                      'Highlight: Real explainable deterministic rule engine (no black-box AI hallucinations).'}
                    {active.step >= 5 &&
                      active.step <= 8 &&
                      'Highlight: Serving-size normalizer exposing whole-pack sugar multiplied against WHO guidelines.'}
                    {active.step === 9 &&
                      'Highlight: Objective per-100g delta comparison without subjective or arbitrary health rankings.'}
                    {active.step >= 10 &&
                      active.step <= 12 &&
                      'Highlight: Unit-level serialization detecting code duplication without over-promising impossible cryptographic guarantees.'}
                    {active.step >= 13 &&
                      'Highlight: Real-time batch state propagation demonstrating recall traceability from manufacturer to consumer scan.'}
                  </p>
                </div>

                {/* Big Action Button */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    id={`btn-execute-step-${active.step}`}
                    onClick={() => {
                      active.onExecute();
                    }}
                    className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-slate-200 flex items-center justify-center gap-2 group"
                  >
                    <Icon className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Run {active.actionLabel}</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
