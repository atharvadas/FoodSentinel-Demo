# Database Schema & Data Models — Label Truth Engine

## Entities

### `Product`
- `product_id`: `string` (PK)
- `product_name`: `string`
- `brand`: `string`
- `category`: `string`
- `package_unit`: `'g' | 'ml'`
- `nutrition`: `NutritionData` (serving size, package size, sugar/serving, sugar/100g, salt/100g, fat/100g, saturated fat/100g, protein/100g, calories/100g)
- `ingredients`: `string[]`
- `claims`: `string[]`
- `fssai_license_number`: `string`
- `batch_number`: `string`
- `manufacturer_name`: `string`

### `ProductBatch`
- `batch_id`: `string` (PK)
- `product_id`: `string` (FK -> `Product.product_id`)
- `product_name`: `string`
- `manufacturing_date`: `string` (YYYY-MM-DD)
- `expiry_date`: `string` (YYYY-MM-DD)
- `total_units`: `number`
- `status`: `'ACTIVE' | 'RECALLED' | 'EXPIRED'`
- `recall_reason`?: `string`
- `recalled_at`?: `string`

### `SerializedUnit`
- `unit_id`: `string` (PK)
- `product_id`: `string` (FK -> `Product.product_id`)
- `batch_id`: `string` (FK -> `ProductBatch.batch_id`)
- `unique_code`: `string` (Unique serialized QR payload)
- `status`: `'ACTIVE' | 'RECALLED' | 'FLAGGED'`
- `scan_count`: `number`
- `first_scanned_at`?: `string`
- `first_session_id`?: `string`
- `last_scanned_at`?: `string`

### `ScanEvent`
- `event_id`: `string` (PK)
- `unit_code`: `string`
- `session_id`: `string`
- `ip_pseudo`: `string`
- `scanned_at`: `string`
- `result_status`: `string`
- `risk_level`: `'low' | 'medium' | 'high'`
- `message`: `string`

### `FSSAIRecord`
- `license_number`: `string` (PK)
- `company_name`: `string`
- `status`: `'ACTIVE' | 'SUSPENDED' | 'EXPIRED'`
- `category`: `string`
- `valid_until`: `string`
