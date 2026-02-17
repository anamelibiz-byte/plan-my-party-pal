import React, { useState, useEffect, useCallback } from 'react';
import {
  Star, MapPin, Phone, Globe, ExternalLink, Search,
  ChevronDown, X, Sparkles, Building2, Send, CheckCircle,
  Loader2, Crown
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Header from './Header';
import Sprinkles from './Sprinkles';

const CATEGORIES = [
  { id: 'entertainment', name: 'Entertainment', icon: '🎭', desc: 'Magicians, face painters, performers' },
  { id: 'venues',        name: 'Venues',         icon: '🏰', desc: 'Party halls, event spaces' },
  { id: 'catering',      name: 'Cakes & Catering',icon: '🎂', desc: 'Custom cakes, catering, desserts' },
  { id: 'photography',   name: 'Photography',     icon: '📸', desc: 'Photographers, photo booths' },
  { id: 'decorations',   name: 'Decorations',     icon: '🎈', desc: 'Balloon artists, decorators' },
  { id: 'rentals',       name: 'Rentals',          icon: '🎪', desc: 'Bounce houses, inflatables, tents' },
];

// ─── Featured Vendor Card (paid sponsored listings) ───────────────────────────
const FEATURED_VENDORS = [
  // Add real paying vendors here — example structure:
  // {
  //   id: 'featured-1',
  //   name: 'Amazing Party Co.',
  //   category: 'entertainment',
  //   tagline: 'Tampa Bay\'s #1 Kids Party Entertainer',
  //   description: 'Magic shows, balloon twisting, face painting for ages 2–12.',
  //   location: 'Tampa, FL',
  //   phone: '(813) 555-0100',
  //   website: 'https://amazingpartyco.com',
  //   rating: 5.0,
  //   reviews: 87,
  //   priceRange: '$$',
  //   badge: 'Top Rated',
  // },
];

function StarRating({ rating, count }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1">
      <Star size={14} className="text-yellow-400 fill-yellow-400" />
      <span className="font-semibold text-gray-800 text-sm">{rating.toFixed(1)}</span>
      {count > 0 && <span className="text-gray-400 text-xs">({count.toLocaleString()})</span>}
    </div>
  );
}

function VendorCard({ vendor, onSelect, saved, onSave }) {
  const isOpen = vendor.isOpen;
  return (
    <div
      className="bg-white rounded-xl border-2 border-gray-100 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer p-4 flex flex-col gap-3"
      onClick={() => onSelect(vendor)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 truncate">{vendor.name}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <MapPin size={11} />
            <span className="truncate">{vendor.address?.split(',').slice(0, 2).join(',') || vendor.distance}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StarRating rating={vendor.rating} count={vendor.totalRatings} />
          {vendor.distance && (
            <span className="text-xs text-gray-400">{vendor.distance}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOpen === true && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Open now</span>
          )}
          {isOpen === false && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Closed</span>
          )}
          {vendor.priceRange && (
            <span className="text-xs text-gray-500 font-medium">{vendor.priceRange}</span>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onSave(vendor); }}
          className={`text-xs px-3 py-1 rounded-full font-semibold border transition-all ${
            saved
              ? 'bg-pink-100 text-pink-600 border-pink-300'
              : 'border-gray-200 text-gray-500 hover:border-pink-300 hover:text-pink-500'
          }`}
        >
          {saved ? '♥ Saved' : '♡ Save'}
        </button>
      </div>
    </div>
  );
}

function FeaturedVendorCard({ vendor, onSelect }) {
  return (
    <div
      className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border-2 border-pink-300 shadow-md cursor-pointer p-4 flex flex-col gap-3 relative overflow-hidden"
      onClick={() => onSelect(vendor)}
    >
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
        <Crown size={10} /> Featured
      </div>
      <div className="pr-20">
        <h3 className="font-bold text-gray-800">{vendor.name}</h3>
        {vendor.tagline && <p className="text-xs text-pink-600 font-semibold mt-0.5">{vendor.tagline}</p>}
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <MapPin size={11} /><span>{vendor.location}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600">{vendor.description}</p>
      <div className="flex items-center gap-3">
        <StarRating rating={vendor.rating} count={vendor.reviews} />
        {vendor.priceRange && <span className="text-xs text-gray-500">{vendor.priceRange}</span>}
        {vendor.badge && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">⭐ {vendor.badge}</span>
        )}
      </div>
    </div>
  );
}

// ─── Vendor Detail Modal ───────────────────────────────────────────────────────
function VendorModal({ vendor, onClose, saved, onSave }) {
  if (!vendor) return null;

  const googleMapsUrl = vendor.placeId
    ? `https://www.google.com/maps/place/?q=place_id:${vendor.placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.name + ' ' + vendor.address)}`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-start justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{vendor.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={vendor.rating} count={vendor.totalRatings || vendor.reviews} />
              {vendor.priceRange && <span className="text-sm text-gray-500">{vendor.priceRange}</span>}
              {vendor.isOpen === true && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Open now</span>}
              {vendor.isOpen === false && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Closed</span>}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Address */}
          {vendor.address && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-pink-400 mt-0.5 shrink-0" />
              <span>{vendor.address}</span>
            </div>
          )}

          {/* Phone */}
          {vendor.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone size={16} className="text-purple-400 shrink-0" />
              <a href={`tel:${vendor.phone}`} className="text-purple-600 font-semibold hover:underline">{vendor.phone}</a>
            </div>
          )}

          {/* Website */}
          {vendor.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe size={16} className="text-blue-400 shrink-0" />
              <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{vendor.website.replace(/^https?:\/\//, '')}</a>
            </div>
          )}

          {/* Distance */}
          {vendor.distance && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} className="text-gray-300 shrink-0" />
              <span>{vendor.distance} from your party location</span>
            </div>
          )}

          {/* Description (featured vendors) */}
          {vendor.description && (
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{vendor.description}</p>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <ExternalLink size={16} />
              View on Google Maps
            </a>
            {vendor.phone && (
              <a
                href={`tel:${vendor.phone}`}
                className="w-full flex items-center justify-center gap-2 border-2 border-purple-400 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all"
              >
                <Phone size={16} />
                Call Now
              </a>
            )}
            <button
              onClick={() => onSave(vendor)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold border-2 transition-all ${
                saved
                  ? 'bg-pink-100 text-pink-600 border-pink-300'
                  : 'border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-500'
              }`}
            >
              {saved ? '♥ Saved to My List' : '♡ Save for Later'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── List Your Business Form ───────────────────────────────────────────────────
function ListYourBusinessModal({ onClose }) {
  const [form, setForm] = useState({ businessName: '', ownerName: '', category: '', city: '', state: '', email: '', phone: '', website: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/vendor-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Failed to send. Please email us at hello@partyplann.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-800">List Your Business</h2>
            <p className="text-sm text-gray-500">Reach thousands of parents planning parties</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">You're on the list! 🎉</h3>
            <p className="text-gray-600 mb-6">We'll review your info and reach out within 1–2 business days about featured listing options.</p>
            <button onClick={onClose} className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4">
            {/* Pricing banner */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Crown size={16} className="text-pink-500" />
                <span className="font-bold text-gray-800">Featured Listings from $29/month</span>
              </div>
              <p className="text-sm text-gray-600">Get a premium card at the top of results for your category + zip code. We'll reach out with details after you submit.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Business Name *</label>
                <input required value={form.businessName} onChange={e => setForm(f => ({...f, businessName: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-pink-400" placeholder="e.g. Amazing Party Co." />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Your Name</label>
                <input value={form.ownerName} onChange={e => setForm(f => ({...f, ownerName: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-pink-400" placeholder="First & last name" />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Category *</label>
                <select required value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-white">
                  <option value="">Select a category...</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">City *</label>
                <input required value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-pink-400" placeholder="Tampa" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">State</label>
                <input value={form.state} onChange={e => setForm(f => ({...f, state: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-pink-400" placeholder="FL" maxLength={2} />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Email Address *</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-pink-400" placeholder="you@yourbusiness.com" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-pink-400" placeholder="(555) 000-0000" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Website</label>
                <input type="url" value={form.website} onChange={e => setForm(f => ({...f, website: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-pink-400" placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Tell us about your business</label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                  rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-pink-400 resize-none"
                  placeholder="Services offered, years of experience, what makes you special..." />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />}
              {loading ? 'Sending...' : 'Submit Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function VendorMarketplace() {
  const { showToast } = useToast();

  // Get party location from localStorage
  const getPartyLocation = () => {
    try {
      const data = JSON.parse(localStorage.getItem('pp_party_data') || '{}');
      return data.location || '';
    } catch { return ''; }
  };

  const [selectedCategory, setSelectedCategory] = useState('entertainment');
  const [location, setLocation] = useState(getPartyLocation);
  const [locationInput, setLocationInput] = useState(getPartyLocation);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showListModal, setShowListModal] = useState(false);
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pp_saved_vendors') || '[]'); } catch { return []; }
  });

  // Featured vendors for this category
  const featuredForCategory = FEATURED_VENDORS.filter(v => v.category === selectedCategory);

  const searchVendors = useCallback(async (loc, cat) => {
    if (!loc) return;
    setLoading(true);
    setError('');
    setVendors([]);
    try {
      const params = new URLSearchParams({ location: loc, category: cat });
      const res = await fetch(`/api/vendors?${params}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setVendors(data.results || []);
        setSearched(true);
      }
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search when category changes (if we have a location)
  useEffect(() => {
    if (location) {
      searchVendors(location, selectedCategory);
    }
  }, [selectedCategory, location, searchVendors]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!locationInput.trim()) return;
    setLocation(locationInput.trim());
    searchVendors(locationInput.trim(), selectedCategory);
  };

  const handleSave = (vendor) => {
    const id = vendor.id || vendor.placeId;
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id];
      localStorage.setItem('pp_saved_vendors', JSON.stringify(next));
      showToast(prev.includes(id) ? 'Removed from saved' : `${vendor.name} saved!`, prev.includes(id) ? 'info' : 'success');
      return next;
    });
  };

  const currentCategory = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Sprinkles />
      <Header />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎪 Vendor Marketplace
          </h1>
          <p className="text-gray-600">Find trusted local vendors for your party — real businesses near you</p>
        </div>

        {/* Location Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3">
              <MapPin size={18} className="text-pink-400 shrink-0" />
              <input
                value={locationInput}
                onChange={e => setLocationInput(e.target.value)}
                placeholder="Enter your city, state or ZIP code..."
                className="flex-1 text-sm focus:outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            <button type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-md transition-all">
              <Search size={16} />
              Search
            </button>
          </div>
          {location && !loading && (
            <p className="text-center text-xs text-gray-400 mt-2">Showing results near <span className="font-semibold text-gray-600">{location}</span></p>
          )}
        </form>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-pink-300'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Featured vendors (paid) */}
        {featuredForCategory.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Crown size={14} className="text-pink-400" /> Featured Partners
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredForCategory.map(v => (
                <FeaturedVendorCard key={v.id} vendor={v} onSelect={setSelectedVendor} />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!location && !loading && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Enter your location to find vendors</h3>
            <p className="text-gray-500 text-sm">We'll show you real local businesses near your party</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 size={32} className="text-pink-400 animate-spin" />
            <p className="text-gray-500 text-sm">Finding {currentCategory?.name.toLowerCase()} vendors near you...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">😕</div>
            <p className="text-gray-600 font-semibold">{error}</p>
            <p className="text-gray-400 text-sm mt-1">Try a different city name or ZIP code</p>
          </div>
        )}

        {!loading && !error && searched && vendors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-600 font-semibold">No vendors found in this area</p>
            <p className="text-gray-400 text-sm mt-1">Try expanding your search to a nearby city</p>
          </div>
        )}

        {!loading && vendors.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
              {vendors.length} {currentCategory?.name} vendors near {location}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vendors.map(v => (
                <VendorCard
                  key={v.id}
                  vendor={v}
                  onSelect={setSelectedVendor}
                  saved={savedIds.includes(v.id)}
                  onSave={handleSave}
                />
              ))}
            </div>
          </div>
        )}

        {/* List Your Business CTA */}
        <div className="mt-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white text-center">
          <div className="flex justify-center mb-3">
            <Sparkles size={28} />
          </div>
          <h3 className="text-xl font-bold mb-2">Are you a party vendor?</h3>
          <p className="text-pink-100 text-sm mb-4 max-w-md mx-auto">
            Get featured in front of thousands of parents planning birthday parties in your area. Featured listings start at just $29/month.
          </p>
          <button
            onClick={() => setShowListModal(true)}
            className="bg-white text-pink-600 font-bold px-8 py-3 rounded-xl hover:bg-pink-50 transition-all shadow-lg"
          >
            List Your Business →
          </button>
        </div>
      </div>

      {/* Modals */}
      {selectedVendor && (
        <VendorModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          saved={savedIds.includes(selectedVendor.id || selectedVendor.placeId)}
          onSave={handleSave}
        />
      )}
      {showListModal && <ListYourBusinessModal onClose={() => setShowListModal(false)} />}
    </div>
  );
}
