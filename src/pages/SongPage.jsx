import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, Sparkles, Heart, Download, Mic2, Star, ChevronRight, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Sprinkles from '../components/Sprinkles';

const STEPS = [
  { icon: '💳', title: 'Purchase', desc: 'Secure $14.99 one-time payment' },
  { icon: '✏️', title: 'Personalize', desc: 'Tell us about your child' },
  { icon: '🎵', title: 'Get Your Song', desc: 'Ready in about 60 seconds' },
];

const FEATURES = [
  { icon: <Heart size={20} className="text-pink-500" />, text: 'Personalized lyrics with your child\'s name' },
  { icon: <Mic2 size={20} className="text-purple-500" />, text: 'Your choice of music style and singer voice' },
  { icon: <Download size={20} className="text-blue-500" />, text: 'Instant MP3 download + emailed to you' },
  { icon: <Star size={20} className="text-yellow-500" />, text: 'One-of-a-kind — never the same song twice' },
];

const FAQS = [
  { q: 'How long does it take?', a: 'About 60 seconds from the time you submit your answers. The AI composes and produces the song in real time.' },
  { q: 'Can I choose the music style?', a: 'Yes! Choose from Pop, Country, R&B, Rock, Reggae, or Classical — plus pick the vibe (upbeat, sweet, or silly) and singer gender.' },
  { q: 'What do I get?', a: 'A full ~2.5 minute MP3 song with vocals, personalized lyrics, and your child\'s name woven throughout. You can play it, download it, and share it at the party!' },
  { q: 'Is this a subscription?', a: 'No — this is a one-time payment of $14.99. No recurring charges.' },
];

export default function SongPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    try {
      const email = localStorage.getItem('pp_user_email') || '';
      const res = await fetch('/api/create-song-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Sprinkles />
      <Header />

      {/* Hero */}
      <div className="relative z-10 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {['🎵','🎶','🎸','🎹','🎤','✨'].map((e, i) => (
            <span key={i} className="absolute text-4xl" style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%`, opacity: 0.6 }}>{e}</span>
          ))}
        </div>
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Sparkles size={14} /> New Feature
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            A Custom Birthday Song<br />Just for Your Child 🎵
          </h1>
          <p className="text-lg text-pink-100 mb-4 max-w-xl mx-auto">
            Personalized. AI-generated. One-of-a-kind.<br />Ready in about 60 seconds.
          </p>
          <div className="inline-block bg-white/20 rounded-xl px-6 py-2 text-2xl font-black mb-8">
            $14.99 <span className="text-base font-normal text-pink-100">one-time · no subscription</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="flex items-center gap-2 bg-white text-pink-600 font-black text-lg px-10 py-4 rounded-2xl hover:bg-pink-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-70"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Music size={20} />}
              {loading ? 'Setting up...' : 'Create Their Song →'}
            </button>
            {error && <p className="text-red-200 text-sm">{error}</p>}
            <p className="text-pink-200 text-xs flex items-center gap-1">
              🔒 Secure checkout via Stripe
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">

        {/* How It Works */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-3xl">{step.icon}</div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-pink-500 text-white rounded-full text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="font-bold text-gray-800">{step.title}</span>
                </div>
                <p className="text-sm text-gray-500 text-center">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={20} className="text-gray-300 hidden sm:block absolute" style={{ right: '-12px', top: '50%' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">What You Get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                {f.icon}
                <span className="text-gray-700 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* You Customize section */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">You Tell Us, We Compose It</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            {[
              { icon: '👦', label: 'Child\'s name & age' },
              { icon: '✨', label: 'Their personality' },
              { icon: '🏆', label: 'This year\'s highlights' },
              { icon: '❤️', label: 'What they love' },
              { icon: '🎸', label: 'Music style' },
              { icon: '🎤', label: 'Singer voice' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xs font-semibold text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="font-bold text-gray-800 mb-1">{faq.q}</p>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-lg px-10 py-4 rounded-2xl hover:shadow-xl transition-all disabled:opacity-70"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Music size={20} />}
            {loading ? 'Setting up...' : 'Create Their Custom Song — $14.99'}
          </button>
          <p className="text-gray-400 text-xs mt-3">One-time payment · No subscription · Instant delivery</p>
        </div>
      </div>
    </div>
  );
}
