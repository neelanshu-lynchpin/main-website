// Builds the public site into dist/ for Vercel: wraps index.html in a full document and copies
// the images it uses. Only the site goes out: no admin, no demo data, no other folders.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const OUT = 'dist';
const TITLE = 'Lynchpin Associates | Office furniture repair in Bengaluru';
const DESCRIPTION = 'Lynchpin repairs, restores and maintains office chairs, sofas, workstations and pedestals for companies across India.';

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);

let page = readFileSync('index.html', 'utf8').replace(/<title>[^<]*<\/title>/, `<title>${TITLE}</title>`);
const head = [
  '<!doctype html><html lang="en"><head><meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
  `<meta name="description" content="${DESCRIPTION}">`,
  `<meta property="og:title" content="${TITLE}"><meta property="og:description" content="${DESCRIPTION}">`,
  '<meta property="og:image" content="/assets/logo.png"><link rel="icon" href="/assets/logo.png">',
  // The same small reset the claude.ai preview adds around the page
  '<style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style>',
  '<script>window.LYNCHPIN_LIVE = true;</script>',
  '</head><body>',
].join('');
writeFileSync(`${OUT}/index.html`, head + page + '</body></html>');

cpSync('assets', `${OUT}/assets`, { recursive: true, filter: (src) => !/[\\/](demo|\.DS_Store)$/.test(src) });
console.log('Built', OUT);
