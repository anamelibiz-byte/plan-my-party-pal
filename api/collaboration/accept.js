import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { inviteId, email, action } = req.body; // action: 'accept' or 'decline'

  if (!inviteId || !email || !action) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    // Verify invite exists and is for this email
    const { data: invite, error: fetchError } = await supabase
      .from('collaborators')
      .select('*')
      .eq('id', inviteId)
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (fetchError || !invite) {
      return res.status(404).json({ error: 'Invitation not found or already processed' });
    }

    // Update status
    const newStatus = action === 'accept' ? 'accepted' : 'declined';
    const { error: updateError } = await supabase
      .from('collaborators')
      .update({
        status: newStatus,
        accepted_at: action === 'accept' ? new Date().toISOString() : null
      })
      .eq('id', inviteId);

    if (updateError) throw updateError;

    return res.status(200).json({
      success: true,
      message: action === 'accept' ? 'Invitation accepted!' : 'Invitation declined',
      partyId: invite.party_id
    });
  } catch (error) {
    console.error('Accept/decline error:', error);
    return res.status(500).json({ error: 'Failed to process invitation' });
  }
}
