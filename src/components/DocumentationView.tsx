import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Layers, Database, Code, CheckCircle2 } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [activeDocTab, setActiveDocTab] = useState<'architecture' | 'scenario_ab' | 'rule_specs' | 'database' | 'api'>(
    'scenario_ab'
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <h1 className="text-xl font-bold text-slate-900">
            System Documentation & Technical Specifications
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Architectural blueprints, Scenario A vs Scenario B demarcation, database entity relationships, and explainable rule engine formulas.
        </p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 mt-4">
          <button
            onClick={() => setActiveDocTab('scenario_ab')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeDocTab === 'scenario_ab'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Scenario A (MVP) vs Scenario B (Vision)
          </button>
          <button
            onClick={() => setActiveDocTab('architecture')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeDocTab === 'architecture'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Architecture Overview
          </button>
          <button
            onClick={() => setActiveDocTab('rule_specs')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeDocTab === 'rule_specs'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Explainable Rule Engine Specs
          </button>
          <button
            onClick={() => setActiveDocTab('database')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeDocTab === 'database'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Database Schema
          </button>
          <button
            onClick={() => setActiveDocTab('api')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeDocTab === 'api'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            REST API Endpoints
          </button>
        </div>
      </div>

      {/* TAB 1: SCENARIO A VS SCENARIO B */}
      {activeDocTab === 'scenario_ab' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs text-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              Scenario A (Actual Working MVP) vs Scenario B (Production Vision)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with SIH engineering rigor and ethical transparency, the platform explicitly distinguishes between what is built in code today and what belongs to the enterprise production roadmap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scenario A Card */}
            <div className="bg-emerald-50/60 border border-emerald-300 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <h3 className="font-bold text-emerald-950 text-base">Scenario A — Actual MVP (Built)</h3>
              </div>
              <ul className="space-y-2 text-xs text-emerald-900">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Explainable Rule Engine:</strong> Deterministic calculations for serving size multipliers, WHO sugar limits, and hidden aliases.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Unit-Level QR Serialization:</strong> Working verification engine tracking scan counts and detecting multi-device duplicate reuse.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Live Batch Recall System:</strong> Admin batch recall controls that instantly propagate red warnings to consumers.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Curated FoSCoS Dataset:</strong> Pre-verified demo registry of genuine FSSAI manufacturer license records.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Objective Product Comparison:</strong> Normalized 100g density comparison without arbitrary subjective ranking.
                  </span>
                </li>
              </ul>
            </div>

            {/* Scenario B Card */}
            <div className="bg-slate-50 border border-slate-300 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <h3 className="font-bold text-slate-800 text-base">Scenario B — Production Roadmap</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>
                    <strong>GS1 Digital Link 2D Barcodes:</strong> Adoption of GS1 standard digital identifiers printed at industrial manufacturing speeds.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>
                    <strong>Official FSSAI FoSCoS Live API:</strong> Direct government API gateway integration upon institutional authorization.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>
                    <strong>Manufacturer ERP Integration:</strong> Direct SAP / Oracle supply-chain ledger integration for real-time dispatch trace.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ARCHITECTURE */}
      {activeDocTab === 'architecture' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs text-sm">
          <h2 className="text-lg font-bold text-slate-900">High-Level System Architecture</h2>
          <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
            {`+-------------------------------------------------------------------------+
|                        LABEL TRUTH ENGINE ARCHITECTURE                   |
+-------------------------------------------------------------------------+
| [CLIENT LAYER: React 19 + TypeScript + Vite + Tailwind]                 |
|   - Live Camera QR Scanner (html5-qrcode)                               |
|   - Label OCR Upload & Review Interface                                 |
|   - Explainable Truth Report Dashboard                                  |
|   - Side-by-Side Product Comparator                                     |
|   - Admin Batch Recall & Serialization Station                          |
+-------------------------------------------------------------------------+
                                    | REST API Calls (JSON)
                                    v
+-------------------------------------------------------------------------+
| [SERVER LAYER: Node.js + Express + TypeScript]                          |
|   - /api/analyze & /api/products -> Truth Engine Rule Processor         |
|   - /api/ocr/extract -> Gemini 2.5 Flash Vision OCR + Heuristic Parser  |
|   - /api/verify-qr -> Serialization Registry & Duplication Anomaly      |
|   - /api/batches/:id/status -> Live Batch Recall Propagation            |
|   - /api/tests/run -> Automated Test Suite Runner (10 Assertions)       |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
| [DATA LAYER: In-Memory Relational Structured Store with Seed Registry]  |
|   - Products Table (Nutrition, Ingredients, Claims, FSSAI)              |
|   - Production Batches Table (Statuses: ACTIVE / RECALLED / EXPIRED)    |
|   - Serialized Units Table (Unique Codes, Scan Counts, Timestamps)      |
|   - Curated FoSCoS FSSAI Registry                                       |
|   - Ingredient & Sugar Alias Knowledge Base (30+ aliases)               |
|   - Audit Scan Events Stream                                            |
+-------------------------------------------------------------------------+`}
          </div>
        </div>
      )}

      {/* TAB 3: RULE SPECS */}
      {activeDocTab === 'rule_specs' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs text-sm">
          <h2 className="text-lg font-bold text-slate-900">Explainable Truth Engine Rule Specifications</h2>
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 font-mono">
              <div className="font-bold text-slate-900 text-sm">Rule 1: SERVING_SIZE_001 (Portion Multiplier)</div>
              <p className="text-slate-600">Formula: number_of_servings = package_size_g / serving_size_g</p>
              <p className="text-slate-600">Whole Package Nutrient = nutrient_per_serving * number_of_servings</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 font-mono">
              <div className="font-bold text-slate-900 text-sm">Rule 2: ING_ALIAS_SUGAR_001 (Disguised Sugars)</div>
              <p className="text-slate-600">
                Matches ingredient tokens against free sugar derivatives (glucose syrup, high fructose corn syrup, invert sugar, dextrose, sucrose, maltodextrin, date syrup, fruit juice concentrates).
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 font-mono">
              <div className="font-bold text-slate-900 text-sm">Rule 3: SUGAR_001 (WHO Daily Guideline Upper Bound)</div>
              <p className="text-slate-600">Reference: WHO Free Sugar Limit = 25g/day</p>
              <p className="text-slate-600">Calculates % of daily limit per serving and across whole package.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 font-mono">
              <div className="font-bold text-slate-900 text-sm">Rule 4: CLAIM_001 (Marketing Claim vs Ingredient Scrutiny)</div>
              <p className="text-slate-600">
                Detects claims like "No Added Sugar" and verifies whether concentrated syrups or fruit concentrates are present in the ingredient array.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DATABASE */}
      {activeDocTab === 'database' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs text-sm">
          <h2 className="text-lg font-bold text-slate-900">Relational Database Entity Schema</h2>
          <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto">
            {`TABLE products (
  product_id VARCHAR PRIMARY KEY,
  product_name VARCHAR NOT NULL,
  brand VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  serving_size_g NUMERIC NOT NULL,
  package_size_g NUMERIC NOT NULL,
  sugar_per_serving_g NUMERIC NOT NULL,
  sugar_per_100g_g NUMERIC NOT NULL,
  salt_per_100g_g NUMERIC,
  fat_per_100g_g NUMERIC,
  saturated_fat_per_100g_g NUMERIC,
  protein_per_100g_g NUMERIC,
  ingredients TEXT[],
  claims TEXT[],
  fssai_license_number VARCHAR,
  batch_number VARCHAR
);

TABLE batches (
  batch_id VARCHAR PRIMARY KEY,
  product_id VARCHAR REFERENCES products(product_id),
  status VARCHAR CHECK (status IN ('ACTIVE', 'RECALLED', 'EXPIRED')),
  recall_reason TEXT,
  recalled_at TIMESTAMP
);

TABLE units (
  unit_id VARCHAR PRIMARY KEY,
  product_id VARCHAR REFERENCES products(product_id),
  batch_id VARCHAR REFERENCES batches(batch_id),
  unique_code VARCHAR UNIQUE NOT NULL,
  scan_count INTEGER DEFAULT 0,
  first_scanned_at TIMESTAMP,
  first_session_id VARCHAR,
  status VARCHAR CHECK (status IN ('ACTIVE', 'RECALLED', 'FLAGGED'))
);

TABLE scan_events (
  event_id VARCHAR PRIMARY KEY,
  unit_code VARCHAR,
  session_id VARCHAR,
  ip_pseudo VARCHAR,
  scanned_at TIMESTAMP,
  result_status VARCHAR,
  risk_level VARCHAR
);`}
          </div>
        </div>
      )}

      {/* TAB 5: API */}
      {activeDocTab === 'api' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs text-sm">
          <h2 className="text-lg font-bold text-slate-900">REST API Endpoints</h2>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-emerald-800">GET /api/products</span>
              <span className="text-slate-500">List all catalog products</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-emerald-800">GET /api/products/:id</span>
              <span className="text-slate-500">Fetch product with Truth Engine report</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-blue-800">POST /api/analyze</span>
              <span className="text-slate-500">Analyze arbitrary product JSON</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-blue-800">POST /api/ocr/extract</span>
              <span className="text-slate-500">Extract label fields from Base64 image</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-blue-800">POST /api/verify-qr</span>
              <span className="text-slate-500">Scan & verify serialized unit code</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-blue-800">POST /api/batches/:id/status</span>
              <span className="text-slate-500">Trigger live recall on batch</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-emerald-800">GET /api/tests/run</span>
              <span className="text-slate-500">Execute automated 10-test suite</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
