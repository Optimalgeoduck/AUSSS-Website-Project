import { Link } from 'react-router-dom'
import { readableAccent, rgba } from '../lib/color.js'

const initials = (name) =>
  (name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || ','

function RevealButton({ onReveal, label }) {
  return (
    <button
      onClick={onReveal}
      className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-silver/55 underline-offset-4 transition-colors hover:text-white hover:underline"
    >
      {label}
    </button>
  )
}

/* ── President: dry, sarcastic ───────────────────────────────────────── */
function President({ onReveal }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#C9A33B]/30 bg-gradient-to-br from-forest-800 to-forest-950 p-10 text-center sm:p-14">
      <span className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#C9A33B]/10 blur-3xl" />
      <img
        src="/assets/brand/ausss-horizontal-white.png"
        alt="AUSSS"
        className="relative mx-auto mb-8 h-12 w-auto opacity-80"
      />
      <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#C9A33B]/15">
        <svg viewBox="0 0 24 24" className="h-9 w-9 text-[#E7C763]" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z" strokeLinejoin="round" />
          <path d="M5 21h14" strokeLinecap="round" />
        </svg>
      </span>
      <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#E7C763]">
        AUSSS · Office of the President
      </p>
      <h2 className="heading-serif relative mt-4 text-4xl text-white sm:text-5xl">
        You’re the President.
      </h2>
      <p className="relative mx-auto mt-5 max-w-lg text-lg font-light leading-relaxed text-silver/80">
        …why are you looking up your own membership status? You run this place.
      </p>
      <p className="relative mx-auto mt-3 max-w-lg text-sm text-silver/55">
        Constitution §9, “the organization shall be managed by the Executive
        Board.” You’d know. You signed it.
      </p>
      <RevealButton onReveal={onReveal} label="Fine, show it anyway →" />
    </div>
  )
}

/* ── Officer / Director / EB: warm recognition ──────────────────────── */
function TeamMember({ entry, onReveal }) {
  const isCommittee = entry.kind === 'committee'
  const color = isCommittee ? entry.color : '#5B8DB8'
  const accent = readableAccent(color)
  // Always show the canonical name + photo from the data, never the typed
  // input, so it's stable and correct whether looked up by name or email.
  const displayName = entry.holderName || entry.roleLabel || 'AUSSS Official'
  const showPhoto = Boolean(entry.holderPhoto)

  return (
    <div
      className="relative overflow-hidden rounded-3xl border bg-forest-900/60 p-10 text-center sm:p-14"
      style={{ borderColor: rgba(color, 0.35) }}
    >
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background: `radial-gradient(60% 100% at 50% 0%, ${rgba(
            color,
            0.32,
          )} 0%, rgba(2,28,18,0) 75%)`,
        }}
      />

      <img
        src={
          isCommittee && entry.logo
            ? entry.logo
            : '/assets/brand/ausss-vertical-white.png'
        }
        alt={isCommittee ? `${entry.abbr} logo` : 'AUSSS'}
        className="relative mx-auto h-20 w-auto object-contain drop-shadow"
      />

      <div
        className="relative mx-auto mt-6 grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-forest-950 text-2xl font-semibold text-silver ring-4"
        style={{ '--tw-ring-color': rgba(color, 0.5) }}
      >
        {showPhoto ? (
          <img
            src={entry.holderPhoto}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          initials(displayName)
        )}
      </div>

      <p
        className="relative mt-6 text-xs font-semibold uppercase tracking-[0.24em]"
        style={{ color: accent }}
      >
        Welcome back
      </p>
      <h2 className="heading-serif relative mt-2 text-3xl text-white sm:text-4xl">
        {displayName}
      </h2>
      <p
        className="relative mt-3 text-sm font-semibold uppercase tracking-[0.16em]"
        style={{ color: accent }}
      >
        {entry.roleLabel}
      </p>
      {isCommittee && (
        <p className="relative mt-1 text-sm text-silver/70">
          {entry.committeeName}
        </p>
      )}

      <p className="relative mx-auto mt-5 max-w-md text-sm leading-relaxed text-silver/65">
        You’re part of the AUSSS Team of Officials, membership status checks
        are for the rest of us.
      </p>

      <div className="relative mt-7 flex flex-col items-center gap-3">
        {isCommittee && (
          <Link
            to={`/committees/${entry.slug}`}
            className="rounded-full px-6 py-3 text-sm font-semibold text-forest transition-transform hover:scale-[1.03]"
            style={{ background: '#fff' }}
          >
            Go to your committee page →
          </Link>
        )}
        <RevealButton
          onReveal={onReveal}
          label="Show my membership status instead →"
        />
      </div>
    </div>
  )
}

export default function SpecialResult({ result, onReveal }) {
  if (result.state === 'president')
    return <President onReveal={onReveal} />
  return (
    <TeamMember
      entry={result.entry}
      onReveal={onReveal}
    />
  )
}
