import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

// ─── All Themes Data ─────────────────────────────────────────────────────────
const ALL_THEMES = [
  // 🌟 FEATURED
  { slug: "gymnastics",    emoji: "🤸", name: "Gymnastics",        tagline: "Flip, tumble & celebrate",           color: "from-teal-400 to-emerald-500",    categories: ["Active","Indoor"],       ageRange: "3–12", avgCost: "$200–$500", popularity: 94, featured: true  },
  { slug: "princess",      emoji: "👑", name: "Princess",           tagline: "Every child deserves to feel royal", color: "from-pink-400 to-rose-500",       categories: ["Dress-Up","Indoor"],     ageRange: "2–10", avgCost: "$150–$600", popularity: 98, featured: true  },
  { slug: "superheroes",   emoji: "🦸", name: "Superheroes",        tagline: "Train the next generation of heroes",color: "from-blue-500 to-indigo-600",     categories: ["Active","Outdoor"],      ageRange: "3–12", avgCost: "$150–$450", popularity: 96, featured: true  },

  // 🎨 CREATIVE
  { slug: "art",           emoji: "🎨", name: "Art & Crafts",       tagline: "Unleash little Picassos",            color: "from-orange-400 to-amber-500",    categories: ["Creative","Indoor"],     ageRange: "4–12", avgCost: "$100–$350", popularity: 78, featured: false },
  { slug: "baking",        emoji: "🧁", name: "Baking Party",       tagline: "Mix, bake & decorate together",      color: "from-yellow-400 to-orange-400",   categories: ["Creative","Indoor"],     ageRange: "5–14", avgCost: "$150–$400", popularity: 72, featured: false },
  { slug: "science",       emoji: "🔬", name: "Science & STEM",     tagline: "Experiments that blow minds",        color: "from-violet-500 to-purple-600",   categories: ["Educational","Indoor"],  ageRange: "5–12", avgCost: "$200–$450", popularity: 68, featured: false },
  { slug: "music-dance",   emoji: "🎵", name: "Music & Dance",      tagline: "Party like a pop star",              color: "from-fuchsia-500 to-pink-500",    categories: ["Creative","Active"],     ageRange: "4–14", avgCost: "$150–$400", popularity: 71, featured: false },

  // 🌿 FANTASY
  { slug: "unicorn",       emoji: "🦄", name: "Unicorn",            tagline: "Sparkle, magic & rainbow dreams",    color: "from-purple-400 to-pink-400",     categories: ["Fantasy","Indoor"],      ageRange: "3–9",  avgCost: "$100–$400", popularity: 91, featured: false },
  { slug: "mermaid",       emoji: "🧜", name: "Mermaid",            tagline: "Under the sea magic",                color: "from-cyan-400 to-teal-500",       categories: ["Fantasy","Indoor"],      ageRange: "3–10", avgCost: "$150–$450", popularity: 85, featured: false },
  { slug: "dinosaurs",     emoji: "🦕", name: "Dinosaurs",          tagline: "Roar into a prehistoric adventure",  color: "from-lime-500 to-green-600",      categories: ["Adventure","Outdoor"],   ageRange: "2–9",  avgCost: "$100–$350", popularity: 82, featured: false },
  { slug: "space",         emoji: "🚀", name: "Space & Astronauts", tagline: "Blast off into the cosmos",          color: "from-slate-700 to-indigo-800",    categories: ["Adventure","Educational"],ageRange: "4–12",avgCost: "$150–$400", popularity: 76, featured: false },
  { slug: "fairytale",     emoji: "🏰", name: "Fairy Tale",         tagline: "Once upon a perfect party",          color: "from-rose-400 to-purple-500",     categories: ["Fantasy","Indoor"],      ageRange: "3–9",  avgCost: "$150–$500", popularity: 73, featured: false },
  { slug: "pirates",       emoji: "🏴‍☠️",name: "Pirates",           tagline: "Ahoy! Treasure hunt awaits",         color: "from-amber-600 to-orange-700",    categories: ["Adventure","Outdoor"],   ageRange: "4–11", avgCost: "$100–$350", popularity: 69, featured: false },

  // ⚽ SPORTS & ACTIVE
  { slug: "sports",        emoji: "⚽", name: "Sports",             tagline: "Game on — the ultimate athlete party",color:"from-green-500 to-emerald-600",   categories: ["Active","Outdoor"],      ageRange: "4–16", avgCost: "$150–$450", popularity: 88, featured: false },
  { slug: "gaming",        emoji: "🎮", name: "Gaming & Esports",   tagline: "Level up the celebration",           color: "from-blue-600 to-violet-600",     categories: ["Indoor","Teens"],        ageRange: "7–16", avgCost: "$200–$500", popularity: 86, featured: false },
  { slug: "ninja",         emoji: "🥷", name: "Ninja Warrior",      tagline: "Train hard, party harder",            color: "from-gray-700 to-slate-800",      categories: ["Active","Outdoor"],      ageRange: "5–13", avgCost: "$200–$500", popularity: 79, featured: false },
  { slug: "swimming",      emoji: "🏊", name: "Pool Party",         tagline: "Splash into the best birthday ever", color: "from-sky-400 to-blue-500",        categories: ["Active","Outdoor"],      ageRange: "4–16", avgCost: "$100–$400", popularity: 90, featured: false },
  { slug: "cheerleading",  emoji: "📣", name: "Cheerleading",       tagline: "Give me a B-I-R-T-H-D-A-Y!",         color: "from-red-500 to-pink-500",        categories: ["Active","Girls"],        ageRange: "5–13", avgCost: "$150–$350", popularity: 63, featured: false },

  // 🎂 MILESTONES
  { slug: "first-birthday",emoji: "🎂", name: "1st Birthday",       tagline: "The one they'll always remember",    color: "from-pink-300 to-rose-400",       categories: ["Milestone","Indoor"],    ageRange: "1 yr", avgCost: "$100–$500", popularity: 97, featured: false },
  { slug: "toddler",       emoji: "🧸", name: "Toddler Party",      tagline: "Simple, joyful, mess-friendly",      color: "from-yellow-300 to-amber-400",    categories: ["Milestone","Indoor"],    ageRange: "2–3",  avgCost: "$75–$300",  popularity: 83, featured: false },
  { slug: "teens",         emoji: "🎸", name: "Teen Birthday",      tagline: "Too cool for kiddie parties",        color: "from-zinc-700 to-gray-900",       categories: ["Teens","Indoor"],        ageRange: "13+",  avgCost: "$200–$600", popularity: 80, featured: false },
  { slug: "twins",         emoji: "👯", name: "Twins Party",        tagline: "Double the fun, double the cake",    color: "from-violet-400 to-fuchsia-500",  categories: ["Milestone","Indoor"],    ageRange: "Any",  avgCost: "$150–$500", popularity: 55, featured: false },

  // 🌍 CULTURAL & OTHER
  { slug: "luau",          emoji: "🌺", name: "Luau / Hawaiian",    tagline: "Aloha — paradise in your backyard",  color: "from-orange-400 to-pink-500",     categories: ["Outdoor","Cultural"],    ageRange: "4–16", avgCost: "$100–$350", popularity: 74, featured: false },
  { slug: "fiesta",        emoji: "🪅", name: "Fiesta",             tagline: "Colorful, loud & full of joy",       color: "from-red-500 to-orange-500",      categories: ["Outdoor","Cultural"],    ageRange: "3–14", avgCost: "$100–$400", popularity: 67, featured: false },
  { slug: "glow-party",    emoji: "🌟", name: "Glow / Neon Party",  tagline: "Light up the night",                 color: "from-violet-600 to-fuchsia-600",  categories: ["Indoor","Teens"],        ageRange: "7–16", avgCost: "$150–$450", popularity: 84, featured: false },
  { slug: "farm",          emoji: "🐄", name: "Farm Animals",       tagline: "Down on the birthday farm",           color: "from-lime-400 to-green-500",      categories: ["Outdoor","Animals"],     ageRange: "1–8",  avgCost: "$100–$400", popularity: 66, featured: false },
];

const FILTER_CATEGORIES = ["All", "Active", "Creative", "Fantasy", "Adventure", "Indoor", "Outdoor", "Educational", "Teens", "Milestone", "Animals", "Cultural"];
const AGE_FILTERS = ["All Ages", "Toddlers (1–3)", "Ages 4–6", "Ages 7–9", "Ages 10–12", "Teens (13+)"];
const SORT_OPTIONS = ["Most Popular", "A–Z", "Lowest Cost"];

const confetti = [
  { top:"6%",  left:"3%",  color:"#FF6B9D", size:9,  rotate:15  },
  { top:"10%", left:"91%", color:"#4ECDC4", size:7,  rotate:-20 },
  { top:"20%", left:"87%", color:"#FFE66D", size:11, rotate:45  },
  { top:"4%",  left:"74%", color:"#A78BFA", size:6,  rotate:-10 },
  { top:"30%", left:"6%",  color:"#4ECDC4", size:8,  rotate:30  },
  { top:"50%", left:"95%", color:"#FF6B9D", size:5,  rotate:-35 },
  { top:"65%", left:"2%",  color:"#FFE66D", size:10, rotate:20  },
  { top:"78%", left:"89%", color:"#A78BFA", size:7,  rotate:50  },
  { top:"88%", left:"7%",  color:"#4ECDC4", size:9,  rotate:-15 },
];

export default function ExploreThemesPage() {
  const [search, setSearch]               = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeAge, setActiveAge]         = useState("All Ages");
  const [sortBy, setSortBy]               = useState("Most Popular");
  const [savedThemes, setSavedThemes]     = useState([]);

  const toggleSave = (slug) =>
    setSavedThemes(p => p.includes(slug) ? p.filter(x => x !== slug) : [...p, slug]);

  const filtered = useMemo(() => {
    let list = [...ALL_THEMES];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.categories.some(c => c.toLowerCase().includes(q))
      );
    }
    if (activeCategory !== "All") {
      list = list.filter(t => t.categories.includes(activeCategory));
    }
    if (activeAge !== "All Ages") {
      const ageMap = {
        "Toddlers (1–3)": ["1 yr","2–3","2–9","1–8","3–9","3–10","Any"],
        "Ages 4–6":       ["4–12","4–14","4–16","4–11","4–9","3–12","3–9","3–10","4–6","Any"],
        "Ages 7–9":       ["4–12","5–12","5–13","5–14","7–16","7–9","4–16","3–12","Any"],
        "Ages 10–12":     ["4–12","5–12","7–16","10–12","4–16","3–12","Any"],
        "Teens (13+)":    ["7–16","13+","4–16","Any"],
      };
      const allowed = ageMap[activeAge] ?? [];
      list = list.filter(t => allowed.some(a => t.ageRange.includes(a.split("–")[0]) || t.ageRange === a));
    }
    if (sortBy === "A–Z")          list.sort((a,b) => a.name.localeCompare(b.name));
    if (sortBy === "Most Popular") list.sort((a,b) => b.popularity - a.popularity);
    if (sortBy === "Lowest Cost")  list.sort((a,b) => parseInt(a.avgCost.replace(/\D/g,"")) - parseInt(b.avgCost.replace(/\D/g,"")));

    return list;
  }, [search, activeCategory, activeAge, sortBy]);

  const featured = ALL_THEMES.filter(t => t.featured);
  const clearFilters = () => { setSearch(""); setActiveCategory("All"); setActiveAge("All Ages"); };

  return (
    <div className="min-h-screen bg-pink-50 relative overflow-x-hidden">

      {/* Confetti */}
      {confetti.map((c, i) => (
        <div key={i} className="fixed pointer-events-none z-0 opacity-50"
          style={{ top: c.top, left: c.left, width: c.size, height: c.size * 2.5,
            backgroundColor: c.color, transform: `rotate(${c.rotate}deg)`, borderRadius: 2 }} />
      ))}

      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 25% 50%, white 1.5px, transparent 1.5px), radial-gradient(circle at 75% 25%, white 1.5px, transparent 1.5px)", backgroundSize: "48px 48px" }} />
        <div className="max-w-5xl mx-auto px-6 py-14 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-4">
            <Link to="/explore" className="hover:text-white transition-colors">Explore</Link>
            <span>›</span>
            <span className="text-white">All Themes</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
            🎉 Browse All Party Themes
          </h1>
          <p className="text-pink-100 text-lg max-w-xl mx-auto mb-8">
            {ALL_THEMES.length} themes with full planning guides, vendor lists, checklists & AI-powered plans
          </p>

          {/* Search */}
          <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2 max-w-xl mx-auto">
            <div className="flex items-center gap-2 flex-1 px-3">
              <svg className="w-4 h-4 text-pink-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search themes... e.g. gymnastics, princess, glow"
                className="flex-1 outline-none text-gray-700 text-sm placeholder-gray-400 bg-transparent"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
              )}
            </div>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* Featured Themes — only when not filtering */}
        {!search && activeCategory === "All" && activeAge === "All Ages" && (
          <div className="mb-12">
            <div className="flex justify-between items-baseline mb-5">
              <h2 className="text-2xl font-black text-gray-800">⭐ Featured Themes</h2>
              <span className="text-xs text-gray-400">Most booked this month</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featured.map(theme => (
                <Link key={theme.slug} to={`/explore/themes/${theme.slug}`}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all block">
                  <div className={`bg-gradient-to-br ${theme.color} p-7 h-full`}>
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      🔥 {theme.popularity}% love it
                    </div>
                    <button
                      onClick={e => { e.preventDefault(); toggleSave(theme.slug); }}
                      className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-sm w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      {savedThemes.includes(theme.slug) ? "♥" : "♡"}
                    </button>
                    <span className="text-5xl block mb-3 mt-4">{theme.emoji}</span>
                    <h3 className="text-white font-black text-xl mb-1">{theme.name}</h3>
                    <p className="text-white/80 text-sm mb-4">{theme.tagline}</p>
                    <div className="flex gap-4 text-white/70 text-xs">
                      <span>👶 {theme.ageRange}</span>
                      <span>💰 {theme.avgCost}</span>
                    </div>
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {theme.categories.map(c => (
                        <span key={c} className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-semibold">{c}</span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center gap-1 text-white font-bold text-sm group-hover:gap-2 transition-all">
                      View full guide <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-5">

            {/* Category filter */}
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Filter by Type</p>
              <div className="flex flex-wrap gap-2">
                {FILTER_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      activeCategory === cat
                        ? "bg-pink-500 text-white border-pink-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-pink-300"
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Right-side filters */}
            <div className="flex flex-col gap-3 sm:w-48 shrink-0">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Age Group</p>
                <select value={activeAge} onChange={e => setActiveAge(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 bg-white outline-none focus:border-pink-400">
                  {AGE_FILTERS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sort By</p>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 bg-white outline-none focus:border-pink-400">
                  {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex justify-between items-center mb-5">
          <p className="text-sm text-gray-500">
            Showing <strong className="text-gray-800">{filtered.length}</strong> themes
            {search && <> matching <strong className="text-pink-500">"{search}"</strong></>}
            {activeCategory !== "All" && <> in <strong className="text-pink-500">{activeCategory}</strong></>}
          </p>
          {(search || activeCategory !== "All" || activeAge !== "All Ages") && (
            <button onClick={clearFilters} className="text-xs text-pink-500 font-semibold hover:underline">
              Clear filters ×
            </button>
          )}
        </div>

        {/* Theme Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎈</p>
            <p className="text-gray-500 font-semibold">No themes found for that search.</p>
            <button onClick={clearFilters} className="mt-4 text-pink-500 font-bold text-sm hover:underline">
              Clear filters and show all
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-14">
            {filtered.map(theme => (
              <Link key={theme.slug} to={`/explore/themes/${theme.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-pink-200 hover:-translate-y-1 hover:shadow-lg transition-all block relative">

                {/* Save button */}
                <button
                  onClick={e => { e.preventDefault(); toggleSave(theme.slug); }}
                  className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all ${
                    savedThemes.includes(theme.slug)
                      ? "bg-pink-100 text-pink-500"
                      : "bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {savedThemes.includes(theme.slug) ? "♥" : "♡"}
                </button>

                {/* Color header */}
                <div className={`bg-gradient-to-br ${theme.color} h-24 flex items-center justify-center text-4xl relative`}>
                  {theme.emoji}
                  {theme.featured && (
                    <span className="absolute bottom-2 left-2 bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">⭐ Featured</span>
                  )}
                </div>

                {/* Card body */}
                <div className="p-3.5">
                  <h3 className="font-black text-gray-800 text-sm leading-tight mb-0.5">{theme.name}</h3>
                  <p className="text-gray-400 text-xs leading-snug mb-2.5">{theme.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">👶 {theme.ageRange}</span>
                    <span className="text-xs font-bold text-pink-500">{theme.avgCost}</span>
                  </div>
                  <div className="flex gap-1 flex-wrap mt-2">
                    {theme.categories.slice(0, 2).map(c => (
                      <span key={c} className="bg-pink-50 text-pink-500 text-xs px-2 py-0.5 rounded-full font-semibold">{c}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Saved Themes */}
        {savedThemes.length > 0 && (
          <div className="bg-white rounded-2xl border border-pink-200 p-6 mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-gray-800">♥ Your Saved Themes ({savedThemes.length})</h2>
              <button onClick={() => setSavedThemes([])} className="text-xs text-gray-400 hover:text-red-400 font-medium">Clear all</button>
            </div>
            <div className="flex gap-3 flex-wrap">
              {savedThemes.map(slug => {
                const t = ALL_THEMES.find(x => x.slug === slug);
                if (!t) return null;
                return (
                  <Link key={slug} to={`/explore/themes/${slug}`}
                    className="flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-xl px-3 py-2 hover:bg-pink-100 transition-colors">
                    <span className="text-lg">{t.emoji}</span>
                    <span className="text-sm font-bold text-gray-700">{t.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Banner */}
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h2 className="text-white font-black text-2xl mb-2">✨ Can't decide? Let AI pick for you.</h2>
            <p className="text-pink-100 text-sm max-w-md leading-relaxed">
              Tell us your child's age, interests, and budget — PartyPlann's AI recommends the perfect theme
              and builds a complete party plan in 60 seconds.
            </p>
          </div>
          <Link to="/app"
            className="bg-white text-pink-500 font-black text-sm px-8 py-3.5 rounded-2xl hover:bg-pink-50 transition-colors shadow-lg whitespace-nowrap shrink-0">
            🎉 Get My Theme Recommendation
          </Link>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 text-center py-6 text-xs text-gray-400 mt-4">
        <strong className="text-gray-600">PartyPlann.com</strong> · AI-powered birthday party planning ·
        © {new Date().getFullYear()} · Safety Harbor, FL
      </footer>
    </div>
  );
}
