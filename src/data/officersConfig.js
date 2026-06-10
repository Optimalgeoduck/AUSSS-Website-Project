// Runtime config for the officer (Team-of-Officials) self-service editor.
//
// Paste the deployed Apps Script web app URL (from apps-script/officers.gs)
// here. When set:
//   - committee pages merge each committee's live overrides (photo, tagline,
//     bio, "what we do", optional members list) on top of the static defaults
//     in society.js, no redeploy needed;
//   - /login + /account let an officer sign in and edit their OWN committee.
// When left empty the feature is dormant: committee pages render the static
// society.js content and /login simply reports the editor isn't set up yet.
//
// See apps-script/officers.README.md for the deploy + account-seeding steps.
export const OFFICERS_WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbwmoWZHnubjubeIHAF1GV-eR8AiI2CR8brMO1E2v1V2U08m71NMdguG1sLnDNF9Q36ZXw/exec'

// True when a backend is configured, drives live overrides + login.
export const officersLiveEnabled = Boolean(OFFICERS_WEBAPP_URL)
