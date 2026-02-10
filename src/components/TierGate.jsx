import React from 'react';
import { Lock } from 'lucide-react';
import { useTier } from '../context/TierContext';
import { getMinTierForFeature, getTierDisplayName, FEATURE_LABELS } from '../config/tiers';

export default function TierGate({ feature, children, fallback, inline }) {
  const { checkFeature, requireFeature } = useTier();

  if (checkFeature(feature)) return children;

  const minTier = getMinTierForFeature(feature);
  const tierName = getTierDisplayName(minTier);
  const featureLabel = FEATURE_LABELS[feature] || feature;

  if (fallback) return fallback;

  if (inline) {
    return (
      <button
        onClick={() => requireFeature(feature)}
        className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-semibold transition-colors"
      >
        <Lock size={14} /> Upgrade to {tierName}
      </button>
    );
  }

  return (
    <div className="relative">
      <div className="opacity-30 pointer-events-none blur-[2px] select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={() => requireFeature(feature)}
          className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
        >
          <Lock size={18} /> Unlock with {tierName}
        </button>
      </div>
    </div>
  );
}
