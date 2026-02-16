import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from('party_plans')
      .select('id, party_name, party_data, status, created_at, updated_at')
      .eq('user_email', email)
      .eq('is_deleted', false)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Extract metadata for efficient rendering
    const parties = data.map(party => ({
      id: party.id,
      name: party.party_name,
      status: party.status,
      createdAt: party.created_at,
      updatedAt: party.updated_at,
      childName: party.party_data?.childName,
      age: party.party_data?.age,
      theme: party.party_data?.theme,
      date: party.party_data?.date,
      guestCount: party.party_data?.guestCount,
      step: party.party_data?.step || 1,
    }));

    return res.status(200).json({
      success: true,
      parties,
      count: parties.length
    });
  } catch (error) {
    console.error('List parties error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load parties'
    });
  }
}
