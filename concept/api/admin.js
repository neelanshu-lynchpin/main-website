// Vercel function behind the hosted admin (/admin). One team password (ADMIN_PASSWORD) opens it;
// a signed cookie keeps people signed in for 30 days. Data lives in the same MongoDB as the
// contact form and the scout: collections leads, prospects, products and quotes.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { MongoClient, ObjectId } from 'mongodb';

let client; // reused across requests while the function stays warm

const COLLECTIONS = ['leads', 'prospects', 'products', 'quotes', 'contracts'];
const TEAM = ['Neelanshu', 'Prashant', 'Khushi'];
const COOKIE = 'lp_admin';
const DAYS = 30;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return res.status(503).json({ error: 'The admin password is not set up yet.' });
  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body || {};

  if (body.op === 'login') {
    if (!TEAM.includes(body.name) || !same(String(body.password || ''), secret)) {
      await new Promise((r) => setTimeout(r, 800)); // slows down password guessing
      return res.status(401).json({ error: 'That password is not right.' });
    }
    const exp = Date.now() + DAYS * 864e5;
    const token = `${body.name}.${exp}.${sign(`${body.name}.${exp}`, secret)}`;
    res.setHeader('Set-Cookie', `${COOKIE}=${token}; Path=/api/admin; Max-Age=${DAYS * 86400}; HttpOnly; Secure; SameSite=Strict`);
    return res.status(200).json({ name: body.name });
  }
  if (body.op === 'logout') {
    res.setHeader('Set-Cookie', `${COOKIE}=; Path=/api/admin; Max-Age=0; HttpOnly; Secure; SameSite=Strict`);
    return res.status(200).json({ ok: true });
  }

  const name = signedIn(req, secret);
  if (!name) return res.status(401).json({ error: 'Sign in first.' });
  if (body.op === 'me') return res.status(200).json({ name });

  if (!COLLECTIONS.includes(body.col)) return res.status(400).json({ error: 'Unknown collection.' });
  try {
    client ||= new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    const col = client.db(process.env.MONGODB_DB || 'lynchpin').collection(body.col);
    const data = clean(body.data);
    switch (body.op) {
      case 'list': {
        const docs = await col.find({}).limit(5000).toArray();
        return res.status(200).json({ docs: docs.map(({ _id, ...d }) => ({ id: String(_id), ...d })) });
      }
      case 'add': {
        const id = Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
        await col.insertOne({ _id: id, ...data });
        return res.status(200).json({ id });
      }
      case 'set':
        await col.replaceOne(byId(body.id), data, { upsert: true });
        return res.status(200).json({ ok: true });
      case 'update':
        await col.updateOne(byId(body.id), { $set: data });
        return res.status(200).json({ ok: true });
      case 'delete':
        await col.deleteOne(byId(body.id));
        return res.status(200).json({ ok: true });
      default:
        return res.status(400).json({ error: 'Unknown operation.' });
    }
  } catch (e) {
    console.error('admin', body.op, body.col, e.message);
    return res.status(500).json({ error: 'The database did not answer.' });
  }
}

/* Website enquiries get MongoDB ObjectIds; everything else uses string ids */
function byId(id) {
  id = String(id || '');
  return /^[a-f0-9]{24}$/.test(id) ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
}
function clean(d) {
  if (!d || typeof d !== 'object' || Array.isArray(d)) return {};
  const { _id, id, ...rest } = d;
  return rest;
}
function signedIn(req, secret) {
  const m = (req.headers.cookie || '').match(new RegExp(`(?:^|; )${COOKIE}=([^;]+)`));
  if (!m) return null;
  const [name, exp, sig] = m[1].split('.');
  if (!TEAM.includes(name) || !(+exp > Date.now())) return null;
  return same(sig || '', sign(`${name}.${exp}`, secret)) ? name : null;
}
function sign(s, secret) {
  return createHmac('sha256', 'lynchpin-admin:' + secret).update(s).digest('base64url');
}
function same(a, b) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
function safeJson(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
