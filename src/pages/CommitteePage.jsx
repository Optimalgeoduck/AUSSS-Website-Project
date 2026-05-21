import { useParams, Navigate, Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import { committeeBySlug } from '../data/society.js'
import { readableAccent, rgba } from '../lib/color.js'
import GoogleCalendar from '../components/GoogleCalendar.jsx'

const initials = (name) =>
  (name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || ','

function PersonCard({ person, color }) {
  const accent = readableAccent(color)
  return (
    <div className="flex w-36 flex-col items-center text-center">
      <div
        className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-forest-950 text-lg font-semibold text-silver ring-2"
        style={{ '--tw-ring-color': rgba(color, 0.55) }}
      >
        {person.photo ? (
          <img
            src={person.photo}
            alt={person.name || person.role || person.abbr}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          initials(person.name)
        )}
      </div>
      <span
        className={`mt-3 block text-sm font-semibold leading-tight ${
          person.name?.trim() ? 'text-white' : 'italic text-silver/35'
        }`}
      >
        {person.name?.trim() || 'Name TBA'}
      </span>
      {(person.abbr || person.role) && (
        <span
          className="mt-1 block text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{ color: accent }}
        >
          {person.abbr || person.role}
        </span>
      )}
    </div>
  )
}

export default function CommitteePage() {
  const { slug } = useParams()
  const c = committeeBySlug(slug)
  useReveal()

  if (!c) return <Navigate to="/" replace />

  const accent = readableAccent(c.color)
  const officers =
    Array.isArray(c.officers) && c.officers.length > 0
      ? c.officers
      : [{ name: c.holder, abbr: c.officerAbbr, photo: c.photo }]
  const members = Array.isArray(c.members) ? c.members : []
  const about = Array.isArray(c.about)
    ? c.about
    : c.about
      ? [c.about]
      : c.description
        ? [c.description]
        : []
  const whatWeDo = Array.isArray(c.whatWeDo) ? c.whatWeDo : []
  const activities = Array.isArray(c.activities) ? c.activities : []
  const hasNational = activities.some((a) => a.scope === 'IFMSA-Egypt')

  return (
    <article className="bg-forest-950">
      {/* Brand hero */}
      <header className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(#C9D6DF 1px, transparent 1px), linear-gradient(90deg, #C9D6DF 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="container-prose relative text-center">
          <Link
            to="/#officials"
            className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-silver/60 transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All committees &amp; divisions
          </Link>

          <div className="mx-auto mb-6 flex h-28 items-center justify-center">
            {c.logo ? (
              <img
                src={c.logo}
                alt={`${c.abbr} logo`}
                className="max-h-28 w-auto object-contain drop-shadow"
              />
            ) : (
              <span className="heading-serif text-5xl text-white">
                {c.abbr}
              </span>
            )}
          </div>

          <p
            className="text-xs font-semibold uppercase tracking-[0.24em]"
            style={{ color: accent }}
          >
            {c.group}
          </p>
          <h1 className="heading-serif mt-3 text-4xl text-white sm:text-6xl">
            {c.name}
          </h1>
          {(c.tagline || c.officer) && (
            <p className="mx-auto mt-4 max-w-2xl text-lg font-light text-silver/75">
              {c.tagline || c.officer}
            </p>
          )}
        </div>
      </header>

      <div className="container-prose space-y-24 pb-28 sm:pb-36">
        {/* Who they are */}
        {about.length > 0 && (
          <section className="reveal mx-auto max-w-3xl">
            <SectionLabel accent={accent}>Who we are</SectionLabel>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-silver/80">
              {about.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {/* What they do */}
        {whatWeDo.length > 0 && (
          <section className="reveal mx-auto max-w-4xl">
            <SectionLabel accent={accent}>What we do</SectionLabel>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {whatWeDo.map((item, idx) => (
                <li
                  key={idx}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-forest-800 p-6"
                >
                  <span
                    className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold"
                    style={{ background: rgba(c.color, 0.18), color: accent }}
                  >
                    {idx + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-silver/80">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Activities */}
        {activities.length > 0 && (
          <section className="reveal mx-auto max-w-5xl">
            <SectionLabel accent={accent}>What we run</SectionLabel>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {activities.map((a, idx) => (
                <ActivityCard key={idx} a={a} color={c.color} accent={accent} />
              ))}
            </div>
            {hasNational && (
              <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-silver/45">
                <span aria-hidden="true">ⓘ</span>
                <span>
                  Items marked{' '}
                  <span className="font-semibold text-silver/70">
                    IFMSA-Egypt national
                  </span>{' '}
                  are documented national campaigns run through local
                  committees including Ain Shams, not AUSSS-exclusive
                  projects. Items marked{' '}
                  <span
                    className="font-semibold"
                    style={{ color: accent }}
                  >
                    AUSSS
                  </span>{' '}
                  are verified from AUSSS’s own channels.
                </span>
              </p>
            )}
          </section>
        )}

        {/* Team */}
        <section className="reveal mx-auto max-w-5xl text-center">
          <SectionLabel accent={accent} center>
            The team
          </SectionLabel>
          <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-10">
            {officers.map((o, idx) => (
              <PersonCard key={o.abbr || idx} person={o} color={c.color} />
            ))}
            {members.map((m, idx) => (
              <PersonCard key={`m-${idx}`} person={m} color={c.color} />
            ))}
          </div>
          {members.length === 0 && (
            <p className="mt-8 text-sm text-silver/45">
              Committee members will be listed here soon.
            </p>
          )}
        </section>

        {/* Calendar */}
        <section className="reveal mx-auto max-w-5xl">
          <SectionLabel accent={accent} center>
            {c.abbr} calendar
          </SectionLabel>
          <div className="mt-10">
            <GoogleCalendar
              calendarId={c.calendarId}
              color={c.color}
              title={`${c.name} calendar`}
            />
          </div>
        </section>

        <div className="reveal text-center">
          <Link
            to="/#officials"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Back to all committees &amp; divisions
          </Link>
        </div>
      </div>
    </article>
  )
}

function ActivityCard({ a, color, accent }) {
  const ausss = a.scope === 'AUSSS'
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-forest-800 p-6 transition-colors hover:border-white/20">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {a.type && (
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ background: rgba(color, 0.18), color: accent }}
          >
            {a.type}
          </span>
        )}
        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
            ausss
              ? 'border-white/25 bg-white/10 text-white'
              : 'border-white/10 text-silver/55'
          }`}
        >
          {ausss ? 'AUSSS' : 'IFMSA-Egypt national'}
        </span>
      </div>
      <h3 className="heading-serif text-lg text-white">{a.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-silver/70">{a.blurb}</p>
    </div>
  )
}

function SectionLabel({ children, accent, center }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <span
        className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] ${
          center ? 'justify-center' : ''
        }`}
        style={{ color: accent }}
      >
        <span
          className="h-px w-8"
          style={{ background: accent }}
          aria-hidden="true"
        />
        {children}
      </span>
    </div>
  )
}
