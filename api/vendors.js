export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return res.status(200).json({ results: [], error: 'API not configured' });

  const { location, category, radius } = req.query;
  if (!location) return res.status(400).json({ error: 'Location is required' });

  // Map our vendor categories to Google Places search queries
  const categoryKeywords = {
    entertainment: 'children party entertainer magician face painter balloon artist clown kids party performer',
    venues:        'kids birthday party venue event space private party room children party hall',
    catering:      'custom birthday cake bakery cupcakes kids party catering dessert table',
    photography:   'children party photographer photo booth kids event photographer',
    decorations:   'balloon decorator party decorator balloon arch balloon artist party supplies',
    rentals:       'bounce house rental inflatable rental party tent rental table chair rental kids party',
  };

  const keyword = categoryKeywords[category] || 'kids birthday party vendor';
  const searchRadius = parseInt(radius) || 24140; // default 15 miles in meters

  try {
    // Step 1: Geocode location
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.status(200).json({ results: [], error: 'Could not find that location' });
    }

    const { lat, lng } = geoData.results[0].geometry.location;
    const formattedAddress = geoData.results[0].formatted_address;

    // Step 2: Search Google Places (New API)
    const placesRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.currentOpeningHours,places.photos,places.id,places.websiteUri,places.nationalPhoneNumber,places.businessStatus',
      },
      body: JSON.stringify({
        textQuery: keyword,
        locationBias: {
          circle: { center: { latitude: lat, longitude: lng }, radius: searchRadius },
        },
        maxResultCount: 20,
        rankPreference: 'RELEVANCE',
      }),
    });

    const placesData = await placesRes.json();
    if (!placesData.places || placesData.places.length === 0) {
      return res.status(200).json({ results: [], location: formattedAddress });
    }

    const priceLevelMap = {
      PRICE_LEVEL_FREE: 'Free',
      PRICE_LEVEL_INEXPENSIVE: '$',
      PRICE_LEVEL_MODERATE: '$$',
      PRICE_LEVEL_EXPENSIVE: '$$$',
      PRICE_LEVEL_VERY_EXPENSIVE: '$$$$',
    };

    const vendors = placesData.places
      .filter(p => p.businessStatus !== 'CLOSED_PERMANENTLY')
      .map(place => {
        const pLat = place.location.latitude;
        const pLng = place.location.longitude;
        const R = 3959;
        const dLat = (pLat - lat) * Math.PI / 180;
        const dLng = (pLng - lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat * Math.PI / 180) * Math.cos(pLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
        const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return {
          id: place.id,
          name: place.displayName?.text || 'Unknown Business',
          address: place.formattedAddress || '',
          category: category || 'general',
          distance: `${dist.toFixed(1)} mi`,
          distanceMiles: dist,
          rating: place.rating || null,
          totalRatings: place.userRatingCount || 0,
          priceRange: priceLevelMap[place.priceLevel] || null,
          isOpen: place.currentOpeningHours?.openNow ?? null,
          website: place.websiteUri || null,
          phone: place.nationalPhoneNumber || null,
          photoRef: place.photos?.[0]?.name || null,
          placeId: place.id,
        };
      });

    vendors.sort((a, b) => a.distanceMiles - b.distanceMiles);

    return res.status(200).json({ results: vendors, location: formattedAddress });

  } catch (err) {
    console.error('Vendor search error:', err);
    return res.status(200).json({ results: [], error: 'Search failed' });
  }
}
