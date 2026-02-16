import React, { useState } from 'react';
import { Star, MapPin, DollarSign, CheckCircle, ExternalLink } from 'lucide-react';
import { vendorCategories, featuredVendors, getVendorsByCategory } from '../data/vendors';
import { useToast } from '../context/ToastContext';
import Header from './Header';
import Sprinkles from './Sprinkles';

export default function VendorMarketplace() {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const handleRequestQuote = (vendor) => {
    const subject = encodeURIComponent(`Party Quote Request - ${vendor.name}`);
    const body = encodeURIComponent(`Hi ${vendor.name},\n\nI'm planning a party and would like to request a quote for your services.\n\nPlease let me know your availability and pricing.\n\nThank you!`);
    window.open(`mailto:${vendor.email || 'contact@vendor.com'}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleSaveVendor = (vendor) => {
    try {
      const saved = JSON.parse(localStorage.getItem('pp_saved_vendors') || '[]');
      if (!saved.includes(vendor.id)) {
        saved.push(vendor.id);
        localStorage.setItem('pp_saved_vendors', JSON.stringify(saved));
        showToast(`${vendor.name} saved!`, 'success');
      } else {
        showToast(`${vendor.name} is already saved`, 'info');
      }
    } catch (error) {
      showToast('Failed to save vendor', 'error');
    }
  };

  const vendors = selectedCategory
    ? getVendorsByCategory(selectedCategory)
    : featuredVendors;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Sprinkles />
      <Header />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Vendor Marketplace</h2>
            <p className="text-gray-600">Find trusted vendors for your party</p>
          </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedCategory === null
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-200 hover:border-pink-300'
          }`}
        >
          <div className="text-2xl mb-1">🎉</div>
          <div className="font-semibold text-sm">All Vendors</div>
        </button>

        {vendorCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedCategory === cat.id
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-pink-300'
            }`}
          >
            <div className="text-2xl mb-1">{cat.icon}</div>
            <div className="font-semibold text-sm">{cat.name}</div>
          </button>
        ))}
      </div>

      {/* Vendor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map(vendor => (
          <div
            key={vendor.id}
            className="border-2 border-gray-200 rounded-lg p-4 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedVendor(vendor)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-800">{vendor.name}</h3>
                  {vendor.verified && (
                    <CheckCircle className="text-blue-500" size={16} />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>{vendor.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="font-semibold text-gray-800">{vendor.rating}</span>
                </div>
                <div className="text-xs text-gray-500">{vendor.reviews} reviews</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3">{vendor.description}</p>

            {/* Services */}
            <div className="flex flex-wrap gap-2 mb-3">
              {vendor.services.slice(0, 3).map((service, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                >
                  {service}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">{vendor.priceRange}</span>
              <button className="text-pink-600 hover:text-pink-700 font-semibold text-sm flex items-center gap-1">
                View Details
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVendor(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedVendor.name}
                </h2>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{selectedVendor.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500" fill="currentColor" />
                    <span>{selectedVendor.rating} ({selectedVendor.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-700 mb-6">{selectedVendor.description}</p>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Services Offered:</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedVendor.services.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <strong>Availability:</strong> {selectedVendor.availability}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Price Range:</strong> {selectedVendor.priceRange}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleRequestQuote(selectedVendor)}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Request Quote
              </button>
              <button
                onClick={() => handleSaveVendor(selectedVendor)}
                className="px-6 border-2 border-pink-500 text-pink-600 font-semibold rounded-lg hover:bg-pink-50 transition-all"
              >
                Save for Later
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
