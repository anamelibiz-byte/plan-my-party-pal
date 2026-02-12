import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Check, X, UserPlus, Download, Crown } from 'lucide-react';
import { useTier } from '../context/TierContext';
import { getMaxGuests } from '../config/tiers';

export default function GuestList({ partyData }) {
  const { userTier, requireFeature } = useTier();
  const maxGuests = getMaxGuests(userTier);
  const storageKey = `pp_guests_${partyData.childName || 'default'}`;
  const [guests, setGuests] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || []; } catch { return []; }
  });
  const [newName, setNewName] = useState('');

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(guests));
  }, [guests, storageKey]);

  const addGuest = () => {
    const name = newName.trim();
    if (!name) return;

    // Check guest limit for free tier
    if (maxGuests && guests.length >= maxGuests) {
      requireFeature('maxGuests');
      return;
    }

    setGuests(prev => [...prev, { name, rsvp: 'pending' }]);
    setNewName('');
  };

  const removeGuest = (idx) => {
    setGuests(prev => prev.filter((_, i) => i !== idx));
  };

  const setRsvp = (idx, status) => {
    setGuests(prev => prev.map((g, i) => i === idx ? { ...g, rsvp: status } : g));
  };

  const attending = guests.filter(g => g.rsvp === 'yes').length;
  const declined = guests.filter(g => g.rsvp === 'no').length;
  const pending = guests.filter(g => g.rsvp === 'pending').length;

  const downloadGuestList = () => {
    if (guests.length === 0) return;
    const statusLabel = { yes: 'Coming', no: "Can't Make It", pending: 'Waiting' };
    let text = `🎉 ${partyData.childName || 'Party'}'s Guest Invite List\n`;
    text += `────────────────────────────────────────\n\n`;
    text += `Total Invited: ${guests.length}\n`;
    text += `Coming: ${attending}  |  Can't Make It: ${declined}  |  Waiting: ${pending}\n\n`;
    text += `────────────────────────────────────────\n`;
    guests.forEach((g, i) => {
      text += `${i + 1}. ${g.name} — ${statusLabel[g.rsvp]}\n`;
    });
    text += `\n────────────────────────────────────────\nMade with PlanMyPartyPal.com\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${partyData.childName || 'party'}-guest-list.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isAtLimit = maxGuests && guests.length >= maxGuests;

  return (
    <div className="p-4 sm:p-5 bg-indigo-50 rounded-2xl border-2 border-indigo-200">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Users className="text-indigo-500" size={22} />
        <h3 className="text-lg font-bold text-indigo-800">Guest Invite List</h3>
        <span className="ml-auto text-sm text-gray-500 font-semibold">
          {guests.length} {maxGuests ? `/ ${maxGuests}` : ''} invited
        </span>
      </div>

      {maxGuests && isAtLimit && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
          <Crown className="text-amber-500 flex-shrink-0" size={18} />
          <p className="text-sm text-amber-700">
            <strong>Free plan limit reached.</strong> Upgrade to Pro for unlimited guests!
          </p>
        </div>
      )}

      {guests.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-green-50 rounded-xl border border-green-200">
            <p className="text-lg font-bold text-green-700">{attending}</p>
            <p className="text-xs text-green-600">Coming</p>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-xl border border-red-200">
            <p className="text-lg font-bold text-red-700">{declined}</p>
            <p className="text-xs text-red-600">Can't Make It</p>
          </div>
          <div className="text-center p-2 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-lg font-bold text-amber-700">{pending}</p>
            <p className="text-xs text-amber-600">Waiting</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addGuest()}
          placeholder="Add a child's name..."
          className="flex-1 min-w-0 px-3 py-2.5 border-2 border-indigo-200 rounded-xl text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
        <button onClick={addGuest} disabled={!newName.trim()}
          className="px-4 py-2.5 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all disabled:opacity-40 flex items-center gap-1 flex-shrink-0">
          <UserPlus size={16} /> Add
        </button>
      </div>

      {guests.length > 0 ? (
        <>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {guests.map((guest, i) => (
              <div key={i} className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                guest.rsvp === 'yes' ? 'bg-green-50 border-green-200' :
                guest.rsvp === 'no' ? 'bg-red-50 border-red-200' :
                'bg-white border-gray-200'
              }`}>
                <span className="flex-1 min-w-0 font-semibold text-gray-800 text-sm truncate">{guest.name}</span>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setRsvp(i, guest.rsvp === 'yes' ? 'pending' : 'yes')}
                    className={`p-1.5 rounded-lg transition-all ${guest.rsvp === 'yes' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'}`}
                    title="Coming"><Check size={14} /></button>
                  <button onClick={() => setRsvp(i, guest.rsvp === 'no' ? 'pending' : 'no')}
                    className={`p-1.5 rounded-lg transition-all ${guest.rsvp === 'no' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'}`}
                    title="Can't make it"><X size={14} /></button>
                  <button onClick={() => removeGuest(i)}
                    className="p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all"
                    title="Remove"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={downloadGuestList}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all no-print">
            <Download size={16} /> Download Guest List
          </button>
        </>
      ) : (
        <p className="text-sm text-gray-400 italic text-center py-3">Start adding kids you're planning to invite!</p>
      )}
    </div>
  );
}
