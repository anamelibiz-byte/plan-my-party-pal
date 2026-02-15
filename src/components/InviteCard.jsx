import React, { useRef, useState, useMemo } from 'react';
import { Download, Share2, Sparkles, Loader2, FileText, Lock } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTier } from '../context/TierContext';
import { hasFeature } from '../config/tiers';

// Sprinkle colors for each theme
const THEME_SPRINKLES = {
  default: ['#F472B6', '#FB7185', '#D946EF', '#EC4899'],
  'Star Wars': ['#FDE047', '#FCD34D', '#FACC15', '#EAB308'],
  'Frozen': ['#7DD3FC', '#60A5FA', '#6366F1', '#93C5FD'],
  'Unicorn': ['#C084FC', '#F472B6', '#FDE047', '#E9D5FF'],
  'Superhero': ['#EF4444', '#2563EB', '#FACC15', '#F87171'],
  'Princess': ['#F9A8D4', '#FDA4AF', '#C084FC', '#EC4899'],
  'Dinosaur': ['#22C55E', '#10B981', '#A3E635', '#34D399'],
  'Mermaid': ['#2DD4BF', '#22D3EE', '#3B82F6', '#5EEAD4'],
  'Safari': ['#FBBF24', '#FB923C', '#EAB308', '#FCD34D'],
  'Space': ['#4F46E5', '#7E22CE', '#818CF8', '#C084FC'],
  'Minecraft': ['#16A34A', '#047857', '#22C55E', '#4ADE80'],
  'Godzilla': ['#6EE7B7', '#10B981', '#34D399', '#5EEAD4'],
  'King Kong': ['#6EE7B7', '#10B981', '#34D399', '#5EEAD4'],
  'Ninja': ['#EF4444', '#FCA5A5', '#DC2626', '#F87171'],
  'Mario': ['#EF4444', '#3B82F6', '#FACC15', '#F87171'],
  'Pokemon': ['#FACC15', '#EF4444', '#3B82F6', '#FCD34D'],
  'Carnival': ['#EF4444', '#FACC15', '#3B82F6', '#FB923C'],
  'LEGO': ['#EF4444', '#FACC15', '#22C55E', '#3B82F6'],
  'Pirate': ['#B45309', '#92400E', '#FDE68A', '#FBBF24'],
  'Paw Patrol': ['#3B82F6', '#EF4444', '#FACC15', '#60A5FA'],
  'Barbie': ['#EC4899', '#F472B6', '#D946EF', '#F9A8D4'],
  'Bluey': ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
  'Moana': ['#0891B2', '#14B8A6', '#F59E0B', '#2DD4BF'],
  'Cocomelon': ['#22C55E', '#EF4444', '#FACC15', '#34D399'],
  'Fortnite': ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B'],
};

function getThemeSprinkles(theme) {
  const lower = (theme || '').toLowerCase();
  for (const [key, val] of Object.entries(THEME_SPRINKLES)) {
    if (key !== 'default' && lower.includes(key.toLowerCase())) return val;
  }
  return THEME_SPRINKLES.default;
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

export default function InviteCard({ partyData, userTier = 'free' }) {
  const cardRef = useRef(null);
  const sprinkleColors = getThemeSprinkles(partyData.theme);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [printingPDF, setPrintingPDF] = useState(false);
  const { requireFeature } = useTier();
  const canPrint = hasFeature(userTier, 'printChecklist');

  // Generate sprinkles for the invite card
  const sprinkles = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      color: sprinkleColors[i % sprinkleColors.length],
      rotation: Math.random() * 360,
      w: 4 + Math.random() * 3,
      h: 12 + Math.random() * 8,
    }))
  , [sprinkleColors]);

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
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        allowTaint: true,
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
        alert('Could not generate image. Try taking a screenshot instead!');
        setSharing(false);
        return;
      }
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

      // Check if Web Share API supports files (mobile/Safari only)
      const canShareFiles = navigator.canShare && navigator.canShare({ files: [new File([], 'test.png')] });

      if (canShareFiles && blob) {
        // Mobile/Safari: use Web Share API with file
        const file = new File([blob], `${partyData.childName || 'party'}-invite.png`, { type: 'image/png' });
        await navigator.share({
          title: `${partyData.childName}'s Birthday Party`,
          text: `You're invited to ${partyData.childName}'s ${partyData.theme || ''} Birthday Party!`,
          files: [file],
        });
      } else if (navigator.share) {
        // Desktop: share text only with helpful message
        await navigator.share({
          title: `${partyData.childName}'s Birthday Party`,
          text: `You're invited to ${partyData.childName}'s ${partyData.theme || ''} Birthday Party! ${partyData.date ? formatDate(partyData.date) : ''} ${partyData.venueName ? 'at ' + partyData.venueName : ''}`,
        });
        // After sharing text, download the image
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${partyData.childName || 'party'}-invite.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert('Party details shared! The invite image has been downloaded to your device. You can now attach it to your message.');
      } else {
        // No share support: just download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${partyData.childName || 'party'}-invite.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert('Invite downloaded! You can now share it via text, email, or social media.');
      }
    } catch (err) {
      // User cancelled share or error
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
        alert('Share cancelled or failed. Use the Download button to save the invite.');
      }
    }
    setSharing(false);
  };

  const handlePrintPDF = async () => {
    setPrintingPDF(true);
    try {
      const canvas = await captureCard();
      if (!canvas) {
        alert('Could not generate invite image. Please try again.');
        setPrintingPDF(false);
        return;
      }

      // Create PDF with 4 invitations on 8.5" x 11" page
      const pdf = new jsPDF('p', 'in', 'letter'); // Portrait, inches, letter size

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/png');

      // Calculate dimensions for 2x2 grid on 8.5" x 11" page
      // Leave 0.5" margins, giving us 7.5" x 10" usable space
      const pageWidth = 8.5;
      const pageHeight = 11;
      const margin = 0.5;
      const usableWidth = pageWidth - (2 * margin);
      const usableHeight = pageHeight - (2 * margin);

      // Each invite gets 1/2 of width and height (minus small gap)
      const gap = 0.25; // Gap between invites
      const inviteWidth = (usableWidth - gap) / 2;
      const inviteHeight = (usableHeight - gap) / 2;

      // Place 4 invitations in 2x2 grid
      const positions = [
        { x: margin, y: margin }, // Top left
        { x: margin + inviteWidth + gap, y: margin }, // Top right
        { x: margin, y: margin + inviteHeight + gap }, // Bottom left
        { x: margin + inviteWidth + gap, y: margin + inviteHeight + gap }, // Bottom right
      ];

      // Add each invite 4 times
      positions.forEach(pos => {
        pdf.addImage(imgData, 'PNG', pos.x, pos.y, inviteWidth, inviteHeight);
      });

      // Add subtle cut lines between invites (light gray dashed)
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineDash([0.05, 0.05], 0);
      pdf.setLineWidth(0.01);

      // Vertical center line
      pdf.line(pageWidth / 2, margin, pageWidth / 2, pageHeight - margin);
      // Horizontal center line
      pdf.line(margin, pageHeight / 2, pageWidth - margin, pageHeight / 2);

      // Save the PDF
      pdf.save(`${partyData.childName || 'party'}-invites-4up.pdf`);

    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again or use the Download button for individual invites.');
    }
    setPrintingPDF(false);
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

      {/* The invite card with white background and sprinkles */}
      <div
        ref={cardRef}
        data-invite-card
        style={{
          position: 'relative',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          maxWidth: '448px',
          margin: '0 auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Sprinkles background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {sprinkles.map(s => (
            <div
              key={s.id}
              style={{
                position: 'absolute',
                left: s.left,
                top: s.top,
                backgroundColor: s.color,
                width: `${s.w}px`,
                height: `${s.h}px`,
                borderRadius: '4px',
                transform: `rotate(${s.rotation}deg)`,
                opacity: 0.4,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '12px',
            color: sprinkleColors[0],
          }}>
            You're Invited!
          </p>

          <h2 style={{
            fontSize: '28px',
            fontWeight: 900,
            marginBottom: '4px',
            color: '#1F2937',
          }}>
            {partyData.childName || 'Your Child'}'s
          </h2>
          <p style={{
            fontSize: '20px',
            fontWeight: 700,
            marginBottom: '16px',
            color: '#374151',
          }}>
            {partyData.theme ? `${partyData.theme} Party` : 'Birthday Party'} 🎉
          </p>

          <div style={{
            borderTop: '2px solid #E5E7EB',
            borderBottom: '2px solid #E5E7EB',
            padding: '16px 0',
            margin: '16px 0',
          }}>
            {partyData.age && (
              <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#1F2937' }}>
                🎂 Turning {partyData.age}!
              </p>
            )}
            <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#1F2937' }}>
              📅 {formatDate(partyData.date)}
              {timeDisplay && ` at ${timeDisplay}`}
            </p>
            {venueDisplay && (
              <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#1F2937' }}>
                📍 {venueDisplay}
              </p>
            )}
            {partyData.venueAddress && (
              <p style={{ fontSize: '15px', color: '#6B7280' }}>{partyData.venueAddress}</p>
            )}
            {!partyData.venueAddress && partyData.location && (
              <p style={{ fontSize: '15px', color: '#6B7280' }}>{partyData.location}</p>
            )}
          </div>

          <p style={{
            fontSize: '13px',
            marginTop: '12px',
            color: sprinkleColors[0],
            fontWeight: 600,
          }}>
            Please RSVP{partyData.phone ? ' to:' : ' by text or reply'}
          </p>
          {partyData.phone && (
            <p style={{
              fontSize: '17px',
              fontWeight: 700,
              marginTop: '4px',
              color: '#1F2937',
            }}>
              📱 {partyData.phone}
            </p>
          )}
          <p style={{ fontSize: '11px', marginTop: '8px', color: '#9CA3AF' }}>
            Made with PlanMyPartyPal.com
          </p>
        </div>
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
      <div className="flex flex-col gap-3 max-w-md mx-auto">
        <div className="flex gap-3">
          <button onClick={handleDownload} disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all text-sm disabled:opacity-60">
            {downloading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Download size={18} /> Download</>}
          </button>
          <button onClick={handleShare} disabled={sharing}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all text-sm disabled:opacity-60">
            {sharing ? <><Loader2 size={18} className="animate-spin" /> Sharing...</> : <><Share2 size={18} /> Share</>}
          </button>
        </div>

        {/* Pro: Print 4-Up PDF */}
        {canPrint ? (
          <button onClick={handlePrintPDF} disabled={printingPDF}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all text-sm disabled:opacity-60">
            {printingPDF ? <><Loader2 size={18} className="animate-spin" /> Creating PDF...</> : <><FileText size={18} /> Print 4-Up PDF</>}
          </button>
        ) : (
          <button onClick={() => requireFeature('printChecklist')}
            className="w-full flex items-center justify-center gap-2 text-purple-600 border-2 border-purple-300 bg-purple-50 py-3 rounded-xl font-bold hover:bg-purple-100 transition-all text-sm">
            <Lock size={16} />
            <span className="hidden sm:inline">Print 4 invites per page? </span>
            <span className="underline">Unlock Pro</span>
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        {canPrint ? '4-Up PDF prints 4 invitations on one 8.5" x 11" page!' : 'Download this invite and send it via text, WhatsApp, email, or social media!'}
      </p>
    </div>
  );
}
