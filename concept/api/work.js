// Case studies, written in the admin and shown at /work (all) and /work/<slug> (one).
// Rendered on the server so search engines read the full page. vercel.json routes the URLs here.
import { db, esc } from './_lib.js';
import { shell, crumbs, SITE } from '../seo-pages.mjs';

const photo = (id) => `/api/public?type=photo&id=${encodeURIComponent(id)}`;
const who = (c) => (c.showClient && c.client ? c.client : c.segment ? `a ${c.segment.toLowerCase()} client` : 'a client') + (c.city ? ` in ${c.city}` : '');

export default async function handler(req, res) {
  const slug = String(req.query?.slug || '').replace(/[^a-z0-9-]/g, '').slice(0, 90);
  try {
    const cases = db().collection('cases');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    if (slug) {
      const c = await cases.findOne({ slug, published: true });
      if (!c) return res.status(404).send(notFound());
      return res.status(200).send(casePage(c));
    }
    const list = await cases.find({ published: true }, { projection: { body: 0 } }).sort({ date: -1 }).limit(60).toArray();
    return res.status(200).send(indexPage(list));
  } catch (e) {
    console.error('work', e.message);
    return res.status(500).send('Something went wrong. Try again in a minute.');
  }
}

function casePage(c) {
  const title = c.title || `Repairing ${c.pieces || 'office furniture'} for ${who(c)}`;
  const desc = `${title}. ${String(c.problem || '').slice(0, 120)}`.slice(0, 158);
  const photos = (c.photos || []).slice(0, 6);
  const facts = [c.pieces, c.days && `${c.days} day${+c.days === 1 ? '' : 's'} on site`, c.city, c.segment].filter(Boolean);
  return shell({
    title: `${title} | Lynchpin case study`, description: desc, path: `/work/${c.slug}`, type: 'article',
    schema: [
      { '@context': 'https://schema.org', '@type': 'Article', headline: title, description: desc, datePublished: c.date, url: `${SITE}/work/${c.slug}`,
        ...(photos[0] ? { image: SITE + photo(photos[0].id) } : {}), author: { '@type': 'Organization', name: 'Lynchpin Associates' }, publisher: { '@id': SITE + '/#business' } },
      crumbs([['Home', '/'], ['Our work', '/work'], [title, `/work/${c.slug}`]]),
    ],
    body: `<article class="wrap post"><p class="crumb"><a href="/">Home</a> / <a href="/work">Our work</a></p>
<h1>${esc(title)}</h1>
<div class="facts">${facts.map((f) => `<span>${esc(f)}</span>`).join('')}</div>
${photos.length ? `<div class="case-photos">${photos.map((p) => `<figure><img src="${photo(p.id)}" alt="${esc(p.label || 'Repair photo')}, ${esc(title)}" loading="lazy" width="1200" height="900"><figcaption>${esc(p.label || '')}</figcaption></figure>`).join('')}</div>` : ''}
<div class="prose">
${c.problem ? `<h2>The problem</h2><p>${esc(c.problem)}</p>` : ''}
${c.work ? `<h2>What we did</h2><p>${esc(c.work)}</p>` : ''}
${c.result ? `<h2>The result</h2><p>${esc(c.result)}</p>` : ''}
</div>
${c.quote ? `<blockquote class="quote">${esc(c.quote)}${c.quoteBy ? `<cite>${esc(c.quoteBy)}</cite>` : ''}</blockquote>` : ''}
<p class="li-note">Have furniture like this? <a href="/book">Book a repair</a> or try the <a href="/audit">free audit</a>.</p>
</article>`,
  });
}

function indexPage(list) {
  return shell({
    title: 'Our Work: Office Furniture Repair Case Studies | Lynchpin',
    description: 'Before and after: office chairs, sofas and workstations Lynchpin has repaired for companies in Bengaluru and across India.',
    path: '/work', schema: [crumbs([['Home', '/'], ['Our work', '/work']])],
    body: `<section class="wrap block"><p class="crumb"><a href="/">Home</a> / Our work</p>
<h1>Our work.</h1><p class="lede">Real jobs, before and after. What was worn, what we replaced, and how long it took.</p>
${list.length ? `<div class="cards big">${list.map((c) => `<a class="card" href="/work/${esc(c.slug)}">${c.photos?.[0] ? `<img src="${photo(c.photos[0].id)}" alt="" width="320" height="240" loading="lazy">` : ''}<small>${esc([c.city, c.segment].filter(Boolean).join(' · '))}</small><b>${esc(c.title || 'Case study')}</b><span>${esc(String(c.problem || '').slice(0, 140))}</span></a>`).join('')}</div>`
      : '<p class="li-note">The first case studies are on their way. Meanwhile, see the <a href="/#fix">before and after photos</a> on the home page.</p>'}
</section>`,
  });
}

function notFound() {
  return shell({ title: 'Case study not found | Lynchpin', description: 'This case study is not available.', path: '/work', noindex: true,
    body: '<section class="wrap block"><h1>Case study not found.</h1><p class="lede">It may have been taken down. See <a href="/work">all our work</a>.</p></section>' });
}
