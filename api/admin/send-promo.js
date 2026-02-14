import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, message } = req.body;

  // Validate required fields
  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message required' });
  }

  // Initialize services
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({
      success: false,
      error: 'Database not configured'
    });
  }

  if (!resendKey) {
    return res.status(500).json({
      success: false,
      error: 'Email service not configured'
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Fetch all subscribers
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email, party_data')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({
        success: true,
        sent: 0,
        failed: 0,
        message: 'No subscribers found'
      });
    }

    // Send emails in batches
    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      try {
        // Get child name for personalization
        const childName = subscriber.party_data?.childName || 'your child';

        // Personalize message
        const personalizedMessage = message.replace(/{{childName}}/g, childName);

        // Build HTML email
        const emailHtml = `
          <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="background: linear-gradient(135deg, #EC4899, #F43F5E); padding: 40px 24px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; font-size: 28px; margin: 0;">Plan My Party Pal</h1>
            </div>

            <div style="padding: 32px 24px; background: white;">
              <div style="font-size: 16px; color: #374151; line-height: 1.6; white-space: pre-wrap;">
${personalizedMessage}
              </div>

              <div style="text-align: center; margin: 32px 0;">
                <a href="https://planmypartypal.com/app?email=${encodeURIComponent(subscriber.email)}"
                   style="display: inline-block; background: linear-gradient(135deg, #EC4899, #F43F5E); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                  Continue Planning Your Party →
                </a>
              </div>
            </div>

            <div style="padding: 24px; text-align: center; background: #F9FAFB; border-radius: 0 0 16px 16px; border-top: 1px solid #E5E7EB;">
              <p style="font-size: 12px; color: #9CA3AF; margin: 0 0 8px;">
                You're receiving this because you're a Plan My Party Pal subscriber.
              </p>
              <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
                <a href="https://planmypartypal.com/unsubscribe?email=${encodeURIComponent(subscriber.email)}" style="color: #EC4899; text-decoration: none;">Unsubscribe</a>
              </p>
            </div>
          </div>
        `;

        const emailText = `
${personalizedMessage}

Continue planning your party: https://planmypartypal.com/app?email=${encodeURIComponent(subscriber.email)}

---
You're receiving this because you're a Plan My Party Pal subscriber.
Unsubscribe: https://planmypartypal.com/unsubscribe?email=${encodeURIComponent(subscriber.email)}
        `;

        // Send via Resend
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'Plan My Party Pal <hello@go.planmypartypal.com>',
            to: [subscriber.email],
            subject: subject,
            html: emailHtml,
            text: emailText,
          }),
        });

        if (response.ok) {
          sent++;
        } else {
          failed++;
          console.error(`Failed to send to ${subscriber.email}:`, await response.text());
        }

        // Add small delay to avoid rate limiting (100ms between emails)
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (emailError) {
        failed++;
        console.error(`Error sending to ${subscriber.email}:`, emailError);
      }
    }

    return res.status(200).json({
      success: true,
      sent,
      failed,
      total: subscribers.length
    });

  } catch (error) {
    console.error('Send promo error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send promotional emails'
    });
  }
}
