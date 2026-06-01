import { useCallback, useEffect, useState } from 'react'
import {
  OFFICERS_WEBAPP_URL,
  officersLiveEnabled,
} from '../data/officersConfig.js'

// Live officer overrides, keyed by committee slug.
//
// The backend (apps-script/officers.gs) stores one JSON blob per committee:
//   { tagline, about[], whatWeDo[], photo, membersEnabled, members[] }
// Committee pages fetch the whole map once on load and merge the matching
// slug's override on top of the static society.js committee. Mirrors the
// fetch + localStorage-cache shape of useGalleryRemovals.

const CACHE_KEY = 'ausss-officer-overrides-cache'

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

// One GET to the backend; throws on a non-ok payload. Responses are readable
// across Apps Script's 302 redirect because they're GET requests.
export async function officersApiGet(params) {
  const url = new URL(OFFICERS_WEBAPP_URL)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), { method: 'GET' })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Request failed')
  return data
}

// Write path. Apps Script POST replies aren't readable cross-origin, so this
// is fire-and-forget (no-cors); the caller re-fetches overrides to confirm.
// text/plain dodges the CORS preflight (same trick as the merch order POST).
export async function postOfficerSave(payload) {
  await fetch(OFFICERS_WEBAPP_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
}

export async function fetchOverrides() {
  if (!officersLiveEnabled) return {}
  const data = await officersApiGet({ action: 'overrides' })
  return data.overrides && typeof data.overrides === 'object'
    ? data.overrides
    : {}
}

export function useOfficerOverrides() {
  const [overrides, setOverrides] = useState(() =>
    officersLiveEnabled ? readCache() : {},
  )
  const [loading, setLoading] = useState(officersLiveEnabled)

  const refresh = useCallback(async () => {
    if (!officersLiveEnabled) return {}
    const map = await fetchOverrides()
    setOverrides(map)
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(map))
    } catch {
      /* ignore */
    }
    return map
  }, [])

  useEffect(() => {
    if (!officersLiveEnabled) {
      setLoading(false)
      return
    }
    let alive = true
    refresh()
      .catch(() => {
        /* keep cached/empty map */
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [refresh])

  return { overrides, loading, refresh, liveEnabled: officersLiveEnabled }
}
