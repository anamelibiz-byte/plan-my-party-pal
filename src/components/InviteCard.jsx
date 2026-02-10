import React, { useRef } from 'react';
import { Download, Share2, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';

const THEME_COLORS = {
  default: { bg: 'from-pink-400 via-rose-400 to-fuchsia-500', accent: 'text-pink-100', border: 'border-pink-300' },
  'Star Wars': { bg: 'from-gray-800 via-gray-900 to-black', accent: 'text-yellow-300', border: 'border-yellow-500' },
  'Frozen': { bg: 'from-sky-300 via-blue-400 to-indigo-500', accent: 'text-sky-100', border: 'border-sky-200' },
  'Unicorn': { bg: 'from-purple-400 via-pink-400 to-yellow-300', accent: 'text-purple-100', border: 'border-purple-300' },
  'Superhero': { bg: 'from-red-500 via-blue-600 to-yellow-400', accent: 'text-red-100', border: 'border-red-400' },
  'Princess': { bg: 'from-pink-300 via-rose-300 to-purple-400', accent: 'text-pink-100', border: 'border-pink-200' },
  'Dinosaur': { bg: 'from-green-500 via-emerald-500 to-lime-400', accent: 'text-green-100', border: 'border-green-300' },
  'Mermaid': { bg: 'from-teal-400 via-cyan-400 to-blue-500', accent: 'text-teal-100', border: 'border-teal-300' },
  'Safari': { bg: 'from-amber-400 via-orange-400 to-yellow-500', accent: 'text-amber-100', border: 'border-amber-300' },
  'Space': { bg: 'from-indigo-600 via-purple-700 to-black', accent: 'text-indigo-200', border: 'border-indigo-400' },
};

function getThemeStyle(theme) {
  // Check for partial matches
  const lower = (theme || '').toLowerCase();
  for (const [key, val] of Object.entries(THEME_COLORS)) {
    if (lower.includes(key.toLowerCase())) return val;
  }
  return THEME_COLORS.default;
}

export default function InviteCard({ partyData }) {
  const cardRef = useRef(null);
  const style = getThemeStyle(partyData.theme);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date TBD';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `${partyData.childName || 'party'}-invite.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      canvas.toBlob(async (blob) => {
        if (navigator.share && blob) {
          const file = new File([blob], `${partyData.childName || 'party'}-invite.png`, { type: 'image/png' });
          await navigator.share({
            title: `${partyData.childName}'s Birthday Party`,
            text: `You're invited to ${partyData.childName}'s ${partyData.theme || ''} Birthday Party!`,
            files: [file],
          });
        } else {
          // Fallback: download
          handleDownload();
        }
      }, 'image/png');
    } catch (err) {
      handleDownload();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="text-pink-500" size={22} />
        <h3 className="text-lg font-bold text-gray-800">Digital Party Invite</h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Screenshot or Download</span>
      </div>

      {/* The invite card */}
      <div ref={cardRef} className={`bg-gradient-to-br ${style.bg} rounded-2xl p-6 sm:p-8 text-white text-center shadow-2xl max-w-md mx-auto`}>
        <p className={`text-sm font-bold uppercase tracking-widest mb-3 ${style.accent}`}>You're Invited!</p>

        <h2 className="text-3xl sm:text-4xl font-black mb-1 drop-shadow-lg">
          {partyData.childName || 'Your Child'}'s
        </h2>
        {partyData.theme && (
          <p className="text-xl sm:text-2xl font-bold mb-4 drop-shadow">{partyData.theme} Party 🎉</p>
        )}
        {!partyData.theme && (
          <p className="text-xl sm:text-2xl font-bold mb-4 drop-shadow">Birthday Party 🎉</p>
        )}

        <div className={`border-t ${style.border} border-b ${style.border} border-opacity-40 py-4 my-4 space-y-2`}>
          {partyData.age && (
            <p className="text-lg font-bold">🎂 Turning {partyData.age}!</p>
          )}
          <p className="text-lg font-semibold">📅 {formatDate(partyData.date)}</p>
          {partyData.venueType && partyData.venueType !== 'Home' && (
            <p className="text-lg font-semibold">📍 {partyData.venueType}</p>
          )}
          {partyData.venueType === 'Home' && (
            <p className="text-lg font-semibold">📍 At Our Home</p>
          )}
          {partyData.location && (
            <p className="text-base opacity-90">{partyData.location}</p>
          )}
        </div>

        <p className={`text-sm mt-3 ${style.accent}`}>Please RSVP by text or reply</p>
        <p className="text-xs mt-2 opacity-60">Made with PlanMyPartyPal.com</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 max-w-md mx-auto">
        <button onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all text-sm">
          <Download size={18} /> Download Invite
        </button>
        <button onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all text-sm">
          <Share2 size={18} /> Share
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">Download or screenshot this invite and send it via text, WhatsApp, email, or social media!</p>
    </div>
  );
}
