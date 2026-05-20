import { Link } from 'react-router-dom'
import NetworkBackground from './NetworkBackground.jsx'
import CountUp from './CountUp.jsx'
import { MEMBERS_META } from '../data/members.generated.js'

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-forest-950"
    >
      {/* Layered scientific backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900 to-forest-800" />
      <NetworkBackground />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #C9D6DF 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />
      <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-medical/10 blur-3xl" />
      <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-forest-500/20 blur-3xl" />

      <div className="container-prose relative z-10 py-32 text-center">
        <p className="animate-fade-in mb-4 inline-flex items-center gap-2 rounded-full border border-medical/40 bg-medical/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-medical-light">
          <span aria-hidden="true">✦</span>
          55 Years of Youth · 55 Years of Impact
        </p>

        <p className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-silver">
          <span className="h-1.5 w-1.5 rounded-full bg-medical-light" />
          Ain Shams University · Faculty of Medicine
        </p>

        <h1 className="sr-only">
          AUSSS, Ain Shams University Students’ Scientific Society · Life
          Savers, Change Makers
        </h1>
        <img
          src="/assets/brand/ausss-vertical-white.png"
          alt="AUSSS"
          className="animate-fade-up mx-auto h-52 w-auto sm:h-64 lg:h-80"
        />

        <p
          className="animate-fade-up heading-serif mx-auto mt-8 text-balance text-4xl text-white sm:text-6xl"
          style={{ animationDelay: '0.1s' }}
        >
          Life Savers, <span className="text-medical-light">Change Makers</span>
        </p>

        <p
          className="animate-fade-up mx-auto mt-5 max-w-2xl text-balance text-base font-light text-silver/80 sm:text-xl"
          style={{ animationDelay: '0.2s' }}
        >
          Empowering Medical Research and Student Exchange.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ animationDelay: '0.3s' }}
        >
          <Link
            to="/join"
            className="group relative w-full overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-semibold text-forest transition-transform hover:scale-[1.03] sm:w-auto"
          >
            <span className="relative z-10">Join the Society</span>
          </Link>
          <a
            href="#about"
            className="w-full rounded-full border border-white/25 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            Discover Our Mission
          </a>
        </div>

        <div
          className="animate-fade-in mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] sm:grid-cols-4"
          style={{ animationDelay: '0.5s' }}
        >
          {[
            [MEMBERS_META.count.toLocaleString(), 'Members'],
            ['10', 'Committees & Divisions'],
            ['300+', 'Exchange Students Served'],
            ['80+', 'Campaigns / yr'],
          ].map(([v, l]) => (
            <div key={l} className="bg-forest-900/40 px-4 py-6 backdrop-blur-sm">
              <div className="heading-serif text-3xl text-white">
                <CountUp value={v} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-silver/70">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-white/30 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-white/70" />
        </span>
      </a>
    </section>
  )
}
