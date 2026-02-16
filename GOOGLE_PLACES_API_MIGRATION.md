# Google Places API Migration Guide

## ✅ Migration Complete!

Your app has been successfully migrated from the **old Google Places API** to the **new Places API (v1)**.

---

## What Changed?

### Old API (Deprecated)
```javascript
// Old endpoint
https://maps.googleapis.com/maps/api/place/textsearch/json

// Old method
GET with URL parameters

// Old response format
{
  results: [{
    name: "...",
    geometry: { location: { lat, lng } },
    user_ratings_total: 100
  }]
}
```

### New API (Current)
```javascript
// New endpoint
https://places.googleapis.com/v1/places:searchText

// New method
POST with JSON body and special headers

// New response format
{
  places: [{
    displayName: { text: "..." },
    location: { latitude, longitude },
    userRatingCount: 100
  }]
}
```

---

## Key Differences

### 1. **Endpoint URL**
- Old: `maps.googleapis.com/maps/api/place/*`
- New: `places.googleapis.com/v1/places:*`

### 2. **Request Method**
- Old: GET with query parameters
- New: POST with JSON body

### 3. **Headers Required**
```javascript
// New API requires these headers:
{
  'Content-Type': 'application/json',
  'X-Goog-Api-Key': apiKey,  // Changed from ?key= parameter
  'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,...'  // Required!
}
```

### 4. **Field Mask**
The new API requires you to specify which fields you want via `X-Goog-FieldMask`. This helps with billing and performance.

**Our field mask:**
```
places.displayName
places.formattedAddress
places.location
places.rating
places.userRatingCount
places.priceLevel
places.currentOpeningHours
places.photos
places.id
```

### 5. **Response Field Names**
| Old Field | New Field |
|-----------|-----------|
| `name` | `displayName.text` |
| `geometry.location.lat` | `location.latitude` |
| `geometry.location.lng` | `location.longitude` |
| `user_ratings_total` | `userRatingCount` |
| `opening_hours.open_now` | `currentOpeningHours.openNow` |
| `place_id` | `id` |
| `photos[0].photo_reference` | `photos[0].name` |

### 6. **Price Levels**
| Old Format | New Format |
|------------|------------|
| `0, 1, 2, 3, 4` (numbers) | `PRICE_LEVEL_FREE`, `PRICE_LEVEL_INEXPENSIVE`, etc. (strings) |

---

## API Key Setup

The same Google API key works for both, but ensure your API key has these permissions:

1. **Go to Google Cloud Console:** https://console.cloud.google.com/apis/credentials
2. **Find your API key**
3. **Click "Edit API key"**
4. **Under "API restrictions", ensure these are enabled:**
   - ✅ Places API (New)
   - ✅ Geocoding API (still used for location search)

---

## Benefits of the New API

1. **Better Performance** - More efficient data transfer with field masks
2. **More Features** - Access to newer place data and attributes
3. **Future-Proof** - Google won't deprecate this version
4. **Better Type Safety** - Structured response with clear field types
5. **Cost Optimization** - Only pay for fields you request

---

## Billing Considerations

The new API has different pricing:
- **Text Search:** $32 per 1,000 requests (with full field mask)
- **Geocoding:** $5 per 1,000 requests (unchanged)

**Cost-saving tip:** Only request fields you actually use in the `X-Goog-FieldMask` header.

---

## Testing the Migration

### Test the venue search:
1. Go to: https://partyplann.com/app
2. Fill in basic party info (Step 1)
3. In Step 2, select a venue type (e.g., "Trampoline Park")
4. Enter your location
5. Click "Search venues"
6. Results should appear using the new API! ✅

### Check for errors:
- Open browser console (F12)
- Look for any errors in red
- Venue search should work exactly as before

---

## Rollback Plan (If Needed)

If there are issues with the new API, you can temporarily rollback:

```bash
cd "/Users/anameli/party planner app"
git revert HEAD
git push origin main
```

This will restore the old API while you troubleshoot.

---

## Environment Variables

**Required:**
```
GOOGLE_PLACES_API_KEY=your_api_key_here
```

Same key works for both old and new API!

---

## Documentation Links

- [Places API (New) Documentation](https://developers.google.com/maps/documentation/places/web-service/text-search)
- [Migration Guide](https://developers.google.com/maps/documentation/places/web-service/migrate-to-new)
- [Field Masks](https://developers.google.com/maps/documentation/places/web-service/choose-fields)
- [Pricing](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing)

---

## ✅ Migration Status: COMPLETE

Your app is now using the recommended **Google Places API (v1)**! 🎉

The old PlacesService API will continue to work for now, but you're future-proofed for when Google eventually deprecates it.
