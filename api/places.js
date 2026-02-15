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
      'Park/Outdoor': 'park playground nature park picnic area pavilion recreation area outdoor park city park county park state park greenway trail park',
      'Trampoline Park': 'trampoline park',
      'Gaming Truck': 'mobile gaming truck game truck video game truck gaming entertainment party truck kids',
      'Indoor Play Center': 'indoor playground kids play center',
      'Bowling Alley': 'bowling alley',
      'Skating Rink': 'skating rink roller skating ice skating',
      'Laser Tag Arena': 'laser tag',
      'Swimming Pool/Water Park/Splash Pad': 'water park swimming pool splash pad aquatic center public pool community pool swimming center pool recreation',
      'Art/Pottery Studio': 'art studio pottery painting',
      'Petting Zoo': 'petting zoo farm animals',
      'Community Center': 'community center recreation center',
    };

    const keyword = typeKeywords[type] || type || 'party venue kids entertainment';
    const searchRadius = parseInt(radius) || 16093; // default 10 miles in meters

    // Step 3: Use NEW Google Places API (Places API New) - Text Search
    // https://developers.google.com/maps/documentation/places/web-service/text-search
    const searchUrl = `https://places.googleapis.com/v1/places:searchText`;

    const placesRes = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.currentOpeningHours,places.photos,places.id'
      },
      body: JSON.stringify({
        textQuery: keyword,
        locationBias: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng
            },
            radius: searchRadius
          }
        },
        maxResultCount: 20,
        rankPreference: 'DISTANCE'
      })
    });

    const placesData = await placesRes.json();

    if (!placesData.places || placesData.places.length === 0) {
      return res.status(200).json({ results: [], location: formattedAddress });
    }

    // Step 4: Format results
    const venues = placesData.places.map(place => {
      // Calculate distance from search center
      const pLat = place.location.latitude;
      const pLng = place.location.longitude;
      const R = 3959; // Earth radius in miles
      const dLat = (pLat - lat) * Math.PI / 180;
      const dLng = (pLng - lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat * Math.PI / 180) * Math.cos(pLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
      const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      // Map price_level to price range (new API uses different format)
      const priceLevelMap = {
        'PRICE_LEVEL_FREE': 'Free',
        'PRICE_LEVEL_INEXPENSIVE': '$',
        'PRICE_LEVEL_MODERATE': '$$',
        'PRICE_LEVEL_EXPENSIVE': '$$$',
        'PRICE_LEVEL_VERY_EXPENSIVE': '$$$$'
      };

      return {
        name: place.displayName?.text || place.displayName || 'Unnamed Venue',
        address: place.formattedAddress || '',
        type: type || 'Venue',
        distance: `${dist.toFixed(1)} mi`,
        distanceMiles: dist,
        priceRange: priceLevelMap[place.priceLevel] || '$$',
        rating: place.rating || 0,
        totalRatings: place.userRatingCount || 0,
        isOpen: place.currentOpeningHours?.openNow ?? null,
        placeId: place.id,
        photoRef: place.photos?.[0]?.name || null,
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
