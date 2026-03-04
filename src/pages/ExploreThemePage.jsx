import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';

// ─── All theme data ─────────────────────────────────────────────────────────
const THEME_DATA = {
  gymnastics: {
    slug: "gymnastics",
    emoji: "🤸",
    name: "Gymnastics Birthday Party",
    tagline: "Flip, tumble, and celebrate — the most active birthday party around",
    color: "from-teal-400 to-emerald-500",
    lightColor: "bg-teal-50",
    accentColor: "text-teal-600",
    borderColor: "border-teal-200",
    btnColor: "bg-teal-500 hover:bg-teal-600",
    ageRange: "Ages 3–12",
    avgCost: "$200–$500",
    guestCount: "10–25 kids",
    planningTime: "2–4 weeks",
    description: "Gymnastics parties are a guaranteed hit — kids get to jump, tumble, and play on real equipment while having a blast. Most gymnastics venues provide trained coaches, foam pits, balance beams, and trampolines. Perfect for active kids who love to move.",
    tags: ["Active", "Indoor", "Coach-Led", "Equipment Included", "Girls & Boys"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Book gymnastics venue or coach", "Set guest count & budget", "Send invitations"] },
      { category: "2–4 Weeks Before", items: ["Order gymnastics-themed cake", "Buy party favors (headbands, water bottles)", "Plan activities & games", "Confirm final headcount with venue"] },
      { category: "1 Week Before", items: ["Buy decorations (pink/teal/gold)", "Prep goody bags", "Confirm venue setup time", "Send reminder to guests"] },
      { category: "Day Of", items: ["Arrive 30 min early for setup", "Brief kids on safety rules", "Have non-slip socks ready for all kids", "Set up photo area"] },
    ],
    decorIdeas: [
      { emoji: "🎀", title: "Ribbon & Leotard Banner", desc: "Hang mini leotards and ribbons across the entrance" },
      { emoji: "🏅", title: "Gold Medal Centerpieces", desc: "Gold medals tied with ribbon as table centerpieces" },
      { emoji: "🌟", title: "Star Balance Beam Cake", desc: "Fondant gymnast on a balance beam topper" },
      { emoji: "🎽", title: "Team Color Scheme", desc: "Pick 2–3 team colors and carry through everything" },
      { emoji: "📸", title: "Trophy Photo Booth", desc: "Set up a podium backdrop for 1st, 2nd, 3rd place photos" },
      { emoji: "✨", title: "Glitter Balloon Arch", desc: "Gold and pink balloon arch at the entrance" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Balance Beam Cake",      desc: "Gymnast fondant topper, your child's colors" },
      { emoji: "🥤", name: "Medal Juice Boxes",       desc: "Gold ribbon tied around each juice box" },
      { emoji: "🍫", name: "Chocolate Gold Medals",  desc: "Foil-wrapped chocolate coins as favors/snacks" },
      { emoji: "🍓", name: "Fruit Gymnastics Floor", desc: "Fruit arranged in gymnastics mat shape" },
      { emoji: "🥪", name: "Mini Ribbon Sandwiches", desc: "Pinwheel sandwiches tied with ribbon toothpicks" },
      { emoji: "🍭", name: "Trophy Cake Pops",       desc: "Cake pops decorated as gold trophies" },
    ],
    activities: [
      { emoji: "🤸", title: "Floor Routine Contest",  desc: "Kids make up their own 30-second routine" },
      { emoji: "🏅", title: "Gold Medal Relay",       desc: "Team relay race with gymnastics moves between stations" },
      { emoji: "🎯", title: "Balance Beam Challenge", desc: "Walk the beam while balancing a beanbag on your head" },
      { emoji: "🌟", title: "Cartwheel Competition",  desc: "Judge cartwheels on style, distance, and flair" },
      { emoji: "🎪", title: "Foam Pit Freestyle",     desc: "Open foam pit time — kids jump and pose" },
      { emoji: "📸", title: "Gymnast Photoshoot",     desc: "Coach helps each kid strike their best pose" },
    ],
    vendors: [
      { id: 1, emoji: "🤸", name: "Flip Zone Gymnastics",     address: "825 Myrtle Ave, Clearwater",  distance: "4.8 mi", rating: 4.8, reviews: 94, open: true,  price: "From $349", bg: "from-teal-100 to-teal-50"     },
      { id: 2, emoji: "⭐", name: "Elite Gymnastics Academy", address: "1200 Main St, Dunedin",        distance: "7.2 mi", rating: 4.9, reviews: 61, open: true,  price: "From $299", bg: "from-emerald-100 to-emerald-50" },
      { id: 3, emoji: "🏅", name: "Tumble Town Party Center", address: "400 Landmark Dr, Clearwater", distance: "5.5 mi", rating: 4.7, reviews: 38, open: false, price: "From $249", bg: "from-cyan-100 to-cyan-50"       },
      { id: 4, emoji: "🌟", name: "Stars Gymnastics Club",    address: "301 Main St, Safety Harbor",  distance: "1.8 mi", rating: 4.6, reviews: 27, open: true,  price: "From $199", bg: "from-teal-100 to-green-50"     },
    ],
    faqs: [
      { q: "What age is best for a gymnastics party?",  a: "Ages 4–10 are the sweet spot. Most venues accommodate ages 3+ with toddler-safe equipment, and teens can also enjoy more advanced activities." },
      { q: "Do kids need prior gymnastics experience?", a: "Not at all! Venues are designed for all skill levels. Coaches guide beginners through safe, fun activities everyone can do." },
      { q: "What should kids wear?",                    a: "Comfortable athletic clothing — leggings, shorts, or a leotard. Non-slip socks are usually required (many venues sell them)." },
      { q: "How many kids can attend?",                 a: "Most venues host 10–25 kids comfortably. For larger groups, book a private session or split into two activity rotations." },
      { q: "How far in advance should I book?",         a: "4–6 weeks is ideal for weekend slots. Popular venues fill up fast — especially spring and summer weekends." },
    ],
    relatedThemes: [
      { emoji: "⚽", name: "Sports Party",    slug: "sports"      },
      { emoji: "💃", name: "Dance Party",     slug: "dance"       },
      { emoji: "🧗", name: "Adventure Party", slug: "adventure"   },
      { emoji: "🦸", name: "Superhero Party", slug: "superheroes" },
    ],
  },

  princess: {
    slug: "princess",
    emoji: "👑",
    name: "Princess Birthday Party",
    tagline: "Every child deserves to feel like royalty on their special day",
    color: "from-pink-400 to-rose-500",
    lightColor: "bg-pink-50",
    accentColor: "text-pink-600",
    borderColor: "border-pink-200",
    btnColor: "bg-pink-500 hover:bg-pink-600",
    ageRange: "Ages 2–10",
    avgCost: "$150–$600",
    guestCount: "8–20 kids",
    planningTime: "3–5 weeks",
    description: "Princess parties are pure magic — tiaras, wands, royal gowns, and a whole lot of sparkle. Whether you go Disney-inspired or a custom fairy-tale theme, this classic party never gets old. Add a character visit and you'll have kids talking about it for years.",
    tags: ["Magical", "Dress-Up", "Indoor", "Girls", "Character-Friendly"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Book character appearance (if desired)", "Reserve venue or plan home setup", "Send royal invitation scrolls"] },
      { category: "2–4 Weeks Before", items: ["Order tiered princess cake", "Buy tiaras & wands for all guests", "Plan royal activities", "Confirm character booking"] },
      { category: "1 Week Before", items: ["Set up DIY crown-making station supplies", "Prep royal decree goody bags", "Arrange pink/gold decorations", "Print activity sheets"] },
      { category: "Day Of", items: ["Set up throne photo backdrop", "Welcome guests with tiaras at door", "Have 'royal court' music playlist ready", "Brief character on child's favorites"] },
    ],
    decorIdeas: [
      { emoji: "👑", title: "Tiara Balloon Arch",   desc: "Pink, gold, and white balloons with crown toppers" },
      { emoji: "🏰", title: "Castle Backdrop",       desc: "Printed castle backdrop for the photo area" },
      { emoji: "🌹", title: "Rose Centerpieces",     desc: "Pink roses in gold vases on every table" },
      { emoji: "✨", title: "Glitter Table Runner",  desc: "Gold glitter runners with fairy light accents" },
      { emoji: "🎀", title: "Throne Chair",          desc: "Decorated chair with tulle and flowers for the birthday child" },
      { emoji: "🪄", title: "Magic Wand Favors",    desc: "Wands in favor boxes as place settings" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Tiered Castle Cake",    desc: "Multi-tier cake with turrets and edible pearls" },
      { emoji: "🥤", name: "Royal Punch Bowl",       desc: "Pink lemonade with rose petals and edible glitter" },
      { emoji: "🍓", name: "Ruby Red Strawberries", desc: "Chocolate-dipped strawberries on gold skewers" },
      { emoji: "🥪", name: "Royal Tea Sandwiches",  desc: "Crustless finger sandwiches on tiered stands" },
      { emoji: "🍭", name: "Crown Sugar Cookies",   desc: "Custom iced crown-shaped cookies" },
      { emoji: "🧁", name: "Pink Ombre Cupcakes",   desc: "Gradient pink frosting with gold star sprinkles" },
    ],
    activities: [
      { emoji: "👑", title: "Crown Decorating",      desc: "Each guest decorates their own tiara with gems and ribbons" },
      { emoji: "🪄", title: "Royal Wand Making",     desc: "DIY wand craft with ribbons and star toppers" },
      { emoji: "💅", title: "Royal Beauty Salon",    desc: "Nail painting, hair braiding, and lip gloss station" },
      { emoji: "🎭", title: "Princess Parade",       desc: "Mini runway walk in costumes with music" },
      { emoji: "📸", title: "Royal Portrait Studio", desc: "Throne + backdrop for individual princess portraits" },
      { emoji: "🎵", title: "Royal Dance Party",     desc: "Princess soundtrack dance-off with freeze dance" },
    ],
    vendors: [
      { id: 1, emoji: "👑", name: "Royal Character Visits",  address: "Tampa Bay Area",            distance: "Travels to you", rating: 5.0, reviews: 143, open: true,  price: "From $199", bg: "from-pink-100 to-rose-50"   },
      { id: 2, emoji: "🏰", name: "Enchanted Events Studio", address: "200 Bayshore Blvd, Tampa",  distance: "14 mi",          rating: 4.8, reviews: 87,  open: true,  price: "From $399", bg: "from-purple-100 to-pink-50" },
      { id: 3, emoji: "✨", name: "Sparkle Party Rentals",   address: "101 Main St, Safety Harbor",distance: "1.2 mi",         rating: 4.7, reviews: 52,  open: true,  price: "From $149", bg: "from-pink-100 to-pink-50"   },
      { id: 4, emoji: "🎂", name: "Sugar & Crowns Bakery",   address: "340 Main St, Dunedin",      distance: "6.1 mi",         rating: 4.9, reviews: 61,  open: false, price: "From $95",  bg: "from-rose-100 to-pink-50"   },
    ],
    faqs: [
      { q: "Which princess characters are most popular?",            a: "Elsa and Anna (Frozen), Cinderella, Ariel, and Moana consistently top the list. Non-Disney options like fairy godmothers and generic queens are also a hit." },
      { q: "Should I hire a character or DIY?",                      a: "A character visit creates unforgettable moments but costs $150–$300. For smaller budgets, a dress-up station and themed activities work just as well." },
      { q: "What age range works best?",                             a: "Ages 3–7 are the magic zone for princess parties. Kids 8–10 may prefer more specific themes like Encanto or their current favorite character." },
      { q: "How do I handle kids who want to be the same princess?", a: "Encourage a 'royal court' concept — every guest is a different princess or has their own royal title. No two crowns look the same!" },
      { q: "Indoor or outdoor?",                                     a: "Both work! Outdoor garden parties are beautiful in spring. Indoor gives you more control over decor and weather in Florida summers." },
    ],
    relatedThemes: [
      { emoji: "🦄", name: "Unicorn Party", slug: "unicorn"   },
      { emoji: "🧜", name: "Mermaid Party", slug: "mermaid"   },
      { emoji: "🏰", name: "Fairy Tale",    slug: "fairytale" },
      { emoji: "🎀", name: "Glamour Party", slug: "glamour"   },
    ],
  },

  superheroes: {
    slug: "superheroes",
    emoji: "🦸",
    name: "Superhero Birthday Party",
    tagline: "Train the next generation of heroes — capes required",
    color: "from-blue-500 to-indigo-600",
    lightColor: "bg-blue-50",
    accentColor: "text-blue-600",
    borderColor: "border-blue-200",
    btnColor: "bg-blue-500 hover:bg-blue-600",
    ageRange: "Ages 3–12",
    avgCost: "$150–$450",
    guestCount: "10–30 kids",
    planningTime: "2–4 weeks",
    description: "Superhero parties are endlessly customizable — go Marvel, DC, or invent your own heroes. Kids love the training academy concept where they complete missions and earn their cape. High energy, easy to scale up or down, and works for all genders.",
    tags: ["Action-Packed", "Outdoor-Friendly", "DIY-Easy", "All Genders", "Customizable"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose superhero theme (Marvel/DC/custom)", "Book venue or plan backyard setup", "Design custom 'hero academy' invites"] },
      { category: "2–4 Weeks Before", items: ["Order capes & masks for all guests", "Plan training missions & obstacle course", "Order themed cake", "Buy comic-style decorations"] },
      { category: "1 Week Before", items: ["Set up mission briefing backdrop", "Prep goody bags with hero gear", "Print mission cards for each guest", "Set up obstacle course equipment"] },
      { category: "Day Of", items: ["Welcome heroes with cape at the door", "Run hero training academy activities", "Award medals to all heroes at the end", "Cake reveal with dramatic music"] },
    ],
    decorIdeas: [
      { emoji: "💥", title: "Comic Book Panels",     desc: "Giant POW / ZAP / BOOM cutouts as wall decor" },
      { emoji: "🦸", title: "Cape Backdrop",          desc: "Mini capes hung on a line as the photo wall" },
      { emoji: "⭐", title: "Star Balloon Columns",   desc: "Red, blue, and yellow balloon columns at entrance" },
      { emoji: "🎯", title: "Mission Briefing Table", desc: "Kraft paper tablecloth with mission details drawn on" },
      { emoji: "🏆", title: "Hero Hall of Fame",      desc: "Photo wall of 'wanted hero' posters for each guest" },
      { emoji: "🌟", title: "Glow-in-Dark Elements", desc: "Neon accents that glow under blacklight — epic for evening parties" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Shield Cake",         desc: "Captain America shield or custom hero emblem cake" },
      { emoji: "🍕", name: "Hero Fuel Pizza",     desc: "Pizza bites labeled 'Hero Fuel' on a kraft paper sign" },
      { emoji: "🥤", name: "Power Punch",          desc: "Blue lemonade with dry ice fog effect (for older kids)" },
      { emoji: "🍫", name: "Kryptonite Bars",     desc: "Green Rice Krispie treats shaped into crystals" },
      { emoji: "🍭", name: "Shield Cookies",      desc: "Custom frosted cookies with each hero's emblem" },
      { emoji: "🍓", name: "Power Berry Skewers", desc: "Red, white, and blue fruit skewers" },
    ],
    activities: [
      { emoji: "🏃", title: "Hero Training Academy",   desc: "Obstacle course with jumps, crawls, and target throwing" },
      { emoji: "🎯", title: "Villain Target Toss",     desc: "Throw beanbags at printed villain targets" },
      { emoji: "🦸", title: "Cape Decorating",         desc: "Each kid personalizes their own cape with fabric markers" },
      { emoji: "💥", title: "Save the City Mission",   desc: "Team puzzle/scavenger hunt to 'save the city'" },
      { emoji: "📸", title: "Hero Photo Booth",        desc: "Masks, capes, and prop weapons for epic hero shots" },
      { emoji: "🏅", title: "Hero Graduation Ceremony",desc: "Each child receives their hero name and medal" },
    ],
    vendors: [
      { id: 1, emoji: "🦸", name: "Hero Academy Events",       address: "Tampa Bay Area",            distance: "Travels to you", rating: 4.9, reviews: 76, open: true,  price: "From $299", bg: "from-blue-100 to-indigo-50"  },
      { id: 2, emoji: "🎪", name: "Super Squad Party Rentals", address: "500 N Dale Mabry, Tampa",   distance: "12 mi",          rating: 4.7, reviews: 44, open: true,  price: "From $199", bg: "from-blue-100 to-blue-50"    },
      { id: 3, emoji: "🎂", name: "Comic Cake Studio",         address: "210 Main St, Dunedin",      distance: "6.5 mi",         rating: 5.0, reviews: 28, open: false, price: "From $85",  bg: "from-indigo-100 to-blue-50"  },
      { id: 4, emoji: "📸", name: "Cape & Click Photography",  address: "101 Main St, Safety Harbor",distance: "1.2 mi",         rating: 4.8, reviews: 33, open: true,  price: "From $250", bg: "from-blue-100 to-cyan-50"    },
    ],
    faqs: [
      { q: "Marvel or DC — which is more popular for parties?", a: "Marvel edges out DC for kids currently (Spider-Man, Iron Man, Thor are perennial favorites). For girls, Wonder Woman is always a top pick regardless of universe." },
      { q: "Can I mix characters from different universes?",    a: "Absolutely — 'All Heroes Welcome' is actually a fun theme concept. Custom 'hero academy' themes that aren't tied to specific IP are also very popular." },
      { q: "What's the best activity for superhero parties?",   a: "The Hero Training Academy obstacle course consistently gets the biggest reaction. Kids love completing missions and earning their hero status." },
      { q: "Indoor or outdoor?",                               a: "Outdoor works great for obstacle courses and active play. Indoor is better if you want dramatic lighting effects (blacklights, spotlights)." },
      { q: "How do I handle kids who are scared of villains?",  a: "Keep villains cartoonish and non-threatening (printed paper targets vs. costumed characters). Frame everything as 'the heroes always win.'" },
    ],
    relatedThemes: [
      { emoji: "🦸‍♀️", name: "Girl Power",    slug: "girl-power"  },
      { emoji: "🔬",  name: "Science Party", slug: "science"     },
      { emoji: "🚀",  name: "Space Party",   slug: "space"       },
      { emoji: "🎮",  name: "Gaming Party",  slug: "gaming"      },
    ],
  },

  science: {
    slug: "science",
    emoji: "🔬",
    name: "Science & STEM Birthday Party",
    tagline: "Experiments that blow minds — the coolest party in the lab",
    color: "from-violet-500 to-purple-600",
    lightColor: "bg-violet-50",
    accentColor: "text-violet-600",
    borderColor: "border-violet-200",
    btnColor: "bg-violet-500 hover:bg-violet-600",
    ageRange: "Ages 5–12",
    avgCost: "$200–$450",
    guestCount: "8–20 kids",
    planningTime: "2–4 weeks",
    description: "Science parties are perfect for curious kids who love to discover, build, and experiment. From erupting volcanoes to slime-making to fizzing potions, every activity is hands-on and wow-worthy. Great for both boys and girls — especially the ones who always ask 'why?'",
    tags: ["Educational", "Hands-On", "Indoor", "All Genders", "STEM"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Book science party kit or mad scientist entertainer", "Set guest count & budget", "Send 'lab invitation' styled invites"] },
      { category: "2–4 Weeks Before", items: ["Order science-themed cake", "Buy lab coat favors & safety goggles", "Gather experiment supplies (vinegar, baking soda, slime ingredients)", "Plan 3–4 main experiments"] },
      { category: "1 Week Before", items: ["Test all experiments at home", "Prep color-coded stations", "Buy dry ice (optional, day-of only)", "Label beakers & cups for décor"] },
      { category: "Day Of", items: ["Set up experiment stations before guests arrive", "Put out lab coats & goggles at entrance", "Have towels/wipes at every station", "Run experiments in order from least to most messy"] },
    ],
    decorIdeas: [
      { emoji: "🧪", title: "Beaker Centerpieces",     desc: "Fill glass beakers with colored water and glow sticks" },
      { emoji: "⚗️", title: "Periodic Table Banner",   desc: "Element cards for each guest with their 'element name'" },
      { emoji: "🔭", title: "Galaxy Balloon Arch",      desc: "Purple, blue, and white balloons with star accents" },
      { emoji: "🧬", title: "DNA Spiral Garland",       desc: "Paper chain in double-helix shape hung across the room" },
      { emoji: "⚡", title: "Caution Tape Accents",     desc: "Yellow caution tape framing food tables for lab effect" },
      { emoji: "🌡️", title: "Molecule String Lights",  desc: "Round bulb string lights to look like atom models" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Periodic Table Cake",     desc: "Each slice labeled with a fun element symbol" },
      { emoji: "🧃", name: "Potion Juice Boxes",      desc: "Juice boxes with custom 'Lab Specimen' labels" },
      { emoji: "🍬", name: "Edible Slime Cups",       desc: "Green jello with gummy worms served in beakers" },
      { emoji: "🍕", name: "Molecule Pizza Bites",    desc: "Mini pizzas arranged in atom formation on the tray" },
      { emoji: "🧁", name: "Petri Dish Cupcakes",     desc: "Cupcakes in clear dishes with agar-colored frosting" },
      { emoji: "🍭", name: "Rock Candy Crystals",     desc: "Homemade or store-bought rock candy as 'geode specimens'" },
    ],
    activities: [
      { emoji: "🌋", title: "Volcano Eruption",         desc: "Baking soda + vinegar + food coloring — classic for a reason" },
      { emoji: "🧫", title: "DIY Slime Lab",            desc: "Each kid makes their own color of slime to take home" },
      { emoji: "💡", title: "Static Electricity Show",  desc: "Balloons + hair + confetti = instant fun science" },
      { emoji: "🎨", title: "Chromatography Art",       desc: "Coffee filter + markers + water = rainbow butterfly art" },
      { emoji: "🧲", title: "Magnet Scavenger Hunt",    desc: "Find magnetic vs non-magnetic items around the party space" },
      { emoji: "🔭", title: "Mystery Box Challenge",    desc: "Guess what's inside sealed boxes using only touch and weight" },
    ],
    vendors: [
      { id: 1, emoji: "🔬", name: "Mad Scientist Lab",         address: "900 Central Ave, St. Pete",    distance: "9.2 mi", rating: 5.0, reviews: 33, open: false, price: "From $299", bg: "from-violet-100 to-purple-50" },
      { id: 2, emoji: "🧪", name: "Science Squad Parties",     address: "Tampa Bay Area",               distance: "Travels to you", rating: 4.9, reviews: 58, open: true, price: "From $249", bg: "from-purple-100 to-violet-50" },
      { id: 3, emoji: "⚗️", name: "Curious Kids STEM Studio", address: "1400 Main St, Dunedin",        distance: "6.8 mi", rating: 4.7, reviews: 22, open: true,  price: "From $199", bg: "from-indigo-100 to-violet-50" },
      { id: 4, emoji: "🎂", name: "Geek Chic Bakery",          address: "301 Main St, Safety Harbor",   distance: "1.8 mi", rating: 4.8, reviews: 17, open: true,  price: "From $85",  bg: "from-violet-100 to-fuchsia-50"},
    ],
    faqs: [
      { q: "What age is best for a science party?",         a: "Ages 5–10 are the sweet spot. Younger kids love the visual wow factor (volcanoes, slime). Older kids 9–12 enjoy more structured experiments and STEM challenges." },
      { q: "Is it too messy for indoors?",                  a: "With proper prep — plastic tablecloths, aprons, and wipes at every station — it's totally manageable indoors. Slime and paint stations can go on a covered floor area." },
      { q: "Do I need a professional entertainer?",         a: "Not required, but a 'Mad Scientist' entertainer adds huge wow factor and handles all the prep. Budget $150–$300 for a 1-hour performance with experiments." },
      { q: "What's the best single experiment for impact?", a: "The classic baking soda volcano is always a hit, but elephant toothpaste (hydrogen peroxide + yeast) gets the biggest reaction from kids 7 and up." },
      { q: "What do kids take home as favors?",             a: "Their slime container, a bag of rock candy 'crystals,' and a mini experiment kit (vinegar + baking soda) with instructions are all popular and affordable." },
    ],
    relatedThemes: [
      { emoji: "🦸", name: "Superhero Party",  slug: "superheroes" },
      { emoji: "🚀", name: "Space Party",       slug: "space"       },
      { emoji: "🎮", name: "Gaming Party",      slug: "gaming"      },
      { emoji: "🧁", name: "Baking Party",      slug: "baking"      },
    ],
  },

  sports: {
    slug: "sports",
    emoji: "⚽",
    name: "Sports Birthday Party",
    tagline: "Game on — the ultimate athlete birthday experience",
    color: "from-green-500 to-emerald-600",
    lightColor: "bg-green-50",
    accentColor: "text-green-600",
    borderColor: "border-green-200",
    btnColor: "bg-green-500 hover:bg-green-600",
    ageRange: "Ages 4–16",
    avgCost: "$150–$450",
    guestCount: "10–30 kids",
    planningTime: "2–4 weeks",
    description: "Sports parties work for every age and every sport — soccer, basketball, football, or a multi-sport combo. Kids love the energy of friendly competition, team games, and earning trophies. Go for a single sport theme or mix it up with a 'Sports Day' Olympics-style format that everyone can enjoy.",
    tags: ["Active", "Outdoor-Friendly", "All Genders", "Competitive", "Team Fun"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose sport(s) theme", "Book venue or reserve park/field", "Send MVP-styled invitations"] },
      { category: "2–4 Weeks Before", items: ["Order sport-themed cake", "Buy mini trophies or medals for all guests", "Plan team games & activity rotation", "Order jerseys or pennants (optional)"] },
      { category: "1 Week Before", items: ["Buy decorations in team colors", "Set up team assignments (split guests into 2 teams)", "Prep goody bags with sport gear", "Confirm field/venue setup time"] },
      { category: "Day Of", items: ["Mark out game zones with cones", "Assign teams & hand out colored pinnies", "Referee games yourself or hire one", "Award ceremony at the end with medals/trophies"] },
    ],
    decorIdeas: [
      { emoji: "🏆", title: "Trophy Centerpieces",      desc: "Mini trophies or trophy-shaped balloons on every table" },
      { emoji: "📣", title: "Team Pennant Banner",       desc: "Felt pennants in two team colors across the venue" },
      { emoji: "🎯", title: "Scoreboard Backdrop",       desc: "Giant scoreboard with the birthday kid's name as a team" },
      { emoji: "⭐", title: "MVP Photo Wall",            desc: "Each guest gets a 'player card' photo op at the wall" },
      { emoji: "🏅", title: "Medal Napkin Holders",      desc: "Ribbon-tied medal around each rolled napkin" },
      { emoji: "🎈", title: "Sport Ball Balloons",       desc: "Soccer, basketball & football printed balloons everywhere" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Stadium Cake",            desc: "Field or court design with fondant players on top" },
      { emoji: "🏆", name: "Trophy Cake Pops",        desc: "Gold-dipped cake pops shaped like trophies" },
      { emoji: "🌭", name: "Stadium Hot Dogs",         desc: "Hot dogs in mini buns with sport toothpick flags" },
      { emoji: "🍿", name: "Game Day Popcorn",         desc: "Popcorn in team-colored striped bags" },
      { emoji: "🥤", name: "Sports Drink Station",    desc: "Gatorade colors in clear dispensers labeled by team" },
      { emoji: "🍓", name: "Fruit Ball Skewers",      desc: "Watermelon + cantaloupe + honeydew on sport-colored picks" },
    ],
    activities: [
      { emoji: "⚽", title: "Penalty Kick Challenge",    desc: "Each kid gets 3 kicks — goalie rotates every round" },
      { emoji: "🏀", title: "Free Throw Contest",        desc: "3-point challenge bracket with elimination rounds" },
      { emoji: "🏃", title: "Olympic Relay Race",        desc: "4-legged, sack, and sprint relays for both teams" },
      { emoji: "🎯", title: "Target Throw",              desc: "Throw balls at numbered targets for points" },
      { emoji: "🏅", title: "Medal Ceremony",            desc: "Every player earns a medal — podium photos for top 3" },
      { emoji: "📸", title: "Sports Photo Booth",        desc: "Jersey numbers, foam fingers, and sport props for pics" },
    ],
    vendors: [
      { id: 1, emoji: "⚽", name: "Tampa Bay Soccer Parties",    address: "400 N Dale Mabry, Tampa",     distance: "12 mi",  rating: 4.8, reviews: 67, open: true,  price: "From $249", bg: "from-green-100 to-emerald-50" },
      { id: 2, emoji: "🏀", name: "All-Star Sports Events",      address: "825 Myrtle Ave, Clearwater",  distance: "4.8 mi", rating: 4.9, reviews: 44, open: true,  price: "From $299", bg: "from-green-100 to-teal-50"    },
      { id: 3, emoji: "🏆", name: "Champions Party Rentals",     address: "500 Main St, Safety Harbor",  distance: "1.5 mi", rating: 4.7, reviews: 31, open: true,  price: "From $149", bg: "from-emerald-100 to-green-50" },
      { id: 4, emoji: "🎂", name: "Game Day Cake Studio",        address: "210 Main St, Dunedin",        distance: "6.3 mi", rating: 4.6, reviews: 19, open: false, price: "From $85",  bg: "from-green-100 to-lime-50"    },
    ],
    faqs: [
      { q: "Single sport or multi-sport?",                      a: "Single sport is easier to plan and great if your child has a clear favorite. Multi-sport 'Olympics' format works better for mixed groups where kids play different sports." },
      { q: "Indoor or outdoor?",                                a: "Outdoor is ideal for most sports parties — more space, more energy. Have a backup indoor plan for Florida summer rain. Gyms work great for basketball and dodgeball themes." },
      { q: "How do I keep it fair for younger or less athletic kids?", a: "Use non-elimination formats, rotate teams often, and emphasize fun over winning. Give every child the same medal — the ceremony is the highlight, not the score." },
      { q: "What sport is most popular for parties?",           a: "Soccer is the most universally loved, followed by basketball and obstacle-course formats. Football works best with older kids (8+) who know the rules." },
      { q: "Do I need a referee or sports coordinator?",        a: "For groups under 15, a parent can manage games easily. For 15–30 kids, hiring a sports coordinator ($100–$200) makes the day much smoother." },
    ],
    relatedThemes: [
      { emoji: "🤸", name: "Gymnastics Party",  slug: "gymnastics"  },
      { emoji: "🥷", name: "Ninja Warrior",     slug: "ninja"       },
      { emoji: "🦸", name: "Superhero Party",   slug: "superheroes" },
      { emoji: "🏊", name: "Pool Party",        slug: "swimming"    },
    ],
  },

  mermaid: {
    slug: "mermaid",
    emoji: "🧜",
    name: "Mermaid Birthday Party",
    tagline: "Dive into an under-the-sea adventure full of sparkle and magic",
    color: "from-cyan-400 to-teal-500",
    lightColor: "bg-cyan-50",
    accentColor: "text-cyan-600",
    borderColor: "border-cyan-200",
    btnColor: "bg-cyan-500 hover:bg-cyan-600",
    ageRange: "Ages 3–10",
    avgCost: "$150–$450",
    guestCount: "8–20 kids",
    planningTime: "2–4 weeks",
    description: "Mermaid parties are pure enchantment — shimmery tails, ocean-blue décor, seashell crafts, and a whole lot of glitter. Whether you go for a classic under-the-sea look or a tropical beachy vibe, this theme photographs beautifully and makes kids feel like they've discovered a real underwater kingdom.",
    tags: ["Magical", "Glam", "Indoor/Outdoor", "Girls", "Craft-Friendly"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose mermaid color palette (teal/purple/coral)", "Book venue or plan backyard/pool setup", "Send ocean scroll invitations"] },
      { category: "2–4 Weeks Before", items: ["Order ombre mermaid cake", "Buy mermaid tail blankets or fin headbands for guests", "Source seashell & pearl decorations", "Plan craft station supplies"] },
      { category: "1 Week Before", items: ["Prep shell-sorting sensory bin", "Set up photo backdrop (iridescent curtain + coral)", "Make sea-glass candy jars for centerpieces", "Prep goody bags with mermaid lip gloss & shells"] },
      { category: "Day Of", items: ["Fill blue punch bowl with 'ocean punch'", "Set up fin headband station at entrance", "Scatter shells & starfish across all tables", "Play ocean/island music playlist throughout"] },
    ],
    decorIdeas: [
      { emoji: "🐚", title: "Seashell Table Scatter",    desc: "Real or faux shells, starfish, and pearls across every table" },
      { emoji: "✨", title: "Iridescent Balloon Arch",   desc: "Holographic silver, teal, and purple balloons at the entrance" },
      { emoji: "🌊", title: "Ombre Blue Fabric Draping", desc: "Layered blue/teal/aqua fabric panels as a wave backdrop" },
      { emoji: "🪸", title: "Coral Centerpieces",        desc: "Faux coral branches in sand-filled vases with LED lights" },
      { emoji: "🐠", title: "Fishbowl Centerpieces",     desc: "Clear bowls with blue gel, shells, and fake fish inside" },
      { emoji: "💎", title: "Sea Glass Candy Jars",      desc: "Frosted glass jars filled with teal and green candy gems" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Ombre Mermaid Cake",         desc: "Teal-to-purple layers with edible scales and a fin topper" },
      { emoji: "🥤", name: "Ocean Punch Bowl",            desc: "Blue lemonade with sherbet and gummy fish floating inside" },
      { emoji: "🍬", name: "Sea Glass Candy",             desc: "Frosted rock candy in ocean colors piled in glass jars" },
      { emoji: "🥪", name: "Starfish Sandwiches",         desc: "Sandwiches cut into starfish shapes with star cookie cutters" },
      { emoji: "🧁", name: "Scale Cupcakes",              desc: "Cupcakes piped with overlapping scales in teal and purple" },
      { emoji: "🍭", name: "Shell Chocolate Truffles",    desc: "Chocolate shells filled with salted caramel, wrapped in foil" },
    ],
    activities: [
      { emoji: "🐚", title: "Shell Painting",            desc: "Each guest paints and decorates their own real seashell" },
      { emoji: "💄", title: "Mermaid Makeover Station",  desc: "Shimmer eyeshadow, glitter hair spray, and scale face paint" },
      { emoji: "🎨", title: "Fin Headband Craft",        desc: "Decorate foam fin headbands with gems, glitter, and ribbon" },
      { emoji: "🌊", title: "Ocean Sensory Bin",         desc: "Blue kinetic sand + shells + treasure gems to dig and find" },
      { emoji: "📸", title: "Mermaid Photo Booth",       desc: "Iridescent backdrop with tail props for underwater portraits" },
      { emoji: "🏆", title: "Treasure Hunt",             desc: "Find 'sunken treasure' (gold coins) hidden around the party" },
    ],
    vendors: [
      { id: 1, emoji: "🧜", name: "Mermaid Magic Party Co.",    address: "Tampa Bay Area",              distance: "Travels to you", rating: 5.0, reviews: 89,  open: true,  price: "From $199", bg: "from-cyan-100 to-teal-50"    },
      { id: 2, emoji: "✨", name: "Shimmer & Splash Events",    address: "200 Bayshore Blvd, Tampa",    distance: "14 mi",          rating: 4.8, reviews: 52,  open: true,  price: "From $349", bg: "from-teal-100 to-cyan-50"    },
      { id: 3, emoji: "🎂", name: "Ocean Dream Cakery",         address: "340 Main St, Dunedin",        distance: "6.1 mi",         rating: 4.9, reviews: 38,  open: true,  price: "From $95",  bg: "from-cyan-100 to-blue-50"    },
      { id: 4, emoji: "🐚", name: "Sea & Sand Party Rentals",   address: "101 Main St, Safety Harbor",  distance: "1.2 mi",         rating: 4.7, reviews: 27,  open: false, price: "From $129", bg: "from-teal-100 to-emerald-50" },
    ],
    faqs: [
      { q: "Pool or no pool?",                                  a: "A mermaid party works beautifully without a pool — the theme is about the aesthetic, not actual swimming. If you have pool access, add mermaid tail swim floats for extra magic." },
      { q: "What's the best mermaid craft activity?",           a: "Shell painting is the #1 favorite — simple, mess-controlled, and kids go home with a keepsake. Fin headbands are a close second and make great photo props." },
      { q: "How much glitter is too much?",                     a: "There is no such thing as too much glitter at a mermaid party. Pro tip: use cosmetic-grade glitter for any face/body crafts and chunky biodegradable glitter for décor." },
      { q: "What age works best?",                              a: "Ages 4–8 are the magic zone — old enough to do crafts, young enough to fully believe in mermaids. Ages 3 still love the sparkle and colors even without full theme understanding." },
      { q: "Indoor or outdoor?",                                a: "Both work well. Indoor gives you more control over the shimmer/glow of decorations (iridescent materials look stunning in dimmer light). Outdoor near a pool or beach is naturally stunning." },
    ],
    relatedThemes: [
      { emoji: "🦄", name: "Unicorn Party",     slug: "unicorn"   },
      { emoji: "👑", name: "Princess Party",    slug: "princess"  },
      { emoji: "🏊", name: "Pool Party",        slug: "swimming"  },
      { emoji: "🏰", name: "Fairy Tale",        slug: "fairytale" },
    ],
  },

  gaming: {
    slug: "gaming",
    emoji: "🎮",
    name: "Gaming & Esports Birthday Party",
    tagline: "Level up the celebration — press start on the best party ever",
    color: "from-blue-600 to-violet-600",
    lightColor: "bg-blue-50",
    accentColor: "text-blue-600",
    borderColor: "border-blue-200",
    btnColor: "bg-blue-600 hover:bg-blue-700",
    ageRange: "Ages 7–16",
    avgCost: "$200–$500",
    guestCount: "8–16 kids",
    planningTime: "2–4 weeks",
    description: "Gaming parties are the ultimate celebration for kids who live to play — and they're way easier to pull off than you'd think. Set up a multiplayer gaming station, decorate in pixel art and neon, and watch kids be completely in their element. Works for console, PC, Roblox, Minecraft, and Fortnite fanatics alike.",
    tags: ["Indoor", "Teens", "Tech", "All Genders", "Customizable"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose gaming theme (general, Minecraft, Fortnite, Roblox, etc.)", "Plan gaming setup (how many screens/consoles needed)", "Send 'Player 1 has entered the game' invitations"] },
      { category: "2–4 Weeks Before", items: ["Order pixel art or controller cake", "Borrow or rent extra TVs/gaming setups", "Plan tournament bracket & games list", "Order gaming-themed decorations"] },
      { category: "1 Week Before", items: ["Test all consoles and game installs", "Create tournament bracket with guest names", "Set up charging stations for controllers", "Prep goody bags with gaming snacks & gear"] },
      { category: "Day Of", items: ["Set up gaming stations 1 hour early", "Run a test match before guests arrive", "Post tournament bracket on a visible board", "Have backup non-digital games for breaks"] },
    ],
    decorIdeas: [
      { emoji: "🕹️", title: "Pixel Art Backdrop",        desc: "Giant 8-bit pixel banner of the birthday kid's favorite character" },
      { emoji: "💡", title: "Neon LED Strip Lights",      desc: "Blue, purple, and green LED strips around gaming stations" },
      { emoji: "🎮", title: "Controller Balloon Garland", desc: "Black and colored balloons shaped into game controllers" },
      { emoji: "⭐", title: "Level Up Banner",            desc: "\"Happy Birthday, Player 1!\" in pixel font across the wall" },
      { emoji: "🏆", title: "Leaderboard Wall",           desc: "Whiteboard or chalkboard leaderboard updated live during party" },
      { emoji: "🌟", title: "Glow-in-Dark Elements",     desc: "Neon tape, glow cups, and blacklight for epic gaming ambiance" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Pixel Art Cake",            desc: "8-bit game character rendered in colored fondant squares" },
      { emoji: "🍕", name: "Power-Up Pizza",             desc: "Pizza slices labeled with game power-up names" },
      { emoji: "🥤", name: "Health Potion Punch",        desc: "Red punch in potion bottles or test tubes" },
      { emoji: "🍫", name: "Gold Coin Chocolates",       desc: "Foil-wrapped chocolate coins as 'in-game currency'" },
      { emoji: "🍿", name: "XP Boost Popcorn Bar",      desc: "Multiple popcorn flavors with gaming-themed labels" },
      { emoji: "🧁", name: "1-Up Mushroom Cupcakes",    desc: "Cupcakes decorated as Super Mario mushrooms or favorite game icons" },
    ],
    activities: [
      { emoji: "🏆", title: "Gaming Tournament",          desc: "Bracket-style multiplayer tournament with prizes for top 3" },
      { emoji: "🎯", title: "Just Dance Battle",          desc: "Just Dance rounds as a party break between console sessions" },
      { emoji: "🧩", title: "Video Game Trivia",          desc: "Gaming trivia rounds between tournament matches" },
      { emoji: "🕹️", title: "Free Play Station",          desc: "Open gaming area with multiple titles for non-tournament guests" },
      { emoji: "🎨", title: "Design Your Character",      desc: "Draw or build their own game character in Minecraft or paper" },
      { emoji: "📸", title: "Cosplay Photo Booth",        desc: "Game character costumes and props for epic gaming portraits" },
    ],
    vendors: [
      { id: 1, emoji: "🎮", name: "Game Truck Tampa Bay",       address: "Tampa Bay Area",              distance: "Travels to you", rating: 4.9, reviews: 112, open: true,  price: "From $349", bg: "from-blue-100 to-indigo-50"  },
      { id: 2, emoji: "🕹️", name: "Level Up Gaming Events",    address: "500 N Dale Mabry, Tampa",     distance: "12 mi",          rating: 4.8, reviews: 67,  open: true,  price: "From $299", bg: "from-violet-100 to-blue-50"  },
      { id: 3, emoji: "🎂", name: "Pixel Perfect Bakery",       address: "210 Main St, Dunedin",        distance: "6.5 mi",         rating: 4.9, reviews: 41,  open: false, price: "From $95",  bg: "from-blue-100 to-violet-50"  },
      { id: 4, emoji: "💡", name: "Neon Party Rentals",         address: "101 Main St, Safety Harbor",  distance: "1.2 mi",         rating: 4.7, reviews: 28,  open: true,  price: "From $149", bg: "from-indigo-100 to-blue-50"  },
    ],
    faqs: [
      { q: "How many gaming setups do I need?",             a: "Plan for 1 TV/console per 2–3 kids. For 12 guests, 4 setups is ideal — it keeps wait times short. A gaming truck handles all of this automatically." },
      { q: "What games work best for parties?",             a: "Multiplayer games with short rounds are key: Mario Kart, Rocket League, Minecraft mini-games, Smash Bros, and Just Dance. Avoid long single-player games." },
      { q: "Console, PC, or gaming truck?",                 a: "A gaming truck rental is the easiest — they bring everything. DIY with consoles works great too. PC setups require more prep but are ideal for Minecraft or Roblox fans." },
      { q: "How do I handle screen time concerns?",         a: "Build in two non-gaming breaks (cake, food, trivia) so gaming is roughly half the party. Parents appreciate the balance and kids enjoy the variety." },
      { q: "What's a good budget for the gaming setup?",    a: "A gaming truck runs $300–$500 for 2 hours. DIY with borrowed consoles can keep costs under $50 for the tech portion, leaving more budget for food and decorations." },
    ],
    relatedThemes: [
      { emoji: "🔬", name: "Science Party",    slug: "science"     },
      { emoji: "🚀", name: "Space Party",      slug: "space"       },
      { emoji: "🥷", name: "Ninja Warrior",    slug: "ninja"       },
      { emoji: "🎸", name: "Teen Birthday",    slug: "teens"       },
    ],
  },

  baking: {
    slug: "baking",
    emoji: "🧁",
    name: "Baking Birthday Party",
    tagline: "Mix, bake & decorate — the sweetest party idea ever",
    color: "from-yellow-400 to-orange-400",
    lightColor: "bg-yellow-50",
    accentColor: "text-yellow-600",
    borderColor: "border-yellow-200",
    btnColor: "bg-yellow-500 hover:bg-yellow-600",
    ageRange: "Ages 5–14",
    avgCost: "$150–$400",
    guestCount: "6–14 kids",
    planningTime: "2–3 weeks",
    description: "Baking parties are the perfect blend of creativity, deliciousness, and hands-on fun. Each guest gets their own workstation to decorate cupcakes, cookies, or build a mini cake — and they go home with their sweet creations as the party favor. Great for small groups and absolutely adored by kids who love to cook.",
    tags: ["Creative", "Indoor", "Hands-On", "Girls & Boys", "Edible Favors"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose baking activity (cupcakes, cookies, or mini cakes)", "Set guest count — 6–12 is ideal for baking parties", "Send 'You're invited to the bakery!' themed invites"] },
      { category: "2–4 Weeks Before", items: ["Pre-bake bases (cupcakes/cookies) or order from bakery", "Buy decorating supplies (frosting, sprinkles, fondant, piping bags)", "Set up individual workstations with supplies", "Order the birthday cake (separate from the decorating cakes)"] },
      { category: "1 Week Before", items: ["Test decorating station setup at home", "Buy aprons and chef hats for each guest", "Label ingredient bowls for each station", "Prep judging categories for friendly competition (optional)"] },
      { category: "Day Of", items: ["Set up stations 45 min before guests arrive", "Have pre-measured ingredients at each spot", "Put on a baking playlist", "Judge and taste creations before cutting the birthday cake"] },
    ],
    decorIdeas: [
      { emoji: "🎀", title: "Apron & Chef Hat Display",   desc: "Guests pick their apron color at the door — doubles as décor" },
      { emoji: "🧁", title: "Tiered Display Stand",       desc: "Pre-decorated sample cupcakes on a bakery-style tiered stand" },
      { emoji: "🥄", title: "Whisk & Rolling Pin Garland",desc: "Wooden kitchen tools tied with ribbon as bunting" },
      { emoji: "🌸", title: "Pastel Balloon Backdrop",    desc: "Yellow, pink, and white balloons in a cloud arch" },
      { emoji: "📦", title: "Bakery Box Favor Display",   desc: "Personalized pastry boxes for guests to fill with their creations" },
      { emoji: "🍬", title: "Sprinkle Bar Centerpiece",   desc: "Clear jars of every sprinkle shape/color as a decoration + supply" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Birthday Layer Cake",         desc: "The main birthday cake — kept separate from the decorating activity" },
      { emoji: "🧁", name: "Decoration Cupcakes",         desc: "Pre-baked plain cupcakes each guest decorates as the main activity" },
      { emoji: "🍪", name: "Sugar Cookie Canvas",         desc: "Large, thick sugar cookies as a decorating base alternative" },
      { emoji: "🥤", name: "Pink Lemonade Bar",           desc: "Pitchers of lemonade with fruit stirrers and colorful cups" },
      { emoji: "🍓", name: "Strawberry Dipping Station", desc: "Fresh strawberries with chocolate and sprinkles for dipping" },
      { emoji: "🍬", name: "Candy Topping Bar",           desc: "10+ topping options: M&Ms, gummies, sprinkles, edible glitter" },
    ],
    activities: [
      { emoji: "🧁", title: "Cupcake Decorating Contest", desc: "Each guest decorates their cupcake and judges pick categories: most colorful, most creative, most sprinkles" },
      { emoji: "🍪", title: "Cookie Icing Art",           desc: "Royal icing cookies — kids pipe their own designs with squeeze bottles" },
      { emoji: "🎂", title: "Mini Cake Build",            desc: "Older kids stack and frost their own 2-layer mini cake from scratch" },
      { emoji: "🏆", title: "Bake-Off Judging",           desc: "Fun ribbon awards for every category — no one goes home without a prize" },
      { emoji: "📦", title: "Box Your Creations",         desc: "Each guest packs their decorated treats in a personalized pastry box" },
      { emoji: "📸", title: "Chef Photo Booth",           desc: "Aprons + chef hats + finished creations = adorable photos to remember" },
    ],
    vendors: [
      { id: 1, emoji: "🧁", name: "Sugar Rush Bakery Parties",  address: "340 Main St, Dunedin",        distance: "6.1 mi",         rating: 4.7, reviews: 41, open: true,  price: "From $199", bg: "from-yellow-100 to-orange-50" },
      { id: 2, emoji: "🎂", name: "Little Chefs Party Studio",  address: "Tampa Bay Area",              distance: "Travels to you", rating: 4.9, reviews: 63, open: true,  price: "From $249", bg: "from-amber-100 to-yellow-50"  },
      { id: 3, emoji: "🍰", name: "The Cake Lab Clearwater",    address: "825 Cleveland St, Clearwater",distance: "4.8 mi",         rating: 4.8, reviews: 29, open: true,  price: "From $179", bg: "from-yellow-100 to-amber-50"  },
      { id: 4, emoji: "🥄", name: "Sweet & Savvy Catering",    address: "101 Main St, Safety Harbor",  distance: "1.2 mi",         rating: 4.6, reviews: 22, open: false, price: "From $299", bg: "from-orange-100 to-yellow-50" },
    ],
    faqs: [
      { q: "How many kids is ideal for a baking party?",    a: "6–10 is the sweet spot. Smaller groups mean more one-on-one time with decorating and less chaos. For 12–14 kids, have a second adult helper and more stations." },
      { q: "Should I pre-bake or bake together?",           a: "Pre-bake is strongly recommended for parties — it saves 30–40 min and removes the oven-safety concern. Focus party time on the fun part: decorating." },
      { q: "What's the easiest decorating activity?",       a: "Cupcake decorating with pre-filled piping bags and a sprinkle bar is the simplest and most popular. Sugar cookie icing takes more precision but results in stunning photos." },
      { q: "What about allergies?",                         a: "Ask parents about allergies when you send invites. Offer a gluten-free or allergy-friendly option at one station. Keep nut ingredients completely separate and labeled." },
      { q: "Is this a good favor idea?",                    a: "Yes! Each guest's decorated creation IS the favor — pack them in pastry boxes with a handwritten label. It's personal, edible, and costs less than typical party favors." },
    ],
    relatedThemes: [
      { emoji: "🔬", name: "Science Party",    slug: "science"   },
      { emoji: "🎨", name: "Art & Crafts",     slug: "art"       },
      { emoji: "👑", name: "Princess Party",   slug: "princess"  },
      { emoji: "🦄", name: "Unicorn Party",    slug: "unicorn"   },
    ],
  },

  unicorn: {
    slug: "unicorn",
    emoji: "🦄",
    name: "Unicorn Birthday Party",
    tagline: "Sparkle, rainbows & magical dreams come true",
    color: "from-purple-400 to-pink-400",
    lightColor: "bg-purple-50",
    accentColor: "text-purple-600",
    borderColor: "border-purple-200",
    btnColor: "bg-purple-500 hover:bg-purple-600",
    ageRange: "Ages 3–9",
    avgCost: "$100–$400",
    guestCount: "8–20 kids",
    planningTime: "2–4 weeks",
    description: "Unicorn parties are pure rainbow magic — pastel colors, iridescent everything, glitter, and horns as far as the eye can see. One of the most popular themes for girls ages 3–7, it's endlessly flexible and looks stunning even on a tight budget. Add a unicorn horn headband craft and you've got the perfect party.",
    tags: ["Fantasy", "Sparkly", "Indoor", "Girls", "Craft-Friendly"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Book venue or plan home party", "Order iridescent & pastel decorations", "Send rainbow swirl invitations"] },
      { category: "2–4 Weeks Before", items: ["Order unicorn cake with horn topper", "Buy unicorn horn headband supplies for craft", "Plan rainbow activities", "Order pastel balloon garland kit"] },
      { category: "1 Week Before", items: ["Assemble unicorn favor bags with gold coins & gems", "Prep glitter station supplies", "Set up rainbow backdrop area", "Print unicorn coloring pages as backup activity"] },
      { category: "Day Of", items: ["Set out rainbow scatter confetti on tables", "Set up the horn-making craft before guests arrive", "Have unicorn soundtrack playlist ready", "Surprise birthday child with unicorn sash & crown"] },
    ],
    decorIdeas: [
      { emoji: "🌈", title: "Rainbow Balloon Arch",       desc: "Full spectrum balloon arch — red through violet in order" },
      { emoji: "✨", title: "Iridescent Everything",      desc: "Holographic plates, cups, tablecloths — shimmer at every turn" },
      { emoji: "🦄", title: "Unicorn Horn Centerpieces", desc: "Gold spiral horns on white tulle puffs for each table" },
      { emoji: "💜", title: "Pastel Floral Backdrop",    desc: "Faux flowers in pink, lavender, mint, and white" },
      { emoji: "⭐", title: "Gold Star Garland",          desc: "Metallic gold star garlands strung across the ceiling" },
      { emoji: "🎀", title: "Tulle Table Skirts",         desc: "Rainbow tulle layered skirts on the main table" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Rainbow Ombre Cake",          desc: "White exterior reveals rainbow layers when cut — always a gasp" },
      { emoji: "🦄", name: "Unicorn Horn Cake Pops",      desc: "Cake pops on spiral pretzel sticks with gold tips" },
      { emoji: "🥤", name: "Rainbow Fruit Punch",          desc: "Layered colored juices in clear cups — visually stunning" },
      { emoji: "🍭", name: "Magic Wand Marshmallows",     desc: "Star marshmallows on sticks dipped in white chocolate & sprinkles" },
      { emoji: "🧁", name: "Ombre Unicorn Cupcakes",      desc: "Swirl frosting in pastel colors with edible horn toppers" },
      { emoji: "🍩", name: "Rainbow Donuts",               desc: "Glazed donuts in every color stacked on a tiered stand" },
    ],
    activities: [
      { emoji: "🦄", title: "Unicorn Horn Craft",          desc: "Each guest makes and decorates their own unicorn horn headband" },
      { emoji: "🎨", title: "Rainbow Slime Station",       desc: "Make rainbow-swirl slime to take home in a sparkle jar" },
      { emoji: "💎", title: "Gem Hunt",                    desc: "Hunt for hidden rainbow gems and crystals around the party space" },
      { emoji: "🌈", title: "Rainbow Ring Toss",           desc: "Toss rainbow rings onto unicorn horn targets" },
      { emoji: "📸", title: "Unicorn Photo Booth",         desc: "Horn props, rainbow backdrop, and sparkle wands for photos" },
      { emoji: "🎵", title: "Freeze Dance",                desc: "Dance to unicorn/fantasy playlist, freeze when music stops" },
    ],
    vendors: [
      { id: 1, emoji: "🦄", name: "Rainbow Magic Party Co.",    address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.9, reviews: 87,  open: true,  price: "From $199", bg: "from-purple-100 to-pink-50"  },
      { id: 2, emoji: "✨", name: "Shimmer Party Rentals",      address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.7, reviews: 52,  open: true,  price: "From $149", bg: "from-pink-100 to-purple-50"  },
      { id: 3, emoji: "🎂", name: "Sugar & Sparkle Bakery",     address: "340 Main St, Dunedin",       distance: "6.1 mi",  rating: 5.0, reviews: 44,  open: false, price: "From $95",  bg: "from-purple-100 to-rose-50"  },
      { id: 4, emoji: "🎈", name: "Pop & Party Balloon Studio", address: "200 Main St, Clearwater",    distance: "5.0 mi",  rating: 4.8, reviews: 33,  open: true,  price: "From $75",  bg: "from-pink-100 to-purple-50"  },
    ],
    faqs: [
      { q: "What age is the unicorn theme best for?",            a: "Peak unicorn age is 3–6. By 7–8, kids often want something more specific. That said, many 8–10 year olds still love it, especially if paired with a 'dark unicorn' or fantasy twist." },
      { q: "How do I do unicorn hair on a budget?",              a: "Clip-in pastel hair extensions ($3–5 each) are the easiest and most dramatic option. Pastel chalk hair spray also works and washes out in one shower." },
      { q: "What's the must-have unicorn party element?",        a: "The rainbow cake reveal — cutting the cake to show rainbow layers inside gets a gasp every single time. It's the iconic unicorn party moment." },
      { q: "Can boys enjoy a unicorn party?",                    a: "Younger boys (2–5) absolutely love unicorns. For older boys, you can frame it as 'mythical creatures' or 'fantasy adventure' and include dragons alongside unicorns." },
      { q: "Best unicorn party favor?",                          a: "Unicorn horn headbands they make themselves is #1. Rainbow slime jars, mini gem bags, and personalized sparkle water bottles are all strong runner-ups." },
    ],
    relatedThemes: [
      { emoji: "🧜", name: "Mermaid Party",   slug: "mermaid"    },
      { emoji: "👑", name: "Princess Party",  slug: "princess"   },
      { emoji: "🌟", name: "Glow Party",      slug: "glow-party" },
      { emoji: "🏰", name: "Fairy Tale",      slug: "fairytale"  },
    ],
  },

  dinosaurs: {
    slug: "dinosaurs",
    emoji: "🦕",
    name: "Dinosaur Birthday Party",
    tagline: "Roar into a prehistoric adventure — 65 million years of fun",
    color: "from-lime-500 to-green-600",
    lightColor: "bg-lime-50",
    accentColor: "text-lime-700",
    borderColor: "border-lime-200",
    btnColor: "bg-lime-600 hover:bg-lime-700",
    ageRange: "Ages 2–9",
    avgCost: "$100–$350",
    guestCount: "8–25 kids",
    planningTime: "2–3 weeks",
    description: "Dinosaur parties are a perennial favorite — endlessly popular with toddlers through early elementary, works for all genders, and is incredibly easy to DIY on any budget. Fossil digs, dino egg hunts, and roaring contests make it high-energy and memorable. The theme practically plans itself.",
    tags: ["Adventure", "Outdoor-Friendly", "DIY-Easy", "All Genders", "Budget-Friendly"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose dino sub-theme: Jurassic jungle vs. cute cartoon dinos", "Book venue or plan backyard setup", "Send dino egg or footprint invitations"] },
      { category: "2–4 Weeks Before", items: ["Order dino cake or make DIY volcano cake", "Buy plastic dinosaurs for table decor & favors", "Plan fossil dig sand station", "Get jungle/greenery faux plants for decor"] },
      { category: "1 Week Before", items: ["Bury fossils or gems in kinetic sand ahead of time", "Assemble dino egg goody bags", "Print dino name labels for each guest", "Set up jungle entrance with vines & leaves"] },
      { category: "Day Of", items: ["Set roar contest rules before games start", "Have fossil dig ready to go as first activity", "Award 'Junior Paleontologist' certificates", "Let birthday child blow out candles on volcano cake"] },
    ],
    decorIdeas: [
      { emoji: "🌿", title: "Jungle Foliage Entrance",    desc: "Giant faux leaves and vines framing the party entrance" },
      { emoji: "🦕", title: "Dino Figurine Tablescape",   desc: "Plastic dinosaurs of every kind scattered across tables" },
      { emoji: "🌋", title: "Volcano Centerpiece",         desc: "Papier-mâché volcano that erupts with baking soda & vinegar" },
      { emoji: "🥚", title: "Dino Egg Balloon Cluster",   desc: "Speckled green and white balloons in egg shapes" },
      { emoji: "🐾", title: "Fossil Footprint Trail",      desc: "Painted dino footprints leading from the entrance to the party" },
      { emoji: "🌱", title: "Prehistoric Plant Pots",      desc: "Succulents and air plants in terracotta pots labeled with dino names" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Volcano Birthday Cake",        desc: "Green cake shaped like a volcano with candy lava flow" },
      { emoji: "🦕", name: "Dino Nugget Bar",              desc: "Dinosaur-shaped nuggets with dipping sauces — kids go wild" },
      { emoji: "🥚", name: "Dino Egg Deviled Eggs",        desc: "Deviled eggs with paprika spots to look like speckled eggs" },
      { emoji: "🍉", name: "Watermelon T-Rex",             desc: "Carved watermelon in the shape of a T-Rex head" },
      { emoji: "🍭", name: "Fossil Cookie Pops",           desc: "Sugar cookies with pressed dinosaur toy impressions (fossil look)" },
      { emoji: "🥤", name: "Swamp Juice",                  desc: "Green Hawaiian Punch with gummy worms and orange slices" },
    ],
    activities: [
      { emoji: "⛏️", title: "Fossil Dig",                 desc: "Kids excavate hidden dinosaur fossils or gems from a sand tub" },
      { emoji: "🥚", title: "Dino Egg Hunt",               desc: "Hunt for plastic eggs hidden around the yard — each has a dino inside" },
      { emoji: "🦖", title: "Dino Roar Contest",           desc: "Who can do the best T-Rex roar? Kids vote for their favorite" },
      { emoji: "🎨", title: "Dinosaur Painting",           desc: "Paint plastic dinosaur figurines with acrylic paint to keep" },
      { emoji: "🌋", title: "Volcano Eruption Demo",       desc: "Classic baking soda + vinegar eruption — always a crowd stopper" },
      { emoji: "🏃", title: "T-Rex Arms Relay Race",       desc: "Run a relay with arms tucked in like T-Rex — hilarious results" },
    ],
    vendors: [
      { id: 1, emoji: "🦕", name: "Jurassic Party Tampa",       address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.9, reviews: 63,  open: true,  price: "From $199", bg: "from-lime-100 to-green-50"   },
      { id: 2, emoji: "🌿", name: "Jungle Venue & Events",      address: "500 Main St, Clearwater",    distance: "5.8 mi",  rating: 4.7, reviews: 38,  open: true,  price: "From $299", bg: "from-green-100 to-lime-50"   },
      { id: 3, emoji: "🎂", name: "Prehistoric Cakes Co.",       address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.8, reviews: 22,  open: false, price: "From $80",  bg: "from-lime-100 to-yellow-50"  },
      { id: 4, emoji: "⛏️", name: "Fossil Dig Party Supply",    address: "210 Alt 19, Palm Harbor",    distance: "8.3 mi",  rating: 4.6, reviews: 17,  open: true,  price: "From $45",  bg: "from-green-100 to-emerald-50"},
    ],
    faqs: [
      { q: "What age loves dinosaur parties most?",              a: "2–6 is the dino-obsessed age range. Kids this age have an almost encyclopedic knowledge of dinosaurs and love being the 'expert.' It also works well up to age 9 with a more adventure-focused framing." },
      { q: "Outdoor or indoor?",                                 a: "Outdoor is ideal for the fossil dig, egg hunt, and messy volcano. Indoor works great with a contained dig tub, planted fossils in sand, and plastic dino decor everywhere." },
      { q: "How do I do a fossil dig at home?",                  a: "Fill a plastic storage bin with kinetic sand or play sand. Bury plastic dinosaur skeletons, gems, and fossils beforehand. Give kids brushes and spoons to excavate. Takes under 30 min to set up." },
      { q: "Best budget-friendly dino party tip?",               a: "Buy a bag of 50+ plastic dinosaurs ($15–20 on Amazon) — they triple as table decor, activity props, and take-home favors. Best cost-per-impact item in party planning." },
      { q: "Cute cartoon dinos or realistic Jurassic theme?",    a: "For ages 2–4, cute is better. For ages 5–9, realistic Jurassic styling wins. Mix friendly and fierce dinos in your decor and you cover both." },
    ],
    relatedThemes: [
      { emoji: "🚀", name: "Space Party",   slug: "space"      },
      { emoji: "🐄", name: "Animal Party",  slug: "farm"       },
      { emoji: "⚽", name: "Sports Party",  slug: "sports"     },
      { emoji: "🥷", name: "Ninja Warrior", slug: "ninja"      },
    ],
  },

  space: {
    slug: "space",
    emoji: "🚀",
    name: "Space & Astronaut Birthday Party",
    tagline: "Blast off into a galactic celebration",
    color: "from-slate-700 to-indigo-800",
    lightColor: "bg-slate-50",
    accentColor: "text-indigo-600",
    borderColor: "border-indigo-200",
    btnColor: "bg-indigo-600 hover:bg-indigo-700",
    ageRange: "Ages 4–12",
    avgCost: "$150–$400",
    guestCount: "8–25 kids",
    planningTime: "2–4 weeks",
    description: "Space parties hit the perfect sweet spot of educational and exciting. Kids become junior astronauts, complete missions, build rockets, and explore the galaxy — all before cake. Easy to DIY with black tablecloths and silver stars, or go all-out with glow-in-the-dark elements and astronaut helmets.",
    tags: ["Adventure", "Educational", "Indoor", "All Genders", "Glow-Friendly"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose: NASA realism vs. galaxy fantasy theme", "Book venue or plan dark room for glow effects", "Send rocket ship or mission briefing invitations"] },
      { category: "2–4 Weeks Before", items: ["Order galaxy-themed cake", "Buy glow star stickers for ceiling", "Plan astronaut training activities", "Order astronaut helmet favor bags"] },
      { category: "1 Week Before", items: ["Set up 'mission control' table display", "Apply glow stars to ceiling for party day", "Assemble planet centerpieces", "Prep freeze-dried astronaut food as fun snack"] },
      { category: "Day Of", items: ["Greet kids as 'Junior Astronauts'", "Run through mission briefing at start of party", "Award astronaut wings at closing ceremony", "Play NASA launch countdown for cake reveal"] },
    ],
    decorIdeas: [
      { emoji: "⭐", title: "Galaxy Ceiling Stars",       desc: "Hundreds of glow-in-dark star stickers across a dark ceiling" },
      { emoji: "🪐", title: "Planet Balloon Cluster",     desc: "Painted balloons as Saturn, Jupiter, Mars hanging from ceiling" },
      { emoji: "🚀", title: "Rocket Ship Backdrop",       desc: "Cardboard rocket photo op in silver and red" },
      { emoji: "🌌", title: "Galaxy Tablecloths",          desc: "Dark blue/purple tablecloths with silver star scatter" },
      { emoji: "🔭", title: "Mission Control Table",      desc: "Monitor printouts, dials, and 'NASA' signage as main display" },
      { emoji: "✨", title: "Meteor Shower Garland",      desc: "Silver and gold foil star garland cascading from the ceiling" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Galaxy Mirror Cake",           desc: "Dark blue mirror glaze cake with edible stars and planets" },
      { emoji: "🚀", name: "Rocket Sandwich Pops",         desc: "Triangle sandwiches on sticks decorated as rocket ships" },
      { emoji: "🌙", name: "Moon Cheese & Crackers",       desc: "Yellow cheese cut in moon and star shapes on a galaxy board" },
      { emoji: "🥤", name: "Galaxy Punch",                  desc: "Blue + purple juice swirled together with edible glitter" },
      { emoji: "🍭", name: "Astronaut Ice Cream",          desc: "Freeze-dried ice cream sandwiches — genuine NASA food" },
      { emoji: "🌟", name: "Star-Shaped Brownies",         desc: "Brownies cut with star cookie cutters, dusted with silver shimmer" },
    ],
    activities: [
      { emoji: "🚀", title: "Rocket Building Contest",     desc: "Teams build the tallest rocket from cardboard tubes and tape" },
      { emoji: "🌍", title: "Planet Identification Quiz",  desc: "Kids earn astronaut points naming planets and space facts" },
      { emoji: "🎯", title: "Asteroid Dodge Ball",          desc: "Space-themed dodge ball where asteroids (foam balls) are incoming" },
      { emoji: "🌌", title: "Glow Constellation Art",      desc: "Paint black paper with glow paint to make star constellations" },
      { emoji: "📸", title: "Astronaut Helmet Photo Booth",desc: "Cardboard astronaut helmets for group mission photos" },
      { emoji: "🏅", title: "Astronaut Wings Ceremony",    desc: "Each guest receives official astronaut wings at party end" },
    ],
    vendors: [
      { id: 1, emoji: "🚀", name: "Galactic Parties Tampa",     address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.9, reviews: 55,  open: true,  price: "From $249", bg: "from-indigo-100 to-slate-50" },
      { id: 2, emoji: "🌌", name: "Galaxy Glow Events",         address: "500 N Dale Mabry, Tampa",    distance: "12 mi",   rating: 4.8, reviews: 41,  open: true,  price: "From $199", bg: "from-slate-100 to-indigo-50" },
      { id: 3, emoji: "🎂", name: "Cosmic Cakes Studio",        address: "210 Main St, Clearwater",    distance: "5.2 mi",  rating: 5.0, reviews: 29,  open: false, price: "From $95",  bg: "from-indigo-100 to-blue-50"  },
      { id: 4, emoji: "⭐", name: "Star Party Supply Co.",      address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.6, reviews: 21,  open: true,  price: "From $50",  bg: "from-slate-100 to-indigo-50" },
    ],
    faqs: [
      { q: "How do I create a glow-in-dark space effect at home?", a: "Black or dark blue tablecloths, UV blacklights ($15 each), glow star ceiling stickers, and white/neon decorations that pop under UV. You can transform any room in under an hour." },
      { q: "What's the most impressive space party activity?",    a: "The rocket-building contest where kids launch paper rockets or water bottle rockets gets the biggest reaction. Every kid walks away saying 'I built a rocket.'" },
      { q: "Works better day or evening?",                       a: "Evening is spectacular for space themes — glow elements look incredible in low light. If it's a daytime party, use blackout curtains in one room for the 'galaxy room' effect." },
      { q: "What makes space parties educational?",              a: "Sneak in real science: planet facts, gravity demos (drop different objects), constellation naming, and freeze-dried astronaut food. Kids learn without realizing it." },
      { q: "Best space party favor?",                            a: "Astronaut wings certificate + freeze-dried ice cream is the dream combo. Mini telescopes ($5–8) and glow star sheets are also fantastic budget-friendly take-homes." },
    ],
    relatedThemes: [
      { emoji: "🔬", name: "Science Party",  slug: "science"    },
      { emoji: "🦕", name: "Dino Party",     slug: "dinosaurs"  },
      { emoji: "🌟", name: "Glow Party",     slug: "glow-party" },
      { emoji: "🎮", name: "Gaming Party",   slug: "gaming"     },
    ],
  },

  "glow-party": {
    slug: "glow-party",
    emoji: "🌟",
    name: "Glow & Neon Party",
    tagline: "Light up the night — neon, blacklights & pure electric energy",
    color: "from-violet-600 to-fuchsia-600",
    lightColor: "bg-violet-50",
    accentColor: "text-violet-600",
    borderColor: "border-violet-200",
    btnColor: "bg-violet-600 hover:bg-violet-700",
    ageRange: "Ages 7–16",
    avgCost: "$150–$450",
    guestCount: "10–30 kids",
    planningTime: "2–4 weeks",
    description: "Glow parties are one of the most visually dramatic themes you can create — blacklights transform any space into a neon wonderland. Kids wear white, paint their faces with glow paint, and dance in the dark. Works for birthdays, sleepovers, and tweens who want something different. The wow factor is unmatched.",
    tags: ["Indoor", "Teens", "Tweens", "Dance Party", "High Wow Factor"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Book venue with blackout capability or plan home setup", "Order UV blacklight bulbs and strips", "Send neon-colored invitations with 'wear white' instructions"] },
      { category: "2–4 Weeks Before", items: ["Order neon cake with UV elements", "Buy glow face paint & neon accessories", "Plan glow-in-dark activities and games", "Order neon balloon garland kit"] },
      { category: "1 Week Before", items: ["Test blacklights in party space", "Prep neon goody bags", "Set up glow body paint station supplies", "Create neon playlist for dancing"] },
      { category: "Day Of", items: ["Block all natural light 30 min before guests arrive", "Set up blacklights before guests arrive — reveal is part of the wow", "Greet guests with glow bracelets at the door", "Run glow body paint station first as guests arrive"] },
    ],
    decorIdeas: [
      { emoji: "💜", title: "Neon Balloon Wall",           desc: "Hot pink, electric blue, and lime green balloons — huge and impactful" },
      { emoji: "⚡", title: "LED Strip Lighting",          desc: "Line the walls and tables with color-changing LED strips" },
      { emoji: "🌟", title: "Glow Star Ceiling",           desc: "Blacklight-reactive star stickers covering the whole ceiling" },
      { emoji: "🎨", title: "Neon Body Paint Station",    desc: "Face and arm painting with UV-reactive neon paints" },
      { emoji: "✨", title: "Glow Stick Centerpieces",    desc: "Vases filled with activated glow sticks in multiple colors" },
      { emoji: "📸", title: "Neon Sign Backdrop",          desc: "LED 'Let's Glow' or name sign as the photo wall" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Neon Drip Cake",               desc: "White cake with UV-reactive neon drip and glow candles" },
      { emoji: "🥤", name: "Glow Punch Bowl",              desc: "Tonic water glows under UV light — add fruit and it's stunning" },
      { emoji: "🍭", name: "Neon Candy Bar",               desc: "Sour belts, gummy worms, and neon candies under blacklight" },
      { emoji: "🍕", name: "Glow-Labeled Pizza",           desc: "Regular pizza with neon kraft paper labels under blacklights" },
      { emoji: "🧁", name: "UV Frosted Cupcakes",          desc: "White cupcakes with neon frosting that glows under UV" },
      { emoji: "🍦", name: "Glow Ice Cream Bar",           desc: "Soft serve with neon sprinkles and glow stick stirrers" },
    ],
    activities: [
      { emoji: "🎨", title: "Glow Body Paint Station",    desc: "Paint your arms, face, and clothes with neon UV paint" },
      { emoji: "💃", title: "Blacklight Dance Party",      desc: "Turn off the lights and turn up the music — pure magic" },
      { emoji: "🎯", title: "Glow Ring Toss",              desc: "Glow stick rings tossed onto glowing bottle targets" },
      { emoji: "🏃", title: "Neon Freeze Dance",           desc: "Dance in the blacklight, freeze when music stops" },
      { emoji: "🎲", title: "Glow Limbo",                  desc: "Limbo under a glowing rope while everyone cheers" },
      { emoji: "📸", title: "Neon Photo Booth",             desc: "Glow accessories, neon signs, and blacklight for epic shots" },
    ],
    vendors: [
      { id: 1, emoji: "🌟", name: "Neon Nights Party Co.",     address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.9, reviews: 78,  open: true,  price: "From $299", bg: "from-violet-100 to-fuchsia-50"},
      { id: 2, emoji: "💡", name: "Glow Event Rentals",        address: "500 N Dale Mabry, Tampa",    distance: "12 mi",   rating: 4.8, reviews: 55,  open: true,  price: "From $199", bg: "from-purple-100 to-violet-50" },
      { id: 3, emoji: "🎂", name: "Electric Cake Studio",      address: "210 Main St, Clearwater",    distance: "5.2 mi",  rating: 4.9, reviews: 31,  open: false, price: "From $110", bg: "from-fuchsia-100 to-pink-50"  },
      { id: 4, emoji: "🎨", name: "Face Glow Artists",         address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 5.0, reviews: 44,  open: true,  price: "From $150", bg: "from-violet-100 to-purple-50" },
    ],
    faqs: [
      { q: "How many blacklights do I need?",                   a: "One UV blacklight per 10 sq ft of party space is a good rule. For a 200 sq ft room, use 4–6 UV blacklight bulbs in standard lamp sockets. LED UV strip lights along the walls add amazing ambient glow." },
      { q: "What should guests wear?",                          a: "White clothing glows the brightest under UV light. Send 'WEAR WHITE' on the invitation. Neon yellow, pink, and green also pop beautifully. Dark colors absorb UV and look dull." },
      { q: "Is glow face paint safe for kids?",                 a: "Yes — use water-based, non-toxic UV face paint specifically labeled for skin use. Avoid craft UV paint on skin. Brands like Mehron and Snazaroo make safe options." },
      { q: "What makes tonic water glow?",                      a: "Quinine in tonic water fluoresces under UV blacklight — it glows an electric blue. Regular tonic water (not diet) glows brightest. It's safe to drink and creates a stunning punch bowl effect." },
      { q: "Best age for a glow party?",                        a: "7+ works, but 10–16 is the sweet spot. Older kids appreciate the dramatic atmosphere, dancing, and social elements more. For younger kids, keep the space lit enough that they're not scared of the dark." },
    ],
    relatedThemes: [
      { emoji: "🎮", name: "Gaming Party",   slug: "gaming"     },
      { emoji: "🚀", name: "Space Party",    slug: "space"      },
      { emoji: "🎸", name: "Teen Party",     slug: "teens"      },
      { emoji: "💃", name: "Music & Dance",  slug: "music-dance"},
    ],
  },

  art: {
    slug: "art",
    emoji: "🎨",
    name: "Art & Crafts Birthday Party",
    tagline: "Unleash little Picassos — creativity is the gift",
    color: "from-orange-400 to-amber-500",
    lightColor: "bg-orange-50",
    accentColor: "text-orange-600",
    borderColor: "border-orange-200",
    btnColor: "bg-orange-500 hover:bg-orange-600",
    ageRange: "Ages 4–12",
    avgCost: "$100–$350",
    guestCount: "8–18 kids",
    planningTime: "2–3 weeks",
    description: "Art parties are the perfect blend of activity and take-home keepsake — every guest leaves with something they made themselves. From canvas painting to tie-dye to pottery, there are endless mediums to choose from. Ideal for creative kids and parents who want a structured, mess-controlled activity party.",
    tags: ["Creative", "Indoor", "Take-Home Craft", "All Genders", "Structure-Friendly"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose art medium: painting, tie-dye, pottery, collage", "Book art studio venue or plan home setup", "Send palette-shaped or paint splatter invitations"] },
      { category: "2–4 Weeks Before", items: ["Order artist-themed cake", "Buy smocks/aprons for all guests as favors", "Gather all art supplies per chosen medium", "Plan gallery display wall for finished work"] },
      { category: "1 Week Before", items: ["Cover all surfaces with kraft paper or plastic sheeting", "Pre-mix paint colors into cups", "Set up individual art stations per child", "Prepare 'gallery opening' display area"] },
      { category: "Day Of", items: ["Welcome guests with their own artist smock", "Give a quick demo of the technique", "Play music during the art session", "Host a mini gallery show before cake"] },
    ],
    decorIdeas: [
      { emoji: "🎨", title: "Paint Palette Centerpieces", desc: "Paper palette shapes with colorful dot sticker 'paint blobs'" },
      { emoji: "🖼️", title: "Gallery Wall Display",       desc: "Hang finished artwork on a clothesline with mini clothespins" },
      { emoji: "🖌️", title: "Paintbrush Utensil Holders", desc: "Wrap utensil bundles in ribbon with a paintbrush tucked in" },
      { emoji: "🌈", title: "Color Block Balloon Arch",   desc: "Solid blocks of color balloons — red, yellow, blue, green" },
      { emoji: "✏️", title: "Pencil & Crayon Decor",     desc: "Giant cardboard crayon cutouts as entrance decorations" },
      { emoji: "🎭", title: "Famous Art Print Backdrop",  desc: "Printed Starry Night or other masterpiece as the photo wall" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Paint Palette Cake",           desc: "Round cake with colorful frosting blobs like paint on a palette" },
      { emoji: "🌈", name: "Rainbow Fruit Canvas",         desc: "Fruit arranged in a rainbow on a white platter — edible art" },
      { emoji: "🍭", name: "Paintbrush Cookie Pops",       desc: "Sugar cookies on sticks iced to look like paintbrushes" },
      { emoji: "🥤", name: "Color Mixing Punch Station",  desc: "Three juice colors kids mix themselves to create their own flavor" },
      { emoji: "🧁", name: "Tie-Dye Cupcakes",            desc: "Swirled multicolor batter topped with matching frosting" },
      { emoji: "🍫", name: "Chocolate Paint Dipping",     desc: "Pretzels and strawberries with colored white chocolate for dipping" },
    ],
    activities: [
      { emoji: "🖼️", title: "Canvas Painting Session",    desc: "Each child paints their own guided canvas to take home" },
      { emoji: "👕", title: "Tie-Dye T-Shirt Station",    desc: "Every guest dyes their own shirt — the ultimate wearable favor" },
      { emoji: "🏺", title: "Air-Dry Clay Sculpting",     desc: "Make and paint small clay pieces that harden overnight" },
      { emoji: "🎨", title: "Splatter Paint Canvas",       desc: "Outdoor activity — splatter paint with toothbrushes or syringes" },
      { emoji: "🖼️", title: "Mini Gallery Opening",       desc: "All artwork displayed and each artist presents their piece" },
      { emoji: "📸", title: "Artist Photo Booth",          desc: "Beret, smock, palette, and paintbrush props for photos" },
    ],
    vendors: [
      { id: 1, emoji: "🎨", name: "Picasso Party Studio",       address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.9, reviews: 128, open: true,  price: "From $249", bg: "from-orange-100 to-amber-50"  },
      { id: 2, emoji: "🖌️", name: "The Little Art Room",       address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.8, reviews: 72,  open: true,  price: "From $199", bg: "from-yellow-100 to-orange-50" },
      { id: 3, emoji: "🎂", name: "Palette Cakes & Sweets",     address: "340 Main St, Dunedin",       distance: "6.1 mi",  rating: 4.7, reviews: 38,  open: false, price: "From $90",  bg: "from-amber-100 to-yellow-50"  },
      { id: 4, emoji: "👕", name: "Tie-Dye Party Kits",         address: "Ships to you",               distance: "Online",  rating: 4.9, reviews: 211, open: true,  price: "From $12/kit", bg: "from-orange-100 to-red-50" },
    ],
    faqs: [
      { q: "What's the easiest art activity for a group party?",  a: "Guided canvas painting where everyone follows the same steps together. It's structured enough to keep the party moving, but personal enough that each result looks unique." },
      { q: "How do I handle the mess?",                          a: "Cover every surface with kraft paper or plastic sheeting before guests arrive. Use liquid watercolors instead of acrylic for easier cleanup. Smocks for every child are non-negotiable." },
      { q: "What art medium is best for young kids (4–6)?",      a: "Watercolor and finger painting are most accessible. Avoid oil paints (smell, cleanup) and small details. Big brushes, big canvases, bold colors." },
      { q: "How does tie-dye work for a party?",                 a: "Buy pre-made tie-dye kits (Tulip or Rit work great). Kids squirt color onto pre-rubber-banded shirts, then you bag them for them to take home and rinse the next day. Super easy." },
      { q: "Can boys enjoy art parties?",                        a: "Absolutely — especially if you frame it around specific subjects they love (paint a dinosaur, design a superhero logo, splatter art = explosive action). Boys often become the most absorbed artists." },
    ],
    relatedThemes: [
      { emoji: "🧁", name: "Baking Party",    slug: "baking"   },
      { emoji: "🔬", name: "Science Party",   slug: "science"  },
      { emoji: "🦄", name: "Unicorn Party",   slug: "unicorn"  },
      { emoji: "🧜", name: "Mermaid Party",   slug: "mermaid"  },
    ],
  },

  ninja: {
    slug: "ninja",
    emoji: "🥷",
    name: "Ninja Warrior Birthday Party",
    tagline: "Train hard, compete harder — the ultimate obstacle challenge",
    color: "from-gray-700 to-slate-800",
    lightColor: "bg-gray-50",
    accentColor: "text-gray-700",
    borderColor: "border-gray-300",
    btnColor: "bg-gray-700 hover:bg-gray-800",
    ageRange: "Ages 5–13",
    avgCost: "$200–$500",
    guestCount: "10–25 kids",
    planningTime: "2–4 weeks",
    description: "Ninja Warrior parties bring the TV show to life — obstacle courses, stealth challenges, and team battles that kids absolutely love. One of the highest-energy themes you can plan. Works beautifully in a backyard, rented gym, or trampoline park. Every child earns their ninja belt at the end.",
    tags: ["Active", "Outdoor", "Competitive", "All Genders", "High Energy"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose venue: backyard course vs. ninja gym", "Plan obstacle stages and teams", "Send 'secret mission' themed invitations"] },
      { category: "2–4 Weeks Before", items: ["Build or rent obstacle course equipment", "Order ninja belt favors for all guests", "Plan team vs. team tournament format", "Order ninja-themed cake"] },
      { category: "1 Week Before", items: ["Test all obstacles for safety", "Set up timing system for runs", "Prepare black headband favors", "Print team mission cards"] },
      { category: "Day Of", items: ["Run a practice lap before competition begins", "Have a first aid kit visible — safety first", "Play intense music during runs", "Award ninja belts at closing ceremony"] },
    ],
    decorIdeas: [
      { emoji: "🥷", title: "Shadow Ninja Backdrop",      desc: "Black silhouette ninja cutouts jumping across the party space" },
      { emoji: "⚫", title: "Black & Red Color Scheme",   desc: "Classic ninja colors — bold, dramatic, and easy to execute" },
      { emoji: "🏮", title: "Japanese Lantern Lighting",  desc: "Red paper lanterns strung around the course area" },
      { emoji: "🎯", title: "Bullseye Target Decor",       desc: "Printed target prints as wall decor and table accents" },
      { emoji: "🥋", title: "Ninja Star Balloons",        desc: "Black and gold star foil balloons at the entrance" },
      { emoji: "📜", title: "Mission Scroll Banner",       desc: "Rolled parchment-style banner: 'Welcome, Ninja Warrior'" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Ninja Star Cake",              desc: "Black fondant cake with gold ninja star decorations" },
      { emoji: "🍱", name: "Bento Box Lunches",            desc: "Individual bento boxes with faces made from food" },
      { emoji: "🥢", name: "Noodle Bowl Station",          desc: "DIY noodle cups kids customize with toppings" },
      { emoji: "🥤", name: "Black Lemonade",               desc: "Activated charcoal lemonade — dramatically dark, totally safe" },
      { emoji: "🍭", name: "Ninja Star Cookies",           desc: "Six-pointed shortbread cookies in black and gold icing" },
      { emoji: "🍡", name: "Mochi Dessert Bar",            desc: "Assorted mochi ice cream in a Japanese-inspired display" },
    ],
    activities: [
      { emoji: "🏃", title: "Ninja Obstacle Course",       desc: "Time-trial runs through crawl tunnels, balance beams, rope swings" },
      { emoji: "🎯", title: "Target Practice",              desc: "Throw foam shuriken at targets — accuracy scored by distance" },
      { emoji: "🤸", title: "Balance Challenge",            desc: "Walk a balance beam blindfolded guided only by teammates" },
      { emoji: "🥷", title: "Stealth Mission",              desc: "Navigate a 'laser maze' made from yarn without touching" },
      { emoji: "🏆", title: "Ninja Warrior Finals",        desc: "Top 4 from time trials compete in a final showdown" },
      { emoji: "🥋", title: "Belt Ceremony",               desc: "Every child earns and ties their ninja belt at the end" },
    ],
    vendors: [
      { id: 1, emoji: "🏃", name: "Ninja Warrior Gym Tampa",   address: "500 N Dale Mabry, Tampa",    distance: "12 mi",   rating: 4.9, reviews: 88,  open: true,  price: "From $349", bg: "from-gray-100 to-slate-50"  },
      { id: 2, emoji: "🥷", name: "Stealth Party Events",       address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.8, reviews: 61,  open: true,  price: "From $299", bg: "from-slate-100 to-gray-50"  },
      { id: 3, emoji: "🎂", name: "Black Belt Cakes",           address: "210 Main St, Clearwater",    distance: "5.2 mi",  rating: 4.7, reviews: 24,  open: false, price: "From $90",  bg: "from-gray-100 to-zinc-50"   },
      { id: 4, emoji: "🥋", name: "Ninja Belt Party Supply",    address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.6, reviews: 19,  open: true,  price: "From $35",  bg: "from-slate-100 to-gray-50"  },
    ],
    faqs: [
      { q: "How do I build a backyard ninja course?",           a: "Use pool noodles as balance beams (cut in half lengthwise), PVC pipe hurdles, rope swings from trees, crawl tunnels from camping supply stores, and step stones from the dollar store. $100–$200 total." },
      { q: "What age range works best?",                        a: "5–13 is the sweet spot. Younger kids love it but need simplified obstacles. Teens appreciate the competitive timing format. Mixed ages work great with age-appropriate challenge levels per station." },
      { q: "How do I handle different fitness levels?",         a: "Offer 'ninja in training' easier path alongside the main course. Time trials naturally separate skill levels. Emphasize participation over winning with awards for all at the end." },
      { q: "Indoor or outdoor?",                               a: "Outdoor is ideal for a full course. Many trampoline and gymnastics gyms offer ninja warrior setups for parties. Indoor home setups work with modified furniture-based obstacle courses." },
      { q: "What's the best ninja party favor?",               a: "An actual ninja belt (colored fabric strip) tied in a ceremony at the end creates a ritual moment every kid remembers. Add a mini shuriken (foam, safe) and a mission certificate." },
    ],
    relatedThemes: [
      { emoji: "🤸", name: "Gymnastics",     slug: "gymnastics"  },
      { emoji: "⚽", name: "Sports Party",   slug: "sports"      },
      { emoji: "🦸", name: "Superhero",      slug: "superheroes" },
      { emoji: "🏊", name: "Pool Party",     slug: "swimming"    },
    ],
  },

  swimming: {
    slug: "swimming",
    emoji: "🏊",
    name: "Pool Party",
    tagline: "Splash into the best birthday ever — sun, water & pure fun",
    color: "from-sky-400 to-blue-500",
    lightColor: "bg-sky-50",
    accentColor: "text-sky-600",
    borderColor: "border-sky-200",
    btnColor: "bg-sky-500 hover:bg-sky-600",
    ageRange: "Ages 4–16",
    avgCost: "$100–$400",
    guestCount: "10–30 kids",
    planningTime: "3–5 weeks",
    description: "Pool parties are the ultimate Florida birthday — kids swim, splash, and play while parents relax poolside. Simple to execute, naturally high-energy, and works for almost every age and budget. The trick is in the details: themed floaties, water games, and a killer snack spread make it feel special.",
    tags: ["Outdoor", "Active", "Summer", "All Genders", "Budget-Friendly"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Confirm pool access and guest capacity", "Arrange lifeguard or adult swimmer ratio (1:6 for under 7)", "Send wave-print or floatie invitations"] },
      { category: "2–4 Weeks Before", items: ["Order pool float decorations", "Plan water games and relay races", "Order waterproof speaker and playlist", "Buy water toys as favors and prizes"] },
      { category: "1 Week Before", items: ["Check weather forecast and have a rain plan", "Set up non-pool activities for non-swimmers", "Prep sunscreen station at the entrance", "Buy extra towels and sunscreen"] },
      { category: "Day Of", items: ["Set up pool floaties and games 30 min before guests arrive", "Greet guests with leis or water guns", "Keep the dry food table fully shaded", "Have a clear 'pool rules' talk before swimming starts"] },
    ],
    decorIdeas: [
      { emoji: "🌊", title: "Giant Inflatable Floaties",  desc: "Flamingo, pineapple, unicorn floaties in the pool as decor" },
      { emoji: "🌺", title: "Tropical Floral Garlands",   desc: "Bright tropical flowers around the pool gate and food table" },
      { emoji: "🎈", title: "Aqua Balloon Cluster",       desc: "Blue, turquoise, and white balloons tied to pool chairs" },
      { emoji: "🌴", title: "Tiki Torch Pathway",          desc: "Tiki torches lining the path to the pool for evening parties" },
      { emoji: "🐚", title: "Shell & Starfish Tablescape",desc: "Seashells and starfish scattered across the food table" },
      { emoji: "🦩", title: "Flamingo Yard Signs",         desc: "Pink flamingo lawn stakes clustered at the entrance" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Pool Float Cake",              desc: "Blue frosted cake with fondant floatie ring topper" },
      { emoji: "🍦", name: "Ice Cream Truck Order",         desc: "Pre-order an ice cream truck to arrive mid-party — legendary" },
      { emoji: "🍉", name: "Watermelon Bar",               desc: "Sliced watermelon on sticks, tajin and lime on the side" },
      { emoji: "🌭", name: "Poolside Hot Dog Bar",          desc: "Classic hot dogs with a full topping bar — everyone's happy" },
      { emoji: "🥤", name: "Tropical Punch Cooler",        desc: "Fruit punch with pineapple, orange and coconut water" },
      { emoji: "🍢", name: "Frozen Fruit Pops",            desc: "DIY popsicle bar with molds the kids can make and eat" },
    ],
    activities: [
      { emoji: "🏊", title: "Marco Polo Tournament",       desc: "Classic Marco Polo but with elimination rounds and a winner" },
      { emoji: "🎯", title: "Water Balloon Toss",           desc: "Partners toss water balloons, step back after each catch" },
      { emoji: "🏆", title: "Pool Noodle Jousting",        desc: "Kids on floaties try to knock each other off with noodles" },
      { emoji: "💎", title: "Dive for Treasure",           desc: "Throw coins and dive rings to the bottom — collect the most to win" },
      { emoji: "🚀", title: "Rocket Water Squirt Race",    desc: "Teams race inflatables across the pool using only squirt guns" },
      { emoji: "📸", title: "Poolside Photo Booth",         desc: "Floatie rings, fun glasses, and tropical props for poolside shots" },
    ],
    vendors: [
      { id: 1, emoji: "🏊", name: "Clearwater Aquatic Center",  address: "900 Lakeview Rd, Clearwater", distance: "5.5 mi",  rating: 4.8, reviews: 102, open: true,  price: "From $200", bg: "from-sky-100 to-blue-50"     },
      { id: 2, emoji: "🌺", name: "Tropical Party Rentals",     address: "Tampa Bay Area — mobile",     distance: "Travels", rating: 4.7, reviews: 66,  open: true,  price: "From $149", bg: "from-blue-100 to-sky-50"     },
      { id: 3, emoji: "🎂", name: "Wave Cake Studio",           address: "340 Main St, Dunedin",        distance: "6.1 mi",  rating: 4.9, reviews: 33,  open: false, price: "From $95",  bg: "from-sky-100 to-cyan-50"     },
      { id: 4, emoji: "🦩", name: "Flamingo Float Shop",        address: "101 Main St, Safety Harbor",  distance: "1.2 mi",  rating: 4.6, reviews: 28,  open: true,  price: "From $25",  bg: "from-blue-100 to-sky-50"     },
    ],
    faqs: [
      { q: "What's the right adult-to-child supervision ratio?", a: "For kids under 7: 1 designated adult swimmer per 3–4 children in or near the pool. For older kids: 1 adult per 6–8 kids. Always have at least one adult whose only job is water supervision (no phones, no food)." },
      { q: "What if some kids can't swim?",                     a: "Have a designated shallow end activity area and water wing/life jacket options. Non-swimmers can do water balloon games outside the pool and still feel fully included." },
      { q: "Best time of day for a Florida pool party?",        a: "10am–12pm avoids peak UV (noon–3pm). Alternatively, 4–7pm is golden hour and slightly cooler. Avoid 12–3pm in summer — too hot, sunburn risk is high." },
      { q: "How do I keep food from getting wet and gross?",    a: "Keep all food under shade or a canopy, 10+ feet from the pool edge. Assign one adult to manage the food table and keep it covered between servings." },
      { q: "What are the best pool party favors?",              a: "Water guns ($3–5 each) are universally loved. Personalized water bottles, waterproof snap bracelets, and mini sunscreen sticks are all practical and on-theme." },
    ],
    relatedThemes: [
      { emoji: "🌺", name: "Luau Party",    slug: "luau"      },
      { emoji: "🧜", name: "Mermaid Party", slug: "mermaid"   },
      { emoji: "⚽", name: "Sports Party",  slug: "sports"    },
      { emoji: "🦕", name: "Dino Party",    slug: "dinosaurs" },
    ],
  },

  luau: {
    slug: "luau",
    emoji: "🌺",
    name: "Luau & Hawaiian Birthday Party",
    tagline: "Aloha! Paradise in your own backyard",
    color: "from-orange-400 to-pink-500",
    lightColor: "bg-orange-50",
    accentColor: "text-orange-600",
    borderColor: "border-orange-200",
    btnColor: "bg-orange-500 hover:bg-orange-600",
    ageRange: "Ages 4–16",
    avgCost: "$100–$350",
    guestCount: "10–30 kids",
    planningTime: "2–3 weeks",
    description: "Luau parties are bright, colorful, and full of energy — grass skirts, leis, tropical flowers, and the best backyard party you can throw. Perfect for summer birthdays in Florida, easy to pair with a pool, and works for every age. The hula contest alone is worth the whole party.",
    tags: ["Outdoor", "Cultural", "Summer", "All Genders", "Pool-Friendly"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Book backyard or outdoor venue", "Order tropical supplies: leis, grass skirts, tiki decor", "Send pineapple or palm tree invitations"] },
      { category: "2–4 Weeks Before", items: ["Order tropical cake or pineapple cake", "Plan hula contest and limbo game", "Buy Hawaiian music playlist", "Order flower crowns for guests"] },
      { category: "1 Week Before", items: ["Set up tiki torches and tiki bar area", "Prep tropical fruit platter", "Assemble lei goody bags", "Test outdoor speaker"] },
      { category: "Day Of", items: ["Greet guests with a lei as they arrive", "Set up hula contest bracket", "Keep drinks cold in a cooler with tropical labels", "Award best hula dancer with a special trophy"] },
    ],
    decorIdeas: [
      { emoji: "🌺", title: "Flower Lei Garlands",         desc: "Colorful plastic or real flower leis draped everywhere" },
      { emoji: "🌴", title: "Tiki Torch Perimeter",        desc: "Ring the party space with tiki torches for a tropical vibe" },
      { emoji: "🍍", title: "Pineapple Centerpieces",      desc: "Real pineapples as centerpieces with flowers tucked in top" },
      { emoji: "🌸", title: "Hibiscus Balloon Arch",       desc: "Orange, yellow, and pink balloons with flower accents" },
      { emoji: "🐢", title: "Tropical Animal Tablecloth",  desc: "Flamingo, toucan, and tropical print tablecloths" },
      { emoji: "🎋", title: "Bamboo Table Runners",        desc: "Bamboo mat table runners for that authentic island feel" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Pineapple Luau Cake",          desc: "Pineapple-shaped cake or tropical layers with mango frosting" },
      { emoji: "🍍", name: "Tropical Fruit Platter",       desc: "Pineapple, mango, kiwi, and papaya arranged on palm leaves" },
      { emoji: "🍹", name: "Mocktail Tiki Bar",            desc: "Coconut water, pineapple juice, grenadine in tiki cups" },
      { emoji: "🌮", name: "Kalua Pork Sliders",           desc: "Pulled pork sliders with coleslaw on Hawaiian rolls" },
      { emoji: "🍢", name: "Coconut Snowball Station",     desc: "Shaved ice with tropical syrups in coconut cups" },
      { emoji: "🍭", name: "Hibiscus Flower Cookies",      desc: "Pink hibiscus-shaped sugar cookies with tropical colors" },
    ],
    activities: [
      { emoji: "💃", title: "Hula Contest",                 desc: "Teach a basic hula move, then judge on style and enthusiasm" },
      { emoji: "🎯", title: "Limbo Competition",            desc: "Classic limbo — how low can you go — with tropical music" },
      { emoji: "🌺", title: "Flower Crown Making",          desc: "Each guest makes their own flower crown to wear all party" },
      { emoji: "💦", title: "Water Balloon Luau",           desc: "Tropical twist on water balloon fight with team colors" },
      { emoji: "🥥", title: "Coconut Shell Toss Game",      desc: "Toss coconut rings onto tiki post targets for prizes" },
      { emoji: "📸", title: "Tiki Photo Booth",             desc: "Grass skirts, leis, coconut bras, and tropical props" },
    ],
    vendors: [
      { id: 1, emoji: "🌺", name: "Aloha Party Tampa",          address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.8, reviews: 59,  open: true,  price: "From $199", bg: "from-orange-100 to-pink-50"  },
      { id: 2, emoji: "🌴", name: "Tropical Event Rentals",     address: "500 Main St, Clearwater",    distance: "5.8 mi",  rating: 4.7, reviews: 44,  open: true,  price: "From $149", bg: "from-yellow-100 to-orange-50"},
      { id: 3, emoji: "🎂", name: "Island Cakes by Maria",      address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.9, reviews: 31,  open: false, price: "From $85",  bg: "from-orange-100 to-yellow-50"},
      { id: 4, emoji: "🎵", name: "Tiki Sound & Entertainment", address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.6, reviews: 22,  open: true,  price: "From $150", bg: "from-pink-100 to-orange-50"  },
    ],
    faqs: [
      { q: "Can I do a luau party without a pool?",             a: "Absolutely. Sprinklers, water balloons, and a slip-n-slide create the water element without a pool. The tropical decor, food, and hula activities are the real draw." },
      { q: "What's the best luau party activity?",             a: "The hula contest wins every time — even the shyest kids get into it with the right music and encouragement. Limbo is a close second because everyone can participate at their own level." },
      { q: "What's the right age for a luau?",                 a: "4–16 all work well. Toddler luaus lean into the fun food and sprinklers. Tweens and teens love the dance contest and mocktail tiki bar. It's genuinely all-ages." },
      { q: "Do I need to stay authentic to Hawaiian culture?",  a: "It's a kids' birthday party, so playful tropical theming is perfectly appropriate. If you want to add cultural respect, include a brief 'aloha means welcome' moment and use real Hawaiian music." },
      { q: "Best Florida months for a luau?",                  a: "October through April is ideal — less humidity, lower chance of afternoon thunderstorms. Summer works great if you start by 10am or wait until 5pm to beat peak heat." },
    ],
    relatedThemes: [
      { emoji: "🏊", name: "Pool Party",    slug: "swimming"  },
      { emoji: "🧜", name: "Mermaid Party", slug: "mermaid"   },
      { emoji: "🌟", name: "Glow Party",    slug: "glow-party"},
      { emoji: "⚽", name: "Sports Party",  slug: "sports"    },
    ],
  },

  // ─── PIRATES ───────────────────────────────────────────────────────────────
  pirates: {
    slug: "pirates",
    emoji: "🏴‍☠️",
    name: "Pirate Birthday Party",
    tagline: "Ahoy, mateys! X marks the spot for the best party ever",
    color: "from-amber-600 to-orange-700",
    lightColor: "bg-amber-50",
    accentColor: "text-amber-700",
    borderColor: "border-amber-200",
    btnColor: "bg-amber-600 hover:bg-amber-700",
    ageRange: "Ages 4–11",
    avgCost: "$100–$350",
    guestCount: "8–25 kids",
    planningTime: "2–3 weeks",
    description: "Pirate parties are high adventure on a budget — treasure hunts, cannon ball water fights, and pirate ship obstacle courses make this one of the most action-packed themes you can plan. Easy to DIY, works indoors and out, and kids go absolutely wild in their pirate costumes.",
    tags: ["Adventure", "Outdoor", "Treasure Hunt", "All Genders", "DIY-Easy"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose: backyard treasure hunt vs. indoor ship adventure", "Order treasure chest and map decorations", "Send scrolled bottle message invitations"] },
      { category: "2–4 Weeks Before", items: ["Plan treasure hunt route and clues", "Order pirate ship or treasure chest cake", "Buy pirate hat and eye patch favors", "Hide treasure chest with prizes"] },
      { category: "1 Week Before", items: ["Write out all treasure hunt clue cards", "Set up ship gangplank obstacle", "Fill goody bags with gold coins & gems", "Make aged treasure map prop"] },
      { category: "Day Of", items: ["Welcome kids as 'pirates' with a hat at the door", "Give each team their first treasure map clue", "Announce treasure hunt rules with dramatic flair", "Award treasure chest prizes to all pirates"] },
    ],
    decorIdeas: [
      { emoji: "💀", title: "Jolly Roger Flags",           desc: "Skull and crossbones flags at the entrance and on tables" },
      { emoji: "🗺️", title: "Aged Treasure Map Backdrop", desc: "Printed aged map as the photo wall backdrop" },
      { emoji: "⚓", title: "Anchor & Rope Accents",       desc: "Rope coils and anchor cutouts as nautical table decor" },
      { emoji: "💎", title: "Treasure Chest Centerpiece",  desc: "Open chest overflowing with gold coins, gems, and beads" },
      { emoji: "🏴‍☠️", title: "Ship Plank Photo Op",     desc: "Wooden plank walkway photo opportunity with waves behind" },
      { emoji: "🪙", title: "Gold Coin Scatter",           desc: "Chocolate gold coins scattered across every table" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Pirate Ship Cake",            desc: "Sheet cake shaped as a ship with pretzel stick masts" },
      { emoji: "💀", name: "Skeleton Finger Sandwiches", desc: "Finger sandwiches with olive 'knuckles' on toothpick skewers" },
      { emoji: "🍎", name: "Cannon Ball Fruit Skewers",  desc: "Round grapes and melon balls on skewers labeled 'cannon balls'" },
      { emoji: "🥤", name: "Shark Punch Bowl",            desc: "Blue punch with a rubber shark fin circling the bowl" },
      { emoji: "🍭", name: "Gold Doubloon Cookies",       desc: "Round cookies decorated in gold with anchor designs" },
      { emoji: "🌽", name: "Pirate Corn Dogs",            desc: "Mini corn dogs on sticks labeled 'pirate swords'" },
    ],
    activities: [
      { emoji: "🗺️", title: "Treasure Hunt",                desc: "Multi-clue hunt leading to a buried treasure chest with prizes" },
      { emoji: "💣", title: "Cannonball Water Balloon Fight", desc: "Teams defend their ship (hula hoop) from water balloon attacks" },
      { emoji: "🏴‍☠️", title: "Walk the Plank",           desc: "Balance across a low wooden plank over a 'shark-filled' tarp" },
      { emoji: "🎯", title: "Cannon Aim Challenge",         desc: "Roll balls into target holes of different point values" },
      { emoji: "🥷", title: "Pirate Sword Training",        desc: "Foam sword obstacle course with challenges at each station" },
      { emoji: "📸", title: "Pirate Portrait Booth",        desc: "Full costume station with hats, hooks, and eye patches" },
    ],
    vendors: [
      { id: 1, emoji: "🏴‍☠️", name: "Captain's Crew Events",  address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.9, reviews: 67,  open: true,  price: "From $199", bg: "from-amber-100 to-orange-50" },
      { id: 2, emoji: "🗺️", name: "Treasure Hunt Party Co.",   address: "500 Main St, Clearwater",    distance: "5.8 mi",  rating: 4.8, reviews: 44,  open: true,  price: "From $149", bg: "from-orange-100 to-amber-50" },
      { id: 3, emoji: "🎂", name: "Ship Shape Cakes",           address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.7, reviews: 28,  open: false, price: "From $85",  bg: "from-yellow-100 to-amber-50" },
      { id: 4, emoji: "🪙", name: "Gold Coin Party Supply",     address: "210 Alt 19, Palm Harbor",    distance: "8.3 mi",  rating: 4.6, reviews: 19,  open: true,  price: "From $40",  bg: "from-amber-100 to-yellow-50" },
    ],
    faqs: [
      { q: "How do I set up a good treasure hunt?",    a: "Write 5–8 clue cards, each pointing to the next location (sandbox, back door, under the slide). Final clue leads to the buried treasure chest. Age 4–6 needs visual clues; ages 7+ can handle riddles." },
      { q: "What goes in the treasure chest?",         a: "Fill it with chocolate gold coins, plastic gems, small toys, temporary tattoos, and a 'congratulations' certificate. Budget $3–5 per child." },
      { q: "Can girls love a pirate party?",           a: "Absolutely — pirate queens, mermaid pirates, and adventure themes resonate with girls just as well. Offer glittery eye patches and purple pirate scarves for a girl-friendly pirate vibe." },
      { q: "Best pirate party age?",                   a: "4–8 is the sweet spot for maximum engagement with the treasure hunt. Older kids (9–11) still love it with a more competitive, puzzle-based hunt format." },
      { q: "Indoor or outdoor?",                       a: "Outdoor is ideal for cannonball fights, plank walking, and the treasure hunt. Indoor works perfectly well with the hunt contained to different rooms." },
    ],
    relatedThemes: [
      { emoji: "🚀", name: "Space Party",  slug: "space"       },
      { emoji: "🦕", name: "Dino Party",   slug: "dinosaurs"   },
      { emoji: "🦸", name: "Superhero",    slug: "superheroes" },
      { emoji: "🏊", name: "Pool Party",   slug: "swimming"    },
    ],
  },

  // ─── FAIRY TALE ────────────────────────────────────────────────────────────
  fairytale: {
    slug: "fairytale",
    emoji: "🏰",
    name: "Fairy Tale Birthday Party",
    tagline: "Once upon a time, there was the most magical party ever…",
    color: "from-rose-400 to-purple-500",
    lightColor: "bg-rose-50",
    accentColor: "text-rose-600",
    borderColor: "border-rose-200",
    btnColor: "bg-rose-500 hover:bg-rose-600",
    ageRange: "Ages 3–9",
    avgCost: "$150–$500",
    guestCount: "8–20 kids",
    planningTime: "3–5 weeks",
    description: "Fairy tale parties transport kids into a storybook world — castles, enchanted forests, magical creatures, and happily ever afters. More flexible than a Disney-specific theme since it lets you blend elements from multiple stories. Perfect for imaginative kids who love being read to and love to make-believe.",
    tags: ["Fantasy", "Indoor", "Dress-Up", "Girls", "Storytelling"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose story focus: classic fairy tales vs. enchanted forest", "Book venue or plan home castle setup", "Send storybook page or scroll invitations"] },
      { category: "2–4 Weeks Before", items: ["Order tiered castle cake", "Buy fairy wings and wand favors for all guests", "Plan story-themed activities", "Order enchanted forest decor"] },
      { category: "1 Week Before", items: ["Set up enchanted forest entrance with twinkle lights", "Prep fairy godmother story time script", "Assemble storybook goody bags", "Set up magic wand making craft supplies"] },
      { category: "Day Of", items: ["Greet guests as a 'fairy godparent'", "Open with a story time moment", "Award each child a fairy tale name and title", "Close with 'and they all lived happily ever after' cake reveal"] },
    ],
    decorIdeas: [
      { emoji: "🏰", title: "Castle Entrance Arch",      desc: "Cardboard castle turrets framing the party entrance" },
      { emoji: "🌿", title: "Enchanted Forest Foliage",  desc: "Faux ivy, moss, and twinkle lights for magical woodland feel" },
      { emoji: "🦋", title: "Butterfly & Fairy Garland", desc: "Pastel paper butterflies and fairy silhouettes strung together" },
      { emoji: "💫", title: "Wishing Well Centerpiece",  desc: "Mini wishing well with coins and flowers as table centerpiece" },
      { emoji: "🕯️", title: "Flameless Candle Lanterns", desc: "Warm amber lanterns throughout for storybook atmosphere" },
      { emoji: "📖", title: "Open Book Displays",         desc: "Open storybooks as table decor with pressed flower bookmarks" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Storybook Castle Cake",       desc: "Multi-tier cake with fondant castle towers and drawbridge" },
      { emoji: "🍎", name: "Enchanted Apple Slices",      desc: "Apple slices with caramel dipping sauce and gold shimmer" },
      { emoji: "🧁", name: "Magic Wand Cupcakes",         desc: "Star-tipped pretzel wand on top of each frosted cupcake" },
      { emoji: "🥤", name: "Fairy Potion Punch",          desc: "Purple and pink swirled lemonade with butterfly pea flower" },
      { emoji: "🍭", name: "Storybook Character Cookies", desc: "Frosted cookies shaped as castles, dragons, and crowns" },
      { emoji: "🍓", name: "Dragon's Jewels Fruit Bowl",  desc: "Mixed red berries and grapes labeled 'dragon's stolen jewels'" },
    ],
    activities: [
      { emoji: "🪄", title: "Magic Wand Craft",    desc: "Decorate dowel wands with ribbon, gems, and star toppers" },
      { emoji: "🐉", title: "Dragon Egg Hunt",     desc: "Find speckled dragon eggs hidden around the party space" },
      { emoji: "📖", title: "Story Time Circle",   desc: "Read a fairy tale together, kids act out the characters" },
      { emoji: "👑", title: "Royal Title Ceremony",desc: "Each child receives a scroll with their fairy tale name & title" },
      { emoji: "🎭", title: "Fairy Tale Charades", desc: "Act out characters and scenes from classic stories" },
      { emoji: "📸", title: "Storybook Photo Booth",desc: "Castle backdrop, wings, crowns, and wands for magical photos" },
    ],
    vendors: [
      { id: 1, emoji: "🏰", name: "Enchanted Events Studio",   address: "200 Bayshore Blvd, Tampa",   distance: "14 mi",   rating: 4.8, reviews: 87,  open: true,  price: "From $399", bg: "from-rose-100 to-purple-50"  },
      { id: 2, emoji: "🪄", name: "Fairy Godmother Party Co.", address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 5.0, reviews: 52,  open: true,  price: "From $249", bg: "from-purple-100 to-rose-50"  },
      { id: 3, emoji: "🎂", name: "Once Upon a Cake",          address: "340 Main St, Dunedin",       distance: "6.1 mi",  rating: 4.9, reviews: 38,  open: false, price: "From $110", bg: "from-rose-100 to-pink-50"    },
      { id: 4, emoji: "🌿", name: "Enchanted Décor Rentals",   address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.7, reviews: 29,  open: true,  price: "From $149", bg: "from-purple-100 to-rose-50"  },
    ],
    faqs: [
      { q: "Fairy tale vs. princess theme — what's the difference?", a: "Princess parties typically focus on specific characters (Cinderella, Elsa). Fairy tale is broader — enchanted forests, magical creatures, and original storytelling. Fairy tale lets you be more creative and avoid licensing." },
      { q: "How do I make it feel truly magical?",                    a: "Atmosphere is everything: warm twinkle lights, soft music, and a storyteller-style host who speaks in character. The opening 'once upon a time' moment and the closing 'happily ever after' bookend the experience beautifully." },
      { q: "What's the best fairy tale party activity?",              a: "The magic wand craft is universally loved — kids make it themselves, use it throughout the party, and take it home. The royal title ceremony with personalized scrolls is the most memorable closing ritual." },
      { q: "Can boys enjoy a fairy tale party?",                      a: "Yes — frame it around dragons, knights, wizards, and quests. A 'brave hero' angle alongside the magic and enchantment makes it engaging for all genders." },
      { q: "Which fairy tales work best as party themes?",            a: "Stories with clear heroes, magic items, and quests work best: Jack and the Beanstalk, Cinderella, Sleeping Beauty, and original woodland fairy tales. Avoid darker Grimm tales for young kids." },
    ],
    relatedThemes: [
      { emoji: "👑", name: "Princess Party", slug: "princess" },
      { emoji: "🦄", name: "Unicorn Party",  slug: "unicorn"  },
      { emoji: "🧜", name: "Mermaid Party",  slug: "mermaid"  },
      { emoji: "🥷", name: "Ninja Warrior",  slug: "ninja"    },
    ],
  },

  // ─── FIRST BIRTHDAY ────────────────────────────────────────────────────────
  "first-birthday": {
    slug: "first-birthday",
    emoji: "🎂",
    name: "First Birthday Party",
    tagline: "The one they'll always see in photos — make it unforgettable",
    color: "from-pink-300 to-rose-400",
    lightColor: "bg-pink-50",
    accentColor: "text-pink-600",
    borderColor: "border-pink-200",
    btnColor: "bg-pink-400 hover:bg-pink-500",
    ageRange: "1 year old",
    avgCost: "$100–$500",
    guestCount: "15–40 guests",
    planningTime: "4–8 weeks",
    description: "First birthdays are really for the parents and family — the baby won't remember, but the photos last forever. This means your focus should be on beautiful aesthetics, a smash cake moment, and comfort for a baby who may be overstimulated by crowds. Keep it short (2–3 hours), keep it bright, and make the cake reveal the centerpiece.",
    tags: ["Milestone", "Family-Friendly", "Indoor", "Photo-Focused", "Smash Cake"],
    checklist: [
      { category: "8–10 Weeks Before", items: ["Choose theme: boho, floral, woodland, bright colors", "Book photographer — 1st birthdays need professional photos", "Reserve venue or plan home party", "Send invitations 6 weeks early (family travels for this)"] },
      { category: "4–6 Weeks Before", items: ["Order tiered display cake + separate smash cake", "Order 'One' banner and milestone decorations", "Plan photo moments: cake smash, family portrait, milestone board", "Coordinate outfits for baby and parents"] },
      { category: "1–2 Weeks Before", items: ["Set up milestone board (weight, height, favorites at 1 year)", "Prep goodie bags for adult guests", "Confirm photographer timing and shot list", "Arrange baby's nap schedule around party timing"] },
      { category: "Day Of", items: ["Schedule party during baby's best mood window (post-nap)", "Set up smash cake area before guests arrive", "Have wipes, change of clothes, and calm space ready", "Let baby lead the smash — don't rush it"] },
    ],
    decorIdeas: [
      { emoji: "1️⃣", title: "Giant 'ONE' Balloon Letters", desc: "Gold or rose gold balloon letters as the hero backdrop element" },
      { emoji: "🌸", title: "Floral Arch or Garland",      desc: "Fresh or silk flower arch behind the smash cake station" },
      { emoji: "📸", title: "Milestone Photo Board",       desc: "Monthly photo display showing baby's growth from 0–12 months" },
      { emoji: "🎂", title: "Smash Cake Highchair Setup",  desc: "Decorated highchair with flowers and a banner for the smash" },
      { emoji: "✨", title: "Soft Pastel Balloon Clusters",desc: "Blush, ivory, and sage balloon clusters — soft and beautiful" },
      { emoji: "🌿", title: "Greenery Table Runners",      desc: "Fresh eucalyptus runners on food tables for elegant look" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Display Cake + Smash Cake",   desc: "Beautiful tiered display cake for photos; simple smash cake for baby" },
      { emoji: "🧁", name: "Cupcake Tower",               desc: "Matching cupcakes on a tower for guests to take" },
      { emoji: "🍓", name: "Fruit & Charcuterie Board",   desc: "Elevated grazing board — adults love it, looks great in photos" },
      { emoji: "🥤", name: "Signature Baby Mocktail",     desc: "Named after the birthday child — fruit punch with fancy garnish" },
      { emoji: "🍕", name: "Mini Sliders & Bites",        desc: "Adult-friendly finger foods since this party is really for them" },
      { emoji: "🍭", name: "Custom Name Cookies",         desc: "Personalized cookies with baby's name and first photo" },
    ],
    activities: [
      { emoji: "🎂", title: "Cake Smash Moment",         desc: "The centerpiece — baby vs. smash cake, parents stand back" },
      { emoji: "📸", title: "Professional Photo Booth",  desc: "Set up a beautiful backdrop specifically for guest photos with baby" },
      { emoji: "📝", title: "Wishes for the Future Jar", desc: "Guests write wishes for the birthday child on cards to keep" },
      { emoji: "🎵", title: "Happy Birthday Sing-Along", desc: "Full family gathered, candle, song — capture every angle" },
      { emoji: "🌸", title: "Flower Crown Photo Prop",   desc: "Matching flower crowns for baby and parents in family photos" },
      { emoji: "🎁", title: "Guided Gift Opening",       desc: "Open gifts slowly with everyone gathered — let baby explore each one" },
    ],
    vendors: [
      { id: 1, emoji: "📸", name: "First Light Photography",     address: "Safety Harbor + travel",     distance: "Local",   rating: 5.0, reviews: 134, open: true,  price: "From $350", bg: "from-pink-100 to-rose-50"    },
      { id: 2, emoji: "🌸", name: "Bloom Party Florals",         address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.9, reviews: 72,  open: true,  price: "From $199", bg: "from-rose-100 to-pink-50"    },
      { id: 3, emoji: "🎂", name: "Sweet One Smash Cake Studio", address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 5.0, reviews: 89,  open: false, price: "From $65",  bg: "from-pink-100 to-rose-50"    },
      { id: 4, emoji: "🎈", name: "One in a Million Balloons",   address: "340 Main St, Dunedin",       distance: "6.1 mi",  rating: 4.8, reviews: 41,  open: true,  price: "From $75",  bg: "from-rose-100 to-pink-50"    },
    ],
    faqs: [
      { q: "How long should a first birthday party be?",  a: "2–2.5 hours maximum. Babies get overwhelmed quickly by crowds, noise, and stimulation. Schedule it right after their morning nap for peak happy mood — usually 10am–12:30pm." },
      { q: "Do I need a professional photographer?",      a: "Yes — this is the one party where it's absolutely worth it. You will be holding the baby, managing guests, and cutting cake. You cannot photograph and host simultaneously. Book it." },
      { q: "What is a smash cake?",                       a: "A small, simple cake (no fondant — it's hard to eat) made just for baby to smash, smoosh, and taste. It's separate from the display cake. Most bakers offer them as a small add-on." },
      { q: "How many guests is appropriate?",             a: "Intimate (15–20) is ideal for baby's comfort. Large extended family gatherings (30–50) work if there's a quiet room where baby can decompress. Don't prioritize guest count over baby's experience." },
      { q: "What theme looks best in photos?",            a: "Boho floral, woodland, and pastel balloon themes photograph most beautifully. Neutral backgrounds with pops of color create timeless images. Avoid busy, cluttered setups that distract from baby." },
    ],
    relatedThemes: [
      { emoji: "🧸", name: "Toddler Party",  slug: "toddler"       },
      { emoji: "👑", name: "Princess Party", slug: "princess"      },
      { emoji: "🦄", name: "Unicorn Party",  slug: "unicorn"       },
      { emoji: "🌿", name: "Farm Party",     slug: "farm"          },
    ],
  },

  // ─── TODDLER ───────────────────────────────────────────────────────────────
  toddler: {
    slug: "toddler",
    emoji: "🧸",
    name: "Toddler Birthday Party",
    tagline: "Simple, joyful & mess-approved — for tiny humans with big energy",
    color: "from-yellow-300 to-amber-400",
    lightColor: "bg-yellow-50",
    accentColor: "text-yellow-700",
    borderColor: "border-yellow-200",
    btnColor: "bg-yellow-500 hover:bg-yellow-600",
    ageRange: "Ages 2–3",
    avgCost: "$75–$300",
    guestCount: "8–20 guests",
    planningTime: "2–4 weeks",
    description: "Toddler parties need to be simple, safe, and sensory-friendly. Short attention spans, unpredictable moods, and a crowd of anxious parents means less is more. The best toddler parties have free play, one simple craft, familiar food, and a quick cake moment. Don't overthink it — toddlers just want to run around with their friends.",
    tags: ["Milestone", "Indoor", "Simple", "Short Duration", "Sensory-Safe"],
    checklist: [
      { category: "4–6 Weeks Before", items: ["Choose simple, bright theme (animals, colors, bubbles)", "Plan 1.5–2 hour maximum party duration", "Send invitations to 8–15 kids max"] },
      { category: "2–3 Weeks Before", items: ["Order simple smash-friendly birthday cake", "Set up soft play area if possible", "Buy one simple craft (coloring, sticker books)", "Plan nap-friendly timing (usually 10am or 3pm)"] },
      { category: "1 Week Before", items: ["Baby-proof the party space", "Stock first aid kit and wipes — lots of wipes", "Prep familiar, allergen-labeled snacks", "Set up toy rotation basket for free play"] },
      { category: "Day Of", items: ["Keep music low and calming", "Have a quiet corner for overwhelmed toddlers", "Keep cake moment short and sweet", "End before meltdown o'clock"] },
    ],
    decorIdeas: [
      { emoji: "🌈", title: "Primary Color Balloons",     desc: "Bright red, yellow, blue, green balloons — toddlers go wild for them" },
      { emoji: "🧸", title: "Stuffed Animal Table Decor", desc: "The birthday child's favorite stuffed animals as table props" },
      { emoji: "🎈", title: "Low Balloon Floor Cluster",  desc: "Balloons at toddler height so they can actually play with them" },
      { emoji: "🌟", title: "Star & Moon Bunting",         desc: "Cheerful star-print fabric bunting across the party space" },
      { emoji: "🎨", title: "Crayon Color Theme",          desc: "Giant crayon decorations in primary colors everywhere" },
      { emoji: "🌿", title: "Simple Floral Centerpieces", desc: "Small sunflowers in mason jars — bright, child-safe, beautiful" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Simple Smash Cake",           desc: "Small, soft cake with no fondant — easy to grab and eat" },
      { emoji: "🍓", name: "Toddler-Safe Snack Platter",  desc: "Grapes (halved), cheese cubes, crackers, and banana slices" },
      { emoji: "🥪", name: "Mini PB&J Squares",           desc: "Tiny peanut-free sandwiches — confirm allergies beforehand" },
      { emoji: "🧃", name: "Juice Box Station",            desc: "Pouches of apple or grape juice in a colorful ice bucket" },
      { emoji: "🍭", name: "Animal Cracker Bags",          desc: "Individual animal cracker bags as table favors/snacks" },
      { emoji: "🫐", name: "Berry & Yogurt Dip Station",  desc: "Blueberries, strawberries, and vanilla yogurt for dipping" },
    ],
    activities: [
      { emoji: "🎈", title: "Free Balloon Play",           desc: "Release a pile of balloons — best activity a toddler has ever seen" },
      { emoji: "🖍️", title: "Giant Coloring Sheet",       desc: "One big coloring sheet on the floor, everyone colors together" },
      { emoji: "🫧", title: "Bubble Machine Station",     desc: "Set up a bubble machine outside — toddlers will chase for hours" },
      { emoji: "🧸", title: "Soft Play Obstacle Course",  desc: "Foam blocks, tunnels, and mini slides — toddler paradise" },
      { emoji: "🎵", title: "Freeze Dance to Kids' Songs",desc: "Wiggle Wiggle, Baby Shark, Wheels on the Bus — short & sweet" },
      { emoji: "📸", title: "Tiny Throne Photo Spot",     desc: "Decorated chair at toddler height for birthday portraits" },
    ],
    vendors: [
      { id: 1, emoji: "🧸", name: "Tiny Tots Soft Play Rentals", address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.9, reviews: 91,  open: true,  price: "From $199", bg: "from-yellow-100 to-amber-50"  },
      { id: 2, emoji: "🎈", name: "Balloon Bar Tampa",            address: "500 Main St, Clearwater",    distance: "5.8 mi",  rating: 4.8, reviews: 55,  open: true,  price: "From $99",  bg: "from-amber-100 to-yellow-50"  },
      { id: 3, emoji: "🎂", name: "Little Bites Cake Studio",     address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 5.0, reviews: 44,  open: false, price: "From $55",  bg: "from-yellow-100 to-orange-50" },
      { id: 4, emoji: "📸", name: "Tiny Moments Photography",     address: "Safety Harbor + travel",     distance: "Local",   rating: 4.9, reviews: 67,  open: true,  price: "From $250", bg: "from-amber-100 to-yellow-50"  },
    ],
    faqs: [
      { q: "How long should a toddler party be?",      a: "1.5–2 hours is the sweet spot. Toddlers start melting down around the 90-minute mark. Plan: arrive, free play, activity, snacks, cake, goodbye. That's your whole party." },
      { q: "How many kids should I invite?",           a: "A good rule of thumb: the birthday child's age + 1. So a 2-year-old gets 3 friends; a 3-year-old gets 4. More than 8–10 toddlers in one space quickly becomes overwhelming for everyone." },
      { q: "Do toddlers need organized activities?",   a: "Not really — toddlers are happiest with free play, familiar toys, and space to run. One simple activity (bubbles, balloons, big coloring sheet) is plenty. Over-programming backfires." },
      { q: "What's the best toddler party favor?",    a: "A small board book, a mini play-dough set, or a box of crayons are universally loved and parent-approved. Avoid choking hazards, loud noisemakers, and anything that parents will resent." },
      { q: "When is the best time for a toddler party?", a: "10:00–11:30am (post-morning-nap) or 3:00–4:30pm (post-afternoon-nap) are ideal windows. Never schedule over nap time — you will regret it." },
    ],
    relatedThemes: [
      { emoji: "🎂", name: "1st Birthday", slug: "first-birthday"},
      { emoji: "🦕", name: "Dino Party",   slug: "dinosaurs"     },
      { emoji: "🐄", name: "Farm Animals", slug: "farm"          },
      { emoji: "🦄", name: "Unicorn Party",slug: "unicorn"       },
    ],
  },

  // ─── TEENS ─────────────────────────────────────────────────────────────────
  teens: {
    slug: "teens",
    emoji: "🎸",
    name: "Teen Birthday Party",
    tagline: "Too cool for kiddie parties — this one actually slaps",
    color: "from-zinc-700 to-gray-900",
    lightColor: "bg-zinc-50",
    accentColor: "text-zinc-700",
    borderColor: "border-zinc-300",
    btnColor: "bg-zinc-700 hover:bg-zinc-800",
    ageRange: "Ages 13–17",
    avgCost: "$200–$600",
    guestCount: "10–25 teens",
    planningTime: "3–5 weeks",
    description: "Teen parties need to feel grown-up, social, and genuinely fun — not like a little kid's birthday with bigger balloons. The key is giving teens agency: let them pick the theme, the music, and the food. Popular formats include escape rooms, bowling nights, movie nights under the stars, and themed hangouts. Chill vibes, great food, and good company win every time.",
    tags: ["Teens", "Social", "Indoor & Outdoor", "Teen-Driven", "Experience-Based"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Let the birthday teen choose the experience type", "Book escape room, bowling, movie, or venue", "Send digital invitations — teens don't open paper mail"] },
      { category: "2–4 Weeks Before", items: ["Order dessert bar or custom cake (teens care less about theme cakes)", "Plan food: pizza, taco bar, or their absolute favorites", "Confirm playlist curation with the birthday teen", "Arrange photo booth or activity setup"] },
      { category: "1 Week Before", items: ["Send digital reminder via text/Insta", "Stock up on preferred snacks and drinks", "Set up photo backdrop for group shots", "Plan a low-key house rules conversation with the teen"] },
      { category: "Day Of", items: ["Let the teen greet their own guests", "Stay present but invisible — they don't want hovering", "Capture candid group moments for them", "Order food at the right time — teens eat a lot"] },
    ],
    decorIdeas: [
      { emoji: "✨", title: "Neon Sign with Their Name", desc: "Custom LED neon sign — teens love the aesthetic and it's photogenic" },
      { emoji: "📸", title: "Polaroid Photo Wall",       desc: "String + clips for Polaroid photos taken throughout the night" },
      { emoji: "🎵", title: "Aesthetic Music Corner",    desc: "Record player, vinyl display, and string lights for vibe" },
      { emoji: "🌑", title: "Moody Dark Aesthetic",      desc: "Dark tablecloths, black balloons, gold or silver accents" },
      { emoji: "🍕", title: "Epic Snack Table",           desc: "Teens care more about food than florals — make it stunning" },
      { emoji: "🎂", title: "Minimalist Cake Display",   desc: "Simple, elegant cake on a pedestal — no kiddie decorations" },
    ],
    foodIdeas: [
      { emoji: "🍕", name: "Build-Your-Own Pizza Bar",  desc: "Dough + toppings teens choose themselves — always a hit" },
      { emoji: "🌮", name: "Taco Bar",                   desc: "Protein options, toppings bar, guac — teens demolish this" },
      { emoji: "🎂", name: "Dessert Tower",              desc: "Mix of mini desserts, macarons, and the birthday cake" },
      { emoji: "🧋", name: "Boba Tea Station",           desc: "DIY boba tea with flavor and topping choices — very trendy" },
      { emoji: "🍔", name: "Smash Burger Bar",           desc: "Make-your-own smash burgers — interactive and delicious" },
      { emoji: "🍦", name: "Rolled Ice Cream Bar",       desc: "Instant crowd favorite — teens will post it immediately" },
    ],
    activities: [
      { emoji: "🔐", title: "Escape Room",           desc: "Book a private escape room session — groups of 6–10 are ideal" },
      { emoji: "🎳", title: "Bowling Night",         desc: "Reserve lanes, add food packages, let them set the vibe" },
      { emoji: "🎬", title: "Backyard Movie Night",  desc: "Projector + screen, blankets, fairy lights, their favorite movie" },
      { emoji: "🎮", title: "Gaming Tournament",     desc: "Set up a tournament bracket in their favorite current game" },
      { emoji: "🎨", title: "Paint & Sip (mocktail)",desc: "Guided painting night with sparkling mocktails — surprisingly fun for teens" },
      { emoji: "📸", title: "Group Photo Reel",      desc: "Designate someone to capture a photo reel they can post" },
    ],
    vendors: [
      { id: 1, emoji: "🔐", name: "Lock'd Escape Rooms Tampa",   address: "500 N Dale Mabry, Tampa",    distance: "12 mi",   rating: 4.9, reviews: 203, open: true,  price: "From $28/person", bg: "from-zinc-100 to-slate-50" },
      { id: 2, emoji: "🎳", name: "Pinstripes Bowling & Bistro", address: "200 Bayshore, Tampa",        distance: "14 mi",   rating: 4.7, reviews: 177, open: true,  price: "From $299",  bg: "from-gray-100 to-zinc-50"  },
      { id: 3, emoji: "🎂", name: "Aesthetic Cake Co.",           address: "210 Main St, Clearwater",    distance: "5.2 mi.",  rating: 5.0, reviews: 48,  open: false, price: "From $120",  bg: "from-zinc-100 to-gray-50"  },
      { id: 4, emoji: "🎬", name: "Backyard Cinema Rentals",      address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.8, reviews: 66,  open: true,  price: "From $199",  bg: "from-slate-100 to-zinc-50" },
    ],
    faqs: [
      { q: "How do I plan a party a teenager will actually enjoy?", a: "The single most important thing: ask them. Involve them in every decision — venue, food, guest list, music. A party they chose feels like their party. One they didn't feels like something inflicted on them." },
      { q: "How many guests is the right number?",                  a: "Smaller is better for teens — 10–15 close friends beats 30 acquaintances. Teens want to feel cool and special, not like their birthday is an obligation event for every person they've ever met." },
      { q: "What do teens actually want at their party?",           a: "Food (lots of it, good quality), music they control, a reason to take photos/videos, and time to just hang out. Organized activities are fine but shouldn't be forced. Vibe > agenda." },
      { q: "Should parents stay or leave?",                         a: "Stay on-premise for safety and logistics, but give teens their space. Be available, not present in the room. Check in occasionally without hovering. Trust them." },
      { q: "What's the best teen birthday experience overall?",     a: "Escape rooms and bowling top the charts for mixed groups. For smaller friend groups, backyard movie night or a paint night are incredibly popular. Experiences > parties for most teens 14+." },
    ],
    relatedThemes: [
      { emoji: "🎮", name: "Gaming Party",  slug: "gaming"     },
      { emoji: "🌟", name: "Glow Party",    slug: "glow-party" },
      { emoji: "🎵", name: "Music & Dance", slug: "music-dance"},
      { emoji: "🏊", name: "Pool Party",    slug: "swimming"   },
    ],
  },

  // ─── FARM ANIMALS ──────────────────────────────────────────────────────────
  farm: {
    slug: "farm",
    emoji: "🐄",
    name: "Farm & Animals Birthday Party",
    tagline: "Down on the birthday farm — hay bales, animals & country fun",
    color: "from-lime-400 to-green-500",
    lightColor: "bg-lime-50",
    accentColor: "text-lime-700",
    borderColor: "border-lime-200",
    btnColor: "bg-lime-600 hover:bg-lime-700",
    ageRange: "Ages 1–8",
    avgCost: "$100–$400",
    guestCount: "10–25 kids",
    planningTime: "2–4 weeks",
    description: "Farm parties are warm, wholesome, and endlessly cute — barn red, hay bales, rubber boots, and animal cutouts everywhere. A petting zoo visit (even a small mobile one) takes this theme from fun to unforgettable. Easy to DIY for any budget and works perfectly for toddlers who are obsessed with animals.",
    tags: ["Animals", "Outdoor", "Toddler-Friendly", "All Genders", "Petting Zoo Option"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Book mobile petting zoo if desired", "Reserve farm venue or plan backyard barn setup", "Send barnyard animal-themed invitations"] },
      { category: "2–4 Weeks Before", items: ["Order farm animal cake", "Buy rubber boot and bandana favors", "Plan animal relay and ring toss games", "Order hay bale seating (or use cardboard boxes)"] },
      { category: "1 Week Before", items: ["Set up barn entrance arch", "Prep animal mask craft supplies", "Assemble goodie bags with animal crackers & toys", "Set up petting zoo safety guidelines sign"] },
      { category: "Day Of", items: ["Welcome kids with bandana neckerchiefs", "Brief kids on gentle animal petting rules", "Run ring toss and egg relay early", "Cake shaped like barn for the reveal moment"] },
    ],
    decorIdeas: [
      { emoji: "🏚️", title: "Red Barn Entrance Arch",    desc: "Cardboard barn doors as the party entrance frame" },
      { emoji: "🌾", title: "Hay Bale Seating",           desc: "Real or cardboard hay bales as both decor and seating" },
      { emoji: "🐄", title: "Animal Silhouette Bunting",  desc: "Cow, pig, chicken, horse cutout garland across tables" },
      { emoji: "🌻", title: "Sunflower Mason Jar Vases",  desc: "Sunflowers in burlap-wrapped mason jars on every table" },
      { emoji: "🥾", title: "Rubber Boot Centerpieces",   desc: "Bright rubber boots filled with wildflowers as centerpieces" },
      { emoji: "🪵", title: "Wooden Crate Displays",      desc: "Wooden apple crates stacked as food display stands" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Red Barn Layer Cake",         desc: "White cake with red fondant barn exterior and animals on top" },
      { emoji: "🐄", name: "Cow Cupcakes",                desc: "White cupcakes with black spot frosting and candy horns" },
      { emoji: "🌽", name: "Corn on the Cob Bites",       desc: "Baby corn on skewers with butter and salt — kids love these" },
      { emoji: "🍎", name: "Apple Cider Punch",            desc: "Apple cider, ginger ale, and cinnamon in a big farm bucket" },
      { emoji: "🍭", name: "Pig Cake Pops",               desc: "Pink cake pops with fondant ears and snout curled tails" },
      { emoji: "🥚", name: "Deviled 'Farmyard' Eggs",     desc: "Classic deviled eggs with chick faces piped in mustard" },
    ],
    activities: [
      { emoji: "🐾", title: "Petting Zoo Visit",          desc: "Mobile petting zoo with bunnies, chicks, goats, and lambs" },
      { emoji: "🎯", title: "Ring Toss on Fence Posts",   desc: "Toss rings onto wooden fence post targets for prizes" },
      { emoji: "🐔", title: "Egg & Spoon Relay Race",     desc: "Classic egg-and-spoon race with hard-boiled or plastic eggs" },
      { emoji: "🎨", title: "Animal Mask Craft",          desc: "Decorate paper animal masks — pig, cow, horse, chick, sheep" },
      { emoji: "🐷", title: "Pin the Tail on the Pig",    desc: "Farm twist on the classic game — huge giggles guaranteed" },
      { emoji: "📸", title: "Farmer Photo Booth",         desc: "Overalls, straw hats, and pitchfork props for farm portraits" },
    ],
    vendors: [
      { id: 1, emoji: "🐄", name: "Farmyard Friends Petting Zoo", address: "Tampa Bay Area — mobile",   distance: "Travels", rating: 5.0, reviews: 88,  open: true,  price: "From $299", bg: "from-lime-100 to-green-50"  },
      { id: 2, emoji: "🌻", name: "Sunflower Farm Events",        address: "Plant City, FL",            distance: "28 mi",   rating: 4.8, reviews: 61,  open: true,  price: "From $350", bg: "from-yellow-100 to-lime-50"  },
      { id: 3, emoji: "🎂", name: "Barnyard Cakes Co.",           address: "101 Main St, Safety Harbor",distance: "1.2 mi",  rating: 4.9, reviews: 33,  open: false, price: "From $85",  bg: "from-green-100 to-lime-50"  },
      { id: 4, emoji: "🪵", name: "Rustic Party Rentals",         address: "210 Alt 19, Palm Harbor",   distance: "8.3 mi",  rating: 4.7, reviews: 27,  open: true,  price: "From $149", bg: "from-lime-100 to-yellow-50" },
    ],
    faqs: [
      { q: "How do I find a mobile petting zoo?",                       a: "Search 'mobile petting zoo [your city]' — most charge $200–$400 and bring 5–8 animals for a 1–2 hour visit. Book 4–6 weeks out as weekends fill fast, especially spring." },
      { q: "What animals are best for young kids?",                     a: "Rabbits, baby chicks, miniature goats, and baby ducks are the safest and gentlest for toddlers. Ponies and larger animals require more supervision and work better for ages 4+." },
      { q: "Farm venue or home backyard?",                              a: "A real farm venue (Plant City and Polk County have several) adds authenticity and handles logistics. Home backyard is more affordable and convenient but requires you to build the farm atmosphere yourself." },
      { q: "What's the best farm party activity besides petting zoo?",  a: "The egg-and-spoon relay consistently generates the most laughter. Ring toss and pin-the-tail-on-the-pig are close seconds. The animal mask craft gives kids a take-home keepsake." },
      { q: "What age loves farm parties most?",                         a: "1–5 is the prime farm party age range. Kids this age are in their peak animal-obsession phase. The theme also works beautifully as a 1st birthday theme since it photographs so warmly." },
    ],
    relatedThemes: [
      { emoji: "🦕", name: "Dino Party",   slug: "dinosaurs"     },
      { emoji: "🧸", name: "Toddler Party",slug: "toddler"       },
      { emoji: "🎂", name: "1st Birthday", slug: "first-birthday"},
      { emoji: "🌺", name: "Luau Party",   slug: "luau"          },
    ],
  },

  // ─── CHEERLEADING ──────────────────────────────────────────────────────────
  cheerleading: {
    slug: "cheerleading",
    emoji: "📣",
    name: "Cheerleading Birthday Party",
    tagline: "Give me a B-I-R-T-H-D-A-Y — squad goals achieved",
    color: "from-red-500 to-pink-500",
    lightColor: "bg-red-50",
    accentColor: "text-red-600",
    borderColor: "border-red-200",
    btnColor: "bg-red-500 hover:bg-red-600",
    ageRange: "Ages 5–13",
    avgCost: "$150–$350",
    guestCount: "8–20 kids",
    planningTime: "2–3 weeks",
    description: "Cheerleading parties combine dance, sport, and sisterhood into one high-energy celebration. Every guest gets a uniform (or at least a bow and pom-poms), learns a routine, and performs a cheer for the birthday child. Incredibly fun, builds confidence, and the routine performance at the end is always a highlight.",
    tags: ["Active", "Girls", "Indoor & Outdoor", "Performance", "Team Spirit"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Book cheer coach or plan DIY routine", "Choose team colors for uniforms/bows", "Send pom-pom or megaphone invitations"] },
      { category: "2–4 Weeks Before", items: ["Order pom-poms and hair bows for every guest", "Plan routine with coach or choreograph yourself", "Order cheer-themed cake", "Buy megaphone and ribbon decorations"] },
      { category: "1 Week Before", items: ["Practice the routine beforehand", "Prep team color goody bags", "Set up performance stage area", "Print routine cheat sheet for each guest"] },
      { category: "Day Of", items: ["Hand out bows and pom-poms at the door", "Warm up with stretches and basic moves", "Practice the routine 3–4 times", "Perform for parents at the end — record it!"] },
    ],
    decorIdeas: [
      { emoji: "📣", title: "Giant Megaphone Backdrop",   desc: "Oversized megaphone prop as the centerpiece photo op" },
      { emoji: "🎀", title: "Pom-Pom Balloon Clusters",   desc: "Pom-poms tied to balloon strings in team colors" },
      { emoji: "🏆", title: "Championship Banner",         desc: "'Squad Goals' or '[Name]'s Cheer Squad' pennant banner" },
      { emoji: "⭐", title: "Star Confetti Tablecloths",  desc: "Team color tablecloths with gold star confetti scatter" },
      { emoji: "🎽", title: "Mini Uniform Garland",        desc: "Mini cheerleader uniform cutouts strung as a garland" },
      { emoji: "📸", title: "Formation Photo Wall",        desc: "Backdrop for squad formation photos after the performance" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Pom-Pom Cake",               desc: "Round cake decorated with pom-pom frosting in team colors" },
      { emoji: "🧁", name: "Letter Cupcakes",             desc: "Cupcakes spell out the birthday child's name in frosting" },
      { emoji: "🍓", name: "Team Color Fruit Skewers",    desc: "Fruit skewers in the party's two team colors" },
      { emoji: "🥤", name: "Spirit Punch",                desc: "Layered red and pink punch in clear cups with ribbon straws" },
      { emoji: "🍭", name: "Pom-Pom Cookie Pops",         desc: "Round frosted cookies on sticks decorated like pom-poms" },
      { emoji: "🌟", name: "Star-Shaped Sandwiches",      desc: "Star cutout sandwiches labeled 'Fuel for Champions'" },
    ],
    activities: [
      { emoji: "📣", title: "Learn the Birthday Cheer",   desc: "Teach a short custom cheer that spells the birthday child's name" },
      { emoji: "🤸", title: "Cheer Routine Rehearsal",    desc: "Practice a 60-second routine with jumps, claps, and formations" },
      { emoji: "🎀", title: "Bow & Pom-Pom Decorating",  desc: "Decorate your bow with glitter and gems to personalize it" },
      { emoji: "⭐", title: "Stunt Showcase",              desc: "Safe pyramid or basic stunt attempt with coach supervision" },
      { emoji: "🏆", title: "Final Performance",          desc: "Full routine performed for parents — everyone cheers at the end" },
      { emoji: "📸", title: "Squad Formation Photos",     desc: "Professional squad shot in formation with pom-poms raised" },
    ],
    vendors: [
      { id: 1, emoji: "📣", name: "Tampa Bay Cheer Academy",   address: "500 Main St, Clearwater",    distance: "5.8 mi",  rating: 4.9, reviews: 72,  open: true,  price: "From $249", bg: "from-red-100 to-pink-50"  },
      { id: 2, emoji: "🤸", name: "Spirit Squad Party Events", address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.8, reviews: 53,  open: true,  price: "From $199", bg: "from-pink-100 to-red-50"  },
      { id: 3, emoji: "🎀", name: "Bow & Glitter Supply Co.", address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.7, reviews: 31,  open: true,  price: "From $45",  bg: "from-red-100 to-rose-50"  },
      { id: 4, emoji: "🎂", name: "Cheer Cake Studio",        address: "340 Main St, Dunedin",       distance: "6.1 mi.",  rating: 4.9, reviews: 28,  open: false, price: "From $85",  bg: "from-pink-100 to-red-50"  },
    ],
    faqs: [
      { q: "Do kids need cheer experience?",              a: "Not at all — the routine is designed to be learned in 20 minutes by beginners. A good cheer coach will break it into simple sections. The goal is fun and confidence, not perfection." },
      { q: "How do I hire a cheer coach for a party?",   a: "Contact local cheer gyms or studios — many offer birthday party packages where a coach comes to you. Youth cheer coaches often freelance for birthday parties on weekends." },
      { q: "What's the right routine length?",            a: "60–90 seconds is perfect for a party routine. Include: opening formation, 2–3 moves, a signature jump, the birthday cheer, and a final pose. Keep it simple and repeatable." },
      { q: "Can boys enjoy a cheer party?",               a: "Younger boys (5–7) often love it with no hesitation. For older boys, frame it as 'sport stunt training' or combine with a basketball theme where the cheer team performs at halftime." },
      { q: "What do guests take home?",                   a: "Their decorated bow and pom-poms are the obvious take-homes. Add a 'Spirit Award' certificate with their name and a photo from the performance if you have time to print it." },
    ],
    relatedThemes: [
      { emoji: "⚽", name: "Sports Party",  slug: "sports"      },
      { emoji: "🤸", name: "Gymnastics",    slug: "gymnastics"  },
      { emoji: "🎵", name: "Music & Dance", slug: "music-dance" },
      { emoji: "👑", name: "Princess Party",slug: "princess"    },
    ],
  },

  // ─── MUSIC & DANCE ─────────────────────────────────────────────────────────
  "music-dance": {
    slug: "music-dance",
    emoji: "🎵",
    name: "Music & Dance Birthday Party",
    tagline: "Party like a pop star — lights, music & non-stop dancing",
    color: "from-fuchsia-500 to-pink-500",
    lightColor: "bg-fuchsia-50",
    accentColor: "text-fuchsia-600",
    borderColor: "border-fuchsia-200",
    btnColor: "bg-fuchsia-500 hover:bg-fuchsia-600",
    ageRange: "Ages 4–14",
    avgCost: "$150–$400",
    guestCount: "10–25 kids",
    planningTime: "2–4 weeks",
    description: "Music and dance parties are pure joy — disco balls, karaoke, freeze dance, and a dance floor that never stops. Works for any age, any skill level, and any musical taste. The simplest version is a great playlist and a cleared living room floor. The upgraded version has a DJ, light-up dance floor, and karaoke mic. Both are incredible.",
    tags: ["Creative", "Active", "Indoor", "All Genders", "Karaoke-Friendly"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose music theme: pop star, disco, K-pop, general dance", "Book DJ or plan killer playlist", "Send microphone or vinyl record invitations"] },
      { category: "2–4 Weeks Before", items: ["Order disco or music-themed cake", "Rent or buy disco ball and colored lights", "Set up karaoke system or app", "Plan dance activity stations"] },
      { category: "1 Week Before", items: ["Curate playlist with birthday child's input", "Clear dance floor area and mark it off", "Prep microphone favor bags", "Set up photo booth with music props"] },
      { category: "Day Of", items: ["Turn on the music as first guests arrive — instant energy", "Kick off with group dance warm-up", "Run karaoke in a dedicated corner", "End with everyone dancing to the birthday child's #1 song"] },
    ],
    decorIdeas: [
      { emoji: "🪩", title: "Disco Ball Centerpiece",     desc: "Giant disco ball hanging over the dance floor — non-negotiable" },
      { emoji: "🎤", title: "Microphone Balloon Cluster", desc: "Black and silver balloons shaped like microphones" },
      { emoji: "🌈", title: "Color-Changing LED Lights",  desc: "Strip lights and spotlights set to music-reactive mode" },
      { emoji: "🎵", title: "Musical Note Garland",       desc: "Black musical notes on white string hung across the space" },
      { emoji: "⭐", title: "Star on the Walk of Fame",   desc: "Gold star with birthday child's name at the entrance" },
      { emoji: "📸", title: "Pop Star Photo Wall",         desc: "Metallic fringe curtain + star balloons for diva shots" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Record Player Cake",          desc: "Fondant vinyl record and turntable on top of the cake" },
      { emoji: "🎤", name: "Microphone Cake Pops",        desc: "Round cake pops on sticks decorated as silver microphones" },
      { emoji: "🌈", name: "Rainbow Macarons",            desc: "Multi-color macarons arranged in a spectrum on a platter" },
      { emoji: "🥤", name: "Pop Star Punch",              desc: "Sparkling water with grenadine and a glow cube inside" },
      { emoji: "⭐", name: "Star-Cut Sandwiches",          desc: "Star-shaped sandwiches labeled 'Backstage Fuel'" },
      { emoji: "🍭", name: "Musical Note Cookies",         desc: "Treble clef and note-shaped sugar cookies in black and gold" },
    ],
    activities: [
      { emoji: "🎤", title: "Karaoke Stage",              desc: "Dedicated karaoke corner with song list and real mic — kids go wild" },
      { emoji: "💃", title: "Dance-Off Competition",      desc: "Bracket-style dance battle — judged on style, energy, and creativity" },
      { emoji: "🎵", title: "Freeze Dance Tournament",    desc: "Elimination-style freeze dance to a playlist they control" },
      { emoji: "🎸", title: "Air Band Performance",       desc: "Teams form a band and mime perform a song — hilarious and fun" },
      { emoji: "🪩", title: "Disco Mirror Ball Dance",    desc: "Classic disco with the ball spinning and strobe lights" },
      { emoji: "📸", title: "Pop Star Photo Shoot",       desc: "Pose with mic props, sunglasses, and star backdrop" },
    ],
    vendors: [
      { id: 1, emoji: "🎧", name: "Kid DJ Tampa",              address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.9, reviews: 88,  open: true,  price: "From $299", bg: "from-fuchsia-100 to-pink-50" },
      { id: 2, emoji: "🎤", name: "Star Power Party Events",   address: "500 N Dale Mabry, Tampa",    distance: "12 mi",   rating: 4.8, reviews: 64,  open: true,  price: "From $249", bg: "from-pink-100 to-fuchsia-50" },
      { id: 3, emoji: "🪩", name: "Disco Rentals Tampa",       address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.7, reviews: 41,  open: true,  price: "From $149", bg: "from-fuchsia-100 to-pink-50" },
      { id: 4, emoji: "🎂", name: "Pop Star Cakes Studio",     address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.9, reviews: 37,  open: false, price: "From $95",  bg: "from-pink-100 to-rose-50"   },
    ],
    faqs: [
      { q: "Do I need a real DJ or can I just use Spotify?",    a: "For ages 4–9, a great Spotify playlist and a Bluetooth speaker is genuinely all you need. For ages 10+, a kid-safe DJ who can read the crowd and take requests elevates the whole experience significantly." },
      { q: "What's the best karaoke setup for a kids' party?",  a: "The Smule app + a Bluetooth mic is easy and cheap. YouTube Karaoke (search 'karaoke version [song]') on a TV works great. For a bigger wow factor, rent a karaoke machine with a screen." },
      { q: "How do I handle shy kids who don't want to dance?", a: "Make karaoke an option alongside dancing, and set up the photo booth as a third activity. Never make dancing mandatory. Most shy kids join in within 20 minutes once the energy builds." },
      { q: "What music works for a mixed-age group?",           a: "Disney hits, current pop chart-toppers, and classic party songs (YMCA, Cha Cha Slide, Cupid Shuffle) work for all ages. Let the birthday child curate a 'VIP song list' that gets priority play." },
      { q: "Dance party or music/karaoke party?",               a: "Dance party = floor-focused, physical, DJ-driven. Karaoke party = performance-focused, everyone gets a mic moment. Most successful music parties blend both with 60% dancing and 40% karaoke." },
    ],
    relatedThemes: [
      { emoji: "🌟", name: "Glow Party",   slug: "glow-party"  },
      { emoji: "📣", name: "Cheerleading", slug: "cheerleading"},
      { emoji: "🎸", name: "Teen Party",   slug: "teens"       },
      { emoji: "💃", name: "Dance Class",  slug: "gymnastics"  },
    ],
  },

  // ─── TWINS ─────────────────────────────────────────────────────────────────
  twins: {
    slug: "twins",
    emoji: "👯",
    name: "Twins Birthday Party",
    tagline: "Double the birthday, double the fun — twice the everything",
    color: "from-violet-400 to-fuchsia-500",
    lightColor: "bg-violet-50",
    accentColor: "text-violet-600",
    borderColor: "border-violet-200",
    btnColor: "bg-violet-500 hover:bg-violet-600",
    ageRange: "Any age",
    avgCost: "$150–$500",
    guestCount: "15–40 guests",
    planningTime: "4–6 weeks",
    description: "Twins parties are a wonderful planning challenge — how do you celebrate two distinct individuals while creating one cohesive party? The best approach: a shared color palette but each twin has their own signature color, their own smash/birthday cake, and their own cake-blowing moment. Two is always better than one.",
    tags: ["Milestone", "Indoor", "Two Themes", "Celebration", "Family-Friendly"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose: matching theme vs. complementary split theme", "Assign each twin a signature color", "Order two separate cakes (or one divided cake)", "Send 'Double Trouble' or '2 peas in a pod' invitations"] },
      { category: "2–4 Weeks Before", items: ["Plan two simultaneous cake reveal moments", "Buy matching-but-different outfits for the twins", "Confirm two separate sets of candles and 'Happy Birthday' songs", "Plan group photo with both birthday children featured equally"] },
      { category: "1 Week Before", items: ["Set up two separate but connected birthday areas", "Prep two gift opening stations if doing combined gifts", "Create two equal-sized 'birthday child' display areas", "Assign a dedicated adult to photograph each twin"] },
      { category: "Day Of", items: ["Celebrate each twin individually before doing joint moments", "Do separate candle-blowing moments — one each", "Make sure each twin opens an equal number of gifts", "End with a combined 'double birthday' photo moment"] },
    ],
    decorIdeas: [
      { emoji: "👯", title: "Dual Color Scheme",          desc: "Twin A gets one color, Twin B gets another — both throughout" },
      { emoji: "2️⃣", title: "'TWO' Balloon Letters",      desc: "Giant balloon '2' or 'TWO' with each half in twin's color" },
      { emoji: "🪞", title: "Mirror Image Displays",       desc: "Symmetrical table layouts with each side in a twin's color" },
      { emoji: "⚖️", title: "Balance Scale Centerpiece",  desc: "Fun symbolic scale centerpiece showing 'equal birthday kids'" },
      { emoji: "🎀", title: "Matching-but-Different Bows",desc: "Same style bow in each twin's signature color on their chair" },
      { emoji: "📸", title: "Side-by-Side Photo Display", desc: "Monthly twin photo display showing both babies growing together" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Two Separate Cakes",          desc: "Each twin gets their own cake in their own colors and theme" },
      { emoji: "🎂", name: "One Split Cake Option",       desc: "One large cake divided down the middle in each twin's colors" },
      { emoji: "🍭", name: "Two-Flavor Cookie Platter",   desc: "Half the cookies in flavor A, half in flavor B — guests choose" },
      { emoji: "🥤", name: "Twin Punch Colors",           desc: "Two punch bowls in each twin's color at opposite table ends" },
      { emoji: "🧁", name: "Cupcake Split Tower",         desc: "Cupcake tower alternating between each twin's colors" },
      { emoji: "🍓", name: "Double Fruit Platter",        desc: "Fruit arranged in two side-by-side color coordinated halves" },
    ],
    activities: [
      { emoji: "👯", title: "Twin Trivia Game",            desc: "Guests answer 'Who does this belong to?' twin fact questions" },
      { emoji: "🎯", title: "Team Twin Challenge",         desc: "Party splits into two teams, each representing a birthday twin" },
      { emoji: "📸", title: "Synchronized Photo Booth",   desc: "Twins pose together then separately — capture both dynamics" },
      { emoji: "🎂", title: "Dual Cake Smash (if babies)",desc: "Side-by-side smash cakes for baby twins — two separate moments" },
      { emoji: "🌟", title: "Individual Spotlight Moment",desc: "Each twin gets a 2-minute solo spotlight: facts, favorites, video" },
      { emoji: "🎁", title: "Organized Gift Opening",     desc: "Alternate gift opening so each twin gets equal screen time" },
    ],
    vendors: [
      { id: 1, emoji: "📸", name: "Twin Lens Photography",    address: "Safety Harbor + travel",     distance: "Local",   rating: 5.0, reviews: 47,  open: true,  price: "From $400", bg: "from-violet-100 to-fuchsia-50"},
      { id: 2, emoji: "🎂", name: "Double Celebration Cakes", address: "340 Main St, Dunedin",       distance: "6.1 mi",  rating: 4.9, reviews: 58,  open: false, price: "From $150", bg: "from-fuchsia-100 to-violet-50"},
      { id: 3, emoji: "🎈", name: "Double Balloon Bar",       address: "200 Main St, Clearwater",    distance: "5.0 mi",  rating: 4.8, reviews: 33,  open: true,  price: "From $99",  bg: "from-violet-100 to-purple-50" },
      { id: 4, emoji: "🌟", name: "Two for Two Party Supply", address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.6, reviews: 22,  open: true,  price: "From $55",  bg: "from-fuchsia-100 to-pink-50"  },
    ],
    faqs: [
      { q: "Should twins share a party or have separate ones?", a: "Shared party until about age 7 is standard — logistics and friend groups overlap. From age 8–10, consider asking each twin what they prefer. By teen years, separate parties if they want them is perfectly appropriate." },
      { q: "How do I give each twin equal celebration?",        a: "Equal number of candles blown, equal gift-opening time, equal solo spotlight moments, equal space in the photo display. If in doubt, duplicate: two cakes, two banners, two photo stations." },
      { q: "What if twins want completely different themes?",   a: "A split theme absolutely works — one side of the party space per theme, bridged by a shared color element (gold, white, or black). It reads as creative, not chaotic." },
      { q: "Should they wear matching outfits?",               a: "Matching-but-different (same style, different colors) photographs beautifully and lets each twin have their own identity. Fully identical is sweet for very young twins. Completely different is totally fine too." },
      { q: "How do you handle gift-giving fairly?",            a: "Communicate clearly on the invitation: 'Please bring one gift per child' or 'Joint gifts welcome.' Some families do a gift table system where gifts are pre-labeled for each twin before opening begins." },
    ],
    relatedThemes: [
      { emoji: "🎂", name: "1st Birthday", slug: "first-birthday"},
      { emoji: "🦄", name: "Unicorn Party",slug: "unicorn"       },
      { emoji: "🌟", name: "Glow Party",   slug: "glow-party"    },
      { emoji: "🧸", name: "Toddler Party",slug: "toddler"       },
    ],
  },

  // ─── FIESTA ────────────────────────────────────────────────────────────────
  fiesta: {
    slug: "fiesta",
    emoji: "🪅",
    name: "Fiesta Birthday Party",
    tagline: "¡Feliz cumpleaños! — colorful, loud & full of pure joy",
    color: "from-red-500 to-orange-500",
    lightColor: "bg-red-50",
    accentColor: "text-red-600",
    borderColor: "border-red-200",
    btnColor: "bg-red-500 hover:bg-red-600",
    ageRange: "Ages 3–14",
    avgCost: "$100–$400",
    guestCount: "10–35 kids",
    planningTime: "2–3 weeks",
    description: "Fiesta parties are a riot of color, music, and Mexican culture — papel picado banners, piñatas, mariachi music, and enough guacamole to fill a swimming pool. One of the most visually stunning themes you can create and incredibly budget-friendly. The piñata alone is worth every penny — pure chaos, pure joy.",
    tags: ["Cultural", "Outdoor", "All Genders", "Colorful", "Piñata Required"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose: authentic Mexican fiesta vs. Cinco de Mayo style", "Book outdoor space or plan home setup", "Send papel picado or maracas invitations"] },
      { category: "2–4 Weeks Before", items: ["Order custom piñata or make one", "Buy sombrero and maracas favors", "Order churro or tres leches cake", "Collect colorful tissue paper for decor"] },
      { category: "1 Week Before", items: ["Hang papel picado banners", "Fill piñata with candy", "Set up taco bar supplies", "Prep maracas goody bags"] },
      { category: "Day Of", items: ["Greet guests with a sombrero at the door", "Start with music immediately — set the mood", "Run piñata before cake so kids have energy", "Award best dancer at the closing ceremony"] },
    ],
    decorIdeas: [
      { emoji: "🪅", title: "Papel Picado Banners",       desc: "Colorful perforated paper banners — the most iconic fiesta element" },
      { emoji: "🌺", title: "Marigold Centerpieces",       desc: "Bright orange marigold arrangements in terracotta pots" },
      { emoji: "🌈", title: "Tissue Paper Flower Garland",desc: "Giant tissue paper flowers in every color strung together" },
      { emoji: "🎊", title: "Fringe Backdrop",             desc: "Multi-color fringe curtain backdrop for the cake and photo area" },
      { emoji: "🪴", title: "Cactus Table Accents",       desc: "Mini cactus plants on tables with colorful ribbon ties" },
      { emoji: "🎨", title: "Serape Table Runners",        desc: "Striped serape blanket runners on every table" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Tres Leches Birthday Cake",   desc: "Traditional tres leches or churro-inspired layered cake" },
      { emoji: "🌮", name: "Taco Bar Station",             desc: "Build-your-own taco bar — kids customize every element" },
      { emoji: "🥑", name: "Fresh Guacamole Station",     desc: "Made-to-order guac with chips — always disappears fastest" },
      { emoji: "🍹", name: "Virgin Margarita Punch",      desc: "Lime and mango mocktail in a salt-rimmed pitcher with straws" },
      { emoji: "🍭", name: "Dulce Candy Bar",              desc: "Traditional Mexican candies: tamarind, mazapán, pulparindo" },
      { emoji: "🌽", name: "Elote Street Corn",           desc: "Mini corn on cob with mayo, cotija, lime, and chili — delicious" },
    ],
    activities: [
      { emoji: "🪅", title: "Piñata",                     desc: "The undisputed star of every fiesta — classic seven-point star shape" },
      { emoji: "💃", title: "Salsa Dance Lesson",         desc: "5-minute basic salsa lesson then free dance — everyone participates" },
      { emoji: "🎨", title: "Maracas Decorating Craft",   desc: "Decorate plain paper maracas with paint and stickers to take home" },
      { emoji: "🎯", title: "Bean Bag Sombrero Toss",     desc: "Toss bean bags into oversized sombrero targets for points" },
      { emoji: "🏆", title: "Best Dancer Award",          desc: "Kids vote for the best dancer — winner gets a fiesta crown" },
      { emoji: "📸", title: "Sombrero Photo Booth",       desc: "Giant sombreros, maracas, and serape backdrop for photos" },
    ],
    vendors: [
      { id: 1, emoji: "🪅", name: "Fiesta Party Tampa",        address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.8, reviews: 71,  open: true,  price: "From $199",       bg: "from-red-100 to-orange-50"   },
      { id: 2, emoji: "🌮", name: "Taco Truck Party Catering", address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.9, reviews: 144, open: true,  price: "From $10/person", bg: "from-orange-100 to-red-50"   },
      { id: 3, emoji: "🎂", name: "La Dulce Cake Studio",      address: "340 Main St, Dunedin",       distance: "6.1 mi",  rating: 5.0, reviews: 38,  open: false, price: "From $85",        bg: "from-red-100 to-pink-50"     },
      { id: 4, emoji: "🎊", name: "Colorful Event Rentals",    address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.7, reviews: 25,  open: true,  price: "From $99",        bg: "from-orange-100 to-yellow-50"},
    ],
    faqs: [
      { q: "How do you run a piñata safely?",           a: "Use a rope system that lets an adult control the piñata's height and movement. Give each child 3 swings max. Have all other kids stand at least 6 feet behind a marked line. Collect candy after as a group." },
      { q: "What style of piñata is best for kids?",   a: "The classic seven-pointed star piñata is traditional and works for all ages. Pull-string piñatas (no hitting) are safer for toddlers and mixed-age groups. Character piñatas are fun for themed parties." },
      { q: "Is a fiesta party culturally appropriate?",a: "A respectful fiesta party that celebrates Mexican culture with authentic elements (real food, papel picado, traditional music) is a wonderful way to share cultural appreciation. Avoid stereotypes and costumes that mock rather than celebrate." },
      { q: "Does this work for non-Hispanic kids?",    a: "Absolutely — the fiesta theme is universally beloved for its color, food, and energy. It's one of the most crowd-pleasing themes for any family background." },
      { q: "What's the best fiesta party budget tip?", a: "Papel picado banners and tissue paper flowers are incredibly cheap (under $20 total) and create the most visual impact. A piñata under $30 provides 20 minutes of pure party chaos. Best ROI in party planning." },
    ],
    relatedThemes: [
      { emoji: "🌺", name: "Luau Party",   slug: "luau"       },
      { emoji: "💃", name: "Music & Dance",slug: "music-dance"},
      { emoji: "⚽", name: "Sports Party", slug: "sports"     },
      { emoji: "🧁", name: "Baking Party", slug: "baking"     },
    ],
  },

  // ─── FORTNITE ──────────────────────────────────────────────────────────────
  fortnite: {
    slug: "fortnite",
    emoji: "🎯",
    name: "Fortnite Birthday Party",
    tagline: "Victory Royale — the ultimate Fortnite birthday battle pass",
    color: "from-blue-500 to-purple-700",
    lightColor: "bg-blue-50",
    accentColor: "text-blue-600",
    borderColor: "border-blue-200",
    btnColor: "bg-blue-600 hover:bg-blue-700",
    ageRange: "Ages 7–14",
    avgCost: "$150–$450",
    guestCount: "8–20 kids",
    planningTime: "2–4 weeks",
    description: "Fortnite parties are the #1 request from kids 8–12 right now. Storm circles, supply drops, Victory Royale moments, and loot llamas make this theme incredibly rich. You don't need screens at all — the best Fortnite parties turn the whole backyard into a battle royale with Nerf guns, foam axes, and mission-style games. Drop in. Build up. Win.",
    tags: ["Gaming", "Active", "Outdoor-Friendly", "Boys", "Battle Royale"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose: indoor gaming party vs. outdoor battle royale", "Book gaming truck or plan backyard battle setup", "Send 'Battle Pass Invitation' styled like a Fortnite card"] },
      { category: "2–4 Weeks Before", items: ["Order Fortnite cake with llama or Victory Royale topper", "Buy Nerf guns for outdoor battle (or rent from party co.)", "Order foam pickaxes and inflatable llamas as decor/prizes", "Plan storm circle game mechanics"] },
      { category: "1 Week Before", items: ["Set up supply drop stations around the yard", "Print player cards assigning each guest a Fortnite skin name", "Prep 'Battle Pass' goody bags with loot", "Create a 'Storm Circle' timer prop"] },
      { category: "Day Of", items: ["Welcome kids as 'Operators' with their skin name cards", "Brief everyone on the outdoor battle rules", "Run 3 rounds of storm circle Nerf battle", "Award Victory Royale trophy to final team standing"] },
    ],
    decorIdeas: [
      { emoji: "🦙", title: "Loot Llama Centerpiece",    desc: "Giant inflatable loot llama as the hero table centerpiece" },
      { emoji: "🔵", title: "Storm Circle Floor Tape",   desc: "Blue tape on the floor/lawn marking the shrinking storm zone" },
      { emoji: "🎯", title: "Supply Drop Boxes",          desc: "Blue and yellow cardboard supply drop crates as decor and game props" },
      { emoji: "🌀", title: "Blue & Purple Color Scheme",desc: "Fortnite's iconic storm colors through all balloons and tablecloths" },
      { emoji: "🏆", title: "Victory Royale Banner",      desc: "Gold 'Victory Royale' banner above the cake table" },
      { emoji: "⛏️", title: "Foam Pickaxe Props",         desc: "Foam pickaxes displayed at the entrance and used as photo props" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Victory Royale Cake",        desc: "Blue and gold cake with fondant llama, pickaxe, and '#1' topper" },
      { emoji: "🦙", name: "Loot Llama Pinata Cake Pops",desc: "Rainbow cake pops decorated as multicolor llamas" },
      { emoji: "🍕", name: "Supply Drop Pizza Boxes",    desc: "Pizza in boxes labeled 'Supply Drop — Open Immediately'" },
      { emoji: "🥤", name: "Shield Potion Punch",        desc: "Blue Gatorade in clear cups labeled 'Shield Potion — 50HP'" },
      { emoji: "🍭", name: "Chug Jug Candy Jars",        desc: "Gold-labeled mason jars filled with candy labeled 'Chug Jug'" },
      { emoji: "🧁", name: "Slurp Juice Cupcakes",       desc: "Teal frosted cupcakes with edible 'HP+' topper decorations" },
    ],
    activities: [
      { emoji: "🔫", title: "Backyard Battle Royale",    desc: "Nerf gun storm circle — last team standing wins Victory Royale" },
      { emoji: "⛏️", title: "Build Challenge",           desc: "Teams use cardboard to build the tallest 'fort' in 5 minutes" },
      { emoji: "🦙", title: "Llama Piñata",              desc: "Loot llama piñata stuffed with V-Bucks candy coins and prizes" },
      { emoji: "🎯", title: "Supply Drop Hunt",          desc: "Hidden supply drop boxes around the yard — find the most loot" },
      { emoji: "🎮", title: "Fortnite Tournament",       desc: "Gaming setup with Fortnite tournament if doing an indoor party" },
      { emoji: "🏆", title: "Victory Royale Ceremony",   desc: "Winner does the floss dance on the 'Victory Royale' podium" },
    ],
    vendors: [
      { id: 1, emoji: "🚌", name: "Level Up Gaming Truck", address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.9, reviews: 112, open: true,  price: "From $399", bg: "from-blue-100 to-indigo-50"  },
      { id: 2, emoji: "🔫", name: "Nerf War Party Co.",    address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.8, reviews: 77,  open: true,  price: "From $249", bg: "from-purple-100 to-blue-50"  },
      { id: 3, emoji: "🎂", name: "Victory Cakes Tampa",   address: "210 Main St, Clearwater",    distance: "5.2 mi",  rating: 5.0, reviews: 41,  open: false, price: "From $95",  bg: "from-blue-100 to-purple-50"  },
      { id: 4, emoji: "🦙", name: "Gamer Party Supply",    address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.7, reviews: 29,  open: true,  price: "From $55",  bg: "from-indigo-100 to-blue-50"  },
    ],
    faqs: [
      { q: "Can I run a Fortnite party without actual video games?", a: "Absolutely — and many of the best ones do. The outdoor battle royale with Nerf guns, storm circle mechanics, and supply drop hunts captures the exact feel of the game without screens. Kids go wild for it." },
      { q: "What age is Fortnite party best for?",                   a: "7–14 is the sweet spot, with 9–12 being peak Fortnite obsession age. Check with parents about Fortnite's T rating (Teen) — some families prefer the outdoor battle version for younger kids." },
      { q: "How do you run the storm circle Nerf game?",             a: "Mark a large circle with rope or tape. Every 5 minutes, shrink the boundary by moving the rope in. Players hit by Nerf darts are 'eliminated.' Last player or team in the safe zone wins. Simple, epic, and replayable." },
      { q: "What's the loot llama piñata?",                         a: "A rainbow-colored donkey or llama piñata that, when broken, rains candy 'loot' like the in-game loot llamas. Buy a plain llama piñata and decorate it with colorful tissue paper squares — about $20 total." },
      { q: "What Fortnite skin should the birthday child be?",      a: "Let the birthday child pick their favorite skin as their 'character name' for the party. Print a player card with their skin art (fan art is fine for private use). Other guests get assigned skins on arrival." },
    ],
    relatedThemes: [
      { emoji: "🎮", name: "Gaming Party",  slug: "gaming"      },
      { emoji: "🦸", name: "Superhero",     slug: "superheroes" },
      { emoji: "🥷", name: "Ninja Warrior", slug: "ninja"       },
      { emoji: "🌟", name: "Glow Party",    slug: "glow-party"  },
    ],
  },

  // ─── KARATE KID ────────────────────────────────────────────────────────────
  "karate-kid": {
    slug: "karate-kid",
    emoji: "🥋",
    name: "Karate & Martial Arts Birthday Party",
    tagline: "Wax on, wax off — discipline, focus & birthday kicks",
    color: "from-red-600 to-orange-600",
    lightColor: "bg-red-50",
    accentColor: "text-red-700",
    borderColor: "border-red-200",
    btnColor: "bg-red-600 hover:bg-red-700",
    ageRange: "Ages 5–14",
    avgCost: "$175–$450",
    guestCount: "8–20 kids",
    planningTime: "2–4 weeks",
    description: "Karate Kid parties channel the spirit of Cobra Kai and The Karate Kid — discipline, respect, and powerful moves wrapped in birthday fun. Kids earn their belt, learn real beginner karate moves from a sensei (or very prepared parent), and compete in a tournament. The dojo aesthetic with rising sun imagery and karate belts transforms any space into a martial arts academy.",
    tags: ["Active", "Martial Arts", "All Genders", "Discipline", "Tournament-Style"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Book a local karate sensei for 45-min party instruction", "Choose: Karate Kid classic vs. Cobra Kai vs. generic dojo theme", "Send 'You've Been Challenged to a Duel' invitations"] },
      { category: "2–4 Weeks Before", items: ["Order karate gi (white uniform) favors for each guest", "Plan beginner kata and board breaking activity", "Order karate belt cake topper", "Buy foam boards for safe breaking demonstration"] },
      { category: "1 Week Before", items: ["Set up dojo entrance with Japanese lanterns", "Prep colored belt rank certificates for each guest", "Assemble belt & gi goody bags", "Practice the opening bow-in ceremony"] },
      { category: "Day Of", items: ["Open with a formal bow-in ceremony — sets the tone", "Sensei teaches 3 basic moves the whole group learns", "Run the foam board breaking station", "Close with belt ceremony and group photo in fighting stance"] },
    ],
    decorIdeas: [
      { emoji: "🌅", title: "Rising Sun Backdrop",         desc: "Red and white rising sun as the main photo wall backdrop" },
      { emoji: "🏮", title: "Japanese Lanterns",            desc: "Red and black paper lanterns strung throughout the space" },
      { emoji: "🥋", title: "Karate Belt Garland",         desc: "Colored karate belts (white through black) strung as garland" },
      { emoji: "🎋", title: "Bamboo & Dojo Signs",         desc: "Bamboo accents and handwritten Japanese-style dojo name signs" },
      { emoji: "⛩️", title: "Torii Gate Entrance",         desc: "Cardboard torii gate painted red marking the dojo entrance" },
      { emoji: "🏆", title: "Tournament Bracket Display",  desc: "Printed tournament bracket on poster board at the main table" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Black Belt Birthday Cake",     desc: "White cake with black fondant belt and gold buckle across the middle" },
      { emoji: "🍱", name: "Bento Box Lunch",             desc: "Individual bento boxes with sushi rice, veggies, and protein" },
      { emoji: "🥢", name: "Dragon Roll Sushi Platter",   desc: "California rolls and cucumber rolls for adventurous kids" },
      { emoji: "🥤", name: "Sensei's Secret Punch",       desc: "Green tea lemonade with mint — 'the energy of a black belt'" },
      { emoji: "🍡", name: "Mochi Ice Cream Bar",         desc: "Assorted mochi in red and white wrappers displayed on bamboo tray" },
      { emoji: "🍭", name: "Yin-Yang Cookies",             desc: "Black and white swirl icing on round shortbread cookies" },
    ],
    activities: [
      { emoji: "🥋", title: "Sensei-Led Karate Lesson",   desc: "Certified sensei teaches bow, stance, block, punch, and kick" },
      { emoji: "🪵", title: "Foam Board Breaking",        desc: "Every child breaks a foam board with their palm — huge confidence moment" },
      { emoji: "🎯", title: "Target Kick & Punch Pads",   desc: "Kids take turns kicking and punching held foam pads for accuracy" },
      { emoji: "🏆", title: "Kata Tournament",            desc: "Each child performs their best karate form, judged on focus and form" },
      { emoji: "🥋", title: "Belt Ceremony",              desc: "Each guest receives a colored belt and certificate at the closing" },
      { emoji: "📸", title: "Fighting Stance Group Photo",desc: "Everyone in their gi in a synchronized fighting stance — epic photo" },
    ],
    vendors: [
      { id: 1, emoji: "🥋", name: "Tampa Bay Karate Academy", address: "500 Main St, Clearwater",    distance: "5.8 mi",  rating: 5.0, reviews: 88,  open: true,  price: "From $299",   bg: "from-red-100 to-orange-50"  },
      { id: 2, emoji: "🏯", name: "Dojo Party Events Mobile", address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.9, reviews: 54,  open: true,  price: "From $249",   bg: "from-orange-100 to-red-50"  },
      { id: 3, emoji: "🎂", name: "Black Belt Cakes",         address: "210 Main St, Clearwater",    distance: "5.2 mi",  rating: 4.8, reviews: 28,  open: false, price: "From $90",    bg: "from-red-100 to-rose-50"    },
      { id: 4, emoji: "🎽", name: "Gi & Belt Party Supply",   address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.7, reviews: 21,  open: true,  price: "From $15/gi", bg: "from-orange-100 to-red-50"  },
    ],
    faqs: [
      { q: "Do we need a real sensei?",                    a: "For the best experience, yes — a certified instructor who teaches kids for 30–45 minutes is transformative. Many local dojos offer birthday party packages for $150–$250. Alternatively, a parent with any martial arts background can lead basics." },
      { q: "Is foam board breaking safe for kids?",        a: "Absolutely — foam boards are designed to break easily with proper technique. A sensei will teach the correct palm strike or kick. Kids as young as 5 can break foam boards successfully. No pine boards until age 10+ with training." },
      { q: "Karate Kid classic or Cobra Kai theme?",      a: "Cobra Kai is the current cultural moment — kids 8–14 know it well. Classic Karate Kid resonates better with parents and age 5–7 kids. A 'Dojo' generic theme bridges both beautifully." },
      { q: "What belt does everyone earn?",               a: "All guests earn a 'white belt with one stripe' certificate — signifying they completed their first lesson. The birthday child gets a special 'Guest of Honor' belt in their favorite color." },
      { q: "Can girls love a karate party?",              a: "100% — martial arts is completely gender-neutral, and girls are often the most focused students in a lesson. Frame it as 'strength, confidence, and focus' rather than fighting and it resonates powerfully with all kids." },
    ],
    relatedThemes: [
      { emoji: "🥷", name: "Ninja Warrior", slug: "ninja"       },
      { emoji: "🦸", name: "Superhero",     slug: "superheroes" },
      { emoji: "⚽", name: "Sports Party",  slug: "sports"      },
      { emoji: "🎮", name: "Gaming Party",  slug: "gaming"      },
    ],
  },

  // ─── BLAZE ─────────────────────────────────────────────────────────────────
  blaze: {
    slug: "blaze",
    emoji: "🚒",
    name: "Blaze & the Monster Machines Party",
    tagline: "Blazing fast, blazing fun — let's blaze!",
    color: "from-red-500 to-orange-500",
    lightColor: "bg-red-50",
    accentColor: "text-red-600",
    borderColor: "border-red-200",
    btnColor: "bg-red-500 hover:bg-red-600",
    ageRange: "Ages 2–6",
    avgCost: "$100–$300",
    guestCount: "8–20 kids",
    planningTime: "2–3 weeks",
    description: "Blaze and the Monster Machines parties are a toddler and preschooler's dream — giant colorful monster trucks, flames, racing, and the lovable Blaze himself. This Nickelodeon show combines vehicles with STEM concepts, making it a parent-approved obsession. Easy to execute with red, orange, and black color scheme plus big bold monster truck decor.",
    tags: ["Toddler", "Preschool", "Indoor", "Trucks", "Nickelodeon"],
    checklist: [
      { category: "4–6 Weeks Before", items: ["Order Blaze birthday banner and character decorations", "Plan simple vehicle race activities", "Send monster truck tire-track invitation"] },
      { category: "2–3 Weeks Before", items: ["Order Blaze character cake or monster truck cake", "Buy Blaze toy favor trucks for each guest", "Set up cardboard box monster truck course", "Buy red, orange, black balloons"] },
      { category: "1 Week Before", items: ["Inflate tires decoration — use black balloons", "Make flame tissue paper centerpieces", "Assemble Blaze toy goody bags", "Set up tire-track floor decor with black tape"] },
      { category: "Day Of", items: ["Play the Blaze theme song as kids arrive", "Set up toy truck free play area", "Run the cardboard box obstacle race", "Serve cake before kids get too tired — keep it short"] },
    ],
    decorIdeas: [
      { emoji: "🔴", title: "Red & Orange Balloon Arch",  desc: "Blaze's classic red and orange colors in a big balloon arch" },
      { emoji: "🔥", title: "Flame Tissue Centerpieces",  desc: "Orange and yellow tissue paper flames rising from black pots" },
      { emoji: "⚫", title: "Giant Tire Balloons",         desc: "Black balloon 'tires' clustered at the entrance" },
      { emoji: "🏁", title: "Checkered Race Flag Banner", desc: "Black and white checkered bunting around the party space" },
      { emoji: "🚒", title: "Monster Truck Table Runners",desc: "Blaze and monster truck printed fabric as table runners" },
      { emoji: "⚡", title: "Lightning Bolt Confetti",    desc: "Gold lightning bolt confetti scattered on all tables" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Blaze Monster Truck Cake",    desc: "Red and orange cake with fondant Blaze truck on top" },
      { emoji: "🔥", name: "Flame Hot Dogs",              desc: "Hot dogs with a zigzag of ketchup as 'flames' on top" },
      { emoji: "🧡", name: "Orange Slices 'Fuel'",        desc: "Orange slices labeled 'Monster Machine Fuel' on a tray" },
      { emoji: "🥤", name: "Blazing Red Punch",           desc: "Fruit punch in clear cups with flame straw toppers" },
      { emoji: "🍭", name: "Checkered Flag Cookies",      desc: "Black and white checkered icing on square sugar cookies" },
      { emoji: "🧁", name: "Monster Truck Cupcakes",      desc: "Cupcakes with toy Blaze trucks pressed into the frosting" },
    ],
    activities: [
      { emoji: "🚒", title: "Cardboard Box Monster Truck Race", desc: "Kids sit in decorated boxes and 'drive' them across the room" },
      { emoji: "🏁", title: "Toy Truck Race Track",       desc: "Set up a toy track for kids to race their own mini trucks" },
      { emoji: "🎯", title: "Tire Toss Ring Game",        desc: "Toss hula hoop 'tires' onto cone targets for points" },
      { emoji: "🔥", title: "Blaze Obstacle Course",      desc: "Low crawl tunnels and balance beams styled as a monster truck track" },
      { emoji: "🎨", title: "Decorate Your Monster Truck",desc: "Kids color and decorate a printable monster truck sheet" },
      { emoji: "📸", title: "Monster Truck Photo Booth",  desc: "Cardboard Blaze truck frame kids sit in for photos" },
    ],
    vendors: [
      { id: 1, emoji: "🚒", name: "Monster Truck Party Tampa", address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 4.8, reviews: 44,  open: true,  price: "From $199", bg: "from-red-100 to-orange-50"   },
      { id: 2, emoji: "🎪", name: "Toddler Fun Zone Rentals",  address: "500 Main St, Clearwater",    distance: "5.8 mi",  rating: 4.7, reviews: 61,  open: true,  price: "From $149", bg: "from-orange-100 to-red-50"   },
      { id: 3, emoji: "🎂", name: "Blaze Birthday Cake Studio",address: "101 Main St, Safety Harbor", distance: "1.2 mi",  rating: 4.9, reviews: 33,  open: false, price: "From $75",  bg: "from-red-100 to-rose-50"     },
      { id: 4, emoji: "🚒", name: "Nickelodeon Party Supply",  address: "Ships to you",               distance: "Online",  rating: 4.6, reviews: 88,  open: true,  price: "From $25",  bg: "from-orange-100 to-yellow-50"},
    ],
    faqs: [
      { q: "What age is Blaze best for?",                  a: "2–5 is the absolute sweet spot. Blaze is a Nickelodeon Jr. show targeted at preschoolers who are obsessed with trucks and vehicles. By age 6–7, most kids have moved on to other franchises." },
      { q: "Can I get a Blaze character appearance?",      a: "Licensed character appearances (real costumed Blaze) are rare and expensive. Most Blaze parties use character decorations, balloons, and a character-printed cake instead. Focus on the monster truck theme over the specific character." },
      { q: "What are the best Blaze party favors?",       a: "A small Blaze die-cast toy truck ($5–8) is the ultimate take-home. Blaze character sticker sheets, mini racing car sets, and checkered flag bandanas are all great budget options." },
      { q: "Does this theme work for girls?",              a: "Trucks and vehicles are for everyone — don't let anyone tell you otherwise. Many girls are deeply into Blaze. Keep the color scheme bold (red, orange) and let every child choose their favorite Monster Machine character." },
      { q: "What's the STEM connection I can lean into?", a: "Blaze teaches physics, engineering, and problem-solving in every episode. For a STEM spin, add a 'ramp physics' activity where kids test toy trucks on ramps of different angles. Parents love this angle." },
    ],
    relatedThemes: [
      { emoji: "🦕", name: "Dino Party",     slug: "dinosaurs" },
      { emoji: "🧸", name: "Toddler Party",  slug: "toddler"   },
      { emoji: "⚽", name: "Sports Party",   slug: "sports"    },
      { emoji: "🔬", name: "Science & STEM", slug: "science"   },
    ],
  },

  // ─── STAR WARS ─────────────────────────────────────────────────────────────
  "star-wars": {
    slug: "star-wars",
    emoji: "⚔️",
    name: "Star Wars Birthday Party",
    tagline: "May the birthday be with you — always",
    color: "from-slate-800 to-gray-900",
    lightColor: "bg-slate-50",
    accentColor: "text-yellow-500",
    borderColor: "border-yellow-400",
    btnColor: "bg-yellow-500 hover:bg-yellow-600",
    ageRange: "Ages 4–14",
    avgCost: "$150–$500",
    guestCount: "8–25 kids",
    planningTime: "3–5 weeks",
    description: "Star Wars parties are timeless — spanning generations, this is one of the most universally loved themes in party history. Jedi training academies, lightsaber battles, the Force, and iconic characters make every element easy to plan. Dark backgrounds with neon lightsaber colors create a stunning atmosphere, and every child becomes a padawan learner on the path to becoming a Jedi Knight.",
    tags: ["Sci-Fi", "Adventure", "All Genders", "Multi-Generation", "Lightsabers"],
    checklist: [
      { category: "6–8 Weeks Before", items: ["Choose: light side vs. dark side vs. Mandalorian vs. all-universe", "Order lightsaber favor toys for every guest", "Send 'Jedi Academy Enrollment' scrolled invitations"] },
      { category: "2–4 Weeks Before", items: ["Order Death Star or BB-8 birthday cake", "Plan Jedi Training Academy obstacle course", "Buy black tablecloths and galaxy star projector", "Order 'padawan braid' headband favors"] },
      { category: "1 Week Before", items: ["Set up Jedi Academy entrance archway", "Print Padawan certificates for each guest", "Prep lightsaber fight instruction choreography", "Assemble Jedi robe goody bags"] },
      { category: "Day Of", items: ["Welcome guests as 'Padawans reporting for training'", "Run through Jedi Academy obstacles and training", "Do the official lightsaber duel showdown", "Close with Jedi Knighting ceremony and group photo"] },
    ],
    decorIdeas: [
      { emoji: "🌌", title: "Galaxy Backdrop",              desc: "Deep space star field backdrop — black fabric with silver star scatter" },
      { emoji: "⚔️", title: "Crossed Lightsaber Display",  desc: "Two crossed lightsabers (red vs. blue) as the hero decor piece" },
      { emoji: "⭐", title: "Star Field Ceiling",           desc: "Fiber optic or glow star ceiling for deep space atmosphere" },
      { emoji: "🟡", title: "Gold & Black Color Scheme",   desc: "Star Wars yellow, black, and silver throughout all decor" },
      { emoji: "🛸", title: "Millennium Falcon Centerpiece",desc: "Cardboard or toy Millennium Falcon as the table centerpiece" },
      { emoji: "🏛️", title: "Jedi Temple Entrance",        desc: "Stone-look cardboard pillars flanking the party entrance" },
    ],
    foodIdeas: [
      { emoji: "🎂", name: "Death Star Cake",              desc: "Gray sphere cake with laser dish detail and fondant Star Wars logo" },
      { emoji: "🟢", name: "Yoda Punch",                   desc: "Green lime sherbet punch — 'Yoda's wisdom in a cup'" },
      { emoji: "🍕", name: "Darth Vader Pizza",            desc: "Dark-crust pizza with olive 'Vader helmet' designs on each slice" },
      { emoji: "🍭", name: "Lightsaber Pretzel Rods",      desc: "Colored candy-dipped pretzel rods — red, blue, green, and purple" },
      { emoji: "🧁", name: "BB-8 Cupcakes",               desc: "Orange and white frosted cupcakes with candy antennae" },
      { emoji: "🥤", name: "Blue Milk Station",            desc: "Vanilla milk with blue food coloring — authentic to the films" },
    ],
    activities: [
      { emoji: "⚔️", title: "Jedi Training Academy",      desc: "Obstacle course: crawl under lasers, balance the Force, dodge blasters" },
      { emoji: "🔵", title: "Lightsaber Duel Tournament", desc: "Bracket-style foam lightsaber battles, judged on form and spirit" },
      { emoji: "🎯", title: "Destroy the Death Star",     desc: "Nerf blaster target practice at a Death Star-labeled target board" },
      { emoji: "🌌", title: "Build Your Lightsaber",      desc: "Assemble a custom foam lightsaber from parts — each one unique" },
      { emoji: "🧘", title: "Feel the Force Blindfold",   desc: "Blindfolded kids use 'the Force' to find hidden objects by sound" },
      { emoji: "🎓", title: "Jedi Knighting Ceremony",    desc: "Master taps each padawan's shoulders with a lightsaber, reads vow" },
    ],
    vendors: [
      { id: 1, emoji: "⚔️", name: "Jedi Academy Party Events", address: "Tampa Bay Area — mobile",    distance: "Travels", rating: 5.0, reviews: 91,  open: true,  price: "From $299",    bg: "from-slate-100 to-gray-50"   },
      { id: 2, emoji: "🌌", name: "Galaxy Party Rentals",       address: "500 N Dale Mabry, Tampa",    distance: "12 mi",   rating: 4.8, reviews: 63,  open: true,  price: "From $199",    bg: "from-gray-100 to-slate-50"   },
      { id: 3, emoji: "🎂", name: "The Dark Side Cake Co.",     address: "210 Main St, Clearwater",    distance: "5.2 mi",  rating: 4.9, reviews: 47,  open: false, price: "From $110",    bg: "from-slate-100 to-zinc-50"   },
      { id: 4, emoji: "⚔️", name: "Lightsaber Favor Shop",      address: "Ships to you",               distance: "Online",  rating: 4.8, reviews: 155, open: true,  price: "From $8/saber", bg: "from-yellow-100 to-slate-50" },
    ],
    faqs: [
      { q: "Which Star Wars era is best for the theme?",        a: "Original trilogy (Episodes 4–6) is universally recognized across all ages. Mandalorian is huge with ages 6–12 right now. Prequel trilogy is having a serious nostalgia comeback with older kids. When in doubt, go 'all-universe' and let kids pick their side." },
      { q: "How do you run Jedi Training Academy safely?",      a: "Use foam lightsabers (pool noodles work too). Set clear rules: no head shots, both fighters must agree to duel, adult referee for every match. A sensei figure (parent in Jedi robe) running the ceremony adds huge atmosphere." },
      { q: "Light side or dark side?",                          a: "Offer both — let kids choose their allegiance at arrival. Blue and green lightsabers for Jedi, red for Sith. The balance of both sides creates natural team dynamics for games." },
      { q: "What's the most memorable Star Wars party element?",a: "The Jedi Knighting ceremony at the end — where a 'Master Jedi' taps each child on the shoulders, says their Jedi name, and presents their Padawan certificate. Every single child remembers this moment." },
      { q: "Can you run this theme without Disney licensing?",  a: "Yes — focus on 'space academy' and 'lightsaber training' language rather than specific character names. Custom Jedi Academy branding, galaxy aesthetics, and lightsaber battles capture all the magic without requiring official licensed goods." },
    ],
    relatedThemes: [
      { emoji: "🚀", name: "Space Party", slug: "space"       },
      { emoji: "🦸", name: "Superhero",   slug: "superheroes" },
      { emoji: "🎮", name: "Gaming Party",slug: "gaming"      },
      { emoji: "🥷", name: "Ninja Warrior",slug: "ninja"      },
    ],
  },
};

// ─── Star Rating ─────────────────────────────────────────────────────────────
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

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ExploreThemePage() {
  const { slug } = useParams();
  const theme = THEME_DATA[slug] ?? THEME_DATA["gymnastics"];

  const [openFaq, setOpenFaq] = useState(null);
  const [saved, setSaved] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  const toggleSave  = (id)   => setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleCheck = (item) => setCheckedItems(p => p.includes(item) ? p.filter(x => x !== item) : [...p, item]);

  return (
    <div className="min-h-screen bg-pink-50">

      <Header />

      {/* Hero Banner */}
      <div className={`bg-gradient-to-br ${theme.color} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-5xl mx-auto px-6 py-16 relative z-10">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
            <Link to="/explore" className="hover:text-white transition-colors">Explore</Link>
            <span>›</span>
            <Link to="/explore" className="hover:text-white transition-colors">Themes</Link>
            <span>›</span>
            <span className="text-white">{theme.name}</span>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="text-7xl mb-4">{theme.emoji}</div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">{theme.name}</h1>
              <p className="text-white/80 text-lg max-w-xl">{theme.tagline}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {theme.tags.map(tag => (
                  <span key={tag} className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">{tag}</span>
                ))}
              </div>
            </div>
            {/* Quick stats */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 grid grid-cols-2 gap-4 shrink-0 min-w-[220px]">
              {[
                { label: "Age Range",   val: theme.ageRange     },
                { label: "Avg Cost",    val: theme.avgCost      },
                { label: "Guest Count", val: theme.guestCount   },
                { label: "Plan Ahead",  val: theme.planningTime },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-white/60 text-xs font-medium">{stat.label}</p>
                  <p className="text-white font-black text-sm">{stat.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* AI CTA */}
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 shadow-lg">
          <div>
            <p className="text-white font-black text-lg">✨ Let AI build your {theme.emoji} party plan</p>
            <p className="text-pink-100 text-sm">Full checklist, vendor shortlist, timeline & budget — in 60 seconds</p>
          </div>
          <Link to="/app"
            className="bg-white text-pink-500 font-black text-sm px-7 py-3 rounded-xl hover:bg-pink-50 transition-colors shadow whitespace-nowrap shrink-0">
            Build My Party Plan Free 🎉
          </Link>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl border border-gray-100 p-7 mb-8">
          <h2 className="text-2xl font-black text-gray-800 mb-3">About {theme.name}s</h2>
          <p className="text-gray-600 leading-relaxed">{theme.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {/* Decor Ideas */}
          <div className="bg-white rounded-2xl border border-gray-100 p-7">
            <h2 className="text-xl font-black text-gray-800 mb-5">🎨 Decoration Ideas</h2>
            <div className="space-y-4">
              {theme.decorIdeas.map(d => (
                <div key={d.title} className="flex gap-3">
                  <span className="text-2xl shrink-0">{d.emoji}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{d.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="bg-white rounded-2xl border border-gray-100 p-7">
            <h2 className="text-xl font-black text-gray-800 mb-5">🎯 Party Activities</h2>
            <div className="space-y-4">
              {theme.activities.map(a => (
                <div key={a.title} className="flex gap-3">
                  <span className="text-2xl shrink-0">{a.emoji}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{a.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Food Ideas */}
        <div className="bg-white rounded-2xl border border-gray-100 p-7 mb-12">
          <h2 className="text-xl font-black text-gray-800 mb-5">🍽️ Food & Cake Ideas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {theme.foodIdeas.map(f => (
              <div key={f.name} className={`${theme.lightColor} rounded-xl p-4`}>
                <span className="text-3xl block mb-2">{f.emoji}</span>
                <p className="font-bold text-gray-800 text-sm">{f.name}</p>
                <p className="text-gray-500 text-xs mt-1 leading-snug">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Planning Checklist */}
        <div className="bg-white rounded-2xl border border-gray-100 p-7 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-800">✅ Planning Checklist</h2>
            <span className="text-xs text-gray-400 font-medium">
              {checkedItems.length} of {theme.checklist.reduce((acc, g) => acc + g.items.length, 0)} done
            </span>
          </div>
          <div className="space-y-6">
            {theme.checklist.map(group => (
              <div key={group.category}>
                <p className={`text-xs font-bold tracking-widest uppercase ${theme.accentColor} mb-3`}>{group.category}</p>
                <div className="space-y-2">
                  {group.items.map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => toggleCheck(item)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                          checkedItems.includes(item)
                            ? "bg-pink-500 border-pink-500"
                            : "border-gray-300 group-hover:border-pink-300"
                        }`}
                      >
                        {checkedItems.includes(item) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-all ${checkedItems.includes(item) ? "line-through text-gray-400" : "text-gray-700"}`}>
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendors */}
        <div className="mb-12">
          <div className="flex justify-between items-baseline mb-5">
            <h2 className="text-2xl font-black text-gray-800">📍 Vendors Near You</h2>
            <Link to="/explore" className="text-sm font-semibold text-pink-500 hover:underline">See all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {theme.vendors.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.bg} flex items-center justify-center text-2xl shrink-0`}>{v.emoji}</div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm leading-tight">{v.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{v.address}</p>
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
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    {v.open
                      ? <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">● Open now</span>
                      : <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">● Closed</span>}
                    <span className="text-xs font-bold text-pink-500">{v.price}</span>
                  </div>
                  <button
                    onClick={() => toggleSave(v.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                      saved.includes(v.id) ? "border-pink-400 text-pink-500 bg-pink-50" : "border-gray-200 text-gray-400 hover:border-pink-300"
                    }`}
                  >
                    {saved.includes(v.id) ? "♥ Saved" : "♡ Save"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-gray-100 p-7 mb-12">
          <h2 className="text-xl font-black text-gray-800 mb-5">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {theme.faqs.map((faq, i) => (
              <div key={i} className={`border rounded-xl overflow-hidden transition-all ${openFaq === i ? theme.borderColor : "border-gray-100"}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center gap-4"
                >
                  <span className="font-semibold text-gray-800 text-sm">{faq.q}</span>
                  <span className={`text-lg transition-transform shrink-0 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className={`px-5 pb-4 text-sm text-gray-600 leading-relaxed ${theme.lightColor}`}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related Themes */}
        <div className="mb-4">
          <h2 className="text-xl font-black text-gray-800 mb-5">🎉 You Might Also Love</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {theme.relatedThemes.map(rt => (
              <Link key={rt.slug} to={`/explore/themes/${rt.slug}`}
                className="bg-white rounded-2xl p-4 text-center border border-gray-100 hover:border-pink-300 hover:-translate-y-1 hover:shadow-md transition-all block">
                <span className="text-3xl block mb-2">{rt.emoji}</span>
                <p className="text-sm font-bold text-gray-700">{rt.name}</p>
              </Link>
            ))}
          </div>
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
