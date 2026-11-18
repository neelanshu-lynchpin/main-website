// Public, no sign-in. Only what the website needs to show visitors:
//   GET  ?type=certificate&id=…  one carbon certificate, for its printable page (/certificate?id=…)
//   GET  ?type=reviews           published client reviews, for the home page
//   GET  ?type=photo&id=…        one case study photo
//   POST {type:'review', …}      a client's review from /review; the team publishes it from the admin
import { db, safeJson, esc, sendMail } from './_lib.js';

const ID = /^[A-Za-z0-9_-]{6,40}$/;

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') return await review(req, res);
    const { type, id } = req.query || {};
    if (type === 'certificate') {
      if (!ID.test(id || '')) return res.status(404).json({ error: 'Not found' });
      const c = await db().collection('certificates').findOne({ _id: id, revoked: { $ne: true } });
      if (!c) return res.status(404).json({ error: 'Not found' });
      res.setHeader('Cache-Control', 'public, max-age=300');
      const { company, city, date, chairs, sofas, workstations, pedestals, other, co2Kg, number } = c;
      return res.status(200).json({ id, number, company, city, date, chairs, sofas, workstations, pedestals, other, co2Kg });
    }
    if (type === 'reviews') {
      const list = await db().collection('reviews').find({ published: true }).sort({ date: -1 }).limit(24).toArray();
      res.setHeader('Cache-Control', 'public, max-age=300');
      return res.status(200).json({ reviews: list.map((r) => ({ name: r.name, role: r.role, company: r.company, quote: r.quote, rating: r.rating, date: r.date })) });
    }
    if (type === 'photo') {
      if (!ID.test(id || '')) return res.status(404).end();
      const p = await db().collection('casePhotos').findOne({ _id: id });
      const m = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(p?.data || '');
      if (!m) return res.status(404).end();
      res.setHeader('Content-Type', m[1]);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.status(200).send(Buffer.from(m[2], 'base64'));
    }
    return res.status(400).json({ error: 'Unknown request' });
  } catch (e) {
    console.error('public', e.message);
    return res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
}

async function review(req, res) {
  const b = typeof req.body === 'string' ? safeJson(req.body) : req.body || {};
  if (b.type !== 'review') return res.status(400).json({ error: 'Unknown request' });
  if (b.website) return res.status(200).json({ ok: true }); // bot trap
  const r = {
    name: String(b.name || '').trim().slice(0, 80), role: String(b.role || '').trim().slice(0, 80),
    company: String(b.company || '').trim().slice(0, 120), quote: String(b.quote || '').trim().slice(0, 1200),
    rating: Math.max(1, Math.min(5, Math.round(+b.rating || 5))), permission: !!b.permission,
  };
  if (!r.name || !r.company || r.quote.length < 10) return res.status(400).json({ error: 'Add your name, company and a few words about the work.' });
  const now = new Date().toISOString();
  await db().collection('reviews').insertOne({ _id: Math.random().toString(36).slice(2, 12) + Date.now().toString(36), ...r, published: false, source: 'Website form', date: now.slice(0, 10), createdAt: now, updatedAt: now });
  try {
    await sendMail(process.env.ALERT_TO, `New review from ${r.company} (${r.rating}/5)`,
      `<div style="font:15px Arial,sans-serif"><p><b>${esc(r.name)}</b>, ${esc(r.role)} at ${esc(r.company)} gave <b>${r.rating}/5</b>:</p><blockquote style="border-left:3px solid #E3181F;margin:0;padding-left:12px">${esc(r.quote)}</blockquote><p>${r.permission ? 'They agreed to show it on the website. Publish it from Admin → Marketing → Reviews.' : 'They did not agree to show it on the website.'}</p></div>`);
  } catch (e) { console.error('review email failed:', e.message); }
  return res.status(200).json({ ok: true });
}
