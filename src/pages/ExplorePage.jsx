import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const confettiItems = [
  { top: "8%",  left: "4%",   color: "#FF6B9D", size: 10, rotate: 15  },
  { top: "12%", left: "92%",  color: "#4ECDC4", size: 8,  rotate: -20 },
  { top: "18%", left: "88%",  color: "#FFE66D", size: 12, rotate: 45  },
  { top: "5%",  left: "75%",  color: "#A78BFA", size: 7,  rotate: -10 },
  { top: "22%", left: "7%",   color: "#4ECDC4", size: 9,  rotate: 30  },
  { top: "35%", left: "96%",  color: "#FF6B9D", size: 6,  rotate: -35 },
  { top: "42%", left: "2%",   color: "#FFE66D", size: 11, rotate: 20  },
  { top: "55%", left: "94%",  color: "#A78BFA", size: 8,  rotate: 50  },
  { top: "65%", left: "5%",   color: "#4ECDC4", size: 10, rotate: -15 },
  { top: "72%", left: "90%",  color: "#FF6B9D", size: 7,  rotate: 25  },
  { top: "80%", left: "8%",   color: "#FFE66D", size: 9,  rotate: -40 },
  { top: "88%", left: "85%",  color: "#4ECDC4", size: 8,  rotate: 10  },
];

const THEMES = [
  { emoji: "🤸", name: "Gymnastics",       slug: "gymnastics"    },
  { emoji: "👑", name: "Princess",         slug: "princess"      },
  { emoji: "🦸", name: "Superheroes",      slug: "superheroes"   },
  { emoji: "🔬", name: "Science & STEM",   slug: "science"       },
  { emoji: "⚽", name: "Sports",           slug: "sports"        },
  { emoji: "🧜", name: "Mermaid",          slug: "mermaid"       },
  { emoji: "🎮", name: "Gaming",           slug: "gaming"        },
  { emoji: "🧁", name: "Baking Party",     slug: "baking"        },
  { emoji: "🦄", name: "Unicorn",          slug: "unicorn"       },
  { emoji: "🦕", name: "Dinosaurs",        slug: "dinosaurs"     },
  { emoji: "🚀", name: "Space",            slug: "space"         },
  { emoji: "🌟", name: "Glow Party",       slug: "glow-party"    },
  { emoji: "🎨", name: "Art & Crafts",     slug: "art"           },
  { emoji: "🥷", name: "Ninja Warrior",    slug: "ninja"         },
  { emoji: "🏊", name: "Pool Party",       slug: "swimming"      },
  { emoji: "🌺", name: "Luau",             slug: "luau"          },
  { emoji: "🏴‍☠️", name: "Pirates",       slug: "pirates"       },
  { emoji: "🏰", name: "Fairy Tale",       slug: "fairytale"     },
  { emoji: "🎂", name: "1st Birthday",     slug: "first-birthday"},
  { emoji: "🧸", name: "Toddler Party",    slug: "toddler"       },
  { emoji: "🎸", name: "Teen Party",       slug: "teens"         },
  { emoji: "🐄", name: "Farm & Animals",   slug: "farm"          },
  { emoji: "📣", name: "Cheerleading",     slug: "cheerleading"  },
  { emoji: "🎵", name: "Music & Dance",    slug: "music-dance"   },
  { emoji: "👯", name: "Twins Party",      slug: "twins"         },
  { emoji: "🪅", name: "Fiesta",           slug: "fiesta"        },
  { emoji: "🎯", name: "Fortnite",         slug: "fortnite"      },
  { emoji: "🥋", name: "Karate & Martial", slug: "karate-kid"    },
  { emoji: "🚒", name: "Blaze & Trucks",   slug: "blaze"         },
  { emoji: "⚔️", name: "Star Wars",        slug: "star-wars"     },
];

const AGE_GROUPS = [
  { label: "1st Birthday", range: "1 yr",    count: 110, emoji: "🎂" },
  { label: "Toddlers",     range: "2–3 yrs", count: 87,  emoji: "🧸" },
  { label: "Preschool",    range: "4–6 yrs", count: 143, emoji: "🌈" },
  { label: "Elementary",   range: "7–9 yrs", count: 129, emoji: "🚀" },
  { label: "Preteens",     range: "10–12",   count: 98,  emoji: "🎮" },
  { label: "Teens",        range: "13+ yrs", count: 91,  emoji: "🎸" },
];

const VENDORS = [
  {
    id: 1, emoji: "🤡", name: "Tommy the Clown",
    address: "2301 E Sligh Ave, Tampa",
    distance: "11.8 mi", rating: 4.6, reviews: 19,
    tags: ["Entertainment"], open: true, price: "From $150",
    bg: "from-pink-100 to-pink-50",
  },
  {
    id: 2, emoji: "😂", name: "Laughing Jack the Clown",
    address: "4408 Del Prado Blvd S, Cape Coral",
    distance: "111.3 mi", rating: 3.8, reviews: 4,
    tags: ["Entertainment"], open: false, price: "From $120",
    bg: "from-purple-100 to-purple-50",
  },
  {
    id: 3, emoji: "🤸", name: "Flip Zone Gymnastics",
    address: "825 Myrtle Ave, Clearwater",
    distance: "4.8 mi", rating: 4.8, reviews: 94,
    tags: ["Venues", "Sports"], open: true, price: "From $349",
    bg: "from-teal-100 to-teal-50",
  },
  {
    id: 4, emoji: "🎨", name: "Picasso Party Studio",
    address: "101 Main St, Safety Harbor",
    distance: "1.2 mi", rating: 4.9, reviews: 128,
    tags: ["Venues", "Art"], open: true, price: "From $249",
    bg: "from-yellow-100 to-yellow-50",
  },
  {
    id: 5, emoji: "🧁", name: "Sugar Rush Bakery Parties",
    address: "340 Main St, Dunedin",
    distance: "6.1 mi", rating: 4.7, reviews: 41,
    tags: ["Cakes & Catering"], open: true, price: "From $199",
    bg: "from-pink-100 to-rose-50",
  },
  {
    id: 6, emoji: "🔬", name: "Mad Scientist Lab",
    address: "900 Central Ave, St. Pete",
    distance: "9.2 mi", rating: 5.0, reviews: 33,
    tags: ["Entertainment"], open: false, price: "From $299",
    bg: "from-blue-100 to-blue-50",
  },
];

const FILTER_TABS = [
  { emoji: "🎪", label: "Entertainment",   value: "Entertainment"   },
  { emoji: "🏟️", label: "Venues",          value: "Venues"          },
  { emoji: "🎂", label: "Cakes & Catering",value: "Cakes & Catering"},
  { emoji: "📸", label: "Photography",     value: "Photography"     },
  { emoji: "🎈", label: "Decorations",     value: "Decorations"     },
  { emoji: "🎡", label: "Rentals",         value: "Rentals"         },
];

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  );
}

export default function ExplorePage() {
  const [zip, setZip] = useState("33626");
  const [activeFilter, setActiveFilter] = useState("Entertainment");
  const [saved, setSaved] = useState([]);

  const toggleSave = (id) =>
    setSaved((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const filtered = VENDORS.filter((v) => v.tags.includes(activeFilter));

  return (
    <div className="min-h-screen bg-pink-50 relative overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', 'Nunito', sans-serif" }}>

      {/* Confetti decorations */}
      {confettiItems.map((c, i) => (
        <div key={i} className="fixed pointer-events-none z-0 rounded-sm opacity-60"
          style={{
            top: c.top, left: c.left,
            width: c.size, height: c.size * 2.5,
            backgroundColor: c.color,
            transform: `rotate(${c.rotate}deg)`,
            borderRadius: 2,
          }} />
      ))}

      <Header />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-800 mb-3">
            🎪 Vendor Marketplace
          </h1>
          <p className="text-gray-500 text-base">
            Find trusted local vendors for your party — real businesses near you
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-3 flex gap-3 mb-3 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 flex-1 px-3">
            <svg className="w-4 h-4 text-pink-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="ZIP code or city..."
              className="flex-1 outline-none text-gray-700 text-sm bg-transparent placeholder-gray-400"
            />
          </div>
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Search
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mb-10">
          Showing results near <strong className="text-gray-600">{zip}</strong>
        </p>

        {/* Category Filter Tabs */}
        <div className="flex gap-2.5 flex-wrap justify-center mb-8">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                activeFilter === tab.value
                  ? "bg-pink-500 text-white border-pink-500 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-pink-300"
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Vendor Results */}
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
          {filtered.length} {activeFilter.toUpperCase()} VENDORS NEAR {zip}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
          {filtered.map((v) => (
            <div key={v.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.bg} flex items-center justify-center text-2xl shrink-0`}>
                    {v.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base leading-tight">{v.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <svg className="w-3 h-3 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      {v.address}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="flex items-center gap-1 justify-end">
                    <StarRating rating={v.rating} />
                    <span className="text-xs font-bold text-gray-700">{v.rating}</span>
                  </div>
                  <p className="text-xs text-gray-400">({v.reviews}) · {v.distance}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  {v.open ? (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      ● Open now
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                      ● Closed
                    </span>
                  )}
                  <span className="text-xs font-bold text-pink-500">{v.price}</span>
                </div>
                <button
                  onClick={() => toggleSave(v.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    saved.includes(v.id)
                      ? "border-pink-400 text-pink-500 bg-pink-50"
                      : "border-gray-200 text-gray-400 hover:border-pink-300"
                  }`}
                >
                  {saved.includes(v.id) ? "♥ Saved" : "♡ Save"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Browse by Theme */}
        <div className="flex justify-between items-baseline mb-5">
          <h2 className="text-2xl font-black text-gray-800">Browse by Theme</h2>
          <Link to="/explore/themes" className="text-sm font-semibold text-pink-500 hover:text-pink-600 transition-colors">
            View all {THEMES.length} themes →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-14">
          {THEMES.map((theme) => (
            <Link
              key={theme.slug}
              to={`/explore/themes/${theme.slug}`}
              className="bg-white rounded-2xl p-4 text-center border border-gray-100 hover:border-pink-300 hover:-translate-y-1 hover:shadow-md transition-all"
            >
              <span className="text-3xl block mb-2">{theme.emoji}</span>
              <p className="text-sm font-bold text-gray-700 leading-tight">{theme.name}</p>
              <p className="text-xs text-pink-400 mt-1 font-medium">Explore →</p>
            </Link>
          ))}
        </div>

        {/* Browse by Age */}
        <div className="flex justify-between items-baseline mb-5">
          <h2 className="text-2xl font-black text-gray-800">Browse by Age</h2>
          <span className="text-sm font-semibold text-pink-500">Full age guide →</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-14">
          {AGE_GROUPS.map((age) => (
            <div key={age.label}
              className="bg-pink-500 rounded-2xl p-4 text-center hover:bg-pink-600 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer">
              <span className="text-2xl block mb-1">{age.emoji}</span>
              <p className="text-white font-black text-sm leading-tight">{age.label}</p>
              <p className="text-pink-200 text-xs mt-1">{age.range}</p>
              <p className="text-pink-100 text-xs font-semibold mt-2">{age.count} ideas →</p>
            </div>
          ))}
        </div>

        {/* AI Planner Banner */}
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl mb-12">
          <div>
            <h2 className="text-white font-black text-2xl mb-2">
              ✨ Not sure where to start?
            </h2>
            <p className="text-pink-100 text-sm max-w-md leading-relaxed">
              Tell us your child's name, age, and interests — PartyPlann's AI builds a
              complete party plan in 60 seconds. Theme, vendors, checklist, timeline. All done.
            </p>
          </div>
          <Link
            to="/app"
            className="bg-white text-pink-500 font-black text-sm px-8 py-3.5 rounded-2xl hover:bg-pink-50 transition-colors shadow-lg whitespace-nowrap shrink-0"
          >
            🎉 Build My Party Plan Free
          </Link>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 text-center py-6 text-xs text-gray-400">
        <strong className="text-gray-600">PartyPlann.com</strong> · AI-powered birthday party planning ·
        © {new Date().getFullYear()} · Safety Harbor, FL
      </footer>
    </div>
  );
}
