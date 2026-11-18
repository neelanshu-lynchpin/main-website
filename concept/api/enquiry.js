// Vercel function behind the site's contact form. Saves each request as a new lead in MongoDB
// ("leads" collection, same shape as the admin's leads). Needs the MONGODB_URI environment variable.
import { MongoClient } from 'mongodb';

let client; // reused across requests while the function stays warm

const LIMITS = { name: 120, phone: 30, company: 160, city: 80, kind: 40, note: 2000 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body || {};

  // The hidden "website" field is only ever filled in by bots: accept quietly, save nothing
  if (body.website) return res.status(200).json({ ok: true });

  const f = {};
  for (const [k, max] of Object.entries(LIMITS)) f[k] = String(body[k] || '').trim().slice(0, max);
  if (!f.name || !f.company || !f.city || f.phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'Name, phone, company and city are needed.' });
  }

  try {
    client ||= new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    const now = new Date().toISOString();
    await client.db(process.env.MONGODB_DB || 'lynchpin').collection('leads').insertOne({
      company: f.company, contact: f.name, phone: f.phone, city: f.city,
      item: f.kind, notes: f.note, value: 0, stage: 'new', owner: '',
      source: 'Website', createdAt: now, updatedAt: now,
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('enquiry not saved:', e.message);
    return res.status(500).json({ error: 'Could not save the request.' });
  }
}

function safeJson(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
