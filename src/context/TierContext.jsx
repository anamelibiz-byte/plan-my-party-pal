import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TIERS, hasFeature, getEffectiveTier, ADMIN_OVERRIDE } from '../config/tiers';
import useLocalStorage from '../hooks/useLocalStorage';

const TierContext = createContext(null);

export function TierProvider({ children }) {
  const [userTier, setUserTier] = useLocalStorage('pp_user_tier', 'free');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  // Handle Stripe checkout success redirect
  // When user returns from Stripe, URL will have ?upgraded=pro&session_id=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const upgradedTier = params.get('upgraded');
    const sessionId = params.get('session_id');
    const upgradeCanceled = params.get('upgrade');

    if (upgradedTier && TIERS[upgradedTier]) {
      console.log('✅ Stripe checkout completed! Upgrading to:', upgradedTier, 'Session:', sessionId);
      setUserTier(upgradedTier);
      setUpgradeSuccess(true);

      // Clean up URL params without triggering a page reload
      const url = new URL(window.location.href);
      url.searchParams.delete('upgraded');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.pathname + url.search);

      // Auto-dismiss success message after 8 seconds
      setTimeout(() => setUpgradeSuccess(false), 8000);
    }

    if (upgradeCanceled === 'canceled') {
      console.log('⚠️ Stripe checkout was canceled');
      // Clean up URL params
      const url = new URL(window.location.href);
      url.searchParams.delete('upgrade');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  }, [setUserTier]);

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

  const dismissUpgradeSuccess = useCallback(() => {
    setUpgradeSuccess(false);
  }, []);

  const value = {
    userTier, setUserTier, effectiveTier,
    checkFeature, requireFeature,
    showUpgradeModal, upgradeFeature, closeUpgradeModal,
    isOverridden: ADMIN_OVERRIDE !== 'none',
    tiers: TIERS,
    upgradeSuccess, dismissUpgradeSuccess,
  };

  return <TierContext.Provider value={value}>{children}</TierContext.Provider>;
}

export function useTier() {
  const ctx = useContext(TierContext);
  if (!ctx) throw new Error('useTier must be used within a TierProvider');
  return ctx;
}
