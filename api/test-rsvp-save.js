// Quick diagnostic endpoint to test RSVP saving
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      error: 'Supabase not configured',
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    });
  }

  // Test data
  const testData = {
    party_id: 'test-party-123',
    guest_name: 'Test Guest',
    email: 'test@example.com',
    attending: true,
    status: 'confirmed',
    adult_count: 2,
    child_count: 1,
    dietary: ['Vegetarian'],
    dietary_other: '',
    message: 'Looking forward to it!',
    created_at: new Date().toISOString(),
  };

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rsvp_responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(testData),
    });

    const responseText = await response.text();

    return res.status(200).json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseBody: responseText || 'Empty response (expected for successful insert)',
      testData,
      hint: response.ok
        ? 'Database is working! The email/status columns exist.'
        : 'Database error - likely missing columns. Run the migration SQL.'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      hint: 'Network or database connection error'
    });
  }
}
