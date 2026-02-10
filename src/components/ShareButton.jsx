import React, { useState } from 'react';
import { Share2, Copy, Check, Mail, MessageCircle } from 'lucide-react';

export default function ShareButton({ partyData, checklist }) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const buildShareText = () => {
    const lines = [];
    lines.push(`${partyData.childName}'s ${partyData.theme} Birthday Party`);
    lines.push(`Date: ${partyData.date || 'TBD'} | Guests: ${partyData.guestCount} | Budget: $${partyData.budget}`);
    if (partyData.selectedActivities.length) {
      lines.push(`Activities: ${partyData.selectedActivities.join(', ')}`);
    }
    lines.push('');
    lines.push('Checklist:');
    checklist.forEach(item => {
      lines.push(`${item.completed ? '✅' : '☐'} ${item.task} (${item.estimatedCost})`);
    });
    lines.push('');
    lines.push('Made with Plan My Party Pal ✨');
    return lines.join('\n');
  };

  const shareText = buildShareText();
  const subject = `${partyData.childName}'s ${partyData.theme} Party Plan`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: subject, text: shareText });
      } catch { /* cancelled */ }
    } else {
      setShowMenu(!showMenu);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
  const smsUrl = `sms:?body=${encodeURIComponent(shareText)}`;

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all"
      >
        <Share2 size={20} /> Share Plan
      </button>

      {showMenu && (
        <div className="absolute bottom-full mb-2 right-0 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-2 min-w-[200px] z-50">
          <button onClick={handleCopy} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-500" />}
            <span className="font-semibold text-sm">{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>
          <a href={mailtoUrl} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Mail size={18} className="text-gray-500" />
            <span className="font-semibold text-sm">Email</span>
          </a>
          <a href={smsUrl} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <MessageCircle size={18} className="text-gray-500" />
            <span className="font-semibold text-sm">Text Message</span>
          </a>
        </div>
      )}
    </div>
  );
}
