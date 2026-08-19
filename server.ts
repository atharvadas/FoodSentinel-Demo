import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { TruthEngine } from './server/engine';
import { extractFoodLabelData } from './server/geminiOcr';
import { runAutomatedTestSuite } from './server/tests';
import { Product } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // API ROUTES

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Label Truth Engine API' });
  });

  // Get all products
  app.get('/api/products', (req, res) => {
    try {
      const products = db.getProducts();
      res.json({ success: true, products });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get single product with full Truth Engine analysis
  app.get('/api/products/:id', (req, res) => {
    try {
      const product = db.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      const report = TruthEngine.analyze(product);
      res.json({ success: true, product, report });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Add / save product
  app.post('/api/products', (req, res) => {
    try {
      const productData = req.body as Product;
      if (!productData.product_name) {
        return res.status(400).json({ success: false, error: 'Product name is required' });
      }
      if (!productData.product_id) {
        productData.product_id = `PROD-${Date.now()}`;
      }
      const saved = db.saveProduct(productData);
      const report = TruthEngine.analyze(saved);
      res.json({ success: true, product: saved, report });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Analyze raw product data (from OCR or manual editor)
  app.post('/api/analyze', (req, res) => {
    try {
      const product = req.body as Product;
      const report = TruthEngine.analyze(product);
      res.json({ success: true, report });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // OCR Label Extraction
  app.post('/api/ocr/extract', async (req, res) => {
    try {
      const { image, mimeType } = req.body;
      if (!image) {
        return res.status(400).json({ success: false, error: 'Image base64 data is required' });
      }
      const extracted = await extractFoodLabelData(image, mimeType || 'image/jpeg');
      res.json({ success: true, extracted });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Compare 2 Products
  app.post('/api/compare', (req, res) => {
    try {
      const { product_a_id, product_b_id, product_a, product_b } = req.body;
      const pA = product_a || db.getProductById(product_a_id);
      const pB = product_b || db.getProductById(product_b_id);

      if (!pA || !pB) {
        return res
          .status(400)
          .json({ success: false, error: 'Both products are required for comparison' });
      }

      const comparison = TruthEngine.compare(pA, pB);
      res.json({ success: true, comparison });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // QR / Serialization Code Verification
  app.post('/api/verify-qr', (req, res) => {
    try {
      const { code, session_id } = req.body;
      if (!code) {
        return res.status(400).json({ success: false, error: 'QR Code is required' });
      }

      const sessionId = session_id || 'anonymous-session';
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

      const scanResult = db.recordScan(code, sessionId, ip);
      res.json({ success: true, result: scanResult });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Batches
  app.get('/api/batches', (req, res) => {
    try {
      const batches = db.getBatches();
      res.json({ success: true, batches });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Change batch status (Recall trigger / Active)
  app.post('/api/batches/:id/status', (req, res) => {
    try {
      const { status, recall_reason } = req.body;
      if (!status || !['ACTIVE', 'RECALLED', 'EXPIRED'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid batch status' });
      }
      const updated = db.setBatchStatus(req.params.id, status, recall_reason);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Batch not found' });
      }
      res.json({ success: true, batch: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Units
  app.get('/api/units', (req, res) => {
    try {
      const units = db.getUnits();
      res.json({ success: true, units });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/units', (req, res) => {
    try {
      const { product_id, batch_id, unique_code } = req.body;
      if (!product_id || !batch_id) {
        return res.status(400).json({ success: false, error: 'Product ID and Batch ID required' });
      }
      const code = unique_code || `LTE-UNIT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const newUnit = db.createUnit({
        unit_id: `UNIT-${Date.now().toString(36).toUpperCase()}`,
        product_id,
        batch_id,
        unique_code: code,
        created_at: new Date().toISOString(),
        status: 'ACTIVE',
        scan_count: 0,
      });
      res.json({ success: true, unit: newUnit });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Scan Events
  app.get('/api/scan-events', (req, res) => {
    try {
      const events = db.getScanEvents();
      res.json({ success: true, events });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Curated FSSAI Record Lookup
  app.get('/api/fssai/:license', (req, res) => {
    try {
      const record = db.getFssaiRecord(req.params.license);
      res.json({ success: true, record: record || null, is_curated_match: !!record });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Automated Test Suite Runner
  app.get('/api/tests/run', (req, res) => {
    try {
      const testResults = runAutomatedTestSuite();
      res.json({ success: true, suite: testResults });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Reset Demo Database (Instant reload for live presentations)
  app.post('/api/reset-demo', (req, res) => {
    try {
      db.reset();
      res.json({ success: true, message: 'Database reset to clean demo seed state' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // VITE MIDDLEWARE
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Label Truth Engine Server running on port ${PORT}`);
  });
}

startServer();
