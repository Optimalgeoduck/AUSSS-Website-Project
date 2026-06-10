// Shared GET helper for the Apps Script backends (gallery, magazine,
// officers). Builds the query URL, enforces a request timeout so a hung
// backend can't leave the UI spinning forever, and normalizes transport
// errors (non-2xx) and payload errors ({ok:false}) into thrown Errors so
// callers only need one catch. GET responses are readable across Apps
// Script's 302 redirect, unlike POSTs.

function timeoutSignal(ms) {
  // Modern browsers (2022+). Falls back gracefully where unsupported.
  if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
    return AbortSignal.timeout(ms)
  }
  if (typeof AbortController !== 'undefined') {
    const ctrl = new AbortController()
    setTimeout(() => ctrl.abort(), ms)
    return ctrl.signal
  }
  return undefined
}

export async function appsScriptGet(baseUrl, params, { timeoutMs = 10000 } = {}) {
  const url = new URL(baseUrl)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), {
    method: 'GET',
    signal: timeoutSignal(timeoutMs),
  })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  const data = await res.json()
  if (!data.ok) {
    // `rejected` lets callers tell "the backend said no" (bad token, bad
    // key) apart from transport trouble (offline, timeout) caught above.
    const err = new Error(data.error || 'Request failed')
    err.rejected = true
    throw err
  }
  return data
}
