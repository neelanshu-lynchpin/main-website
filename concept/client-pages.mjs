// Pages for clients: book a repair (the QR sticker opens this), the free audit, the printable
// carbon certificate and the review form. build-site.mjs writes them into dist/.
import { shell, crumbs, LINKEDIN } from './seo-pages.mjs';

const KINDS = ['Chairs', 'Sofas', 'Workstations', 'Pedestals', 'Several things'];
// The guide figures the main page uses; keep them in step with it
const NEW_CHAIR = 14000, CHAIR_FIX = 850, CHAIR_KG = 87;

const field = (id, label, input, wide) => `<div class="fld${wide ? ' wide' : ''}"><label for="${id}">${label}</label>${input}</div>`;
const honeypot = '<input name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hp">';

/* ---------- book a repair ---------- */
export function bookPage() {
  return shell({
    title: 'Book an Office Furniture Repair | Lynchpin Service Booking',
    description: 'Existing Lynchpin clients: book a repair for office chairs, sofas, workstations or pedestals. We call back within two business hours.',
    path: '/book', schema: [crumbs([['Home', '/'], ['Book a repair', '/book']])], cta: false,
    body: `<section class="wrap form-page">
<div class="form-intro"><p class="crumb"><a href="/">Home</a> / Book a repair</p>
<h1>Book a repair.</h1>
<p class="lede">Something at your office needs fixing? Tell us what and where. We call back within two business hours to fix a time.</p>
<ul class="mini-list"><li>Chairs, sofas, workstations and pedestals</li><li>Repaired at your office, with warranted spares</li><li>Prefer to talk? <a href="tel:+919036615441">+91 90366 15441</a></li></ul></div>
<form class="form" id="book" novalidate>
${field('b-company', 'Company <span>*</span>', '<input id="b-company" name="company" autocomplete="organization" required>')}
${field('b-name', 'Your name <span>*</span>', '<input id="b-name" name="name" autocomplete="name" required>')}
${field('b-phone', 'Phone <span>*</span>', '<input id="b-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required>')}
${field('b-email', 'Email', '<input id="b-email" name="email" type="email" autocomplete="email">')}
${field('b-location', 'Where in the office', '<input id="b-location" name="location" placeholder="e.g. 4th floor, Tower B, meeting room 2">', true)}
${field('b-kind', 'What needs fixing', `<select id="b-kind" name="kind">${KINDS.map((k) => `<option>${k}</option>`).join('')}</select>`)}
${field('b-pieces', 'How many pieces', '<input id="b-pieces" name="pieces" type="number" min="1" inputmode="numeric">')}
${field('b-date', 'Preferred day', '<input id="b-date" name="date" type="date">')}
${field('b-city', 'City', '<input id="b-city" name="city" autocomplete="address-level2" value="Bengaluru">')}
${field('b-note', 'What is wrong', '<textarea id="b-note" name="note" rows="3" placeholder="e.g. 6 chairs sink, 2 have torn seats"></textarea>', true)}
${honeypot}
<button class="btn wide" type="submit">Book the repair</button>
<p class="status" role="status"></p>
</form>
<div class="done" hidden><h2>Booked. We will call you shortly.</h2><p>Our team calls back within two business hours to confirm the visit. Need it sooner? Call <a href="tel:+919036615441">+91 90366 15441</a>.</p></div>
</section>
<script>
(function(){
  var f = document.getElementById('book'), q = new URLSearchParams(location.search);
  if (q.get('c')) f.company.value = q.get('c');
  f.date.min = new Date().toISOString().slice(0, 10);
  ${submitScript("'book'", "f")}
})();
</script>`,
  });
}

/* Posts a form to /api/enquiry and swaps it for the thank-you block */
function submitScript(form, el, extra = '') {
  return `${el}.addEventListener('submit', function(e){
    e.preventDefault();
    var s = ${el}.querySelector('.status'), b = ${el}.querySelector('button[type=submit]'), d = {form:${form}};
    new FormData(${el}).forEach(function(v, k){ d[k] = v; });
    ${extra}
    if (!d.name || !d.company || (d.phone || '').replace(/\\D/g, '').length < 10) { s.textContent = 'Add your name, company and a 10-digit phone number.'; return; }
    b.disabled = true; s.textContent = 'Sending…';
    fetch('/api/enquiry', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d)})
      .then(function(r){ return r.json().then(function(j){ if (!r.ok) throw new Error(j.error || 'failed'); }); })
      .then(function(){ ${el}.hidden = true; var done = ${el}.parentNode.querySelector('.done'); done.hidden = false; done.scrollIntoView({behavior:'smooth', block:'center'}); if (window.onSent) window.onSent(d); })
      .catch(function(err){ b.disabled = false; s.textContent = (err.message && err.message !== 'failed' ? err.message : 'That did not go through.') + ' You can also call +91 90366 15441.'; });
  });`;
}

/* ---------- free audit ---------- */
export function auditPage() {
  return shell({
    title: 'Free Office Furniture Audit | Repair vs Replace Calculator | Lynchpin',
    description: 'Count the worn chairs in your office and see what replacing them costs against repairing them, and the CO₂ you avoid. Get a printable report.',
    path: '/audit', schema: [crumbs([['Home', '/'], ['Free audit', '/audit']])], cta: false,
    body: `<section class="wrap block audit">
<p class="crumb"><a href="/">Home</a> / Free audit</p>
<h1>Free office furniture audit.</h1>
<p class="lede">Walk the floor, count what is worn, and see what replacing it would cost against repairing it. Then get the report as a PDF to share with your team.</p>
<div class="audit-grid">
<form class="form" id="counts">
<h2>1. Count what you see</h2>
${field('a-chairs', 'Office chairs in total', '<input id="a-chairs" name="chairs" type="number" min="0" value="100" inputmode="numeric">', true)}
${field('a-sink', 'Chairs that sink', '<input id="a-sink" name="sink" type="number" min="0" value="12" inputmode="numeric">')}
${field('a-torn', 'Chairs with torn or flat seats', '<input id="a-torn" name="torn" type="number" min="0" value="10" inputmode="numeric">')}
${field('a-base', 'Wobbly bases or broken castors', '<input id="a-base" name="base" type="number" min="0" value="6" inputmode="numeric">')}
${field('a-arms', 'Broken or loose arms', '<input id="a-arms" name="arms" type="number" min="0" value="4" inputmode="numeric">')}
${field('a-sofas', 'Sofas that are torn or sagging', '<input id="a-sofas" name="sofas" type="number" min="0" value="2" inputmode="numeric">')}
${field('a-desks', 'Workstations or pedestals with problems', '<input id="a-desks" name="desks" type="number" min="0" value="5" inputmode="numeric">')}
</form>
<aside class="result" aria-live="polite">
<h2>2. What it costs</h2>
<div class="vs"><div><small>Replace the worn chairs</small><b id="r-new">₹0</b></div><div class="good"><small>Repair them</small><b id="r-fix">₹0</b></div></div>
<p class="big">You keep <b id="r-save">₹0</b> and avoid about <b id="r-co2">0 kg</b> of CO₂e.</p>
<p class="note">Chairs only, at guide figures: a new ergonomic chair at ₹${NEW_CHAIR.toLocaleString('en-IN')}, a typical one-part repair at ₹${CHAIR_FIX}, and ${CHAIR_KG} kg CO₂e to make a new chair. A chair with several faults counts once. Sofas and workstations are quoted after a visit.</p>
</aside>
</div>
<form class="form gate" id="audit-form" novalidate>
<h2>3. Get the report as a PDF</h2>
<p>We email nothing you did not ask for. A Lynchpin specialist calls once to offer a free on-site check.</p>
<div class="gate-grid">
${field('g-name', 'Your name <span>*</span>', '<input id="g-name" name="name" autocomplete="name" required>')}
${field('g-company', 'Company <span>*</span>', '<input id="g-company" name="company" autocomplete="organization" required>')}
${field('g-phone', 'Phone <span>*</span>', '<input id="g-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required>')}
${field('g-city', 'City <span>*</span>', '<input id="g-city" name="city" autocomplete="address-level2" value="Bengaluru" required>')}
</div>
${honeypot}
<button class="btn" type="submit">Show my report</button>
<p class="status" role="status"></p>
</form>
<div class="done" hidden><div class="report" id="report"></div><div class="cta-b no-print"><button class="btn" type="button" onclick="print()">Save as PDF or print</button><a class="btn ghost" href="/book">Book the repairs</a></div></div>
</section>
<script>
(function(){
  var c = document.getElementById('counts'), inr = function(n){ return '₹' + Math.round(n).toLocaleString('en-IN'); };
  function nums(){ var o = {}; new FormData(c).forEach(function(v, k){ o[k] = Math.max(0, +v || 0); }); o.chairsToFix = Math.min(o.chairs, o.sink + o.torn + o.base + o.arms); return o; }
  function draw(){
    var n = nums();
    document.getElementById('r-new').textContent = inr(n.chairsToFix * ${NEW_CHAIR});
    document.getElementById('r-fix').textContent = inr(n.chairsToFix * ${CHAIR_FIX});
    document.getElementById('r-save').textContent = inr(n.chairsToFix * (${NEW_CHAIR} - ${CHAIR_FIX}));
    var kg = n.chairsToFix * ${CHAIR_KG}; document.getElementById('r-co2').textContent = kg >= 1000 ? (kg / 1000).toFixed(1) + ' tonnes' : kg + ' kg';
  }
  c.addEventListener('input', draw); draw();
  var f = document.getElementById('audit-form');
  window.onSent = function(d){
    var n = d.audit, row = function(a, b){ return '<tr><td>' + a + '</td><td>' + b + '</td></tr>'; }, esc = function(s){ return String(s).replace(/[&<>"]/g, function(x){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[x]; }); };
    document.getElementById('report').innerHTML =
      '<div class="rep-h"><img src="/assets/logo.png" alt="Lynchpin" width="480" height="128"><div><b>Office furniture audit</b><br>' + esc(d.company) + ', ' + esc(d.city) + '<br>' + new Date().toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'}) + '</div></div>' +
      '<h2>What you counted</h2><table>' + row('Office chairs in total', n.chairs) + row('Chairs that sink', n.sink) + row('Torn or flat seats', n.torn) + row('Wobbly bases or broken castors', n.base) + row('Broken or loose arms', n.arms) + row('Sofas that need work', n.sofas) + row('Workstations or pedestals', n.desks) + '</table>' +
      '<h2>Repair or replace: chairs</h2><table>' + row('Chairs that need work', '<b>' + n.chairsToFix + '</b>') + row('Replacing them', inr(n.chairsToFix * ${NEW_CHAIR})) + row('Repairing them', '<b>' + inr(n.chairsToFix * ${CHAIR_FIX}) + '</b>') + row('You keep', '<b>' + inr(n.chairsToFix * (${NEW_CHAIR} - ${CHAIR_FIX})) + '</b>') + row('CO₂e avoided', (n.chairsToFix * ${CHAIR_KG}).toLocaleString('en-IN') + ' kg') + '</table>' +
      '<h2>What we recommend</h2><ul>' + (n.sink ? '<li>' + n.sink + ' chairs: new gas lifts, tested under load.</li>' : '') + (n.torn ? '<li>' + n.torn + ' chairs: new seat foam and fabric.</li>' : '') + (n.base ? '<li>' + n.base + ' chairs: new castors or bases.</li>' : '') + (n.arms ? '<li>' + n.arms + ' chairs: arms fixed or replaced.</li>' : '') + (n.sofas ? '<li>' + n.sofas + ' sofas: reupholstery, quoted after a visit.</li>' : '') + (n.desks ? '<li>' + n.desks + ' workstations or pedestals: repair, quoted after a visit.</li>' : '') + '<li>A free on-site check to confirm each fix before any work starts.</li></ul>' +
      '<p class="note">Guide figures: a new ergonomic chair at ₹${NEW_CHAIR.toLocaleString('en-IN')}, a typical one-part repair at ₹${CHAIR_FIX}, ${CHAIR_KG} kg CO₂e per new chair (the lowest of three published chair declarations). Final prices follow an on-site assessment.</p>' +
      '<p class="rep-f">Lynchpin Associates · 22, 3rd floor, 6th cross, Sampige Road, Malleshwaram, Bengaluru 560003 · +91 90366 15441 · marketing@lynchpin.co.in</p>';
  };
  ${submitScript("'audit'", "f", "d.audit = nums(); d.note = 'From the free audit page';")}
})();
</script>`,
  });
}

/* ---------- carbon certificate (printable, one per job) ---------- */
export function certificatePage() {
  return shell({
    title: 'Repair Certificate | Lynchpin Associates', description: 'A Lynchpin certificate of office furniture repaired and the carbon avoided by repairing instead of buying new.',
    path: '/certificate', noindex: true, cta: false,
    body: `<section class="wrap block"><div class="cert" id="cert"><p class="note">Loading the certificate…</p></div>
<div class="cta-b no-print" id="cert-actions" hidden><button class="btn" type="button" onclick="print()">Print or save as PDF</button><a class="btn ghost" id="cert-share" href="#">Share on LinkedIn</a></div></section>
<script>
(function(){
  var id = new URLSearchParams(location.search).get('id'), box = document.getElementById('cert');
  var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(x){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[x]; }); };
  if (!id) { box.innerHTML = '<h1>Certificate not found</h1><p>Check the link you were sent.</p>'; return; }
  fetch('/api/public?type=certificate&id=' + encodeURIComponent(id)).then(function(r){ if (!r.ok) throw 0; return r.json(); }).then(function(c){
    var items = [['Office chairs', c.chairs], ['Sofas and lounge seats', c.sofas], ['Workstations', c.workstations], ['Pedestals', c.pedestals], ['Other pieces', c.other]].filter(function(x){ return +x[1] > 0; });
    var total = items.reduce(function(s, x){ return s + (+x[1]); }, 0), kg = Math.round(+c.co2Kg || 0);
    var when = c.date ? new Date(c.date + 'T00:00:00').toLocaleDateString('en-IN', {month:'long', year:'numeric'}) : '';
    document.title = 'Repair certificate: ' + c.company + ' | Lynchpin';
    box.innerHTML = '<div class="cert-in">' +
      '<div class="cert-top"><img src="/assets/logo.png" alt="Lynchpin" width="480" height="128"><span>Certificate no. ' + esc(c.number || c.id) + '</span></div>' +
      '<p class="cert-k">Certificate of repair</p>' +
      '<h1>' + esc(c.company) + '</h1>' +
      '<p class="cert-lede">repaired ' + total + ' piece' + (total === 1 ? '' : 's') + ' of office furniture with Lynchpin' + (c.city ? ' in ' + esc(c.city) : '') + (when ? ', ' + when : '') + ', instead of buying new.</p>' +
      (kg ? '<div class="cert-big"><b>' + (kg >= 1000 ? (kg / 1000).toFixed(1) + ' t' : kg + ' kg') + '</b><span>CO₂e avoided, estimated</span></div>' : '') +
      '<table>' + items.map(function(x){ return '<tr><td>' + x[0] + '</td><td>' + x[1] + '</td></tr>'; }).join('') + '</table>' +
      '<p class="note">How we count: each repaired office chair avoids ${CHAIR_KG} kg CO₂e, the lowest of three published environmental product declarations for task chairs. Other pieces are listed but not counted, so the figure is conservative. Carbon from repair parts is not counted.</p>' +
      '<div class="cert-f"><div><b>Lynchpin Associates</b><br>Ergonomic Solutions, Bengaluru</div><div>Check this certificate at<br>' + esc(location.host + location.pathname) + '?id=' + esc(c.id) + '</div></div></div>';
    document.getElementById('cert-actions').hidden = false;
    document.getElementById('cert-share').href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(location.href);
  }).catch(function(){ box.innerHTML = '<h1>Certificate not found</h1><p>Check the link you were sent, or call +91 90366 15441.</p>'; });
})();
</script>`,
  });
}

/* ---------- review form ---------- */
export function reviewPage() {
  return shell({
    title: 'Review Lynchpin | Tell Us How the Repair Went', description: 'Had office furniture repaired by Lynchpin? Tell us how it went. It takes a minute.',
    path: '/review', noindex: true, cta: false,
    body: `<section class="wrap form-page">
<div class="form-intro"><p class="crumb"><a href="/">Home</a> / Review</p><h1>How did we do?</h1>
<p class="lede">A minute of your time helps other offices find a repair team they can trust, and tells us what to improve.</p></div>
<form class="form" id="rev" novalidate>
<fieldset class="stars wide"><legend>Your rating</legend>${[5, 4, 3, 2, 1].map((n) => `<input type="radio" name="rating" id="s${n}" value="${n}"${n === 5 ? ' checked' : ''}><label for="s${n}" title="${n} of 5">★</label>`).join('')}</fieldset>
${field('r-quote', 'What did we fix, and how did it go? <span>*</span>', '<textarea id="r-quote" name="quote" rows="4" required></textarea>', true)}
${field('r-name', 'Your name <span>*</span>', '<input id="r-name" name="name" autocomplete="name" required>')}
${field('r-role', 'Your role', '<input id="r-role" name="role" placeholder="e.g. Facilities Manager">')}
${field('r-company', 'Company <span>*</span>', '<input id="r-company" name="company" autocomplete="organization" required>', true)}
<label class="check wide"><input type="checkbox" name="permission" checked> Lynchpin may show this review on its website</label>
${honeypot}
<button class="btn wide" type="submit">Send review</button>
<p class="status" role="status"></p>
</form>
<div class="done" hidden><h2>Thank you.</h2><p>We read every review.</p><p id="g-ask" hidden>It would help us a lot if you also posted it on Google: <a class="btn" id="g-link" href="#" target="_blank" rel="noopener">Review us on Google</a></p><p>Follow us on <a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>.</p></div>
</section>
<script>
(function(){
  var f = document.getElementById('rev'), q = new URLSearchParams(location.search);
  if (q.get('c')) f.company.value = q.get('c');
  // Only a Google review link, so the page cannot be made to point anywhere else
  if (/^https:\/\/(g\.page|maps\.app\.goo\.gl|search\.google\.com|(www\.)?google\.[a-z.]+)\//.test(q.get('g') || '')) { document.getElementById('g-link').href = q.get('g'); document.getElementById('g-ask').hidden = false; }
  f.addEventListener('submit', function(e){
    e.preventDefault();
    var s = f.querySelector('.status'), b = f.querySelector('button[type=submit]'), d = {type:'review', permission:f.permission.checked};
    new FormData(f).forEach(function(v, k){ if (k !== 'permission') d[k] = v; });
    if (!d.name || !d.company || (d.quote || '').length < 10) { s.textContent = 'Add your name, company and a few words about the work.'; return; }
    b.disabled = true; s.textContent = 'Sending…';
    fetch('/api/public', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d)})
      .then(function(r){ return r.json().then(function(j){ if (!r.ok) throw new Error(j.error || 'failed'); }); })
      .then(function(){ f.hidden = true; f.parentNode.querySelector('.done').hidden = false; })
      .catch(function(err){ b.disabled = false; s.textContent = err.message && err.message !== 'failed' ? err.message : 'That did not go through. Try again.'; });
  });
})();
</script>`,
  });
}
