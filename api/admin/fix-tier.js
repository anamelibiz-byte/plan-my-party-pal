import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, tier, stripe_customer_id, stripe_subscription_id } = req.body;

  if (!email || !tier) {
    return res.status(400).json({ error: 'Email and tier required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update or insert the user with Pro tier
    const updateData = {
      email: email,
      tier: tier,
      subscription_status: 'active',
      updated_at: new Date().toISOString(),
    };

    // Add optional Stripe IDs if provided
    if (stripe_customer_id) {
      updateData.stripe_customer_id = stripe_customer_id;
    }
    if (stripe_subscription_id) {
      updateData.stripe_subscription_id = stripe_subscription_id;
    }

    const { data, error } = await supabase
      .from('users')
      .upsert(updateData, {
        onConflict: 'email'
      });

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${email} to ${tier} tier`,
      data
    });
  } catch (error) {
    console.error('Fix tier error:', error);
    return res.status(500).json({ error: error.message });
  }
}
