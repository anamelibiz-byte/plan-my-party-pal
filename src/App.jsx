import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TierProvider } from './context/TierContext';
import { PartyProvider } from './context/PartyContext';
import LandingPage from './pages/LandingPage';
import PartyPlanner from './PartyPlanner';
import RSVPPage from './pages/RSVPPage';
import UpgradeModal from './components/UpgradeModal';
import UpgradeSuccessBanner from './components/UpgradeSuccessBanner';

function App() {
  return (
    <BrowserRouter>
      <TierProvider>
        <PartyProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<PartyPlanner />} />
            <Route path="/rsvp/:partyId" element={<RSVPPage />} />
          </Routes>
          <UpgradeModal />
          <UpgradeSuccessBanner />
        </PartyProvider>
      </TierProvider>
    </BrowserRouter>
  );
}

export default App;
