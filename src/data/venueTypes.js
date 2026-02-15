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

export function getAllVenuesWithinRadius(radiusMiles = 10) {
  return sampleVenues.filter(v => parseFloat(v.distance) <= radiusMiles);
}

// ─── Client-side Google Places Search ───────────────────────────────
const typeKeywords = {
  'Park/Outdoor': 'park playground nature park picnic area pavilion recreation area outdoor park city park county park state park greenway trail park',
  'Trampoline Park': 'trampoline park',
  'Gaming Truck': 'mobile gaming truck game truck video game truck gaming entertainment party truck kids',
  'Indoor Play Center': 'indoor playground kids play center',
  'Bowling Alley': 'bowling alley',
  'Skating Rink': 'skating rink roller skating ice skating',
  'Laser Tag Arena': 'laser tag arena',
  'Swimming Pool/Water Park/Splash Pad': 'water park swimming pool splash pad aquatic center public pool community pool swimming center pool recreation',
  'Art/Pottery Studio': 'art studio pottery painting kids',
  'Petting Zoo': 'petting zoo farm animals kids',
  'Community Center': 'community center recreation center',
};

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function searchNearbyVenues(location, venueType, radiusMiles = 10) {
  // Check if Google Maps API is loaded
  if (typeof google === 'undefined' || !google.maps) {
    return { results: [], error: 'Google Maps not loaded yet. Please try again.' };
  }

  try {
    // Step 1: Geocode location text to lat/lng
    const geocoder = new google.maps.Geocoder();
    const geoResult = await new Promise((resolve, reject) => {
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results.length > 0) {
          resolve(results[0]);
        } else {
          reject(new Error('Could not find that location'));
        }
      });
    });

    const center = geoResult.geometry.location;
    const formattedAddress = geoResult.formatted_address;

    // Step 2: Search for venues using PlacesService
    const mapDiv = document.createElement('div');
    const service = new google.maps.places.PlacesService(mapDiv);
    const keyword = typeKeywords[venueType] || venueType || 'party venue kids entertainment';
    const radiusMeters = Math.round(radiusMiles * 1609.34);

    const places = await new Promise((resolve, reject) => {
      service.textSearch(
        {
          query: keyword,
          location: center,
          radius: radiusMeters,
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(results);
          } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            resolve([]);
          } else {
            reject(new Error('Places search failed: ' + status));
          }
        }
      );
    });

    // Step 3: Format results & filter by radius
    const priceMap = { 0: 'Free', 1: '$', 2: '$$', 3: '$$$', 4: '$$$$' };

    // For Park/Outdoor, filter out results that look like indoor venues
    const isOutdoor = venueType === 'Park/Outdoor';
    const indoorKeywords = ['trampoline', 'laser tag', 'bowling', 'skating rink', 'arcade', 'museum', 'cinema', 'theater', 'gym', 'fitness'];

    const venues = places
      .map(place => {
        const pLat = place.geometry.location.lat();
        const pLng = place.geometry.location.lng();
        const dist = haversineDistance(center.lat(), center.lng(), pLat, pLng);
        return {
          name: place.name,
          address: place.formatted_address,
          type: venueType || 'Venue',
          distance: `${dist.toFixed(1)} mi`,
          distanceMiles: dist,
          priceRange: priceMap[place.price_level] ?? (isOutdoor ? 'Free' : '$$'),
          rating: place.rating || 0,
          totalRatings: place.user_ratings_total || 0,
          isOpen: place.opening_hours?.isOpen?.() ?? null,
          placeId: place.place_id,
          types: place.types || [],
        };
      })
      .filter(v => {
        // Filter by radius
        if (v.distanceMiles > radiusMiles) return false;
        // For Park/Outdoor, filter out indoor venues
        if (isOutdoor) {
          const nameLower = v.name.toLowerCase();
          if (indoorKeywords.some(kw => nameLower.includes(kw))) return false;
        }
        return true;
      })
      .slice(0, 10);

    venues.sort((a, b) => a.distanceMiles - b.distanceMiles);

    return {
      results: venues,
      location: formattedAddress,
    };
  } catch (error) {
    console.error('Venue search error:', error);
    return { results: [], error: error.message || 'Search failed' };
  }
}

// Custom search — user types their own query
export async function searchCustomVenue(location, query, radiusMiles = 10) {
  if (typeof google === 'undefined' || !google.maps) {
    return { results: [], error: 'Google Maps not loaded yet. Please try again.' };
  }

  try {
    const geocoder = new google.maps.Geocoder();
    const geoResult = await new Promise((resolve, reject) => {
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results.length > 0) resolve(results[0]);
        else reject(new Error('Could not find that location'));
      });
    });

    const center = geoResult.geometry.location;
    const formattedAddress = geoResult.formatted_address;
    const mapDiv = document.createElement('div');
    const service = new google.maps.places.PlacesService(mapDiv);
    const radiusMeters = Math.round(radiusMiles * 1609.34);

    const places = await new Promise((resolve, reject) => {
      service.textSearch(
        { query, location: center, radius: radiusMeters },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) resolve(results);
          else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) resolve([]);
          else reject(new Error('Search failed: ' + status));
        }
      );
    });

    const priceMap = { 0: 'Free', 1: '$', 2: '$$', 3: '$$$', 4: '$$$$' };
    const venues = places.slice(0, 10).map(place => {
      const pLat = place.geometry.location.lat();
      const pLng = place.geometry.location.lng();
      const dist = haversineDistance(center.lat(), center.lng(), pLat, pLng);
      return {
        name: place.name,
        address: place.formatted_address,
        type: 'Search Result',
        distance: `${dist.toFixed(1)} mi`,
        distanceMiles: dist,
        priceRange: priceMap[place.price_level] ?? '$$',
        rating: place.rating || 0,
        totalRatings: place.user_ratings_total || 0,
        isOpen: place.opening_hours?.isOpen?.() ?? null,
        placeId: place.place_id,
      };
    }).filter(v => v.distanceMiles <= radiusMiles);

    venues.sort((a, b) => a.distanceMiles - b.distanceMiles);
    return { results: venues, location: formattedAddress };
  } catch (error) {
    console.error('Custom venue search error:', error);
    return { results: [], error: error.message || 'Search failed' };
  }
}
