# System Architecture — Label Truth Engine

## Architecture Diagram

```text
[ Browser / Mobile Device ]
       │
       ├─► Live Camera QR Scanner (html5-qrcode)
       ├─► Label Image Upload (OCR)
       ├─► Truth Report Dashboard (Math & Evidence)
       ├─► Product Comparator (100g Normalized)
       └─► Admin Batch Recall & Serialization
              │
              │ JSON REST API
              ▼
[ Node.js + Express Server (Port 3000) ]
       │
       ├─► Truth Engine (Deterministic Rule Processor)
       ├─► OCR Extractor (Gemini 2.5 Flash + Heuristics)
       ├─► QR Serialization Registry & Duplicate Anomaly Detector
       ├─► Batch State & Recall Controller
       └─► Automated Test Suite Runner (10 Assertions)
              │
              ▼
[ In-Memory Relational Structured Store ]
       ├─► Products (Nutrition, Ingredients, Claims)
       ├─► Batches (ACTIVE / RECALLED / EXPIRED)
       ├─► Serialized Units (Unique Codes, Scans, Sessions)
       ├─► Curated FoSCoS FSSAI Registry
       ├─► Ingredient Knowledge Base (30+ aliases)
       └─► Audit Scan Events Stream
```

## Security & Reliability Guardrails
1. **Division-by-Zero Protection**: All serving size divisions are clamped (`Math.max(val, 1)`) to avoid `NaN` or crashes.
2. **Deterministic Rules**: No random or hallucinated rule scores; findings directly link to ingredients or nutrient values.
3. **Session Pseudonymization**: Scan anomalies track anonymous session tokens and masked pseudo-IPs rather than collecting PII.
