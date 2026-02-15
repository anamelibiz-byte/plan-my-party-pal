import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TIERS, hasFeature, getEffectiveTier, ADMIN_OVERRIDE } from '../config/tiers';
import useLocalStorage from '../hooks/useLocalStorage';

const TierContext = createContext(null);

export function TierProvider({ children }) {
  const [userTier, setUserTier] = useLocalStorage('pp_user_tier', 'free');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [tierVerified, setTierVerified] = useState(false);

  // Verify tier from database on mount
  useEffect(() => {
    const verifyTierFromDatabase = async () => {
      const email = localStorage.getItem('pp_user_email');

      // No email = guest mode = free tier
      if (!email) {
        setTierVerified(true);
        return;
      }

      try {
        const response = await fetch(`/api/users/get-tier?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (data.tier && data.tier !== userTier) {
          console.log('📊 Tier synced from database:', data.tier);
          setUserTier(data.tier);
        }
      } catch (error) {
        console.error('Failed to verify tier:', error);
        // On error, trust localStorage (offline-first)
      } finally {
        setTierVerified(true);
      }
    };

    verifyTierFromDatabase();
  }, []); // Run once on mount

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
    tierVerified,
  };

  return <TierContext.Provider value={value}>{children}</TierContext.Provider>;
}

export function useTier() {
  const ctx = useContext(TierContext);
  if (!ctx) throw new Error('useTier must be used within a TierProvider');
  return ctx;
}
