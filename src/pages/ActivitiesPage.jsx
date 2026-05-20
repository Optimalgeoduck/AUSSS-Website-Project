import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import { awarenessDays } from '../data/society.js'

// Next occurrence of a month/day from today (rolls into next year).
function nextDate({ month, day }) {
  const now = new Date()
  const y = now.getFullYear()
  let d = new Date(y, month - 1, day)
  if (d < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    d = new Date(y + 1, month - 1, day)
  }
  return d
}

export default function ActivitiesPage() {
  useReveal()

  const upcoming = useMemo(
    () =>
      [...awarenessDays]
        .map((d) => ({ ...d, when: nextDate(d) }))
        .sort((a, b) => a.when - b.when)
        .slice(0, 4),
    [],
  )

  return (
    <article className="bg-forest-950">
      <header className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 70% at 50% 0%, rgba(91,141,184,0.35) 0%, rgba(2,28,18,0) 70%)',
          }}
        />
        <div className="container-prose relative text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-8 bg-medical" />
            What we do
            <span className="h-px w-8 bg-medical" />
          </span>
          <h1 className="heading-serif mt-8 text-4xl text-white sm:text-6xl">
            Campaigns &amp; Activities
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-silver/75">
            Campaigns, workshops, exchanges and awareness drives across every
            AUSSS committee, and the IFMSA-Egypt national programmes we take
            part in.
          </p>
        </div>
      </header>

      <div className="container-prose space-y-20 pb-28 sm:pb-36">
        {/* Upcoming awareness days */}
        <section className="reveal mx-auto max-w-5xl">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-medical-light">
            Coming up
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {upcoming.map((d) => (
              <div
                key={d.name}
                className="rounded-2xl border border-white/10 bg-forest-800 p-5"
              >
                <p className="text-sm font-semibold text-white">{d.name}</p>
                <p className="mt-1.5 text-xs text-silver/60">
                  {d.when.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                  })}
                  {d.note ? ` · ${d.note}` : ''}
                </p>
                <span className="mt-3 inline-block rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-silver/70">
                  {d.committee}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="reveal text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-medical-light transition-colors hover:text-white"
          >
            ← Back to AUSSS home
          </Link>
        </div>
      </div>
    </article>
  )
}
