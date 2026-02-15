import React, { useState } from 'react';
import { X, Check, Crown, Sparkles, Star, Loader2 } from 'lucide-react';
import { useTier } from '../context/TierContext';
import { TIERS, FEATURE_LABELS, getMinTierForFeature } from '../config/tiers';

const TIER_ICONS = { free: Star, pro: Crown };
const TIER_COLORS = {
  free: { bg: 'from-gray-100 to-gray-200', border: 'border-gray-300', text: 'text-gray-700', btn: 'from-gray-400 to-gray-500' },
  pro: { bg: 'from-pink-50 to-rose-50', border: 'border-pink-300', text: 'text-pink-700', btn: 'from-pink-500 to-rose-500' },
};

// Display features for each tier card
const DISPLAY_FEATURES = [
  'maxParties',           // Free: 1 party, Pro: unlimited
  'maxGuests',            // Free: 15 guests, Pro: unlimited
  'allThemes',            // Both have access to all themes
  'allActivities',        // Both have access to all activities
  'rsvpSystem',           // Both have RSVP tracking
  'budgetTrackerFull',    // Free: basic, Pro: full with charts
  'timelineBuilder',      // Pro only
  'downloadPDF',          // Pro only
  'saveExport',           // Pro only (download as TXT)
  'emailPartyPlan',       // Pro only
  'smsPartyPlan',         // Pro only
  'shareChecklist',       // Pro only
  'printChecklist',       // Pro only
  'partyZonesFull',       // Free: preview, Pro: full
  'dietaryTracker',       // Pro only (future feature)
];

export default function UpgradeModal() {
  const { showUpgradeModal, upgradeFeature, closeUpgradeModal, userTier, setUserTier } = useTier();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  if (!showUpgradeModal) return null;

  const handleCheckout = async (tierId) => {
    console.log('🔵 Upgrade button clicked!', { tierId, billingCycle });
    setCheckoutError(null);
    setIsLoading(true);

    const tier = TIERS[tierId];

    // Pick the right price ID based on billing cycle
    const priceId = billingCycle === 'yearly' ? tier.stripe_price_id_yearly : tier.stripe_price_id;

    if (!priceId) {
      console.log('⚠️ No Stripe price ID configured - upgrading locally');
      // No Stripe configured — just upgrade locally (for dev/demo)
      setUserTier(tierId);
      closeUpgradeModal();
      setIsLoading(false);
      return;
    }

    console.log('🔵 Calling Stripe checkout...', { priceId, tier: tierId, billingCycle });

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, tier: tierId }),
      });

      const data = await res.json();
      console.log('🔵 Checkout response:', data);

      if (data.url) {
        console.log('✅ Redirecting to Stripe checkout:', data.url);
        window.location.href = data.url;
        // Don't set isLoading to false — we're navigating away
        return;
      } else if (data.error) {
        // API returned a specific error message
        console.error('❌ Stripe API error:', data.error, data.stripeError, data.stripeDetail);
        const debugInfo = data.stripeDetail ? `\n\nDebug: ${data.stripeDetail}` : '';
        setCheckoutError(data.error + debugInfo);
      } else if (data.message) {
        console.log('⚠️ Stripe not configured, upgrading locally:', data.message);
        setUserTier(tierId);
        closeUpgradeModal();
      } else {
        console.error('❌ Unexpected response format:', data);
        setCheckoutError('Something went wrong. Please try again or contact support.');
      }
    } catch (error) {
      console.error('❌ Checkout network error:', error);
      setCheckoutError('Could not connect to payment server. Please check your internet connection and try again.');
    }

    setIsLoading(false);
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

        {/* Error banner */}
        {checkoutError && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <span className="text-red-500 text-lg flex-shrink-0">⚠️</span>
            <div>
              <p className="text-red-700 text-sm font-medium whitespace-pre-wrap">{checkoutError}</p>
              <button
                onClick={() => setCheckoutError(null)}
                className="text-red-500 text-xs underline mt-1 hover:text-red-700"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

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

                  {/* Billing cycle toggle — only for paid tiers */}
                  {tier.priceYearlyLabel ? (
                    <div className="mt-2">
                      <div className="inline-flex bg-gray-200 rounded-full p-0.5 text-xs font-medium">
                        <button
                          onClick={(e) => { e.stopPropagation(); setBillingCycle('monthly'); }}
                          className={`px-3 py-1 rounded-full transition-all ${billingCycle === 'monthly' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setBillingCycle('yearly'); }}
                          className={`px-3 py-1 rounded-full transition-all ${billingCycle === 'yearly' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
                        >
                          Yearly
                        </button>
                      </div>
                      <p className="text-2xl font-bold text-gray-800 mt-2">
                        {billingCycle === 'yearly' ? tier.priceYearlyLabel : tier.priceLabel}
                      </p>
                      {billingCycle === 'yearly' && (
                        <p className="text-xs text-green-600 font-semibold mt-0.5">Save $30/year!</p>
                      )}
                      {billingCycle === 'monthly' && (
                        <p className="text-xs text-gray-500 mt-0.5">or {tier.priceYearlyLabel} yearly</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-800 mt-1">{tier.priceLabel}</p>
                  )}
                  {tier.billing && <p className="text-xs text-gray-500">{billingCycle === 'yearly' ? 'billed annually' : tier.billing}</p>}
                </div>

                <div className="space-y-2 mb-5">
                  {DISPLAY_FEATURES.map(feat => {
                    const has = tier.features[feat];
                    const isHighlight = feat === highlightFeature;

                    // Custom labels for maxParties and maxGuests to show actual values
                    let label = FEATURE_LABELS[feat];
                    if (feat === 'maxParties') {
                      label = has === null ? 'Unlimited parties' : has === 1 ? '1 party at a time' : `${has} parties`;
                    } else if (feat === 'maxGuests') {
                      label = has === null ? 'Unlimited guests' : `Up to ${has} guests`;
                    }

                    return (
                      <div
                        key={feat}
                        className={`flex items-center gap-2 text-sm ${isHighlight ? 'bg-purple-100 -mx-2 px-2 py-1 rounded-lg' : ''}`}
                      >
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">
                          {label}
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
                    disabled={isLoading}
                    className={`w-full py-3 bg-gradient-to-r ${colors.btn} text-white rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Setting up checkout...
                      </>
                    ) : (
                      `Upgrade to Pro${billingCycle === 'yearly' ? ' (Yearly)' : ''}`
                    )}
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
