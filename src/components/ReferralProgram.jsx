import React, { useState, useEffect } from 'react';
import { Gift, Copy, CheckCircle, Users, Mail } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ReferralProgram({ userEmail }) {
  const { showToast } = useToast();
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    const fetchReferralData = async () => {
      try {
        // Try to get existing referral code
        let res = await fetch(`/api/referrals/stats?email=${encodeURIComponent(userEmail)}`);
        let data = await res.json();

        if (res.status === 404 || !data.referral_code) {
          // Create new referral code
          res = await fetch('/api/referrals/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail }),
          });
          data = await res.json();
        }

        setReferralData(data);
      } catch (error) {
        console.error('Failed to fetch referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [userEmail]);

  const handleCopy = () => {
    if (!referralData?.referral_url) return;

    navigator.clipboard.writeText(referralData.referral_url);
    setCopied(true);
    showToast('Referral link copied to clipboard!', 'success');

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleShare = () => {
    if (!referralData?.referral_url) return;

    const subject = 'Plan the perfect party with Party Plann!';
    const body = `Hey! I've been using Party Plann to plan amazing parties and thought you might like it too.\n\nUse my link to get started: ${referralData.referral_url}\n\n🎉 Happy planning!`;

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200">
        <div className="animate-pulse">
          <div className="h-6 bg-pink-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-pink-100 rounded w-full mb-2"></div>
          <div className="h-4 bg-pink-100 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-lg">
          <Gift className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Refer Friends, Get Rewarded!</h3>
          <p className="text-sm text-gray-600">Share the love and earn free Pro months</p>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="text-pink-500" size={20} />
            <div>
              <p className="text-sm text-gray-600">Friends Referred</p>
              <p className="text-2xl font-bold text-gray-800">{referralData?.referral_count || 0}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Rewards Earned</p>
            <p className="text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              {referralData?.referral_count || 0} month{(referralData?.referral_count || 0) !== 1 ? 's' : ''} free
            </p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <CheckCircle className="text-green-600" size={18} />
          How It Works
        </h4>
        <ol className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="font-bold text-pink-500">1.</span>
            <span>Share your unique referral link with friends</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-pink-500">2.</span>
            <span>They sign up and upgrade to Pro</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-pink-500">3.</span>
            <span>You both get 1 month of Pro free!</span>
          </li>
        </ol>
      </div>

      {/* Referral Link */}
      {referralData?.referral_url && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Your Referral Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralData.referral_url}
              readOnly
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-mono"
              onClick={(e) => e.target.select()}
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle size={18} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Mail size={18} />
            Share via Email
          </button>
        </div>
      )}
    </div>
  );
}
