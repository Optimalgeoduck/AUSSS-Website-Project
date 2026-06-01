// AUSSS magazine — issues + articles (drives /magazine).
//
// Hybrid publishing model: every issue ships TWO ways at once —
//   1. in-site web ARTICLES   → fast, mobile-friendly, findable on Google
//   2. the original designed PDF → the faithful Canva/InDesign layout
//
// Publishing an issue: hand the maintainer the PDF; its text + images are
// extracted into `articles[]`, and the PDF + images are dropped into
//   public/assets/magazine/<issue id>/
// Until that's done an issue can ship with NO cover (a gradient placeholder is
// drawn instead) and a null `pdf` (the button shows "coming soon"), so nothing
// 404s while the page is still a draft.
//
// Article body is an ordered list of blocks the reader renders:
//   { type: 'p',     text }
//   { type: 'h2',    text }
//   { type: 'quote', text, cite? }
//   { type: 'image', src, alt?, caption? }

export const issues = [
  {
    id: 'issue-1',
    title: 'Issue 01',
    // Human-readable cover line; not a real date object (kept as a string so
    // it renders verbatim and never needs locale handling).
    date: 'Sample issue',
    blurb:
      'A placeholder issue that shows the full magazine flow — the cover shelf, an issue page listing its articles, the in-site article reader, and the “original PDF” slot. Replace it when the first real issue is ready.',
    cover: null, // null → gradient placeholder cover is drawn
    pdf: null, // null → "original PDF coming soon"; set to '/assets/magazine/issue-1/issue.pdf' when uploaded
    articles: [
      {
        slug: 'welcome-to-the-magazine',
        title: 'Welcome to the AUSSS Magazine',
        author: 'The Editorial Team',
        dek: 'How this page works, and what you can expect to read here each issue.',
        cover: null,
        body: [
          {
            type: 'p',
            text: 'This is a sample article. Each real article is published as a web page like this one — readable on any phone, instant to load, and findable on Google — while the original designed magazine stays one click away as a PDF.',
          },
          { type: 'h2', text: 'Two ways to read' },
          {
            type: 'p',
            text: 'Prefer the designed layout your committee laid out? Open the original PDF from the issue page. Prefer to read on the go? Everything is right here as web articles. Same content, two formats.',
          },
          {
            type: 'quote',
            text: 'Life Savers, Change Makers — one story at a time.',
            cite: 'AUSSS',
          },
          {
            type: 'p',
            text: 'When you send the first issue’s PDF, its articles and images will replace this placeholder, and the “original PDF” button will link to the file.',
          },
          {
            type: 'image',
            src: '/assets/magazine/issue-1/sample.jpg',
            alt: 'Sample article image',
            caption:
              'Article images render like this, with an optional caption. (This placeholder has no file yet.)',
          },
        ],
      },
      {
        slug: 'how-issues-are-published',
        title: 'How an issue gets published',
        author: 'The Editorial Team',
        dek: 'From a finished PDF to live web articles, in a few steps.',
        cover: null,
        body: [
          { type: 'h2', text: 'You design as usual' },
          {
            type: 'p',
            text: 'Lay out the issue however you like and export a PDF. Nothing about your design workflow changes.',
          },
          { type: 'h2', text: 'We turn it into web articles' },
          {
            type: 'p',
            text: 'The PDF’s text and images are pulled out and laid into article pages like this one, grouped under the issue, and the PDF is kept alongside for anyone who wants the designed version.',
          },
          {
            type: 'p',
            text: 'Readers get the best of both: a fast, shareable web read and the faithful designed PDF.',
          },
        ],
      },
    ],
  },
]

// --- Lookups used by the magazine routes --------------------------------
export const issueById = (id) => issues.find((i) => i.id === id)

export const articleOf = (issue, slug) =>
  issue ? issue.articles.find((a) => a.slug === slug) : undefined
