import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TierProvider } from './context/TierContext';
import { PartyProvider } from './context/PartyContext';
import PartyPlanner from './PartyPlanner';
import RSVPPage from './pages/RSVPPage';
import UpgradeModal from './components/UpgradeModal';

function App() {
  return (
    <BrowserRouter>
      <TierProvider>
        <PartyProvider>
          <Routes>
            <Route path="/" element={<PartyPlanner />} />
            <Route path="/rsvp/:partyId" element={<RSVPPage />} />
          </Routes>
          <UpgradeModal />
        </PartyProvider>
      </TierProvider>
    </BrowserRouter>
  );
}

export default App;
