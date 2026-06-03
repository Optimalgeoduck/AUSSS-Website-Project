import { useEffect, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import useMediaQuery from '../hooks/useMediaQuery.js'

// A page-flipping reader: the magazine's pre-rendered page images turned into a
// book with a real page-curl — a two-page spread on desktop, a single page on
// mobile. Images are pre-built from the full-quality PDF (see
// _source/build-magazine.mjs), so there's no big download and no client pdf.js.
export default function Flipbook({ pages, title }) {
  const [ratio, setRatio] = useState(null) // page height ÷ width
  const isMobile = useMediaQuery('(max-width: 767px)')
  const bookRef = useRef(null)

  // Lock the book's proportions to the real page shape before rendering it.
  useEffect(() => {
    let cancelled = false
    const probe = new Image()
    probe.onload = () => {
      if (!cancelled) setRatio(probe.naturalHeight / probe.naturalWidth || 1.4142)
    }
    probe.onerror = () => {
      if (!cancelled) setRatio(1.4142)
    }
    probe.src = pages[0]
    return () => {
      cancelled = true
    }
  }, [pages])

  // Left/right arrow keys flip the book.
  useEffect(() => {
    if (!ratio) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') bookRef.current?.pageFlip()?.flipPrev()
      else if (e.key === 'ArrowRight') bookRef.current?.pageFlip()?.flipNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ratio])

  if (!ratio) {
    return (
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-forest-800">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-medical-light" />
        <p className="mt-4 text-sm text-silver/60">Opening the magazine…</p>
      </div>
    )
  }

  const baseW = 520

  return (
    <div className="flex w-full flex-col items-center">
      <div className="magazine-frame mx-auto w-full max-w-[640px] md:max-w-[1336px]">
        <HTMLFlipBook
          ref={bookRef}
          width={baseW}
          height={Math.round(baseW * ratio)}
          size="stretch"
          minWidth={300}
          maxWidth={650}
          minHeight={Math.round(300 * ratio)}
          maxHeight={Math.round(650 * ratio)}
          maxShadowOpacity={0.5}
          showCover={false}
          mobileScrollSupport
          usePortrait={isMobile}
          drawShadow
          flippingTime={700}
          className="mx-auto"
        >
          {pages.map((url, i) => (
            <div key={i} className="overflow-hidden rounded-[10px] bg-white">
              <img
                src={url}
                alt={`${title}, page ${i + 1}`}
                className="h-full w-full select-none"
                draggable={false}
                loading={i < 4 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
          aria-label="Previous page"
          className={navBtn}
        >
          ‹ Prev
        </button>
        <button
          type="button"
          onClick={() => bookRef.current?.pageFlip()?.flipNext()}
          aria-label="Next page"
          className={navBtn}
        >
          Next ›
        </button>
      </div>
      <p className="mt-3 text-xs text-silver/50">
        Drag a corner or use the arrows to flip.
      </p>
    </div>
  )
}

const navBtn =
  'inline-flex items-center gap-2 rounded-full border border-white/15 bg-forest-800 px-4 py-2 text-sm font-medium text-silver/80 transition-colors hover:border-medical/40 hover:text-white'
