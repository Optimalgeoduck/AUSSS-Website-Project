import { useState } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import { exchange, testimonials } from '../data/society.js'
import { rgba } from '../lib/color.js'

export default function ExchangePage() {
  useReveal()
  const [dir, setDir] = useState('outgoing')
  const active = exchange.directions[dir]

  return (
    <article className="bg-forest-950">
      {/* Hero */}
      <header className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 70% at 50% 0%, rgba(91,141,184,0.35) 0%, rgba(2,28,18,0) 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #C9D6DF 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
        />
        <div className="container-prose relative text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-8 bg-medical" />
            IFMSA flagship programme
            <span className="h-px w-8 bg-medical" />
          </span>
          <h1 className="heading-serif mt-8 text-4xl text-white sm:text-6xl">
            Exchange the World
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-silver/75">
            {exchange.intro}
          </p>
        </div>
      </header>

      <div className="container-prose space-y-24 pb-28 sm:pb-36">
        {/* Tracks */}
        <section className="reveal mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2">
            {exchange.tracks.map((t) => (
              <Link
                key={t.abbr}
                to={`/committees/${t.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-forest-800 p-8 transition-colors hover:border-white/25"
              >
                <span
                  className="absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl"
                  style={{ background: rgba(t.color, 0.25) }}
                />
                <p
                  className="relative text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: t.color }}
                >
                  {t.abbr}
                </p>
                <h2 className="relative mt-2 heading-serif text-2xl text-white">
                  {t.name}
                </h2>
                <p className="relative mt-3 text-sm leading-relaxed text-silver/70">
                  {t.blurb}
                </p>
                <span className="relative mt-5 inline-flex items-center gap-2 text-sm font-semibold text-medical-light">
                  Explore {t.abbr}
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Direction toggle */}
        <section className="reveal mx-auto max-w-3xl">
          <div className="mx-auto mb-8 flex w-full max-w-md rounded-full border border-white/15 bg-white/5 p-1">
            {Object.entries(exchange.directions).map(([key, d]) => (
              <button
                key={key}
                onClick={() => setDir(key)}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                  dir === key
                    ? 'bg-white text-forest'
                    : 'text-silver/70 hover:text-white'
                }`}
                aria-pressed={dir === key}
              >
                {d.label}
              </button>
            ))}
          </div>
          <ul className="space-y-3">
            {active.points.map((p, idx) => (
              <li
                key={idx}
                className="flex gap-4 rounded-2xl border border-white/10 bg-forest-800 p-5"
              >
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-medical/20 text-xs font-bold text-medical-light">
                  ✓
                </span>
                <p className="text-sm leading-relaxed text-silver/80">{p}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Timeline */}
        <section className="reveal mx-auto max-w-4xl">
          <h2 className="heading-serif text-center text-3xl text-white">
            How it works
          </h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {exchange.timeline.map((s, idx) => (
              <li
                key={idx}
                className="rounded-2xl border border-white/10 bg-forest-800 p-6"
              >
                <span className="heading-serif text-3xl text-medical-light">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 text-base font-semibold text-white">
                  {s.step}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-silver/65">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Testimonials, empty state until real quotes are supplied */}
        <section className="reveal mx-auto max-w-4xl">
          <h2 className="heading-serif text-center text-3xl text-white">
            Exchange stories
          </h2>
          {(() => {
            const visible = testimonials.filter((t) => t.published !== false)
            return visible.length > 0 ? (
            <div className="mt-10 space-y-8">
              {visible.map((t, idx) => (
                <figure
                  key={idx}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-forest-800"
                >
                  <div className="grid gap-0 md:grid-cols-[minmax(0,18rem)_1fr]">
                    {t.photo && (
                      <img
                        src={t.photo}
                        alt={`${t.name} on exchange in ${t.destination}`}
                        loading="lazy"
                        className="h-72 w-full object-cover md:h-full"
                      />
                    )}
                    <div className="flex flex-col justify-center p-7 sm:p-9">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-7 w-7 text-medical-light/60"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M7 7h4v4c0 3-1.5 5-4 6V13H7V7zm8 0h4v4c0 3-1.5 5-4 6V13h-2V7h2z" />
                      </svg>
                      <blockquote className="mt-3 text-base leading-relaxed text-silver/85">
                        {t.quote}
                      </blockquote>
                      <figcaption className="mt-5 text-sm text-silver/60">
                        <span className="font-semibold text-white">
                          {t.name}
                        </span>
                        {t.track ? ` · ${t.track}` : ''}
                        {t.destination ? ` · ${t.destination}` : ''}
                        {t.year ? ` · ${t.year}` : ''}
                      </figcaption>
                      {Array.isArray(t.gallery) && t.gallery.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-3">
                          {t.gallery.map((g) => (
                            <img
                              key={g}
                              src={g}
                              alt={`${t.destination}, ${t.name}'s exchange`}
                              loading="lazy"
                              className="h-16 w-16 rounded-lg object-cover ring-1 ring-white/10 sm:h-20 sm:w-20"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </figure>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
              <p className="text-sm leading-relaxed text-silver/60">
                Did an exchange with AUSSS? Your story goes here.
              </p>
              <a
                href="mailto:vpe.ausss@gmail.com?subject=My%20AUSSS%20exchange%20story"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Share your experience
              </a>
            </div>
          )
          })()}
        </section>

        {/* Links */}
        <section className="reveal text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-silver/50">
            Start exploring
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-4">
            {exchange.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {l.label}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
          <div className="mt-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-medical-light transition-colors hover:text-white"
            >
              ← Back to AUSSS home
            </Link>
          </div>
        </section>
      </div>
    </article>
  )
}
