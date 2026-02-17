import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, X, LogIn, Loader } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sendingReset, setSendingReset] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verify email exists in database
      const res = await fetch(`/api/users/get-tier?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (!data.verified) {
        setError('No account found with this email. Please start planning to create an account.');
        setLoading(false);
        return;
      }

      // Save email to localStorage
      localStorage.setItem('pp_user_email', email);
      localStorage.setItem('pp_user_tier', data.tier);
      localStorage.removeItem('pp_guest_mode');

      // Redirect to party planner
      navigate('/app');
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to log in. Please try again.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !email.includes('@')) {
      showToast('Please enter your email address first', 'warning');
      return;
    }

    setSendingReset(true);

    try {
      const res = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        showToast('Check your email for a password reset link!', 'success');
        onClose();
      } else {
        showToast('Failed to send reset email', 'error');
      }
    } catch (error) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSendingReset(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4">
            <LogIn className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">
            Enter your email to access your parties and account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="you@example.com"
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <>
                <LogIn size={20} />
                Continue
              </>
            )}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <button
            onClick={handleForgotPassword}
            disabled={sendingReset}
            className="text-sm text-gray-600 hover:text-pink-600 transition-colors disabled:opacity-50"
          >
            {sendingReset ? 'Sending...' : 'Forgot password? Reset it here'}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={() => {
                navigate('/app');
                onClose();
              }}
              className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
            >
              Start Planning
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
