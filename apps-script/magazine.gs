/**
 * AUSSS Magazine engagement backend — view + like counters.
 *
 * Deploy (same as the officers script):
 *   1. Create this in a Google Sheet's Apps Script editor
 *      (Extensions → Apps Script) so it's bound to a spreadsheet, OR paste a
 *      spreadsheet id into SHEET_ID below for a standalone script.
 *   2. Deploy → New deployment → Web app → Execute as: Me →
 *      Who has access: Anyone.
 *   3. Copy the /exec URL into src/data/magazineConfig.js.
 *
 * Storage: a sheet named "Engagement" with header row: id | views | likes
 * (created automatically on first write).
 *
 * All actions are GET so the JSON reply is readable across Apps Script's 302
 * redirect (same approach as officers.gs reads). The client de-dupes likes
 * per browser via localStorage; the server just increments.
 *
 *   ?action=stats               → { ok, stats: { <id>: {views,likes}, ... } }
 *   ?action=view&id=issue-1     → increments views, returns that id's counts
 *   ?action=like&id=issue-1     → increments likes, returns that id's counts
 */

var SHEET_NAME = 'Engagement'
var SHEET_ID = '' // optional: spreadsheet id for a standalone (unbound) script

function doGet(e) {
  var p = (e && e.parameter) || {}
  var action = String(p.action || 'stats').toLowerCase()
  try {
    if (action === 'stats') return json_({ ok: true, stats: readAll_() })

    var id = String(p.id || '').trim()
    if (!id) return json_({ ok: false, error: 'Missing id' })

    if (action === 'view') return json_({ ok: true, id: id, counts: bump_(id, 'views') })
    if (action === 'like') return json_({ ok: true, id: id, counts: bump_(id, 'likes') })

    return json_({ ok: false, error: 'Unknown action' })
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) })
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

function ss_() {
  if (SHEET_ID) return SpreadsheetApp.openById(SHEET_ID)
  // Bound script (created from inside a Sheet): use that sheet.
  var active = SpreadsheetApp.getActiveSpreadsheet()
  if (active) return active
  // Standalone script: create a spreadsheet once and remember its id in
  // Script Properties, so no manual setup is needed.
  var props = PropertiesService.getScriptProperties()
  var savedId = props.getProperty('ENGAGEMENT_SHEET_ID')
  if (savedId) return SpreadsheetApp.openById(savedId)
  var created = SpreadsheetApp.create('AUSSS Magazine Engagement')
  props.setProperty('ENGAGEMENT_SHEET_ID', created.getId())
  return created
}

function sheet_() {
  var ss = ss_()
  var sh = ss.getSheetByName(SHEET_NAME)
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME)
    sh.appendRow(['id', 'views', 'likes'])
  }
  return sh
}

function readAll_() {
  var sh = sheet_()
  var values = sh.getDataRange().getValues()
  var out = {}
  for (var r = 1; r < values.length; r++) {
    var id = String(values[r][0] || '').trim()
    if (!id) continue
    out[id] = { views: Number(values[r][1] || 0), likes: Number(values[r][2] || 0) }
  }
  return out
}

// Atomically increment one counter (views or likes) for an id and return the
// id's resulting { views, likes }. A script lock avoids lost updates under
// concurrent hits.
function bump_(id, which) {
  var lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    var sh = sheet_()
    var values = sh.getDataRange().getValues()
    var rowIndex = -1
    for (var r = 1; r < values.length; r++) {
      if (String(values[r][0] || '').trim() === id) {
        rowIndex = r
        break
      }
    }

    if (rowIndex === -1) {
      var views = which === 'views' ? 1 : 0
      var likes = which === 'likes' ? 1 : 0
      sh.appendRow([id, views, likes])
      return { views: views, likes: likes }
    }

    var colIndex = which === 'likes' ? 3 : 2 // 1-based: views=col2, likes=col3
    var next = Number(values[rowIndex][colIndex - 1] || 0) + 1
    sh.getRange(rowIndex + 1, colIndex).setValue(next)

    return {
      views: colIndex === 2 ? next : Number(values[rowIndex][1] || 0),
      likes: colIndex === 3 ? next : Number(values[rowIndex][2] || 0),
    }
  } finally {
    lock.releaseLock()
  }
}
