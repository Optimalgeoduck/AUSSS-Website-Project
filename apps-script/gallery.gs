/**
 * AUSSS gallery — photo takedown endpoint (Google Apps Script web app)
 *
 * Stores a list of "removed" gallery photo paths. The public gallery reads
 * this list at page load and hides anything in it; the admin page
 * (/gallery/admin) adds/removes entries. No spreadsheet needed — the list
 * lives in Script Properties.
 *
 * All actions are GET requests so the browser can read the JSON response
 * across Apps Script's 302 → googleusercontent.com redirect (POST responses
 * aren't readable cross-origin; GET ones are). Mutating via GET is fine here:
 * the data is low-stakes and a shared admin key guards writes.
 *
 *   GET ?action=list                          → { ok, removed: [paths] }   (public)
 *   GET ?action=check&key=KEY                 → { ok }                      (validate key)
 *   GET ?action=add&path=PATH&key=KEY         → { ok, removed: [paths] }
 *   GET ?action=remove&path=PATH&key=KEY      → { ok, removed: [paths] }
 *
 * Deploy: see gallery.README.md.
 */

// CHANGE THIS to your own secret before deploying. It's the password the
// admin page asks for. Anyone with this key can hide/show photos, so keep it
// off public channels. It is never baked into the website bundle.
var ADMIN_KEY = 'change-me-to-a-long-random-string';

var PROP_KEY = 'GALLERY_REMOVALS';

function doGet(e) {
  var p = (e && e.parameter) || {};
  var action = String(p.action || 'list').toLowerCase();

  try {
    if (action === 'list') {
      return json({ ok: true, removed: getList() });
    }

    if (action === 'check') {
      return json({ ok: keyOk(p) });
    }

    if (action === 'add' || action === 'remove') {
      if (!keyOk(p)) return json({ ok: false, error: 'Wrong admin key' });
      var path = String(p.path || '').trim();
      if (!path) return json({ ok: false, error: 'Missing path' });

      var list = getList();
      if (action === 'add') {
        if (list.indexOf(path) === -1) list.push(path);
      } else {
        list = list.filter(function (x) { return x !== path; });
      }
      setList(list);
      return json({ ok: true, removed: list });
    }

    return json({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function keyOk(p) {
  return String(p.key || '') === ADMIN_KEY;
}

function getList() {
  var raw = PropertiesService.getScriptProperties().getProperty(PROP_KEY);
  if (!raw) return [];
  try {
    var parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function setList(list) {
  PropertiesService.getScriptProperties().setProperty(
    PROP_KEY,
    JSON.stringify(list)
  );
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
