/**
 * AUSSS merch orders — Google Apps Script Web App
 * ---------------------------------------------------------------------------
 * Bind this to a Google Sheet (Extensions → Apps Script), or use a
 * standalone script and set SPREADSHEET_ID below. Deployment:
 *
 *     Deploy → New deployment → Web app
 *       Execute as:        Me
 *       Who has access:    Anyone
 *
 * Copy the /exec URL into src/data/merchConfig.js (ORDERS_WEBAPP_URL).
 *
 * Request — POST with content-type "text/plain;charset=utf-8" (avoids the
 *           CORS preflight that text/plain bypasses, the body is JSON):
 *   {
 *     contact: { name, email, phone, isMember, year, notes },
 *     items: [{ productId, size, design, qty }],
 *     subtotal: number,
 *     paymentMethod: 'instapay' | 'telda' | 'vodafone',
 *     itemsSummary: string,         // already-formatted by the frontend
 *     screenshotBase64?: string,    // base64 string, no data: prefix
 *     screenshotFilename?: string,
 *     submittedAt: string,          // ISO from the browser
 *   }
 *
 * Response:
 *   { ok: true,  reference: 'AUSSS-XXXXX' }
 *   { ok: false, error: '...' }
 *
 * Sheet columns are listed in HEADERS below and auto-created on first run.
 * Screenshots land in Drive at
 *     /AUSSS Orders Receipts/YYYY-MM/{reference}-{filename}
 * and the row stores the public view link.
 */

// ── Config — edit these once after pasting the script ────────────────────

// Sheet ID. Leave '' if this script is bound to the sheet directly.
var SPREADSHEET_ID = ''

// Tab name. Auto-created with headers if absent.
var SHEET_NAME = 'Orders'

// Drive folder for receipt screenshots. Auto-created if missing. Inside it
// the script keeps a monthly sub-folder (YYYY-MM).
var RECEIPTS_FOLDER = 'AUSSS Orders Receipts'

// Where order-notification emails go. Set to '' to disable email sending
// (the order still lands in the sheet).
var TEAM_EMAIL = 'loreausss@gmail.com'

// ── Column layout — change here and re-add headers if you reshape it ─────
var HEADERS = [
  'Timestamp',
  'Reference',
  'Status',
  'Name',
  'Email',
  'Phone',
  'AUSSS Member',
  'LC (if non-member)',
  'Year / Status',
  'Payment Method',
  'Subtotal (EGP)',
  'Items',
  'Items (JSON)',
  'Receipt',
  'Notes',
  'Submitted At (client)',
]

// ── Helpers ──────────────────────────────────────────────────────────────

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

function generateReference_() {
  var t = Date.now().toString(36).toUpperCase().slice(-5)
  var r = Math.floor(Math.random() * 1000).toString()
  while (r.length < 3) r = '0' + r
  return 'AUSSS-' + t + r
}

function getSheet_() {
  var ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow(HEADERS)
    sheet.setFrozenRows(1)
    sheet
      .getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#06402B')
      .setFontColor('#ffffff')
  }
  return sheet
}

function getOrCreateFolder_(parent, name) {
  var iter = parent.getFoldersByName(name)
  return iter.hasNext() ? iter.next() : parent.createFolder(name)
}

function getReceiptsFolder_() {
  var root = DriveApp.getRootFolder()
  var parent = getOrCreateFolder_(root, RECEIPTS_FOLDER)
  var ym = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    'yyyy-MM',
  )
  return getOrCreateFolder_(parent, ym)
}

function inferMime_(filename) {
  var ext = String(filename || '').toLowerCase().split('.').pop()
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'heic') return 'image/heic'
  if (ext === 'gif') return 'image/gif'
  return 'image/jpeg'
}

function uploadReceipt_(base64, filename, reference) {
  if (!base64) return ''
  try {
    var bytes = Utilities.base64Decode(base64)
    var name = reference + '-' + (filename || 'receipt.jpg')
    var blob = Utilities.newBlob(bytes, inferMime_(filename), name)
    var file = getReceiptsFolder_().createFile(blob)
    file.setSharing(
      DriveApp.Access.ANYONE_WITH_LINK,
      DriveApp.Permission.VIEW,
    )
    return file.getUrl()
  } catch (e) {
    return 'UPLOAD_FAILED: ' + (e && e.message ? e.message : e)
  }
}

function sendNotification_(reference, payload, receiptUrl) {
  if (!TEAM_EMAIL) return
  try {
    var c = payload.contact || {}
    var subject =
      '[AUSSS Merch] New pre-order — ' +
      reference +
      ' (' +
      (payload.subtotal || 0) +
      ' EGP)'
    var lines = [
      'Reference:  ' + reference,
      'Submitted:  ' + (payload.submittedAt || new Date().toISOString()),
      '',
      'Customer:',
      '  Name:    ' + (c.name || '—'),
      '  Email:   ' + (c.email || '—'),
      '  Phone:   ' + (c.phone || '—'),
      '  Member:  ' + (c.isMember || '—') + (c.isMember === 'No' && c.lc ? ' (LC: ' + c.lc + ')' : ''),
      '  Year:    ' + (c.year || '—'),
      '',
      'Payment:    ' + (payload.paymentMethod || '—'),
      'Receipt:    ' + (receiptUrl || '—'),
      '',
      'Items:',
      payload.itemsSummary || '(none)',
      '',
      'Subtotal:   ' + (payload.subtotal || 0) + ' EGP',
    ]
    if (c.notes) {
      lines.push('', 'Notes:', c.notes)
    }
    MailApp.sendEmail(TEAM_EMAIL, subject, lines.join('\n'))
  } catch (e) {
    // Email failure must never block an order. Logger output is visible in
    // Apps Script → Executions.
    Logger.log('email failed: ' + (e && e.message ? e.message : e))
  }
}

// ── Web app entrypoints ─────────────────────────────────────────────────

function doGet(e) {
  // Health check, useful for confirming the deploy URL works in a browser.
  return json_({
    ok: true,
    message: 'AUSSS merch orders endpoint up',
  })
}

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents
    if (!raw) return json_({ ok: false, error: 'Empty body' })

    var payload
    try {
      payload = JSON.parse(raw)
    } catch (parseErr) {
      return json_({ ok: false, error: 'Invalid JSON body' })
    }
    if (!payload || typeof payload !== 'object') {
      return json_({ ok: false, error: 'Empty payload' })
    }

    var contact = payload.contact || {}
    if (!contact.name || !contact.email || !contact.phone) {
      return json_({ ok: false, error: 'Missing required contact fields' })
    }
    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return json_({ ok: false, error: 'Cart is empty' })
    }

    // Prefer the client-supplied reference so the buyer's success page,
    // the sheet row, the email, and the receipt filename all match. Fall
    // back to a server-generated one if the client didn't send one.
    var reference =
      (payload.reference && /^AUSSS-[A-Z0-9]{1,12}$/.test(payload.reference))
        ? payload.reference
        : generateReference_()
    var receiptUrl = uploadReceipt_(
      payload.screenshotBase64,
      payload.screenshotFilename,
      reference,
    )

    var sheet = getSheet_()
    sheet.appendRow([
      new Date(),
      reference,
      'new',
      contact.name || '',
      contact.email || '',
      contact.phone || '',
      contact.isMember || '',
      contact.isMember === 'No' ? contact.lc || '' : '',
      contact.year || '',
      payload.paymentMethod || '',
      Number(payload.subtotal || 0),
      payload.itemsSummary || '',
      JSON.stringify(payload.items || []),
      receiptUrl,
      contact.notes || '',
      payload.submittedAt || '',
    ])

    sendNotification_(reference, payload, receiptUrl)

    return json_({ ok: true, reference: reference })
  } catch (err) {
    return json_({
      ok: false,
      error: String(err && err.message ? err.message : err),
    })
  }
}
