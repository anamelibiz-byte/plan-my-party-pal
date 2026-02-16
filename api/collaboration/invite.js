import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { party_id, invitee_email, inviter_email, role } = req.body;

  if (!party_id || !invitee_email || !inviter_email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get party details
    const { data: party, error: partyError } = await supabase
      .from('party_plans')
      .select('party_data')
      .eq('id', party_id)
      .single();

    if (partyError || !party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    // Create collaboration invite
    const { data, error } = await supabase
      .from('collaborators')
      .insert({
        party_id,
        email: invitee_email,
        role: role || 'editor', // 'editor' or 'viewer'
        invited_by: inviter_email,
        status: 'pending',
        invited_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'User already invited' });
      }
      throw error;
    }

    // Send invitation email
    if (resendKey) {
      const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://planmypartypal.com'}/collaborate/${party_id}?invite=${data.id}`;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Plan My Party Pal <hello@go.planmypartypal.com>',
          to: [invitee_email],
          subject: `🎉 You've been invited to help plan a party!`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
                <h1 style="color: white; margin: 0;">🎉 Party Planning Invite!</h1>
              </div>

              <p style="font-size: 16px;">Hi!</p>

              <p><strong>${inviter_email}</strong> has invited you to help plan <strong>${party.party_data.childName}'s ${party.party_data.age}th Birthday Party</strong>!</p>

              <div style="background: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Theme:</strong> ${party.party_data.theme || 'TBD'}</p>
                <p style="margin: 8px 0 0 0;"><strong>Date:</strong> ${new Date(party.party_data.date).toLocaleDateString()}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold;">
                  Accept Invitation →
                </a>
              </div>

              <p style="font-size: 14px; color: #666;">You'll be able to ${role === 'viewer' ? 'view' : 'edit'} the party plan and collaborate in real-time!</p>
            </div>
          `,
        }),
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Invitation sent',
      invite_id: data.id,
    });
  } catch (error) {
    console.error('Collaboration invite error:', error);
    return res.status(500).json({
      error: 'Failed to send invitation',
      detail: error.message,
    });
  }
}
