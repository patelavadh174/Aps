import { query } from '../config/db.js';
import { created, ok } from '../utils/respond.js';

export async function listPages(req, res) {
  const rows = await query('SELECT * FROM pages ORDER BY slug ASC');
  ok(res, { pages: rows });
}

export async function upsertPage(req, res) {
  const { slug, title, metaDescription, status } = req.body;
  await query(
    `INSERT INTO pages (slug, title, meta_description, status)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title), meta_description = VALUES(meta_description), status = VALUES(status)`,
    [slug, title, metaDescription || '', status || 'published']
  );
  created(res, null, 'Page saved');
}

export async function listPricing(req, res) {
  const rows = await query("SELECT * FROM pricing_plans WHERE status = 'active' ORDER BY display_order ASC");
  ok(res, { pricing: rows });
}

export async function savePricing(req, res) {
  const { name, description, priceLabel, featureList, displayOrder } = req.body;
  const result = await query(
    `INSERT INTO pricing_plans (name, description, price_label, feature_list, display_order, status)
     VALUES (?, ?, ?, ?, ?, 'active')`,
    [name, description || '', priceLabel || 'Custom', featureList || '', displayOrder || 100]
  );
  created(res, { id: result.insertId }, 'Pricing plan created');
}

export async function listFaqs(req, res) {
  const rows = await query("SELECT * FROM faqs WHERE status = 'active' ORDER BY display_order ASC");
  ok(res, { faqs: rows });
}

export async function saveFaq(req, res) {
  const { question, answer, category, displayOrder } = req.body;
  const result = await query(
    `INSERT INTO faqs (question, answer, category, display_order, status)
     VALUES (?, ?, ?, ?, 'active')`,
    [question, answer, category || 'General', displayOrder || 100]
  );
  created(res, { id: result.insertId }, 'FAQ created');
}
