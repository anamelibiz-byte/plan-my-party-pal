export const vendorCategories = [
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎭',
    description: 'Entertainers, characters, magicians, face painters',
  },
  {
    id: 'venues',
    name: 'Venues',
    icon: '🏰',
    description: 'Party venues, event spaces, bounce houses',
  },
  {
    id: 'catering',
    name: 'Catering & Bakery',
    icon: '🎂',
    description: 'Custom cakes, catering, food trucks',
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: '📸',
    description: 'Photographers, videographers, photo booths',
  },
  {
    id: 'decorations',
    name: 'Decorations',
    icon: '🎈',
    description: 'Balloon artists, decorators, party supplies',
  },
  {
    id: 'rentals',
    name: 'Rentals',
    icon: '🎪',
    description: 'Tables, chairs, tents, inflatables',
  },
];

export const featuredVendors = [
  {
    id: 1,
    name: 'Magic Mike Entertainment',
    category: 'entertainment',
    rating: 4.9,
    reviews: 127,
    priceRange: '$$',
    location: 'Seattle, WA',
    description: 'Professional magician and balloon artist. 10+ years experience.',
    services: ['Magic Shows', 'Balloon Twisting', 'Face Painting'],
    availability: 'Weekends & Evenings',
    image: '/vendors/magician.jpg',
    verified: true,
  },
  {
    id: 2,
    name: 'Sweet Dreams Bakery',
    category: 'catering',
    rating: 5.0,
    reviews: 243,
    priceRange: '$$',
    location: 'Portland, OR',
    description: 'Custom birthday cakes and desserts. Allergy-friendly options available.',
    services: ['Custom Cakes', 'Cupcakes', 'Dessert Tables'],
    availability: '2 weeks notice required',
    image: '/vendors/bakery.jpg',
    verified: true,
  },
  {
    id: 3,
    name: 'Bounce Kingdom',
    category: 'rentals',
    rating: 4.8,
    reviews: 89,
    priceRange: '$$$',
    location: 'San Francisco, CA',
    description: 'Premium bounce houses and inflatable slides. Free delivery within 20 miles.',
    services: ['Bounce Houses', 'Water Slides', 'Obstacle Courses'],
    availability: 'Book 1 month ahead',
    image: '/vendors/bounce.jpg',
    verified: true,
  },
  {
    id: 4,
    name: 'Party Palace Venue',
    category: 'venues',
    rating: 4.7,
    reviews: 156,
    priceRange: '$$$',
    location: 'Austin, TX',
    description: 'Indoor party venue with arcade, laser tag, and private party rooms.',
    services: ['Private Rooms', 'Arcade', 'Laser Tag', 'Pizza Included'],
    availability: 'Book 6 weeks ahead',
    image: '/vendors/venue.jpg',
    verified: true,
  },
];

export function getVendorsByCategory(category) {
  return featuredVendors.filter(v => v.category === category);
}

export function getVendorById(id) {
  return featuredVendors.find(v => v.id === id);
}
