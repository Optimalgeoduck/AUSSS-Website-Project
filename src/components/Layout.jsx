import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'
import BackButton from './BackButton.jsx'
import ScrollManager from './ScrollManager.jsx'
import CartDrawer from './CartDrawer.jsx'
import { useCartDrawerOpen, closeCartDrawer } from '../lib/cart.js'
import usePageviews from '../hooks/usePageviews.js'

export default function Layout() {
  usePageviews()
  const cartOpen = useCartDrawerOpen()
  return (
    <div className="min-h-screen bg-cream dark:bg-forest-950">
      <ScrollManager />
      <Navbar />
      <BackButton />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <CartDrawer open={cartOpen} onClose={closeCartDrawer} />
    </div>
  )
}
