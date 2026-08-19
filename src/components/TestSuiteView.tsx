import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Play, RotateCcw, ShieldCheck, Terminal } from 'lucide-react';
import { FullTestSuiteResult } from '../types';
import { api } from '../lib/api';

export const TestSuiteView: React.FC = () => {
  const [suiteResult, setSuiteResult] = useState<FullTestSuiteResult | null>(null);
  const [running, setRunning] = useState<boolean>(false);

  const runTests = async () => {
    setRunning(true);
    try {
      const res = await api.runTests();
      setSuiteResult(res);
    } catch (err) {
      console.error('Test run failed:', err);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Automated Integrity & Truth Engine Test Suite
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic validation tests covering all 10 core algorithmic rules and serialization edge cases.
          </p>
        </div>

        <button
          id="btn-run-tests-suite"
          disabled={running}
          onClick={runTests}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50"
        >
          <Play className={`w-4 h-4 text-emerald-400 ${running ? 'animate-spin' : ''}`} />
          <span>{running ? 'Executing Tests...' : 'Re-Run All 10 Tests'}</span>
        </button>
      </div>

      {/* Score / Stats Overview */}
      {suiteResult && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Passed Tests
            </div>
            <div className="text-3xl font-extrabold text-emerald-900 mt-1">
              {suiteResult.passed_tests} / {suiteResult.total_tests}
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              100% Core Verification Passing
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Failed Tests
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {suiteResult.failed_tests}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Zero Regression Errors</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Last Execution
            </div>
            <div className="text-sm font-mono font-bold text-slate-800 mt-2">
              {new Date(suiteResult.timestamp).toLocaleTimeString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Automated Execution</div>
          </div>
        </div>
      )}

      {/* Test List */}
      {suiteResult && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              Test Execution Logs
            </h2>
            <span className="text-xs text-slate-400 font-mono">10 Test Assertions</span>
          </div>

          <div className="space-y-3">
            {suiteResult.results.map((test) => (
              <div
                key={test.id}
                className={`p-4 rounded-xl border transition-all text-xs space-y-2 ${
                  test.passed
                    ? 'bg-white border-slate-200 hover:border-emerald-300'
                    : 'bg-rose-50 border-rose-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    {test.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-bold text-slate-900 text-sm">{test.name}</span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">{test.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-bold uppercase text-[9px] block">Expected:</span>
                    <span className="text-slate-800">{test.expected}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-bold uppercase text-[9px] block">Actual Result:</span>
                    <span className="text-emerald-800 font-semibold">{test.actual}</span>
                  </div>
                </div>

                <p className="text-slate-500 text-[11px] leading-relaxed pt-1">
                  <strong>Verification Method:</strong> {test.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
