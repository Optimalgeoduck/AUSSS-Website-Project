# Membership lookup — switching from interim Excel to the live Google Sheet

The Members page (`/members`) already speaks to **both** data sources. Right
now it uses the interim hashed snapshot built from the Excel file. When you
have access to the Google account that owns the membership Sheet, do this
**once** to go live — no code changes from you, just one URL.

## 1. Open the script editor
Open the membership Google Sheet → **Extensions → Apps Script**.

## 2. Paste the script
Delete the default `myFunction` and paste the entire contents of
[`Code.gs`](./Code.gs). It's bound to that Sheet, so it already knows where
the data is. (If you instead create a standalone script, set
`SPREADSHEET_ID` at the top of `Code.gs` to the Sheet's id.)

## 3. Deploy as a Web App
**Deploy → New deployment → ⚙ → Web app**
- **Execute as:** `Me`  (lets it read the Sheet)
- **Who has access:** `Anyone`  (so the site can call it without users logging in)
- **Deploy**

## 4. Authorize
First deploy prompts authorization → choose your account →
“Google hasn't verified this app” → **Advanced → Go to project → Allow**.
It only requests permission to read this spreadsheet.

## 5. Copy the Web app URL
It looks like `https://script.google.com/macros/s/AKfy…/exec`.

## 6. Flip the switch
In `src/data/membershipConfig.js`:
```js
export const SOURCE = 'webapp'
export const WEBAPP_URL = 'https://script.google.com/macros/s/AKfy…/exec'
```
Rebuild/redeploy the site. Done — lookups are now live from the Sheet, and
editing the Sheet updates results instantly (no rebuilds).

## Notes
- **Lookup is by name or email.** Email is matched first (unique); name is
  the fallback. If more than one member shares the given name it returns
  `multiple:true` (no data) and the site asks them to contact you. There is no
  endpoint that returns the list. After this works you can set the Sheet back
  to private — the script still reads it because it “executes as you”.
- **Editing the script later:** Deploy → Manage deployments → ✎ → Version:
  *New version* → Deploy. The URL stays the same.
- **Normalisation must stay in sync:** `norm()` in `Code.gs`,
  `normalize()` in `src/lib/membership.js`, and the generator must remain
  byte-identical, or hashes/matches won't line up.
- **Cost:** free, well within Apps Script quotas for this volume.
