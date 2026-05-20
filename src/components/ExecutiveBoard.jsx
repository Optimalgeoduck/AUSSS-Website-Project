import { executiveBoard } from '../data/society.js'

const initials = (name) =>
  name
    .replace(/^Dr\.\s*/, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

function Member({ m, size = 'md' }) {
  const ring =
    m.tier === 'patron'
      ? 'ring-medical/50'
      : m.tier === 'lead'
        ? 'ring-white/40'
        : 'ring-forest-600/30'
  const avatar = size === 'lg' ? 'h-24 w-24 text-2xl' : 'h-20 w-20 text-xl'
  const Wrapper = m.candidature ? 'a' : 'article'
  const wrapperProps = m.candidature
    ? {
        href: m.candidature,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `${m.name}, view candidature (PDF)`,
      }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={`reveal flex flex-col items-center rounded-2xl border p-8 text-center transition-all duration-500 hover:-translate-y-1.5 ${
        m.candidature ? 'cursor-pointer' : ''
      } ${
        m.tier === 'lead'
          ? 'border-white/15 bg-forest-800 text-white hover:shadow-2xl hover:shadow-forest-950/40'
          : 'border-forest-600/10 bg-white text-forest-900 hover:border-medical/40 hover:shadow-xl hover:shadow-forest-900/5'
      }`}
    >
      <div
        className={`grid ${avatar} place-items-center overflow-hidden rounded-full bg-gradient-to-br from-forest to-forest-600 font-serif font-semibold text-silver ring-4 ${ring}`}
      >
        {m.photo ? (
          <img
            src={m.photo}
            alt={m.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          initials(m.name)
        )}
      </div>
      <h3
        className={`heading-serif mt-5 text-xl ${
          m.tier === 'lead' ? 'text-white' : 'text-forest'
        }`}
      >
        {m.name}
      </h3>
      <p
        className={`mt-1 text-xs font-semibold uppercase tracking-[0.18em] ${
          m.tier === 'lead' ? 'text-medical-light' : 'text-medical'
        }`}
      >
        {m.role}
      </p>
      <p
        className={`mt-4 text-sm leading-relaxed ${
          m.tier === 'lead' ? 'text-silver/80' : 'text-forest-900/60'
        }`}
      >
        {m.blurb}
      </p>
      {m.candidature && (
        <span
          className={`mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${
            m.tier === 'lead' ? 'text-medical-light' : 'text-medical'
          }`}
        >
          View candidature
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M7 17 17 7M9 7h8v8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </Wrapper>
  )
}

export default function ExecutiveBoard() {
  const patron = executiveBoard.find((m) => m.tier === 'patron')
  const lead = executiveBoard.find((m) => m.tier === 'lead')
  const vps = executiveBoard.filter((m) => m.tier === 'vp')
  const officers = executiveBoard.filter((m) => m.tier === 'officer')

  return (
    <section
      id="board"
      className="relative overflow-hidden bg-forest-950 pb-10 pt-28 sm:pt-36"
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#C9D6DF 1px, transparent 1px), linear-gradient(90deg, #C9D6DF 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="container-prose relative">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-8 bg-medical" />
            Leadership
            <span className="h-px w-8 bg-medical" />
          </span>
          <h2 className="heading-serif mt-5 text-4xl text-white sm:text-5xl">
            Executive Board
          </h2>
          <p className="mt-4 text-lg font-light text-silver/70">
            The governing council steering the society’s academic vision and
            operations.
          </p>
        </div>

        {/* Tier 1, Patron (optional) */}
        {patron && (
          <>
            <div className="mt-16 flex justify-center">
              <div className="w-full max-w-sm">
                <Member m={patron} size="lg" />
              </div>
            </div>
            <div className="mx-auto my-2 h-12 w-px bg-gradient-to-b from-silver/40 to-transparent" />
          </>
        )}

        {/* Tier 2, President */}
        {lead && (
          <div className={`flex justify-center ${patron ? '' : 'mt-16'}`}>
            <div className="w-full max-w-md">
              <Member m={lead} size="lg" />
            </div>
          </div>
        )}

        {/* Tier 3, Secretary General (centered, below President) */}
        {officers.length > 0 && (
          <>
            <div className="mx-auto my-2 h-12 w-px bg-gradient-to-b from-silver/40 to-transparent" />
            <div className="mx-auto flex max-w-sm flex-col gap-6">
              {officers.map((m) => (
                <Member key={m.role} m={m} />
              ))}
            </div>
          </>
        )}

        {/* Tier 4, Vice Presidents (below Secretary General) */}
        {vps.length > 0 && (
          <>
            <div className="mx-auto my-2 h-12 w-px bg-gradient-to-b from-silver/40 to-transparent" />
            <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
              {vps.map((m) => (
                <Member key={m.role} m={m} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
