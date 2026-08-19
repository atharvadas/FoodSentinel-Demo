# Label Truth Engine — SIH MVP

> A consumer-facing food transparency platform that scans packaged food, analyzes its label for potentially misleading presentation, explains the findings using an explainable rule engine, and verifies the authenticity/status of a demo QR code or batch.

---

## 1. Problem Statement
Packaged food labels frequently present complex or misleading information through compact serving size divisions, disguised free-sugar aliases (glucose syrup, invert sugar, date concentrates), ambiguous marketing claims ("No Added Refined Sugar"), and unverified supply-chain claims. Consumers lack an instant, explainable tool to decipher whole-package reality and verify authenticity.

## 2. Solution Overview
**Label Truth Engine** provides:
1. **Explainable Rule Engine**: Transparent, deterministic calculations answering *"Why did I get this alert?"* with evidence and math.
2. **Serving Size Normalizer**: Computes exact package-to-serving ratios and calculated whole-package sugar/calories.
3. **Sugar Transparency**: Assesses sugar density against WHO's recommended 25g/day limit and identifies hidden sweetener aliases.
4. **Marketing Claim Scrutiny**: Cross-references claims against ingredient lists and statutory nutritional thresholds.
5. **Unit-Level QR Serialization**: Proof-of-concept unit verification detecting first scans, customer repeat scans, and suspicious multi-device duplicate reuse.
6. **Live Batch Recall Traceability**: Real-time batch state management that warns consumers on subsequent scans.
7. **Curated FoSCoS FSSAI Registry**: Verified reference dataset for regulatory license checks.

---

## 3. Scenario A (Actual MVP) vs Scenario B (Production Vision)

### Scenario A — Built in this MVP:
- Real Express backend + React/Vite/TypeScript frontend
- Explainable deterministic rule calculations
- Curated FoSCoS dataset & ingredient alias knowledge base
- Working QR code generation & scanning with html5-qrcode
- Real-time batch recall toggle & duplicate scan detection
- 10 automated unit test suites

### Scenario B — Production Vision Roadmap:
- Real brand serialization hardware at factory scale
- GS1 Digital Link 2D barcode integration
- Official nationwide FoSCoS API gateway access
- Industrial ERP supply-chain ledger integration

---

## 4. Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, html5-qrcode, qrcode
- **Backend**: Node.js, Express, TypeScript (tsx/esbuild)
- **AI/Vision**: Gemini 2.5 Flash Vision OCR via `@google/genai` (with heuristic fallback)
- **Database**: In-Memory Relational Structured Store with seed data and audit log streams

---

## 5. Quick Start & Demo
1. Run `npm run dev` to start backend + frontend on port 3000.
2. Open the application preview.
3. Use the **SIH Demo Flow** tab to walk through the 15-step jury presentation sequence.
