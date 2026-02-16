import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.query;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's referral stats
    const { data: user, error } = await supabase
      .from('users')
      .select('referral_code, referral_count')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      referral_code: user.referral_code,
      referral_count: user.referral_count || 0,
      referral_url: user.referral_code
        ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://partyplann.com'}?ref=${user.referral_code}`
        : null,
    });
  } catch (error) {
    console.error('Get referral stats error:', error);
    return res.status(500).json({
      error: 'Failed to get referral stats',
      detail: error.message,
    });
  }
}
