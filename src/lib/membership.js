import { SOURCE, WEBAPP_URL } from '../data/membershipConfig.js'
import {
  MEMBERS_BY_NAME,
  MEMBERS_BY_EMAIL,
} from '../data/members.generated.js'

// ── Normalisation ────────────────────────────────────────────────────────
// MUST stay byte-identical to norm() in the data-generation script, or the
// browser hash won't match the build-time hash.
export function normalize(v) {
  return String(v ?? '')
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(str),
  )
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const nameKey = (name) => sha256Hex(normalize(name))
const emailKey = (email) => sha256Hex(normalize(email))

const mapRecord = (raw) => ({
  status: raw.s,
  yearJoined: raw.y,
  yearsSpent: raw.ys,
  lgas: raw.l, // raw string, may be ">2", "2+", "" …
  ngas: raw.n,
  currentPosition: (raw.p || '').trim() || 'General Member',
})

// No-op kept for backward compatibility (data is now a static import,
// bundled with the app, nothing to preload).
export function preloadMembers() {}

// Position cells in the source sheet sometimes pack multiple roles separated
// by a line break (e.g. "Supervising Council\r\nInternational TEDA"). Splits
// the raw value into individual positions so the UI can render them as a
// stacked list instead of one squashed string.
export function splitPositions(raw) {
  return String(raw ?? '')
    .split(/\r\n|\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

// The membership data is keyed by SHA-256 of name/email, so we can't look up
// people by name spelling we don't already know. For "find the unique holder
// of a known role" cases (currently: Heba Ismail → Supervising Council), we
// scan the values once and cache the first match.
const _byPositionCache = new Map()
export function findRecordByPosition(test) {
  const key = test.toString()
  if (_byPositionCache.has(key)) return _byPositionCache.get(key)
  let hit = null
  for (const arr of Object.values(MEMBERS_BY_NAME)) {
    for (const raw of arr) {
      if (test(raw.p || '')) {
        hit = mapRecord(raw)
        break
      }
    }
    if (hit) break
  }
  _byPositionCache.set(key, hit)
  return hit
}

// ── Lookup (by name OR email) ────────────────────────────────────────────
// Returns one of:
//   { state: 'found', record }
//   { state: 'ambiguous' }           name given matches >1 member
//   { state: 'not-found' }
//   { state: 'not-connected' }       webapp selected but URL not set
//   { state: 'error', message }
// Email is tried first (unique); name is the fallback.
export async function lookupMember({ name = '', email = '' }) {
  if (SOURCE === 'webapp') {
    if (!WEBAPP_URL) return { state: 'not-connected' }
    try {
      const u = new URL(WEBAPP_URL)
      if (name) u.searchParams.set('name', name)
      if (email) u.searchParams.set('email', email)
      const res = await fetch(u, { method: 'GET' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const d = await res.json()
      if (d.multiple) return { state: 'ambiguous' }
      if (d.found && d.record) {
        return {
          state: 'found',
          record: {
            ...d.record,
            currentPosition:
              (d.record.currentPosition || '').trim() || 'General Member',
          },
        }
      }
      return { state: 'not-found' }
    } catch (e) {
      return { state: 'error', message: e.message }
    }
  }

  // ── Interim: in-browser hashed lookup ──
  try {
    // Email first, it's unique, so it never goes "ambiguous".
    if (email.trim()) {
      const eArr = MEMBERS_BY_EMAIL[await emailKey(email)]
      if (eArr && eArr.length > 0)
        return { state: 'found', record: mapRecord(eArr[0]) }
      // email didn't match, fall through to name if one was given
    }
    if (name.trim()) {
      const nArr = MEMBERS_BY_NAME[await nameKey(name)]
      if (!nArr || nArr.length === 0) return { state: 'not-found' }
      if (nArr.length > 1) return { state: 'ambiguous' }
      return { state: 'found', record: mapRecord(nArr[0]) }
    }
    return { state: 'not-found' }
  } catch (e) {
    return { state: 'error', message: e.message }
  }
}

// ── Bylaw-driven advancement guidance (Constitution & Bylaws §2) ─────────
const TIERS = {
  candidate: {
    label: 'Candidate Member',
    rank: 1,
    rights: 'Speaking rights at the Local GA (no proposing, voting, or candidature).',
    next: 'Associate Member',
    needLga: 1,
    needNga: 2,
    steps: [
      'Attend at least 1 Local GA or 2 National GAs (§2.5.1).',
      'Reach the minimum activity score on the Membership Evaluation Sheet (Annex 1).',
      'Associate status is then granted by the Executive Board before a General Assembly (§2.3.1).',
    ],
  },
  associate: {
    label: 'Associate Member',
    rank: 2,
    rights: 'Speaking & proposing rights; may apply for a Team of Officials position (no voting).',
    next: 'Full Member',
    needLga: 2,
    needNga: 3,
    steps: [
      'Attend 2 Local GAs including their plenaries (§2.6.1a).',
      'Attend 3 National GAs (§2.6.1b).',
      'Maintain the minimum activity score on the Evaluation Sheet (Annex 1).',
      'Full status is then granted by the Executive Board (§2.6.1).',
    ],
  },
  full: {
    label: 'Full Member',
    rank: 3,
    rights: 'Speaking, proposing, voting and candidature rights at the Local GA (§2.6.2).',
    next: null,
    steps: [
      'You hold the highest membership status, maintain it each term by contributing: a local team, an SWG/Taskforce/OC, or by giving local sessions/workshops (§2.9.1).',
      'Failing to contribute within a term downgrades your status (§2.9.2).',
      'You may run for any Team of Officials or Executive Board position.',
    ],
  },
  honorary: {
    label: 'Honorary Life Member',
    rank: 4,
    rights: 'Attend events & GAs with speaking and proposing rights (no voting) (§2.7.3).',
    next: null,
    steps: [
      'Granted by the General Assembly to alumni who greatly contributed to AUSSS (§2.7).',
      'Thank you for your continued contribution to the society.',
    ],
  },
  suspended: {
    label: 'Suspended',
    rank: 0,
    rights: 'Membership rights are currently withheld (§2.10).',
    next: null,
    steps: [
      'Suspension is a disciplinary status decided with the Supervising Council (§2.10.1).',
      'Contact the Executive Board / Secretary General to discuss reinstatement.',
    ],
  },
  observer: {
    label: 'Observer / Volunteer',
    rank: 0.5,
    rights: 'May join local workshops and physical campaigns (§2.2.4).',
    next: 'Candidate Member',
    steps: [
      'Apply during a recruitment campaign (online or hard copy) (§2.2.2.2a).',
      'Attend at least 50% of an orientation session (§2.2.2.2b).',
      'Pay the membership fees per the set regulations (§2.2.2.2c).',
    ],
  },
}

export function classify(statusText) {
  const s = normalize(statusText)
  if (!s) return null
  if (s.includes('suspend')) return 'suspended'
  if (s.includes('honor')) return 'honorary'
  if (s.includes('full')) return 'full'
  if (s.includes('associate')) return 'associate'
  if (s.includes('candidate')) return 'candidate'
  if (s.includes('observer') || s.includes('volunteer')) return 'observer'
  if (s.includes('alumni')) return 'honorary'
  return 'candidate' // safe default for unknown active labels
}

export function adviceFor(record) {
  const key = classify(record?.status)
  const tier = TIERS[key] || TIERS.candidate
  const progress = []
  if (tier.needLga != null) {
    progress.push({
      label: 'Local GAs attended',
      have: record.lgas, // raw string; parsed safely in the UI
      need: tier.needLga,
    })
  }
  if (tier.needNga != null) {
    progress.push({
      label: 'National GAs attended',
      have: record.ngas,
      need: tier.needNga,
    })
  }
  return {
    tierLabel: tier.label,
    rights: tier.rights,
    next: tier.next,
    steps: tier.steps,
    progress,
  }
}

// Guidance for someone not in the database at all.
export const NOT_A_MEMBER = {
  tierLabel: 'Not yet a member',
  steps: [
    'Apply during the next AUSSS recruitment campaign (online or hard copy) (§2.2.2.2a).',
    'Attend at least 50% of an orientation session (§2.2.2.2b).',
    'Pay the membership fees per the set regulations (§2.2.2.2c), you’ll then be a Candidate Member.',
  ],
}
