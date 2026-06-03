// Runtime config for magazine engagement (view + like counters).
//
// Paste the deployed Apps Script web-app URL (from apps-script/magazine.gs)
// here. When set, the magazine page records a view per visit and shows a live
// "reads" count + a working Like button. When left empty the feature is
// dormant — no counters or Like button render, and no requests are made.
export const MAGAZINE_WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbymoTD2Y6N6Z9XmmQKz2MZ_O41pcRCfczE8l6GQmrJCt3XXbT1IBJCT19QeSEd7iIN0/exec'

export const magazineEngagementEnabled = Boolean(MAGAZINE_WEBAPP_URL)

// Whether to SHOW the live reads/likes counter + Like button on the page.
// Views are still recorded in the background when this is false — only the
// on-page counter UI is hidden. Flip to true to surface it again.
export const magazineCountersVisible = false
