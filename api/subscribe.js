export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, source, partyData } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // No Supabase configured — return success (frontend saves locally)
    return res.status(200).json({ success: true, storage: 'local' });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        email,
        source: source || 'landing',
        party_data: partyData || null,
        created_at: new Date().toISOString(),
      }),
    });

    if (response.ok || response.status === 201) {
      return res.status(200).json({ success: true });
    }
    return res.status(200).json({ success: true, storage: 'local' });
  } catch (error) {
    return res.status(200).json({ success: true, storage: 'local' });
  }
}
