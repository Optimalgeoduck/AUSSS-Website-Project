import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import { issues, issueById, articleOf } from '../data/magazine.js'

// One lazy chunk serves three views, chosen by the route params:
//   /magazine                       → Shelf       (all issue covers)
//   /magazine/:issue                → IssueView   (articles + original PDF)
//   /magazine/:issue/:article       → ArticleView (the web-readable article)
export default function MagazinePage() {
  useReveal()
  const { issue: issueId, article: articleSlug } = useParams()

  if (!issueId) return <Shelf />

  const issue = issueById(issueId)
  if (!issue) return <Navigate to="/magazine" replace />

  if (!articleSlug) return <IssueView issue={issue} />

  const article = articleOf(issue, articleSlug)
  if (!article) return <Navigate to={`/magazine/${issue.id}`} replace />

  return <ArticleView issue={issue} article={article} />
}

// ── Cover artwork (image, or a gradient placeholder when none yet) ───────────
function Cover({ src, alt, label, className = '' }) {
  const [failed, setFailed] = useState(false)
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-forest-700 via-forest-800 to-forest-950 p-6 text-center ${className}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-medical-light">
        AUSSS Magazine
      </span>
      <span className="heading-serif mt-2 text-xl text-white/90">{label}</span>
    </div>
  )
}

// ── /magazine — the shelf ────────────────────────────────────────────────────
function Shelf() {
  return (
    <article className="bg-forest-950">
      <header className="relative overflow-hidden pb-12 pt-32 sm:pt-40">
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
            Read AUSSS
            <span className="h-px w-8 bg-medical" />
          </span>
          <h1 className="heading-serif mt-8 text-4xl text-white sm:text-6xl">
            The Magazine
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-silver/75">
            Our issues, published as fast web articles you can read anywhere —
            with the original designed edition one click away.
          </p>
        </div>
      </header>

      <div className="container-prose pb-28 sm:pb-36">
        {issues.length === 0 ? (
          <p className="mx-auto max-w-md rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-sm text-silver/60">
            The first issue is on its way. Check back soon.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {issues.map((issue) => (
              <li key={issue.id} className="reveal">
                <Link to={`/magazine/${issue.id}`} className="group block">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-forest-800 ring-0 transition-all group-hover:border-medical/40">
                    <Cover
                      src={issue.cover}
                      alt={`${issue.title} cover`}
                      label={issue.title}
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h2 className="heading-serif mt-3 text-lg text-white">
                    {issue.title}
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-silver/50">
                    {issue.date}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

// ── /magazine/:issue — one issue ─────────────────────────────────────────────
function IssueView({ issue }) {
  return (
    <article className="bg-forest-950">
      <header className="container-prose pt-32 sm:pt-40">
        <Link
          to="/magazine"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-silver/60 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All issues
        </Link>

        <div className="mt-8 grid gap-8 sm:grid-cols-[200px_1fr] sm:items-start">
          <div className="aspect-[3/4] w-40 overflow-hidden rounded-2xl border border-white/10 bg-forest-800 sm:w-full">
            <Cover src={issue.cover} alt={`${issue.title} cover`} label={issue.title} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-medical-light">
              {issue.date}
            </p>
            <h1 className="heading-serif mt-2 text-4xl text-white sm:text-5xl">
              {issue.title}
            </h1>
            {issue.blurb && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-silver/75">
                {issue.blurb}
              </p>
            )}
            <PdfButton pdf={issue.pdf} />
          </div>
        </div>
      </header>

      <div className="container-prose space-y-4 pb-28 pt-14 sm:pb-36">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-medical-light">
          In this issue
        </p>
        {issue.articles.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-sm text-silver/60">
            Articles for this issue are being prepared.
          </p>
        ) : (
          <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-forest-800">
            {issue.articles.map((a) => (
              <li key={a.slug}>
                <Link
                  to={`/magazine/${issue.id}/${a.slug}`}
                  className="group flex items-center gap-4 p-5 transition-colors hover:bg-white/[0.03]"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="heading-serif text-lg text-white">{a.title}</h3>
                    {a.dek && (
                      <p className="mt-1 truncate text-sm text-silver/65">{a.dek}</p>
                    )}
                    {a.author && (
                      <p className="mt-1 text-xs uppercase tracking-widest text-silver/40">
                        {a.author}
                      </p>
                    )}
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0 text-medical-light transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

// "View / download original PDF" — or a muted "coming soon" when not uploaded.
function PdfButton({ pdf }) {
  if (!pdf) {
    return (
      <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-silver/45">
        <PdfIcon />
        Original PDF — coming soon
      </p>
    )
  }
  return (
    <a
      href={pdf}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex items-center gap-2 rounded-full bg-medical px-5 py-2.5 text-sm font-semibold text-forest-950 transition-colors hover:bg-medical-light"
    >
      <PdfIcon />
      View / download the original PDF
    </a>
  )
}

function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 3h7l5 5v13a0 0 0 0 1 0 0H7a0 0 0 0 1 0 0V3Z" strokeLinejoin="round" />
      <path d="M14 3v5h5M9 13h6M9 17h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── /magazine/:issue/:article — the web-readable article ─────────────────────
function ArticleView({ issue, article }) {
  return (
    <article className="bg-forest-950">
      <header className="container-prose pt-32 sm:pt-40">
        <Link
          to={`/magazine/${issue.id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-silver/60 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {issue.title}
        </Link>
      </header>

      <div className="container-prose pb-28 pt-8 sm:pb-36">
        <div className="mx-auto max-w-2xl">
          {article.dek && (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-medical-light">
              {issue.title} · {issue.date}
            </p>
          )}
          <h1 className="heading-serif mt-3 text-4xl leading-tight text-white sm:text-5xl">
            {article.title}
          </h1>
          {article.dek && (
            <p className="mt-4 text-lg font-light leading-relaxed text-silver/75">
              {article.dek}
            </p>
          )}
          {article.author && (
            <p className="mt-4 text-sm uppercase tracking-widest text-silver/45">
              {article.author}
            </p>
          )}

          <div className="mt-10 space-y-6">
            {article.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-8">
            <Link
              to={`/magazine/${issue.id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-medical-light transition-colors hover:text-white"
            >
              ← Back to {issue.title}
            </Link>
            {issue.pdf && (
              <a
                href={issue.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-silver/70 transition-colors hover:text-white"
              >
                <PdfIcon />
                Read the original PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

// Renders one article body block. Unknown types are ignored.
function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="heading-serif pt-4 text-2xl text-white">{block.text}</h2>
      )
    case 'quote':
      return (
        <blockquote className="border-l-2 border-medical pl-5">
          <p className="font-serif text-xl italic leading-relaxed text-white/90">
            “{block.text}”
          </p>
          {block.cite && (
            <cite className="mt-2 block text-sm not-italic text-silver/55">
              — {block.cite}
            </cite>
          )}
        </blockquote>
      )
    case 'image':
      return <ArticleImage block={block} />
    case 'p':
    default:
      return (
        <p className="text-lg leading-relaxed text-silver/80">{block.text}</p>
      )
  }
}

// Image block with a graceful fallback if the file isn't present yet.
function ArticleImage({ block }) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className="my-2">
      {failed ? (
        <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] text-xs text-silver/45">
          Image placeholder
        </div>
      ) : (
        <img
          src={block.src}
          alt={block.alt || ''}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="w-full rounded-2xl border border-white/10"
        />
      )}
      {block.caption && (
        <figcaption className="mt-2 text-center text-xs text-silver/50">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}
