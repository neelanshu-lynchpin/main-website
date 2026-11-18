// Vercel function behind the site's forms: the contact form, the service booking page (/book,
// reached from the QR sticker) and the free audit (/audit). Each request is saved as a new lead in
// MongoDB ("leads", same shape as the admin's leads) and, when email is set up, ALERT_TO gets an email.
import { db, safeJson, esc, sendMail } from './_lib.js';

const LIMITS = { name: 120, phone: 30, company: 160, city: 80, kind: 40, note: 2000, location: 160, pieces: 10, date: 10, email: 120 };
const SOURCES = { contact: 'Website', book: 'Service booking', audit: 'Free audit' };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body || {};

  // The hidden "website" field is only ever filled in by bots: accept quietly, save nothing
  if (body.website) return res.status(200).json({ ok: true });

  const f = {};
  for (const [k, max] of Object.entries(LIMITS)) f[k] = String(body[k] || '').trim().slice(0, max);
  const form = SOURCES[body.form] ? body.form : 'contact';
  const needCity = form !== 'book';
  if (!f.name || !f.company || (needCity && !f.city) || f.phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: needCity ? 'Name, phone, company and city are needed.' : 'Name, phone and company are needed.' });
  }

  // The audit sends its numbers; keep them on the lead so the team sees the size of the job
  const audit = form === 'audit' && body.audit && typeof body.audit === 'object'
    ? Object.fromEntries(Object.entries(body.audit).slice(0, 12).map(([k, v]) => [String(k).slice(0, 30), Math.max(0, Math.min(100000, +v || 0))]))
    : null;
  const notes = [
    f.note,
    f.location && 'Where: ' + f.location,
    f.pieces && 'Pieces: ' + f.pieces,
    f.date && 'Preferred date: ' + f.date,
    audit && 'Audit: ' + Object.entries(audit).map(([k, v]) => `${k} ${v}`).join(', '),
  ].filter(Boolean).join('\n');
  const item = form === 'book' ? `Service booking: ${f.kind || 'repair'}${f.pieces ? ', ' + f.pieces + ' pieces' : ''}`
    : form === 'audit' ? `Free audit: ${audit?.chairs || 0} chairs` : f.kind;
  const value = audit ? Math.round((audit.chairsToFix || 0) * 850) : 0;

  try {
    const now = new Date().toISOString();
    await db().collection('leads').insertOne({
      company: f.company, contact: f.name, phone: f.phone, email: f.email, city: f.city,
      item, notes, value, stage: 'new', owner: '', source: SOURCES[form],
      ...(audit ? { audit } : {}), ...(/^\d{4}-\d{2}-\d{2}$/.test(f.date) ? { nextFollowUp: f.date } : {}),
      createdAt: now, updatedAt: now,
    });
  } catch (e) {
    console.error('enquiry not saved:', e.message);
    return res.status(500).json({ error: 'Could not save the request.' });
  }

  // The alert must never cost the visitor their request, so a mail failure is only logged
  try {
    const rows = [['Company', f.company], ['Name', f.name], ['Phone', f.phone], ['Email', f.email], ['City', f.city], ['Needs', item], ['Details', notes]]
      .filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#5D6168">${k}</td><td style="padding:4px 0"><b>${esc(v).replace(/\n/g, '<br>')}</b></td></tr>`).join('');
    const tel = f.phone.replace(/[^\d+]/g, '');
    await sendMail(process.env.ALERT_TO, `New ${SOURCES[form].toLowerCase()}: ${f.company}`,
      `<div style="font:15px Arial,sans-serif;color:#16181B"><h2 style="margin:0 0 8px">New ${esc(SOURCES[form].toLowerCase())}</h2><p style="margin:0 0 12px">Call within two hours, as the site promises.</p><table>${rows}</table>
      <p style="margin-top:16px"><a href="tel:${esc(tel)}" style="background:#E3181F;color:#fff;padding:10px 16px;text-decoration:none;font-weight:bold">Call ${esc(f.name)}</a></p></div>`);
  } catch (e) {
    console.error('alert email failed:', e.message);
  }
  return res.status(200).json({ ok: true });
}
