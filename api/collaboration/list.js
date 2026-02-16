import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { partyId } = req.query;

  if (!partyId) {
    return res.status(400).json({ error: 'Party ID required' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { data, error } = await supabase
      .from('collaborators')
      .select('id, email, role, status, invited_by, invited_at, accepted_at')
      .eq('party_id', partyId)
      .order('invited_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      collaborators: data
    });
  } catch (error) {
    console.error('List collaborators error:', error);
    return res.status(500).json({ error: 'Failed to load collaborators' });
  }
}
