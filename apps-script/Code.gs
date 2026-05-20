/**
 * AUSSS membership lookup — Google Apps Script Web App
 * ---------------------------------------------------------------------------
 * Bind this to the membership Google Sheet (Extensions → Apps Script),
 * then Deploy → New deployment → Web app:
 *     Execute as:        Me
 *     Who has access:    Anyone
 * Copy the /exec URL into src/data/membershipConfig.js (WEBAPP_URL) and set
 * SOURCE = 'webapp'.
 *
 * Privacy: this only ever returns the SINGLE record matching the exact
 * name + email supplied. There is no code path that returns the list.
 *
 * Request:  GET ?name=<full name>  and/or  ?email=<email>
 *           (email is matched first since it's unique; name is the fallback)
 * Response: { found:bool, multiple:bool, record?:{
 *              status, yearJoined, yearsSpent, lgas, ngas, currentPosition } }
 *            multiple=true → more than one member shares that name.
 */

// Optional: pin to a specific sheet/tab. Leave SHEET_NAME '' to use the
// first sheet, or set it to 'Database'. If this script is NOT bound to the
// data spreadsheet, set SPREADSHEET_ID to its id.
var SPREADSHEET_ID = ''
var SHEET_NAME = 'Database'

// MUST stay byte-identical to normalize() in src/lib/membership.js
function norm(v) {
  return String(v == null ? '' : v)
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

function getSheet_() {
  var ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet()
  return (SHEET_NAME && ss.getSheetByName(SHEET_NAME)) || ss.getSheets()[0]
}

function doGet(e) {
  try {
    var name = norm((e && e.parameter && e.parameter.name) || '')
    var email = norm((e && e.parameter && e.parameter.email) || '')
    if (!name && !email) return json_({ found: false, multiple: false })

    var values = getSheet_().getDataRange().getValues()

    // Locate the header row (the one containing "Email Address").
    var hRow = -1
    for (var r = 0; r < values.length; r++) {
      for (var c = 0; c < values[r].length; c++) {
        if (/email\s*address/i.test(String(values[r][c]))) {
          hRow = r
          break
        }
      }
      if (hRow !== -1) break
    }
    if (hRow === -1) return json_({ found: false, multiple: false })

    var head = values[hRow].map(function (h) {
      return String(h).toLowerCase()
    })
    var find = function (re) {
      for (var i = 0; i < head.length; i++) if (re.test(head[i])) return i
      return -1
    }
    var ci = {
      name: find(/name/),
      email: find(/email/),
      year: find(/year of joining/),
      yrs: find(/years spent/),
      lga: find(/lga/),
      nga: find(/nga/),
      pos: find(/current position/),
      status: find(/status/),
    }

    var toRecord = function (row) {
      return {
        status: String(row[ci.status] || '').trim(),
        yearJoined: String(row[ci.year] || '').trim(),
        yearsSpent: String(row[ci.yrs] || '').trim(),
        lgas: String(row[ci.lga] || '').trim(),
        ngas: String(row[ci.nga] || '').trim(),
        currentPosition:
          String(row[ci.pos] || '').trim() || 'General Member',
      }
    }

    // Email first (unique → never "multiple").
    if (email && ci.email !== -1) {
      for (var i = hRow + 1; i < values.length; i++) {
        if (norm(values[i][ci.email]) === email)
          return json_({ found: true, multiple: false, record: toRecord(values[i]) })
      }
    }
    if (name) {
      var matches = []
      for (var j = hRow + 1; j < values.length; j++) {
        if (norm(values[j][ci.name]) === name) matches.push(toRecord(values[j]))
      }
      if (matches.length === 1)
        return json_({ found: true, multiple: false, record: matches[0] })
      if (matches.length > 1) return json_({ found: false, multiple: true })
    }
    return json_({ found: false, multiple: false })
  } catch (err) {
    return json_({ found: false, multiple: false, error: String(err) })
  }
}
