import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
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

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store or update verification token in database
    const { error: dbError } = await supabase
      .from('users')
      .upsert({
        email: email,
        email_verified: false,
        verification_token: verificationToken,
        verification_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'email'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to create verification token');
    }

    // Send verification email
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://partyplann.com';
    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Party Plann <hello@go.partyplann.com>',
        to: [email],
        subject: '✨ Verify Your Email - Party Plann',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

            <!-- Header -->
            <div style="text-align: center; padding: 30px 20px; background: white; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <img src="${baseUrl}/logo.jpg" alt="Party Plann" style="height: 60px; margin-bottom: 15px;" />
              <h1 style="background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0; font-size: 28px;">✨ Welcome to Party Plann!</h1>
            </div>

            <!-- Content -->
            <div style="padding: 20px 0;">
              <p style="font-size: 16px; color: #333;">Hi there!</p>

              <p style="font-size: 16px; color: #333;">
                Thanks for joining Party Plann! We're excited to help you plan amazing parties.
              </p>

              <p style="font-size: 16px; color: #333;">
                To get started, please verify your email address by clicking the button below:
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Verify Email Address
                </a>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Or copy and paste this link into your browser:
              </p>
              <p style="font-size: 13px; color: #ec4899; word-break: break-all; background: #fdf2f8; padding: 12px; border-radius: 6px;">
                ${verificationUrl}
              </p>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                This link will expire in 24 hours for security reasons.
              </p>

              <p style="font-size: 14px; color: #666;">
                If you didn't create an account with Party Plann, you can safely ignore this email.
              </p>
            </div>

            <!-- Footer -->
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 13px;">
              <p>Need help? Reply to this email - we're here for you!</p>
              <p style="margin-top: 10px;">
                Party Plann<br>
                <a href="https://partyplann.com" style="color: #ec4899; text-decoration: none;">partyplann.com</a>
              </p>
            </div>

          </body>
          </html>
        `,
      }),
    });

    return res.status(200).json({
      success: true,
      message: 'Verification email sent',
    });
  } catch (error) {
    console.error('Send verification error:', error);
    return res.status(500).json({
      error: 'Failed to send verification email',
      detail: error.message,
    });
  }
}
