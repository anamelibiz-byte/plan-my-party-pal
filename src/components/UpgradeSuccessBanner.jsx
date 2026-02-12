import React from 'react';
import { X, Crown, PartyPopper } from 'lucide-react';
import { useTier } from '../context/TierContext';

export default function UpgradeSuccessBanner() {
  const { upgradeSuccess, dismissUpgradeSuccess } = useTier();

  if (!upgradeSuccess) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-bounce-in">
        <div className="bg-white/20 rounded-full p-2">
          <Crown size={24} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">Welcome to Pro!</p>
          <p className="text-xs text-white/90">Your upgrade is active. All Pro features are now unlocked!</p>
        </div>
        <button
          onClick={dismissUpgradeSuccess}
          className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
