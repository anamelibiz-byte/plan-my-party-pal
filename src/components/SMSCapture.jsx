import React, { useState } from 'react';
import { MessageCircle, Send, CheckCircle2, Sparkles } from 'lucide-react';

export default function SMSCapture({ source, partyData, mergedZones, excludedItems, zoneChecks, onPhoneUpdate }) {
  const [phone, setPhone] = useState(partyData.phone || '');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'
  const [error, setError] = useState('');

  // Phone validation
  const validatePhone = (phone) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setError('');
    setStatus('loading');

    // Update parent partyData with phone number
    if (onPhoneUpdate && partyData.phone !== phone) {
      onPhoneUpdate(phone);
    }

    try {
      // Build checklist from zones (similar to email logic)
      const checklist = [];

      if (mergedZones && Array.isArray(mergedZones)) {
        mergedZones.forEach(zone => {
          zone.allItems?.forEach(item => {
            const key = item._type === 'zone' ? item._zoneKey : `checklist-${item._checklistIdx}`;
            if (!excludedItems?.[key]) {
              checklist.push({
                task: item.task,
                category: item.category || zone.name,
                priority: item.priority || 'medium',
                completed: item._type === 'zone'
                  ? (zoneChecks?.[item._zoneKey] || false)
                  : (item.completed || false),
              });
            }
          });
        });
      }

      // Call SMS API
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          partyData,
          checklist,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
      } else {
        setError(data.error || 'Failed to send SMS. Please try again.');
        setStatus('idle');
      }
    } catch (err) {
      console.error('SMS error:', err);
      setError('Failed to send SMS. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="p-5 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl">
      {status !== 'success' ? (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-cyan-500" size={20} />
            <h3 className="font-bold text-gray-800">Text Your Checklist</h3>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">PRO</span>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Get your party checklist sent directly to your phone via text message
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500" size={20} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full pl-10 pr-4 py-3 border-2 border-cyan-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                disabled={status === 'loading'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-60 flex items-center gap-2"
            >
              <Send size={18} />
              {status === 'loading' ? 'Sending...' : 'Text It'}
            </button>
          </form>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
          <CheckCircle2 className="text-green-600 flex-shrink-0" size={24} />
          <div>
            <p className="font-bold text-green-800">Message sent!</p>
            <p className="text-sm text-green-700">Check your phone for your party checklist</p>
          </div>
        </div>
      )}
    </div>
  );
}
