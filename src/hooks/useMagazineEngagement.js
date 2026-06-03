import { useCallback, useEffect, useRef, useState } from 'react'
import {
  MAGAZINE_WEBAPP_URL,
  magazineEngagementEnabled,
} from '../data/magazineConfig.js'

// View + like counts for one magazine issue, backed by apps-script/magazine.gs.
// All calls are GET (readable across Apps Script's redirect). Likes are
// de-duped per browser via localStorage; the server only ever increments.

const likedKey = (id) => `ausss-mag-liked-${id}`

async function apiGet(params) {
  const url = new URL(MAGAZINE_WEBAPP_URL)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), { method: 'GET' })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Request failed')
  return data
}

// Record a full-quality download. Fire-and-forget: the click opens the file in
// a new tab, so we never block navigation and silently ignore failures. The
// server just increments a per-issue download counter (action=download).
export function trackMagazineDownload(issueId) {
  if (!magazineEngagementEnabled || !issueId) return
  apiGet({ action: 'download', id: issueId }).catch(() => {})
}

export function useMagazineEngagement(issueId) {
  const [counts, setCounts] = useState({ views: 0, likes: 0 })
  const [liked, setLiked] = useState(false)
  const [ready, setReady] = useState(!magazineEngagementEnabled)
  // Count at most one view per mount, even under React strict-mode double-run.
  const viewedRef = useRef(false)

  // Remembered "already liked" state for this browser.
  useEffect(() => {
    if (!issueId) return
    try {
      setLiked(localStorage.getItem(likedKey(issueId)) === '1')
    } catch {
      /* ignore */
    }
  }, [issueId])

  // Record a view and load the current counts.
  useEffect(() => {
    if (!magazineEngagementEnabled || !issueId) {
      setReady(true)
      return
    }
    let alive = true
    ;(async () => {
      try {
        if (!viewedRef.current) {
          viewedRef.current = true
          const d = await apiGet({ action: 'view', id: issueId })
          if (alive && d.counts) setCounts(d.counts)
        } else {
          const d = await apiGet({ action: 'stats' })
          if (alive && d.stats && d.stats[issueId]) setCounts(d.stats[issueId])
        }
      } catch {
        /* leave counts at 0 — the page still works */
      } finally {
        if (alive) setReady(true)
      }
    })()
    return () => {
      alive = false
    }
  }, [issueId])

  const like = useCallback(async () => {
    if (!magazineEngagementEnabled || !issueId || liked) return
    // Optimistic: flip + bump immediately, persist, then confirm with server.
    setLiked(true)
    setCounts((c) => ({ ...c, likes: c.likes + 1 }))
    try {
      localStorage.setItem(likedKey(issueId), '1')
    } catch {
      /* ignore */
    }
    try {
      const d = await apiGet({ action: 'like', id: issueId })
      if (d.counts) setCounts(d.counts)
    } catch {
      /* keep the optimistic value */
    }
  }, [issueId, liked])

  return { counts, liked, like, ready, enabled: magazineEngagementEnabled }
}
