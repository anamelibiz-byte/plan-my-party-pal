import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, ChevronDown, ChevronUp, CheckCircle, Send, BookOpen, Heart } from 'lucide-react';
import Header from '../components/Header';
import SEO from '../components/SEO';

const faqs = [
  {
    q: 'Is Party Plann really free?',
    a: 'Yes! Our core features — checklists, guest list management, and basic budget tracking — are completely free to use with no credit card required. We offer a Pro plan for unlimited parties and advanced features like PDF exports, email invitations, and priority support.',
  },
  {
    q: 'How do I upgrade to Pro?',
    a: 'You can upgrade to Party Plann Pro directly from within the app. Go to your Account page or click any "Upgrade" button to see Pro pricing options (monthly and annual plans are available).',
  },
  {
    q: 'Can I plan multiple parties at the same time?',
    a: 'Free plan users can manage one active party at a time. Party Plann Pro allows unlimited simultaneous parties — perfect for parents of multiple kids or anyone who hosts frequently.',
  },
  {
    q: 'Can I share my party plan with someone else?',
    a: 'Yes! Pro users can invite co-planners to collaborate on a party. Both people can view and edit the guest list, checklist, and timeline in real time.',
  },
  {
    q: 'How do I delete my account?',
    a: 'You can delete your account from your Account Settings page. If you need help or can\'t access your account, email us at hello@partyplann.com and we\'ll take care of it promptly.',
  },
  {
    q: 'I have a feature suggestion — where do I send it?',
    a: 'We love hearing from users! Send your feature ideas to hello@partyplann.com with "Feature Request" in the subject line. We read every message and many of our best features came directly from user suggestions.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="font-semibold text-gray-900 text-sm">{q}</span>
        {open ? (
          <ChevronUp size={18} className="text-pink-500 flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <p className="text-gray-600 text-sm leading-relaxed pb-4">{a}</p>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Question', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoBody = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:hello@partyplann.com?subject=${encodeURIComponent(form.subject)}&body=${mailtoBody}`;
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="Contact Party Plann — Get Help & Support"
        description="Get in touch with the Party Plann team. We're here to help with questions about party planning, your account, Pro features, and anything else you need."
        keywords="contact party plann, party planning support, party plann help, party planning questions"
        canonicalPath="/contact"
      />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
        <Header />

        {/* Hero */}
        <section className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare size={28} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">Get in Touch</h1>
            <p className="text-lg text-pink-100 max-w-xl mx-auto">
              Have a question, idea, or just want to say hello? We'd love to hear from you.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Send size={20} className="text-pink-500" />
                  Send Us a Message
                </h2>

                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Ready to Send!</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Your default email app has opened with your message pre-filled. Hit send and we'll get back to you within 1–2 business days.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-pink-600 font-semibold text-sm hover:text-rose-600 transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="name">
                          Your Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Jane Smith"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="jane@email.com"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="subject">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white"
                      >
                        <option>General Question</option>
                        <option>Feature Request</option>
                        <option>Bug Report</option>
                        <option>Pro Subscription</option>
                        <option>Account Help</option>
                        <option>Partnership / Business</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="message">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                    >
                      <Send size={16} />
                      Send Message
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      This will open your email app with the message pre-filled. We typically reply within 1–2 business days.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Direct Email */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Mail size={18} className="text-pink-500" />
                  Email Us Directly
                </h3>
                <a
                  href="mailto:hello@partyplann.com"
                  className="text-pink-600 font-semibold text-sm hover:text-rose-600 transition-colors"
                >
                  hello@partyplann.com
                </a>
                <p className="text-gray-500 text-xs mt-2">We respond within 1–2 business days.</p>
              </div>

              {/* Blog Link */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen size={18} className="text-purple-500" />
                  Party Planning Tips
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Check out our blog for step-by-step guides, budget tips, and theme ideas.
                </p>
                <Link
                  to="/blog"
                  className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors"
                >
                  Browse the blog →
                </Link>
              </div>

              {/* Response time */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-6">
                <Heart size={20} className="text-pink-500 mb-2" />
                <h3 className="font-bold text-gray-900 mb-1 text-sm">We Read Every Message</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Our small team personally reads and responds to every email. Your feedback directly shapes the future of Party Plann.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-pink-500" />
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-gray-100">
              {faqs.map((item, idx) => (
                <FAQItem key={idx} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
