export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ results: [], error: 'Google Places API not configured' });
  }

  const { location, type, radius } = req.query;

  if (!location) {
    return res.status(400).json({ error: 'Location is required (city, state or ZIP)' });
  }

  try {
    // Step 1: Geocode the location text to lat/lng
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.status(200).json({ results: [], error: 'Could not find that location' });
    }

    const { lat, lng } = geoData.results[0].geometry.location;
    const formattedAddress = geoData.results[0].formatted_address;

    // Step 2: Map venue category to Google Places type keywords
    const typeKeywords = {
      'Park/Outdoor': 'park playground',
      'Trampoline Park': 'trampoline park',
      'Gaming Truck': 'mobile gaming entertainment',
      'Indoor Play Center': 'indoor playground kids play center',
      'Bowling Alley': 'bowling alley',
      'Skating Rink': 'skating rink roller skating ice skating',
      'Laser Tag Arena': 'laser tag',
      'Swimming Pool/Water Park': 'water park swimming pool',
      'Art/Pottery Studio': 'art studio pottery painting',
      'Petting Zoo': 'petting zoo farm animals',
      'Community Center': 'community center recreation center',
    };

    const keyword = typeKeywords[type] || type || 'party venue kids entertainment';
    const searchRadius = parseInt(radius) || 16093; // default 10 miles in meters

    // Step 3: Search Google Places (Text Search for better results)
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&location=${lat},${lng}&radius=${searchRadius}&key=${apiKey}`;
    const placesRes = await fetch(searchUrl);
    const placesData = await placesRes.json();

    if (!placesData.results) {
      return res.status(200).json({ results: [], location: formattedAddress });
    }

    // Step 4: Format results
    const venues = placesData.results.slice(0, 10).map(place => {
      // Calculate distance from search center
      const pLat = place.geometry.location.lat;
      const pLng = place.geometry.location.lng;
      const R = 3959; // Earth radius in miles
      const dLat = (pLat - lat) * Math.PI / 180;
      const dLng = (pLng - lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat * Math.PI / 180) * Math.cos(pLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
      const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      // Map price_level to price range
      const priceMap = { 0: 'Free', 1: '$', 2: '$$', 3: '$$$', 4: '$$$$' };

      return {
        name: place.name,
        address: place.formatted_address,
        type: type || 'Venue',
        distance: `${dist.toFixed(1)} mi`,
        distanceMiles: dist,
        priceRange: priceMap[place.price_level] || '$$',
        rating: place.rating || 0,
        totalRatings: place.user_ratings_total || 0,
        isOpen: place.opening_hours?.open_now ?? null,
        placeId: place.place_id,
        photoRef: place.photos?.[0]?.photo_reference || null,
      };
    });

    // Sort by distance
    venues.sort((a, b) => a.distanceMiles - b.distanceMiles);

    return res.status(200).json({
      results: venues,
      location: formattedAddress,
      coordinates: { lat, lng },
    });

  } catch (error) {
    console.error('Places API error:', error);
    return res.status(200).json({ results: [], error: 'Failed to search venues' });
  }
}
