import React, { createContext, useContext, useState, useCallback } from 'react';
import { TIERS, hasFeature, getEffectiveTier, ADMIN_OVERRIDE } from '../config/tiers';
import useLocalStorage from '../hooks/useLocalStorage';

const TierContext = createContext(null);

export function TierProvider({ children }) {
  const [userTier, setUserTier] = useLocalStorage('pp_user_tier', 'free');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState(null);

  const effectiveTier = getEffectiveTier(userTier);

  const checkFeature = useCallback((featureName) => {
    return hasFeature(userTier, featureName);
  }, [userTier]);

  const requireFeature = useCallback((featureName) => {
    if (hasFeature(userTier, featureName)) return true;
    setUpgradeFeature(featureName);
    setShowUpgradeModal(true);
    return false;
  }, [userTier]);

  const closeUpgradeModal = useCallback(() => {
    setShowUpgradeModal(false);
    setUpgradeFeature(null);
  }, []);

  const value = {
    userTier, setUserTier, effectiveTier,
    checkFeature, requireFeature,
    showUpgradeModal, upgradeFeature, closeUpgradeModal,
    isOverridden: ADMIN_OVERRIDE !== 'none',
    tiers: TIERS,
  };

  return <TierContext.Provider value={value}>{children}</TierContext.Provider>;
}

export function useTier() {
  const ctx = useContext(TierContext);
  if (!ctx) throw new Error('useTier must be used within a TierProvider');
  return ctx;
}
