// Party Zones — comprehensive organized checklist by area/zone
// Each zone has items with optional Amazon search terms and cost estimates

export const partyZones = [
  {
    id: 'arrival',
    emoji: '🚪',
    name: 'The Arrival & Entryway',
    color: 'blue',
    items: [
      { task: 'Welcome sign — personalized easel or "Party This Way" yard sign', searchTerms: 'birthday party welcome sign easel', estimatedCost: '$10-20', priority: 'high' },
      { task: 'Coat/bag management — dedicated rack, designated room, or labeled bins for backpacks', searchTerms: 'coat rack party storage bins', estimatedCost: '$10-25', priority: 'medium' },
      { task: 'Shoe solution — a large mat or bench if shoes-off household', searchTerms: 'shoe mat entryway bench', estimatedCost: '$10-20', priority: 'low' },
      { task: 'Gift/card drop table — a dedicated spot for parents to set down gifts', searchTerms: 'gift table sign birthday', estimatedCost: '$5-10', priority: 'medium' },
      { task: 'Sanitization station — hand sanitizer, tissues, and masks (just in case)', searchTerms: 'hand sanitizer dispenser party', estimatedCost: '$5-10', priority: 'low' },
    ],
  },
  {
    id: 'buffet',
    emoji: '🍔',
    name: 'Main Buffet & Dining',
    color: 'amber',
    items: [
      { task: 'Folding tables & table risers (for height/levels)', searchTerms: 'folding table party table risers', estimatedCost: '$20-60', priority: 'high' },
      { task: 'Enough chairs or floor cushions for guests', searchTerms: 'folding chairs party kids', estimatedCost: '$20-50', priority: 'high' },
      { task: 'Table linens — tablecloths, runners, and table clips (crucial for outdoor wind)', searchTerms: 'party tablecloth clips runners', estimatedCost: '$10-20', priority: 'medium' },
      { task: 'Large platters, tiered stands, and serving bowls', searchTerms: 'party platters tiered serving stands', estimatedCost: '$15-30', priority: 'medium' },
      { task: 'Tongs, scoops, and serving spoons for every dish', searchTerms: 'serving utensils tongs scoops party', estimatedCost: '$8-12', priority: 'high' },
      { task: 'Chafing dishes or slow cookers to keep food warm', searchTerms: 'chafing dish warming set party', estimatedCost: '$15-30', priority: 'medium' },
      { task: 'Ice tubs or chill platters for cold items', searchTerms: 'ice tub party serving cold', estimatedCost: '$10-20', priority: 'medium' },
      { task: 'Disposable tableware — dinner plates, dessert plates, forks, spoons, knives', searchTerms: 'party plates cups utensils set', estimatedCost: '$10-20', priority: 'high' },
      { task: 'Cocktail napkins AND dinner napkins', searchTerms: 'party napkins cocktail dinner', estimatedCost: '$5-10', priority: 'high' },
      { task: 'Food labels — themed tent cards with allergy icons (GF, DF, Nut-Free)', searchTerms: 'food label tent cards party allergy', estimatedCost: '$5-10', priority: 'low' },
    ],
  },
  {
    id: 'beverages',
    emoji: '🥤',
    name: 'Beverage Station',
    color: 'cyan',
    items: [
      { task: 'Drink dispensers for juice, lemonade, or water', searchTerms: 'drink dispenser party kids', estimatedCost: '$12-25', priority: 'high' },
      { task: 'Adult beverage option — wine, beer, or a signature cocktail for parents', searchTerms: '', estimatedCost: '$20-50', priority: 'low' },
      { task: 'ICE — get 3x more than you think (one bag for drinks, two for keeping things cold)', searchTerms: 'reusable ice packs cooler', estimatedCost: '$8-15', priority: 'high' },
      { task: 'Ice bucket & scoop — never let guests use their hands!', searchTerms: 'ice bucket scoop party', estimatedCost: '$10-15', priority: 'medium' },
      { task: 'Cups — plastic cups with a Sharpie nearby to write names, or themed juice boxes', searchTerms: 'party cups kids sharpie', estimatedCost: '$5-10', priority: 'high' },
      { task: 'Fun straws, lemon slices, or cocktail umbrellas', searchTerms: 'fun straws kids party umbrellas', estimatedCost: '$5-8', priority: 'low' },
      { task: 'Bottle opener / corkscrew — the most commonly forgotten item!', searchTerms: 'bottle opener corkscrew', estimatedCost: '$5-8', priority: 'medium' },
    ],
  },
  {
    id: 'cake',
    emoji: '🎂',
    name: 'Cake & Dessert Focal Point',
    color: 'pink',
    items: [
      { task: 'Cake stand — give the cake some "hero" height', searchTerms: 'cake stand birthday party', estimatedCost: '$10-20', priority: 'medium' },
      { task: 'Cake topper & candles (match the theme!)', searchTerms: 'birthday cake topper candles', estimatedCost: '$5-12', priority: 'high' },
      { task: 'Long-reach lighter — safety first for candle lighting', searchTerms: 'long reach lighter candle', estimatedCost: '$3-5', priority: 'high' },
      { task: 'Cut & serve kit — sharp knife, cake server, and a bowl of water for clean slices', searchTerms: 'cake knife server set', estimatedCost: '$8-12', priority: 'high' },
      { task: 'Individual grab-and-go treats — cupcakes, cookies, or cake pops', searchTerms: 'cupcake display stand party', estimatedCost: '$10-25', priority: 'medium' },
    ],
  },
  {
    id: 'activities',
    emoji: '🎨',
    name: 'Activities & Favors',
    color: 'violet',
    items: [
      { task: 'All supplies needed for your chosen activities (see Activity Supplies section)', searchTerms: '', estimatedCost: 'Varies', priority: 'high' },
      { task: 'Prize bin — a consolation prize basket so every kid leaves happy', searchTerms: 'party prize bin toys bulk', estimatedCost: '$15-25', priority: 'medium' },
      { task: 'Take-home station — favor bags/boxes displayed near the exit', searchTerms: 'party favor bags display stand', estimatedCost: '$10-20', priority: 'medium' },
      { task: 'Favor tags — custom "Thank you for coming!" labels or stickers', searchTerms: 'thank you party favor tags stickers', estimatedCost: '$5-8', priority: 'low' },
    ],
  },
  {
    id: 'logistics',
    emoji: '⚡',
    name: 'Logistics, Tech & Safety',
    color: 'orange',
    items: [
      { task: 'Bluetooth speaker and a curated, age-appropriate playlist', searchTerms: 'bluetooth speaker party', estimatedCost: '$15-40', priority: 'medium' },
      { task: 'Extension cords, power strips, and extra batteries (AA/AAA)', searchTerms: 'extension cord power strip batteries', estimatedCost: '$10-15', priority: 'medium' },
      { task: 'Lighting — string lights, LED uplights for color, or lanterns for evening', searchTerms: 'string lights LED party lanterns', estimatedCost: '$10-25', priority: 'low' },
      { task: 'Emergency party kit — scissors, clear tape, duct tape, and safety pins', searchTerms: 'scissors tape safety pins party kit', estimatedCost: '$8-12', priority: 'high' },
      { task: 'First aid — band-aids, antiseptic wipes, and an ice pack', searchTerms: 'first aid kit party', estimatedCost: '$8-12', priority: 'high' },
      { task: 'Screwdriver — to open toy battery compartments', searchTerms: 'small screwdriver set', estimatedCost: '$3-5', priority: 'low' },
      { task: 'Phone charger station — a dedicated spot for parents to plug in', searchTerms: 'multi phone charger station', estimatedCost: '$10-20', priority: 'low' },
    ],
  },
  {
    id: 'cleanup',
    emoji: '🧹',
    name: 'The Cleanup Crew',
    color: 'gray',
    items: [
      { task: 'Trash & recycling — at least two large, clearly labeled bins with extra liners', searchTerms: 'large trash bins liners party', estimatedCost: '$8-12', priority: 'high' },
      { task: 'Spill kit — paper towels, spray cleaner, and a microfiber cloth', searchTerms: 'paper towels spray cleaner microfiber', estimatedCost: '$8-12', priority: 'medium' },
      { task: 'To-go containers — tin foil or tupperware to send leftover food home', searchTerms: 'to go containers foil party leftovers', estimatedCost: '$5-10', priority: 'low' },
      { task: 'Bathroom prep — overstock toilet paper, hand towels, and a subtle air freshener', searchTerms: 'toilet paper hand towels air freshener', estimatedCost: '$8-12', priority: 'medium' },
    ],
  },
];

// Get all zone items as a flat checklist
export function getZoneChecklist() {
  return partyZones.flatMap(zone =>
    zone.items.map(item => ({
      ...item,
      zone: zone.name,
      zoneEmoji: zone.emoji,
      zoneId: zone.id,
      zoneColor: zone.color,
    }))
  );
}
