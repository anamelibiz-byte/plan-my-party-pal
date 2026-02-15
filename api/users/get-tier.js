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

    const { data, error } = await supabase
      .from('users')
      .select('tier, subscription_status, subscription_current_period_end')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // No user found - they're free tier
    if (!data) {
      return res.status(200).json({
        tier: 'free',
        subscription_status: null,
        verified: false
      });
    }

    // Check if subscription is still active
    const isActive = data.subscription_status === 'active' &&
                    (!data.subscription_current_period_end ||
                     new Date(data.subscription_current_period_end) > new Date());

    return res.status(200).json({
      tier: isActive ? data.tier : 'free',
      subscription_status: data.subscription_status,
      subscription_end: data.subscription_current_period_end,
      verified: true
    });
  } catch (error) {
    console.error('Get tier error:', error);
    return res.status(500).json({ error: 'Failed to get tier' });
  }
}
