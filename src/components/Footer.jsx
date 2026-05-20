import { Link } from 'react-router-dom'
import { socials } from '../data/society.js'
import SocialIcon from './SocialIcon.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-forest-950 py-14">
      <div className="container-prose">
        <div className="flex flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <Link to="/" className="flex items-center">
              <img
                src="/assets/brand/ausss-horizontal-white.png"
                alt="AUSSS, Ain Shams University Students' Scientific Society"
                className="h-24 w-auto"
              />
            </Link>
            <p className="heading-serif text-base text-silver/75">
              Life Savers, Change Makers
            </p>
            <div className="mt-1 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-silver/70 transition-colors hover:border-medical hover:text-white"
                >
                  <SocialIcon name={s.key} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-silver/70">
            <Link to={{ pathname: '/', hash: '#about' }} className="transition-colors hover:text-white">About</Link>
            <Link to={{ pathname: '/', hash: '#board' }} className="transition-colors hover:text-white">Leadership</Link>
            <Link to={{ pathname: '/', hash: '#officials' }} className="transition-colors hover:text-white">Committees</Link>
            <Link to="/merch" className="transition-colors hover:text-white">Merch</Link>
            <Link to="/ifmsa" className="transition-colors hover:text-white">IFMSA</Link>
            <Link to="/social" className="transition-colors hover:text-white">Social</Link>
            <Link to="/contact" className="transition-colors hover:text-white">Contact</Link>
            <Link to="/members" className="transition-colors hover:text-white">Members</Link>
            <a
              href="/assets/docs/AUSSS-Constitution-and-Bylaws.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Constitution
            </a>
            <Link to="/join" className="transition-colors hover:text-white">Join</Link>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center gap-5 border-t border-white/10 pt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-silver/40">
            An autonomous affiliate of
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            <a
              href="https://www.ifmsa-egypt.org.eg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="IFMSA-Egypt"
            >
              <img
                src="/assets/ifmsa/ifmsa-egypt-horizontal-white.png"
                alt="IFMSA-Egypt"
                className="h-10 w-auto opacity-60 transition-opacity hover:opacity-100 sm:h-12"
              />
            </a>
            <a
              href="https://ifmsa.org"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="IFMSA, International Federation of Medical Students' Associations"
            >
              <img
                src="/assets/ifmsa/ifmsa-horizontal-white.png"
                alt="IFMSA"
                className="h-9 w-auto opacity-60 transition-opacity hover:opacity-100 sm:h-11"
              />
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 text-center text-xs text-silver/40">
          © {new Date().getFullYear()} AUSSS · Faculty of Medicine, Ain Shams
          University · Cairo, Egypt
        </div>
      </div>
    </footer>
  )
}
