export const venueCategories = [
  'Park/Outdoor',
  'Home',
  'Trampoline Park',
  'Gaming Truck',
  'Indoor Play Center',
  'Bowling Alley',
  'Skating Rink',
  'Laser Tag Arena',
  'Swimming Pool/Water Park/Splash Pad',
  'Art/Pottery Studio',
  'Petting Zoo',
  'Community Center',
];

// Fallback sample data (used when no location entered or Google API unavailable)
export const sampleVenues = [
  { name: 'Sky Zone Trampoline Park', type: 'Trampoline Park', distance: '3.2 mi', priceRange: '$$', rating: 4.5, phone: '(555) 123-4567' },
  { name: 'GameTruck Mobile Gaming', type: 'Gaming Truck', distance: '5.0 mi', priceRange: '$$$', rating: 4.8, phone: '(555) 234-5678' },
  { name: 'Sunshine Park Gazebo', type: 'Park/Outdoor', distance: '1.2 mi', priceRange: 'Free', rating: 4.3, phone: '(555) 345-6789' },
  { name: 'Jump Zone Adventure', type: 'Indoor Play Center', distance: '2.8 mi', priceRange: '$$', rating: 4.4, phone: '(555) 456-7890' },
  { name: 'Community Center Room B', type: 'Community Center', distance: '1.5 mi', priceRange: '$', rating: 4.0, phone: '(555) 567-8901' },
  { name: 'Maple Grove Park', type: 'Park/Outdoor', distance: '3.1 mi', priceRange: 'Free', rating: 4.6, phone: '(555) 678-9012' },
  { name: 'Strike Zone Bowling', type: 'Bowling Alley', distance: '4.5 mi', priceRange: '$$', rating: 4.2, phone: '(555) 789-0123' },
  { name: 'Roller World Skating', type: 'Skating Rink', distance: '6.1 mi', priceRange: '$$', rating: 4.1, phone: '(555) 890-1234' },
  { name: 'LazerX Arena', type: 'Laser Tag Arena', distance: '4.8 mi', priceRange: '$$', rating: 4.7, phone: '(555) 901-2345' },
  { name: 'Splash City Water Park', type: 'Swimming Pool/Water Park/Splash Pad', distance: '7.3 mi', priceRange: '$$$', rating: 4.5, phone: '(555) 012-3456' },
  { name: 'Color Me Mine Studio', type: 'Art/Pottery Studio', distance: '2.4 mi', priceRange: '$$', rating: 4.6, phone: '(555) 111-2222' },
  { name: 'Happy Tails Petting Zoo', type: 'Petting Zoo', distance: '8.5 mi', priceRange: '$$', rating: 4.4, phone: '(555) 333-4444' },
];

export function getVenuesByType(type) {
  if (!type || type === 'Home') return [];
  return sampleVenues.filter(v => v.type === type);
}

export function getAllVenuesWithinRadius(radiusMiles = 15) {
  return sampleVenues.filter(v => parseFloat(v.distance) <= radiusMiles);
}

// ─── Server-side Google Places Search (via /api/places) ─────────────
// Uses the new Google Places API v1 on the server — avoids all client-side
// Google Maps SDK issues (async loading, deprecated nearbySearch, etc.)

export async function searchNearbyVenues(location, venueType, radiusMiles = 15) {
  if (!location || !venueType || venueType === 'Home') {
    return { results: [], error: 'Please enter a location first.' };
  }

  try {
    const radiusMeters = Math.round(radiusMiles * 1609.34);
    const params = new URLSearchParams({
      location: location,
      type: venueType,
      radius: radiusMeters,
    });

    const res = await fetch(`/api/places?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }
    const data = await res.json();

    if (data.error) {
      return { results: [], error: data.error };
    }

    return {
      results: data.results || [],
      location: data.location || location,
    };
  } catch (error) {
    console.error('Venue search error:', error);
    return { results: [], error: error.message || 'Search failed. Please try again.' };
  }
}

// Custom search — user types their own query
export async function searchCustomVenue(location, query, radiusMiles = 15) {
  if (!location || !query) {
    return { results: [], error: 'Please enter a location and search term.' };
  }

  try {
    const radiusMeters = Math.round(radiusMiles * 1609.34);
    const params = new URLSearchParams({
      location: location,
      type: query,
      radius: radiusMeters,
    });

    const res = await fetch(`/api/places?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }
    const data = await res.json();

    if (data.error) {
      return { results: [], error: data.error };
    }

    return {
      results: data.results || [],
      location: data.location || location,
    };
  } catch (error) {
    console.error('Custom venue search error:', error);
    return { results: [], error: error.message || 'Search failed. Please try again.' };
  }
}
