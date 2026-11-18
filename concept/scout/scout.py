"""Lynchpin account scout. Runs on its own: plain Python 3, no API keys, no AI.

It reads Google News RSS for recent office leases, new GCCs and coworking openings,
keeps headlines that name a company and show real scale (1 lakh sq ft or more, 1,000+ seats,
or a new GCC), and saves each new company as a target account.

Where it saves:
  - By default: scout/out/prospects.json (next to this file).
  - If MONGODB_URI is set: the "prospects" collection in MongoDB (database MONGODB_DB,
    default "lynchpin"). Use this when the admin is hosted. Needs: pip install -r scout/requirements.txt

Usage:
  python3 scout/scout.py            # find and save
  python3 scout/scout.py --dry-run  # print what it would add, save nothing
"""
import datetime
import email.utils
import html
import json
import os
import re
import ssl
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_FILE = os.path.join(HERE, "out", "prospects.json")
ADMIN_SNAPSHOT = os.path.join(os.path.dirname(HERE), "admin-data.js")
MAX_PER_RUN = 10
MAX_AGE_DAYS = 30
UA = "Mozilla/5.0 (compatible; LynchpinScout/1.0)"

# python.org builds on macOS ship without CA certificates; fall back to the system's file
SSL = ssl.create_default_context()
if not SSL.get_ca_certs() and os.path.exists("/etc/ssl/cert.pem"):
    SSL.load_verify_locations("/etc/ssl/cert.pem")

QUERIES = [
    "Bengaluru lakh sq ft office lease",
    "Bengaluru new GCC office opens",
    "Bengaluru coworking new centre seats",
    "Hyderabad lakh sq ft office lease",
    "Chennai lakh sq ft office lease",
    "Pune lakh sq ft office lease",
    "Mumbai lakh sq ft office lease",
    "Gurugram lakh sq ft office lease",
    "flex workspace operator adds seats India",
    "global capability centre India new campus",
]

# Headline pattern: "<Company> <verb> ...". The company is whatever comes before the verb.
VERBS = (r"leases|sub-leases|subleases|pre-leases|takes up|takes|rents|signs|adds|opens|unveils|launches|"
         r"inaugurates|sets up|expands|announces|plans|acquires|bags|moves|to open|to set up|to lease")
HEADLINE = re.compile(r"^(?P<company>[A-Z0-9][\w&.'’()\- ]{1,60}?)\s+(?:" + VERBS + r")\b", re.I)

# Words that start a headline but are not a company
NOT_COMPANY = re.compile(
    r"^(india|indian|bengaluru|bangalore|hyderabad|chennai|pune|mumbai|delhi|gurugram|noida|ncr|karnataka|"
    r"office|offices|green|global|gccs?|top|why|how|what|the|this|these|new|record|report|demand|supply|"
    r"leasing|rents?|up|govt|government|state|city|bda|sebi|rbi|cm|pm|budget|realty|real estate|jll|cbre|"
    r"colliers|knight frank|anarock|cushman|vestian|q[1-4]|h[12]|\d)", re.I)

CITIES = ["Bengaluru", "Hyderabad", "Chennai", "Pune", "Mumbai", "Navi Mumbai", "Gurugram", "Noida", "Delhi",
          "Kolkata", "Ahmedabad", "Kochi", "Coimbatore", "Mysuru"]
CITY_ALIASES = {"bangalore": "Bengaluru", "gurgaon": "Gurugram", "airoli": "Navi Mumbai", "whitefield": "Bengaluru"}

SEGMENTS = [
    ("Facility management", r"facility management|facilities management|integrated facility|\bifm\b"),
    ("Coworking", r"cowork|co-work|flex|managed office|workspace operator|seats?\b"),
    ("Hospitals", r"hospital|healthcare campus"),
    ("Universities", r"university|college|campus for students"),
    ("Banks and BFSI", r"\bbank|insurance|financial services|bfsi|hsbc|citi|barclays|jpmorgan"),
    ("IT and GCC campuses", r"\bgcc\b|capability cent|tech cent|technology cent|innovation cent|it park|tech park|engineering cent"),
    ("Office parks and landlords", r"office park|business park|developer|reit"),
]
ROLE_BY_SEGMENT = {
    "Facility management": "Head of Soft Services or Vendor Management",
    "Coworking": "Head of Facilities or Workplace Operations",
    "Office parks and landlords": "Property or Facility Manager",
    "IT and GCC campuses": "Admin and Facilities Manager",
    "Hospitals": "Facilities or Purchase Head",
    "Universities": "Estate or Admin Officer",
    "Banks and BFSI": "Admin and Premises Head",
    "Other": "Admin and Facilities Manager",
}
WHY_BY_SEGMENT = {
    "Coworking": "Flex operator adding space: many chairs across centres, worn by heavy daily use.",
    "Facility management": "Facility firm that hires furniture vendors for many client sites.",
}
WHY_DEFAULT = "Big recent office move or expansion: new floors mean new chairs to set up and keep running."


def fetch(query):
    url = ("https://news.google.com/rss/search?" + urllib.parse.urlencode(
        {"q": query + " when:%dd" % MAX_AGE_DAYS, "hl": "en-IN", "gl": "IN", "ceid": "IN:en"}))
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20, context=SSL) as r:
        root = ET.fromstring(r.read())
    for item in root.iter("item"):
        title = html.unescape(item.findtext("title") or "")
        source = item.findtext("source") or ""
        if source and title.endswith(" - " + source):
            title = title[: -len(source) - 3]
        yield {"title": title.strip(), "link": item.findtext("link") or "", "source": source,
               "date": email.utils.parsedate_to_datetime(item.findtext("pubDate"))}


def scale_of(text):
    """Returns (lakh sq ft, seats) found in the text, or None for each."""
    t = text.lower().replace(",", "")
    lakh = None
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:lakh|lk)\s*(?:sq\.?\s*ft|sqft|square feet)", t)
    if m:
        lakh = float(m.group(1))
    else:
        m = re.search(r"(\d+(?:\.\d+)?)\s*(?:mn|million)\s*(?:sq\.?\s*ft|sqft|square feet)", t)
        if m:
            lakh = float(m.group(1)) * 10
        else:
            m = re.search(r"(\d{5,7})\s*(?:sq\.?\s*ft|sqft|square feet)", t)
            if m:
                lakh = int(m.group(1)) / 100000
    m = re.search(r"(\d{3,6})[\s-]*(?:seats?|seater|desks?|employees|staff|people)", t)
    seats = int(m.group(1)) if m else None
    return lakh, seats


def segment_of(text):
    for name, pattern in SEGMENTS:
        if re.search(pattern, text, re.I):
            return name
    return "Other"


def city_of(text):
    t = text.lower()
    found = [c for c in CITIES if c.lower() in t]
    found += [v for k, v in CITY_ALIASES.items() if k in t and v not in found]
    return ", ".join(dict.fromkeys(found)) or "India"


def clean_company(name):
    name = re.sub(r"\s+", " ", name).strip(" -:'’\"")
    name = re.sub(r"^(?:report|exclusive|breaking)\s*:\s*", "", name, flags=re.I)
    # "Investment giant Blackstone", "US fintech major SEI", "Chennai-based Ramco" -> the name alone
    name = re.sub(r"^.*?\b(?i:giant|major|firm|maker|player|lender|company|biggest|leader|startup|unicorn|"
                  r"[a-z]+-based|[a-z]+-headquartered)\s+(?=[A-Z0-9])", "", name)
    return name


def key_of(name):
    """Loose name key, so "IBM", "IBM India" and "IBM India Pvt Ltd" match."""
    n = name.lower()
    n = re.sub(r"\(.*?\)", " ", n)
    n = re.sub(r"\b(india|indian|pvt|private|ltd|limited|llp|inc|corp|corporation|group|technologies|technology|"
               r"tech|services|solutions|global|gcc|centre|center|capability|the|co)\b", " ", n)
    n = re.sub(r"[^a-z0-9]+", "", n)
    return n


# Current Lynchpin customers: never add these as targets
CUSTOMERS = ["Wipro", "Mercedes-Benz", "CBRE", "Colliers", "Embassy", "Indiqube", "Cyient", "Zensar", "Kantar",
             "Himalaya", "IIM Bangalore"]


def same_company(a, b):
    """Keys match, or one starts with the other ("bhive" and "bhiveworkspace")."""
    if not a or not b:
        return False
    short, long_ = sorted((a, b), key=len)
    return short == long_ or (len(short) >= 4 and long_.startswith(short))


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:40]


def candidate(item):
    """Turns one news item into a target account, or None when it doesn't fit."""
    m = HEADLINE.match(item["title"])
    if not m:
        return None
    company = clean_company(m.group("company"))
    if NOT_COMPANY.match(company) or re.search(r"\b(govt|government|ministry|authority)\b", company, re.I) \
            or len(company) < 2 or len(company.split()) > 7:
        return None
    lakh, seats = scale_of(item["title"])
    gcc = re.search(r"\bgcc\b|capability cent", item["title"], re.I)
    if not ((lakh and lakh >= 1) or (seats and seats >= 1000) or gcc):
        return None
    segment = segment_of(company + " " + item["title"])
    if (lakh and lakh >= 3) or segment in ("Facility management", "Coworking"):
        priority = "A"
    elif lakh and lakh >= 1:
        priority = "B"
    else:
        priority = "C"
    scale = ", ".join(x for x in [
        ("%g lakh sq ft" % lakh) if lakh else "", ("%d seats" % seats) if seats else ""] if x)
    role = ROLE_BY_SEGMENT[segment]
    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return {
        "id": "x-" + item["date"].strftime("%Y%m%d") + "-" + slug(company),
        "company": company,
        "segment": segment,
        "city": city_of(item["title"]),
        "why": WHY_BY_SEGMENT.get(segment, WHY_DEFAULT),
        "signal": "%s (%s, %s)" % (item["title"], item["source"] or "news", item["date"].strftime("%d %b %Y")),
        "sourceUrl": item["link"],
        "targetRole": role,
        "priority": priority,
        "status": "research",
        "scale": scale,
        "contactName": "", "contactRole": "", "contactPhone": "", "contactEmail": "",
        "source": "Auto scout", "foundBy": "Daily scout",
        "nextStep": "Check the news link, then find the %s through LinkedIn or a referral" % role.lower(),
        "nextDate": "", "owner": "", "notes": "",
        "createdAt": now, "updatedAt": now,
    }


class FileStore:
    """Saves to scout/out/prospects.json. Knows the companies in that file and in the admin snapshot."""

    def __init__(self, path=OUT_FILE):
        self.path = path
        self.rows = []
        if os.path.exists(path):
            with open(path, encoding="utf-8") as f:
                self.rows = json.load(f)

    def known_names(self):
        names = [r["company"] for r in self.rows]
        if os.path.exists(ADMIN_SNAPSHOT):
            with open(ADMIN_SNAPSHOT, encoding="utf-8") as f:
                s = f.read()
            docs = json.loads(s[s.index("{"): s.rstrip().rindex(";")])["docs"]
            names += [d.get("company", "") for k, d in docs.items() if k.startswith("prospects/")]
        return names

    def add(self, rows):
        self.rows.extend(rows)
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump(self.rows, f, indent=1, ensure_ascii=False)


class MongoStore:
    """Saves to the "prospects" collection of a MongoDB database (MongoDB Atlas when hosted).
    Each account's id is its _id, so a re-run never saves the same account twice."""

    def __init__(self, uri, db_name):
        import certifi  # CA certificates; python.org builds on macOS have none
        from pymongo import MongoClient  # only needed when MONGODB_URI is set
        self.col = MongoClient(uri, serverSelectionTimeoutMS=15000, tlsCAFile=certifi.where())[db_name]["prospects"]

    def known_names(self):
        return [r["company"] for r in self.col.find({}, {"company": 1, "_id": 0}) if r.get("company")]

    def add(self, rows):
        from pymongo import UpdateOne
        self.col.bulk_write([UpdateOne({"_id": r["id"]}, {"$setOnInsert": {k: v for k, v in r.items() if k != "id"}},
                                       upsert=True) for r in rows])


def main():
    dry = "--dry-run" in sys.argv
    uri = os.environ.get("MONGODB_URI")
    store = MongoStore(uri, os.environ.get("MONGODB_DB", "lynchpin")) if uri else FileStore()
    seen = [key_of(n) for n in store.known_names() + CUSTOMERS if n]
    cutoff = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=MAX_AGE_DAYS)

    found, skipped = [], 0
    for q in QUERIES:
        items = None
        for attempt in range(3):  # Google News answers 429 when asked too fast
            try:
                items = list(fetch(q))
                break
            except Exception as e:
                err = e
                time.sleep(5 * (attempt + 1))
        if items is None:  # one bad feed shouldn't stop the run
            print("feed failed:", q, "-", err, file=sys.stderr)
            continue
        time.sleep(2)
        for item in items:
            if item["date"] < cutoff:
                continue
            row = candidate(item)
            if not row:
                continue
            k = key_of(row["company"])
            if not k or any(same_company(k, s) for s in seen):
                skipped += 1
                continue
            seen.append(k)
            found.append(row)

    # Biggest signals first
    found.sort(key=lambda r: (r["priority"], r["createdAt"]))
    found = found[:MAX_PER_RUN]
    for r in found:
        print("%s  %-32s %-28s %s" % (r["priority"], r["company"][:32], r["segment"][:28], r["scale"]))
    print("%d new, %d already known" % (len(found), skipped))
    if found and not dry:
        store.add(found)
        print("saved to", "MongoDB" if isinstance(store, MongoStore) else store.path)


if __name__ == "__main__":
    main()
