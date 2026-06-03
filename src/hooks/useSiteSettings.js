import { useCallback, useEffect, useState } from 'react'
import { officersLiveEnabled } from '../data/officersConfig.js'
import { officersApiGet } from './useOfficerOverrides.js'

// Global site settings, flipped by dev/EB officers and read by every visitor.
// Backed by apps-script/officers.gs (Script Properties). Currently a single
// flag: `magazineInHeader` — whether the Magazine CTA shows in the navbar.
//
// Reads are cached in localStorage so the navbar can render the right state
// instantly on repeat visits (no flash); the first-ever load falls back to the
// defaults and corrects itself once the fetch resolves.

const CACHE_KEY = 'ausss-site-settings'
const DEFAULTS = { magazineInHeader: true }

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object'
      ? { ...DEFAULTS, ...parsed }
      : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

export async function fetchSiteSettings() {
  if (!officersLiveEnabled) return { ...DEFAULTS }
  const data = await officersApiGet({ action: 'settings' })
  return { ...DEFAULTS, ...(data.settings || {}) }
}

// Dev/EB write. GET so the reply (the saved settings) is readable across Apps
// Script's redirect, so the toggle can confirm right away. Returns the saved
// settings; throws on a non-ok payload (e.g. expired session / not allowed).
export async function saveSiteSettings(token, patch) {
  const params = { action: 'setsettings', token }
  if (typeof patch.magazineInHeader === 'boolean') {
    params.magazineInHeader = patch.magazineInHeader ? 'true' : 'false'
  }
  const data = await officersApiGet(params)
  return { ...DEFAULTS, ...(data.settings || {}) }
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(readCache)

  const refresh = useCallback(async () => {
    if (!officersLiveEnabled) return
    try {
      const s = await fetchSiteSettings()
      setSettings(s)
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(s))
      } catch {
        /* ignore */
      }
    } catch {
      /* keep cached/default settings */
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { settings, refresh, setSettings }
}
