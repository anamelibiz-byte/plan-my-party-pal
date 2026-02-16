import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { party_id, reminder_message } = req.body;

  if (!party_id) {
    return res.status(400).json({ error: 'Party ID required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  if (!resendKey) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get party details
    const { data: partyPlan, error: partyError } = await supabase
      .from('party_plans')
      .select('party_data, user_email')
      .eq('id', party_id)
      .single();

    if (partyError || !partyPlan) {
      return res.status(404).json({ error: 'Party not found' });
    }

    const partyData = partyPlan.party_data;

    // Get pending RSVPs
    const { data: guests, error: guestsError } = await supabase
      .from('rsvp_responses')
      .select('*')
      .eq('party_id', party_id)
      .eq('status', 'pending');

    if (guestsError) {
      throw guestsError;
    }

    if (!guests || guests.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending RSVPs to remind',
        sent: 0,
      });
    }

    // Send reminder emails
    let sentCount = 0;
    const errors = [];

    for (const guest of guests) {
      if (!guest.email) continue;

      try {
        const rsvpUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://planmypartypal.com'}/rsvp/${party_id}`;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Plan My Party Pal <hello@go.planmypartypal.com>',
            to: [guest.email],
            subject: `🎉 RSVP Reminder: ${partyData.childName}'s Party`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

                <!-- Header -->
                <div style="text-align: center; padding: 30px 0; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); border-radius: 12px; margin-bottom: 30px;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">🎉 RSVP Reminder</h1>
                </div>

                <!-- Content -->
                <div style="padding: 20px 0;">
                  <p style="font-size: 16px; color: #333;">Hi ${guest.name}!</p>

                  <p style="font-size: 16px; color: #333;">
                    This is a friendly reminder to RSVP for <strong>${partyData.childName}'s ${partyData.age}${partyData.age == 1 ? 'st' : partyData.age == 2 ? 'nd' : partyData.age == 3 ? 'rd' : 'th'} Birthday Party</strong>!
                  </p>

                  ${reminder_message ? `
                  <div style="background: #fdf2f8; border-left: 4px solid #ec4899; padding: 15px; margin: 20px 0; border-radius: 6px;">
                    <p style="margin: 0; color: #666; font-style: italic;">"${reminder_message}"</p>
                  </div>
                  ` : ''}

                  <!-- Party Details -->
                  <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 25px 0;">
                    <h3 style="margin-top: 0; color: #ec4899; font-size: 18px;">Party Details</h3>
                    <p style="margin: 8px 0;"><strong>📅 Date:</strong> ${new Date(partyData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    ${partyData.theme ? `<p style="margin: 8px 0;"><strong>🎨 Theme:</strong> ${partyData.theme}</p>` : ''}
                    ${partyData.venue ? `<p style="margin: 8px 0;"><strong>📍 Location:</strong> ${partyData.venue}</p>` : ''}
                  </div>

                  <p style="font-size: 16px; color: #333;">
                    Please let us know if you can make it!
                  </p>

                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 40px 0;">
                    <a href="${rsvpUrl}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      RSVP Now →
                    </a>
                  </div>

                  <p style="font-size: 14px; color: #666; text-align: center;">
                    Or copy and paste this link: <a href="${rsvpUrl}" style="color: #ec4899;">${rsvpUrl}</a>
                  </p>
                </div>

                <!-- Footer -->
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 13px;">
                  <p>Sent via Plan My Party Pal</p>
                  <p style="margin-top: 10px;">
                    <a href="https://planmypartypal.com" style="color: #ec4899; text-decoration: none;">planmypartypal.com</a>
                  </p>
                </div>

              </body>
              </html>
            `,
          }),
        });

        sentCount++;

        // Update last_reminded timestamp
        await supabase
          .from('rsvp_responses')
          .update({ last_reminded: new Date().toISOString() })
          .eq('id', guest.id);

      } catch (emailError) {
        console.error(`Failed to send reminder to ${guest.email}:`, emailError);
        errors.push({ email: guest.email, error: emailError.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Sent ${sentCount} reminder${sentCount !== 1 ? 's' : ''}`,
      sent: sentCount,
      total: guests.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Send reminders error:', error);
    return res.status(500).json({
      error: 'Failed to send reminders',
      detail: error.message,
    });
  }
}
