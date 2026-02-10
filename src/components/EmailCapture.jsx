import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Sparkles } from 'lucide-react';

export default function EmailCapture({ source = 'landing', partyData }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, partyData: partyData || null }),
      });
      if (res.ok) {
        setStatus('success');
        // Also save locally
        const existing = JSON.parse(localStorage.getItem('pp_email_subscribers') || '[]');
        existing.push({ email, source, date: new Date().toISOString() });
        localStorage.setItem('pp_email_subscribers', JSON.stringify(existing));
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch {
      // Save locally as fallback
      const existing = JSON.parse(localStorage.getItem('pp_email_subscribers') || '[]');
      existing.push({ email, source, date: new Date().toISOString() });
      localStorage.setItem('pp_email_subscribers', JSON.stringify(existing));
      setStatus('success');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
        <CheckCircle2 className="text-green-500 flex-shrink-0" size={24} />
        <div>
          <p className="font-bold text-green-700">You're on the list!</p>
          <p className="text-sm text-green-600">We'll send you party planning tips and updates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-pink-500" size={20} />
        <h4 className="font-bold text-gray-800">
          {source === 'checklist' ? 'Get Your Checklist Emailed!' : 'Get Party Planning Tips!'}
        </h4>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        {source === 'checklist'
          ? 'Enter your email and we\'ll send you your complete party plan.'
          : 'Join 1,000+ parents who plan amazing parties. Get tips, themes & deals.'}
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-3 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {status === 'loading' ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Send size={18} /> Send</>
          )}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
