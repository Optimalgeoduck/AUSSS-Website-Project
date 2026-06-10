import { useCallback, useEffect, useState } from 'react'
import { officersLiveEnabled } from '../data/officersConfig.js'
import { officersApiGet } from './useOfficerOverrides.js'

// Officer auth: a short-lived token (issued by officers.gs on login) kept in
// sessionStorage, scoped to the officer's single committee slug. Mirrors the
// session-stored admin key in GalleryAdminPage, but the token also carries the
// slug the holder is allowed to edit.

const TOKEN_SS = 'ausss-officer-token'
const SLUG_SS = 'ausss-officer-slug'
const NAME_SS = 'ausss-officer-name'
const SCOPE_SS = 'ausss-officer-scope'

function read(key) {
  try {
    return sessionStorage.getItem(key) || ''
  } catch {
    return ''
  }
}

export function useOfficerAuth() {
  const [token, setToken] = useState(() => read(TOKEN_SS))
  const [slug, setSlug] = useState(() => read(SLUG_SS))
  const [name, setName] = useState(() => read(NAME_SS))
  const [scope, setScope] = useState(() => read(SCOPE_SS) || 'committee')

  const persist = useCallback((tok, scp, sl, nm) => {
    setToken(tok)
    setScope(scp || 'committee')
    setSlug(sl)
    setName(nm)
    try {
      if (tok) {
        sessionStorage.setItem(TOKEN_SS, tok)
        sessionStorage.setItem(SCOPE_SS, scp || 'committee')
        sessionStorage.setItem(SLUG_SS, sl)
        sessionStorage.setItem(NAME_SS, nm)
      } else {
        sessionStorage.removeItem(TOKEN_SS)
        sessionStorage.removeItem(SCOPE_SS)
        sessionStorage.removeItem(SLUG_SS)
        sessionStorage.removeItem(NAME_SS)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const login = useCallback(
    async (email, password) => {
      if (!officersLiveEnabled) {
        return { ok: false, error: 'The officer editor isn’t set up yet.' }
      }
      try {
        const data = await officersApiGet({
          action: 'login',
          email: String(email || '').trim(),
          password: String(password || ''),
        })
        persist(data.token, data.scope, data.slug, data.name || '')
        return { ok: true, scope: data.scope, slug: data.slug, name: data.name }
      } catch (err) {
        return { ok: false, error: err.message || 'Login failed' }
      }
    },
    [persist],
  )

  const logout = useCallback(() => persist('', '', '', ''), [persist])

  // Re-check a remembered token against the backend. Clears it if expired.
  const validate = useCallback(async () => {
    if (!token) return { ok: false }
    try {
      const data = await officersApiGet({ action: 'validate', token })
      // Re-persist so a refreshed scope/slug survives a page reload, not
      // just this React session.
      persist(token, data.scope, data.slug, data.name || '')
      return { ok: true, scope: data.scope, slug: data.slug, name: data.name }
    } catch (err) {
      // Only wipe the session when the backend explicitly rejected the
      // token; a timeout/offline blip shouldn't log the officer out.
      if (err?.rejected) persist('', '', '', '')
      return { ok: false }
    }
  }, [token, persist])

  // Keep state in sync if another tab logs in/out.
  useEffect(() => {
    const onStorage = () => {
      setToken(read(TOKEN_SS))
      setScope(read(SCOPE_SS) || 'committee')
      setSlug(read(SLUG_SS))
      setName(read(NAME_SS))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return {
    token,
    scope,
    slug,
    name,
    login,
    logout,
    validate,
    liveEnabled: officersLiveEnabled,
  }
}
