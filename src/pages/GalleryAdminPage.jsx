import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { albums } from '../data/gallery.js'
import {
  useGalleryRemovals,
  buildRemovalFile,
} from '../hooks/useGalleryRemovals.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { galleryLiveEnabled } from '../data/galleryConfig.js'

// Dedicated gallery admin page (/gallery/admin).
//
// Shows every photo from every album on one screen. Click a photo to hide it.
// When a backend is configured (galleryConfig.GALLERY_WEBAPP_URL), hiding is
// LIVE, it writes to the Apps Script store and disappears for every visitor
// within seconds, no redeploy. Writes are gated behind the admin key.
//
// With no backend configured, the page falls back to the export workflow:
// mark photos, Download galleryRemovals.js, replace it in the repo, redeploy.

export default function GalleryAdminPage() {
  usePageTitle('Gallery admin')
  return galleryLiveEnabled ? <LiveAdmin /> : <ExportAdmin />
}

// ── Live mode ──────────────────────────────────────────────────────────────

function LiveAdmin() {
  const removals = useGalleryRemovals('live')
  const { adminKey, setAdminKey, checkKey } = removals
  const [unlocked, setUnlocked] = useState(false)
  const [checking, setChecking] = useState(Boolean(adminKey))

  // Auto-validate a key remembered from a previous visit (sessionStorage).
  useEffect(() => {
    if (!adminKey) return
    let alive = true
    checkKey(adminKey).then((ok) => {
      if (alive) {
        setUnlocked(ok)
        setChecking(false)
      }
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (checking) {
    return (
      <Centered>
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-medical-light" />
      </Centered>
    )
  }

  if (!unlocked) {
    return (
      <KeyGate
        checkKey={checkKey}
        onUnlock={(k) => {
          setAdminKey(k)
          setUnlocked(true)
        }}
      />
    )
  }

  return (
    <PhotoGrid
      removals={removals}
      mode="live"
      onLock={() => {
        setAdminKey('')
        setUnlocked(false)
      }}
    />
  )
}

function KeyGate({ checkKey, onUnlock }) {
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!value.trim()) return
    setBusy(true)
    setError('')
    const ok = await checkKey(value.trim())
    setBusy(false)
    if (ok) onUnlock(value.trim())
    else setError('That key didn’t work. Check it and try again.')
  }

  return (
    <Centered>
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-forest-900 p-8 text-center"
      >
        <h1 className="heading-serif text-2xl text-white">Gallery admin</h1>
        <p className="mt-2 text-sm text-silver/70">
          Enter the admin key to hide or restore photos.
        </p>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Admin key"
          autoFocus
          className="mt-5 w-full rounded-xl border border-white/15 bg-forest-950 px-4 py-3 text-center text-white placeholder:text-silver/40 focus:border-medical focus:outline-none"
        />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy || !value.trim()}
          className="mt-5 w-full rounded-full bg-medical px-4 py-3 text-sm font-semibold text-forest-950 transition-colors hover:bg-medical-light disabled:opacity-40"
        >
          {busy ? 'Checking…' : 'Unlock'}
        </button>
        <Link
          to="/gallery"
          className="mt-5 inline-block text-xs font-semibold text-silver/60 transition-colors hover:text-white"
        >
          ← Back to gallery
        </Link>
      </form>
    </Centered>
  )
}

// ── Export-fallback mode (no backend configured) ─────────────────────────────

function ExportAdmin() {
  const removals = useGalleryRemovals('local')
  return <PhotoGrid removals={removals} mode="export" />
}

// ── Shared photo grid ────────────────────────────────────────────────────────

function PhotoGrid({ removals, mode, onLock }) {
  const { effective, committed, localMarks, error, toggle } = removals
  const [onlyMarked, setOnlyMarked] = useState(false)
  const [copied, setCopied] = useState(false)

  const totalPhotos = useMemo(
    () => albums.reduce((n, a) => n + a.photos.length, 0),
    [],
  )

  const visibleAlbums = useMemo(() => {
    if (!onlyMarked) return albums
    return albums
      .map((a) => ({
        ...a,
        photos: a.photos.filter((p) => effective.has(p.full)),
      }))
      .filter((a) => a.photos.length > 0)
  }, [onlyMarked, effective])

  const copyList = async () => {
    const file = buildRemovalFile(effective)
    try {
      await navigator.clipboard.writeText(file)
    } catch {
      // eslint-disable-next-line no-console
      console.log(file)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadList = () => {
    const file = buildRemovalFile(effective)
    const blob = new Blob([file], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'galleryRemovals.js'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <article className="min-h-screen bg-forest-950 pb-40">
      {/* Header */}
      <header className="container-prose pb-8 pt-28 sm:pt-32">
        <span className="eyebrow">
          <span className="h-px w-8 bg-medical" />
          Gallery admin
        </span>
        <h1 className="heading-serif mt-4 text-3xl text-white sm:text-4xl">
          Choose photos to remove
        </h1>

        {mode === 'live' ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-silver/70">
            Click any photo to hide it. Changes go{' '}
            <span className="font-semibold text-medical-light">live for
            everyone</span>{' '}
            within seconds, no redeploy. Click again to restore. Nothing is
            deleted from disk.
          </p>
        ) : (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-silver/70">
            Live hiding isn’t set up yet. Mark photos below, then{' '}
            <span className="text-white">Download</span> the list and replace{' '}
            <code className="text-medical-light">
              src/data/galleryRemovals.js
            </code>{' '}
            in the repo and redeploy.{' '}
            <span className="text-silver/50">
              (Set GALLERY_WEBAPP_URL to enable instant, redeploy-free hiding;
              see apps-script/gallery.README.md.)
            </span>
          </p>
        )}

        <p className="mt-4 text-xs text-silver/50">
          {totalPhotos} photos across {albums.length} albums ·{' '}
          {effective.size} hidden
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to="/gallery"
            className="text-sm font-semibold text-medical-light transition-colors hover:text-white"
          >
            ← Back to gallery
          </Link>
          <button
            type="button"
            onClick={() => setOnlyMarked((v) => !v)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              onlyMarked
                ? 'border-medical bg-medical/10 text-medical-light'
                : 'border-white/20 text-white hover:bg-white/10'
            }`}
            aria-pressed={onlyMarked}
          >
            {onlyMarked ? 'Showing hidden only' : 'Show hidden only'}
          </button>
          {mode === 'live' && (
            <button
              type="button"
              onClick={onLock}
              className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              Lock
            </button>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
      </header>

      {/* Albums */}
      <div className="container-prose space-y-12">
        {visibleAlbums.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-sm text-silver/60">
            {onlyMarked
              ? 'No photos hidden yet. Click photos below to hide them.'
              : 'No photos found. Run the gallery pipeline to populate it.'}
          </p>
        ) : (
          visibleAlbums.map((a) => (
            <section key={a.slug}>
              <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-white/10 pb-2">
                <h2 className="heading-serif text-xl text-white sm:text-2xl">
                  {a.title}
                </h2>
                <span className="shrink-0 text-xs text-silver/50">
                  {a.photos.length} {a.photos.length === 1 ? 'photo' : 'photos'}
                </span>
              </div>

              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6">
                {a.photos.map((p, i) => {
                  const marked = effective.has(p.full)
                  const locked = committed.has(p.full)
                  return (
                    <li key={p.thumb}>
                      <button
                        type="button"
                        onClick={() => toggle(p.full)}
                        disabled={locked}
                        className={`group relative block aspect-square w-full overflow-hidden rounded-xl bg-forest-800 ring-2 transition-all focus:outline-none focus:ring-medical disabled:cursor-not-allowed ${
                          marked
                            ? 'ring-red-500'
                            : 'ring-transparent hover:ring-white/30'
                        }`}
                        aria-pressed={marked}
                        aria-label={`${marked ? 'Restore' : 'Hide'} photo ${
                          i + 1
                        } from ${a.title}`}
                        title={
                          locked
                            ? 'Permanently removed in code (galleryRemovals.js)'
                            : undefined
                        }
                      >
                        <img
                          src={p.thumb}
                          alt=""
                          loading="lazy"
                          width={p.w}
                          height={p.h}
                          className={`h-full w-full object-cover transition-all duration-300 ${
                            marked
                              ? 'scale-100 opacity-30 grayscale'
                              : 'group-hover:scale-105'
                          }`}
                        />
                        <span
                          className={`absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full text-xs font-bold shadow-lg transition-all ${
                            marked
                              ? 'bg-red-600 text-white'
                              : 'bg-black/50 text-white/0 group-hover:text-white/90'
                          }`}
                          aria-hidden="true"
                        >
                          {locked ? '🔒' : marked ? '✕' : '+'}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))
        )}
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-white/15 bg-forest-950/95 px-4 py-3 backdrop-blur-md">
        <div className="container-prose flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-silver/80">
            <span className="font-semibold text-white">{effective.size}</span>{' '}
            hidden
            {mode === 'live' ? (
              <span className="text-medical-light"> · changes are live</span>
            ) : (
              localMarks.length > 0 && (
                <span className="text-silver/50">
                  {' '}
                  ({localMarks.length} new, not deployed yet)
                </span>
              )
            )}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {mode === 'export' && (
              <button
                type="button"
                onClick={downloadList}
                disabled={effective.size === 0}
                className="rounded-full bg-medical px-4 py-2 text-xs font-semibold text-forest-950 transition-colors hover:bg-medical-light disabled:opacity-40"
              >
                Download galleryRemovals.js
              </button>
            )}
            <button
              type="button"
              onClick={copyList}
              disabled={effective.size === 0}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-40"
              title="Export the current hidden list as galleryRemovals.js source"
            >
              {copied ? 'Copied' : mode === 'live' ? 'Copy as code' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function Centered({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-950 px-4">
      {children}
    </div>
  )
}
