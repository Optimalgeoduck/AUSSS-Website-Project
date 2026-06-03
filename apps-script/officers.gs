/**
 * AUSSS officer self-service editor — Google Apps Script Web App
 * ---------------------------------------------------------------------------
 * Lets each Team-of-Officials member log in and edit THEIR OWN committee page
 * (photo, tagline, bio, "what we do", and an optional members list) — changes
 * go live for every visitor without a redeploy.
 *
 * Bind this to a NEW Google Sheet (Extensions → Apps Script) with two tabs:
 *
 *   Accounts   (one row per officer; you seed these — see officers.README.md)
 *     A: email        B: passwordHash   C: salt
 *     D: slug         E: displayName    F: role        G: scope
 *
 *   scope decides what the account may edit:
 *     'committee' (or blank) → only the committee in column D (slug)
 *     'all'                  → every committee (Executive Board)
 *     'dev'                  → everything (developer; superset of 'all')
 *
 *   Overrides  (written by this script; create the tab with just the header)
 *     A: slug         B: json           C: updatedBy      D: updatedAt
 *
 * Deploy → New deployment → Web app:  Execute as Me · Who has access: Anyone.
 * Copy the /exec URL into src/data/officersConfig.js (OFFICERS_WEBAPP_URL).
 *
 * Cross-origin note (same as gallery.gs / orders.gs): GET responses are
 * readable across Apps Script's 302 redirect, so login / validate / overrides
 * are GET. The save is a no-cors POST (large base64 photos); the browser can't
 * read its reply, so the client re-fetches ?action=overrides to confirm.
 */

// ── Config ────────────────────────────────────────────────────────────────
var SPREADSHEET_ID = '' // leave '' if this script is bound to the sheet
var ACCOUNTS_SHEET = 'Accounts'
var OVERRIDES_SHEET = 'Overrides'
var PHOTOS_FOLDER = 'AUSSS Officer Photos'
var TOKEN_TTL_DAYS = 7
var MAX_MEMBERS = 10
var MAX_ACTIVITIES = 6

// ── Small helpers ───────────────────────────────────────────────────────────
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

function norm_(v) {
  return String(v == null ? '' : v).toLowerCase().trim()
}

function sha256_(s) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(s),
    Utilities.Charset.UTF_8,
  )
  return bytes
    .map(function (b) {
      return ('0' + (b & 0xff).toString(16)).slice(-2)
    })
    .join('')
}

function ss_() {
  return SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet()
}

function sheet_(name) {
  var s = ss_().getSheetByName(name)
  if (!s) throw new Error('Missing sheet tab: ' + name)
  return s
}

// ── Accounts ────────────────────────────────────────────────────────────────
// Returns { email, passwordHash, salt, slug, displayName, role, scope } or null.
function findAccount_(email) {
  var values = sheet_(ACCOUNTS_SHEET).getDataRange().getValues()
  var target = norm_(email)
  for (var r = 1; r < values.length; r++) {
    if (norm_(values[r][0]) === target) {
      return {
        email: norm_(values[r][0]),
        passwordHash: String(values[r][1] || '').trim(),
        salt: String(values[r][2] || ''),
        slug: String(values[r][3] || '').trim().toLowerCase(),
        displayName: String(values[r][4] || '').trim(),
        role: String(values[r][5] || '').trim(),
        scope: norm_(values[r][6]) || 'committee',
      }
    }
  }
  return null
}

// Whether a token's scope lets it edit `target` (a committee slug).
function canEdit_(scope, tokenSlug, target) {
  if (!target) return false
  if (scope === 'all' || scope === 'dev') return true
  return target === tokenSlug
}

// ── Tokens (Script Properties) ───────────────────────────────────────────────
function issueToken_(account) {
  var token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '')
  var exp = Date.now() + TOKEN_TTL_DAYS * 86400000
  PropertiesService.getScriptProperties().setProperty(
    'tok_' + token,
    JSON.stringify({
      scope: account.scope,
      slug: account.slug,
      name: account.displayName,
      exp: exp,
    }),
  )
  return token
}

// Returns { scope, slug, name } for a valid, unexpired token, else null.
function readToken_(token) {
  if (!token) return null
  var raw = PropertiesService.getScriptProperties().getProperty('tok_' + token)
  if (!raw) return null
  try {
    var t = JSON.parse(raw)
    if (!t || !t.exp || Date.now() > t.exp) return null
    return { scope: t.scope || 'committee', slug: t.slug, name: t.name }
  } catch (e) {
    return null
  }
}

// ── Site settings (global toggles in Script Properties) ─────────────────────
// A tiny global KV any dev/EB account can flip; read publicly by the site.
// Currently just `magazineInHeader` (show the Magazine CTA in the navbar).
var SETTINGS_KEY = 'SITE_SETTINGS'

function readSettings_() {
  var out = { magazineInHeader: true }
  var raw = PropertiesService.getScriptProperties().getProperty(SETTINGS_KEY)
  if (raw) {
    try {
      var parsed = JSON.parse(raw)
      if (parsed && typeof parsed.magazineInHeader === 'boolean') {
        out.magazineInHeader = parsed.magazineInHeader
      }
    } catch (e) {
      /* keep defaults */
    }
  }
  return out
}

function writeSettings_(patch) {
  var current = readSettings_()
  if (patch && typeof patch.magazineInHeader === 'boolean') {
    current.magazineInHeader = patch.magazineInHeader
  }
  PropertiesService.getScriptProperties().setProperty(
    SETTINGS_KEY,
    JSON.stringify(current),
  )
  return current
}

// ── Overrides ────────────────────────────────────────────────────────────────
function readOverrides_() {
  var values = sheet_(OVERRIDES_SHEET).getDataRange().getValues()
  var map = {}
  for (var r = 1; r < values.length; r++) {
    var slug = String(values[r][0] || '').trim().toLowerCase()
    if (!slug) continue
    try {
      map[slug] = JSON.parse(values[r][1] || '{}')
    } catch (e) {
      /* skip malformed row */
    }
  }
  return map
}

function writeOverride_(slug, obj, updatedBy) {
  var sheet = sheet_(OVERRIDES_SHEET)
  var values = sheet.getDataRange().getValues()
  var json = JSON.stringify(obj)
  var now = new Date()
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][0] || '').trim().toLowerCase() === slug) {
      sheet.getRange(r + 1, 1, 1, 4).setValues([[slug, json, updatedBy || '', now]])
      return
    }
  }
  sheet.appendRow([slug, json, updatedBy || '', now])
}

// ── Photo upload (base64 data URI → Drive public URL) ────────────────────────
function getOrCreateFolder_(parent, name) {
  var it = parent.getFoldersByName(name)
  return it.hasNext() ? it.next() : parent.createFolder(name)
}

// The lh3.googleusercontent host serves Drive images reliably inside an <img>
// (the older drive.google.com/uc?export=view links are flaky when hotlinked).
function driveEmbed_(id) {
  return 'https://lh3.googleusercontent.com/d/' + id + '=w1000'
}

function driveId_(url) {
  var m = String(url).match(/(?:\/d\/|[?&]id=|\/file\/d\/)([A-Za-z0-9_-]{20,})/)
  return m ? m[1] : ''
}

// A value is either a "data:image/...;base64,...." string (uploaded to Drive),
// an existing Drive URL (normalised to the reliable embed form), or any other
// URL / empty string (kept as-is).
function resolvePhoto_(value, slug, hint) {
  var v = String(value || '')
  if (v.indexOf('data:') === 0) {
    var comma = v.indexOf(',')
    var mime = v.substring(5, comma).split(';')[0] || 'image/jpeg'
    var ext = mime.split('/')[1] || 'jpg'
    var bytes = Utilities.base64Decode(v.substring(comma + 1))
    var root = DriveApp.getRootFolder()
    var folder = getOrCreateFolder_(getOrCreateFolder_(root, PHOTOS_FOLDER), slug)
    var name = slug + '-' + hint + '-' + Date.now() + '.' + ext
    var file = folder.createFile(Utilities.newBlob(bytes, mime, name))
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
    return driveEmbed_(file.getId())
  }
  if (/drive\.google\.com|googleusercontent/.test(v)) {
    var id = driveId_(v)
    if (id) return driveEmbed_(id)
  }
  return v
}

// ── Web app entrypoints ───────────────────────────────────────────────────
function doGet(e) {
  var p = (e && e.parameter) || {}
  var action = String(p.action || 'overrides').toLowerCase()
  try {
    if (action === 'overrides') {
      return json_({ ok: true, overrides: readOverrides_() })
    }

    // Public read of the global site settings (e.g. magazineInHeader).
    if (action === 'settings') {
      return json_({ ok: true, settings: readSettings_() })
    }

    // Dev/EB write of a site setting. GET (not POST) so the reply — the saved
    // settings — is readable across Apps Script's 302 redirect, letting the
    // toggle confirm immediately. Requires an 'all' or 'dev' scoped token.
    if (action === 'setsettings') {
      var st = readToken_(p.token)
      if (!st) return json_({ ok: false, error: 'Session expired' })
      if (st.scope !== 'all' && st.scope !== 'dev') {
        return json_({ ok: false, error: 'Not allowed' })
      }
      var patch = {}
      if (typeof p.magazineInHeader !== 'undefined') {
        patch.magazineInHeader = String(p.magazineInHeader) === 'true'
      }
      return json_({ ok: true, settings: writeSettings_(patch) })
    }

    if (action === 'login') {
      var acct = findAccount_(p.email)
      if (!acct || !acct.passwordHash) {
        return json_({ ok: false, error: 'Invalid email or password' })
      }
      if (sha256_(acct.salt + String(p.password || '')) !== acct.passwordHash) {
        return json_({ ok: false, error: 'Invalid email or password' })
      }
      return json_({
        ok: true,
        token: issueToken_(acct),
        scope: acct.scope,
        slug: acct.slug,
        name: acct.displayName,
      })
    }

    if (action === 'validate') {
      var t = readToken_(p.token)
      if (!t) return json_({ ok: false, error: 'Session expired' })
      return json_({ ok: true, scope: t.scope, slug: t.slug, name: t.name })
    }

    return json_({ ok: false, error: 'Unknown action' })
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) })
  }
}

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents
    var payload = raw ? JSON.parse(raw) : {}
    var action = String(payload.action || '').toLowerCase()

    if (action !== 'save') return json_({ ok: false, error: 'Unknown action' })

    var t = readToken_(payload.token)
    if (!t) return json_({ ok: false, error: 'Session expired' })

    // Target committee: officers may only edit their own; EB/dev edit any.
    var slug = String(payload.slug || t.slug || '').trim().toLowerCase()
    if (!canEdit_(t.scope, t.slug, slug)) {
      return json_({ ok: false, error: 'Not allowed to edit ' + slug })
    }
    var f = payload.fields || {}

    // Build the resolved override, uploading any freshly-picked photos.
    var members = Array.isArray(f.members) ? f.members.slice(0, MAX_MEMBERS) : []
    var resolvedMembers = members.map(function (m, i) {
      return {
        id: String(m.id || 'm' + i),
        name: String(m.name || '').trim(),
        title: String(m.title || '').trim(),
        photo: resolvePhoto_(m.photo, slug, 'member-' + (m.id || i)),
      }
    })

    // "What we run" cards — scope must be AUSSS or IFMSA-Egypt; cap at 6.
    var activities = Array.isArray(f.activities)
      ? f.activities.slice(0, MAX_ACTIVITIES)
      : []
    var resolvedActivities = activities
      .map(function (a) {
        var scope = String((a && a.scope) || '')
        if (scope !== 'AUSSS' && scope !== 'IFMSA-Egypt') scope = 'AUSSS'
        return {
          title: String((a && a.title) || '').trim(),
          blurb: String((a && a.blurb) || '').trim(),
          type: String((a && a.type) || '').trim(),
          scope: scope,
        }
      })
      .filter(function (a) {
        return a.title || a.blurb
      })

    var override = {
      tagline: String(f.tagline || '').trim(),
      about: Array.isArray(f.about)
        ? f.about.map(function (x) { return String(x).trim() }).filter(Boolean)
        : [],
      whatWeDo: Array.isArray(f.whatWeDo)
        ? f.whatWeDo.map(function (x) { return String(x).trim() }).filter(Boolean)
        : [],
      // "What we do" is opt-in (off by default) — officers toggle it on.
      whatWeDoEnabled: Boolean(f.whatWeDoEnabled),
      photo: resolvePhoto_(f.photo, slug, 'officer'),
      membersEnabled: Boolean(f.membersEnabled),
      members: resolvedMembers,
      activities: resolvedActivities,
    }

    writeOverride_(slug, override, t.name)
    return json_({ ok: true, slug: slug })
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) })
  }
}

// ── Password helpers ─────────────────────────────────────────────────────────

// Writes a fresh salt + hash for one account directly into the Accounts sheet.
// Returns true if the email was found. Used by both the menu and setPassword().
function writePassword_(email, newPassword) {
  var sheet = sheet_(ACCOUNTS_SHEET)
  var values = sheet.getDataRange().getValues()
  var target = norm_(email)
  for (var r = 1; r < values.length; r++) {
    if (norm_(values[r][0]) === target) {
      var salt = Utilities.getUuid().replace(/-/g, '')
      sheet.getRange(r + 1, 2).setValue(sha256_(salt + String(newPassword))) // B
      sheet.getRange(r + 1, 3).setValue(salt) // C
      return true
    }
  }
  return false
}

// EASIEST: open the bound Google Sheet → "AUSSS" menu → "Set / reset a
// password" → type the email and the new password. No code editing.
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('AUSSS')
    .addItem('Set / reset a password', 'promptSetPassword')
    .addToUi()
}

function promptSetPassword() {
  var ui = SpreadsheetApp.getUi()
  var e = ui.prompt('Reset password', 'Account email:', ui.ButtonSet.OK_CANCEL)
  if (e.getSelectedButton() !== ui.Button.OK) return
  var p = ui.prompt('Reset password', 'New password:', ui.ButtonSet.OK_CANCEL)
  if (p.getSelectedButton() !== ui.Button.OK) return
  var ok = writePassword_(e.getResponseText().trim(), p.getResponseText())
  ui.alert(ok ? 'Password updated.' : 'No account found for that email.')
}

// Alternative (no menu): set the two vars, then Run → setPassword.
function setPassword() {
  var email = 'someone@example.com'
  var newPassword = 'CHANGE_ME'
  Logger.log(
    writePassword_(email, newPassword)
      ? 'Updated password for ' + email
      : 'No account found for ' + email,
  )
}

// Seeding helper kept for reference: logs a hash+salt you paste in by hand.
function computeHash() {
  var password = 'CHANGE_ME'
  var salt = 'CHANGE_ME_TO_SOMETHING_RANDOM'
  Logger.log('salt:        ' + salt)
  Logger.log('passwordHash: ' + sha256_(salt + password))
}
