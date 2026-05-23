// Maps a membership "Current Position" string → the committee/division or
// Executive-Board metadata, so the special result pages work regardless of
// who currently holds the post. Branding (logo/colour/slug) comes from the
// post; a personal photo is only attached when the looked-up name matches
// the currently-known holder in society.js.

import { executiveBoard, committees, slugFor } from '../data/society.js'

export const norm = (v) =>
  String(v ?? '')
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

const compact = (v) => norm(v).replace(/[^a-z0-9]/g, '')

// "President" / "AUSSS President" → true, but NOT "Vice President".
export function isPresidentPosition(pos) {
  const p = norm(pos).replace(/^ausss\s+/, '')
  return /\bpresident\b/.test(p) && !/\bvice\b/.test(p)
}

const index = new Map()
const addAlias = (alias, entry) => {
  const k = norm(alias)
  if (k && !index.has(k)) index.set(k, entry)
  const c = compact(alias)
  if (c && !index.has(c)) index.set(c, entry)
}

// ── Committees & support divisions ──────────────────────────────────────
for (const c of committees) {
  const meta = {
    kind: 'committee',
    committeeName: c.name,
    abbr: c.abbr,
    color: c.color,
    logo: c.logo,
    slug: slugFor(c),
    group: c.group,
  }
  const people =
    Array.isArray(c.officers) && c.officers.length > 0
      ? c.officers
      : [{ name: c.holder, abbr: c.officerAbbr, photo: c.photo }]

  for (const p of people) {
    const roleLabel = p.abbr
      ? `${c.officer} (${p.abbr})`
      : c.officer || 'Officer'
    const entry = {
      ...meta,
      roleLabel,
      holderName: p.name || '',
      holderPhoto: p.photo || '',
    }
    if (p.abbr) addAlias(p.abbr, entry)
  }

  // Title aliases. Division titles ("Division Director") are shared, so for
  // divisions we only key by abbr + "<ABBR> director"; committees have
  // distinct officer titles and can key by title too.
  const generic = {
    ...meta,
    roleLabel: c.officer || 'Officer',
    holderName:
      Array.isArray(c.officers) && c.officers.length === 1
        ? c.officers[0].name
        : !Array.isArray(c.officers)
          ? c.holder || ''
          : '',
    holderPhoto:
      !Array.isArray(c.officers) && c.photo ? c.photo : '',
  }
  if (/division/i.test(c.group || '')) {
    if (c.officerAbbr) {
      addAlias(`${c.abbr} director`, generic)
      addAlias(`${c.officerAbbr}`, generic)
    }
    addAlias(`${c.name} director`, generic)
  } else if (c.officer) {
    addAlias(c.officer, generic)
  }
}

// The membership sheet sometimes records the Public Health officer with the
// informal abbreviation "LOPH" instead of the official "LPO" — alias it to the
// LPO entry so both resolve to the same result.
const lpoEntry = index.get(norm('LPO'))
if (lpoEntry) addAlias('LOPH', lpoEntry)

// ── Executive Board (President handled separately as the sarcastic page) ─
for (const m of executiveBoard) {
  if (m.tier === 'lead') continue // president → isPresidentPosition()
  const entry = {
    kind: 'eb',
    roleLabel: m.role,
    holderName: m.name || '',
    holderPhoto: m.photo || '',
  }
  addAlias(m.role, entry)
  const r = norm(m.role)
  if (r.includes('internal')) {
    ;['vpi', 'vp internal', 'vice president internal affairs',
      'vice president for internal affairs'].forEach((a) => addAlias(a, entry))
  } else if (r.includes('external')) {
    ;['vpe', 'vp external', 'vice president external affairs',
      'vice president for external affairs'].forEach((a) => addAlias(a, entry))
  } else if (r.includes('secretary')) {
    ;['secgen', 'sec gen', 'secretary general', 'secretary-general'].forEach(
      (a) => addAlias(a, entry),
    )
  }
}

const SKIP = new Set(['', 'member', 'general member', 'none', 'n/a', '-'])

// Returns the matched entry or null.
export function matchPosition(position) {
  const p = norm(position)
  if (SKIP.has(p)) return null
  return index.get(p) || index.get(compact(position)) || null
}
