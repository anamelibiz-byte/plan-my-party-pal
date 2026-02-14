import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, source, partyData } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  let dbSuccess = false;
  let planId = null;

  // Save to database (Supabase)
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Save to subscribers table (for email list)
      const subscriberResponse = await fetch(`${supabaseUrl}/rest/v1/subscribers`, {
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

      if (subscriberResponse.ok || subscriberResponse.status === 201) {
        dbSuccess = true;
      }

      // If this is from email gate with party data, also save to party_plans
      if (source === 'email_gate_step_1' && partyData) {
        const { data, error } = await supabase
          .from('party_plans')
          .insert({
            user_email: email,
            party_data: partyData
          })
          .select()
          .single();

        if (data && !error) {
          planId = data.id;
          console.log('✅ Party plan saved to database:', planId);
        } else if (error) {
          console.error('Party plans save error:', error);
        }
      }
    } catch (error) {
      console.error('Supabase save error:', error);
    }
  }

  // Send welcome email (Resend)
  if (resendKey && source === 'email_gate_step_1' && partyData?.childName) {
    try {
      const childName = partyData.childName;
      const welcomeHtml = `
        <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="background: linear-gradient(135deg, #EC4899, #F43F5E); padding: 40px 24px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; font-size: 28px; margin: 0;">🎉 Welcome to Plan My Party Pal!</h1>
          </div>

          <div style="padding: 32px 24px; background: white;">
            <p style="font-size: 18px; color: #374151; margin: 0 0 16px;">Hi there! 👋</p>

            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 16px;">
              Thank you for starting to plan <strong>${childName}'s party</strong> with us! You're on your way to creating an amazing celebration.
            </p>

            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 24px;">
              Here's what you can do next:
            </p>

            <div style="background: #FFF1F2; border-left: 4px solid #EC4899; padding: 16px; margin: 0 0 24px;">
              <ul style="margin: 0; padding-left: 20px; color: #374151;">
                <li style="margin-bottom: 8px;">Browse venue options near you</li>
                <li style="margin-bottom: 8px;">Choose from 50+ party themes</li>
                <li style="margin-bottom: 8px;">Pick activities perfect for ${childName}'s age</li>
                <li style="margin-bottom: 8px;">Get a custom shopping list with direct links</li>
                <li>Save everything and come back anytime</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="https://planmypartypal.com/app?email=${encodeURIComponent(email)}"
                 style="display: inline-block; background: linear-gradient(135deg, #EC4899, #F43F5E); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Continue Planning Your Party →
              </a>
            </div>

            <p style="font-size: 14px; color: #6B7280; line-height: 1.6; margin: 24px 0 0;">
              <strong>Pro Tip:</strong> Your party details are automatically saved and synced across devices. Click the button above to resume planning from anywhere!
            </p>
          </div>

          <div style="padding: 24px; text-align: center; background: #F9FAFB; border-radius: 0 0 16px 16px; border-top: 1px solid #E5E7EB;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 0 0 8px;">
              You're receiving this because you started planning a party at Plan My Party Pal.
            </p>
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
              Questions? Reply to this email anytime! |
              <a href="https://planmypartypal.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #EC4899; text-decoration: none;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `;

      const welcomeText = `
Welcome to Plan My Party Pal! 🎉

Thank you for starting to plan ${childName}'s party with us! You're on your way to creating an amazing celebration.

Here's what you can do next:
• Browse venue options near you
• Choose from 50+ party themes
• Pick activities perfect for ${childName}'s age
• Get a custom shopping list with direct links
• Save everything and come back anytime

Continue planning your party: https://planmypartypal.com/app?email=${encodeURIComponent(email)}

Pro Tip: Your party details are automatically saved and synced across devices. Click the link above to resume planning from anywhere!

---
You're receiving this because you started planning a party at Plan My Party Pal.
Questions? Reply to this email anytime!
Unsubscribe: https://planmypartypal.com/unsubscribe?email=${encodeURIComponent(email)}
      `;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'Plan My Party Pal <hello@go.planmypartypal.com>',
          to: [email],
          subject: `🎉 Let's plan ${childName}'s perfect party!`,
          html: welcomeHtml,
          text: welcomeText,
        }),
      });
      // Don't fail the request if email fails - just log it
    } catch (error) {
      console.error('Welcome email error:', error);
    }
  }

  // Always return success (frontend has fallback to localStorage)
  return res.status(200).json({
    success: true,
    storage: dbSuccess ? 'database' : 'local',
    emailSent: !!resendKey,
    planId: planId // Return plan ID for frontend to save
  });
}
