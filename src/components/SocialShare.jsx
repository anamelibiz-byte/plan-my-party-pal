import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Mail, Link, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function SocialShare({ partyData, shareUrl }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const url = shareUrl || window.location.href;
  const title = `${partyData.childName}'s ${partyData.age}${getOrdinalSuffix(partyData.age)} Birthday Party!`;
  const description = `Join us for ${partyData.childName}'s ${partyData.theme || ''} birthday party${partyData.date ? ` on ${new Date(partyData.date).toLocaleDateString()}` : ''}!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('Link copied to clipboard!', 'success');

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description}\n\nRSVP here: ${url}\n\nPlanned with Party Plann ✨`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Share2 className="text-pink-500" size={24} />
        <h3 className="font-bold text-gray-800">Share Your Party</h3>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Share your party details with friends and family
      </p>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleFacebookShare}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          <Facebook size={20} />
          Facebook
        </button>

        <button
          onClick={handleTwitterShare}
          className="flex items-center justify-center gap-2 bg-sky-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-sky-600 transition-all"
        >
          <Twitter size={20} />
          Twitter
        </button>

        <button
          onClick={handleEmailShare}
          className="flex items-center justify-center gap-2 bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
        >
          <Mail size={20} />
          Email
        </button>

        <button
          onClick={handleCopyLink}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
          }`}
        >
          {copied ? (
            <>
              <CheckCircle size={20} />
              Copied!
            </>
          ) : (
            <>
              <Link size={20} />
              Copy Link
            </>
          )}
        </button>
      </div>

      {/* Planning Badge */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-700 mb-2">
            Planned with
          </p>
          <p className="text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Party Plann ✨
          </p>
        </div>
      </div>
    </div>
  );
}

function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}
