// AUSSS magazine editions, each read in-page as a page-flipping book
// (drives /magazine).
//
// ── Multiple issues ──────────────────────────────────────────────────────────
// Issues live in the `issues` array below, NEWEST FIRST. The page shows the
// latest published issue by default and, once there are two or more published
// issues, shows a small issue switcher. Adding a new edition = prepend a new
// object to `issues` (and build its page images — see the runbook / step 1).
//
// Publishing an edition:
//   1. Rasterise the source PDF to web-sized page images by running
//        node _source/build-magazine.mjs <issue-id> "<path-to.pdf>"
//      e.g.  node _source/build-magazine.mjs issue-7 "C:/…/Vol7.pdf"
//      (writes public/assets/magazine/<issue-id>/pages/NNN.jpg). Set
//      `pages.count` on that issue to the number it reports.
//   2. (Optional) `download` is a full-quality copy hosted off-repo (e.g. a
//      Google Drive link) for the "Download" button.
//   3. (Optional) `canva` keeps an "Open on Canva" link to the live design.
//   4. (Optional) point `cover` at a cover image (the top-left thumbnail),
//      e.g. /assets/magazine/<issue-id>/cover.jpg.
//
// A "draft" issue (no `pages.count` and no `canva`) is treated as UNPUBLISHED:
// it never appears in the switcher and never renders, so it's safe to scaffold
// an entry here before its images/links exist — nothing 404s.

// The current (published) edition — unchanged from the original single issue.
const issueSix = {
  id: 'issue-1',
  title: 'The Story of Origin, Vol 6',
  // Human-readable cover line; kept as a string so it renders verbatim.
  date: 'A CBSD production',
  blurb:
    'The sixth volume of the AUSSS Magazine. Read it in full below or download it, and don’t forget to share it with your friends.',
  cover: '/assets/magazine/issue-1/cover.jpg',
  // Web-sized page images flipped through in-page (built from the full-quality
  // PDF by _source/build-magazine.mjs).
  pages: {
    base: '/assets/magazine/issue-1/pages',
    count: 30,
    pad: 3, // zero-padding in the filenames, e.g. 001.jpg
    ext: 'jpg',
  },
  // Full-quality copy for the Download button (hosted off-repo).
  download:
    'https://drive.google.com/file/d/17zMEOGekcoC09X4NDcgBxFlgaA-FiXuw/view',
  // Canva "view" share link, kept as an "Open on Canva" fallback.
  canva: 'https://www.canva.com/design/DAHGTEatDDQ/0BPis3tFKLYKp4OCFfUVXw/view',
  // Optional aspect ratio (height ÷ width) for the Canva fallback frame.
  aspect: null,
}

// The latest (published) edition — Vol 7, "Summer". Built from
// _source/Summer volume 7.pdf into public/assets/magazine/issue-2/pages via
// build-magazine.mjs. Because it's prepended (newest first) it's the default
// edition on /magazine, with Vol 6 available in the issue switcher.
// (No off-repo `download` link yet — the Download button stays hidden until one
// is added; the flipbook + "Open on Canva" fallback still work.)
const issueSeven = {
  id: 'issue-2',
  title: 'Summer',
  date: 'Volume 7 · A CBSD production',
  blurb:
    'The seventh volume of the AUSSS Magazine. Read it in full below or download it, and don’t forget to share it with your friends.',
  cover: '/assets/magazine/issue-2/cover.jpg', // falls back to a gradient if missing
  pages: {
    base: '/assets/magazine/issue-2/pages',
    count: 23, // built from _source/Summer volume 7.pdf (build-magazine.mjs)
    pad: 3,
    ext: 'jpg',
  },
  download: '', // TODO: off-repo full-quality link (Google Drive, etc.), else the Download button hides
  canva: 'https://canva.link/buxysnx205xfisq',
  aspect: null,
}

// Newest first. When issueSeven is published it becomes the default edition.
export const issues = [issueSeven, issueSix]

// An issue is "published" (visible) once it has flipbook pages OR a Canva embed.
export function isPublished(issue) {
  return Boolean(issue && (issue.pages?.count || issue.canva))
}

export const publishedIssues = issues.filter(isPublished)

// Look up one issue by id (e.g. for the engagement counters / deep links).
export function getIssue(id) {
  return issues.find((i) => i.id === id) || null
}

// Back-compat default: the latest published edition. MagazinePage renders this
// when no specific issue is selected, so single-issue behaviour is unchanged.
export const magazine = publishedIssues[0] || null
