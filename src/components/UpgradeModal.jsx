import React from 'react';
import { X, Check, Crown, Sparkles, Star } from 'lucide-react';
import { useTier } from '../context/TierContext';
import { TIERS, FEATURE_LABELS, getMinTierForFeature } from '../config/tiers';

const TIER_ICONS = { free: Star, pro: Crown };
const TIER_COLORS = {
  free: { bg: 'from-gray-100 to-gray-200', border: 'border-gray-300', text: 'text-gray-700', btn: 'from-gray-400 to-gray-500' },
  pro: { bg: 'from-pink-50 to-rose-50', border: 'border-pink-300', text: 'text-pink-700', btn: 'from-pink-500 to-rose-500' },
};

// Display features for each tier card
const DISPLAY_FEATURES = [
  'maxParties', 'maxGuests', 'allThemes', 'characterThemes', 'allActivities',
  'budgetTrackerFull', 'budgetAnalytics', 'downloadPDF', 'saveExport',
  'emailPartyPlan', 'partyZonesFull', 'timelineBuilder', 'weatherAlert',
  'shareChecklist', 'aiSuggestions', 'rsvpSystem', 'dietaryTracker',
  'vendorRecommendations', 'prioritySupport',
];

export default function UpgradeModal() {
  const { showUpgradeModal, upgradeFeature, closeUpgradeModal, userTier, setUserTier } = useTier();

  if (!showUpgradeModal) return null;

  const handleCheckout = async (tierId) => {
    const tier = TIERS[tierId];
    if (!tier.stripe_price_id) {
      // No Stripe configured — just upgrade locally (for dev/demo)
      setUserTier(tierId);
      closeUpgradeModal();
      return;
    }
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: tier.stripe_price_id, tier: tierId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      // Fallback: upgrade locally
      setUserTier(tierId);
      closeUpgradeModal();
    }
  };

  const highlightFeature = upgradeFeature;
  const minTier = highlightFeature ? getMinTierForFeature(highlightFeature) : null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closeUpgradeModal}>
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Upgrade Your Party Planning</h2>
            {highlightFeature && (
              <p className="text-sm text-purple-600 mt-1">
                {FEATURE_LABELS[highlightFeature]} requires {TIERS[minTier]?.name}
              </p>
            )}
          </div>
          <button onClick={closeUpgradeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {['free', 'pro'].map(tierId => {
            const tier = TIERS[tierId];
            const colors = TIER_COLORS[tierId];
            const Icon = TIER_ICONS[tierId];
            const isCurrent = userTier === tierId;
            const isRecommended = tierId === 'pro';

            return (
              <div
                key={tierId}
                className={`rounded-2xl border-2 ${colors.border} bg-gradient-to-b ${colors.bg} p-5 relative ${isRecommended ? 'ring-2 ring-purple-400 ring-offset-2' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-center mb-4 pt-2">
                  <Icon className={colors.text} size={32} />
                  <h3 className={`text-xl font-bold mt-2 ${colors.text}`}>{tier.name}</h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{tier.priceLabel}</p>
                  {tier.priceYearlyLabel && (
                    <p className="text-xs text-gray-600 mt-1">or {tier.priceYearlyLabel} (save $30!)</p>
                  )}
                  {tier.billing && <p className="text-xs text-gray-500">{tier.billing}</p>}
                </div>

                <div className="space-y-2 mb-5">
                  {DISPLAY_FEATURES.map(feat => {
                    const has = tier.features[feat];
                    const isHighlight = feat === highlightFeature;
                    return (
                      <div
                        key={feat}
                        className={`flex items-center gap-2 text-sm ${isHighlight ? 'bg-purple-100 -mx-2 px-2 py-1 rounded-lg' : ''}`}
                      >
                        {has ? (
                          <Check size={16} className="text-green-500 flex-shrink-0" />
                        ) : (
                          <X size={16} className="text-gray-300 flex-shrink-0" />
                        )}
                        <span className={has ? 'text-gray-700' : 'text-gray-400'}>
                          {FEATURE_LABELS[feat]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {isCurrent ? (
                  <div className="text-center py-3 bg-gray-100 rounded-xl text-gray-500 font-bold text-sm">
                    Current Plan
                  </div>
                ) : tierId === 'free' ? null : (
                  <button
                    onClick={() => handleCheckout(tierId)}
                    className={`w-full py-3 bg-gradient-to-r ${colors.btn} text-white rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all`}
                  >
                    Upgrade to Pro
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
