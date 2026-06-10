import useMediaQuery from '../hooks/useMediaQuery.js'
import Aurora from './Aurora.jsx'

// Brand-tinted Aurora backdrop shared across the gallery pages (index hero +
// album subpages). Reduce-motion safe, renders nothing when the user prefers
// reduced motion. Fills its nearest positioned ancestor; pass `className` to
// tweak placement/opacity per page.
export default function GalleryAurora({
  className = '',
  opacityClass = 'opacity-90',
  colorStops = ['#0a5c3e', '#5B8DB8', '#8FB4D4'],
  amplitude = 1.0,
  blend = 0.5,
  speed = 0.4,
}) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  if (reduceMotion) return null
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 ${opacityClass} ${className}`}
      aria-hidden="true"
    >
      <Aurora colorStops={colorStops} amplitude={amplitude} blend={blend} speed={speed} />
    </div>
  )
}
