import React from 'react';
import {
  ShieldCheck,
  Search,
  Columns,
  QrCode,
  SlidersHorizontal,
  CheckCircle2,
  BookOpen,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export type ActiveTab =
  | 'scanner'
  | 'products'
  | 'compare'
  | 'qr_verify'
  | 'admin'
  | 'tests'
  | 'judge_guide'
  | 'docs';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onResetDemo: () => void;
  isResetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onResetDemo,
  isResetting,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            id="brand-header"
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-200 group-hover:bg-emerald-700 transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">
                  Label Truth Engine
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  SIH MVP
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Explainable Food Transparency & Verification
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-tab-scanner"
              onClick={() => setActiveTab('scanner')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'scanner'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              Scan & Analyze
            </button>

            <button
              id="nav-tab-products"
              onClick={() => setActiveTab('products')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Products
            </button>

            <button
              id="nav-tab-compare"
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'compare'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Columns className="w-4 h-4" />
              Compare
            </button>

            <button
              id="nav-tab-qr"
              onClick={() => setActiveTab('qr_verify')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'qr_verify'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-4 h-4" />
              QR Verification
            </button>

            <button
              id="nav-tab-admin"
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Admin & Recall
            </button>

            <button
              id="nav-tab-tests"
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'tests'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Unit Tests
            </button>

            <button
              id="nav-tab-judge-guide"
              onClick={() => setActiveTab('judge_guide')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'judge_guide'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold'
                  : 'text-amber-700 hover:bg-amber-50/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              SIH Demo Flow
            </button>

            <button
              id="nav-tab-docs"
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'docs'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Docs
            </button>
          </nav>

          {/* Quick Demo Reset & Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              id="btn-reset-demo-state"
              onClick={onResetDemo}
              disabled={isResetting}
              title="Reset all units, scans, and batch statuses to initial state for live judge demo"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset Demo State</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'scanner' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Scan & Analyze
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'products' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'compare' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => setActiveTab('qr_verify')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'qr_verify' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            QR Verification
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'admin' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Admin & Recall
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'tests' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Unit Tests
          </button>
          <button
            onClick={() => setActiveTab('judge_guide')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'judge_guide' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-900'
            }`}
          >
            SIH Demo Flow
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'docs' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Docs
          </button>
        </div>
      </div>
    </header>
  );
};
