import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Users, Mail, CreditCard, Database, Bell } from 'lucide-react';

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-xl">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
          <p className="text-gray-600">
            Last Updated: February 15, 2026
          </p>
          <p className="text-gray-700 mt-4 leading-relaxed">
            At Plan My Party Pal, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 prose prose-pink max-w-none">

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-pink-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 m-0">1. Information We Collect</h2>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you use Plan My Party Pal, we may collect the following personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Email Address:</strong> Used for account creation, login, and service communications</li>
              <li><strong>Payment Information:</strong> Credit card details processed securely through Stripe (we do not store your full payment details)</li>
              <li><strong>Party Planning Data:</strong> Event details, guest names, contact information, budgets, timelines, and checklists you create</li>
              <li><strong>Communication Preferences:</strong> Your choices regarding email and SMS notifications</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you access our Service, we automatically collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Device Information:</strong> Browser type, operating system, device type</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Service</li>
              <li><strong>IP Address:</strong> For security and fraud prevention</li>
              <li><strong>Cookies and Local Storage:</strong> To maintain your session and preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-pink-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 m-0">2. How We Use Your Information</h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>

            <div className="space-y-4">
              <div className="bg-pink-50 border-l-4 border-pink-500 p-4">
                <h4 className="font-bold text-gray-800 mb-2">Service Delivery</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-0">
                  <li>Create and manage your account</li>
                  <li>Process your party planning activities</li>
                  <li>Store and display your events, guest lists, budgets, and timelines</li>
                  <li>Send invitations and reminders to your guests (with your permission)</li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                <h4 className="font-bold text-gray-800 mb-2">Payment Processing</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-0">
                  <li>Process subscription payments through Stripe</li>
                  <li>Manage billing and invoicing</li>
                  <li>Handle refunds and cancellations</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h4 className="font-bold text-gray-800 mb-2">Communication</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-0">
                  <li>Send service-related emails (confirmations, updates, security alerts)</li>
                  <li>Respond to your inquiries and support requests</li>
                  <li>Send promotional emails (you can opt out at any time)</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h4 className="font-bold text-gray-800 mb-2">Service Improvement</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-0">
                  <li>Analyze usage patterns to improve features</li>
                  <li>Monitor and prevent fraud and abuse</li>
                  <li>Ensure security and proper functioning of the Service</li>
                  <li>Develop new features and functionality</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-pink-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 m-0">3. Information Sharing and Disclosure</h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We only share your information in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Service Providers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We share information with trusted third-party service providers who help us operate our Service:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Stripe:</strong> Payment processing and subscription management</li>
              <li><strong>Supabase:</strong> Database hosting and data storage</li>
              <li><strong>Resend:</strong> Email delivery service</li>
              <li><strong>Vercel:</strong> Website hosting and deployment</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              These providers are contractually obligated to protect your information and use it only for the purposes we specify.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Guest Communications</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you use our email or SMS features to send invitations, checklists, or reminders to guests, we share the content you create with the recipients you specify. You are responsible for obtaining proper consent from recipients.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Legal Requirements</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may disclose your information if required by law or in response to valid legal requests, such as:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Compliance with legal obligations (court orders, subpoenas)</li>
              <li>Protection of our rights, property, or safety</li>
              <li>Investigation of fraud or security issues</li>
              <li>Enforcement of our Terms of Use</li>
            </ul>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-pink-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 m-0">4. Data Security</h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Encryption:</strong> All data transmitted to and from our Service is encrypted using SSL/TLS</li>
              <li><strong>Secure Storage:</strong> Data is stored in secure, encrypted databases</li>
              <li><strong>Payment Security:</strong> We use Stripe's PCI-compliant payment processing (we never store your full credit card details)</li>
              <li><strong>Access Controls:</strong> Limited employee access to personal data on a need-to-know basis</li>
              <li><strong>Regular Security Audits:</strong> We regularly review and update our security practices</li>
            </ul>
            <p className="text-gray-700 leading-relaxed bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <strong>Important:</strong> While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but will notify you of any data breaches as required by law.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="text-pink-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 m-0">5. Cookies and Tracking</h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">What Are Cookies?</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small data files stored on your device that help us recognize you and remember your preferences.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Types of Cookies We Use</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Essential Cookies:</strong> Required for the Service to function (login sessions, security)</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use the Service</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Local Storage</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use browser local storage to save your email, subscription tier, and guest mode preferences for a better user experience. You can clear this data through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-pink-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 m-0">6. Your Privacy Rights</h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>

            <div className="space-y-4 mb-4">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">🔍 Right to Access</h4>
                <p className="text-gray-700 mb-0">Request a copy of the personal information we hold about you</p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">✏️ Right to Correction</h4>
                <p className="text-gray-700 mb-0">Request correction of inaccurate or incomplete information</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">🗑️ Right to Deletion</h4>
                <p className="text-gray-700 mb-0">Request deletion of your account and associated data</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">📦 Right to Data Portability</h4>
                <p className="text-gray-700 mb-0">Request a copy of your data in a portable format</p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-pink-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">🚫 Right to Opt-Out</h4>
                <p className="text-gray-700 mb-0">Unsubscribe from promotional emails at any time</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">
              To exercise these rights, please contact us at <a href="mailto:hello@go.partyplann.com" className="text-pink-600 hover:text-pink-700 font-semibold">hello@go.partyplann.com</a>
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="text-pink-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 m-0">7. Data Retention</h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your information for as long as necessary to provide our Service and comply with legal obligations:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Active Accounts:</strong> Data is retained while your account is active</li>
              <li><strong>Deleted Accounts:</strong> Most data is deleted within 30 days of account deletion</li>
              <li><strong>Billing Records:</strong> Payment and transaction records are retained for 7 years for tax and legal compliance</li>
              <li><strong>Backup Systems:</strong> Data may persist in backup systems for up to 90 days</li>
            </ul>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-pink-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 m-0">8. Children's Privacy</h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              Plan My Party Pal is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If we discover that we have collected information from a child under 13, we will delete it immediately. If you believe we have collected information from a child under 13, please contact us at hello@go.partyplann.com.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-pink-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 m-0">9. Email and SMS Communications</h2>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Service Communications</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We send transactional emails related to your account and subscription (confirmations, receipts, security alerts). These emails are necessary for the Service and cannot be opted out of.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Marketing Communications</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may send promotional emails about new features, tips, and updates. You can unsubscribe from marketing emails at any time by clicking the "Unsubscribe" link in any email or adjusting your account settings.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Guest Communications</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you send invitations or reminders to guests via email or SMS, we process these communications on your behalf. You are responsible for ensuring you have proper consent from recipients.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-pink-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 m-0">10. Third-Party Links</h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any personal information.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="text-pink-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 m-0">11. Changes to This Privacy Policy</h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Updating the "Last Updated" date at the top of this policy</li>
              <li>Sending an email notification to registered users</li>
              <li>Posting a prominent notice on our Service</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Your continued use of the Service after changes become effective constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-pink-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 m-0">12. Contact Us</h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl border-2 border-pink-200">
              <div className="space-y-3">
                <p className="text-gray-700 mb-0">
                  <strong className="text-pink-600">Email:</strong> hello@go.partyplann.com
                </p>
                <p className="text-gray-700 mb-0">
                  <strong className="text-pink-600">Website:</strong> partyplann.com
                </p>
                <p className="text-gray-700 mb-0">
                  <strong className="text-pink-600">Response Time:</strong> We typically respond within 48 hours
                </p>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-xl">
              <p className="text-gray-700 leading-relaxed mb-2">
                <strong>Your Trust Matters:</strong> At Plan My Party Pal, protecting your privacy is our priority. We are committed to being transparent about our data practices and giving you control over your information.
              </p>
              <p className="text-sm text-gray-600 italic mb-0">
                By using Plan My Party Pal, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
