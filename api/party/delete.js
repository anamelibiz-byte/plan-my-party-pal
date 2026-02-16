import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { planId, email } = req.body;

  if (!planId || !email) {
    return res.status(400).json({ error: 'planId and email required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Verify ownership before deleting
    const { data: party, error: fetchError } = await supabase
      .from('party_plans')
      .select('user_email')
      .eq('id', planId)
      .single();

    if (fetchError || !party) {
      return res.status(404).json({
        success: false,
        error: 'Party not found'
      });
    }

    if (party.user_email !== email) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized - you can only delete your own parties'
      });
    }

    // Soft delete
    const { error: deleteError } = await supabase
      .from('party_plans')
      .update({ is_deleted: true })
      .eq('id', planId);

    if (deleteError) throw deleteError;

    return res.status(200).json({
      success: true,
      message: 'Party deleted successfully'
    });
  } catch (error) {
    console.error('Delete party error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete party'
    });
  }
}
