import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, BookOpen, Tag } from 'lucide-react';
import Header from '../components/Header';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';

const CATEGORIES = ['All', 'Planning Guides', 'Budgeting', 'Themes & Inspiration', 'Food & Catering'];

const categoryColors = {
  'Planning Guides': 'bg-pink-100 text-pink-700',
  'Budgeting': 'bg-green-100 text-green-700',
  'Themes & Inspiration': 'bg-purple-100 text-purple-700',
  'Food & Catering': 'bg-amber-100 text-amber-700',
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeCategory);

  return (
    <>
      <SEO
        title="Party Planning Blog — Tips, Ideas & Guides"
        description="Explore our party planning blog for expert tips on birthday party themes, budgets, guest lists, food ideas, decorations, and more. Free guides for every celebration."
        keywords="party planning blog, birthday party tips, party ideas, party planning guides"
        canonicalPath="/blog"
      />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
        <Header />

        {/* Hero */}
        <section className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <BookOpen size={28} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">Party Planning Blog</h1>
            <p className="text-lg md:text-xl text-pink-100 max-w-2xl mx-auto">
              Expert tips, creative ideas, and step-by-step guides to help you plan unforgettable birthday parties — for any age, budget, or style.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-600 shadow'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
            {filtered.map(post => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
              >
                {/* Card Top Color Bar */}
                <div className="h-2 bg-gradient-to-r from-pink-400 to-rose-400" />

                <div className="p-6 flex flex-col flex-1">
                  {/* Category badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
                      <Tag size={10} />
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug line-clamp-3">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {post.publishDate}
                    </span>
                  </div>

                  {/* Read More */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-pink-600 font-semibold text-sm hover:text-rose-600 transition-colors group"
                  >
                    Read Article
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">No posts in this category yet.</p>
            </div>
          )}
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 py-12 px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Ready to Start Planning?</h2>
          <p className="text-pink-100 mb-6 max-w-xl mx-auto">Put these tips into action with our free party planning app — checklists, budgets, guest lists, and more.</p>
          <Link
            to="/app"
            className="inline-block px-8 py-3 bg-white text-pink-600 rounded-xl font-bold hover:bg-pink-50 transition-all shadow-lg"
          >
            Start Planning for Free
          </Link>
        </div>
      </div>
    </>
  );
}
