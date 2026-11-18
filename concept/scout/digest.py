"""Daily numbers email for the Lynchpin team. Plain Python 3; GitHub Actions runs it every morning.

Reads MongoDB (the same data as the admin) and emails DIGEST_TO a one-screen summary: new
enquiries and where they came from, the pipeline, quotes waiting, money won, contracts due,
what the scout found, and reviews.

Needs: MONGODB_URI, SMTP_USER and SMTP_PASS (a Gmail address and its app password), and
DIGEST_TO (one address, or several separated by commas).

Usage:
  python3 scout/digest.py            # send
  python3 scout/digest.py --print    # print the email instead of sending it
"""
import datetime
import html
import os
import smtplib
import sys
from email.mime.text import MIMEText

import certifi
from pymongo import MongoClient

SITE = "https://main-website-concept.vercel.app"
IST = datetime.timezone(datetime.timedelta(hours=5, minutes=30))


def inr(n):
    """Indian grouping: 1,47,500"""
    n = int(round(n or 0))
    s = str(abs(n))
    if len(s) > 3:
        head, tail = s[:-3], s[-3:]
        head = ",".join([head[max(0, i - 2):i] for i in range(len(head), 0, -2)][::-1])
        s = head + "," + tail
    return ("-" if n < 0 else "") + "₹" + s


def main():
    uri = os.environ["MONGODB_URI"]
    tls = {"tlsCAFile": certifi.where()} if uri.startswith("mongodb+srv") else {}  # Atlas needs CA certificates
    db = MongoClient(uri, serverSelectionTimeoutMS=15000, **tls)[os.environ.get("MONGODB_DB", "lynchpin")]
    now = datetime.datetime.now(IST)
    since = (now - datetime.timedelta(days=1)).astimezone(datetime.timezone.utc).isoformat()
    month = now.strftime("%Y-%m")
    today = now.strftime("%Y-%m-%d")

    leads = [l for l in db.leads.find({}) if not l.get("demo")]
    new = [l for l in leads if (l.get("createdAt") or "") >= since]
    by_source = {}
    for l in new:
        by_source[l.get("source") or "Added by hand"] = by_source.get(l.get("source") or "Added by hand", 0) + 1
    open_leads = [l for l in leads if l.get("stage") not in ("won", "lost")]
    waiting_call = [l for l in open_leads if (l.get("stage") or "new") == "new" and not l.get("firstContactAt")]
    won_month = [l for l in leads if l.get("stage") == "won" and (l.get("wonAt") or l.get("updatedAt") or "").startswith(month)]
    quotes = [q for q in db.quotes.find({"status": "sent"}) if not q.get("demo")]
    contracts = [c for c in db.contracts.find({"status": {"$ne": "ended"}}) if not c.get("demo") and (c.get("end") or "9") >= today]
    renew_soon = [c for c in contracts if c.get("end") and c["end"] <= (now + datetime.timedelta(days=30)).strftime("%Y-%m-%d")]
    found = list(db.prospects.find({"foundBy": "Daily scout", "createdAt": {"$gte": since}}))
    reviews = list(db.reviews.find({}))
    avg = sum(r.get("rating", 0) for r in reviews) / len(reviews) if reviews else 0

    tiles = [
        (len(new), "new enquiries in the last 24 hours"),
        (len(waiting_call), "enquiries still waiting for a first call"),
        (inr(sum(l.get("value") or 0 for l in open_leads)), "open pipeline (%d leads)" % len(open_leads)),
        (len(quotes), "quotes sent, waiting on a reply"),
        (inr(sum(l.get("value") or 0 for l in won_month)), "won this month (%d deal%s)" % (len(won_month), "" if len(won_month) == 1 else "s")),
        (inr(sum(c.get("value") or 0 for c in contracts)), "a year from %d active contracts" % len(contracts)),
    ]
    rows = "".join(
        '<td style="padding:12px 14px;border:1px solid #E1DAD8;width:33%%"><div style="font:bold 22px Arial">%s</div>'
        '<div style="color:#5D6168;font-size:13px">%s</div></td>%s' % (html.escape(str(v)), html.escape(t), "</tr><tr>" if i == 2 else "")
        for i, (v, t) in enumerate(tiles))

    def lst(title, items):
        if not items:
            return ""
        return '<h3 style="font:bold 16px Arial;margin:22px 0 6px">%s</h3><ul style="margin:0;padding-left:18px">%s</ul>' % (
            html.escape(title), "".join("<li>%s</li>" % i for i in items))

    body = (
        '<div style="font:15px/1.5 Arial,sans-serif;color:#16181B;max-width:640px">'
        '<div style="background:#E3181F;color:#fff;padding:14px 18px;font:bold 18px Arial">Lynchpin today · %s</div>'
        '<table style="border-collapse:collapse;width:100%%;margin:14px 0"><tr>%s</tr></table>' % (now.strftime("%A %d %B"), rows)
        + lst("New enquiries by source", ["%s: %d" % (html.escape(k), v) for k, v in sorted(by_source.items(), key=lambda x: -x[1])])
        + lst("Call these first", ["%s, %s (%s)" % (html.escape(l.get("company") or ""), html.escape(l.get("contact") or ""), html.escape(l.get("source") or "")) for l in waiting_call[:8]])
        + lst("Contracts renewing in 30 days", ["%s: %s, renews %s" % (html.escape(c.get("company") or ""), inr(c.get("value")), c.get("end")) for c in renew_soon])
        + lst("Scout found overnight", ["%s (%s)" % (html.escape(p.get("company") or ""), html.escape(p.get("segment") or "")) for p in found])
        + ('<p style="margin-top:18px">Reviews: %d, average %.1f out of 5.</p>' % (len(reviews), avg) if reviews else "")
        + '<p style="margin-top:22px"><a href="%s/admin" style="background:#16181B;color:#fff;padding:10px 16px;text-decoration:none;font-weight:bold">Open the admin</a></p></div>' % SITE
    )
    subject = "Lynchpin today: %d new enquiries, %s won this month" % (len(new), inr(sum(l.get("value") or 0 for l in won_month)))

    if "--print" in sys.argv:
        print(subject)
        print(body)
        return
    to = [a.strip() for a in os.environ["DIGEST_TO"].split(",") if a.strip()]
    msg = MIMEText(body, "html", "utf-8")
    msg["Subject"], msg["From"], msg["To"] = subject, "Lynchpin admin <%s>" % os.environ["SMTP_USER"], ", ".join(to)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as s:
        s.login(os.environ["SMTP_USER"], os.environ["SMTP_PASS"])
        s.sendmail(os.environ["SMTP_USER"], to, msg.as_string())
    print("sent to", ", ".join(to))


if __name__ == "__main__":
    main()
