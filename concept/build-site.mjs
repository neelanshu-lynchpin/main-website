// Builds the public site into dist/ for Vercel: wraps index.html in a full document and copies
// the images it uses. Only the site goes out: no admin, no demo data, no other folders.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const OUT = 'dist';
const TITLE = 'Lynchpin Associates | Office furniture repair in Bengaluru';
const DESCRIPTION = 'Lynchpin repairs, restores and maintains office chairs, sofas, workstations and pedestals for companies across India.';
// The live address. Change this when the site moves to Lynchpin's own domain.
const SITE = 'https://main-website-concept.vercel.app';

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);

let page = readFileSync('index.html', 'utf8').replace(/<title>[^<]*<\/title>/, `<title>${TITLE}</title>`);
const head = [
  '<!doctype html><html lang="en"><head><meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
  `<meta name="description" content="${DESCRIPTION}">`,
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

cpSync('assets', `${OUT}/assets`, { recursive: true, filter: (src) => !/[\\/](demo|\.DS_Store)$/.test(src) });
cpSync('assets/favicon.ico', `${OUT}/favicon.ico`); // browsers also ask for /favicon.ico directly
console.log('Built', OUT);
