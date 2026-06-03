import useReveal from '../hooks/useReveal.js'
import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import ExecutiveBoard from '../components/ExecutiveBoard.jsx'
import TeamOfficials from '../components/TeamOfficials.jsx'
import GoogleCalendar from '../components/GoogleCalendar.jsx'
import { society } from '../data/society.js'

export default function Home() {
  useReveal()

  return (
    <>
      <Hero />
      {/* Soft gradient seams so section background colours blend into each
          other instead of hard-cutting. Each strip starts at the section
          above's edge colour and ends at the one below's (light + dark). */}
      <div
        aria-hidden="true"
        className="h-24 bg-gradient-to-b from-forest-800 to-cream dark:to-forest-950 sm:h-32"
      />
      <About />
      <div
        aria-hidden="true"
        className="h-24 bg-gradient-to-b from-cream to-forest-950 dark:from-forest-950 sm:h-32"
      />
      <ExecutiveBoard />
      <TeamOfficials />

      <section
        id="calendar"
        className="relative overflow-hidden bg-forest-950 py-28 sm:py-36"
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #C9D6DF 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
        />
        <div className="container-prose relative">
          <div className="reveal mx-auto mb-12 max-w-2xl text-center">
            <span className="eyebrow justify-center">
              <span className="h-px w-8 bg-medical" />
              What’s On
              <span className="h-px w-8 bg-medical" />
            </span>
            <h2 className="heading-serif mt-5 text-4xl text-white sm:text-5xl">
              Society Calendar
            </h2>
            <p className="mt-4 text-lg font-light text-silver/70">
              Society-wide events, deadlines, and assemblies.
            </p>
          </div>
          <div className="reveal mx-auto max-w-5xl">
            <GoogleCalendar
              calendarId={society.calendarId}
              color="#5B8DB8"
              title="AUSSS Society Calendar"
            />
          </div>
        </div>
      </section>
    </>
  )
}
