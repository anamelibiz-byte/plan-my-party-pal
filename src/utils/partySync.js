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
      // Sync RSVP ID with plan ID so RSVP responses are linked correctly
      localStorage.setItem('pp_rsvp_id', JSON.stringify(result.planId));
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

// Save party with explicit name and status
export async function saveNamedParty(email, partyData, partyName, status = 'archived') {
  if (!email || !partyData) {
    return { success: false, error: 'Missing required data' };
  }

  try {
    const response = await fetch('/api/party/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        partyData,
        partyName,
        status,
        planId: null // Force new party creation
      })
    });

    console.log('🔍 Save API Response Status:', response.status);
    const result = await response.json();
    console.log('🔍 Save API Result:', result);

    if (result.error === 'FREE_TIER_LIMIT') {
      return {
        success: false,
        error: result.error,
        requiresUpgrade: true,
        message: result.message
      };
    }

    if (result.success && result.planId) {
      console.log('✅ Party saved as new:', result.partyName);
    }

    return result;
  } catch (error) {
    console.error('Failed to save named party:', error);
    return { success: false, error: error.message };
  }
}

// List all parties for a user
export async function listUserParties(email) {
  if (!email) return { success: false, error: 'Email required' };

  try {
    const response = await fetch(`/api/party/list?email=${encodeURIComponent(email)}`);
    console.log('🔍 List API Response Status:', response.status);
    const result = await response.json();
    console.log('🔍 List API Result:', result);
    return result;
  } catch (error) {
    console.error('Failed to list parties:', error);
    return { success: false, error: error.message };
  }
}

// Delete a party
export async function deleteParty(email, planId) {
  if (!email || !planId) return { success: false, error: 'Missing required data' };

  try {
    const response = await fetch('/api/party/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, planId })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to delete party:', error);
    return { success: false, error: error.message };
  }
}

// Load specific party by ID
export async function loadPartyById(planId) {
  if (!planId) return null;

  try {
    const response = await fetch(`/api/party/load?planId=${planId}`);
    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('Failed to load party by ID:', error);
    return null;
  }
}

// Helper: Generate party name from data
export function generatePartyName(partyData) {
  const { childName, age, theme, date } = partyData;

  if (childName && age) return `${childName}'s ${age}th Birthday`;
  if (childName && theme) return `${childName}'s ${theme} Party`;
  if (theme && date) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${theme} Party - ${formattedDate}`;
  }
  if (date) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return `Party - ${formattedDate}`;
  }
  return 'Untitled Party';
}
