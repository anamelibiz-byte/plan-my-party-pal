import React, { useState, useEffect } from 'react';
import { ChevronRight, Mail, CheckCircle2, Sparkles } from 'lucide-react';

export default function EmailGate({ partyData, onContinue, onGuestContinue }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track page view on mount
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'email_gate_viewed', {
        event_category: 'email_gate',
        child_age: partyData.age,
        guest_count: partyData.guestCount,
      });
    }
  }, [partyData.age, partyData.guestCount]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      // Track validation error
      if (window.gtag) {
        window.gtag('event', 'email_submitted_error', {
          event_category: 'email_gate',
          event_label: 'invalid_email',
        });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Save email to backend/database
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'email_gate_step_1',
          partyData: {
            childName: partyData.childName,
            age: partyData.age,
            date: partyData.date,
            guestCount: partyData.guestCount,
            theme: partyData.theme,
            phone: partyData.phone,
          },
        }),
      });

      if (res.ok) {
        const result = await res.json();

        // Save email to localStorage
        localStorage.setItem('pp_user_email', email);
        localStorage.setItem('pp_guest_mode', 'false');

        // Save plan ID if returned (for future updates)
        if (result.planId) {
          localStorage.setItem('pp_plan_id', result.planId);
          console.log('✅ Plan ID saved:', result.planId);
        }

        // Track successful email submission
        if (window.gtag) {
          window.gtag('event', 'email_submitted_success', {
            event_category: 'email_gate',
            child_age: partyData.age,
            guest_count: partyData.guestCount,
          });
        }

        // Continue to next step
        onContinue(email);
      } else {
        throw new Error('Failed to save email');
      }
    } catch (err) {
      // If backend fails, save locally and continue anyway
      console.error('Email save error:', err);
      localStorage.setItem('pp_user_email', email);
      localStorage.setItem('pp_guest_mode', 'false');

      // Track successful email submission (even if backend failed)
      if (window.gtag) {
        window.gtag('event', 'email_submitted_success', {
          event_category: 'email_gate',
          child_age: partyData.age,
          guest_count: partyData.guestCount,
          backend_failed: true,
        });
      }

      onContinue(email);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestContinue = () => {
    localStorage.setItem('pp_guest_mode', 'true');
    localStorage.removeItem('pp_user_email');

    // Track guest mode selection
    if (window.gtag) {
      window.gtag('event', 'guest_continue_clicked', {
        event_category: 'email_gate',
        child_age: partyData.age,
        guest_count: partyData.guestCount,
      });
    }

    onGuestContinue();
  };

  const childName = partyData.childName || '';

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200 relative z-10">
      {/* Primary Headline */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-5 text-[#FF1493]">
        You're one step away from building {childName ? `${childName}'s` : 'the'} perfect party! 🎉
      </h2>

      {/* Subheading */}
      <p className="text-base font-semibold text-gray-800 mb-4">
        Enter your email to:
      </p>

      {/* Benefits List */}
      <div className="space-y-2 mb-6">
        {[
          'Browse venue options (parks, bowling, trampolines & more)',
          'Choose from 50+ themes',
          'Pick activities & get your shopping list',
          'Save everything so you can finish later',
        ].map((benefit, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <CheckCircle2 className="text-[#FF69B4] flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed">{benefit}</p>
          </div>
        ))}
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmailSubmit} className="mb-6">
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            onFocus={() => {
              // Track when user starts typing email
              if (window.gtag && !email) {
                window.gtag('event', 'email_entered', {
                  event_category: 'email_gate',
                });
              }
            }}
            placeholder="Enter your email"
            className={`w-full max-w-md mx-auto block px-4 py-3 border-2 rounded-lg text-base focus:outline-none focus:ring-4 transition-all ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                : 'border-gray-300 focus:border-[#FF1493] focus:ring-rose-100'
            }`}
            style={{ height: '48px' }}
          />
          {error && (
            <p className="text-sm text-red-600 mt-2 text-center font-semibold">{error}</p>
          )}
        </div>

        {/* Primary CTA Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full max-w-md mx-auto block bg-[#FF1493] hover:bg-[#DC1476] text-white font-bold text-base sm:text-lg py-3.5 px-8 rounded-lg transition-all shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          style={{ marginTop: '16px' }}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Show Me Venue Options</span>
              <ChevronRight size={20} />
            </div>
          )}
        </button>
      </form>

      {/* Trust Signal */}
      <p className="text-xs sm:text-sm text-gray-500 italic text-center mb-4">
        We'll never spam you. Unsubscribe anytime.
      </p>

      {/* Social Proof (Optional) */}
      <p className="text-sm text-green-600 font-semibold text-center mb-6">
        Join 5,000+ moms planning stress-free parties 🎉
      </p>

      {/* Divider */}
      <hr className="border-gray-200 my-6" />

      {/* Guest Option */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">Not ready to commit?</p>
        <button
          onClick={handleGuestContinue}
          className="text-sm text-gray-600 underline hover:text-gray-800 transition-colors font-medium"
        >
          Continue as Guest (won't be saved)
        </button>
      </div>
    </div>
  );
}
