import { Link } from 'react-router-dom';
import { Heart, Sparkles, Users, CheckSquare, DollarSign, Calendar, Star, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import SEO from '../components/SEO';

const values = [
  {
    icon: Heart,
    color: 'bg-pink-100 text-pink-600',
    title: 'Celebration Should Be Joyful',
    text: 'Planning a party should feel exciting, not stressful. We built Party Plann to take the overwhelm out of organizing so you can focus on what matters — celebrating the people you love.',
  },
  {
    icon: Users,
    color: 'bg-purple-100 text-purple-600',
    title: 'Built for Real Families',
    text: 'Not event planners with unlimited budgets — real parents, friends, and family members who want to create something special without breaking the bank or losing sleep.',
  },
  {
    icon: Sparkles,
    color: 'bg-amber-100 text-amber-600',
    title: 'Every Party Deserves to Be Great',
    text: 'Whether it\'s a backyard birthday for 10 kids or a milestone celebration for 100 guests, every party deserves proper planning tools. That\'s why our core features are free.',
  },
  {
    icon: CheckSquare,
    color: 'bg-green-100 text-green-600',
    title: 'Organization = Peace of Mind',
    text: 'A well-organized party planner doesn\'t just save time — it reduces anxiety. When everything is tracked in one place, you can actually enjoy the lead-up to the party.',
  },
];

const features = [
  { icon: CheckSquare, label: 'Smart Checklists' },
  { icon: DollarSign, label: 'Budget Tracker' },
  { icon: Users, label: 'Guest List & RSVPs' },
  { icon: Calendar, label: 'Party Timeline' },
  { icon: Sparkles, label: 'Theme Ideas' },
  { icon: Star, label: 'Vendor Directory' },
];

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About Party Plann — Free Birthday Party Planner App"
        description="Learn about Party Plann — the free party planning app built to help families organize unforgettable birthday parties with checklists, budgets, guest lists, and more."
        keywords="about party plann, party planning app, birthday party organizer, free party planner"
        canonicalPath="/about"
      />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
        <Header />

        {/* Hero */}
        <section className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Heart size={28} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">About Party Plann</h1>
            <p className="text-lg md:text-xl text-pink-100 max-w-2xl mx-auto">
              We built the party planner we always wished existed — simple, free, and actually useful.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Our Story */}
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Party Plann was born out of a genuinely chaotic birthday party planning experience. Juggling spreadsheets, sticky notes, group texts, and random browser tabs for vendor searches — it was exhausting, and it took the joy out of what should have been an exciting process.
              </p>
              <p>
                We looked around for a party planning tool that brought everything together in one place: a proper guest list with RSVP tracking, a budget tracker that didn't require accounting knowledge, a timeline builder, a checklist, and a way to coordinate with other helpers. We couldn't find exactly what we needed — so we built it.
              </p>
              <p>
                Today, Party Plann helps thousands of parents, friends, and family members plan birthday parties big and small. Our mission is simple: make the planning process so organized and easy that by the time your guests arrive, you're actually excited — not exhausted.
              </p>
            </div>
          </section>

          {/* Mission */}
          <section className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border-2 border-pink-100 p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="text-pink-500" size={24} />
              Our Mission
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              To make every birthday celebration possible — regardless of budget, experience, or time — by giving every host a smart, simple, and free set of planning tools that turn party planning stress into party planning joy.
            </p>
          </section>

          {/* Values */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What We Believe</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map(({ icon: Icon, color, title, text }) => (
                <div key={title} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">What's in Party Plann</h2>
            <p className="text-gray-600 mb-6">Everything you need to plan an unforgettable birthday party, in one free app.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-pink-600" />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white text-center shadow-xl">
            <h2 className="text-2xl font-black mb-3">Ready to Plan Something Amazing?</h2>
            <p className="text-pink-100 mb-6">Start for free — no credit card, no signup required to explore.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/app"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-pink-600 rounded-xl font-bold hover:bg-pink-50 transition-all shadow-lg"
              >
                Start Planning Free <ArrowRight size={16} />
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all"
              >
                Read the Blog
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
