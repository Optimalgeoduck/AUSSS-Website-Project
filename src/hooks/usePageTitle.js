import { useEffect } from 'react'

// Per-route document titles. Every page shares the brand title from
// index.html unless it calls this hook; the cleanup restores it so titles
// never leak across client-side navigations. Also feeds analytics, which
// reads document.title when tracking page views.
const BASE_TITLE = "AUSSS, Life Savers, Change Makers"

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — AUSSS` : BASE_TITLE
    return () => {
      document.title = BASE_TITLE
    }
  }, [title])
}
