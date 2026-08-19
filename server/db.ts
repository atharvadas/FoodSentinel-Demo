import {
  Product,
  ProductBatch,
  SerializedUnit,
  CuratedFssaiRecord,
  ScanEvent,
} from '../src/types';

export interface IngredientAliasKnowledge {
  term: string;
  category: 'sugar_alias' | 'artificial_sweetener' | 'preservative_salt' | 'unhealthy_fat' | 'additive';
  displayName: string;
  explanation: string;
  severity: 'info' | 'warning';
}

export const INGREDIENT_KNOWLEDGE_BASE: IngredientAliasKnowledge[] = [
  // Sugar & Free Sugar Aliases
  {
    term: 'glucose syrup',
    category: 'sugar_alias',
    displayName: 'Glucose Syrup',
    explanation: 'A concentrated free sugar syrup derived from starch, high glycemic index.',
    severity: 'warning',
  },
  {
    term: 'high fructose corn syrup',
    category: 'sugar_alias',
    displayName: 'High Fructose Corn Syrup (HFCS)',
    explanation: 'A highly processed sweetener metabolized primarily by the liver.',
    severity: 'warning',
  },
  {
    term: 'invert sugar',
    category: 'sugar_alias',
    displayName: 'Invert Sugar / Invert Syrup',
    explanation: 'A mixture of glucose and fructose with high sweetness, often added for moisture retention.',
    severity: 'warning',
  },
  {
    term: 'dextrose',
    category: 'sugar_alias',
    displayName: 'Dextrose',
    explanation: 'A simple monosaccharide sugar chemically identical to glucose.',
    severity: 'warning',
  },
  {
    term: 'sucrose',
    category: 'sugar_alias',
    displayName: 'Sucrose',
    explanation: 'Common table sugar (disaccharide of glucose and fructose).',
    severity: 'warning',
  },
  {
    term: 'fructose',
    category: 'sugar_alias',
    displayName: 'Fructose',
    explanation: 'Fruit sugar; in isolated/concentrated forms, acts as a concentrated free sweetener.',
    severity: 'warning',
  },
  {
    term: 'maltose',
    category: 'sugar_alias',
    displayName: 'Maltose',
    explanation: 'A disaccharide sugar derived from malted grain, high glycemic impact.',
    severity: 'warning',
  },
  {
    term: 'maltodextrin',
    category: 'sugar_alias',
    displayName: 'Maltodextrin',
    explanation: 'A polysaccharide food additive with a glycemic index often higher than table sugar.',
    severity: 'warning',
  },
  {
    term: 'date syrup',
    category: 'sugar_alias',
    displayName: 'Date Syrup',
    explanation: 'Concentrated date sugars; while naturally derived, contributes to total free sugars.',
    severity: 'info',
  },
  {
    term: 'apple juice concentrate',
    category: 'sugar_alias',
    displayName: 'Fruit Juice Concentrate',
    explanation: 'De-watered fruit juice functioning as a concentrated sweetener under WHO free sugar definitions.',
    severity: 'warning',
  },
  {
    term: 'cane juice',
    category: 'sugar_alias',
    displayName: 'Evaporated Cane Juice',
    explanation: 'Essentially unrefined or semi-refined sugar despite the wholesome naming.',
    severity: 'warning',
  },
  {
    term: 'molasses',
    category: 'sugar_alias',
    displayName: 'Molasses / Treacle',
    explanation: 'Viscous by-product of sugar refining containing significant sucrose and fructose.',
    severity: 'info',
  },
  {
    term: 'honey',
    category: 'sugar_alias',
    displayName: 'Honey',
    explanation: 'Natural sweetener consisting mainly of fructose and glucose.',
    severity: 'info',
  },

  // Fats
  {
    term: 'hydrogenated vegetable oil',
    category: 'unhealthy_fat',
    displayName: 'Hydrogenated Vegetable Oil (Vanaspati)',
    explanation: 'Industrial trans fat source associated with cardiovascular risk.',
    severity: 'warning',
  },
  {
    term: 'palmolein oil',
    category: 'unhealthy_fat',
    displayName: 'Palmolein / Palm Oil',
    explanation: 'High saturated fatty acid profile (approx 45-50% saturated fat).',
    severity: 'info',
  },

  // Salt & Flavor Enhancers
  {
    term: 'flavour enhancers (ins 627, ins 631)',
    category: 'preservative_salt',
    displayName: 'Disodium Guanylate & Inosinate (INS 627, 631)',
    explanation: 'Purine-based flavor potentiators typically combined with sodium/MSG.',
    severity: 'info',
  },
  {
    term: 'monosodium glutamate',
    category: 'preservative_salt',
    displayName: 'Monosodium Glutamate (MSG / INS 621)',
    explanation: 'Sodium salt of glutamic acid used to enhance savory umami taste.',
    severity: 'info',
  },

  // Artificial Sweeteners
  {
    term: 'sucralose',
    category: 'artificial_sweetener',
    displayName: 'Sucralose (INS 955)',
    explanation: 'Zero-calorie non-nutritive artificial sweetener.',
    severity: 'info',
  },
  {
    term: 'erythritol',
    category: 'artificial_sweetener',
    displayName: 'Erythritol',
    explanation: 'Sugar alcohol (polyol) with low caloric value and minimal glycemic response.',
    severity: 'info',
  },
  {
    term: 'stevia leaf extract',
    category: 'artificial_sweetener',
    displayName: 'Steviol Glycosides / Stevia (INS 960)',
    explanation: 'Plant-derived non-caloric high-intensity sweetener.',
    severity: 'info',
  },
];

export const CURATED_FSSAI_REGISTRY: Record<string, CuratedFssaiRecord> = {
  '10014022002891': {
    license_number: '10014022002891',
    company_name: 'Delight Bites Confectioneries India Pvt Ltd',
    brand_name: 'Delight Bites',
    status: 'VALID',
    verification_source: 'FoSCoS Curated SIH Demo Registry',
    last_verified_date: '2026-06-15',
    registered_address: 'Plot 42, Sector 18, Udyog Vihar, Gurugram, Haryana 122015',
    permitted_categories: ['05.0 - Confectionery', '07.0 - Bakery Products'],
  },
  '10019011006423': {
    license_number: '10019011006423',
    company_name: 'NutriLife Organics & Wellness India LLP',
    brand_name: 'NutriLife Foods',
    status: 'VALID',
    verification_source: 'FoSCoS Curated SIH Demo Registry',
    last_verified_date: '2026-07-01',
    registered_address: 'Survey 108, Whitefield Industrial Area, Bengaluru, Karnataka 560066',
    permitted_categories: ['06.0 - Cereals and cereal products', '15.0 - Ready-to-eat savouries'],
  },
  '10012044000188': {
    license_number: '10012044000188',
    company_name: 'Spark Beverages & Bottling Ltd',
    brand_name: 'Spark Beverages',
    status: 'SUSPENDED',
    verification_source: 'FoSCoS Curated SIH Demo Registry (Notice Ref: FS-2026/08)',
    last_verified_date: '2026-08-01',
    registered_address: 'MIDC Phase II, Andheri East, Mumbai, Maharashtra 400093',
    permitted_categories: ['14.0 - Beverages, excluding dairy'],
  },
  '10018051002390': {
    license_number: '10018051002390',
    company_name: 'SunFresh Orchard Agro Processing Ltd',
    brand_name: 'SunFresh Juices',
    status: 'VALID',
    verification_source: 'FoSCoS Curated SIH Demo Registry',
    last_verified_date: '2026-05-20',
    registered_address: 'GIDC Naroda Industrial Estate, Ahmedabad, Gujarat 382330',
    permitted_categories: ['04.0 - Fruits and vegetables (including juices)'],
  },
  '10021021000789': {
    license_number: '10021021000789',
    company_name: 'ActiveFuel Nutrition Bio-Labs India Pvt Ltd',
    brand_name: 'ActiveFuel Nutrition',
    status: 'VALID',
    verification_source: 'FoSCoS Curated SIH Demo Registry',
    last_verified_date: '2026-07-10',
    registered_address: 'Cyber Gateway, Hitec City, Hyderabad, Telangana 500081',
    permitted_categories: ['13.0 - Foodstuffs intended for particular nutritional uses'],
  },
  '10016012001155': {
    license_number: '10016012001155',
    company_name: 'DesiTreats Traditional Snacks & Namkeen Pvt Ltd',
    brand_name: 'DesiTreats',
    status: 'VALID',
    verification_source: 'FoSCoS Curated SIH Demo Registry',
    last_verified_date: '2026-04-18',
    registered_address: 'Bhiwandi Industrial Hub, Thane, Maharashtra 421302',
    permitted_categories: ['15.0 - Ready-to-eat savouries'],
  },
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    product_id: 'DEMO-P001',
    product_name: 'ChocoCrunch Filled Biscuits',
    brand: 'Delight Bites',
    category: 'Biscuits',
    description: 'Crispy cocoa biscuits filled with sweet cream center.',
    package_unit: 'g',
    nutrition: {
      serving_size_g: 25,
      package_size_g: 100,
      energy_kcal_per_100g: 485,
      sugar_per_serving_g: 9,
      sugar_per_100g_g: 36,
      added_sugar_per_100g_g: 34,
      salt_per_100g_g: 0.6,
      sodium_mg_per_100g: 240,
      fat_per_100g_g: 21,
      saturated_fat_per_100g_g: 9.5,
      trans_fat_per_100g_g: 0.2,
      protein_per_100g_g: 5.5,
      fiber_per_100g_g: 2.1,
    },
    ingredients: [
      'refined wheat flour (maida)',
      'sugar',
      'hydrogenated vegetable oil',
      'glucose syrup',
      'cocoa solids (3.5%)',
      'invert syrup',
      'milk solids',
      'raising agents (INS 500ii, 503ii)',
      'emulsifiers (INS 322, 471)',
    ],
    claims: ['No Artificial Colours', 'With Real Milk Goodness'],
    fssai_license_number: '10014022002891',
    batch_number: 'DEMO-BATCH-001',
    manufacturing_date: '2026-07-01',
    expiry_date: '2027-04-01',
    manufacturer_name: 'Delight Bites Confectioneries India Pvt Ltd',
  },
  {
    product_id: 'DEMO-P002',
    product_name: 'FitMorning Honey & Nut Granola',
    brand: 'NutriLife Foods',
    category: 'Breakfast cereal',
    description: 'Crunchy oven-baked multigrain clusters loaded with honey and whole almonds.',
    package_unit: 'g',
    nutrition: {
      serving_size_g: 30,
      package_size_g: 400,
      energy_kcal_per_100g: 430,
      sugar_per_serving_g: 6.5,
      sugar_per_100g_g: 21.6,
      added_sugar_per_100g_g: 18.0,
      salt_per_100g_g: 0.35,
      sodium_mg_per_100g: 140,
      fat_per_100g_g: 14.5,
      saturated_fat_per_100g_g: 3.2,
      trans_fat_per_100g_g: 0,
      protein_per_100g_g: 10.2,
      fiber_per_100g_g: 8.5,
    },
    ingredients: [
      'rolled oats (55%)',
      'honey',
      'date syrup',
      'maltodextrin',
      'almonds (6%)',
      'apple juice concentrate',
      'sunflower oil',
      'natural vanilla flavour',
    ],
    claims: ['No Added Refined Sugar', '100% Natural Ingredients', 'High Fibre'],
    fssai_license_number: '10019011006423',
    batch_number: 'DEMO-BATCH-001',
    manufacturing_date: '2026-06-15',
    expiry_date: '2027-03-15',
    manufacturer_name: 'NutriLife Organics & Wellness India LLP',
  },
  {
    product_id: 'DEMO-P003',
    product_name: 'PowerBoost Intense Energy Cola',
    brand: 'Spark Beverages',
    category: 'Soft drink',
    description: 'High-caffeine fizzy refreshment for extended focus and athletic stamina.',
    package_unit: 'ml',
    nutrition: {
      serving_size_g: 200, // 200ml
      package_size_g: 500, // 500ml
      energy_kcal_per_100g: 42,
      sugar_per_serving_g: 18,
      sugar_per_100g_g: 9.0,
      added_sugar_per_100g_g: 9.0,
      salt_per_100g_g: 0.05,
      sodium_mg_per_100g: 20,
      fat_per_100g_g: 0,
      saturated_fat_per_100g_g: 0,
      trans_fat_per_100g_g: 0,
      protein_per_100g_g: 0,
    },
    ingredients: [
      'carbonated water',
      'high fructose corn syrup',
      'sugar',
      'caramel colour (INS 150d)',
      'acidity regulator (INS 338)',
      'caffeine (32mg/100ml)',
      'sucralose',
    ],
    claims: ['Instant Energy Kick', 'Low Calorie Formula'],
    fssai_license_number: '10012044000188',
    batch_number: 'DEMO-BATCH-002',
    manufacturing_date: '2026-07-20',
    expiry_date: '2027-01-20',
    manufacturer_name: 'Spark Beverages & Bottling Ltd',
  },
  {
    product_id: 'DEMO-P004',
    product_name: 'OrchardPure 100% Orange Juice',
    brand: 'SunFresh Juices',
    category: 'Packaged juice',
    description: 'Pure sunshine in a bottle squeezed from ripened Mediterranean oranges.',
    package_unit: 'ml',
    nutrition: {
      serving_size_g: 150,
      package_size_g: 1000,
      energy_kcal_per_100g: 46,
      sugar_per_serving_g: 13.5,
      sugar_per_100g_g: 9.0,
      added_sugar_per_100g_g: 0,
      salt_per_100g_g: 0.02,
      sodium_mg_per_100g: 8,
      fat_per_100g_g: 0.2,
      saturated_fat_per_100g_g: 0,
      trans_fat_per_100g_g: 0,
      protein_per_100g_g: 0.7,
      fiber_per_100g_g: 0.4,
    },
    ingredients: [
      'reconstituted orange juice from concentrate (99.8%)',
      'citric acid',
      'natural orange aroma',
    ],
    claims: ['100% Pure Fruit Juice', 'No Preservatives', 'No Added Sugar'],
    fssai_license_number: '10018051002390',
    batch_number: 'DEMO-BATCH-003',
    manufacturing_date: '2026-08-01',
    expiry_date: '2027-02-01',
    manufacturer_name: 'SunFresh Orchard Agro Processing Ltd',
  },
  {
    product_id: 'DEMO-P005',
    product_name: 'ProPeak Dark Choco Protein Bar',
    brand: 'ActiveFuel Nutrition',
    category: 'Snack',
    description: 'Dense 20g whey protein snack bar sweetened with plant stevia and prebiotic fiber.',
    package_unit: 'g',
    nutrition: {
      serving_size_g: 60,
      package_size_g: 60,
      energy_kcal_per_100g: 360,
      sugar_per_serving_g: 1.2,
      sugar_per_100g_g: 2.0,
      added_sugar_per_100g_g: 0,
      salt_per_100g_g: 0.4,
      sodium_mg_per_100g: 160,
      fat_per_100g_g: 11.5,
      saturated_fat_per_100g_g: 4.0,
      trans_fat_per_100g_g: 0,
      protein_per_100g_g: 33.3, // 20g in 60g bar
      fiber_per_100g_g: 16.0,
    },
    ingredients: [
      'whey protein isolate',
      'milk protein concentrate',
      'almond butter',
      'polydextrose (dietary fiber)',
      'unsweetened chocolate',
      'erythritol',
      'stevia leaf extract',
    ],
    claims: ['High Protein 20g', 'No Added Sugar', 'Keto Friendly', 'High Fibre'],
    fssai_license_number: '10021021000789',
    batch_number: 'DEMO-BATCH-003',
    manufacturing_date: '2026-07-28',
    expiry_date: '2027-07-28',
    manufacturer_name: 'ActiveFuel Nutrition Bio-Labs India Pvt Ltd',
  },
  {
    product_id: 'DEMO-P006',
    product_name: 'Crispy Masala Potato Chips',
    brand: 'DesiTreats',
    category: 'Snack',
    description: 'Thinly sliced crispy kettle potato wafers dusted with spicy chatpata masala.',
    package_unit: 'g',
    nutrition: {
      serving_size_g: 20,
      package_size_g: 80,
      energy_kcal_per_100g: 542,
      sugar_per_serving_g: 0.8,
      sugar_per_100g_g: 4.0,
      added_sugar_per_100g_g: 2.0,
      salt_per_100g_g: 2.2, // Very high salt!
      sodium_mg_per_100g: 880,
      fat_per_100g_g: 34.0,
      saturated_fat_per_100g_g: 14.5,
      trans_fat_per_100g_g: 0.1,
      protein_per_100g_g: 6.8,
      fiber_per_100g_g: 3.5,
    },
    ingredients: [
      'potatoes (62%)',
      'palmolein oil',
      'spices & condiments (chilli powder, dry mango powder, onion powder, garlic powder)',
      'iodised salt',
      'flavour enhancers (INS 627, INS 631)',
    ],
    claims: ['Made with 100% Farm Potatoes', 'Zero Trans Fat'],
    fssai_license_number: '10016012001155',
    batch_number: 'DEMO-BATCH-001',
    manufacturing_date: '2026-08-05',
    expiry_date: '2026-12-05',
    manufacturer_name: 'DesiTreats Traditional Snacks & Namkeen Pvt Ltd',
  },
];

export const INITIAL_BATCHES: ProductBatch[] = [
  {
    batch_id: 'DEMO-BATCH-001',
    product_id: 'DEMO-P001',
    product_name: 'ChocoCrunch Filled Biscuits',
    batch_number: 'BATCH-2026-07-001',
    manufacturing_date: '2026-07-01',
    expiry_date: '2027-04-01',
    status: 'ACTIVE',
    total_units: 12,
  },
  {
    batch_id: 'DEMO-BATCH-002',
    product_id: 'DEMO-P003',
    product_name: 'PowerBoost Intense Energy Cola',
    batch_number: 'BATCH-2026-07-002',
    manufacturing_date: '2026-07-20',
    expiry_date: '2027-01-20',
    status: 'RECALLED',
    recall_reason: 'Quality audit: Caffeine concentration exceeding permissible labeling limits & seal integrity check.',
    recalled_at: '2026-08-10T14:30:00Z',
    total_units: 8,
  },
  {
    batch_id: 'DEMO-BATCH-003',
    product_id: 'DEMO-P004',
    product_name: 'OrchardPure 100% Orange Juice',
    batch_number: 'BATCH-2026-08-003',
    manufacturing_date: '2026-08-01',
    expiry_date: '2027-02-01',
    status: 'ACTIVE',
    total_units: 10,
  },
];

export const INITIAL_UNITS: SerializedUnit[] = [
  // Units for Batch 001
  {
    unit_id: 'UNIT-001',
    product_id: 'DEMO-P001',
    batch_id: 'DEMO-BATCH-001',
    unique_code: 'LTE-UNIT-001-A9F2',
    created_at: '2026-07-01T08:00:00Z',
    status: 'ACTIVE',
    scan_count: 0,
  },
  {
    unit_id: 'UNIT-002',
    product_id: 'DEMO-P001',
    batch_id: 'DEMO-BATCH-001',
    unique_code: 'LTE-UNIT-002-B8E3',
    created_at: '2026-07-01T08:00:00Z',
    status: 'ACTIVE',
    scan_count: 1,
    first_scanned_at: '2026-08-19T04:30:00Z',
    last_scanned_at: '2026-08-19T04:30:00Z',
    first_session_id: 'demo-session-judge-1',
  },
  {
    unit_id: 'UNIT-003',
    product_id: 'DEMO-P001',
    batch_id: 'DEMO-BATCH-001',
    unique_code: 'LTE-UNIT-003-C7D4',
    created_at: '2026-07-01T08:00:00Z',
    status: 'FLAGGED',
    scan_count: 5,
    first_scanned_at: '2026-08-18T10:15:00Z',
    last_scanned_at: '2026-08-19T03:10:00Z',
    first_session_id: 'suspicious-external-device-98',
  },
  {
    unit_id: 'UNIT-004',
    product_id: 'DEMO-P002',
    batch_id: 'DEMO-BATCH-001',
    unique_code: 'LTE-UNIT-004-D6C5',
    created_at: '2026-07-01T08:00:00Z',
    status: 'ACTIVE',
    scan_count: 0,
  },
  {
    unit_id: 'UNIT-005',
    product_id: 'DEMO-P006',
    batch_id: 'DEMO-BATCH-001',
    unique_code: 'LTE-UNIT-005-E5B6',
    created_at: '2026-07-01T08:00:00Z',
    status: 'ACTIVE',
    scan_count: 0,
  },

  // Units for Batch 002 (Recalled Batch)
  {
    unit_id: 'UNIT-010',
    product_id: 'DEMO-P003',
    batch_id: 'DEMO-BATCH-002',
    unique_code: 'LTE-UNIT-010-J0G1',
    created_at: '2026-07-20T09:00:00Z',
    status: 'RECALLED',
    scan_count: 0,
  },
  {
    unit_id: 'UNIT-011',
    product_id: 'DEMO-P003',
    batch_id: 'DEMO-BATCH-002',
    unique_code: 'LTE-UNIT-011-K1F2',
    created_at: '2026-07-20T09:00:00Z',
    status: 'RECALLED',
    scan_count: 1,
    first_scanned_at: '2026-08-11T12:00:00Z',
  },

  // Units for Batch 003
  {
    unit_id: 'UNIT-020',
    product_id: 'DEMO-P004',
    batch_id: 'DEMO-BATCH-003',
    unique_code: 'LTE-UNIT-020-T0A9',
    created_at: '2026-08-01T10:00:00Z',
    status: 'ACTIVE',
    scan_count: 0,
  },
  {
    unit_id: 'UNIT-021',
    product_id: 'DEMO-P005',
    batch_id: 'DEMO-BATCH-003',
    unique_code: 'LTE-UNIT-021-U1B8',
    created_at: '2026-08-01T10:00:00Z',
    status: 'ACTIVE',
    scan_count: 0,
  },
];

export const INITIAL_SCAN_EVENTS: ScanEvent[] = [
  {
    event_id: 'EVT-001',
    unit_code: 'LTE-UNIT-002-B8E3',
    product_id: 'DEMO-P001',
    batch_id: 'DEMO-BATCH-001',
    session_id: 'demo-session-judge-1',
    ip_pseudo: '192.168.1.42',
    scanned_at: '2026-08-19T04:30:00Z',
    result_status: 'FIRST_SCAN_VERIFIED',
    message: 'First recorded scan for unit LTE-UNIT-002-B8E3.',
    risk_level: 'low',
  },
  {
    event_id: 'EVT-002',
    unit_code: 'LTE-UNIT-003-C7D4',
    product_id: 'DEMO-P001',
    batch_id: 'DEMO-BATCH-001',
    session_id: 'suspicious-external-device-98',
    ip_pseudo: '203.0.113.19',
    scanned_at: '2026-08-18T10:15:00Z',
    result_status: 'FIRST_SCAN_VERIFIED',
    message: 'First scan from remote location.',
    risk_level: 'low',
  },
  {
    event_id: 'EVT-003',
    unit_code: 'LTE-UNIT-003-C7D4',
    product_id: 'DEMO-P001',
    batch_id: 'DEMO-BATCH-001',
    session_id: 'suspicious-external-device-104',
    ip_pseudo: '198.51.100.77',
    scanned_at: '2026-08-19T03:10:00Z',
    result_status: 'SUSPICIOUS_DUPLICATE_REUSE',
    message: 'Code rescanned across divergent IP subnet & user session.',
    risk_level: 'high',
  },
];

// In-Memory Database Store with helper operations
class DatabaseStore {
  private products: Map<string, Product> = new Map();
  private batches: Map<string, ProductBatch> = new Map();
  private units: Map<string, SerializedUnit> = new Map();
  private scanEvents: ScanEvent[] = [];
  private fssaiRecords: Map<string, CuratedFssaiRecord> = new Map();
  private ingredientAliases: IngredientAliasKnowledge[] = [];

  constructor() {
    this.reset();
  }

  public reset() {
    this.products.clear();
    INITIAL_PRODUCTS.forEach((p) => this.products.set(p.product_id, { ...p }));

    this.batches.clear();
    INITIAL_BATCHES.forEach((b) => this.batches.set(b.batch_id, { ...b }));

    this.units.clear();
    INITIAL_UNITS.forEach((u) => this.units.set(u.unique_code, { ...u }));

    this.scanEvents = [...INITIAL_SCAN_EVENTS];

    this.fssaiRecords.clear();
    Object.values(CURATED_FSSAI_REGISTRY).forEach((r) =>
      this.fssaiRecords.set(r.license_number, { ...r })
    );

    this.ingredientAliases = [...INGREDIENT_KNOWLEDGE_BASE];
  }

  // Products
  public getProducts(): Product[] {
    return Array.from(this.products.values());
  }

  public getProductById(productId: string): Product | undefined {
    return this.products.get(productId);
  }

  public saveProduct(product: Product): Product {
    this.products.set(product.product_id, product);
    return product;
  }

  // Batches
  public getBatches(): ProductBatch[] {
    return Array.from(this.batches.values());
  }

  public getBatchById(batchId: string): ProductBatch | undefined {
    return this.batches.get(batchId);
  }

  public setBatchStatus(batchId: string, status: 'ACTIVE' | 'RECALLED' | 'EXPIRED', reason?: string): ProductBatch | undefined {
    const batch = this.batches.get(batchId);
    if (!batch) return undefined;

    batch.status = status;
    if (status === 'RECALLED') {
      batch.recall_reason = reason || 'Batch flagged for active regulatory recall.';
      batch.recalled_at = new Date().toISOString();
    } else {
      batch.recall_reason = undefined;
      batch.recalled_at = undefined;
    }

    // Update status of all associated units
    for (const unit of this.units.values()) {
      if (unit.batch_id === batchId) {
        unit.status = status === 'RECALLED' ? 'RECALLED' : 'ACTIVE';
      }
    }

    return batch;
  }

  // Units
  public getUnits(): SerializedUnit[] {
    return Array.from(this.units.values());
  }

  public getUnitByCode(code: string): SerializedUnit | undefined {
    const trimmed = code.trim();
    // Direct match or partial match
    return this.units.get(trimmed) || Array.from(this.units.values()).find((u) => u.unique_code.toLowerCase() === trimmed.toLowerCase() || u.unit_id.toLowerCase() === trimmed.toLowerCase());
  }

  public createUnit(unit: SerializedUnit): SerializedUnit {
    this.units.set(unit.unique_code, unit);
    const batch = this.batches.get(unit.batch_id);
    if (batch) {
      batch.total_units += 1;
    }
    return unit;
  }

  // Scan Events & Verification Logic
  public recordScan(
    unitCode: string,
    sessionId: string,
    ipPseudo: string = '127.0.0.1'
  ): {
    status: 'VERIFIED' | 'ALREADY_VERIFIED' | 'POSSIBLE_DUPLICATE' | 'RECALLED_BATCH' | 'INVALID_CODE';
    unit?: SerializedUnit;
    product?: Product;
    batch?: ProductBatch;
    event?: ScanEvent;
    explainability: { why: string; evidence: string; recommendation: string };
  } {
    const unit = this.getUnitByCode(unitCode);

    if (!unit) {
      return {
        status: 'INVALID_CODE',
        explainability: {
          why: 'This QR / serialization code is not recognized in the system registry.',
          evidence: `Input code: "${unitCode}" was not found in registered units.`,
          recommendation: 'Check the QR code or verify if the packaging has an authorized Label Truth Engine tag.',
        },
      };
    }

    const product = this.getProductById(unit.product_id);
    const batch = this.getBatchById(unit.batch_id);
    const now = new Date().toISOString();

    // Check if batch is recalled first
    if (batch && batch.status === 'RECALLED') {
      const event: ScanEvent = {
        event_id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        unit_code: unit.unique_code,
        product_id: unit.product_id,
        batch_id: unit.batch_id,
        session_id: sessionId,
        ip_pseudo: ipPseudo,
        scanned_at: now,
        result_status: 'RECALLED_BATCH',
        message: `Scanned unit belongs to recalled batch ${batch.batch_number}`,
        risk_level: 'high',
      };
      this.scanEvents.unshift(event);

      return {
        status: 'RECALLED_BATCH',
        unit,
        product,
        batch,
        event,
        explainability: {
          why: 'This product unit belongs to a production batch that has been officially RECALLED.',
          evidence: `Batch ID: ${batch.batch_id} (${batch.batch_number}). Recall Reason: ${batch.recall_reason || 'Product quality/safety recall'}. Recalled on: ${batch.recalled_at || 'Recent'}.`,
          recommendation: 'DO NOT CONSUME. Return product to point of purchase or contact the manufacturer immediately.',
        },
      };
    }

    // Case A: First Scan
    if (unit.scan_count === 0) {
      unit.scan_count = 1;
      unit.first_scanned_at = now;
      unit.last_scanned_at = now;
      unit.first_session_id = sessionId;

      const event: ScanEvent = {
        event_id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        unit_code: unit.unique_code,
        product_id: unit.product_id,
        batch_id: unit.batch_id,
        session_id: sessionId,
        ip_pseudo: ipPseudo,
        scanned_at: now,
        result_status: 'FIRST_SCAN_VERIFIED',
        message: 'First recorded scan. Product authenticity validated.',
        risk_level: 'low',
      };
      this.scanEvents.unshift(event);

      return {
        status: 'VERIFIED',
        unit,
        product,
        batch,
        event,
        explainability: {
          why: 'First recorded verification scan for this specific serialized package unit.',
          evidence: `Unique Code: ${unit.unique_code}. Total recorded scans: 1. Unit created at ${unit.created_at}.`,
          recommendation: 'Package seal and digital certificate match. Enjoy your product!',
        },
      };
    }

    // Case B: Same User / Session scans again
    if (unit.first_session_id === sessionId) {
      unit.scan_count += 1;
      unit.last_scanned_at = now;

      const event: ScanEvent = {
        event_id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        unit_code: unit.unique_code,
        product_id: unit.product_id,
        batch_id: unit.batch_id,
        session_id: sessionId,
        ip_pseudo: ipPseudo,
        scanned_at: now,
        result_status: 'REPEAT_SCAN_SAME_SESSION',
        message: 'Repeat scan by the same session/device.',
        risk_level: 'low',
      };
      this.scanEvents.unshift(event);

      return {
        status: 'ALREADY_VERIFIED',
        unit,
        product,
        batch,
        event,
        explainability: {
          why: 'This product unit was already scanned by your device/session.',
          evidence: `First scanned by you on ${unit.first_scanned_at}. Total scans: ${unit.scan_count}.`,
          recommendation: 'This is expected when re-checking your own purchased package.',
        },
      };
    }

    // Case C: Suspicious Duplicate Reuse (Scanned by a different session / multiple scans)
    unit.scan_count += 1;
    unit.last_scanned_at = now;
    unit.status = 'FLAGGED';

    const event: ScanEvent = {
      event_id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      unit_code: unit.unique_code,
      product_id: unit.product_id,
      batch_id: unit.batch_id,
      session_id: sessionId,
      ip_pseudo: ipPseudo,
      scanned_at: now,
      result_status: 'SUSPICIOUS_DUPLICATE_REUSE',
      message: 'Suspicious duplicate scan detected across different user sessions/environments.',
      risk_level: 'high',
    };
    this.scanEvents.unshift(event);

    return {
      status: 'POSSIBLE_DUPLICATE',
      unit,
      product,
      batch,
      event,
      explainability: {
        why: 'This unique serialized code was previously scanned from a different device or session.',
        evidence: `Unit first scanned on: ${unit.first_scanned_at}. Current scan count: ${unit.scan_count}. First session: ${unit.first_session_id || 'Unknown'}. Current session: ${sessionId}.`,
        recommendation: 'The QR code may have been copied, cloned, or packaging reused. Verify physical tamper seals carefully.',
      },
    };
  }

  public getScanEvents(): ScanEvent[] {
    return this.scanEvents;
  }

  // FSSAI
  public getFssaiRecord(licenseNumber: string): CuratedFssaiRecord | undefined {
    return this.fssaiRecords.get(licenseNumber.trim());
  }

  public getIngredientKnowledgeBase(): IngredientAliasKnowledge[] {
    return this.ingredientAliases;
  }
}

export const db = new DatabaseStore();
