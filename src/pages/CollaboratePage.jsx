import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { PartyPopper, Calendar, Users, Cake, CheckCircle, XCircle, Loader } from 'lucide-react';
import Header from '../components/Header';
import Sprinkles from '../components/Sprinkles';

export default function CollaboratePage() {
  const { partyId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inviteId = searchParams.get('invite');

  const [loading, setLoading] = useState(true);
  const [partyData, setPartyData] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPartyData();
  }, [partyId]);

  const loadPartyData = async () => {
    if (!partyId) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/party/load?planId=${partyId}`);
      const result = await response.json();

      if (result.success && result.data) {
        setPartyData(result.data);
      } else {
        setError('Party not found');
      }
    } catch (err) {
      setError('Failed to load party details');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (action) => {
    const userEmail = localStorage.getItem('pp_user_email');

    if (!userEmail) {
      // Redirect to login/signup with return URL
      localStorage.setItem('pp_collab_invite', JSON.stringify({ partyId, inviteId, action }));
      navigate('/app?auth=required');
      return;
    }

    if (!inviteId) {
      setError('Invalid invitation');
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch('/api/collaboration/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteId,
          email: userEmail,
          action
        })
      });

      const result = await response.json();

      if (result.success) {
        if (action === 'accept') {
          // Load the party data into localStorage and redirect to planner
          if (partyData) {
            localStorage.setItem('pp_party_data', JSON.stringify(partyData.party_data));
            localStorage.setItem('pp_plan_id', partyId);
          }
          navigate('/app');
        } else {
          navigate('/');
        }
      } else {
        setError(result.error || 'Failed to process invitation');
      }
    } catch (err) {
      setError('Failed to process invitation');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <Sprinkles />
        <Header />
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-20">
          <div className="text-center">
            <Loader size={48} className="animate-spin text-purple-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading invitation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <Sprinkles />
        <Header />
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-20">
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
            <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
              <XCircle size={48} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Invitation Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold hover:shadow-xl transition-all"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const party = partyData?.party_data || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Sprinkles />
      <Header />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mb-4">
              <PartyPopper size={48} className="text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              You've Been Invited!
            </h1>
            <p className="text-gray-600">
              Someone wants you to help plan their party
            </p>
          </div>

          {/* Party Preview */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Cake size={24} className="text-purple-600" />
              Party Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {party.childName && (
                <div className="flex items-start gap-3">
                  <Users size={20} className="text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Child's Name</p>
                    <p className="font-semibold text-gray-800">{party.childName}</p>
                  </div>
                </div>
              )}

              {party.age && (
                <div className="flex items-start gap-3">
                  <Cake size={20} className="text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-semibold text-gray-800">{party.age} years old</p>
                  </div>
                </div>
              )}

              {party.date && (
                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(party.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {party.theme && (
                <div className="flex items-start gap-3">
                  <PartyPopper size={20} className="text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Theme</p>
                    <p className="font-semibold text-gray-800">{party.theme}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => handleResponse('decline')}
              disabled={processing}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <>
                  <XCircle size={20} />
                  Decline
                </>
              )}
            </button>
            <button
              onClick={() => handleResponse('accept')}
              disabled={processing}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Accept & Start Planning
                </>
              )}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            By accepting, you'll be able to help plan and manage this party
          </p>
        </div>
      </div>
    </div>
  );
}
