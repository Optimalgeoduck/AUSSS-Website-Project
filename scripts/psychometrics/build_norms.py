#!/usr/bin/env python3
"""Build population norms for the AUSSS Sorting quiz from public survey data.

Downloads two openly released raw datasets from openpsychometrics.org and
computes the statistics the quiz needs:

  * RIASEC Holland-code test (n ~= 145,828) -> the six vocational-interest
    axes (R, I, A, S, E, C). This is the backbone of the Sorting model.
  * IPIP Big-Five Factor Markers (n ~= 1,015,342) -> the Agreeableness and
    Openness domains, which we use as the "Compassion" and "Openness" facet
    axes that separate the six helping committees.

For each scale we emit the population mean and SD (on the raw 1-5 item metric)
and the per-item item-total correlation (item discrimination). The means/SDs
let the app express committee centroids and respondent scores in comparable,
population-anchored units; the item-total correlations tell us which item
*content* is the strongest indicator of each axis, so we adapt the best ones
into the quiz's forced-choice options.

Everything here uses only the Python standard library (no pip installs).

Data + licensing
  - openpsychometrics.org raw data is released for public/research use.
  - Item wording we adapt comes from the International Personality Item Pool
    (IPIP), which is public domain.
See scripts/psychometrics/README.md for details and re-run instructions.

Usage:
  python scripts/psychometrics/build_norms.py [--cap N]

  --cap N   Cap the number of rows processed per dataset (default 120000).
            Means/SDs and item-total correlations are stable well below the
            full IPIP-FFM million rows; the cap keeps the run fast.
"""

from __future__ import annotations

import argparse
import csv
import datetime as _dt
import io
import json
import math
import os
import sys
import urllib.request
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, ".cache")
OUT = os.path.normpath(os.path.join(HERE, "..", "..", "src", "data", "psychometrics", "norms.json"))

DATASETS = {
    "riasec": {
        "url": "https://openpsychometrics.org/_rawdata/RIASEC_data12Dec2018.zip",
        "zip": "RIASEC_data12Dec2018.zip",
    },
    "ipipffm": {
        "url": "https://openpsychometrics.org/_rawdata/IPIP-FFM-data-8Nov2018.zip",
        "zip": "IPIP-FFM-data-8Nov2018.zip",
    },
}

RIASEC_TYPES = ["R", "I", "A", "S", "E", "C"]
RIASEC_ITEMS = {t: [f"{t}{i}" for i in range(1, 9)] for t in RIASEC_TYPES}  # 8 items each

# IPIP-FFM 50-item markers (Goldberg). We only need Agreeableness (our
# "Compassion" axis: concern for / sympathy with others) and Openness (our
# "Openness" axis: imagination / ideas / intellect). Listed with reverse keys.
IPIP_DOMAINS = {
    # domain -> {item: +1 (keyed) or -1 (reverse-keyed)}
    "AGR": {"AGR1": -1, "AGR2": 1, "AGR3": -1, "AGR4": 1, "AGR5": -1,
            "AGR6": 1, "AGR7": -1, "AGR8": 1, "AGR9": 1, "AGR10": 1},
    "OPN": {"OPN1": 1, "OPN2": -1, "OPN3": 1, "OPN4": -1, "OPN5": 1,
            "OPN6": -1, "OPN7": 1, "OPN8": 1, "OPN9": 1, "OPN10": 1},
}


def log(*a):
    print(*a, file=sys.stderr, flush=True)


def download(url: str, dest: str):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        log(f"  cached: {os.path.basename(dest)} ({os.path.getsize(dest)/1e6:.1f} MB)")
        return
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    log(f"  downloading {url} ...")
    req = urllib.request.Request(url, headers={"User-Agent": "ausss-norms/1.0"})
    with urllib.request.urlopen(req, timeout=120) as r, open(dest, "wb") as f:
        f.write(r.read())
    log(f"  saved {os.path.basename(dest)} ({os.path.getsize(dest)/1e6:.1f} MB)")


def open_data_csv(zip_path: str):
    """Return (text_stream, delimiter) for the data.csv inside a dataset zip."""
    zf = zipfile.ZipFile(zip_path)
    csvs = [n for n in zf.namelist() if n.lower().endswith(".csv") and not n.endswith("/")]
    # Prefer an exact data.csv, else the dataset's data-final.csv, else any csv.
    name = (next((n for n in csvs if n.lower().endswith("data.csv")), None)
            or next((n for n in csvs if "data" in n.lower()), None)
            or (csvs[0] if csvs else None))
    if name is None:
        raise RuntimeError(f"no csv in {zip_path}: {zf.namelist()[:5]}")
    raw = zf.read(name)
    text = io.StringIO(raw.decode("utf-8", errors="replace"))
    first = text.readline()
    text.seek(0)
    delim = "\t" if first.count("\t") >= first.count(",") else ","
    return text, delim


class Accum:
    """Streaming accumulators for one scale: scale mean/SD + per-item
    item-total (item vs. rest-of-scale) Pearson correlation."""

    def __init__(self, items):
        self.items = items
        self.n = 0
        self.s = 0.0          # sum of scale means (item average, 1-5)
        self.ss = 0.0         # sum of squares of scale means
        # per item: n, sum_x, sum_xx, sum_t (rest), sum_tt, sum_xt
        self.it = {i: [0, 0.0, 0.0, 0.0, 0.0, 0.0] for i in items}

    def add(self, vals):
        """vals: dict item->float already keyed (reverse-coded) in 1..5."""
        xs = [vals[i] for i in self.items]
        total = sum(xs)
        k = len(xs)
        self.n += 1
        mean = total / k
        self.s += mean
        self.ss += mean * mean
        for i, x in zip(self.items, xs):
            rest = (total - x) / (k - 1)  # mean of the other items
            a = self.it[i]
            a[0] += 1
            a[1] += x
            a[2] += x * x
            a[3] += rest
            a[4] += rest * rest
            a[5] += x * rest

    def result(self):
        n = self.n
        mean = self.s / n if n else 0.0
        var = self.ss / n - mean * mean if n else 0.0
        sd = math.sqrt(max(var, 0.0))
        items = []
        for i in self.items:
            a = self.it[i]
            m = a[0]
            if m < 2:
                r = 0.0
            else:
                cov = a[5] / m - (a[1] / m) * (a[3] / m)
                vx = a[2] / m - (a[1] / m) ** 2
                vt = a[4] / m - (a[3] / m) ** 2
                r = cov / math.sqrt(vx * vt) if vx > 0 and vt > 0 else 0.0
            items.append({"id": i, "itemTotalR": round(r, 3)})
        items.sort(key=lambda d: d["itemTotalR"], reverse=True)
        return {"n": n, "mean": round(mean, 3), "sd": round(sd, 3), "items": items}


def in_range(v):
    return 1 <= v <= 5


def process_riasec(zip_path: str, cap: int):
    text, delim = open_data_csv(zip_path)
    reader = csv.DictReader(text, delimiter=delim)
    accs = {t: Accum(RIASEC_ITEMS[t]) for t in RIASEC_TYPES}
    rows = 0
    for row in reader:
        rows += 1
        if rows > cap:
            break
        for t in RIASEC_TYPES:
            try:
                vals = {i: float(row[i]) for i in RIASEC_ITEMS[t]}
            except (KeyError, ValueError, TypeError):
                continue
            if all(in_range(v) for v in vals.values()):
                accs[t].add(vals)
    return {t: accs[t].result() for t in RIASEC_TYPES}, min(rows, cap)


def process_ipip(zip_path: str, cap: int):
    text, delim = open_data_csv(zip_path)
    reader = csv.DictReader(text, delimiter=delim)
    accs = {d: Accum(list(IPIP_DOMAINS[d].keys())) for d in IPIP_DOMAINS}
    rows = 0
    for row in reader:
        rows += 1
        if rows > cap:
            break
        for d, keys in IPIP_DOMAINS.items():
            try:
                raw = {i: float(row[i]) for i in keys}
            except (KeyError, ValueError, TypeError):
                continue
            if not all(in_range(v) for v in raw.values()):
                continue
            keyed = {i: (v if keys[i] == 1 else 6 - v) for i, v in raw.items()}
            accs[d].add(keyed)
    return {d: accs[d].result() for d in IPIP_DOMAINS}, min(rows, cap)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cap", type=int, default=120000)
    args = ap.parse_args()

    log("AUSSS Sorting — building population norms")
    log(f"row cap per dataset: {args.cap}")

    for key, meta in DATASETS.items():
        download(meta["url"], os.path.join(CACHE, meta["zip"]))

    log("processing RIASEC ...")
    riasec, riasec_n = process_riasec(os.path.join(CACHE, DATASETS["riasec"]["zip"]), args.cap)
    log("processing IPIP-FFM (Agreeableness, Openness) ...")
    ipip, ipip_n = process_ipip(os.path.join(CACHE, DATASETS["ipipffm"]["zip"]), args.cap)

    out = {
        "generated": _dt.date.today().isoformat(),
        "_comment": (
            "Generated by scripts/psychometrics/build_norms.py from openpsychometrics.org "
            "raw data. mean/sd are on the raw 1-5 item metric (item average per scale). "
            "items[].itemTotalR is the item-total (item vs rest-of-scale) correlation = "
            "item discrimination; higher means the item content is a stronger indicator of "
            "that axis, and is what we adapt into the quiz options. Do not hand-edit."
        ),
        "sources": {
            "riasec": {
                "instrument": "Holland Code (RIASEC) Test",
                "url": DATASETS["riasec"]["url"],
                "rowsProcessed": riasec_n,
            },
            "ipipffm": {
                "instrument": "IPIP Big-Five Factor Markers (50-item, Goldberg)",
                "url": DATASETS["ipipffm"]["url"],
                "rowsProcessed": ipip_n,
            },
        },
        "riasec": riasec,
        "bigfive": {
            "compassion": {"from": "IPIP Agreeableness (AGR)", **ipip["AGR"]},
            "openness": {"from": "IPIP Openness (OPN)", **ipip["OPN"]},
        },
    }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
        f.write("\n")
    log(f"wrote {OUT}")

    # Human-readable summary to stdout.
    print("\n=== RIASEC (1-5 item metric) ===")
    for t in RIASEC_TYPES:
        r = riasec[t]
        top = ", ".join(f"{d['id']}={d['itemTotalR']}" for d in r["items"][:3])
        print(f"  {t}: mean={r['mean']} sd={r['sd']} n={r['n']}  topItems[{top}]")
    print("\n=== Big-Five facets (keyed, 1-5) ===")
    for label, key in (("Compassion(AGR)", "compassion"), ("Openness(OPN)", "openness")):
        r = out["bigfive"][key]
        top = ", ".join(f"{d['id']}={d['itemTotalR']}" for d in r["items"][:3])
        print(f"  {label}: mean={r['mean']} sd={r['sd']} n={r['n']}  topItems[{top}]")


if __name__ == "__main__":
    main()
