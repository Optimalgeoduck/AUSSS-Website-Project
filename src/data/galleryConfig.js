// Runtime config for live gallery photo takedowns.
//
// Paste the deployed Apps Script web app URL (from apps-script/gallery.gs)
// here. When set, the admin page (/gallery/admin) hides/shows photos live for
// every visitor, no redeploy, and the public gallery reads this list on
// load. When left empty, the admin page falls back to the export workflow
// (mark → download galleryRemovals.js → redeploy), so dev still works.
//
// See apps-script/gallery.README.md for the 5-minute deploy.
export const GALLERY_WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbwep4pLHw6O9EqNmvQDYZmpldgKioWbUm2Er4geJPTiuC36SRNZNXfvTpxENTcNX5dXPg/exec'

// True when a backend is configured, drives live vs. export behavior.
export const galleryLiveEnabled = Boolean(GALLERY_WEBAPP_URL)
