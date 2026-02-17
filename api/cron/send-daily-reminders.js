import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Security: Verify this is Vercel Cron calling the endpoint
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('🕐 [CRON] Daily RSVP reminder job started at', new Date().toISOString());

  // Initialize Supabase with service key (server-side)
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  try {
    // Calculate tomorrow's date range
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1);

    console.log(`🔍 [CRON] Searching for parties on ${tomorrow.toISOString().split('T')[0]}`);

    // Find all active parties happening tomorrow
    const { data: parties, error: partyError } = await supabase
      .from('party_plans')
      .select('id, user_email, party_data, party_name')
      .gte('party_data->date', tomorrow.toISOString().split('T')[0])
      .lt('party_data->date', nextDay.toISOString().split('T')[0])
      .eq('status', 'active')
      .eq('is_deleted', false);

    if (partyError) throw partyError;

    if (!parties || parties.length === 0) {
      console.log('✅ [CRON] No parties tomorrow. Job complete.');
      return res.status(200).json({
        success: true,
        message: 'No parties tomorrow',
        partiesChecked: 0,
        remindersSent: 0
      });
    }

    console.log(`🎉 [CRON] Found ${parties.length} parties tomorrow`);

    let totalSent = 0;
    let totalErrors = 0;
    const results = [];

    // Process each party
    for (const party of parties) {
      console.log(`📧 [CRON] Processing party: ${party.party_name || party.id}`);

      try {
        // Get pending RSVPs for this party
        const { data: pendingRSVPs, error: rsvpError } = await supabase
          .from('rsvp_responses')
          .select('id, guest_name, email, status')
          .eq('party_id', party.id)
          .eq('status', 'pending');

        if (rsvpError) throw rsvpError;

        if (!pendingRSVPs || pendingRSVPs.length === 0) {
          console.log(`  ℹ️ No pending RSVPs for ${party.party_name}`);
          results.push({
            partyId: party.id,
            partyName: party.party_name,
            sent: 0,
            message: 'No pending RSVPs'
          });
          continue;
        }

        console.log(`  👥 Found ${pendingRSVPs.length} pending RSVPs`);

        // Send reminder emails
        const sentEmails = await sendReminderEmails(party, pendingRSVPs, supabase);

        totalSent += sentEmails.success;
        totalErrors += sentEmails.errors;

        results.push({
          partyId: party.id,
          partyName: party.party_name,
          sent: sentEmails.success,
          errors: sentEmails.errors,
          details: sentEmails.details
        });

      } catch (partyErr) {
        console.error(`  ❌ Error processing party ${party.id}:`, partyErr);
        totalErrors++;
        results.push({
          partyId: party.id,
          partyName: party.party_name,
          error: partyErr.message
        });
      }
    }

    console.log(`✅ [CRON] Job complete. Sent: ${totalSent}, Errors: ${totalErrors}`);

    return res.status(200).json({
      success: true,
      partiesChecked: parties.length,
      remindersSent: totalSent,
      errors: totalErrors,
      results
    });

  } catch (error) {
    console.error('❌ [CRON] Job failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Helper function to send reminder emails
async function sendReminderEmails(party, pendingRSVPs, supabase) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return { success: 0, errors: pendingRSVPs.length, details: 'Resend API key not configured' };
  }

  let success = 0;
  let errors = 0;
  const details = [];

  for (const guest of pendingRSVPs) {
    if (!guest.email) {
      errors++;
      details.push({ guest: guest.guest_name, error: 'No email address' });
      continue;
    }

    try {
      // Generate RSVP link
      const rsvpUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://partyplann.com'}/rsvp/${party.id}`;

      // Get ordinal suffix for age
      const getOrdinal = (num) => {
        const j = num % 10, k = num % 100;
        if (j === 1 && k !== 11) return num + 'st';
        if (j === 2 && k !== 12) return num + 'nd';
        if (j === 3 && k !== 13) return num + 'rd';
        return num + 'th';
      };

      const childName = party.party_data?.childName || 'the birthday child';
      const age = party.party_data?.age ? getOrdinal(party.party_data.age) : '';
      const theme = party.party_data?.theme || '';
      const date = party.party_data?.date ? new Date(party.party_data.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }) : '';
      const venue = party.party_data?.venueName || party.party_data?.venueType || '';

      // Build HTML email
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header with logo -->
    <div style="background: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 3px solid #ec4899;">
      <img src="${process.env.NEXT_PUBLIC_SITE_URL || 'https://partyplann.com'}/logo.jpg" alt="Party Plann" style="height: 50px; margin-bottom: 15px;" />
      <h1 style="background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0; font-size: 28px; font-weight: 700;">🎉 Party Reminder!</h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">Hi ${guest.guest_name || 'there'},</p>

      <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">
        <strong>Tomorrow is ${childName}'s ${age ? age + ' ' : ''}birthday party!</strong> 🎂
      </p>

      <p style="font-size: 16px; color: #374151; margin: 0 0 30px 0;">
        We haven't heard back from you yet. Can you make it? We'd love to have you there!
      </p>

      <!-- Party Details Box -->
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
        <p style="margin: 0 0 10px 0; font-size: 16px; color: #78350f;"><strong>📅 When:</strong> ${date}</p>
        ${theme ? `<p style="margin: 0 0 10px 0; font-size: 16px; color: #78350f;"><strong>🎨 Theme:</strong> ${theme}</p>` : ''}
        ${venue ? `<p style="margin: 0; font-size: 16px; color: #78350f;"><strong>📍 Where:</strong> ${venue}</p>` : ''}
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${rsvpUrl}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 16px;">
          RSVP Now →
        </a>
      </div>

      <p style="font-size: 14px; color: #6b7280; margin: 30px 0 0 0; text-align: center;">
        Please let us know if you can come so we can plan accordingly. Thank you! 💕
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px 0; font-size: 12px; color: #9ca3af;">
        Sent via <strong>Party Plann</strong> ✨
      </p>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://partyplann.com'}" style="color: #ec4899; text-decoration: none;">PartyPlann.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;

      // Send email via Resend
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Party Plann <hello@go.partyplann.com>',
          to: [guest.email],
          subject: `🎉 Reminder: ${childName}'s party is TOMORROW!`,
          html: emailHtml,
        }),
      });

      if (!emailRes.ok) {
        throw new Error(`Resend API error: ${emailRes.status}`);
      }

      // Update last_reminded timestamp
      await supabase
        .from('rsvp_responses')
        .update({ last_reminded: new Date().toISOString() })
        .eq('id', guest.id);

      success++;
      console.log(`    ✅ Sent reminder to ${guest.email}`);

      // Rate limiting: 500ms delay between emails
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (emailErr) {
      console.error(`    ❌ Failed to send to ${guest.email}:`, emailErr);
      errors++;
      details.push({ guest: guest.guest_name, email: guest.email, error: emailErr.message });
    }
  }

  return { success, errors, details };
}
