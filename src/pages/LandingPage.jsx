import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PartyPopper, CheckCircle2, Clock, Sparkles, Heart, Calendar, Users, DollarSign } from 'lucide-react';
import EmailCapture from '../components/EmailCapture';
import AuthModal from '../components/AuthModal';
import Header from '../components/Header';
import Testimonials from '../components/Testimonials';
import BusinessSocialLinks from '../components/BusinessSocialLinks';
import { TIERS } from '../config/tiers';

export default function LandingPage() {
  const [showChecklistPreview, setShowChecklistPreview] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleAuthSuccess = (email) => {
    // User logged in successfully
    setShowLoginModal(false);
    navigate('/app');
  };

  const handleUpgradeToPro = async () => {
    setIsUpgrading(true);
    const tier = TIERS.pro;

    console.log('🔵 Starting upgrade to Pro...', { priceId: tier.stripe_price_id });

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: tier.stripe_price_id,
          tier: 'pro'
        }),
      });

      const data = await res.json();
      console.log('🔵 Checkout API response:', data);

      if (data.url) {
        // Redirect to Stripe checkout
        console.log('✅ Redirecting to Stripe:', data.url);
        window.location.href = data.url;
      } else if (data.message) {
        // Stripe not configured - go to app
        console.log('⚠️ Stripe not configured:', data.message);
        alert('Payment system not configured yet. Try the free version instead!');
        navigate('/app');
      } else if (data.error) {
        // Error occurred
        console.error('❌ Checkout error:', data.error);
        alert(`Error: ${data.error}\n\nPlease try the free version for now.`);
        navigate('/app');
      } else {
        // Unknown response
        console.error('❌ Unexpected response:', data);
        navigate('/app');
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      alert('Network error. Redirecting to free version...');
      navigate('/app');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md mb-6">
            <PartyPopper className="text-pink-500" size={20} />
            <span className="text-sm font-semibold text-gray-700">
              Join 1,000+ parents planning stress-free parties
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Plan Your Kid's<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
              Birthday Party
            </span>
            <br />
            in 10 Minutes
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The complete party planning toolkit that saves you time, money, and stress.
            From themes to checklists to guest management — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              to="/app"
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <Sparkles size={20} />
              Start Planning Free
            </Link>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-white text-pink-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all border-2 border-pink-300 hover:bg-pink-50"
            >
              Login
            </button>
            <button
              onClick={() => setShowChecklistPreview(true)}
              className="bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all border-2 border-gray-200"
            >
              See How It Works
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              <span>10-minute setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-pink-500" />
              <span>No credit card</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-8 border-white">
            <div className="aspect-video rounded-2xl overflow-hidden">
              <img
                src="/images/hero-party.jpg"
                alt="Happy mom and child celebrating birthday party with cake and friends playing in backyard"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl hidden items-center justify-center">
                <div className="text-center">
                  <PartyPopper size={80} className="text-pink-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Beautiful party planning interface</p>
                </div>
              </div>
            </div>
          </div>
          {/* Floating badges */}
          <div className="absolute -top-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
            ✓ Free Forever
          </div>
          <div className="absolute -bottom-4 -right-4 bg-purple-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
            ⚡ 10 Min Setup
          </div>
        </div>

        {/* Social Proof Examples */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Real Parties Planned with Plan My Party Pal
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sarah's Unicorn Party", theme: "Magical Unicorn", guests: 12, age: 5 },
              { name: "Jake's Superhero Bash", theme: "Superhero", guests: 18, age: 7 },
              { name: "Emma's Princess Tea", theme: "Princess", guests: 10, age: 4 }
            ].map((party, i) => (
              <div key={i} className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl border-2 border-pink-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {party.age}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{party.name}</h3>
                    <p className="text-sm text-gray-600">{party.theme} theme</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{party.guests} guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Capture Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full mb-4">
                <Sparkles className="text-white" size={28} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Get Your Free Party Planning Checklist
              </h2>
              <p className="text-gray-600">
                Join our community and get instant access to the Ultimate Birthday Party Checklist PDF —
                plus exclusive tips, theme ideas, and deals delivered to your inbox.
              </p>
            </div>
            <EmailCapture source="landing" />
            <p className="text-xs text-gray-500 text-center mt-4">
              We respect your privacy. Unsubscribe anytime. No spam, just party magic.
            </p>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Start free, upgrade only when you need more
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Free</h3>
                <div className="text-4xl font-black text-gray-900 mb-2">$0</div>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "Plan 1 party at a time with up to 15 guests",
                  "Complete party checklist builder",
                  "Custom invitations (create, download, share)",
                  "Guest list management with RSVP tracking",
                  "80+ curated gift ideas with Amazon links",
                  "Cake ordering resources & party help hiring",
                  "Access to all 60+ party themes",
                  "100+ age-appropriate activities",
                  "Party zones planner (view only)",
                  "Basic budget tracker (view only)"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/app"
                className="block w-full bg-gray-100 text-gray-800 text-center py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl shadow-2xl p-8 border-4 border-pink-300 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full font-bold text-sm shadow-lg">
                MOST POPULAR
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="text-white mb-2">
                  <span className="text-4xl font-black">$4.99</span>
                  <span className="text-lg">/month</span>
                </div>
                <p className="text-pink-100">Everything you need + more</p>
                <div className="mt-2 text-sm text-pink-100">
                  or $29.99/year (save $30!)
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Free, PLUS:",
                  "Unlimited parties with unlimited guests",
                  "Day-of Timeline Builder (minute-by-minute schedule)",
                  "Download party plans (PDF, TXT formats)",
                  "Print entire party checklist",
                  "Email party plans to yourself or co-hosts",
                  "SMS party plans to your phone",
                  "Share checklists via text/email/social",
                  "Full budget analytics with spending breakdown"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleUpgradeToPro}
                disabled={isUpgrading}
                className="w-full bg-white text-pink-600 text-center py-3 rounded-xl font-bold hover:shadow-2xl transition-all disabled:opacity-50"
              >
                {isUpgrading ? 'Loading...' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Everything You Need to Plan the Perfect Party
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Calendar, title: "5-Step Wizard", desc: "Answer 5 simple questions and get a custom party plan instantly" },
              { icon: Sparkles, title: "60+ Themes", desc: "From unicorns to superheroes — find the perfect theme for your child" },
              { icon: Users, title: "Guest Management", desc: "Track RSVPs, dietary needs, and send beautiful invitations" },
              { icon: CheckCircle2, title: "Smart Checklists", desc: "Never forget a detail with our intelligent party planning checklist" },
              { icon: DollarSign, title: "Budget Tracker", desc: "Stay on budget with real-time cost tracking and spending insights" },
              { icon: PartyPopper, title: "100+ Activities", desc: "Age-appropriate games and activities curated by party pros" }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      <div className="max-w-6xl mx-auto px-4">
        {/* Final CTA */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-black mb-4">Ready to Plan Your Party?</h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of parents who've ditched the stress and planned amazing parties in minutes.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
          >
            <PartyPopper size={20} />
            Start Planning Free — No Credit Card Required
          </Link>
        </div>
      </div>

      {/* Checklist Preview Modal */}
      {showChecklistPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowChecklistPreview(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-4">How It Works</h3>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-gray-800">Tell us about your party</h4>
                  <p className="text-gray-600">Child's name, age, date, budget, and guest count</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-gray-800">Pick a venue & theme</h4>
                  <p className="text-gray-600">Choose from 60+ themes and find the perfect location</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-gray-800">Select activities</h4>
                  <p className="text-gray-600">Get age-appropriate games and entertainment suggestions</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-bold text-gray-800">Get your custom checklist</h4>
                  <p className="text-gray-600">Complete party plan with timeline, budget, and shopping links</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">5</div>
                <div>
                  <h4 className="font-bold text-gray-800">Execute & celebrate!</h4>
                  <p className="text-gray-600">Track progress and enjoy a stress-free party day</p>
                </div>
              </li>
            </ol>
            <button
              onClick={() => setShowChecklistPreview(false)}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

        {/* Login Modal */}
        <AuthModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleAuthSuccess}
        />

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-20">
          <div className="container mx-auto px-4 py-6 md:py-8">
            {/* Social Media Icons */}
            <div className="mb-4">
              <BusinessSocialLinks />
            </div>

            <div className="flex flex-col items-center justify-center gap-3 md:flex-row md:justify-between md:gap-4">
              {/* Links - Show first on mobile */}
              <div className="flex items-center gap-4 md:gap-6 order-1 md:order-2">
                <a
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Terms of Use
                </a>
              </div>

              {/* Copyright - Show second on mobile */}
              <p className="text-gray-600 text-xs md:text-sm text-center order-2 md:order-1">
                © 2026 Plan My Party Pal. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
