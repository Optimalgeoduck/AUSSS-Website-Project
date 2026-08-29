// Runtime config for the lightweight "sign-ups" capture (recruitment waitlist
// + newsletter). Mirrors storiesConfig.js / merchConfig.js so the AUSSS team
// can flip things on and paste the deployed endpoint without touching UI code.

// Show the "notify me when registration opens" form on /join.
export const WAITLIST_OPEN = true

// Show the newsletter signup (footer + magazine).
export const NEWSLETTER_OPEN = true

// The Apps Script web app deployed from apps-script/signups.gs.
// Empty string = use the stub handler that just console-logs, so the UX can be
// reviewed in dev without a backend. Paste the /exec URL here after deploying.
export const SIGNUPS_WEBAPP_URL = ''

// Sign-up notifications are emailed from inside apps-script/signups.gs; this
// is documentation only. Change TEAM_EMAIL there and redeploy to reroute.
export const TEAM_EMAIL = 'loreausss@gmail.com'
