import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Sparkles } from 'lucide-react';

// Build an HTML email body from partyData + zones
function buildChecklistHTML(partyData, zones, excludedItems, zoneChecks) {
  const header = `
    <div style="background: linear-gradient(135deg, #EC4899, #F43F5E); padding: 24px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="color: white; font-size: 24px; margin: 0;">🎉 ${partyData.childName || 'Your'}'s ${partyData.theme || 'Birthday'} Party Plan</h1>
      <p style="color: #FBB6CE; margin: 8px 0 0;">Created with Plan My Party Pal</p>
    </div>
  `;

  const details = `
    <div style="padding: 16px 24px; background: #FFF1F2; border-bottom: 1px solid #FECDD3;">
      <p style="margin: 4px 0; font-size: 14px; color: #374151;">
        📅 <strong>Date:</strong> ${partyData.date || 'TBD'}
        ${partyData.partyTime ? ` at ${partyData.partyTime}` : ''}
        &nbsp;&nbsp; 👥 <strong>Guests:</strong> ${partyData.guestCount || '?'}
        &nbsp;&nbsp; 💰 <strong>Budget:</strong> $${partyData.budget || '?'}
      </p>
      ${partyData.venueName ? `<p style="margin: 4px 0; font-size: 14px; color: #374151;">📍 <strong>Venue:</strong> ${partyData.venueName}${partyData.venueAddress ? ` — ${partyData.venueAddress}` : ''}</p>` : ''}
      ${partyData.selectedActivities?.length ? `<p style="margin: 4px 0; font-size: 14px; color: #374151;">🎨 <strong>Activities:</strong> ${partyData.selectedActivities.join(', ')}</p>` : ''}
    </div>
  `;

  // Build zones
  const zoneColors = {
    rose: '#FFF1F2', blue: '#EFF6FF', amber: '#FFFBEB', cyan: '#ECFEFF',
    pink: '#FDF2F8', violet: '#F5F3FF', orange: '#FFF7ED', gray: '#F9FAFB',
  };
  const zoneTextColors = {
    rose: '#BE123C', blue: '#1D4ED8', amber: '#B45309', cyan: '#0E7490',
    pink: '#BE185D', violet: '#6D28D9', orange: '#C2410C', gray: '#374151',
  };

  let zonesHTML = '';
  (zones || []).forEach(zone => {
    const activeItems = (zone.allItems || zone.items || []).filter(item => {
      const key = item._zoneKey || `${zone.id}-${item.task}`;
      return !excludedItems?.[key];
    });
    if (!activeItems.length) return;

    const bgColor = zoneColors[zone.color] || '#F9FAFB';
    const textColor = zoneTextColors[zone.color] || '#374151';

    zonesHTML += `
      <div style="margin: 12px 24px; padding: 16px; background: ${bgColor}; border-radius: 12px; border: 1px solid #E5E7EB;">
        <h3 style="color: ${textColor}; font-size: 16px; margin: 0 0 10px;">${zone.emoji} ${zone.name}</h3>
    `;
    activeItems.forEach(item => {
      const isChecked = item._type === 'zone'
        ? (zoneChecks?.[item._zoneKey] || false)
        : (item.completed || false);
      const box = isChecked ? '☑' : '☐';
      const cost = item.estimatedCost ? ` <span style="color: #059669; font-size: 12px;">(${item.estimatedCost})</span>` : '';
      zonesHTML += `<p style="margin: 4px 0; font-size: 14px; color: #374151;">${box} ${item.task}${cost}</p>`;
    });
    zonesHTML += `</div>`;
  });

  const footer = `
    <div style="padding: 20px 24px; text-align: center; background: #FDF2F8; border-radius: 0 0 16px 16px;">
      <p style="font-size: 12px; color: #9CA3AF; margin: 0;">✨ Made with <a href="https://planmypartypal.com" style="color: #EC4899; text-decoration: none; font-weight: bold;">PlanMyPartyPal.com</a></p>
    </div>
  `;

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
      ${header}
      ${details}
      ${zonesHTML}
      ${footer}
    </div>
  `;
}

// Build plain text version
function buildChecklistText(partyData, zones, excludedItems, zoneChecks) {
  const l = [];
  l.push(`🎂 ${partyData.childName || 'Your'}'s ${partyData.theme || 'Birthday'} Party Plan`);
  l.push(`📅 Date: ${partyData.date || 'TBD'}${partyData.partyTime ? ` at ${partyData.partyTime}` : ''}`);
  l.push(`👥 Guests: ${partyData.guestCount || '?'} | 💰 Budget: $${partyData.budget || '?'}`);
  if (partyData.venueName) l.push(`📍 Venue: ${partyData.venueName}`);
  l.push('─'.repeat(50));

  (zones || []).forEach(zone => {
    const activeItems = (zone.allItems || zone.items || []).filter(item => {
      const key = item._zoneKey || `${zone.id}-${item.task}`;
      return !excludedItems?.[key];
    });
    if (!activeItems.length) return;
    l.push(`\n${zone.emoji} ${zone.name.toUpperCase()}`);
    activeItems.forEach(item => {
      const isChecked = item._type === 'zone'
        ? (zoneChecks?.[item._zoneKey] || false)
        : (item.completed || false);
      const box = isChecked ? '☑' : '☐';
      const cost = item.estimatedCost ? ` (${item.estimatedCost})` : '';
      l.push(`  ${box} ${item.task}${cost}`);
    });
  });

  l.push(`\n${'─'.repeat(50)}`);
  l.push('Made with PlanMyPartyPal.com ✨');
  return l.join('\n');
}

export default function EmailCapture({ source = 'landing', partyData, mergedZones, excludedItems, zoneChecks }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setStatus('loading');
    setError('');

    try {
      if (source === 'checklist' && mergedZones) {
        // Actually send the checklist via email
        const htmlBody = buildChecklistHTML(partyData, mergedZones, excludedItems, zoneChecks);
        const textBody = buildChecklistText(partyData, mergedZones, excludedItems, zoneChecks);

        const res = await fetch('/api/send-checklist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            subject: `🎉 ${partyData?.childName || 'Your'}'s ${partyData?.theme || 'Birthday'} Party Checklist`,
            html: htmlBody,
            text: textBody,
          }),
        });
        if (res.ok) {
          setStatus('success');
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to send email');
        }
      } else {
        // Just subscribe (landing page)
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, source, partyData: partyData || null }),
        });
        if (res.ok) {
          setStatus('success');
        } else {
          throw new Error('Failed to subscribe');
        }
      }

      // Save locally too
      const existing = JSON.parse(localStorage.getItem('pp_email_subscribers') || '[]');
      existing.push({ email, source, date: new Date().toISOString() });
      localStorage.setItem('pp_email_subscribers', JSON.stringify(existing));
    } catch (err) {
      // If send failed, show error
      if (source === 'checklist') {
        setError(err.message || 'Could not send email. Please try again.');
        setStatus('idle');
        return;
      }
      // For subscribe, save locally as fallback
      const existing = JSON.parse(localStorage.getItem('pp_email_subscribers') || '[]');
      existing.push({ email, source, date: new Date().toISOString() });
      localStorage.setItem('pp_email_subscribers', JSON.stringify(existing));
      setStatus('success');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
        <CheckCircle2 className="text-green-500 flex-shrink-0" size={24} />
        <div>
          <p className="font-bold text-green-700">
            {source === 'checklist' ? 'Checklist sent!' : 'You\'re on the list!'}
          </p>
          <p className="text-sm text-green-600">
            {source === 'checklist'
              ? `Check your inbox at ${email} for your complete party plan.`
              : 'We\'ll send you party planning tips and updates.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-pink-500" size={20} />
        <h4 className="font-bold text-gray-800">
          {source === 'checklist' ? '📧 Email Your Checklist' : 'Get Party Planning Tips!'}
        </h4>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        {source === 'checklist'
          ? 'Enter your email and we\'ll send your complete party plan — checklist, zones, costs, and all!'
          : 'Join 1,000+ parents who plan amazing parties. Get tips, themes & deals.'}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-3 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {status === 'loading' ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Send size={18} /> {source === 'checklist' ? 'Email It' : 'Send'}</>
          )}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2 font-semibold">{error}</p>}
    </div>
  );
}
