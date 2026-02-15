import React, { useState } from 'react';
import { Send, Mail, Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  // Pre-made email templates (transactional tone to avoid spam filters)
  const emailTemplates = [
    {
      id: 1,
      name: 'New Themes',
      emoji: '🎨',
      subject: 'New party themes matching {{childName}}\'s interests',
      message: `We added some new party themes to your planner based on what other parents planning for kids this age enjoyed:

• Unicorn Dreams (magical & creative)
• Dinosaur Adventure (active & educational)
• Space Explorer (STEM-focused)
• Art Party (hands-on creativity)
• Baking Bonanza (interactive & tasty)

These are now available when you continue planning {{childName}}'s party. No pressure – just wanted to let you know they're there if helpful!`
    },
    {
      id: 2,
      name: 'Planning Update',
      emoji: '💡',
      subject: 'Your party planning progress for {{childName}}',
      message: `Just checking on {{childName}}'s party planning. We noticed you started but haven't finished yet.

Here's what you can still do:
• Browse venue options near you
• Pick activities for their age group
• Get your personalized shopping list
• Set up RSVPs and invitations

Your progress is saved, so you can pick up right where you left off anytime.`
    },
    {
      id: 3,
      name: 'Party Tips',
      emoji: '📝',
      subject: 'Timeline checklist for {{childName}}\'s party',
      message: `Here's a helpful timeline based on your party date to stay organized:

3-4 weeks before:
• Book venue (if needed)
• Send invitations

2 weeks before:
• Order supplies from your shopping list
• Confirm RSVPs

1 week before:
• Prepare activities
• Confirm final headcount

This is just a guide – plan at your own pace!`
    },
    {
      id: 4,
      name: 'Venue Ideas',
      emoji: '🏡',
      subject: 'Venue options for {{childName}}\'s party',
      message: `Based on your party details, here are some venue ideas matching your guest count and location:

• Local parks (free, outdoor space)
• Community centers (indoor, affordable)
• Trampoline parks (active kids, built-in entertainment)
• Bowling alleys (all ages, weather-proof)
• Home party (most flexible, budget-friendly)

You can browse and compare these in your party planner when you're ready.`
    },
    {
      id: 5,
      name: 'Shopping List',
      emoji: '🛒',
      subject: 'Your party shopping list is ready',
      message: `Your personalized shopping list for {{childName}}'s party is ready to view.

It includes:
• Decorations for your chosen theme
• Activity supplies
• Party favors
• Tableware and serving items

Everything has direct links so you can order when ready. Your list is saved in your planner.`
    },
    {
      id: 6,
      name: 'Follow-Up',
      emoji: '👋',
      subject: 'Need help with {{childName}}\'s party planning?',
      message: `We noticed you started planning {{childName}}'s party but haven't finished yet.

Is there anything you're stuck on? Common questions we can help with:
• Not sure which theme fits your budget?
• Need age-appropriate activity ideas?
• Questions about venue options?

Feel free to reply to this email if you need help, or continue planning at your own pace.`
    }
  ];

  const loadTemplate = (template) => {
    setSubject(template.subject);
    setMessage(template.message);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
    }
  };

  const handleSendPromo = async (e) => {
    e.preventDefault();
    setResult(null);

    if (!subject.trim() || !message.trim()) {
      setResult({ success: false, error: 'Subject and message are required' });
      return;
    }

    setSending(true);

    try {
      const response = await fetch('/api/admin/send-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message })
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Clear form on success
        setSubject('');
        setMessage('');
      }
    } catch (error) {
      console.error('Send promo error:', error);
      setResult({ success: false, error: 'Failed to send promotional emails' });
    } finally {
      setSending(false);
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-xl">
              <Mail className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all"
              autoFocus
            />
            {authError && <p className="text-red-600 text-sm mb-4 font-semibold">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:shadow-xl transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-xl">
              <Mail className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600">Send promotional emails to all subscribers</p>
            </div>
          </div>
        </div>

        {/* Email Templates */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📧 Quick Templates</h2>
          <p className="text-sm text-gray-600 mb-4">Click a template to load it into the editor below</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {emailTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => loadTemplate(template)}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all text-left"
              >
                <span className="text-3xl">{template.emoji}</span>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{template.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{template.subject}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Send Promo Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">✍️ Compose Email</h2>
          <form onSubmit={handleSendPromo} className="space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., 🎉 New Party Themes Just Added!"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all"
                disabled={sending}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your promotional message here... Use {{childName}} to personalize."
                rows={8}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all resize-none"
                disabled={sending}
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Use {`{{childName}}`} to personalize emails with the child's name
              </p>
            </div>

            {/* Preview */}
            {subject && message && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Preview</p>
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-bold text-lg text-gray-800 mb-2">{subject}</p>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {message.replace(/{{childName}}/g, '[Child Name]')}
                  </div>
                </div>
              </div>
            )}

            {/* Result Message */}
            {result && (
              <div className={`flex items-start gap-3 p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-red-50 border-2 border-red-200'
              }`}>
                {result.success ? (
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                ) : (
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                )}
                <div>
                  <p className={`font-bold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.success ? 'Success!' : 'Error'}
                  </p>
                  <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.success
                      ? `Sent ${result.sent} emails to subscribers`
                      : result.error || 'Failed to send emails'}
                  </p>
                  {result.failed > 0 && (
                    <p className="text-sm text-yellow-700 mt-1">
                      {result.failed} emails failed to send
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={sending || !subject.trim() || !message.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 px-8 rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {sending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Send to All Subscribers</span>
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Users className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-bold text-blue-800 mb-1">How it works</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Emails will be sent to all subscribers in your database</li>
                  <li>• Use {`{{childName}}`} to personalize with each child's name</li>
                  <li>• Emails are sent from: hello@go.planmypartypal.com</li>
                  <li>• Recipients can unsubscribe at any time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
