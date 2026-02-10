import React, { useRef, useState } from 'react';
import { Download, Share2, Sparkles, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

// Use INLINE gradient CSS so html2canvas can render them (Tailwind classes don't work with html2canvas)
const THEME_STYLES = {
  default: { gradient: 'linear-gradient(135deg, #F472B6, #FB7185, #D946EF)', accent: '#FBB6CE', border: 'rgba(249,168,212,0.4)' },
  'Star Wars': { gradient: 'linear-gradient(135deg, #1F2937, #111827, #000000)', accent: '#FDE047', border: 'rgba(234,179,8,0.4)' },
  'Frozen': { gradient: 'linear-gradient(135deg, #7DD3FC, #60A5FA, #6366F1)', accent: '#E0F2FE', border: 'rgba(186,230,253,0.4)' },
  'Unicorn': { gradient: 'linear-gradient(135deg, #C084FC, #F472B6, #FDE047)', accent: '#E9D5FF', border: 'rgba(196,181,253,0.4)' },
  'Superhero': { gradient: 'linear-gradient(135deg, #EF4444, #2563EB, #FACC15)', accent: '#FEE2E2', border: 'rgba(248,113,113,0.4)' },
  'Princess': { gradient: 'linear-gradient(135deg, #F9A8D4, #FDA4AF, #C084FC)', accent: '#FCE7F3', border: 'rgba(249,168,212,0.4)' },
  'Dinosaur': { gradient: 'linear-gradient(135deg, #22C55E, #10B981, #A3E635)', accent: '#DCFCE7', border: 'rgba(134,239,172,0.4)' },
  'Mermaid': { gradient: 'linear-gradient(135deg, #2DD4BF, #22D3EE, #3B82F6)', accent: '#CCFBF1', border: 'rgba(153,246,228,0.4)' },
  'Safari': { gradient: 'linear-gradient(135deg, #FBBF24, #FB923C, #EAB308)', accent: '#FEF3C7', border: 'rgba(252,211,77,0.4)' },
  'Space': { gradient: 'linear-gradient(135deg, #4F46E5, #7E22CE, #000000)', accent: '#C7D2FE', border: 'rgba(129,140,248,0.4)' },
  'Minecraft': { gradient: 'linear-gradient(135deg, #16A34A, #047857, #166534)', accent: '#BBF7D0', border: 'rgba(74,222,128,0.4)' },
  'Godzilla': { gradient: 'linear-gradient(135deg, #374151, #1E293B, #111827)', accent: '#6EE7B7', border: 'rgba(52,211,153,0.4)' },
  'King Kong': { gradient: 'linear-gradient(135deg, #374151, #1E293B, #111827)', accent: '#6EE7B7', border: 'rgba(52,211,153,0.4)' },
  'Ninja': { gradient: 'linear-gradient(135deg, #1F2937, #7F1D1D, #000000)', accent: '#FCA5A5', border: 'rgba(239,68,68,0.4)' },
  'Mario': { gradient: 'linear-gradient(135deg, #EF4444, #DC2626, #3B82F6)', accent: '#FEF08A', border: 'rgba(253,224,71,0.4)' },
  'Pokemon': { gradient: 'linear-gradient(135deg, #FACC15, #EF4444, #3B82F6)', accent: '#FEF9C3', border: 'rgba(253,224,71,0.4)' },
  'Carnival': { gradient: 'linear-gradient(135deg, #EF4444, #FACC15, #3B82F6)', accent: '#FEF9C3', border: 'rgba(253,224,71,0.4)' },
  'LEGO': { gradient: 'linear-gradient(135deg, #EF4444, #FACC15, #22C55E)', accent: '#FEF9C3', border: 'rgba(253,224,71,0.4)' },
  'Pirate': { gradient: 'linear-gradient(135deg, #B45309, #92400E, #111827)', accent: '#FDE68A', border: 'rgba(252,211,77,0.4)' },
  'Paw Patrol': { gradient: 'linear-gradient(135deg, #3B82F6, #EF4444, #FACC15)', accent: '#DBEAFE', border: 'rgba(147,197,253,0.4)' },
  'Barbie': { gradient: 'linear-gradient(135deg, #EC4899, #F472B6, #D946EF)', accent: '#FCE7F3', border: 'rgba(249,168,212,0.4)' },
  'Bluey': { gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA, #93C5FD)', accent: '#DBEAFE', border: 'rgba(147,197,253,0.4)' },
  'Moana': { gradient: 'linear-gradient(135deg, #0891B2, #14B8A6, #F59E0B)', accent: '#CCFBF1', border: 'rgba(153,246,228,0.4)' },
  'Cocomelon': { gradient: 'linear-gradient(135deg, #22C55E, #EF4444, #FACC15)', accent: '#DCFCE7', border: 'rgba(134,239,172,0.4)' },
};

function getThemeStyle(theme) {
  const lower = (theme || '').toLowerCase();
  for (const [key, val] of Object.entries(THEME_STYLES)) {
    if (key !== 'default' && lower.includes(key.toLowerCase())) return val;
  }
  return THEME_STYLES.default;
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  try {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${h12}:${m} ${ampm}`;
  } catch {
    return timeStr;
  }
}

export default function InviteCard({ partyData }) {
  const cardRef = useRef(null);
  const style = getThemeStyle(partyData.theme);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date TBD';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const captureCard = async () => {
    if (!cardRef.current) return null;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        logging: false,
        allowTaint: true,
        // Force html2canvas to render inline styles
        onclone: (clonedDoc) => {
          const clonedCard = clonedDoc.querySelector('[data-invite-card]');
          if (clonedCard) {
            clonedCard.style.background = style.gradient;
          }
        },
      });
      return canvas;
    } catch (err) {
      console.error('Capture failed:', err);
      return null;
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const canvas = await captureCard();
      if (canvas) {
        const link = document.createElement('a');
        link.download = `${partyData.childName || 'party'}-invite.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Could not generate image. Try taking a screenshot instead!');
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Try taking a screenshot of the invite instead!');
    }
    setDownloading(false);
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const canvas = await captureCard();
      if (!canvas) {
        handleDownload();
        setSharing(false);
        return;
      }
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (navigator.share && blob) {
        const file = new File([blob], `${partyData.childName || 'party'}-invite.png`, { type: 'image/png' });
        await navigator.share({
          title: `${partyData.childName}'s Birthday Party`,
          text: `You're invited to ${partyData.childName}'s ${partyData.theme || ''} Birthday Party!`,
          files: [file],
        });
      } else if (blob) {
        // Fallback: download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${partyData.childName || 'party'}-invite.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      // User cancelled share or error
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
    setSharing(false);
  };

  // Build the venue display string
  const venueDisplay = partyData.venueName || (partyData.venueType === 'Home' ? 'At Our Home' : partyData.venueType || '');
  const timeDisplay = formatTime(partyData.partyTime);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <Sparkles className="text-pink-500" size={22} />
        <h3 className="text-lg font-bold text-gray-800">Digital Party Invite</h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Download & Share</span>
      </div>

      {/* The invite card — uses INLINE styles for gradient so html2canvas can render it */}
      <div
        ref={cardRef}
        data-invite-card
        style={{
          background: style.gradient,
          borderRadius: '16px',
          padding: '32px',
          color: 'white',
          textAlign: 'center',
          maxWidth: '448px',
          margin: '0 auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px', color: style.accent }}>
          You're Invited!
        </p>

        <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          {partyData.childName || 'Your Child'}'s
        </h2>
        <p style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          {partyData.theme ? `${partyData.theme} Party` : 'Birthday Party'} 🎉
        </p>

        <div style={{ borderTop: `1px solid ${style.border}`, borderBottom: `1px solid ${style.border}`, padding: '16px 0', margin: '16px 0' }}>
          {partyData.age && (
            <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>🎂 Turning {partyData.age}!</p>
          )}
          <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
            📅 {formatDate(partyData.date)}
            {timeDisplay && ` at ${timeDisplay}`}
          </p>
          {venueDisplay && (
            <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>📍 {venueDisplay}</p>
          )}
          {partyData.venueAddress && (
            <p style={{ fontSize: '15px', opacity: 0.9 }}>{partyData.venueAddress}</p>
          )}
          {!partyData.venueAddress && partyData.location && (
            <p style={{ fontSize: '15px', opacity: 0.9 }}>{partyData.location}</p>
          )}
        </div>

        <p style={{ fontSize: '13px', marginTop: '12px', color: style.accent }}>Please RSVP by text or reply</p>
        <p style={{ fontSize: '11px', marginTop: '8px', opacity: 0.6 }}>Made with PlanMyPartyPal.com</p>
      </div>

      {/* Missing info warnings */}
      {(!partyData.partyTime || !partyData.venueName) && (
        <div className="max-w-md mx-auto p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          💡 Your invite is missing:
          {!partyData.partyTime && <span className="font-bold"> Party Time (add on Step 1)</span>}
          {!partyData.partyTime && !partyData.venueName && <span>,</span>}
          {!partyData.venueName && <span className="font-bold"> Venue Name (choose on Step 2)</span>}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 max-w-md mx-auto">
        <button onClick={handleDownload} disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all text-sm disabled:opacity-60">
          {downloading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Download size={18} /> Download Invite</>}
        </button>
        <button onClick={handleShare} disabled={sharing}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all text-sm disabled:opacity-60">
          {sharing ? <><Loader2 size={18} className="animate-spin" /> Sharing...</> : <><Share2 size={18} /> Share</>}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">Download this invite and send it via text, WhatsApp, email, or social media!</p>
    </div>
  );
}
