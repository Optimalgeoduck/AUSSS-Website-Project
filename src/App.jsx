import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'

// Code-split non-home pages so the initial load only ships Home + Layout.
// /gallery in particular pulls in gsap, which we don't want in the main chunk.
const CommitteePage = lazy(() => import('./pages/CommitteePage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))
const IFMSAPage = lazy(() => import('./pages/IFMSAPage.jsx'))
const MerchPage = lazy(() => import('./pages/MerchPage.jsx'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'))
const MembersPage = lazy(() => import('./pages/MembersPage.jsx'))
const SocialPage = lazy(() => import('./pages/SocialPage.jsx'))
const ExchangePage = lazy(() => import('./pages/ExchangePage.jsx'))
const GalleryPage = lazy(() => import('./pages/GalleryPage.jsx'))
const GalleryAdminPage = lazy(() => import('./pages/GalleryAdminPage.jsx'))
const JoinPage = lazy(() => import('./pages/JoinPage.jsx'))

// Brand-coloured placeholder shown while a lazy chunk is in flight. Matches
// the dark hero so there's no white flash on inner-page navigation.
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-950">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-medical-light" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="*"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/committees/:slug" element={<CommitteePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/exchange" element={<ExchangePage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/gallery/admin" element={<GalleryAdminPage />} />
                <Route path="/gallery/:slug" element={<GalleryPage />} />
                <Route path="/join" element={<JoinPage />} />
                <Route path="/ifmsa" element={<IFMSAPage />} />
                <Route path="/merch" element={<MerchPage />} />
                <Route path="/merch/checkout" element={<CheckoutPage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/social" element={<SocialPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}
