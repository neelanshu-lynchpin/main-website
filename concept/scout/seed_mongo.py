"""One-time import: copies the current admin data into MongoDB, so the database starts complete
and the scout never re-adds a company the team already has.

Reads concept/admin-data.js (the copy of the claude.ai admin) and scout/out/prospects.json
(accounts the scout saved locally). Safe to run again: existing documents are left as they are.

Usage: MONGODB_URI=... python3 scout/seed_mongo.py
"""
import json
import os

import certifi
from pymongo import MongoClient, UpdateOne

HERE = os.path.dirname(os.path.abspath(__file__))
SNAPSHOT = os.path.join(os.path.dirname(HERE), "admin-data.js")
SCOUT_FILE = os.path.join(HERE, "out", "prospects.json")

db = MongoClient(os.environ["MONGODB_URI"], serverSelectionTimeoutMS=15000, tlsCAFile=certifi.where())[os.environ.get("MONGODB_DB", "lynchpin")]

docs = {}
if os.path.exists(SNAPSHOT):
    with open(SNAPSHOT, encoding="utf-8") as f:
        s = f.read()
    docs.update(json.loads(s[s.index("{"): s.rstrip().rindex(";")])["docs"])
if os.path.exists(SCOUT_FILE):
    with open(SCOUT_FILE, encoding="utf-8") as f:
        for r in json.load(f):
            docs["prospects/" + r["id"]] = {k: v for k, v in r.items() if k != "id"}

by_col = {}
for path, data in docs.items():
    col, doc_id = path.split("/", 1)
    by_col.setdefault(col, []).append(UpdateOne({"_id": doc_id}, {"$setOnInsert": data}, upsert=True))
for col, ops in by_col.items():
    res = db[col].bulk_write(ops)
    print("%-10s %d added, %d already there" % (col, res.upserted_count, len(ops) - res.upserted_count))
