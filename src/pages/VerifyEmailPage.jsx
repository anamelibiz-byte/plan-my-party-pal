import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import Sprinkles from '../components/Sprinkles';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email and try again.');
      return;
    }

    // Verify the email
    const verifyEmail = async () => {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(data.message);
          setEmail(data.email);

          // Auto-redirect to app after 3 seconds
          setTimeout(() => {
            navigate('/app');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleResendEmail = async () => {
    if (!email) return;

    try {
      await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      setMessage('New verification email sent! Please check your inbox.');
    } catch (error) {
      setMessage('Failed to resend email. Please try again.');
    }
  };

  return (
    <>
      <Sprinkles />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
          {status === 'verifying' && (
            <>
              <div className="mb-6">
                <Loader2 className="mx-auto text-pink-500 animate-spin" size={64} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Verifying Your Email...
              </h1>
              <p className="text-gray-600">
                Please wait while we confirm your email address.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-6">
                <div className="bg-green-100 rounded-full p-4 inline-block">
                  <CheckCircle className="text-green-600" size={64} />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-4">
                Email Verified! 🎉
              </h1>
              <p className="text-gray-700 mb-6">
                {message}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting you to the app in 3 seconds...
              </p>
              <button
                onClick={() => navigate('/app')}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all"
              >
                Go to App Now
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-6">
                <div className="bg-red-100 rounded-full p-4 inline-block">
                  <XCircle className="text-red-600" size={64} />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Verification Failed
              </h1>
              <p className="text-gray-700 mb-6">
                {message}
              </p>

              <div className="space-y-3">
                {email && (
                  <button
                    onClick={handleResendEmail}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Mail size={20} />
                    Resend Verification Email
                  </button>
                )}
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
