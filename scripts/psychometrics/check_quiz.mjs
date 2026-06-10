// Reachability + sanity checks for the Sorting quiz scoring engine.
// Plain Node (no test framework). Run: node scripts/psychometrics/check_quiz.mjs
// Exits non-zero if any committee is unreachable or a sanity check fails.

import { QUESTIONS, scoreAnswers, profileFor } from '../../src/data/sortingQuiz.js'
import { AXES, COMMITTEE_PROFILES } from '../../src/data/committeeProfiles.js'

const ALL = Object.keys(COMMITTEE_PROFILES)
let failures = 0
const fail = (msg) => {
  failures++
  console.error('  ✗ ' + msg)
}
const ok = (msg) => console.log('  ✓ ' + msg)

// --- 1. Archetype answers: pick, per question, the option that best matches a
// target trait vector. This simulates "a person who is strongly X". ----------
function archetypeAnswers(target) {
  return QUESTIONS.map((q) => {
    let bestIdx = 0
    let bestDot = -Infinity
    q.options.forEach((opt, i) => {
      let dot = 0
      for (const [a, v] of Object.entries(opt.loadings || {})) dot += (target[a] || 0) * v
      if (dot > bestDot) {
        bestDot = dot
        bestIdx = i
      }
    })
    return bestIdx
  })
}

// --- 2. Every committee must win for the archetype built from its own centroid.
console.log('Archetype recovery (each committee should win on its own profile):')
const recovered = new Set()
for (const abbr of ALL) {
  const ans = archetypeAnswers(COMMITTEE_PROFILES[abbr])
  const ranked = scoreAnswers(ans)
  const winner = ranked[0]
  if (winner === abbr) {
    recovered.add(abbr)
    ok(`${abbr} → ${winner}`)
  } else {
    fail(`${abbr} archetype won by ${winner} (rank of ${abbr}: ${ranked.indexOf(abbr) + 1}/${ranked.length})`)
  }
}

// --- 3. Reachability: across a large random sweep, every committee must win at
// least once, and none should dominate pathologically. -----------------------
console.log('\nReachability over random answer sweep:')
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(12345)
const wins = Object.fromEntries(ALL.map((a) => [a, 0]))
const N = 40000
for (let i = 0; i < N; i++) {
  const ans = QUESTIONS.map((q) => Math.floor(rand() * q.options.length))
  wins[scoreAnswers(ans)[0]]++
}
const sorted = Object.entries(wins).sort((a, b) => b[1] - a[1])
for (const [abbr, c] of sorted) {
  const pct = ((c / N) * 100).toFixed(1)
  const line = `${abbr.padEnd(6)} ${String(c).padStart(6)}  ${pct}%`
  if (c === 0) fail(`${abbr} is UNREACHABLE in ${N} random runs`)
  else console.log('  ' + line)
}
const top = sorted[0]
if (top[1] / N > 0.45) fail(`${top[0]} dominates random outcomes (${((top[1] / N) * 100).toFixed(1)}%)`)
else ok(`no committee dominates (top is ${top[0]} at ${((top[1] / N) * 100).toFixed(1)}%)`)

// --- 4. profileFor sanity: a strongly-Investigative archetype should surface
// Investigative as a top interest. --------------------------------------------
console.log('\nProfile readout sanity:')
const invAns = archetypeAnswers({ I: 2, OPN: 1 })
const prof = profileFor(invAns)
const interestAxes = prof.interests.map((x) => x.axis)
if (interestAxes.includes('I')) ok(`Investigative archetype surfaces interests [${interestAxes.join(', ')}]`)
else fail(`Investigative archetype did not surface I; got [${interestAxes.join(', ')}]`)

// --- summary ---
console.log('')
if (failures) {
  console.error(`FAILED: ${failures} check(s) failed. Recovered ${recovered.size}/${ALL.length} archetypes.`)
  process.exit(1)
}
console.log(`PASSED: all ${ALL.length} committees reachable; archetypes recovered; no domination.`)
