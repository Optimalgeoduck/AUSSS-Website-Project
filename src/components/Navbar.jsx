import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import CartButton from './CartButton.jsx'

// `to` may be a route ("/ifmsa") or a home-section hash ("/#about").
const LINKS = [
  { to: '/#about', label: 'About' },
  { to: '/exchange', label: 'Exchange' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/ifmsa', label: 'IFMSA' },
  { to: '/merch', label: 'Merch' },
  { to: '/social', label: 'Social' },
  { to: '/contact', label: 'Contact' },
]

// Catchy launch CTA for the magazine, shown as a highlighted pill.
const MAGAZINE_CTA = 'Check out our 1st AUSSS Magazine!'

function parseTo(to) {
  const [pathname, hash] = to.split('#')
  return { pathname: pathname || '/', hash: hash ? `#${hash}` : '' }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  // Inner pages have no dark hero behind the bar → always solid.
  const solid = scrolled || !isHome

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock background scroll while the mobile menu is open so the page
  // behind the drawer can't move under the touch gesture.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? 'border-b border-forest-600/20 bg-cream shadow-sm dark:border-white/10 dark:bg-forest-950'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container-prose flex h-24 items-center justify-between">
        <Link to="/" className="group flex items-center" aria-label="AUSSS home">
          {/* Black logo only when bar is solid AND light mode; white otherwise. */}
          <img
            src="/assets/brand/ausss-icon-black.png"
            alt="AUSSS, Ain Shams University Students' Scientific Society"
            className={`h-14 w-auto transition-opacity sm:h-16 ${
              solid ? 'block dark:hidden' : 'hidden'
            }`}
          />
          <img
            src="/assets/brand/ausss-icon-white.png"
            alt=""
            aria-hidden="true"
            className={`h-14 w-auto transition-opacity sm:h-16 ${
              solid ? 'hidden dark:block' : 'block'
            }`}
          />
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={parseTo(l.to)}
                className={`group relative text-sm font-medium transition-colors ${
                  solid
                    ? 'text-forest-900 hover:text-forest dark:text-white dark:hover:text-white'
                    : 'text-white hover:text-white'
                }`}
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-medical transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/magazine"
              className="whitespace-nowrap rounded-full bg-medical px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-medical/20 transition-colors duration-300 hover:bg-medical-light"
            >
              {MAGAZINE_CTA}
            </Link>
          </li>
          <li>
            <CartButton tone={solid ? 'solid' : 'transparent'} />
          </li>
          <li>
            <ThemeToggle tone={solid ? 'solid' : 'transparent'} />
          </li>
          <li>
            <Link
              to="/members"
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                solid
                  ? 'bg-forest-600 text-silver-light hover:bg-forest-500'
                  : 'bg-white text-forest hover:bg-silver-light'
              }`}
            >
              Members
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2 md:hidden">
          <CartButton tone={solid ? 'solid' : 'transparent'} className="h-9 w-9" />
          <ThemeToggle tone={solid ? 'solid' : 'transparent'} className="h-9 w-9" />
        <button
          onClick={() => setOpen((v) => !v)}
          className={solid ? 'text-forest dark:text-silver' : 'text-white'}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-t border-forest-600/10 bg-cream transition-[max-height] duration-500 md:hidden dark:border-white/10 dark:bg-forest-950 ${
          open ? 'max-h-[calc(100dvh-6rem)]' : 'max-h-0'
        }`}
      >
        <ul className="container-prose flex max-h-[calc(100dvh-6rem)] flex-col overflow-y-auto overscroll-contain py-4">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={parseTo(l.to)}
                className="block w-full border-b border-forest-600/10 py-4 text-left text-base font-medium text-forest-900 dark:border-white/10 dark:text-silver"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-4">
            <Link
              to="/magazine"
              className="block w-full rounded-full bg-medical py-3 text-center text-sm font-semibold text-white"
            >
              {MAGAZINE_CTA}
            </Link>
          </li>
          <li className="pt-3">
            <Link
              to="/members"
              className="block w-full rounded-full bg-forest-600 py-3 text-center text-sm font-semibold text-silver-light"
            >
              Members
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
