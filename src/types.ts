export type Severity = 'info' | 'warning' | 'critical' | 'verified';

export type FindingCategory =
  | 'Serving Size'
  | 'Sugar & Sweeteners'
  | 'Marketing Claims'
  | 'Nutrition Profile'
  | 'Ingredients & Additives'
  | 'Regulatory & FSSAI'
  | 'Authenticity & Batch';

export interface TruthFinding {
  rule_id: string;
  category: FindingCategory;
  severity: Severity;
  title: string;
  explanation: string;
  evidence: string;
  calculation?: string;
  recommendation?: string;
  triggered_terms?: string[];
}

export interface ProductNutrition {
  serving_size_g: number;
  package_size_g: number;
  energy_kcal_per_100g?: number;
  sugar_per_serving_g: number;
  sugar_per_100g_g: number;
  added_sugar_per_100g_g?: number;
  salt_per_100g_g: number;
  sodium_mg_per_100g?: number;
  fat_per_100g_g: number;
  saturated_fat_per_100g_g: number;
  trans_fat_per_100g_g?: number;
  protein_per_100g_g: number;
  fiber_per_100g_g?: number;
}

export interface Product {
  product_id: string;
  product_name: string;
  brand: string;
  category: string;
  image_url?: string;
  nutrition: ProductNutrition;
  ingredients: string[];
  claims: string[];
  fssai_license_number: string;
  batch_number: string;
  manufacturing_date: string;
  expiry_date: string;
  manufacturer_name?: string;
  package_unit?: string; // 'g' | 'ml'
  description?: string;
}

export interface CuratedFssaiRecord {
  license_number: string;
  company_name: string;
  brand_name: string;
  status: 'VALID' | 'SUSPENDED' | 'EXPIRED' | 'NOT_FOUND';
  verification_source: string; // e.g. "FoSCoS Curated SIH Demo Registry"
  last_verified_date: string;
  registered_address: string;
  permitted_categories: string[];
}

export type BatchStatus = 'ACTIVE' | 'RECALLED' | 'EXPIRED';

export interface ProductBatch {
  batch_id: string;
  product_id: string;
  product_name: string;
  batch_number: string;
  manufacturing_date: string;
  expiry_date: string;
  status: BatchStatus;
  recall_reason?: string;
  recalled_at?: string;
  total_units: number;
}

export interface SerializedUnit {
  unit_id: string;
  product_id: string;
  batch_id: string;
  unique_code: string;
  created_at: string;
  status: 'ACTIVE' | 'RECALLED' | 'FLAGGED';
  scan_count: number;
  first_scanned_at?: string;
  last_scanned_at?: string;
  first_session_id?: string;
}

export interface ScanEvent {
  event_id: string;
  unit_code: string;
  product_id: string;
  batch_id: string;
  session_id: string;
  ip_pseudo: string;
  scanned_at: string;
  result_status: 'FIRST_SCAN_VERIFIED' | 'REPEAT_SCAN_SAME_SESSION' | 'SUSPICIOUS_DUPLICATE_REUSE' | 'RECALLED_BATCH' | 'INVALID_CODE';
  message: string;
  risk_level: 'low' | 'medium' | 'high';
}

export interface TruthReport {
  product: Product;
  servings_count: number;
  calculated_whole_package: {
    total_sugar_g: number;
    total_calories_kcal?: number;
    total_fat_g?: number;
    total_salt_g?: number;
  };
  sugar_analysis: {
    sugar_per_serving_g: number;
    sugar_per_100g: number;
    whole_package_sugar_g: number;
    who_daily_limit_percentage_per_serving: number; // based on 25g daily intake
    who_daily_limit_percentage_whole_package: number;
    detected_sugar_aliases: { term: string; alias_type: string; notes: string }[];
  };
  findings: TruthFinding[];
  summary: {
    total_alerts: number;
    critical_count: number;
    warning_count: number;
    info_count: number;
    overall_transparency_score: number; // 0-100 scale based on explainable factors
  };
  fssai_status: {
    license_number: string;
    verified: boolean;
    record?: CuratedFssaiRecord;
    note: string;
  };
}

export interface QRVerificationResult {
  code?: string;
  status: 'VERIFIED' | 'ALREADY_VERIFIED' | 'POSSIBLE_DUPLICATE' | 'RECALLED_BATCH' | 'INVALID_CODE';
  badge_color?: 'green' | 'blue' | 'yellow' | 'red';
  title?: string;
  message?: string;
  unit?: SerializedUnit;
  product?: Product;
  batch?: ProductBatch;
  scan_event?: ScanEvent;
  history_count?: number;
  explainability: {
    why: string;
    evidence: string;
    recommendation: string;
  };
}

export interface ComparisonReport {
  product_a: Product;
  product_b: Product;
  report_a: TruthReport;
  report_b: TruthReport;
  differences: {
    sugar_diff_per_100g: number; // B - A
    sugar_diff_pct: number;
    salt_diff_per_100g: number;
    fat_diff_per_100g: number;
    sat_fat_diff_per_100g: number;
    protein_diff_per_100g: number;
    servings_diff: number;
  };
  factual_takeaways: string[];
}

export interface TestResultItem {
  id: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  details: string;
}

export interface FullTestSuiteResult {
  timestamp: string;
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  results: TestResultItem[];
}
