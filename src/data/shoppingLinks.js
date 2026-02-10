// Amazon affiliate tag
const AFFILIATE_TAG = 'buyitnow075-20';

export function getAmazonSearchUrl(searchTerms) {
  const encoded = encodeURIComponent(searchTerms);
  return `https://www.amazon.com/s?k=${encoded}&tag=${AFFILIATE_TAG}`;
}

// Bakery / Cake ordering links
export const bakeryLinks = {
  chains: [
    { name: 'Publix Bakery', url: 'https://www.publix.com/c/cakes', description: 'Custom cakes, cupcakes, and cookie cakes', type: 'grocery' },
    { name: 'Costco Bakery', url: 'https://www.costco.com/cakes.html', description: 'Sheet cakes and cupcake platters — great value', type: 'grocery' },
    { name: 'Walmart Bakery', url: 'https://www.walmart.com/browse/food/bakery-cakes', description: 'Affordable custom cakes and cupcakes', type: 'grocery' },
    { name: 'Nothing Bundt Cakes', url: 'https://www.nothingbundtcakes.com', description: 'Bundtlets and tiered bundt cakes', type: 'specialty' },
    { name: 'Baskin-Robbins', url: 'https://www.baskinrobbins.com/en/cakes', description: 'Ice cream cakes in many flavors', type: 'icecream' },
    { name: 'Dairy Queen', url: 'https://www.dairyqueen.com/en-us/menu/cakes/', description: 'Ice cream cakes and Blizzard cakes', type: 'icecream' },
    { name: 'Cold Stone Creamery', url: 'https://www.coldstonecreamery.com/cakes', description: 'Custom ice cream cakes', type: 'icecream' },
  ],
  searchLocal: {
    google: (location) => `https://www.google.com/search?q=${encodeURIComponent('birthday cake bakery near ' + location)}`,
    yelp: (location) => `https://www.yelp.com/search?find_desc=${encodeURIComponent('birthday cake bakery')}&find_loc=${encodeURIComponent(location)}`,
  },
};

// Map common checklist categories to search terms
export const supplySearchTerms = {
  'balloons': 'birthday party balloons',
  'banner': 'happy birthday banner',
  'streamers': 'party streamers decorations',
  'tablecloth': 'birthday party tablecloth',
  'centerpieces': 'birthday party centerpieces',
  'plates': 'birthday party plates',
  'cups': 'birthday party cups',
  'napkins': 'birthday party napkins',
  'utensils': 'party plastic utensils',
  'goodie bags': 'party favor bags kids',
  'small toys': 'party favor toys bulk',
  'candy': 'bulk candy party favors',
  'stickers': 'kids party stickers bulk',
  'first aid kit': 'first aid kit',
  'sunscreen': 'kids sunscreen',
  'trash bags': 'heavy duty trash bags',
  'ice': 'cooler with ice packs',
  'bounce house': 'bounce house rental',
  'gaming truck': 'mobile gaming truck rental',
  'photo booth': 'photo booth rental party',
};

// Activity-specific supply lists with shopping links
export const activitySupplies = {
  // Toddler activities
  'Bubble Station': [
    { item: 'Bubble Machine', search: 'bubble machine kids party', estimatedCost: '$15-25' },
    { item: 'Bubble Solution (gallon)', search: 'bubble solution gallon refill', estimatedCost: '$8-12' },
    { item: 'Bubble Wands (pack)', search: 'bubble wands kids pack', estimatedCost: '$8-10' },
  ],
  'Sensory Bins': [
    { item: 'Plastic Bins', search: 'plastic storage bins sensory play', estimatedCost: '$10-15' },
    { item: 'Water Beads', search: 'water beads sensory play', estimatedCost: '$8-10' },
    { item: 'Colored Rice / Sand', search: 'colored rice sensory play', estimatedCost: '$8-12' },
    { item: 'Small Toys & Scoops', search: 'sensory bin toys scoops', estimatedCost: '$10-15' },
  ],
  'Ball Pit': [
    { item: 'Inflatable Ball Pit', search: 'inflatable ball pit toddler', estimatedCost: '$15-25' },
    { item: 'Plastic Balls (200 pack)', search: 'plastic ball pit balls 200', estimatedCost: '$15-20' },
  ],
  'Parachute Games': [
    { item: 'Play Parachute (12ft)', search: 'kids play parachute 12 feet', estimatedCost: '$15-25' },
    { item: 'Lightweight Balls', search: 'lightweight foam balls kids', estimatedCost: '$8-10' },
  ],
  // Young kids activities
  'DIY Slime': [
    { item: "Elmer's Glue (gallon)", search: 'elmers glue gallon slime', estimatedCost: '$10-15' },
    { item: 'Contact Solution / Borax', search: 'contact lens solution slime', estimatedCost: '$5-8' },
    { item: 'Glitter & Mix-ins', search: 'slime supplies glitter beads', estimatedCost: '$8-12' },
    { item: 'Containers', search: 'small containers slime storage', estimatedCost: '$5-10' },
  ],
  'Face Painting': [
    { item: 'Face Paint Kit', search: 'face paint kit kids party', estimatedCost: '$12-18' },
    { item: 'Brushes & Sponges', search: 'face paint brushes sponges', estimatedCost: '$5-8' },
    { item: 'Glitter Gels', search: 'face paint glitter gel', estimatedCost: '$5-8' },
  ],
  'Cupcake Decorating': [
    { item: 'Pre-baked Cupcakes', search: 'plain cupcakes bulk', estimatedCost: '$15-20' },
    { item: 'Frosting Variety', search: 'frosting colors decorating', estimatedCost: '$10-15' },
    { item: 'Sprinkles & Toppings', search: 'cupcake sprinkles variety pack', estimatedCost: '$8-12' },
  ],
  'Science Lab': [
    { item: 'Baking Soda & Vinegar', search: 'baking soda vinegar science', estimatedCost: '$5-8' },
    { item: 'Food Coloring', search: 'food coloring set', estimatedCost: '$5-8' },
    { item: 'Lab Coats (kids)', search: 'kids lab coat costume pack', estimatedCost: '$12-18' },
    { item: 'Safety Goggles', search: 'kids safety goggles pack', estimatedCost: '$8-12' },
  ],
  'Lego Building Challenge': [
    { item: 'LEGO Classic Bricks (bulk)', search: 'lego classic bricks bulk', estimatedCost: '$20-35' },
    { item: 'Building Baseplates', search: 'lego baseplates pack', estimatedCost: '$10-15' },
  ],
  'Tie-Dye Shirts': [
    { item: 'Tie-Dye Kit', search: 'tie dye kit party pack', estimatedCost: '$15-20' },
    { item: 'White T-Shirts (bulk)', search: 'white t shirts kids bulk', estimatedCost: '$15-25' },
    { item: 'Rubber Bands & Gloves', search: 'rubber bands gloves tie dye', estimatedCost: '$5-8' },
    { item: 'Plastic Table Covers', search: 'plastic table cover disposable', estimatedCost: '$5-8' },
  ],
  'Sand Art': [
    { item: 'Colored Sand Set', search: 'colored sand art bottles kids', estimatedCost: '$12-18' },
    { item: 'Sand Art Bottles', search: 'sand art bottles party pack', estimatedCost: '$8-12' },
  ],
  // Tween activities
  'Nerf Battle': [
    { item: 'Nerf Blasters (pack)', search: 'nerf blaster pack party', estimatedCost: '$30-50' },
    { item: 'Safety Glasses (pack)', search: 'kids safety glasses bulk', estimatedCost: '$8-12' },
    { item: 'Extra Nerf Darts', search: 'nerf darts refill 100 pack', estimatedCost: '$8-12' },
    { item: 'Inflatable Bunkers', search: 'inflatable bunkers nerf battle', estimatedCost: '$20-40' },
  ],
  'Glow-in-the-Dark Dance': [
    { item: 'Black Lights', search: 'black light party pack', estimatedCost: '$15-25' },
    { item: 'Glow Sticks (bulk)', search: 'glow sticks bulk party', estimatedCost: '$10-15' },
    { item: 'Neon Tape', search: 'neon tape glow party', estimatedCost: '$8-10' },
    { item: 'Neon Face/Body Paint', search: 'neon body paint glow party', estimatedCost: '$10-15' },
  ],
  'Outdoor Movie': [
    { item: 'Projector (portable)', search: 'portable projector outdoor movie', estimatedCost: '$40-80' },
    { item: 'Inflatable Screen or White Sheet', search: 'outdoor movie screen inflatable', estimatedCost: '$25-50' },
    { item: 'Popcorn Maker', search: 'popcorn maker machine', estimatedCost: '$20-30' },
    { item: 'Blankets / Bean Bags', search: 'outdoor blankets picnic', estimatedCost: '$15-25' },
  ],
  'Canvas Painting': [
    { item: 'Canvas Panels (pack)', search: 'canvas panels bulk painting', estimatedCost: '$15-20' },
    { item: 'Acrylic Paint Set', search: 'acrylic paint set kids', estimatedCost: '$10-15' },
    { item: 'Paint Brushes', search: 'paint brushes variety pack', estimatedCost: '$8-10' },
    { item: 'Easels (tabletop)', search: 'tabletop easel kids painting', estimatedCost: '$15-25' },
  ],
  'Laser Tag': [
    { item: 'Laser Tag Set (multi-pack)', search: 'kids laser tag set party', estimatedCost: '$40-70' },
    { item: 'Extra Batteries', search: 'AA batteries bulk pack', estimatedCost: '$8-12' },
  ],
  'Selfie Booth': [
    { item: 'Photo Booth Props', search: 'photo booth props kids party', estimatedCost: '$10-15' },
    { item: 'Backdrop', search: 'photo booth backdrop birthday', estimatedCost: '$12-20' },
    { item: 'Instant Camera / Film', search: 'instant camera film party', estimatedCost: '$20-30' },
  ],
  'Jewelry Making': [
    { item: 'Bead Kit', search: 'jewelry making bead kit kids', estimatedCost: '$12-18' },
    { item: 'Charms & Pendants', search: 'jewelry charms kids bracelet', estimatedCost: '$8-12' },
    { item: 'String & Wire', search: 'jewelry string elastic cord', estimatedCost: '$5-8' },
  ],
  // Teen activities
  'Mocktail Mixology': [
    { item: 'Cocktail Shakers', search: 'cocktail shaker set', estimatedCost: '$12-18' },
    { item: 'Syrups & Juices', search: 'mocktail syrups variety', estimatedCost: '$15-20' },
    { item: 'Garnishes & Umbrellas', search: 'cocktail garnishes umbrellas', estimatedCost: '$8-10' },
    { item: 'Fancy Glasses', search: 'plastic cocktail glasses party', estimatedCost: '$10-15' },
  ],
  'Bonfire Night': [
    { item: 'Fire Pit (portable)', search: 'portable fire pit', estimatedCost: '$25-50' },
    { item: 'Marshmallows & S\'mores Supplies', search: 'smores kit party', estimatedCost: '$15-20' },
    { item: 'Roasting Sticks', search: 'marshmallow roasting sticks', estimatedCost: '$10-15' },
    { item: 'String Lights', search: 'outdoor string lights', estimatedCost: '$12-18' },
  ],
  // Carry forward existing
  'Giant Bubble Station': [
    { item: 'Bubble Solution (bulk)', search: 'bubble solution gallon', estimatedCost: '$8-12' },
    { item: 'Giant Bubble Wands', search: 'giant bubble wands kids', estimatedCost: '$10-15' },
    { item: 'Kiddie Pool (for dipping)', search: 'small kiddie pool', estimatedCost: '$10-15' },
  ],
  'Outdoor Laser Tag': [
    { item: 'Laser Tag Set (multi-pack)', search: 'kids laser tag set party', estimatedCost: '$40-70' },
    { item: 'Extra Batteries', search: 'AA batteries bulk pack', estimatedCost: '$8-12' },
  ],
  'DIY Lip Gloss & Bath Bomb Making': [
    { item: 'Lip Gloss Making Kit', search: 'diy lip gloss kit kids', estimatedCost: '$12-18' },
    { item: 'Bath Bomb Kit', search: 'diy bath bomb kit kids party', estimatedCost: '$15-20' },
    { item: 'Gift Bags for Take-Home', search: 'small gift bags party', estimatedCost: '$5-8' },
  ],
  'Build Your Own Stuffed Animal': [
    { item: 'Stuffed Animal Kits', search: 'make your own stuffed animal kit party', estimatedCost: '$8-15 per kid' },
    { item: 'Stuffing Material', search: 'polyester fiberfill stuffing', estimatedCost: '$8-12' },
    { item: 'Mini Outfits & Accessories', search: 'stuffed animal clothes accessories', estimatedCost: '$10-15' },
  ],
  'Pizza Making': [
    { item: 'Pizza Dough (pre-made)', search: 'pizza dough balls bulk', estimatedCost: '$10-15' },
    { item: 'Pizza Sauce & Cheese', search: 'pizza sauce mozzarella', estimatedCost: '$10-15' },
    { item: 'Toppings Variety', search: 'pizza toppings pepperoni vegetables', estimatedCost: '$10-15' },
    { item: 'Mini Pizza Pans', search: 'mini pizza pans set', estimatedCost: '$10-15' },
  ],
  'Escape Room (DIY)': [
    { item: 'Escape Room Kit', search: 'escape room in a box kids party', estimatedCost: '$15-25' },
    { item: 'Padlocks & Keys', search: 'small padlocks party game', estimatedCost: '$8-12' },
    { item: 'Clue Cards & Envelopes', search: 'blank cards envelopes', estimatedCost: '$5-8' },
  ],
  'Bounce House': [
    { item: 'Bounce House Rental (local)', search: 'bounce house rental near me', estimatedCost: '$100-200' },
    { item: 'Stakes/Anchors (if on grass)', search: 'bounce house stakes anchors', estimatedCost: '$10-15' },
    { item: 'Ground Tarp', search: 'bounce house ground tarp', estimatedCost: '$10-20' },
  ],
  'Bounce Slide Combo': [
    { item: 'Bounce Slide Combo Rental (local)', search: 'bounce house slide combo rental near me', estimatedCost: '$150-300' },
    { item: 'Stakes/Anchors', search: 'bounce house stakes anchors', estimatedCost: '$10-15' },
    { item: 'Ground Tarp', search: 'bounce house ground tarp', estimatedCost: '$10-20' },
  ],
  'Water Bounce House': [
    { item: 'Water Slide Bounce House Rental (local)', search: 'water bounce house slide rental near me', estimatedCost: '$150-300' },
    { item: 'Garden Hose Connector', search: 'garden hose connector', estimatedCost: '$5-10' },
    { item: 'Ground Tarp', search: 'bounce house ground tarp', estimatedCost: '$10-20' },
  ],
  'Obstacle Course Inflatable': [
    { item: 'Obstacle Course Inflatable Rental (local)', search: 'inflatable obstacle course rental near me', estimatedCost: '$200-350' },
    { item: 'Stakes/Anchors', search: 'bounce house stakes anchors', estimatedCost: '$10-15' },
  ],
  'Toddler Bounce House': [
    { item: 'Toddler Bounce House (buy or rent)', search: 'toddler bounce house small inflatable', estimatedCost: '$80-150' },
    { item: 'Repair Patch Kit', search: 'bounce house repair kit patches', estimatedCost: '$5-8' },
  ],
  "Campfire S'mores": [
    { item: 'Marshmallows (jumbo)', search: 'jumbo marshmallows', estimatedCost: '$5-8' },
    { item: 'Graham Crackers', search: 'graham crackers', estimatedCost: '$5-8' },
    { item: 'Chocolate Variety', search: 'chocolate bars variety smores', estimatedCost: '$8-12' },
    { item: 'Roasting Sticks', search: 'marshmallow roasting sticks', estimatedCost: '$10-15' },
    { item: 'Fire Pit (portable)', search: 'portable fire pit', estimatedCost: '$25-50' },
  ],
};

export function getSuppliesForActivity(activityName) {
  return activitySupplies[activityName] || [];
}
