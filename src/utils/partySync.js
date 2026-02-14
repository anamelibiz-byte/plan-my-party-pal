// Debounce utility to prevent too many saves
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Save party to database (debounced for 5 seconds)
export const savePartyToDatabase = debounce(async (email, partyData, planId) => {
  if (!email || !partyData) {
    console.log('Skip save: missing email or partyData');
    return { success: false };
  }

  try {
    const response = await fetch('/api/party/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, partyData, planId })
    });

    const result = await response.json();

    if (result.success && result.planId) {
      // Save plan ID to localStorage for future updates
      localStorage.setItem('pp_plan_id', result.planId);
      console.log('✅ Party saved to database:', result.planId);
    }

    return result;
  } catch (error) {
    console.error('Failed to save to database:', error);
    return { success: false };
  }
}, 5000); // Debounce for 5 seconds

// Load party from database by email
export async function loadPartyFromDatabase(email) {
  if (!email) return null;

  try {
    const response = await fetch(`/api/party/load?email=${encodeURIComponent(email)}`);
    const result = await response.json();

    if (result.success && result.data) {
      console.log('✅ Party loaded from database');
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('Failed to load from database:', error);
    return null;
  }
}

// Merge database data with localStorage (database wins on conflict)
export function mergePartyData(dbData, localData) {
  if (!dbData) return localData;
  if (!localData) return dbData.party_data;

  // Database is source of truth for returning users
  return {
    ...localData,
    ...dbData.party_data,
    // Keep the higher step number (most progress)
    step: Math.max(localData.step || 1, dbData.party_data.step || 1)
  };
}
