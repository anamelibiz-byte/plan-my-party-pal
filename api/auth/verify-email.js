import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Verification token required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find user with this verification token
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('email, email_verified, verification_expires_at')
      .eq('verification_token', token)
      .single();

    if (fetchError || !user) {
      return res.status(400).json({
        error: 'Invalid or expired verification token',
      });
    }

    // Check if already verified
    if (user.email_verified) {
      return res.status(200).json({
        success: true,
        message: 'Email already verified',
        email: user.email,
      });
    }

    // Check if token expired
    if (user.verification_expires_at && new Date(user.verification_expires_at) < new Date()) {
      return res.status(400).json({
        error: 'Verification link has expired. Please request a new one.',
      });
    }

    // Mark email as verified
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email_verified: true,
        verification_token: null,
        verification_expires_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('verification_token', token);

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      email: user.email,
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json({
      error: 'Failed to verify email',
      detail: error.message,
    });
  }
}
