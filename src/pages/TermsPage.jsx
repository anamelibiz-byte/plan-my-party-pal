import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-4">
            Terms of Use
          </h1>
          <p className="text-gray-600">
            Last Updated: February 15, 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 prose prose-pink max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using Plan My Party Pal ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these Terms of Use, please do not use this Service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Plan My Party Pal is operated by Plan My Party Pal ("we," "us," or "our"). We reserve the right to update these terms at any time, and your continued use of the Service constitutes acceptance of those changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We grant you a personal, non-transferable, non-exclusive license to use the Plan My Party Pal service for your personal party planning needs. This license is subject to these Terms of Use.
            </p>
            <p className="text-gray-700 leading-relaxed mb-2">You may not:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Modify or copy the materials or software</li>
              <li>Use the materials for any commercial purpose or public display</li>
              <li>Attempt to reverse engineer any software contained in the Service</li>
              <li>Remove any copyright or proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Use the Service to violate any laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Account Registration</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of the Service, you may be required to create an account using your email address. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Maintaining the confidentiality of your account information</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these Terms of Use.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Subscription and Billing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Plan My Party Pal offers both free and paid subscription tiers:
            </p>
            <div className="bg-pink-50 border-l-4 border-pink-500 p-4 mb-4">
              <h3 className="font-bold text-gray-800 mb-2">Free Tier</h3>
              <p className="text-gray-700">Access to basic party planning features with limitations on parties, guests, and features.</p>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
              <h3 className="font-bold text-gray-800 mb-2">Pro Tier</h3>
              <p className="text-gray-700 mb-2">Unlimited access to all features including unlimited parties, guests, timeline builder, PDF export, email/SMS sending, and budget analytics.</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Billing is processed through Stripe on a monthly or annual basis</li>
                <li>Subscriptions automatically renew unless canceled</li>
                <li>You may cancel your subscription at any time through your account settings</li>
                <li>No refunds are provided for partial subscription periods</li>
                <li>Pricing is subject to change with 30 days notice to existing subscribers</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. User Content</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain all rights to the content you create using Plan My Party Pal, including party details, guest lists, budgets, timelines, and other data ("User Content").
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              By using the Service, you grant us a limited license to store, process, and display your User Content solely for the purpose of providing the Service to you. We will not share, sell, or use your User Content for any other purpose without your explicit consent.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for ensuring that your User Content does not violate any laws or third-party rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Email and SMS Communications</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Pro subscribers can send party invitations, checklists, and reminders to guests via email and SMS through our Service. By using these features, you agree that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>You have obtained proper consent from recipients to send them communications</li>
              <li>You will not use the Service to send spam, unsolicited messages, or violate anti-spam laws</li>
              <li>You are responsible for the content of messages sent through the Service</li>
              <li>We reserve the right to suspend sending privileges if abuse is detected</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Prohibited Uses</h2>
            <p className="text-gray-700 leading-relaxed mb-2">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Violate any local, state, national, or international law</li>
              <li>Infringe upon or violate our intellectual property rights or the rights of others</li>
              <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>Submit false or misleading information</li>
              <li>Upload or transmit viruses or malicious code</li>
              <li>Collect or track personal information of others without consent</li>
              <li>Spam, phish, or engage in other unauthorized solicitation</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use the Service for any commercial purposes without our written consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Service and its original content (excluding User Content), features, and functionality are owned by Plan My Party Pal and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our trademarks, logos, and service marks displayed on the Service may not be used without our prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not warrant that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>The Service will be uninterrupted, secure, or error-free</li>
              <li>The results obtained from using the Service will be accurate or reliable</li>
              <li>Any errors in the Service will be corrected</li>
              <li>The Service will meet your specific requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, PLAN MY PARTY PAL SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use, or alteration of your content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Data Backup</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              While we implement reasonable security measures and backup procedures, you are responsible for maintaining your own backups of important User Content. We are not liable for any loss or corruption of User Content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Upon termination, your right to use the Service will immediately cease. You may delete your account at any time by contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved in the courts of the United States.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">14. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by updating the "Last Updated" date and, for significant changes, by posting a notice on the Service or sending an email to registered users.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your continued use of the Service after changes become effective constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">15. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Use, please contact us:
            </p>
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> hello@go.partyplann.com
              </p>
              <p className="text-gray-700">
                <strong>Website:</strong> partyplann.com
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 italic">
              By using Plan My Party Pal, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
