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
      <About />
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
              Society-wide events, deadlines, and assemblies. Each committee
              and division also keeps its own calendar on its page.
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
