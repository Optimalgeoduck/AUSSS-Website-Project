import useReveal from '../hooks/useReveal.js'
import { Link } from 'react-router-dom'
import { socials } from '../data/society.js'
import SocialIcon from '../components/SocialIcon.jsx'

export default function SocialPage() {
  useReveal()

  return (
    <article className="bg-forest-950">
      <header className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 70% at 50% 0%, rgba(91,141,184,0.32) 0%, rgba(2,28,18,0) 70%)',
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
            Stay connected
            <span className="h-px w-8 bg-medical" />
          </span>
          <h1 className="heading-serif mt-5 text-4xl text-white sm:text-6xl">
            Follow AUSSS
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-light text-silver/75">
            Events, announcements and campaigns, keep up with the society on
            our official channels.
          </p>
        </div>
      </header>

      <div className="container-prose pb-28 sm:pb-36">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {socials.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group flex flex-col items-center rounded-3xl border border-white/10 bg-forest-800 p-8 text-center transition-all duration-500 hover:-translate-y-1.5 hover:border-medical/40 hover:shadow-2xl hover:shadow-forest-950/40"
            >
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-forest-950 text-medical-light transition-colors group-hover:bg-medical group-hover:text-white">
                <SocialIcon name={s.key} className="h-8 w-8" />
              </span>
              <h2 className="heading-serif mt-6 text-2xl text-white">
                {s.name}
              </h2>
              <p className="mt-2 break-words text-sm font-medium text-medical-light">
                {s.handle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-silver/65">
                {s.blurb}
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-silver/50 transition-colors group-hover:text-white">
                Open
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
            </a>
          ))}
        </div>

        <div className="reveal mt-16 text-center">
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
