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

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    // Always return success (security best practice - don't reveal if email exists)
    if (userError || !user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }

    // Generate magic link token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        reset_token: resetToken,
        reset_token_expires: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('email', email);

    if (updateError) {
      throw updateError;
    }

    // Send magic link email
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://partyplann.com';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Plan My Party Pal <hello@go.partyplann.com>',
        to: [email],
        subject: '🔑 Access Your Account - Plan My Party Pal',
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
              <h1 style="color: white; margin: 0; font-size: 28px;">🔑 Access Your Account</h1>
            </div>

            <!-- Content -->
            <div style="padding: 20px 0;">
              <p style="font-size: 16px; color: #333;">Hi there!</p>

              <p style="font-size: 16px; color: #333;">
                You requested to access your Plan My Party Pal account. Click the button below to sign in instantly:
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Sign In to Your Account
                </a>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Or copy and paste this link into your browser:
              </p>
              <p style="font-size: 13px; color: #ec4899; word-break: break-all; background: #fdf2f8; padding: 12px; border-radius: 6px;">
                ${resetUrl}
              </p>

              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 6px;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour for security reasons. If you didn't request this, you can safely ignore this email.
                </p>
              </div>

              <p style="font-size: 14px; color: #666;">
                Need help? Just reply to this email - we're here for you!
              </p>
            </div>

            <!-- Footer -->
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 13px;">
              <p>Plan My Party Pal</p>
              <p style="margin-top: 10px;">
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
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
  } catch (error) {
    console.error('Request reset error:', error);
    return res.status(500).json({
      error: 'Failed to process request',
      detail: error.message,
    });
  }
}
