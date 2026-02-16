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

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate unique referral code
    const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    // Check if user already has a referral code
    const { data: existingUser } = await supabase
      .from('users')
      .select('referral_code')
      .eq('email', email)
      .single();

    if (existingUser?.referral_code) {
      return res.status(200).json({
        success: true,
        referral_code: existingUser.referral_code,
        referral_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://partyplann.com'}?ref=${existingUser.referral_code}`,
      });
    }

    // Create or update user with referral code
    const { error } = await supabase
      .from('users')
      .upsert({
        email: email,
        referral_code: referralCode,
        referral_count: 0,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'email'
      });

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      referral_code: referralCode,
      referral_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://partyplann.com'}?ref=${referralCode}`,
    });
  } catch (error) {
    console.error('Create referral error:', error);
    return res.status(500).json({
      error: 'Failed to create referral code',
      detail: error.message,
    });
  }
}
