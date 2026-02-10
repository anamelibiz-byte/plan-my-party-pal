import React, { useState, useEffect } from 'react';
import { Cake } from 'lucide-react';
import RSVPForm from '../components/RSVPForm';

export default function RSVPPage() {
  const [partyId, setPartyId] = useState(null);
  const [partyData, setPartyData] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/rsvp\/(.+)/);
    if (match) setPartyId(match[1]);

    // Try to load party data from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('pp_party_data'));
      if (stored) setPartyData(stored);
    } catch {}
  }, []);

  if (!partyId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <Cake className="text-pink-400 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-gray-800">Party Not Found</h1>
          <p className="text-gray-500 mt-2">This RSVP link doesn't seem to be valid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-pink-400 to-rose-400 p-3 rounded-2xl shadow-lg inline-block rotate-12 mb-4">
            <Cake className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            You're Invited!
          </h1>
        </div>
        <RSVPForm partyId={partyId} partyData={partyData} />
      </div>
    </div>
  );
}
