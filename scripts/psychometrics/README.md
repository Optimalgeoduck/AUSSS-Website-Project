# Psychometrics pipeline — Sorting quiz norms

`build_norms.py` turns two openly released personality-survey datasets into the
population norms the `/sorting` quiz uses. It is **dev-only**: run it by hand when
you want to regenerate norms. Its output (`src/data/psychometrics/norms.json`) is
committed, so the app never downloads anything at runtime.

## What it produces

`src/data/psychometrics/norms.json` — for each trait axis:

- `mean`, `sd` on the raw 1–5 item metric (item average per scale).
- `items[].itemTotalR` — item–total correlation (item discrimination). The
  higher-discrimination items are the ones whose *content* we adapt into the
  quiz's forced-choice options.

Axes:

- **RIASEC** (R, I, A, S, E, C) — Holland's six vocational-interest types, the
  backbone of the Sorting model.
- **Compassion** = IPIP Agreeableness, **Openness** = IPIP Openness — the two
  Big-Five facets we use to separate the six "helping" committees, which all
  load on Social.

How the norms are consumed: `src/data/sortingQuiz.js` uses the per-axis `sd` for
inverse-variance axis weighting (a point on a low-variance trait counts for more
than a point on a high-variance one), and the item list documents which validated
items each option is adapted from. See `src/data/committeeProfiles.js` for the
committee centroids the respondent is matched against.

## Data sources & licensing

| Dataset | n (full) | Used for | URL |
|---|---|---|---|
| Holland Code (RIASEC) Test | ~145,828 | R/I/A/S/E/C interests | https://openpsychometrics.org/_rawdata/RIASEC_data12Dec2018.zip |
| IPIP Big-Five Factor Markers | ~1,015,342 | Compassion (AGR), Openness (OPN) | https://openpsychometrics.org/_rawdata/IPIP-FFM-data-8Nov2018.zip |

- **openpsychometrics.org** releases this raw data for public/research use.
- Item wording is adapted from the **International Personality Item Pool (IPIP)**,
  which is **public domain**. Holland's RIASEC framework underlies the interest
  items.
- We adapt item *content and direction* into warm, forced-choice questions — we do
  not reproduce a copyrighted instrument, and the quiz is for fun/self-reflection,
  not diagnosis.

## Re-running

```bash
python scripts/psychometrics/build_norms.py [--cap N]
```

- Downloads are cached under `scripts/psychometrics/.cache/` (git-ignored;
  ~157 MB total). Delete the cache to force a fresh download.
- `--cap N` limits rows processed per dataset (default 120000). Means/SDs and
  item-total correlations are stable far below the full million IPIP rows, so the
  cap just keeps the run fast (a minute or two after download).
- Standard library only — no `pip install` required.

## Key references

- Holland, J. L. — RIASEC / vocational interests model.
- Goldberg, L. R. — IPIP Big-Five Factor Markers.
- Hurtado Rúa, Stead & Poklar (2019), *Five-Factor Personality Traits and RIASEC
  Interest Types: A Multivariate Meta-Analysis* — the interest×personality
  correlations used to design the committee centroids.
