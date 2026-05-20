import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import { merchPages, merchPdf } from '../data/merch.js'
import { society } from '../data/society.js'

function Lightbox({ index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  const page = merchPages[index]
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-950/95 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        aria-label="Previous page"
        className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <img
        src={page.src}
        alt={`Merch booklet page ${index + 1}`}
        className="max-h-[90vh] w-auto rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        aria-label="Next page"
        className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1 text-xs font-medium text-white">
        {index + 1} / {merchPages.length}
      </span>
    </div>
  )
}

export default function MerchPage() {
  useReveal()
  const [open, setOpen] = useState(null)

  const close = useCallback(() => setOpen(null), [])
  const prev = useCallback(
    () => setOpen((i) => (i <= 0 ? merchPages.length - 1 : i - 1)),
    [],
  )
  const next = useCallback(
    () => setOpen((i) => (i >= merchPages.length - 1 ? 0 : i + 1)),
    [],
  )

  const orderHref = society.instagram || '/contact'
  const orderExternal = Boolean(society.instagram)

  return (
    <article className="bg-forest-950">
      <header className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 70% at 50% 0%, rgba(15,122,83,0.45) 0%, rgba(2,28,18,0) 70%)',
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
            Shop AUSSS
            <span className="h-px w-8 bg-medical" />
          </span>
          <h1 className="heading-serif mt-5 text-4xl text-white sm:text-6xl">
            Merch Catalogue
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-light text-silver/75">
            Our 2025–26 collection, “Life Savers, Change Makers.” Flip through
            the booklet below, or open the full PDF.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={merchPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-forest transition-transform hover:scale-[1.03] sm:w-auto"
            >
              Open full booklet (PDF)
            </a>
            <a
              href={merchPdf}
              download
              className="w-full rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Download
            </a>
          </div>
        </div>
      </header>

      <div className="container-prose pb-20">
        <div className="mx-auto max-w-3xl space-y-6">
          {merchPages.map((p, idx) => (
            <button
              key={p.src}
              onClick={() => setOpen(idx)}
              className="reveal group block w-full overflow-hidden rounded-xl ring-1 ring-white/10 transition-all duration-500 hover:ring-medical/50"
              aria-label={`Open page ${idx + 1} full screen`}
            >
              <img
                src={p.src}
                alt={`Merch booklet page ${idx + 1}`}
                width={p.w}
                height={p.h}
                loading={idx < 2 ? 'eager' : 'lazy'}
                className="w-full transition-transform duration-700 group-hover:scale-[1.01]"
              />
            </button>
          ))}
        </div>

        <div className="reveal mx-auto mt-16 max-w-2xl rounded-3xl border border-white/10 bg-forest-800 p-8 text-center sm:p-12">
          <h2 className="heading-serif text-2xl text-white sm:text-3xl">
            Want to place an order?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-silver/70">
            Reach out and our team will help you get your AUSSS merch.
          </p>
          {orderExternal ? (
            <a
              href={orderHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-forest transition-transform hover:scale-[1.03]"
            >
              Order via Instagram
            </a>
          ) : (
            <Link
              to="/contact"
              className="mt-7 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-forest transition-transform hover:scale-[1.03]"
            >
              Contact us to order
            </Link>
          )}
        </div>
      </div>

      {open !== null && (
        <Lightbox
          index={open}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </article>
  )
}
