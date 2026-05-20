import { Link } from 'react-router-dom'

const PILLARS = [
  {
    title: 'Bridging Bench & Bedside',
    body: 'We translate curiosity at the bench into competence at the bedside, embedding research literacy into clinical training.',
    icon: (
      <path
        d="M7 4v6l-3 7a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-3-7V4M6 4h12M9 14h6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Global Student Exchange',
    body: 'Clinical and research clerkships connect Ain Shams students with partner faculties across the world.',
    to: '/exchange',
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16M12 4a13 13 0 0 1 0 16M12 4a13 13 0 0 0 0 16" />
      </>
    ),
  },
  {
    title: 'Evidence-Based Culture',
    body: 'Journal clubs, methodology workshops, and mentorship build a generation fluent in scientific rigor.',
    icon: (
      <>
        <path d="M5 4h11l3 3v13H5z" strokeLinejoin="round" />
        <path d="M9 9h7M9 13h7M9 17h4" strokeLinecap="round" />
      </>
    ),
  },
]

export default function About() {
  return (
    <section id="about" className="relative bg-cream py-28 sm:py-36">
      <div className="container-prose">
        <div className="grid items-start gap-16 lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            <span className="eyebrow">
              <span className="h-px w-8 bg-medical" />
              About the Society
            </span>
            <h2 className="heading-serif mt-5 text-4xl text-forest sm:text-5xl">
              Where clinical practice meets scientific inquiry.
            </h2>
          </div>

          <div className="reveal space-y-6 text-lg leading-relaxed text-forest-900/75 lg:col-span-7">
            <p>
              The <strong className="text-forest">Ain Shams University
              Students&rsquo; Scientific Society (AUSSS)</strong> is an
              independent, non-profit, non-political and non-religious student
              society within the Faculty of Medicine, Ain Shams University, and
              an autonomous affiliate member of IFMSA-Egypt.
            </p>
            <p>
              Through professional and research exchanges, projects, and
              extracurricular training, AUSSS empowers medical students to use
              their knowledge for the benefit of society, and provides a forum
              to discuss health, education, and science with peers across Egypt
              and around the world.
            </p>
            <blockquote className="border-l-2 border-medical pl-6 font-serif text-xl italic text-forest">
              “Our mission is to offer future physicians a comprehensive
              introduction to global health issues, developing active,
              efficient and culturally sensitive students of medicine, intent on
              influencing the transnational inequalities that shape the health
              of our planet.”
            </blockquote>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {PILLARS.map((p, i) => {
            const Wrapper = p.to ? Link : 'article'
            const wrapperProps = p.to
              ? { to: p.to, 'aria-label': `${p.title}, learn more` }
              : {}
            return (
              <Wrapper
                key={p.title}
                {...wrapperProps}
                className={`reveal group block rounded-2xl border border-forest-600/10 bg-white p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-medical/40 hover:shadow-xl hover:shadow-forest-900/5 ${
                  p.to ? 'cursor-pointer' : ''
                }`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-forest text-silver transition-colors group-hover:bg-forest-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    {p.icon}
                  </svg>
                </span>
                <h3 className="heading-serif mt-6 text-xl text-forest">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-forest-900/65">
                  {p.body}
                </p>
                {p.to && (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-medical transition-colors group-hover:text-forest">
                    Explore exchange
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </Wrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}
