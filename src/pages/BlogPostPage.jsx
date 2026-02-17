import { useParams, Link, Navigate } from 'react-router-dom';
import { Clock, Calendar, ChevronRight, ExternalLink, ArrowLeft, ShoppingBag, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import { blogPosts } from '../data/blogPosts';

const categoryColors = {
  'Planning Guides': 'bg-pink-100 text-pink-700',
  'Budgeting': 'bg-green-100 text-green-700',
  'Themes & Inspiration': 'bg-purple-100 text-purple-700',
  'Food & Catering': 'bg-amber-100 text-amber-700',
};

function AmazonProductCard({ product }) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors group"
    >
      <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
        <ShoppingBag size={20} className="text-amber-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-sm group-hover:text-amber-700 transition-colors">{product.title}</p>
        <p className="text-gray-600 text-xs mt-1 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">{product.price}</span>
          <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
            View on Amazon <ExternalLink size={10} />
          </span>
        </div>
      </div>
    </a>
  );
}

function renderBlock(block, idx) {
  switch (block.type) {
    case 'intro':
      return (
        <div key={idx} className="text-gray-700 leading-relaxed text-lg mb-8 p-6 bg-pink-50 rounded-xl border-l-4 border-pink-400">
          {block.text.split('\n\n').map((para, i) => (
            <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
          ))}
        </div>
      );
    case 'h2':
      return (
        <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full inline-block flex-shrink-0" />
          {block.text}
        </h2>
      );
    case 'text':
      return (
        <div key={idx} className="text-gray-700 leading-relaxed mb-6">
          {block.text.split('\n\n').map((para, i) => {
            // Handle markdown-style bold
            const parts = para.split(/(\*\*[^*]+\*\*)/g);
            const rendered = parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
              }
              // Handle bullet points
              if (part.includes('\n- ')) {
                const [before, ...items] = part.split('\n- ');
                return (
                  <span key={j}>
                    {before}
                    <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
                      {items.map((item, k) => (
                        <li key={k} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </span>
                );
              }
              // Handle numbered lists
              if (/^\d+\. /.test(part.trim())) {
                return <span key={j} className="block">{part}</span>;
              }
              return <span key={j}>{part}</span>;
            });
            // Handle checkbox list items
            if (para.startsWith('- [ ]')) {
              return (
                <ul key={i} className="space-y-2 mb-4">
                  {para.split('\n').map((item, k) => (
                    <li key={k} className="flex items-start gap-2 text-gray-700">
                      <span className="w-4 h-4 border-2 border-pink-300 rounded mt-0.5 flex-shrink-0" />
                      <span>{item.replace('- [ ] ', '')}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className={i > 0 ? 'mt-4' : ''}>
                {rendered}
              </p>
            );
          })}
        </div>
      );
    default:
      return null;
  }
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = blogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3);
  const otherPosts = blogPosts.filter(p => p.id !== post.id && p.category !== post.category).slice(0, 3 - relatedPosts.length);
  const sidebarPosts = [...relatedPosts, ...otherPosts].slice(0, 3);

  const SITE_URL = 'https://partyplann.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    author: { '@type': 'Organization', name: post.author },
    datePublished: post.publishDate,
    publisher: {
      '@type': 'Organization',
      name: 'Party Plann',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.jpg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
  };

  return (
    <>
      <Helmet>
        <title>{`${post.title} | Party Plann Blog`}</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.keywords} />
        <link rel="canonical" href={`${SITE_URL}/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:url" content={`${SITE_URL}/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`${SITE_URL}/logo.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
        <Header />

        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/blog" className="hover:text-pink-600 transition-colors">Blog</Link>
            <ChevronRight size={14} />
            <span className="text-gray-700 font-medium truncate max-w-xs">{post.title}</span>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Article */}
            <article className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Article Header */}
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 text-white">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full mb-4 ${categoryColors[post.category] || 'bg-white/20 text-white'}`}>
                    <Tag size={10} />
                    {post.category}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black leading-tight mb-4">{post.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-pink-100 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {post.publishDate}
                    </span>
                    <span>By {post.author}</span>
                  </div>
                </div>

                {/* Article Body */}
                <div className="p-8">
                  {post.content.map((block, idx) => renderBlock(block, idx))}

                  {/* Amazon Products (if any) */}
                  {post.products && post.products.length > 0 && (
                    <div className="mt-10 p-6 bg-amber-50 rounded-2xl border border-amber-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <ShoppingBag size={18} className="text-amber-600" />
                        Recommended Products
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">
                        As an Amazon Associate, Party Plann earns from qualifying purchases.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {post.products.map((product, idx) => (
                          <AmazonProductCard key={idx} product={product} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Back to blog */}
                  <div className="mt-10 pt-6 border-t border-gray-100">
                    <Link
                      to="/blog"
                      className="inline-flex items-center gap-2 text-pink-600 font-semibold hover:text-rose-600 transition-colors"
                    >
                      <ArrowLeft size={16} />
                      Back to all articles
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* App CTA */}
              <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-black mb-2">Plan Your Party Free</h3>
                <p className="text-pink-100 text-sm mb-4">
                  Put these tips into action with Party Plann — checklists, budgets, guest lists & more.
                </p>
                <Link
                  to="/app"
                  className="block w-full text-center bg-white text-pink-600 font-bold py-2.5 rounded-xl hover:bg-pink-50 transition-all shadow-md"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Related Posts */}
              {sidebarPosts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">More Articles</h3>
                  <div className="space-y-4">
                    {sidebarPosts.map(related => (
                      <Link
                        key={related.id}
                        to={`/blog/${related.slug}`}
                        className="block group"
                      >
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${categoryColors[related.category] || 'bg-gray-100 text-gray-600'}`}>
                          {related.category}
                        </span>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-pink-600 transition-colors leading-snug">
                          {related.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{related.readTime}</p>
                      </Link>
                    ))}
                  </div>
                  <Link
                    to="/blog"
                    className="block text-center mt-4 text-sm text-pink-600 font-semibold hover:text-rose-600 transition-colors"
                  >
                    View all articles →
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
