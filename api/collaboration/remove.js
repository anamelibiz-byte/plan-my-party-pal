import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { collaboratorId, email } = req.body;

  if (!collaboratorId || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    // Verify ownership (only party owner or the collaborator themselves can remove)
    const { data: collab } = await supabase
      .from('collaborators')
      .select('*, party_plans!inner(user_email)')
      .eq('id', collaboratorId)
      .single();

    if (!collab) {
      return res.status(404).json({ error: 'Collaborator not found' });
    }

    const isOwner = collab.party_plans.user_email === email;
    const isSelf = collab.email === email;

    if (!isOwner && !isSelf) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete collaborator
    const { error } = await supabase
      .from('collaborators')
      .delete()
      .eq('id', collaboratorId);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Collaborator removed'
    });
  } catch (error) {
    console.error('Remove collaborator error:', error);
    return res.status(500).json({ error: 'Failed to remove collaborator' });
  }
}
