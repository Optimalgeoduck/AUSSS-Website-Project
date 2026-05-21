import useReveal from '../hooks/useReveal.js'
import { Link } from 'react-router-dom'
import {
  executiveBoard,
  committees,
  society,
  slugFor,
} from '../data/society.js'

const isSupport = (g) => /support|division|psd|pnsd|cbsd/i.test(g || '')

function EmailValue({ email }) {
  if (!email)
    return <span className="text-sm italic text-silver/35">Email TBA</span>
  return (
    <a
      href={`mailto:${email}`}
      className="text-sm text-medical-light underline-offset-4 transition-colors hover:text-white hover:underline"
    >
      {email}
    </a>
  )
}

function Row({ name, role, email }) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/10 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-white">
          {name?.trim() || 'Name TBA'}
        </p>
        {role && (
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-silver/50">
            {role}
          </p>
        )}
      </div>
      <EmailValue email={email} />
    </div>
  )
}

function Group({ title, children }) {
  return (
    <section className="reveal">
      <h2 className="heading-serif text-2xl text-white sm:text-3xl">{title}</h2>
      <div className="mt-4 rounded-2xl border border-white/10 bg-forest-800/60 px-6">
        {children}
      </div>
    </section>
  )
}

export default function ContactPage() {
  useReveal()

  const standing = committees.filter((c) => !isSupport(c.group))
  const support = committees.filter((c) => isSupport(c.group))

  const unitRows = (c) => {
    const people =
      Array.isArray(c.officers) && c.officers.length > 0
        ? c.officers
        : [{ name: c.holder, role: c.officer, email: c.email }]
    return people.map((p, i) => (
      <Row
        key={(p.abbr || p.name || i) + '-' + i}
        name={p.name}
        role={`${c.abbr} · ${p.abbr || p.role || c.officer || ''}`.replace(
          /·\s*$/,
          '',
        )}
        email={p.email ?? c.email}
      />
    ))
  }

  return (
    <article className="bg-forest-950">
      <header className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div className="container-prose relative text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-8 bg-medical" />
            Get in touch
            <span className="h-px w-8 bg-medical" />
          </span>
          <h1 className="heading-serif mt-5 text-4xl text-white sm:text-6xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-light text-silver/75">
            Reach the Executive Board, a standing committee, or a support
            division directly.
          </p>
          {society.contactEmail && (
            <a
              href={`mailto:${society.contactEmail}`}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest transition-colors hover:bg-silver-light"
            >
              {society.contactEmail}
            </a>
          )}
        </div>
      </header>

      <div className="container-prose space-y-14 pb-28 sm:pb-36">
        <Group title="Executive Board">
          {executiveBoard.map((m, i) => (
            <Row key={i} name={m.name} role={m.role} email={m.email} />
          ))}
        </Group>

        <Group title="Standing Committees">
          {standing.map((c) => (
            <div key={slugFor(c)}>{unitRows(c)}</div>
          ))}
        </Group>

        <Group title="Support Divisions">
          {support.map((c) => (
            <div key={slugFor(c)}>{unitRows(c)}</div>
          ))}
        </Group>

        <p className="reveal text-center text-sm text-silver/45">
          Looking for a specific committee?{' '}
          <Link
            to="/#officials"
            className="text-medical-light hover:text-white"
          >
            Browse all committees &amp; divisions →
          </Link>
        </p>
      </div>
    </article>
  )
}
