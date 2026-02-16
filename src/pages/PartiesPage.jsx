import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader, PartyPopper, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Sprinkles from '../components/Sprinkles';
import PartyCard from '../components/PartyCard';
import { listUserParties, deleteParty, loadPartyById } from '../utils/partySync';
import { useToast } from '../context/ToastContext';

export default function PartiesPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('updated'); // 'updated' | 'date' | 'name'
  const [userEmail, setUserEmail] = useState(null);
  const [activePlanId, setActivePlanId] = useState(null);

  useEffect(() => {
    // Check authentication
    const email = localStorage.getItem('pp_user_email');
    const guestMode = localStorage.getItem('pp_guest_mode') === 'true';

    if (!email || guestMode) {
      navigate('/app?auth=required');
      return;
    }

    setUserEmail(email);
    setActivePlanId(localStorage.getItem('pp_plan_id'));
  }, [navigate]);

  useEffect(() => {
    if (userEmail) {
      loadParties();
    }
  }, [userEmail]);

  const loadParties = async () => {
    setLoading(true);
    const result = await listUserParties(userEmail);

    if (result.success) {
      setParties(result.parties || []);
    } else {
      showToast('Failed to load parties', 'error');
    }

    setLoading(false);
  };

  const handleLoadParty = async (planId) => {
    // Load party data
    const partyData = await loadPartyById(planId);

    if (partyData) {
      // Save to localStorage
      localStorage.setItem('pp_party_data', JSON.stringify(partyData.party_data));
      localStorage.setItem('pp_plan_id', partyData.id);

      showToast('Party loaded successfully', 'success');
      navigate('/app');
    } else {
      showToast('Failed to load party', 'error');
    }
  };

  const handleDeleteParty = async (planId) => {
    const result = await deleteParty(userEmail, planId);

    if (result.success) {
      showToast('Party deleted', 'success');
      // Remove from list
      setParties(prev => prev.filter(p => p.id !== planId));

      // If deleted party was active, clear active state
      if (planId === activePlanId) {
        localStorage.removeItem('pp_plan_id');
        setActivePlanId(null);
      }
    } else {
      showToast('Failed to delete party', 'error');
    }
  };

  const getSortedParties = () => {
    const sorted = [...parties];

    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(b.date) - new Date(a.date);
        });
      case 'name':
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'updated':
      default:
        return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
  };

  if (!userEmail) return null;

  return (
    <>
      <Sprinkles />
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/app')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to planner
            </button>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">My Parties</h1>
                <p className="text-gray-600">
                  {parties.length} {parties.length === 1 ? 'party' : 'parties'} saved
                </p>
              </div>

              <button
                onClick={() => navigate('/app')}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                Start New Party
              </button>
            </div>
          </div>

          {/* Sort controls */}
          {parties.length > 0 && (
            <div className="mb-6 flex items-center gap-3">
              <span className="text-sm text-gray-600 font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none text-sm"
              >
                <option value="updated">Recently Updated</option>
                <option value="date">Party Date</option>
                <option value="name">Name</option>
              </select>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader className="animate-spin text-pink-500" size={48} />
            </div>
          )}

          {/* Empty state */}
          {!loading && parties.length === 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <PartyPopper className="mx-auto text-gray-300 mb-4" size={64} />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No saved parties yet</h2>
              <p className="text-gray-600 mb-6">
                Start planning your first party and save it to access it anytime!
              </p>
              <button
                onClick={() => navigate('/app')}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Start Planning
              </button>
            </div>
          )}

          {/* Parties grid */}
          {!loading && parties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSortedParties().map(party => (
                <PartyCard
                  key={party.id}
                  party={party}
                  isActive={party.id === activePlanId}
                  onLoad={handleLoadParty}
                  onDelete={handleDeleteParty}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
