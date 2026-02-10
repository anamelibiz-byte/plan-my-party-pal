// Simulated local venue data for MVP
// In production, replace with Google Places API calls
export const venueCategories = [
  'Park/Outdoor',
  'Home',
  'Trampoline Park',
  'Gaming Truck',
  'Indoor Play Center',
  'Bowling Alley',
  'Skating Rink',
  'Laser Tag Arena',
  'Swimming Pool/Water Park',
  'Art/Pottery Studio',
  'Petting Zoo',
  'Community Center',
];

// Sample venue data (would be replaced by Google Places API)
export const sampleVenues = [
  { name: 'Sky Zone Trampoline Park', type: 'Trampoline Park', distance: '3.2 mi', priceRange: '$$', rating: 4.5, phone: '(555) 123-4567', website: '#' },
  { name: 'GameTruck Mobile Gaming', type: 'Gaming Truck', distance: '5.0 mi', priceRange: '$$$', rating: 4.8, phone: '(555) 234-5678', website: '#' },
  { name: 'Sunshine Park Gazebo', type: 'Park/Outdoor', distance: '1.2 mi', priceRange: 'Free', rating: 4.3, phone: '(555) 345-6789', website: '#' },
  { name: 'Jump Zone Adventure', type: 'Indoor Play Center', distance: '2.8 mi', priceRange: '$$', rating: 4.4, phone: '(555) 456-7890', website: '#' },
  { name: 'Community Center Room B', type: 'Community Center', distance: '1.5 mi', priceRange: '$', rating: 4.0, phone: '(555) 567-8901', website: '#' },
  { name: 'Maple Grove Park', type: 'Park/Outdoor', distance: '3.1 mi', priceRange: 'Free', rating: 4.6, phone: '(555) 678-9012', website: '#' },
  { name: 'Strike Zone Bowling', type: 'Bowling Alley', distance: '4.5 mi', priceRange: '$$', rating: 4.2, phone: '(555) 789-0123', website: '#' },
  { name: 'Roller World Skating', type: 'Skating Rink', distance: '6.1 mi', priceRange: '$$', rating: 4.1, phone: '(555) 890-1234', website: '#' },
  { name: 'LazerX Arena', type: 'Laser Tag Arena', distance: '4.8 mi', priceRange: '$$', rating: 4.7, phone: '(555) 901-2345', website: '#' },
  { name: 'Splash City Water Park', type: 'Swimming Pool/Water Park', distance: '7.3 mi', priceRange: '$$$', rating: 4.5, phone: '(555) 012-3456', website: '#' },
  { name: 'Color Me Mine Studio', type: 'Art/Pottery Studio', distance: '2.4 mi', priceRange: '$$', rating: 4.6, phone: '(555) 111-2222', website: '#' },
  { name: 'Happy Tails Petting Zoo', type: 'Petting Zoo', distance: '8.5 mi', priceRange: '$$', rating: 4.4, phone: '(555) 333-4444', website: '#' },
  { name: 'Bounce Kingdom', type: 'Indoor Play Center', distance: '3.7 mi', priceRange: '$$', rating: 4.3, phone: '(555) 555-6666', website: '#' },
  { name: 'Adventure Park & Playground', type: 'Park/Outdoor', distance: '2.0 mi', priceRange: 'Free', rating: 4.5, phone: '(555) 777-8888', website: '#' },
  { name: 'Level Up Gaming Lounge', type: 'Gaming Truck', distance: '6.8 mi', priceRange: '$$$', rating: 4.9, phone: '(555) 999-0000', website: '#' },
];

// In production, you would call this with the Google Places API:
// export async function searchNearbyVenues(location, radius = 10, type) {
//   const response = await fetch(
//     `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius * 1609}&type=${type}&key=${API_KEY}`
//   );
//   return response.json();
// }

export function getVenuesByType(type) {
  if (!type || type === 'Home') return [];
  return sampleVenues.filter(v => v.type === type);
}

export function getAllVenuesWithinRadius(radiusMiles = 10) {
  return sampleVenues.filter(v => parseFloat(v.distance) <= radiusMiles);
}
