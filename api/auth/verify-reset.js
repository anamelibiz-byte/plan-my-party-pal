import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Reset token required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find user with this reset token
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('email, reset_token_expires')
      .eq('reset_token', token)
      .single();

    if (fetchError || !user) {
      return res.status(400).json({
        error: 'Invalid or expired reset link',
      });
    }

    // Check if token expired
    if (user.reset_token_expires && new Date(user.reset_token_expires) < new Date()) {
      return res.status(400).json({
        error: 'Reset link has expired. Please request a new one.',
      });
    }

    // Clear reset token (one-time use)
    await supabase
      .from('users')
      .update({
        reset_token: null,
        reset_token_expires: null,
        updated_at: new Date().toISOString(),
      })
      .eq('reset_token', token);

    return res.status(200).json({
      success: true,
      email: user.email,
    });
  } catch (error) {
    console.error('Verify reset error:', error);
    return res.status(500).json({
      error: 'Failed to verify reset link',
      detail: error.message,
    });
  }
}
