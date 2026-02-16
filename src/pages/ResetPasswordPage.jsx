import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import Sprinkles from '../components/Sprinkles';
import { useToast } from '../context/ToastContext';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [email, setEmail] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      return;
    }

    // Verify the reset token
    const verifyToken = async () => {
      try {
        const res = await fetch('/api/auth/verify-reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setEmail(data.email);

          // Auto-login user
          localStorage.setItem('pp_user_email', data.email);

          // Get their tier
          const tierRes = await fetch(`/api/users/get-tier?email=${encodeURIComponent(data.email)}`);
          const tierData = await tierRes.json();
          localStorage.setItem('pp_user_tier', tierData.tier || 'free');
          localStorage.removeItem('pp_guest_mode');

          showToast('Successfully logged in!', 'success');

          // Redirect after 2 seconds
          setTimeout(() => {
            navigate('/app');
          }, 2000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    verifyToken();
  }, [searchParams, navigate, showToast]);

  const handleRequestReset = async (e) => {
    e.preventDefault();

    if (!requestEmail || !requestEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setSending(true);

    try {
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: requestEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast('Check your email for the login link!', 'success');
        setRequestEmail('');
      } else {
        showToast(data.error || 'Failed to send reset email', 'error');
      }
    } catch (error) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Sprinkles />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
          {status === 'verifying' && (
            <div className="text-center">
              <div className="mb-6">
                <Loader2 className="mx-auto text-pink-500 animate-spin" size={64} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Verifying Your Link...
              </h1>
              <p className="text-gray-600">
                Please wait while we sign you in.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="bg-green-100 rounded-full p-4 inline-block">
                  <CheckCircle className="text-green-600" size={64} />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-4">
                Welcome Back! 🎉
              </h1>
              <p className="text-gray-700 mb-2">
                You've been successfully logged in.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting you to your parties...
              </p>
              <button
                onClick={() => navigate('/app')}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all"
              >
                Go to App Now
              </button>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div className="text-center mb-6">
                <div className="bg-red-100 rounded-full p-4 inline-block mb-4">
                  <XCircle className="text-red-600" size={64} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Link Expired
                </h1>
                <p className="text-gray-600 mb-6">
                  This login link has expired or is invalid. Request a new one below.
                </p>
              </div>

              {/* Request New Link Form */}
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={requestEmail}
                      onChange={(e) => setRequestEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    'Send New Login Link'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
