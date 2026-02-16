import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, email } = req.body;

  if (!code || !email) {
    return res.status(400).json({ error: 'Coupon code and email required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validate coupon first
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (couponError || !coupon || !coupon.active) {
      return res.status(400).json({ error: 'Invalid or inactive coupon' });
    }

    // Check if user already used this coupon
    const { data: existingUse } = await supabase
      .from('coupon_uses')
      .select('id')
      .eq('coupon_code', code.toUpperCase())
      .eq('user_email', email)
      .single();

    if (existingUse) {
      return res.status(400).json({
        error: 'You have already used this coupon',
      });
    }

    // Increment usage count
    await supabase
      .from('coupons')
      .update({ times_used: (coupon.times_used || 0) + 1 })
      .eq('code', code.toUpperCase());

    // Record usage
    await supabase
      .from('coupon_uses')
      .insert({
        coupon_code: code.toUpperCase(),
        user_email: email,
        discount_applied: coupon.discount_value,
        used_at: new Date().toISOString(),
      });

    return res.status(200).json({
      success: true,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    return res.status(500).json({
      error: 'Failed to apply coupon',
      detail: error.message,
    });
  }
}
