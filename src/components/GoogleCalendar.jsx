import { rgba, readableAccent } from '../lib/color.js'

const TZ = 'Africa/Cairo'

/**
 * Themed Google Calendar month embed.
 * `calendarId` accepts either a public calendar address
 * (e.g. "abc@group.calendar.google.com") or a full embed src URL.
 * When empty, shows an on-brand "coming soon" card so the layout
 * still looks complete before launch.
 */
export default function GoogleCalendar({
  calendarId,
  color = '#5B8DB8',
  title = 'Calendar',
}) {
  const accent = readableAccent(color)

  const src =
    calendarId && /^https?:\/\//i.test(calendarId)
      ? calendarId
      : calendarId
        ? `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
            calendarId,
          )}&mode=MONTH&ctz=${encodeURIComponent(
            TZ,
          )}&bgcolor=%23ffffff&showTitle=0&showPrint=0&showCalendars=0`
        : null

  return (
    <div
      className="overflow-hidden rounded-2xl border bg-forest-900/40 p-2 backdrop-blur-sm"
      style={{ borderColor: rgba(color, 0.35) }}
    >
      {src ? (
        <div className="relative w-full overflow-hidden rounded-xl bg-white">
          {/* Responsive month-view frame */}
          <iframe
            title={title}
            src={src}
            loading="lazy"
            className="h-[560px] w-full sm:h-[640px]"
            style={{ border: 0 }}
          />
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-xl px-6 py-20 text-center"
          style={{ background: rgba(color, 0.08) }}
        >
          <span
            className="grid h-14 w-14 place-items-center rounded-full"
            style={{ background: rgba(color, 0.18), color: accent }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" />
            </svg>
          </span>
          <p
            className="heading-serif mt-5 text-2xl text-white"
            style={{ color: accent }}
          >
            Calendar coming soon
          </p>
          <p className="mt-2 max-w-sm text-sm text-silver/60">
            A public Google Calendar will appear here in month view once it’s
            connected.
          </p>
        </div>
      )}
    </div>
  )
}
