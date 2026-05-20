import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'
import BackButton from './BackButton.jsx'
import ScrollManager from './ScrollManager.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen bg-cream">
      <ScrollManager />
      <Navbar />
      <BackButton />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
