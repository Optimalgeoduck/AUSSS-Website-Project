import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initAnalytics, trackPageview, analyticsEnabled } from '../lib/analytics.js'

// Tracks SPA pageviews on route change. Fully inert when analytics is disabled
// (no init, no listeners, no effects do anything).
export default function usePageviews() {
  const { pathname, search } = useLocation()

  // Initialize GA4 once on mount.
  useEffect(() => {
    if (!analyticsEnabled) return
    initAnalytics()
  }, [])

  // Send a pageview on first render and on every path/search change.
  useEffect(() => {
    if (!analyticsEnabled) return
    trackPageview(pathname + search)
  }, [pathname, search])
}
