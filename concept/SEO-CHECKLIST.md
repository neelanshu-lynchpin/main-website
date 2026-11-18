# Getting Lynchpin found on Google and AI search

The website side is done: service pages, blog, FAQ, structured data, sitemap, robots.txt and llms.txt.
The steps below happen outside the website and need your accounts. Do them in this order; the first three matter most.

## 1. Put the site on lynchpin.co.in (biggest single win)

Right now the site lives at `main-website-concept.vercel.app`. Google trusts a company's own domain far more, and people searching "Lynchpin" will see `lynchpin.co.in` and recognise it.

1. Vercel → the project → Settings → Domains → add `lynchpin.co.in` and `www.lynchpin.co.in`.
2. Vercel shows two DNS records. Add them where the domain is registered (the same place that runs the company email). Do not touch the existing MX records, or email stops working.
3. Tell me once it works. I change one line (`SITE` in `concept/seo-pages.mjs`) so every page, the sitemap and the structured data point to the new address, and the old address redirects.

## 2. Google Business Profile (this is what shows on Maps and "near me" searches)

1. Go to business.google.com and create or claim "Lynchpin Associates".
2. Category: **Furniture repair shop**. Add **Upholstery shop** as a second category.
3. Address, phone and website must match the site exactly:
   - Lynchpin Associates
   - 22, 3rd floor, 6th cross, Sampige Road, Malleshwaram, Bengaluru 560003
   - +91 90366 15441
   - Website: the site address from step 1
4. Add the services: office chair repair, sofa reupholstery, leather furniture repair, workstation repair, pedestal lock repair, office furniture maintenance contracts.
5. Upload 10 or more real photos: before/after repairs, the team at work, the office.
6. Ask 5 to 10 happy clients for a Google review. Reviews move a local listing more than anything else.

## 3. Google Search Console and Bing Webmaster Tools

1. search.google.com/search-console → add the site. If it asks for an HTML tag, send me the code and I will add it.
2. Submit the sitemap: `https://<site address>/sitemap.xml`
3. bing.com/webmasters → "Import from Google Search Console". Bing results feed ChatGPT search and Microsoft Copilot, so this matters for AI answers too.

## 4. LinkedIn, linked both ways

1. LinkedIn company page → Edit page → Website: put the site address.
2. In each new post, add a link to the matching page, for example a chair repair post links to `/services/office-chair-repair-bengaluru`.
3. To turn a post into a blog article on the site, send me the post text and its link (… on the post → Copy link to post). It gets its own page that links back to the LinkedIn post.

## 5. Listings that link back (backlinks)

Use the exact same name, address and phone everywhere. Free listings worth doing:

- JustDial
- Sulekha
- IndiaMART
- TradeIndia
- Apple Business Connect (Apple Maps)
- Bing Places (import from Google Business Profile)

## 6. Backlinks that carry real weight

- Ask clients and partners (facility management firms, coworking operators, office parks) to list Lynchpin on their vendor or partner pages.
- With a client's permission, write a short case study ("How we repaired 200 chairs at …"). Post it on the blog and on LinkedIn, and ask the client to share it.
- Join a Bengaluru facility management or business association that lists members on its website.

Do not buy backlinks or use "SEO packages" that promise hundreds of links. Google penalises them, and the site can drop out of results.

## 7. Keep it going

- One new blog post every two weeks. Send me the LinkedIn post or a few lines on a real job and I will write it up.
- Real numbers beat guesses: when you finish a big job, note the number of pieces and what was fixed.

## What to expect

New sites usually take 4 to 12 weeks to show up for searches like "office chair repair Bengaluru". The Google Business Profile often shows on Maps sooner, within one to two weeks of verification.
