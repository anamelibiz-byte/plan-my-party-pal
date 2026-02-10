import React, { useState } from 'react';
import { Send, CheckCircle2, UserPlus, Users } from 'lucide-react';

const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Egg-Free', 'Kosher', 'Halal',
];

export default function RSVPForm({ partyId, partyData, onSubmit }) {
  const [form, setForm] = useState({
    guestName: '',
    attending: null,
    adultCount: 1,
    childCount: 0,
    dietary: [],
    dietaryOther: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.guestName || form.attending === null) return;
    setStatus('loading');

    const payload = { ...form, partyId, submittedAt: new Date().toISOString() };

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus('success');
        if (onSubmit) onSubmit(payload);
      } else throw new Error();
    } catch {
      // Save locally as fallback
      const existing = JSON.parse(localStorage.getItem('pp_rsvp_responses') || '[]');
      existing.push(payload);
      localStorage.setItem('pp_rsvp_responses', JSON.stringify(existing));
      setStatus('success');
      if (onSubmit) onSubmit(payload);
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center p-8 bg-green-50 rounded-2xl border-2 border-green-200">
        <CheckCircle2 className="text-green-500 mx-auto mb-3" size={48} />
        <h3 className="text-xl font-bold text-green-700">Thank You!</h3>
        <p className="text-green-600 mt-1">
          {form.attending ? 'We can\'t wait to see you at the party!' : 'We\'ll miss you! Thanks for letting us know.'}
        </p>
      </div>
    );
  }

  const toggleDietary = (d) => {
    setForm(prev => ({
      ...prev,
      dietary: prev.dietary.includes(d) ? prev.dietary.filter(x => x !== d) : [...prev.dietary, d],
    }));
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-pink-200 p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-5">
        <UserPlus className="text-pink-500" size={28} />
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {partyData?.childName ? `${partyData.childName}'s Party RSVP` : 'Party RSVP'}
          </h3>
          {partyData?.theme && <p className="text-sm text-gray-500">{partyData.theme} Theme • {partyData.date || 'TBD'}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Your Name *</label>
          <input type="text" value={form.guestName} onChange={e => setForm(p => ({ ...p, guestName: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none" placeholder="Jane Smith" required />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Will you be attending? *</label>
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map(val => (
              <button key={String(val)} type="button" onClick={() => setForm(p => ({ ...p, attending: val }))}
                className={`p-3 rounded-xl font-bold text-sm border-2 transition-all ${form.attending === val
                  ? (val ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-50 border-red-400 text-red-700')
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                {val ? '🎉 Yes, we\'ll be there!' : '😢 Sorry, can\'t make it'}
              </button>
            ))}
          </div>
        </div>

        {form.attending && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Adults</label>
                <input type="number" min="0" max="10" value={form.adultCount}
                  onChange={e => setForm(p => ({ ...p, adultCount: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Children</label>
                <input type="number" min="0" max="10" value={form.childCount}
                  onChange={e => setForm(p => ({ ...p, childCount: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Dietary Restrictions</label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map(d => (
                  <button key={d} type="button" onClick={() => toggleDietary(d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${form.dietary.includes(d)
                      ? 'bg-orange-100 border-orange-400 text-orange-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                    {d}
                  </button>
                ))}
              </div>
              <input type="text" value={form.dietaryOther}
                onChange={e => setForm(p => ({ ...p, dietaryOther: e.target.value }))}
                className="w-full mt-2 px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:border-rose-400 outline-none"
                placeholder="Other allergies or restrictions..." />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Message (optional)</label>
          <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 outline-none resize-none h-20"
            placeholder="Can't wait to celebrate!" />
        </div>

        <button type="submit" disabled={!form.guestName || form.attending === null || status === 'loading'}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {status === 'loading' ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={18} /> Send RSVP</>}
        </button>
      </form>
    </div>
  );
}
