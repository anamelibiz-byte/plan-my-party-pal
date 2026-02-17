import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { TierProvider } from './context/TierContext';
import { PartyProvider } from './context/PartyContext';
import { ToastProvider } from './context/ToastContext';
import LandingPage from './pages/LandingPage';
import PartyPlanner from './PartyPlanner';
import AccountPage from './pages/AccountPage';
import RSVPPage from './pages/RSVPPage';
import AdminPage from './pages/AdminPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PasswordResetPage from './pages/PasswordResetPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import PartiesPage from './pages/PartiesPage';
import CollaboratePage from './pages/CollaboratePage';
import VendorMarketplace from './components/VendorMarketplace';
import InstallPrompt from './components/InstallPrompt';
import UpgradeModal from './components/UpgradeModal';
import UpgradeSuccessBanner from './components/UpgradeSuccessBanner';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SongPage from './pages/SongPage';
import SongBuilderPage from './pages/SongBuilderPage';
import SongResultPage from './pages/SongResultPage';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ToastProvider>
          <TierProvider>
            <PartyProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app" element={<PartyPlanner />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/rsvp/:partyId" element={<RSVPPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/reset-password-form" element={<PasswordResetPage />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/parties" element={<PartiesPage />} />
                <Route path="/collaborate/:partyId" element={<CollaboratePage />} />
                <Route path="/vendors" element={<VendorMarketplace />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/song" element={<SongPage />} />
                <Route path="/song/build" element={<SongBuilderPage />} />
                <Route path="/song/result" element={<SongResultPage />} />
              </Routes>
              <UpgradeModal />
              <UpgradeSuccessBanner />
              <InstallPrompt />
            </PartyProvider>
          </TierProvider>
        </ToastProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
