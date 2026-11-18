// Builds the public site into dist/ for Vercel: wraps index.html in a full document and copies
// the images it uses, the service pages and blog, the crawler files, and the team admin at /admin.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { SITE, SERVICES, POSTS, businessSchema, servicePage, servicesIndex, postPage, blogIndex, sitemap, robots, llms } from './seo-pages.mjs';
import { bookPage, auditPage, certificatePage, reviewPage } from './client-pages.mjs';

const OUT = 'dist';
// Search results show these two lines: lead with what people type ("office chair repair Bengaluru")
const TITLE = 'Office Furniture Repair in Bengaluru | Chair, Sofa & Workstation Repair | Lynchpin';
const DESCRIPTION = 'Lynchpin repairs office chairs, sofas, workstations and pedestals at your office in Bengaluru and across India. Warranted spares and maintenance contracts. Call +91 90366 15441.';
// The live address lives in seo-pages.mjs. Change it there when the site moves to Lynchpin's own domain.

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);

let page = readFileSync('index.html', 'utf8').replace(/<title>[^<]*<\/title>/, `<title>${TITLE}</title>`);
// Structured data: the business, and the questions answered on the page (read from its FAQ markup)
const strip = (h) => h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const faq = [...page.matchAll(/<details class="qa"><summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map((m) => ({ '@type': 'Question', name: strip(m[1]), acceptedAnswer: { '@type': 'Answer', text: strip(m[2]) } }));
const ld = [businessSchema(), { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Lynchpin Associates', url: SITE + '/' }];
if (faq.length) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq });
const head = [
  '<!doctype html><html lang="en-IN"><head><meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
  `<meta name="description" content="${DESCRIPTION}">`,
  `<link rel="canonical" href="${SITE}/"><meta name="robots" content="index,follow,max-image-preview:large">`,
  '<meta name="geo.region" content="IN-KA"><meta name="geo.placename" content="Bengaluru">',
  '<link rel="alternate" type="text/plain" title="LLM summary" href="/llms.txt">',
  ld.map((x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join(''),
  `<meta property="og:title" content="${TITLE}"><meta property="og:description" content="${DESCRIPTION}">`,
  // Link previews (WhatsApp, LinkedIn, Slack) need an absolute image address
  `<meta property="og:type" content="website"><meta property="og:url" content="${SITE}/"><meta property="og:site_name" content="Lynchpin Associates">`,
  `<meta property="og:image" content="${SITE}/assets/og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">`,
  '<meta property="og:image:alt" content="Lynchpin: office furniture, repaired at your office">',
  `<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${SITE}/assets/og.jpg">`,
  // Browser tab and home-screen icons: the Lynchpin mark
  '<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">',
  '<link rel="icon" type="image/png" sizes="512x512" href="/assets/icon-512.png"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">',
  '<meta name="theme-color" content="#E3181F">',
  // The same small reset the claude.ai preview adds around the page
  '<style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style>',
  '<script>window.LYNCHPIN_LIVE = true;</script>',
  '</head><body>',
].join('');
writeFileSync(`${OUT}/index.html`, head + page + '</body></html>');

// The team admin at /admin: the same page as the claude.ai admin, signed in with the team
// password and reading MongoDB through api/admin.js (admin-live.js stands in for claude.ai)
const admin = readFileSync('admin.html', 'utf8').replace('<script>\n(function(){', '<script src="/admin-live.js"></script>\n<script>\n(function(){');
if (!admin.includes('admin-live.js')) throw new Error('admin.html: could not find where to load admin-live.js');
writeFileSync(`${OUT}/admin.html`, [
  '<!doctype html><html lang="en"><head><meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
  '<meta name="robots" content="noindex,nofollow"><link rel="icon" href="/favicon.ico" sizes="any">',
  '<style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style>',
  '</head><body>',
].join('') + admin + '</body></html>');
cpSync('admin-live.js', `${OUT}/admin-live.js`);

cpSync('assets', `${OUT}/assets`, { recursive: true, filter: (src) => !/[\\/]\.DS_Store$/.test(src) });
cpSync('assets/favicon.ico', `${OUT}/favicon.ico`); // browsers also ask for /favicon.ico directly

// Service pages and the blog (cleanUrls serves services/x.html at /services/x)
mkdirSync(`${OUT}/services`); mkdirSync(`${OUT}/blog`);
writeFileSync(`${OUT}/services.html`, servicesIndex());
SERVICES.forEach((s) => writeFileSync(`${OUT}/services/${s.slug}.html`, servicePage(s)));
writeFileSync(`${OUT}/blog.html`, blogIndex());
POSTS.forEach((p) => writeFileSync(`${OUT}/blog/${p.slug}.html`, postPage(p)));
// Pages for clients: the QR sticker opens /book
writeFileSync(`${OUT}/book.html`, bookPage());
writeFileSync(`${OUT}/audit.html`, auditPage());
writeFileSync(`${OUT}/certificate.html`, certificatePage());
writeFileSync(`${OUT}/review.html`, reviewPage());
// What search engines and AI assistants read first
writeFileSync(`${OUT}/sitemap.xml`, sitemap());
writeFileSync(`${OUT}/robots.txt`, robots());
writeFileSync(`${OUT}/llms.txt`, llms());
console.log('Built', OUT);
