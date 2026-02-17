import { createClient } from '@supabase/supabase-js';

// Automated welcome email series for new users
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, trigger } = req.body; // trigger: 'signup' | 'day3' | 'day7'

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    let emailContent = {};

    // EMAIL 1: Immediate Welcome (triggered on signup)
    if (trigger === 'signup') {
      emailContent = {
        subject: '🎉 Welcome to Party Plann!',
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; padding: 30px 0; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); border-radius: 12px; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to Party Plann!</h1>
            </div>

            <p style="font-size: 16px;">Hi there!</p>

            <p>We're thrilled to have you join thousands of parents planning stress-free, memorable parties!</p>

            <h3 style="color: #ec4899;">✨ Here's what you can do:</h3>
            <ul>
              <li>Create unlimited parties (Pro feature)</li>
              <li>Manage guest lists & RSVPs</li>
              <li>Track your budget in real-time</li>
              <li>Build day-of timelines</li>
              <li>Send invitations via email & SMS</li>
            </ul>

            <div style="text-align: center; margin: 40px 0;">
              <a href="https://partyplann.com/app" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold;">
                Start Planning Your First Party →
              </a>
            </div>

            <p style="color: #666; font-size: 14px;">Need help? Just reply to this email - we're here for you!</p>
          </body>
          </html>
        `,
      };
    }

    // EMAIL 2: Day 3 - Tips & Tricks
    else if (trigger === 'day3') {
      emailContent = {
        subject: '💡 3 Tips to Plan Like a Pro',
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; padding: 30px 0; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); border-radius: 12px; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">💡 Plan Like a Pro</h1>
            </div>

            <p>Hi! We noticed you started planning with us - here are 3 tips to make your party amazing:</p>

            <div style="background: #fdf2f8; border-left: 4px solid #ec4899; padding: 15px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #ec4899;">1. Start with a Template</h4>
              <p>Save time by using our pre-made party templates. Just customize to your needs!</p>
            </div>

            <div style="background: #fdf2f8; border-left: 4px solid #ec4899; padding: 15px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #ec4899;">2. Set Your Budget Early</h4>
              <p>Use the budget tracker from day 1 to avoid overspending. You'll thank yourself later!</p>
            </div>

            <div style="background: #fdf2f8; border-left: 4px solid #ec4899; padding: 15px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #ec4899;">3. Send RSVPs 3 Weeks Out</h4>
              <p>Get a headcount early so you can finalize food, activities, and party favors.</p>
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="https://partyplann.com/app" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold;">
                Continue Planning →
              </a>
            </div>
          </body>
          </html>
        `,
      };
    }

    // EMAIL 3: Day 7 - Upgrade Prompt
    else if (trigger === 'day7') {
      emailContent = {
        subject: '🎁 Unlock Pro Features - Limited Time Offer',
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; padding: 30px 0; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); border-radius: 12px; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎁 Ready to Go Pro?</h1>
            </div>

            <p>You've been planning for a week now - how's it going?</p>

            <p>Pro members get access to:</p>
            <ul>
              <li>✨ Unlimited parties & guests</li>
              <li>📧 Email & SMS invitations</li>
              <li>📥 PDF export for checklists</li>
              <li>📊 Advanced budget analytics</li>
              <li>⏰ Timeline builder</li>
            </ul>

            <div style="background: #fff3cd; border: 2px solid #ffc107; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <h3 style="margin-top: 0; color: #f59e0b;">🎉 Special Offer</h3>
              <p style="font-size: 18px; font-weight: bold; color: #333;">Get 20% off your first month!</p>
              <p style="font-size: 14px; color: #666;">Use code: <strong>WELCOME20</strong></p>
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="https://partyplann.com/app" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold;">
                Upgrade to Pro →
              </a>
            </div>
          </body>
          </html>
        `,
      };
    }

    // Send email
    if (emailContent.subject) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Party Plann <hello@go.partyplann.com>',
          to: [email],
          subject: emailContent.subject,
          html: emailContent.html,
        }),
      });

      return res.status(200).json({
        success: true,
        message: `${trigger} email sent`,
      });
    }

    return res.status(400).json({ error: 'Invalid trigger' });
  } catch (error) {
    console.error('Welcome series error:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      detail: error.message,
    });
  }
}
