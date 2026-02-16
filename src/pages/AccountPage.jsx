import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Crown,
  Star,
  Mail,
  LogOut,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { useTier } from '../context/TierContext';
import Sprinkles from '../components/Sprinkles';
import Header from '../components/Header';

export default function AccountPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { requireFeature } = useTier();

  const [userEmail, setUserEmail] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const email = localStorage.getItem('pp_user_email');
    const guestMode = localStorage.getItem('pp_guest_mode') === 'true';

    if (!email || guestMode) {
      // Redirect to app with auth required message
      navigate('/app?auth=required');
      return;
    }

    setUserEmail(email);
  }, [navigate]);

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      const email = localStorage.getItem('pp_user_email');
      if (!email) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/users/get-tier?email=${encodeURIComponent(email)}`);
        const data = await res.json();

        setSubscriptionData({
          tier: data.tier || 'free',
          status: data.subscription_status,
          renewalDate: data.subscription_end,
          verified: data.verified,
        });
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
        // Fall back to localStorage
        setSubscriptionData({
          tier: localStorage.getItem('pp_user_tier') || 'free',
          status: null,
          renewalDate: null,
          verified: false,
        });
        setError('Could not load latest subscription data. Showing cached information.');
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchSubscription();
    }
  }, [userEmail]);

  // Handle portal success return
  useEffect(() => {
    const portalSuccess = searchParams.get('portal') === 'success';
    if (portalSuccess) {
      setShowSuccessMessage(true);
      // Re-fetch subscription data
      const refetch = async () => {
        const email = localStorage.getItem('pp_user_email');
        if (!email) return;

        try {
          const res = await fetch(`/api/users/get-tier?email=${encodeURIComponent(email)}`);
          const data = await res.json();
          setSubscriptionData({
            tier: data.tier || 'free',
            status: data.subscription_status,
            renewalDate: data.subscription_end,
            verified: data.verified,
          });
        } catch (err) {
          console.error('Failed to re-fetch:', err);
        }
      };
      refetch();

      // Auto-dismiss after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [searchParams]);

  const handleManageBilling = async () => {
    setLoadingPortal(true);
    setError(null);

    try {
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await res.json();

      if (data.url) {
        // Redirect to Stripe portal
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to access billing portal');
        setLoadingPortal(false);
      }
    } catch (err) {
      console.error('Portal error:', err);
      setError('Failed to access billing portal. Please try again.');
      setLoadingPortal(false);
    }
  };

  const handleUpgradeToPro = () => {
    // Trigger existing UpgradeModal
    requireFeature('downloadPDF');
  };

  const handleLogout = () => {
    localStorage.removeItem('pp_user_email');
    localStorage.removeItem('pp_user_tier');
    localStorage.removeItem('pp_guest_mode');
    navigate('/');
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    if (!status) return null;

    const badges = {
      active: { text: 'Active', color: 'bg-green-100 text-green-800 border-green-200' },
      past_due: { text: 'Past Due', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      canceled: { text: 'Canceled', color: 'bg-red-100 text-red-800 border-red-200' },
      incomplete: { text: 'Incomplete', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const badge = badges[status] || badges.active;

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (!userEmail) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Sprinkles />
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
              <div>
                <p className="font-bold text-green-800">Your billing has been updated!</p>
                <p className="text-sm text-green-700">
                  Changes may take a few moments to reflect here.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          )}

          {/* Page Header */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Settings</h1>
            <p className="text-gray-600">Manage your membership and billing</p>
          </div>

          {/* Subscription Status Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin text-pink-500" size={32} />
              </div>
            ) : subscriptionData?.tier === 'pro' ? (
              // Pro User View
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Crown size={20} />
                    <span className="font-bold">Pro Member</span>
                  </div>
                  {subscriptionData.status && getStatusBadge(subscriptionData.status)}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CreditCard className="text-pink-500 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-700">Plan</p>
                      <p className="text-gray-600">Pro - $4.99/month or $29.99/year</p>
                    </div>
                  </div>

                  {subscriptionData.renewalDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="text-pink-500 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-gray-700">Next Billing Date</p>
                        <p className="text-gray-600">{formatDate(subscriptionData.renewalDate)}</p>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4 mt-4">
                    <p className="font-semibold text-gray-700 mb-2">Pro Features:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="text-green-500" size={18} />
                        Unlimited parties
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="text-green-500" size={18} />
                        Unlimited guests
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="text-green-500" size={18} />
                        All premium features
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={handleManageBilling}
                  disabled={loadingPortal}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingPortal ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Manage Billing
                    </>
                  )}
                </button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Update payment method, view invoices, or cancel subscription
                </p>
              </>
            ) : (
              // Free User View
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-2 rounded-full flex items-center gap-2">
                    <Star size={20} />
                    <span className="font-bold">Free Plan</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-gray-600">Current limits:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      1 party at a time
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      Up to 15 guests
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      Basic features only
                    </li>
                  </ul>

                  <div className="border-t pt-4 mt-4">
                    <p className="font-semibold text-gray-700 mb-2">Upgrade to unlock:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-gray-600">
                        <Crown className="text-pink-500" size={18} />
                        Unlimited parties & guests
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <Crown className="text-pink-500" size={18} />
                        Day-of timeline builder
                      </li>
                      <li className="flex items-center gap-2 text-gray-600">
                        <Crown className="text-pink-500" size={18} />
                        PDF export & email features
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={handleUpgradeToPro}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-4 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
                >
                  <Crown size={24} />
                  Upgrade to Pro
                </button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Only $4.99/month or $29.99/year
                </p>
              </>
            )}
          </div>

          {/* Account Information Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
            <div className="flex items-center gap-3">
              <Mail className="text-pink-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="font-semibold text-gray-800">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50/50 border-2 border-red-300 rounded-3xl shadow-xl p-6 md:p-8">
            <h2 className="text-xl font-semibold text-red-800 mb-4">Logout</h2>
            <p className="text-gray-600 mb-4">
              Logout from your account. You can sign back in anytime with your email.
            </p>
            <button
              onClick={handleLogout}
              className="bg-white border-2 border-red-300 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
