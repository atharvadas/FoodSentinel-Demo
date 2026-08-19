# REST API Reference — Label Truth Engine

Base URL: `/api`

### 1. Products
- `GET /api/products` — Returns array of all products.
- `GET /api/products/:id` — Returns product with evaluated `TruthReport`.
- `POST /api/analyze` — Evaluates arbitrary custom product JSON and returns `TruthReport`.
- `POST /api/compare` — Compares two products side-by-side (`{ product_a, product_b }`).

### 2. OCR Extraction
- `POST /api/ocr/extract` — `{ image_base64: string }`
  - Returns extracted product name, brand, serving size, package size, nutrients, ingredients, and claims.

### 3. QR Verification & Serialization
- `POST /api/verify-qr` — `{ code: string, session_id?: string, ip_pseudo?: string }`
  - Returns verification status (`VERIFIED`, `ALREADY_VERIFIED`, `POSSIBLE_DUPLICATE`, `RECALLED_BATCH`, `INVALID_CODE`), linked product, batch details, and explainability notes.

### 4. Admin & Recall Traceability
- `GET /api/batches` — List all production batches.
- `POST /api/batches/:id/status` — `{ status: 'ACTIVE' | 'RECALLED', reason?: string }`
- `GET /api/units` — List serialized units registry.
- `POST /api/units` — `{ product_id: string, batch_id: string }` mints a new serialized unit.
- `GET /api/scan-events` — Live audit log of scan events.
- `POST /api/reset-demo` — Resets dataset, units, and batches to default clean state.

### 5. Automated Tests
- `GET /api/tests/run` — Executes all 10 automated test suites and returns pass/fail report.
