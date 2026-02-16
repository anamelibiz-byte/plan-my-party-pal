import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Coupon code required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Look up coupon code
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !coupon) {
      return res.status(404).json({
        valid: false,
        error: 'Invalid coupon code',
      });
    }

    // Check if active
    if (!coupon.active) {
      return res.status(400).json({
        valid: false,
        error: 'This coupon is no longer active',
      });
    }

    // Check expiration
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({
        valid: false,
        error: 'This coupon has expired',
      });
    }

    // Check usage limit
    if (coupon.max_uses && coupon.times_used >= coupon.max_uses) {
      return res.status(400).json({
        valid: false,
        error: 'This coupon has reached its usage limit',
      });
    }

    // Valid coupon
    return res.status(200).json({
      valid: true,
      code: coupon.code,
      discount_type: coupon.discount_type, // 'percentage' or 'fixed'
      discount_value: coupon.discount_value,
      description: coupon.description,
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    return res.status(500).json({
      error: 'Failed to validate coupon',
      detail: error.message,
    });
  }
}
