import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import CommitteePage from './pages/CommitteePage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import IFMSAPage from './pages/IFMSAPage.jsx'
import MerchPage from './pages/MerchPage.jsx'
import MembersPage from './pages/MembersPage.jsx'
import SocialPage from './pages/SocialPage.jsx'
import ExchangePage from './pages/ExchangePage.jsx'
import ActivitiesPage from './pages/ActivitiesPage.jsx'
import JoinPage from './pages/JoinPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/committees/:slug" element={<CommitteePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/exchange" element={<ExchangePage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/ifmsa" element={<IFMSAPage />} />
        <Route path="/merch" element={<MerchPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
