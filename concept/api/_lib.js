// Shared by the API functions (the leading _ keeps Vercel from serving this file as a route).
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

let client; // reused across requests while a function stays warm

export function db() {
  client ||= new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  return client.db(process.env.MONGODB_DB || 'lynchpin');
}

export function safeJson(s) {
  try { return JSON.parse(s); } catch { return {}; }
}

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Email through a Gmail account (SMTP_USER + SMTP_PASS, a Gmail app password).
   Does nothing until those are set, so the site works the same without them. */
export async function sendMail(to, subject, html) {
  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS || !to) return false;
  const t = nodemailer.createTransport({ service: 'gmail', auth: { user: SMTP_USER, pass: SMTP_PASS } });
  await t.sendMail({ from: `Lynchpin website <${SMTP_USER}>`, to, subject, html });
  return true;
}
