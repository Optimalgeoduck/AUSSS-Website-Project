# Officer self-service editor — setup

`officers.gs` is the backend that lets each Team-of-Officials member log in and
edit **their own committee page** (photo, tagline, bio, "what we do", and an
optional members list). Edits go live for every visitor with no redeploy.

Until `OFFICERS_WEBAPP_URL` is set in `src/data/officersConfig.js`, the feature
is dormant: committee pages show the static `society.js` content and `/login`
reports the editor isn't set up. The site builds and deploys fine either way.

## Quick start — use the ready-made sheet

A pre-filled workbook for the current TO + EB already exists at:

```
_source/officer-setup/AUSSS-officer-accounts.xlsx     ← import this
_source/officer-setup/AUSSS-officer-credentials.csv   ← temp passwords to hand out
```

It already has both tabs, all 16 accounts (committee officers, the 4 EB
members with `all` access, and one `dev` account), and **passwords hashed** —
so you can skip the manual hashing in step 3. To use it:

1. Upload `AUSSS-officer-accounts.xlsx` to Google Drive → **Open with Google
   Sheets** (this keeps both tabs).
2. Do the deploy in step 2 below, binding the script to that sheet.
3. Give each person their **temp password** from the credentials CSV (they log
   in with their email + that password). See "Resetting a password" below to
   change one.

> The CSV holds plaintext temp passwords — share them privately and delete it
> afterwards. Both files live under `_source/` which is git-ignored, so they're
> never committed. Re-run `node _source/officer-setup/gen.mjs` to regenerate.

If you'd rather build the sheet by hand, follow steps 1–3.

## 1. Create the Google Sheet

Make a new Google Sheet with **two tabs**, named exactly:

**`Accounts`** — one row per person. Row 1 is a header row. Columns:

| A: email | B: passwordHash | C: salt | D: slug | E: displayName | F: role | G: scope |
|----------|-----------------|---------|---------|----------------|---------|----------|
| reem@example.com | (step 3) | (step 3) | scope | Reem Serry | LEO-Out | committee |
| president@example.com | (step 3) | (step 3) |  | Amr Hesham | President | all |
| dev@example.com | (step 3) | (step 3) |  | Developer | Developer | dev |

- **slug** — for a committee officer, the last part of their committee URL
  `/committees/<slug>` (e.g. `scope`, `score`, `scome`, `scoph`, `scorp`,
  `scora`, `psd`, `pnsd`, `cbsd`, `rsd`). Lower-case. Leave **blank** for EB/dev.
- **scope** — what the account may edit:
  - `committee` (or blank) → only the committee in column D
  - `all` → every committee (Executive Board)
  - `dev` → everything (developer)

**`Overrides`** — written by the script. Create the tab with a header row only:

| A: slug | B: json | C: updatedBy | D: updatedAt |
|---------|---------|--------------|--------------|

## 2. Add the script & deploy

1. In the Sheet: **Extensions → Apps Script**.
2. Paste the contents of `officers.gs`. Save.
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorise when prompted (it needs Sheets + Drive to store photos).
5. Copy the **`/exec`** URL into `src/data/officersConfig.js`:
   ```js
   export const OFFICERS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfy.../exec'
   ```
6. Commit + deploy the site.

## 3. Seed an account (set each officer's password)

Passwords are stored **hashed**, never in plain text. For each officer:

1. In the Apps Script editor open `officers.gs` and find `computeHash()`.
2. Set `password` to their password and `salt` to any random string (a
   different one per officer is best).
3. **Run → `computeHash`**, then open **View → Logs**.
4. Copy the logged `salt` into column **C** and `passwordHash` into column
   **B** of that officer's row in the `Accounts` sheet. Fill in their email
   (A), slug (D), display name (E), and role (F).

The officer then signs in at **`/login`** with their email + the password you
chose, and edits their committee at **`/account`**.

### Changing / resetting a password (easiest)

Open the bound Google Sheet — there's an **"AUSSS" menu** → **"Set / reset a
password"**. Type the account's email and the new password; it rewrites the
hash + salt for you. (If the menu isn't there yet, you added the script before
this feature — re-paste `officers.gs`, reload the sheet, and approve the
one-time authorisation.)

Other ways: edit the `email`/`newPassword` vars in `setPassword()` and Run it,
or recompute by hand with `computeHash()`. There's no self-service reset for
officers — an admin sets passwords. A changed password takes effect on the next
login; an already-issued session lasts until it expires (7 days).

## How it works (for reference)

- `GET ?action=overrides` → public map `{ slug: {tagline, about[], whatWeDo[], photo, membersEnabled, members[]} }`, merged over `society.js` by committee pages.
- `GET ?action=login&email=&password=` → `{ ok, token, slug, name }` (token valid 7 days).
- `GET ?action=validate&token=` → re-checks a remembered token.
- `POST {action:'save', token, fields}` (no-cors, `text/plain`) → validates the
  token, uploads any new photos (sent as `data:` URIs) to Drive
  `AUSSS Officer Photos/<slug>/`, caps members at 10, and writes the override.
  The browser can't read a cross-origin POST reply, so the client re-fetches
  `?action=overrides` afterwards to confirm.

## Security notes

Appropriate for ~10 officers editing their own bios — **not** bank-grade. A
token only ever lets its holder edit the **one committee** tied to their
account (`token.slug`). There's no email verification or password reset (you
re-seed a hash to reset). For stronger auth, Netlify Identity is the upgrade
path. Keep the Accounts sheet private.
