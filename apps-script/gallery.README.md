# Gallery photo takedown — Google Apps Script web app

This lets the admin page (`/gallery/admin`) hide and restore gallery photos
**live for every visitor, without a redeploy**. The list of hidden photos is
stored by a tiny Apps Script web app; the public gallery reads it on load.

Until you deploy this and paste its URL into the site, the admin page falls
back to the export workflow (mark → download `galleryRemovals.js` → redeploy),
so nothing breaks in the meantime.

This is its own script — separate from the merch-orders one. ~5 minutes, once.

## 1. Create the script

Go to <https://script.google.com> → **New project**. Delete the default
`myFunction`, then paste the entire contents of [`gallery.gs`](./gallery.gs).

(No spreadsheet needed — the hidden-photo list lives in the script's own
storage.)

## 2. Set your admin key

At the top of the script, change:

```js
var ADMIN_KEY = 'change-me-to-a-long-random-string';
```

to a private password of your choosing (long + random is best). This is what
the admin page asks for before it lets anyone hide a photo. **It never gets
baked into the website** — only people you give it to can make changes.

Save (`Ctrl + S` / `⌘ + S`).

## 3. Deploy as a Web App

**Deploy → New deployment → ⚙ → Web app**

- **Description:** `AUSSS gallery takedown v1`
- **Execute as:** `Me`
- **Who has access:** `Anyone` (so the site can read the list without anyone
  logging in)
- **Deploy**

## 4. Authorize

First deploy shows the OAuth prompt → pick your account → "Google hasn't
verified this app" → **Advanced → Go to project → Allow**. It only asks for
permission to store its own script data — nothing about your Drive, mail, or
sheets.

## 5. Copy the Web app URL

Looks like `https://script.google.com/macros/s/AKfy…/exec`. Open it in a
browser tab — you should see `{"ok":true,"removed":[]}`. That's the live list
(empty to start). The deploy works.

## 6. Wire it into the site

In `src/data/galleryConfig.js`:

```js
export const GALLERY_WEBAPP_URL = 'https://script.google.com/macros/s/AKfy…/exec'
```

Rebuild + redeploy the site once
(`npm run build && npx --no-install netlify deploy --prod --dir=dist`).
**This is the only redeploy you need** — after it, hiding/restoring photos is
instant and never needs another build.

## 7. Use it

Visit `/gallery/admin`, enter your admin key, and click photos to hide them.
They vanish from the public gallery for everyone within seconds (visitors get
the fresh list on their next page load). Click again to restore.

## How it fits together

- **`galleryRemovals.js`** (in the repo) = permanent baseline, baked at build.
  Photos here show as 🔒 locked in the admin page. Good for things you want
  gone for good even if the backend is ever turned off.
- **The live list** (this script) = everything you hide from the admin page.
  Editable any time, no redeploy.
- The public gallery hides the **union** of both.
- The admin page's **"Copy as code"** button exports the current hidden list as
  `galleryRemovals.js` contents — paste it in to promote live removals into the
  permanent baseline whenever you like.

## Notes

- **Why GET for everything (even hide/restore)?** Apps Script POST responses
  can't be read by the browser across its redirect, but GET responses can — so
  using GET lets the admin page confirm each change and refresh the list. The
  admin key guards writes.
- **Security:** the key gates writes; reads are public (the hidden list isn't
  sensitive). The key lives only in the admin's browser session, never in the
  site bundle. Anyone with both the URL and the key can change the list, so
  treat the key like a password.
- **Editing later:** edit `gallery.gs` → **Deploy → Manage deployments → ✎ →
  New version → Deploy.** URL stays the same; nothing on the site changes.
- **Quotas:** free; well within Apps Script limits for this volume.
