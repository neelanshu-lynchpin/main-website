// Service pages, the blog, and the files search engines and AI assistants read (sitemap,
// robots, llms.txt, structured data). build-site.mjs writes them all into dist/.
// Every fact here is one the main page already states. Add new facts only when they are true.

export const SITE = 'https://main-website-concept.vercel.app';
export const LINKEDIN = 'https://www.linkedin.com/company/lynchpinassociates-bangalore/';
const PHONE = '+91 90366 15441', TEL = '+919036615441', EMAIL = 'marketing@lynchpin.co.in';
const WHATSAPP = 'https://wa.me/919036615441?text=' + encodeURIComponent('Hello Lynchpin, I need office furniture repaired.');
const ADDRESS = { street: '22, 3rd floor, 6th cross, Sampige Road, Malleshwaram', city: 'Bengaluru', region: 'Karnataka', zip: '560003' };
const CLIENTS = ['Wipro', 'Mercedes-Benz', 'CBRE', 'Colliers', 'Embassy', 'Indiqube', 'Cyient', 'Zensar', 'Kantar', 'Veolia', 'IIM Bangalore', 'Urban Ladder', 'Himalaya'];

/* ---------- services ---------- */
export const SERVICES = [
  {
    slug: 'office-chair-repair-bengaluru',
    name: 'Office chair repair',
    title: 'Office Chair Repair in Bengaluru | Gas Lift, Castor, Seat Fix | Lynchpin',
    description: 'Office chair repair at your office in Bengaluru. Gas lifts, mechanisms, castors, bases, arms, seat foam and fabric replaced with warranted spares. Call +91 90366 15441.',
    h1: 'Office chair repair in Bengaluru, at your desk.',
    lede: 'Sinking seat, wobbly base, torn fabric, a cracked castor. Our technicians come to your office, replace the part that wore out and keep the rest of the chair.',
    image: 'assets/fix/chair-after.webp', imageAlt: 'Office chair after repair by Lynchpin',
    fixes: ['Gas lifts that sink under load', 'Tilt and lock mechanisms', 'Castors and five-star bases', 'Armrests and arm pads', 'Seat foam that has gone flat', 'Seat and back fabric or mesh'],
    body: [
      ['What we check on every chair', 'We open the chair up and check six parts: fabric, seat foam, mechanism, gas lift, base and castors. You get a report that says which parts wore out and which are fine. We replace only the worn ones.'],
      ['Why repair beats replacing', 'A new ergonomic chair costs around ₹14,000. A typical one-part repair, such as new fabric or a gas lift, costs around ₹850. That is about 94% less. Making one new task chair also emits at least 87 kg of CO₂e, and a repair saves most of it.'],
      ['One chair or a whole floor', 'We repair a single chair or every chair on a floor, working desk by desk so your team can keep working.'],
    ],
    faq: [
      ['Can you repair the chair at our office?', 'Yes. Our technicians repair chairs on site at your office in Bengaluru and across India. Most repairs do not need the chair to leave the building.'],
      ['My chair keeps sinking. Can that be fixed?', 'A chair that sinks has a worn gas lift. We replace the gas lift and test the chair under load before we hand it back.'],
      ['Do your spares carry a warranty?', 'Yes. We fit warranted spares, and you get a record of what we replaced on each chair.'],
      ['How much does office chair repair cost?', 'It depends on the part. A typical one-part repair, such as a gas lift or new fabric, costs around ₹850. We assess the chairs first and send a quote before any work starts.'],
    ],
  },
  {
    slug: 'sofa-repair-reupholstery-bengaluru',
    name: 'Sofa repair and reupholstery',
    title: 'Office Sofa Repair & Reupholstery in Bengaluru | Lynchpin',
    description: 'Reception and lounge sofa repair in Bengaluru: new fabric or leather upholstery, foam and spring replacement, frame repair and refinishing. On site for offices.',
    h1: 'Office sofa repair and reupholstery in Bengaluru.',
    lede: 'Torn, sagging or stained reception sofas make a poor first impression. We re-cover them in fabric or leather, replace tired foam and springs, and fix the frame.',
    image: 'assets/fix/sofa2-after.webp', imageAlt: 'Office sofa after reupholstery by Lynchpin',
    fixes: ['New upholstery in fabric or leather', 'Foam replacement for sagging seats', 'Spring replacement', 'Frame repair and tightening', 'Wood and leg refinishing', 'Stain-damaged covers replaced'],
    body: [
      ['When a sofa is worth reupholstering', 'If the frame is solid, the sofa is worth keeping. Most office sofas wear out on the surface first: the fabric tears, the foam flattens and the seat sags. Those are the parts we replace.'],
      ['Reception, lounge and breakout seating', 'We work on reception sofas, lounge seating, breakout benches and pantry chairs. You choose the fabric or leather, and we match it across every piece so the area looks like one set.'],
      ['Done around your working hours', 'We plan the work with your facilities team so the reception or lounge stays usable while we work.'],
    ],
    faq: [
      ['Can you change the colour of our office sofas?', 'Yes. Reupholstery lets you pick a new fabric or leather, so you can match a new office colour scheme without buying new sofas.'],
      ['What if the sofa seat sags?', 'A sagging seat usually means worn foam or broken springs. We replace both and check the frame underneath.'],
      ['Do you repair sofas outside Bengaluru?', 'Our base is in Malleshwaram, Bengaluru, and our service teams travel to client offices across India.'],
    ],
  },
  {
    slug: 'leather-furniture-repair-bengaluru',
    name: 'Leather chair and sofa repair',
    title: 'Leather Chair & Sofa Repair in Bengaluru | Recolouring, Re-covering | Lynchpin',
    description: 'Leather office chair, armchair and sofa repair in Bengaluru. Cracked, peeling or faded leather repaired and recoloured, seats and arms re-covered, frames tightened.',
    h1: 'Leather chair and sofa repair in Bengaluru.',
    lede: 'Cracked, peeling or faded leather on director chairs, armchairs and sofas. We repair and recolour it, or re-cover the seat and arms, and tighten the frame and legs.',
    image: 'assets/fix/armchair2-after.webp', imageAlt: 'Leather armchair after repair by Lynchpin',
    fixes: ['Cracked and peeling leather repaired', 'Faded leather recoloured', 'Seats and arms re-covered', 'Legs and frames tightened', 'Director and boardroom chairs', 'Lounge armchairs and sofas'],
    body: [
      ['Repair or re-cover', 'Faded or lightly cracked leather can be repaired and recoloured. Leather that has split or peeled through needs the seat or arm re-covered. We tell you which after the assessment.'],
      ['Boardrooms and cabins', 'Leather chairs in boardrooms and cabins see heavy daily use. Restoring them keeps the room looking the way it was designed, at a fraction of the cost of a new set.'],
    ],
    faq: [
      ['Can peeling leather be fixed?', 'Peeling usually means the top layer has worn through. We re-cover the affected seat or arm so the finish is even again.'],
      ['Will the colour match the rest of the chair?', 'We recolour the repaired area to match the rest of the chair, or re-cover the whole panel so the finish is even.'],
    ],
  },
  {
    slug: 'workstation-pedestal-repair-bengaluru',
    name: 'Workstation and pedestal repair',
    title: 'Office Workstation & Pedestal Repair in Bengaluru | Locks, Drawers | Lynchpin',
    description: 'Workstation and pedestal repair in Bengaluru: panels, partitions and edge bands, locks and keys, drawer channels, cable trays, castors and handles. On site.',
    h1: 'Workstation and pedestal repair in Bengaluru.',
    lede: 'Loose panels, chipped edges, stuck drawers and lost keys. We repair workstations and pedestals at your office, so desks stay in place and nobody has to move.',
    image: 'assets/fix/desk2-after.webp', imageAlt: 'Office workstation after repair by Lynchpin',
    fixes: ['Panels and partitions', 'Chipped and peeling edge bands', 'Pedestal locks and keys', 'Stuck or broken drawer channels', 'Cable trays', 'Castors and handles'],
    body: [
      ['Pedestals that lock and slide again', 'A pedestal that will not lock or a drawer that jams off its channel is a daily irritation. We replace locks, cut new keys and fit new drawer channels.'],
      ['Workstations that look new', 'We fix loose partitions, replace damaged edge bands and refit cable trays, so a worn bank of desks looks and works like the day it was installed.'],
    ],
    faq: [
      ['We lost the keys to our pedestals. Can you help?', 'Yes. We replace pedestal locks and supply new keys on site.'],
      ['Do we need to clear the desks before you work?', 'Usually not. We work around the desk and tell your team in advance if a drawer needs emptying.'],
    ],
  },
  {
    slug: 'office-furniture-maintenance-contract',
    name: 'Office furniture maintenance contracts (AMC)',
    title: 'Office Furniture AMC & Maintenance Contracts in Bengaluru | Lynchpin',
    description: 'Annual maintenance contracts for office chairs, sofas, workstations and pedestals in Bengaluru and across India. Scheduled visits, assessment reports and warranted spares.',
    h1: 'Office furniture maintenance contracts.',
    lede: 'A yearly maintenance contract keeps every chair, sofa and desk in working order. Our team visits on a schedule, fixes what has worn and reports on the rest.',
    image: 'assets/technician.webp', imageAlt: 'Lynchpin technician servicing an office chair',
    fixes: ['Scheduled service visits', 'Assessment report on every piece', 'Repairs with warranted spares', 'One point of contact for facilities', 'Chairs, sofas, workstations and pedestals', 'Multiple sites under one contract'],
    body: [
      ['How a contract works', 'We agree how often we visit, for example every three months. On each visit we inspect every piece, repair what needs it and send a report. Facilities teams always know the state of their furniture.'],
      ['Built for facility teams', 'Facility management firms, coworking operators, office parks and large campuses use maintenance contracts to keep many sites in shape without chasing repairs one by one.'],
      ['Who we already work with', 'Our clients include ' + CLIENTS.slice(0, 8).join(', ') + ' and others.'],
    ],
    faq: [
      ['What does an office furniture AMC cover?', 'Scheduled visits, an inspection of every covered piece, repairs with warranted spares and a report after each visit. We agree the list of furniture and the visit schedule with you.'],
      ['Can one contract cover several offices?', 'Yes. We can cover several sites in one city or across cities under one contract.'],
      ['How often do you visit?', 'We agree the schedule with you, for example every three months, or monthly for busy offices and coworking spaces.'],
    ],
  },
];

/* ---------- blog ---------- */
// To add a LinkedIn post: copy its text into a new entry, set `linkedin` to the post's link
// (… menu on the post → Copy link to post), and give it a short slug.
export const POSTS = [
  {
    slug: 'repair-or-replace-office-chairs',
    date: '2026-11-18',
    title: 'Repair or replace? What office chairs really cost',
    description: 'A new ergonomic chair costs around ₹14,000. A typical one-part repair costs around ₹850. How to decide, chair by chair, and what it means for a 200-chair floor.',
    image: 'assets/fix/chair2-after.webp',
    body: [
      ['p', 'Facilities teams get the same request every few months: a chair sinks, a castor cracks, a seat tears. The quick answer is to order a new chair. On a full floor that adds up fast.'],
      ['h2', 'The numbers'],
      ['p', 'A new ergonomic office chair costs around ₹14,000. Most worn chairs need one part replaced: fabric, seat foam, a gas lift or a castor. A typical one-part repair costs around ₹850, about 94% less.'],
      ['p', 'On a floor of 200 chairs, replacing them all costs around ₹28 lakh. Repairing them costs around ₹1.7 lakh.'],
      ['h2', 'When to repair'],
      ['ul', ['The frame and base are sound', 'The mechanism still tilts and locks', 'The wear is in fabric, foam, gas lift or castors', 'The chair still suits the person using it']],
      ['h2', 'When to replace'],
      ['ul', ['The frame or base has cracked', 'The chair no longer fits ergonomic needs', 'Spares for that model are no longer made']],
      ['h2', 'The carbon side'],
      ['p', 'Making one new task chair emits at least 87 kg of CO₂e, the lowest of three published chair declarations. Repairing a 200-chair floor instead of replacing it avoids around 17.4 tonnes. If your company reports emissions, that counts.'],
      ['p', 'Not sure which chairs to keep? We assess every chair and send a report with the fix for each, before any work starts.'],
    ],
  },
  {
    slug: 'office-chair-sinking-gas-lift',
    date: '2026-11-18',
    title: 'Why your office chair keeps sinking, and how it gets fixed',
    description: 'A chair that slowly drops under you has a worn gas lift. What causes it, how to check, and what a gas lift replacement involves.',
    image: 'assets/chair.webp',
    body: [
      ['p', 'You set the height, sit down, and ten minutes later your desk feels higher. The chair has sunk. It is one of the most common faults we see on office chairs.'],
      ['h2', 'The cause'],
      ['p', 'The height of an office chair is held by a gas lift, a sealed cylinder of pressurised gas under the seat. Over years of use the seal wears and the gas leaks past it. The cylinder can no longer hold your weight, so the seat drops.'],
      ['h2', 'How to check'],
      ['ul', ['Raise the seat fully and sit down', 'If it drops within minutes, the gas lift is worn', 'If it will not rise at all, the lever or cable may be the fault instead']],
      ['h2', 'The fix'],
      ['p', 'A worn gas lift cannot be refilled. It gets replaced. Our technician removes the old cylinder from the base and the seat mechanism, fits a new warranted one, and tests the chair under load before handing it back.'],
      ['p', 'While the chair is open we check the other five parts we inspect on every chair: fabric, seat foam, mechanism, base and castors. If any of them are worn, the report says so.'],
    ],
  },
  {
    slug: 'what-office-furniture-amc-covers',
    date: '2026-11-18',
    title: 'What an office furniture maintenance contract covers',
    description: 'How a yearly maintenance contract for office chairs, sofas and workstations works: visit schedules, reports, spares, and who it suits.',
    image: 'assets/technician.webp',
    body: [
      ['p', 'Most offices repair furniture when someone complains. A maintenance contract turns that around: a team visits on a schedule and fixes wear before it becomes a complaint.'],
      ['h2', 'What is included'],
      ['ul', ['Scheduled visits, on a schedule you agree', 'An inspection of every covered piece', 'Repairs with warranted spares', 'A report after each visit', 'One contact for the facilities team']],
      ['h2', 'Who it suits'],
      ['p', 'Offices with a few hundred chairs or more, coworking spaces where seats change hands every day, office parks managing tenant areas, and facility management firms looking after many client sites.'],
      ['h2', 'How to start'],
      ['p', 'We begin with an assessment of every piece you want covered. From that we agree the list, the visit schedule and the yearly value. Then the visits start.'],
    ],
  },
  {
    slug: 'reupholster-office-sofa',
    date: '2026-11-18',
    title: 'Reupholstering office sofas: what to expect',
    description: 'When a reception or lounge sofa is worth reupholstering, what gets replaced, and how to choose fabric or leather for heavy office use.',
    image: 'assets/fix/sofa2-after.webp',
    body: [
      ['p', 'Reception sofas take more wear than almost any other piece in an office. Visitors sit on them all day, and they are the first thing people see.'],
      ['h2', 'Is it worth it?'],
      ['p', 'If the frame is solid, yes. Sofas wear on the surface first: the fabric tears or stains, the foam flattens and the seat sags. Reupholstery replaces those layers and keeps the frame.'],
      ['h2', 'What gets replaced'],
      ['ul', ['Fabric or leather covers', 'Seat and back foam', 'Springs, where they have broken', 'Legs and frame joints, tightened or refinished']],
      ['h2', 'Choosing the material'],
      ['p', 'For reception areas, pick a fabric rated for heavy commercial use, or leather, which wipes clean. A darker or patterned fabric hides wear longer. We match the material across every piece so the area looks like one set.'],
    ],
  },
];

/* ---------- shared bits ---------- */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export function businessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': SITE + '/#business',
    name: 'Lynchpin Associates',
    alternateName: 'Lynchpin',
    slogan: 'Ergonomic Solutions',
    description: 'Lynchpin repairs, restores and maintains office chairs, sofas, workstations and pedestals at client offices in Bengaluru and across India.',
    url: SITE + '/',
    logo: SITE + '/assets/logo.png',
    image: SITE + '/assets/og.jpg',
    telephone: TEL,
    email: EMAIL,
    address: { '@type': 'PostalAddress', streetAddress: ADDRESS.street, addressLocality: ADDRESS.city, addressRegion: ADDRESS.region, postalCode: ADDRESS.zip, addressCountry: 'IN' },
    areaServed: [{ '@type': 'City', name: 'Bengaluru' }, { '@type': 'Country', name: 'India' }],
    sameAs: [LINKEDIN],
    knowsAbout: ['Office chair repair', 'Gas lift replacement', 'Sofa reupholstery', 'Leather furniture repair', 'Workstation repair', 'Pedestal lock repair', 'Office furniture maintenance contracts'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: 'Office furniture repair services',
      itemListElement: SERVICES.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: `${SITE}/services/${s.slug}` } })),
    },
  };
}

function head({ title, description, path, image, type = 'website', schema = [] }) {
  const url = SITE + path, img = SITE + '/' + (image || 'assets/og.jpg');
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="${type}"><meta property="og:url" content="${url}"><meta property="og:site_name" content="Lynchpin Associates">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${img}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${img}">
<meta name="geo.region" content="IN-KA"><meta name="geo.placename" content="Bengaluru">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png"><meta name="theme-color" content="#E3181F">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@90,600;90,800&family=Hanken+Grotesk:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/pages.css">
${schema.map((x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('\n')}
</head><body>`;
}

const NAV = `<header class="top"><div class="wrap top-in">
<a href="/" class="logo"><img src="/assets/logo.png" alt="Lynchpin Associates home" width="480" height="128"></a>
<nav aria-label="Main"><a href="/services">Services</a><a href="/work">Our work</a><a href="/blog">Blog</a><a href="/audit">Free audit</a></nav>
<a class="btn" href="/book">Book a repair</a>
</div></header>`;

function cta(heading = 'Tell us what needs fixing.') {
  return `<section class="cta"><div class="wrap"><h2>${heading}</h2><p>We call back within two business hours and assess every piece before quoting.</p>
<div class="cta-b"><a class="btn" href="/#contact">Book an assessment</a><a class="btn ghost" href="tel:${TEL}">Call ${PHONE}</a><a class="btn ghost" href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp us</a></div></div></section>`;
}

const FOOT = `<footer><div class="wrap foot">
<div><img src="/assets/logo-white.png" alt="Lynchpin" width="480" height="128" loading="lazy"><p>Lynchpin Associates. Ergonomic Solutions. Repairing, servicing and maintaining office furniture across India.</p></div>
<nav aria-label="Services"><b>Services</b>${SERVICES.map((s) => `<a href="/services/${s.slug}">${esc(s.name)}</a>`).join('')}</nav>
<nav aria-label="For clients"><b>For clients</b><a href="/book">Book a repair</a><a href="/audit">Free office furniture audit</a><a href="/work">Our work</a><a href="/review">Leave a review</a><a href="/blog">Blog</a></nav>
<div><b>Talk to us</b><a href="tel:${TEL}">${PHONE}</a><a href="mailto:${EMAIL}">${EMAIL}</a><address>${esc(ADDRESS.street)}, ${ADDRESS.city} ${ADDRESS.zip}</address><a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a></div>
</div></footer></body></html>`;

/* Any other page in the same frame: head, top bar, the closing call to action and the footer */
export function shell({ title, description, path, image, type, schema = [], body, noindex, cta: ctaHead }) {
  let h = head({ title, description, path, image, type, schema: [businessSchema(), ...schema] });
  if (noindex) h = h.replace('index,follow,max-image-preview:large', 'noindex,follow');
  return h + NAV + `<main>${body}</main>` + (ctaHead === false ? '' : cta(ctaHead)) + FOOT;
}

export const crumbs = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + path })),
});
const faqSchema = (faq) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});
const faqHtml = (faq) => `<section class="faq"><h2>Questions we get asked</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>`;

/* ---------- pages ---------- */
export function servicePage(s) {
  const others = SERVICES.filter((x) => x !== s);
  return head({
    title: s.title, description: s.description, path: `/services/${s.slug}`, image: s.image,
    schema: [
      { '@context': 'https://schema.org', '@type': 'Service', name: s.name + ' in Bengaluru', serviceType: s.name, description: s.description, url: `${SITE}/services/${s.slug}`, provider: { '@id': SITE + '/#business' }, areaServed: [{ '@type': 'City', name: 'Bengaluru' }, { '@type': 'Country', name: 'India' }] },
      businessSchema(), faqSchema(s.faq), crumbs([['Home', '/'], ['Services', '/services'], [s.name, `/services/${s.slug}`]]),
    ],
  }) + NAV + `<main>
<section class="hero"><div class="wrap hero-in">
<div><p class="crumb"><a href="/">Home</a> / <a href="/services">Services</a> / ${esc(s.name)}</p>
<h1>${esc(s.h1)}</h1><p class="lede">${esc(s.lede)}</p>
<div class="cta-b"><a class="btn" href="/#contact">Book an assessment</a><a class="btn ghost" href="tel:${TEL}">Call ${PHONE}</a></div></div>
<img src="/${s.image}" alt="${esc(s.imageAlt)}" width="640" height="640">
</div></section>
<section class="wrap block"><h2>What we fix</h2><ul class="ticks">${s.fixes.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></section>
<section class="wrap block prose">${s.body.map(([h, p]) => `<h2>${esc(h)}</h2><p>${esc(p)}</p>`).join('')}
<h2>How a repair visit works</h2><ol class="steps"><li><b>Assess.</b> We inspect every piece and send a report with the fix for each.</li><li><b>Repair.</b> We fix it at your office, with warranted spares.</li><li><b>Test.</b> Every piece is tested under load before we sign it off.</li><li><b>Return.</b> Back at the desk, with a record of what we did.</li></ol>
<p class="clients">Trusted by teams at ${CLIENTS.join(', ')}.</p></section>
<div class="wrap">${faqHtml(s.faq)}</div>
<section class="wrap block"><h2>Other services</h2><div class="cards">${others.map((o) => `<a class="card" href="/services/${o.slug}"><b>${esc(o.name)}</b><span>${esc(o.lede.split('. ')[0])}.</span></a>`).join('')}</div></section>
</main>` + cta() + FOOT;
}

export function servicesIndex() {
  return head({
    title: 'Office Furniture Repair Services in Bengaluru | Lynchpin Associates',
    description: 'Office chair repair, sofa reupholstery, leather repair, workstation and pedestal repair, and maintenance contracts. On site in Bengaluru and across India.',
    path: '/services', schema: [businessSchema(), crumbs([['Home', '/'], ['Services', '/services']])],
  }) + NAV + `<main><section class="wrap block"><p class="crumb"><a href="/">Home</a> / Services</p>
<h1>Office furniture repair services in Bengaluru.</h1><p class="lede">We repair, restore and maintain office furniture at your office, with warranted spares. One chair or a whole floor.</p>
<div class="cards big">${SERVICES.map((s) => `<a class="card" href="/services/${s.slug}"><img src="/${s.image}" alt="" width="320" height="240" loading="lazy"><b>${esc(s.name)}</b><span>${esc(s.lede)}</span></a>`).join('')}</div></section></main>` + cta() + FOOT;
}

function render(blocks) {
  return blocks.map(([t, v]) => t === 'ul' ? `<ul>${v.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : `<${t}>${esc(v)}</${t}>`).join('\n');
}

export function postPage(p) {
  return head({
    title: p.title + ' | Lynchpin', description: p.description, path: `/blog/${p.slug}`, image: p.image, type: 'article',
    schema: [
      { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date, image: SITE + '/' + p.image, url: `${SITE}/blog/${p.slug}`, mainEntityOfPage: `${SITE}/blog/${p.slug}`, author: { '@type': 'Organization', name: 'Lynchpin Associates', url: SITE + '/' }, publisher: { '@id': SITE + '/#business' }, ...(p.linkedin ? { sameAs: p.linkedin } : {}) },
      businessSchema(), crumbs([['Home', '/'], ['Blog', '/blog'], [p.title, `/blog/${p.slug}`]]),
    ],
  }) + NAV + `<main><article class="wrap post"><p class="crumb"><a href="/">Home</a> / <a href="/blog">Blog</a></p>
<h1>${esc(p.title)}</h1><p class="meta"><time datetime="${p.date}">${fmt(p.date)}</time> · Lynchpin Associates</p>
<img class="post-img" src="/${p.image}" alt="" width="960" height="640">
<div class="prose">${render(p.body)}</div>
<p class="li-note">${p.linkedin ? `<a href="${p.linkedin}" target="_blank" rel="noopener">Read and comment on this post on LinkedIn</a>` : `More from the team on <a href="${LINKEDIN}" target="_blank" rel="noopener">Lynchpin's LinkedIn</a>.`}</p>
<h2 class="rel">Services mentioned</h2><div class="cards">${SERVICES.slice(0, 3).map((o) => `<a class="card" href="/services/${o.slug}"><b>${esc(o.name)}</b></a>`).join('')}</div>
</article></main>` + cta() + FOOT;
}

export function blogIndex() {
  const list = POSTS.slice().sort((a, b) => b.date.localeCompare(a.date));
  return head({
    title: 'Office Furniture Repair Guides & News | Lynchpin Blog',
    description: 'Guides on office chair repair, gas lifts, sofa reupholstery and maintenance contracts from the Lynchpin team in Bengaluru, plus our LinkedIn updates.',
    path: '/blog', schema: [businessSchema(), { '@context': 'https://schema.org', '@type': 'Blog', name: 'Lynchpin blog', url: SITE + '/blog', publisher: { '@id': SITE + '/#business' }, blogPost: list.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE}/blog/${p.slug}`, datePublished: p.date })) }],
  }) + NAV + `<main><section class="wrap block"><p class="crumb"><a href="/">Home</a> / Blog</p>
<h1>Repair guides and news from the Lynchpin team.</h1><p class="lede">How office furniture wears, what it costs to fix, and what we are working on. We also post updates on <a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>.</p>
<div class="cards big">${list.map((p) => `<a class="card" href="/blog/${p.slug}"><img src="/${p.image}" alt="" width="320" height="240" loading="lazy"><small>${fmt(p.date)}</small><b>${esc(p.title)}</b><span>${esc(p.description)}</span></a>`).join('')}</div>
<p class="li-note">Follow <a href="${LINKEDIN}" target="_blank" rel="noopener">Lynchpin Associates on LinkedIn</a> for project photos and updates.</p></section></main>` + cta() + FOOT;
}

/* ---------- files for crawlers ---------- */
export function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [['/', today, '1.0'], ['/services', today, '0.9'], ['/book', today, '0.8'], ['/audit', today, '0.8'], ['/work', today, '0.7'], ...SERVICES.map((s) => [`/services/${s.slug}`, today, '0.9']), ['/blog', today, '0.7'], ...POSTS.map((p) => [`/blog/${p.slug}`, p.date, '0.6'])];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d, pr]) => `  <url><loc>${SITE}${u}</loc><lastmod>${d}</lastmod><priority>${pr}</priority></url>`).join('\n')}\n</urlset>\n`;
}

export function robots() {
  // Search engines and AI assistants are all welcome; only the team admin and the API are off limits
  const bots = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot'];
  return bots.map((b) => `User-agent: ${b}\nAllow: /\nDisallow: /admin\nDisallow: /api/\n`).join('\n') + `\nUser-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`;
}

export function llms() {
  return `# Lynchpin Associates

> Lynchpin Associates (Ergonomic Solutions) repairs, restores and maintains office furniture at client offices. Based in Malleshwaram, Bengaluru, India, with service teams across India. Services: office chair repair, sofa reupholstery, leather furniture repair, workstation and pedestal repair, and yearly maintenance contracts (AMC).

- Address: ${ADDRESS.street}, ${ADDRESS.city} ${ADDRESS.zip}, ${ADDRESS.region}, India
- Phone: ${PHONE}
- Email: ${EMAIL}
- LinkedIn: ${LINKEDIN}
- Clients include: ${CLIENTS.join(', ')}
- Repairs happen on site at the client's office, with warranted spares. Every job follows four steps: assess, repair, test under load, return with a record.
- A typical one-part chair repair costs around ₹850, against around ₹14,000 for a new ergonomic chair.

## Services
${SERVICES.map((s) => `- [${s.name}](${SITE}/services/${s.slug}): ${s.description}`).join('\n')}

## Guides
${POSTS.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}): ${p.description}`).join('\n')}

## For clients
- [Book a repair](${SITE}/book): existing clients book a service visit; the QR sticker on repaired furniture opens this page
- [Free office furniture audit](${SITE}/audit): repair-vs-replace estimate for an office
- [Our work](${SITE}/work): case studies
- [Book an assessment](${SITE}/#contact)
`;
}
