import React, { useState, useMemo, useEffect } from 'react';
import { Users, CheckCircle2, XCircle, Clock, Copy, Check, Share2 } from 'lucide-react';

export default function RSVPManager({ partyData, rsvpId, onSetRsvpId }) {
  const [responses, setResponses] = useState([]);
  const [copied, setCopied] = useState(false);

  // Generate a simple party ID if none exists
  useEffect(() => {
    if (!rsvpId) {
      const id = `party-${Date.now().toString(36)}`;
      onSetRsvpId(id);
    }
  }, [rsvpId, onSetRsvpId]);

  // Load responses from localStorage (and/or API)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('pp_rsvp_responses') || '[]');
    const filtered = stored.filter(r => r.partyId === rsvpId);
    setResponses(filtered);
  }, [rsvpId]);

  const stats = useMemo(() => {
    const attending = responses.filter(r => r.attending);
    const declined = responses.filter(r => !r.attending);
    const totalAdults = attending.reduce((s, r) => s + (r.adultCount || 0), 0);
    const totalChildren = attending.reduce((s, r) => s + (r.childCount || 0), 0);
    return { attending: attending.length, declined: declined.length, totalAdults, totalChildren, total: totalAdults + totalChildren };
  }, [responses]);

  const rsvpLink = `${window.location.origin}/rsvp/${rsvpId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(rsvpLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="p-5 bg-indigo-50 rounded-2xl border-2 border-indigo-200">
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-indigo-500" size={24} />
        <h3 className="text-lg font-bold text-indigo-800">RSVP Manager</h3>
      </div>

      {/* Share Link */}
      <div className="mb-4 p-3 bg-white rounded-xl border border-indigo-100">
        <p className="text-sm font-bold text-gray-600 mb-2">Share this RSVP link with guests:</p>
        <div className="flex gap-2">
          <input type="text" readOnly value={rsvpLink}
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 truncate" />
          <button onClick={handleCopyLink}
            className="px-3 py-2 bg-indigo-500 text-white rounded-lg font-bold text-sm hover:bg-indigo-600 transition-all flex items-center gap-1">
            {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
          <CheckCircle2 className="text-green-500 mx-auto" size={20} />
          <p className="text-lg font-bold text-green-700">{stats.attending}</p>
          <p className="text-xs text-green-600">Attending</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-xl border border-red-200">
          <XCircle className="text-red-500 mx-auto" size={20} />
          <p className="text-lg font-bold text-red-700">{stats.declined}</p>
          <p className="text-xs text-red-600">Declined</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
          <Users className="text-blue-500 mx-auto" size={20} />
          <p className="text-lg font-bold text-blue-700">{stats.total}</p>
          <p className="text-xs text-blue-600">Total Guests</p>
        </div>
      </div>

      {/* Headcount breakdown */}
      {stats.total > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          {stats.totalAdults} adults + {stats.totalChildren} children = {stats.total} total guests
        </p>
      )}

      {/* Guest list */}
      {responses.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-bold text-gray-600">Guest List:</p>
          {responses.map((r, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${r.attending ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <div>
                <span className="font-semibold text-gray-800">{r.guestName}</span>
                {r.attending && <span className="text-xs text-gray-500 ml-2">{r.adultCount}A + {r.childCount}C</span>}
                {r.dietary && r.dietary.length > 0 && (
                  <span className="text-xs text-orange-600 ml-2">⚠️ {r.dietary.join(', ')}</span>
                )}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${r.attending ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {r.attending ? 'Attending' : 'Declined'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No RSVPs yet. Share the link above to start collecting responses!</p>
      )}
    </div>
  );
}
