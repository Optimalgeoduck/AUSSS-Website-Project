// AUSSS magazine — a single edition, read in-page as a page-flipping book
// (drives /magazine).
//
// Publishing the edition:
//   1. Rasterise the source PDF to web-sized page images by running
//        _source/build-magazine.mjs
//      (writes public/assets/magazine/issue-1/pages/NNN.jpg). Set `pages.count`
//      below to the number it reports. The page flips through these images —
//      no big PDF download, no client-side pdf.js.
//   2. (Optional) `download` is a full-quality copy hosted off-repo (e.g. a
//      Google Drive link) for the "Download" button.
//   3. (Optional) `canva` keeps an "Open on Canva" link to the live design.
//   4. (Optional) point `cover` at a cover image (the top-left thumbnail).
//
// While `pages` and `canva` are both empty the page shows a placeholder, and
// `cover: null` draws a gradient cover, so nothing 404s while it's a draft.

export const magazine = {
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
    'https://drive.google.com/file/d/1PuSttZynpiFCy7R5td61qY-OO8Nbz015/view',
  // Canva "view" share link, kept as an "Open on Canva" fallback.
  canva: 'https://www.canva.com/design/DAHGTEatDDQ/0BPis3tFKLYKp4OCFfUVXw/view',
  // Optional aspect ratio (height ÷ width) for the Canva fallback frame.
  aspect: null,
}
