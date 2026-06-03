// A clean inline PDF embed. Hides the browser PDF viewer's toolbar and side
// panel (#toolbar=0&navpanes=0 — honoured by Chromium's viewer) so the document
// sits flush in a branded frame. Uses <object> with an <iframe> fallback for
// the widest browser support, and a final text fallback if neither can render.
// fit: 'width' (default) scales the page to the frame width; 'page' fits a
// whole page within the frame (one page per view).
export default function PdfFrame({ src, title, heightClass = 'h-[82vh]', fit = 'width' }) {
  const view = `${src}#toolbar=0&navpanes=0&view=${fit === 'page' ? 'Fit' : 'FitH'}`
  return (
    <div className="reveal overflow-hidden rounded-2xl border border-white/10 bg-forest-800">
      <object
        data={view}
        type="application/pdf"
        aria-label={title}
        className={`w-full ${heightClass}`}
      >
        <iframe src={view} title={title} loading="lazy" className={`w-full ${heightClass}`} />
        <div className="p-8 text-center text-sm text-silver/60">
          Your browser can’t display the PDF inline.{' '}
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-medical-light underline-offset-2 hover:text-white hover:underline"
          >
            Open it in a new tab
          </a>
          .
        </div>
      </object>
    </div>
  )
}
