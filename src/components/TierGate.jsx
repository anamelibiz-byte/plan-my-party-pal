import React from 'react';
import { Lock } from 'lucide-react';
import { useTier } from '../context/TierContext';
import { getMinTierForFeature, getTierDisplayName, FEATURE_LABELS } from '../config/tiers';

function getFeatureBenefit(feature) {
  const benefits = {
    downloadPDF: 'Download a beautifully formatted PDF party kit with all your planning details',
    shareChecklist: 'Share your party checklist via text, email, or social media',
    smsPartyPlan: 'Send your party plan via SMS to your phone',
    downloadChecklist: 'Download your complete checklist as a text file for offline access',
    printChecklist: 'Print your checklist with all party details and tasks',
    timeline: 'Create a detailed minute-by-minute timeline to keep your party on schedule',
    allThemes: 'Access 60+ premium themes including licensed characters',
    characterThemes: 'Unlock Disney, Marvel, and other licensed character themes',
    allActivities: 'Access 100+ curated party activities and games',
    budgetTrackerFull: 'Track every expense with detailed budget categories and reports',
    rsvpSystem: 'Manage RSVPs with automated reminders and guest tracking',
    emailPartyPlan: 'Email your complete party plan to yourself or co-hosts',
  };

  return benefits[feature] || 'Unlock premium features to plan the perfect party';
}

export default function TierGate({ feature, children, fallback, inline }) {
  const { checkFeature, requireFeature } = useTier();

  if (checkFeature(feature)) return children;

  const minTier = getMinTierForFeature(feature);
  const tierName = getTierDisplayName(minTier);
  const featureLabel = FEATURE_LABELS[feature] || feature;
  const featureBenefit = getFeatureBenefit(feature);

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
      {/* Blurred preview */}
      <div className="filter blur-sm pointer-events-none opacity-50">
        {children}
      </div>

      {/* Centered unlock button with feature details */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-2xl shadow-2xl border-4 border-purple-300 max-w-md text-center">
          <Lock className="text-purple-500 mx-auto mb-3" size={48} />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Unlock with {tierName}
          </h3>

          {/* Feature-specific benefits */}
          <p className="text-gray-600 mb-4">
            {featureBenefit}
          </p>

          {/* Pricing */}
          <p className="text-sm text-gray-500 mb-4">
            Only <span className="font-bold text-purple-600">$4.99/month</span> or <span className="font-bold text-purple-600">$29.99/year</span>
          </p>

          <button
            onClick={() => requireFeature(feature)}
            className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.05] transition-all"
          >
            Upgrade to Pro →
          </button>
        </div>
      </div>
    </div>
  );
}
