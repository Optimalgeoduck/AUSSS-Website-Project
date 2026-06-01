import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { committeeBySlug, committees, slugFor } from '../data/society.js'
import { driveImg } from '../lib/img.js'
import { useOfficerAuth } from '../hooks/useOfficerAuth.js'
import {
  useOfficerOverrides,
  postOfficerSave,
} from '../hooks/useOfficerOverrides.js'

const MAX_MEMBERS = 10
const MAX_ACTIVITIES = 6
const ACTIVITY_TYPES = ['Campaign', 'Workshop', 'Project', 'Exchange', 'Awareness Day']

function Centered({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-950 px-4 text-center">
      {children}
    </div>
  )
}

function uid() {
  try {
    return crypto.randomUUID()
  } catch {
    return 'm' + Date.now() + Math.round(Math.random() * 1e6)
  }
}

// Downscale a picked image to a small JPEG data URI before upload, so the
// no-cors save payload stays light even with several member photos.
function resizeImage(file, max = 512) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        let { width, height } = img
        if (width >= height && width > max) {
          height = Math.round((height * max) / width)
          width = max
        } else if (height > max) {
          width = Math.round((width * max) / height)
          height = max
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function AccountPage() {
  const auth = useOfficerAuth()
  const { overrides, loading, refresh } = useOfficerOverrides()
  const [status, setStatus] = useState('checking') // checking|ready|unauthed|disabled
  const [selected, setSelected] = useState('') // chosen committee slug (EB/dev)

  useEffect(() => {
    if (!auth.liveEnabled) {
      setStatus('disabled')
      return
    }
    if (!auth.token) {
      setStatus('unauthed')
      return
    }
    let alive = true
    auth.validate().then((r) => {
      if (alive) setStatus(r.ok ? 'ready' : 'unauthed')
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status === 'disabled') {
    return (
      <Centered>
        <div className="max-w-sm">
          <p className="text-sm text-silver/70">
            The officer editor isn’t set up yet.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-sm font-semibold text-medical-light hover:text-white"
          >
            ← Home
          </Link>
        </div>
      </Centered>
    )
  }
  if (status === 'unauthed') return <Navigate to="/login" replace />
  if (status === 'checking' || loading) {
    return (
      <Centered>
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-medical-light" />
      </Centered>
    )
  }

  const multi = auth.scope === 'all' || auth.scope === 'dev'
  const targetSlug = multi ? selected : auth.slug

  // EB / developer: choose which committee to edit first.
  if (multi && !targetSlug) return <Picker auth={auth} onPick={setSelected} />

  const committee = committeeBySlug(targetSlug)
  if (!committee) {
    return (
      <Centered>
        <div className="max-w-sm">
          <p className="text-sm text-silver/70">
            {multi
              ? `Unknown committee (${targetSlug}).`
              : `Your account isn’t linked to a known committee (${auth.slug}).`}
          </p>
          <button
            onClick={multi ? () => setSelected('') : auth.logout}
            className="mt-4 text-sm font-semibold text-medical-light hover:text-white"
          >
            {multi ? '← Choose another committee' : 'Log out'}
          </button>
        </div>
      </Centered>
    )
  }

  return (
    <Editor
      key={targetSlug}
      auth={auth}
      committee={committee}
      targetSlug={targetSlug}
      override={overrides[targetSlug] || {}}
      refresh={refresh}
      onBack={multi ? () => setSelected('') : null}
    />
  )
}

// EB / developer landing: pick any committee to edit.
function Picker({ auth, onPick }) {
  return (
    <article className="min-h-screen bg-forest-950 pb-28">
      <header className="container-prose pb-8 pt-28 sm:pt-32">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="eyebrow">
              <span className="h-px w-8 bg-medical" />
              {auth.scope === 'dev' ? 'Developer' : 'Executive Board'}
            </span>
            <h1 className="heading-serif mt-3 text-3xl text-white sm:text-4xl">
              {auth.name ? `Hi, ${auth.name}` : 'Choose a committee'}
            </h1>
            <p className="mt-2 text-sm text-silver/65">
              Pick a committee or division to edit — you have access to all of
              them.
            </p>
          </div>
          <button
            onClick={auth.logout}
            className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </header>
      <div className="container-prose">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {committees.map((c) => {
            const s = slugFor(c)
            return (
              <li key={s}>
                <button
                  onClick={() => onPick(s)}
                  className="group flex w-full flex-col items-center gap-3 rounded-2xl border border-white/10 bg-forest-800 p-5 text-center transition-colors hover:border-medical/40"
                >
                  <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-xl bg-white/95 p-1.5">
                    {c.logo ? (
                      <img src={c.logo} alt={c.abbr} className="h-full w-full object-contain" />
                    ) : (
                      <span className="heading-serif text-lg text-forest-950">{c.abbr}</span>
                    )}
                  </span>
                  <span className="heading-serif text-base text-white">{c.abbr}</span>
                  <span className="text-xs leading-snug text-silver/55">{c.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </article>
  )
}

function Editor({ auth, committee, targetSlug, override, refresh, onBack }) {
  // Defaults from society.js, so the form starts pre-filled with what's live.
  const committeeAbout = Array.isArray(committee.about)
    ? committee.about
    : committee.about
      ? [committee.about]
      : committee.description
        ? [committee.description]
        : []
  const leadPhoto =
    (Array.isArray(committee.officers) && committee.officers[0]?.photo) ||
    committee.photo ||
    ''

  const [tagline, setTagline] = useState(override.tagline || committee.tagline || '')
  const [aboutText, setAboutText] = useState(
    (override.about?.length ? override.about : committeeAbout).join('\n\n'),
  )
  const [whatWeDoText, setWhatWeDoText] = useState(
    (override.whatWeDo?.length ? override.whatWeDo : committee.whatWeDo || []).join('\n'),
  )
  const [photo, setPhoto] = useState(override.photo || leadPhoto || '')
  const [membersEnabled, setMembersEnabled] = useState(
    Boolean(override.membersEnabled),
  )
  const [members, setMembers] = useState(() =>
    Array.isArray(override.members)
      ? override.members.map((m) => ({
          id: m.id || uid(),
          name: m.name || '',
          title: m.title || '',
          photo: m.photo || '',
        }))
      : [],
  )
  const [activities, setActivities] = useState(() =>
    (Array.isArray(override.activities)
      ? override.activities
      : committee.activities || []
    ).map((a) => ({
      id: uid(),
      title: a.title || '',
      blurb: a.blurb || '',
      type: a.type || '',
      scope: a.scope === 'IFMSA-Egypt' ? 'IFMSA-Egypt' : 'AUSSS',
    })),
  )

  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const pickPhoto = async (file, onDone) => {
    if (!file) return
    try {
      onDone(await resizeImage(file))
    } catch {
      setMsg('That image couldn’t be read. Try a different file.')
    }
  }

  const addMember = () => {
    if (members.length >= MAX_MEMBERS) return
    setMembers((prev) => [...prev, { id: uid(), name: '', title: '', photo: '' }])
  }
  const removeMember = (id) =>
    setMembers((prev) => prev.filter((m) => m.id !== id))
  const updateMember = (id, patch) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))

  const addActivity = () => {
    if (activities.length >= MAX_ACTIVITIES) return
    setActivities((prev) => [
      ...prev,
      { id: uid(), title: '', blurb: '', type: '', scope: 'AUSSS' },
    ])
  }
  const removeActivity = (id) =>
    setActivities((prev) => prev.filter((a) => a.id !== id))
  const updateActivity = (id, patch) =>
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))

  const save = async () => {
    setBusy(true)
    setMsg('')
    const fields = {
      tagline: tagline.trim(),
      about: aboutText
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter(Boolean),
      whatWeDo: whatWeDoText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      photo,
      membersEnabled,
      members: members
        .map((m) => ({
          id: m.id,
          name: m.name.trim(),
          title: m.title.trim(),
          photo: m.photo,
        }))
        .filter((m) => m.name || m.photo),
      activities: activities
        .map((a) => ({
          title: a.title.trim(),
          blurb: a.blurb.trim(),
          type: a.type.trim(),
          scope: a.scope,
        }))
        .filter((a) => a.title || a.blurb),
    }
    try {
      await postOfficerSave({
        action: 'save',
        token: auth.token,
        slug: targetSlug,
        fields,
      })
      // The POST reply is opaque (no-cors); wait briefly for the script to
      // write (it also uploads any new photos), then re-fetch to confirm.
      await new Promise((r) => setTimeout(r, 1600))
      await refresh()
      setMsg('Saved. Your committee page is updated — changes can take a few seconds to appear.')
    } catch {
      setMsg('Could not save. Check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="min-h-screen bg-forest-950 pb-40">
      <header className="container-prose pb-8 pt-28 sm:pt-32">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            {onBack && (
              <button
                onClick={onBack}
                className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-silver/60 transition-colors hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Choose another committee
              </button>
            )}
            <span className="eyebrow">
              <span className="h-px w-8 bg-medical" />
              Editing {committee.abbr}
            </span>
            <h1 className="heading-serif mt-3 text-3xl text-white sm:text-4xl">
              {auth.name ? `Hi, ${auth.name}` : 'Your committee'}
            </h1>
            <p className="mt-2 text-sm text-silver/65">
              Edits here go live on{' '}
              <Link
                to={`/committees/${targetSlug}`}
                className="font-semibold text-medical-light hover:text-white"
              >
                the {committee.abbr} page
              </Link>
              .
            </p>
          </div>
          <button
            onClick={auth.logout}
            className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="container-prose space-y-8">
        {/* Officer photo */}
        <Field label="Your photo">
          <div className="flex items-center gap-5">
            <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full bg-forest-800 ring-2 ring-white/10">
              {photo ? (
                <img
                  src={driveImg(photo)}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-silver/40">No photo</span>
              )}
            </div>
            <div className="space-y-2">
              <FileButton
                label={photo ? 'Replace photo' : 'Upload photo'}
                onFile={(f) => pickPhoto(f, setPhoto)}
              />
              {photo && (
                <button
                  onClick={() => setPhoto('')}
                  className="block text-xs font-semibold text-silver/55 hover:text-white"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </Field>

        {/* Tagline */}
        <Field label="Tagline" hint="One short line shown under the committee name.">
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="e.g. Exchange the world — four-week clerkships abroad."
            className={inputCls}
          />
        </Field>

        {/* Bio */}
        <Field label="About (bio)" hint="Separate paragraphs with a blank line.">
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            rows={6}
            className={`${inputCls} resize-y`}
          />
        </Field>

        {/* What we do */}
        <Field label="What we do" hint="One item per line.">
          <textarea
            value={whatWeDoText}
            onChange={(e) => setWhatWeDoText(e.target.value)}
            rows={5}
            className={`${inputCls} resize-y`}
          />
        </Field>

        {/* What we run (activities) */}
        <Field
          label="What we run"
          hint={`Up to ${MAX_ACTIVITIES} cards. Tag each as AUSSS-Local or IFMSA-Egypt-National.`}
        >
          <div className="space-y-4">
            {activities.length === 0 && (
              <p className="text-sm text-silver/50">
                No cards yet. Add your first below.
              </p>
            )}
            {activities.map((a, i) => (
              <div
                key={a.id}
                className="space-y-2 rounded-2xl border border-white/10 bg-forest-800 p-4"
              >
                <input
                  value={a.title}
                  onChange={(e) => updateActivity(a.id, { title: e.target.value })}
                  placeholder={`Card ${i + 1} title`}
                  className={inputCls}
                />
                <textarea
                  value={a.blurb}
                  onChange={(e) => updateActivity(a.id, { blurb: e.target.value })}
                  rows={2}
                  placeholder="Short description"
                  className={`${inputCls} resize-y`}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={a.type}
                    onChange={(e) => updateActivity(a.id, { type: e.target.value })}
                    placeholder="Tag (e.g. Campaign)"
                    list="activity-types"
                    className={`${inputCls} flex-1`}
                  />
                  <select
                    value={a.scope}
                    onChange={(e) => updateActivity(a.id, { scope: e.target.value })}
                    className={`${inputCls} flex-1`}
                  >
                    <option value="AUSSS">AUSSS-Local</option>
                    <option value="IFMSA-Egypt">IFMSA-Egypt-National</option>
                  </select>
                  <button
                    onClick={() => removeActivity(a.id)}
                    className="text-xs font-semibold text-red-400/80 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <datalist id="activity-types">
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
            <button
              onClick={addActivity}
              disabled={activities.length >= MAX_ACTIVITIES}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-40"
            >
              {activities.length >= MAX_ACTIVITIES
                ? `Maximum ${MAX_ACTIVITIES} cards`
                : '+ Add card'}
            </button>
          </div>
        </Field>

        {/* Members section */}
        <Field
          label="Members section"
          hint={`Optional. Show up to ${MAX_MEMBERS} members on your page.`}
        >
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={membersEnabled}
              onChange={(e) => setMembersEnabled(e.target.checked)}
              className="h-4 w-4 accent-medical"
            />
            <span className="text-sm text-silver/80">
              Show the members section on my committee page
            </span>
          </label>

          {membersEnabled && (
            <div className="mt-5 space-y-4">
              {members.length === 0 && (
                <p className="text-sm text-silver/50">
                  No members yet. Add your first below.
                </p>
              )}
              {members.map((m, i) => (
                <div
                  key={m.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-forest-800 p-4"
                >
                  <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-forest-950 ring-2 ring-white/10">
                    {m.photo ? (
                      <img
                        src={driveImg(m.photo)}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-silver/40">No photo</span>
                    )}
                  </div>
                  <div className="flex min-w-[12rem] flex-1 flex-col gap-2">
                    <input
                      value={m.name}
                      onChange={(e) => updateMember(m.id, { name: e.target.value })}
                      placeholder={`Member ${i + 1} name`}
                      className={inputCls}
                    />
                    <input
                      value={m.title}
                      onChange={(e) => updateMember(m.id, { title: e.target.value })}
                      placeholder="Title / role"
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <FileButton
                      label={m.photo ? 'Replace' : 'Photo'}
                      small
                      onFile={(f) => pickPhoto(f, (d) => updateMember(m.id, { photo: d }))}
                    />
                    <button
                      onClick={() => removeMember(m.id)}
                      className="text-xs font-semibold text-red-400/80 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addMember}
                disabled={members.length >= MAX_MEMBERS}
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-40"
              >
                {members.length >= MAX_MEMBERS
                  ? `Maximum ${MAX_MEMBERS} members`
                  : '+ Add member'}
              </button>
            </div>
          )}
        </Field>
      </div>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-white/15 bg-forest-950/95 px-4 py-3 backdrop-blur-md">
        <div className="container-prose flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-silver/70">{msg}</p>
          <button
            onClick={save}
            disabled={busy}
            className="rounded-full bg-medical px-6 py-2.5 text-sm font-semibold text-forest-950 transition-colors hover:bg-medical-light disabled:opacity-40"
          >
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </article>
  )
}

const inputCls =
  'w-full rounded-xl border border-white/15 bg-forest-900 px-4 py-2.5 text-sm text-white placeholder:text-silver/40 focus:border-medical focus:outline-none'

function Field({ label, hint, children }) {
  return (
    <section className="mx-auto max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-medical-light">
        {label}
      </p>
      {hint && <p className="mb-3 mt-1 text-xs text-silver/50">{hint}</p>}
      {!hint && <div className="mt-3" />}
      {children}
    </section>
  )
}

function FileButton({ label, onFile, small }) {
  return (
    <label
      className={`inline-flex cursor-pointer items-center justify-center rounded-full border border-white/20 font-semibold text-white transition-colors hover:bg-white/10 ${
        small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
      }`}
    >
      {label}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files && e.target.files[0]
          e.target.value = '' // allow re-picking the same file
          onFile(f)
        }}
      />
    </label>
  )
}
