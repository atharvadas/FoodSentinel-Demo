# Truth Engine — Explainable Rule Specifications

Every finding emitted by the Truth Engine contains:
- **Rule ID**
- **Category**
- **Severity** (`info`, `warning`, `critical`, `verified`)
- **Title**
- **Explanation** (What was found and why it matters)
- **Evidence** (Concrete facts from the packaging)
- **Calculation** (Exact mathematical steps)
- **Consumer Recommendation**

---

### Rule Index

| Rule ID | Category | Logic & Formula | Severity |
|---|---|---|---|
| `SERVING_SIZE_001` | Serving Size | `servings = package_size_g / serving_size_g` | `info` |
| `SERVING_SIZE_002` | Serving Size | Flag if compact single-use snack (<=120g) has >1.5 servings | `warning` |
| `ING_ALIAS_SUGAR_001` | Sugar & Sweeteners | Detects aliases: glucose syrup, invert sugar, HFCS, date syrup, fruit concentrates | `warning` / `info` |
| `ING_ALIAS_FAT_001` | Ingredients & Additives | Detects hydrogenated oils (vanaspati) / industrial trans fat | `warning` |
| `SUGAR_001` | Sugar & Sweeteners | Whole package sugar > 25g (100% of WHO Daily Guideline) | `warning` |
| `SUGAR_002` | Sugar & Sweeteners | Per serving sugar > 40% of WHO 25g Daily Guideline | `info` |
| `CLAIM_001` | Marketing Claims | "No Added Sugar" claim vs concentrated syrups in ingredient list | `warning` |
| `CLAIM_002` | Marketing Claims | "High Protein" claim verification (>=10g/serving or >=15g/100g) | `verified` / `warning` |
| `CLAIM_003` | Marketing Claims | "100% Natural" claim vs INS food additives/preservatives | `warning` |
| `FSSAI_001` | Regulatory & FSSAI | Verification against curated FoSCoS demo dataset | `verified` / `critical` |
| `HFSS_SUGAR_001` | Nutrition Profile | Sugar > 20g / 100g (High Sugar density threshold) | `warning` |
| `HFSS_SALT_001` | Nutrition Profile | Salt > 1.5g / 100g (High Salt/Sodium density threshold) | `warning` |
| `HFSS_FAT_001` | Nutrition Profile | Saturated Fat > 8g / 100g | `warning` |
