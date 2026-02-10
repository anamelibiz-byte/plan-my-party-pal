// ─── Subscription Tiers ─────────────────────────────────────────────────────
// Change ADMIN_OVERRIDE to unlock features for testing:
//   'none'      → normal tier-gating
//   'all_free'  → everything unlocked (give it all away free)
//   'all_pro'   → everyone gets Party Pro features
//   'all_plus'  → everyone gets Party Planner Plus features
export const ADMIN_OVERRIDE = 'none';

export const TIERS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: 'Free',
    billing: null,
    stripe_price_id: null,
    description: 'Get started planning your party',
    features: {
      basicWizard: true,
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
    name: 'Party Pro',
    price: 4.99,
    priceLabel: '$4.99 one-time',
    billing: 'one-time',
    stripe_price_id: 'price_1Sz4igIVX3wrRyGSNKMMcjLj',
    description: 'Everything you need for the perfect party',
    popular: true,
    features: {
      basicWizard: true,
      limitedThemes: true,
      allThemes: true,
      characterThemes: true,
      limitedActivities: true,
      allActivities: true,
      budgetTrackerBasic: true,
      budgetTrackerFull: true,
      saveExport: true,
      downloadPDF: true,
      aiSuggestions: false,
      rsvpSystem: false,
      emailPartyPlan: true,
      partyZonesPreview: true,
      partyZonesFull: true,
      amazonLinks: true,
      timelineBuilder: true,
      dietaryTracker: false,
      weatherAlert: true,
      shareChecklist: true,
    },
  },
  plus: {
    id: 'plus',
    name: 'Party Planner Plus',
    price: 9.99,
    priceLabel: '$9.99/month',
    billing: 'monthly',
    stripe_price_id: 'price_1Sz4itIVX3wrRyGSXLnA5r00',
    description: 'The ultimate party planning toolkit',
    features: {
      basicWizard: true,
      limitedThemes: true,
      allThemes: true,
      characterThemes: true,
      limitedActivities: true,
      allActivities: true,
      budgetTrackerBasic: true,
      budgetTrackerFull: true,
      saveExport: true,
      downloadPDF: true,
      aiSuggestions: true,
      rsvpSystem: true,
      emailPartyPlan: true,
      partyZonesPreview: true,
      partyZonesFull: true,
      amazonLinks: true,
      timelineBuilder: true,
      dietaryTracker: true,
      weatherAlert: true,
      shareChecklist: true,
    },
  },
};

export const FEATURE_LABELS = {
  basicWizard: 'Basic 5-Step Wizard',
  limitedThemes: '15 Classic Themes',
  allThemes: 'All 60+ Themes',
  characterThemes: '15 Character Themes',
  limitedActivities: '15 Activities',
  allActivities: 'All 100+ Activities',
  budgetTrackerBasic: 'Basic Budget Tracker',
  budgetTrackerFull: 'Full Budget Tracker with Charts',
  saveExport: 'Save & Export Checklist',
  downloadPDF: 'Download PDF Party Kit',
  aiSuggestions: 'AI-Powered Suggestions',
  rsvpSystem: 'RSVP Management System',
  emailPartyPlan: 'Email Your Party Plan',
  partyZonesPreview: 'Party Zones Preview',
  partyZonesFull: 'Full Party Zones Guide',
  amazonLinks: 'Amazon Shopping Links',
  timelineBuilder: 'Day-of Timeline Builder',
  dietaryTracker: 'Dietary & Allergy Tracker',
  weatherAlert: 'Weather Alerts',
  shareChecklist: 'Share Checklist',
};

export function getEffectiveTier(userTier) {
  if (ADMIN_OVERRIDE !== 'none') return ADMIN_OVERRIDE.replace('all_', '');
  return userTier || 'free';
}

export function hasFeature(userTier, featureName) {
  if (ADMIN_OVERRIDE !== 'none') {
    const overrideTier = ADMIN_OVERRIDE === 'all_free' ? 'plus' : ADMIN_OVERRIDE.replace('all_', '');
    return TIERS[overrideTier]?.features?.[featureName] ?? false;
  }
  return TIERS[userTier || 'free']?.features?.[featureName] ?? false;
}

export function getMinTierForFeature(featureName) {
  if (TIERS.free.features[featureName]) return 'free';
  if (TIERS.pro.features[featureName]) return 'pro';
  return 'plus';
}

export function getTierDisplayName(tierId) {
  return TIERS[tierId]?.name || 'Free';
}
