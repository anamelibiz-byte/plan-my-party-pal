// ─── Subscription Tiers ─────────────────────────────────────────────────────
// Change ADMIN_OVERRIDE to unlock features for testing:
//   'none'      → normal tier-gating
//   'all_free'  → everything unlocked (give it all away free)
//   'all_pro'   → everyone gets Pro features
export const ADMIN_OVERRIDE = 'none';

export const TIERS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: 'Free',
    billing: null,
    stripe_price_id: null,
    description: 'Perfect for getting started',
    features: {
      basicWizard: true,
      maxParties: 1, // NEW: Can only plan 1 party at a time
      maxGuests: 15, // NEW: Up to 15 guests
      limitedThemes: true,
      allThemes: false,
      characterThemes: false,
      limitedActivities: true,
      allActivities: false,
      budgetTrackerBasic: true,
      budgetTrackerFull: false,
      saveExport: false,
      downloadPDF: false,
      aiSuggestions: false,
      rsvpSystem: false,
      emailPartyPlan: false,
      partyZonesPreview: true,
      partyZonesFull: false,
      amazonLinks: true,
      timelineBuilder: false,
      dietaryTracker: false,
      weatherAlert: false,
      shareChecklist: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 4.99,
    priceLabel: '$4.99/month',
    priceYearly: 29.99,
    priceYearlyLabel: '$29.99/year',
    billing: 'monthly',
    stripe_price_id: 'price_1T07BaIVX3wrRyGSVSqVAyVu',
    stripe_price_id_yearly: 'price_1T031QIVX3wrRyGS8kY6iCcZ',
    description: 'Everything you need + more',
    popular: true,
    features: {
      basicWizard: true,
      maxParties: null, // Unlimited parties
      maxGuests: null, // Unlimited guests
      limitedThemes: true,
      allThemes: true,
      characterThemes: true,
      limitedActivities: true,
      allActivities: true,
      budgetTrackerBasic: true,
      budgetTrackerFull: true,
      saveExport: true,
      downloadPDF: true,
      aiSuggestions: true, // AI-powered suggestions
      rsvpSystem: true, // RSVP tracking
      emailPartyPlan: true,
      partyZonesPreview: true,
      partyZonesFull: true,
      amazonLinks: true,
      vendorRecommendations: true, // NEW: Vendor recommendations by location
      budgetAnalytics: true, // NEW: Budget analytics & breakdown
      timelineBuilder: true,
      dietaryTracker: true,
      weatherAlert: true,
      shareChecklist: true,
      prioritySupport: true, // NEW: Priority support
    },
  },
};

export const FEATURE_LABELS = {
  basicWizard: 'Basic 5-Step Wizard',
  maxParties: 'Multiple Parties',
  maxGuests: 'Guest Limit',
  limitedThemes: '15 Classic Themes',
  allThemes: 'All 60+ Themes',
  characterThemes: '15 Character Themes',
  limitedActivities: '15 Activities',
  allActivities: 'All 100+ Activities',
  budgetTrackerBasic: 'Basic Budget Tracker',
  budgetTrackerFull: 'Full Budget Tracker with Charts',
  saveExport: 'Save & Export Checklist',
  downloadPDF: 'Download PDF Party Kit',
  aiSuggestions: 'AI-Powered Theme & Activity Suggestions',
  rsvpSystem: 'RSVP Tracking',
  emailPartyPlan: 'Email Your Party Plan',
  partyZonesPreview: 'Party Zones Preview',
  partyZonesFull: 'Full Party Zones Guide',
  amazonLinks: 'Amazon Shopping Links',
  vendorRecommendations: 'Vendor Recommendations by Location',
  budgetAnalytics: 'Budget Analytics & Spending Breakdown',
  timelineBuilder: 'Day-of Timeline Builder',
  dietaryTracker: 'Dietary & Allergy Tracker',
  weatherAlert: 'Weather Alerts',
  shareChecklist: 'Printable/Shareable Party Plans',
  prioritySupport: 'Priority Support',
};

export function getEffectiveTier(userTier) {
  if (ADMIN_OVERRIDE !== 'none') return ADMIN_OVERRIDE.replace('all_', '');
  return userTier || 'free';
}

export function hasFeature(userTier, featureName) {
  if (ADMIN_OVERRIDE !== 'none') {
    const overrideTier = ADMIN_OVERRIDE === 'all_free' ? 'pro' : ADMIN_OVERRIDE.replace('all_', '');
    return TIERS[overrideTier]?.features?.[featureName] ?? false;
  }
  return TIERS[userTier || 'free']?.features?.[featureName] ?? false;
}

export function getMinTierForFeature(featureName) {
  if (TIERS.free.features[featureName]) return 'free';
  if (TIERS.pro.features[featureName]) return 'pro';
  return 'pro'; // Only two tiers now
}

export function getTierDisplayName(tierId) {
  return TIERS[tierId]?.name || 'Free';
}

export function getMaxParties(userTier) {
  const tier = getEffectiveTier(userTier);
  return TIERS[tier]?.features?.maxParties ?? 1;
}

export function getMaxGuests(userTier) {
  const tier = getEffectiveTier(userTier);
  return TIERS[tier]?.features?.maxGuests ?? 15;
}
