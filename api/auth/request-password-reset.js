import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Find user
    const { data: user } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    // Save reset token
    await supabase
      .from('users')
      .update({
        reset_token: resetToken,
        reset_token_expires: expiresAt.toISOString()
      })
      .eq('id', user.id);

    // Send reset email if Resend is configured
    if (resendKey) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://partyplann.com';
      const resetUrl = `${baseUrl}/reset-password-form?token=${resetToken}`;

      const emailHtml = `
        <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="background: linear-gradient(135deg, #EC4899, #F43F5E); padding: 40px 24px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; font-size: 28px; margin: 0;">🔒 Password Reset</h1>
          </div>

          <div style="padding: 32px 24px; background: white;">
            <p style="font-size: 18px; color: #374151; margin: 0 0 16px;">Hi there,</p>

            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 24px;">
              We received a request to reset your password for your Party Plann account. Click the button below to set a new password:
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}"
                 style="display: inline-block; background: linear-gradient(135deg, #EC4899, #F43F5E); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Reset Your Password
              </a>
            </div>

            <p style="font-size: 14px; color: #6B7280; line-height: 1.6; margin: 24px 0 0;">
              This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>

            <p style="font-size: 12px; color: #9CA3AF; margin: 24px 0 0; padding-top: 24px; border-top: 1px solid #E5E7EB;">
              If the button doesn't work, copy and paste this link:<br/>
              <a href="${resetUrl}" style="color: #EC4899; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>

          <div style="padding: 24px; text-align: center; background: #F9FAFB; border-radius: 0 0 16px 16px; border-top: 1px solid #E5E7EB;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
              Party Plann | <a href="${baseUrl}" style="color: #EC4899; text-decoration: none;">partyplann.com</a>
            </p>
          </div>
        </div>
      `;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'Party Plann <hello@go.partyplann.com>',
          to: [user.email],
          subject: '🔒 Reset Your Password - Party Plann',
          html: emailHtml,
        }),
      });
    }

    return res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    return res.status(500).json({ error: 'An error occurred processing your request' });
  }
}
