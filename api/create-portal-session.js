import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get email from query or body
  const email = req.method === 'POST' ? req.body.email : req.query.email;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  // Check Stripe configuration
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error('STRIPE_SECRET_KEY not configured');
    return res.status(503).json({ error: 'Billing system not configured' });
  }

  // Check Supabase configuration
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase not configured');
    return res.status(503).json({ error: 'Database not configured' });
  }

  try {
    // 1. Look up customer ID from database
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('stripe_customer_id, tier, subscription_status')
      .eq('email', email)
      .single();

    if (dbError && dbError.code !== 'PGRST116') {
      console.error('Database error:', dbError);
      throw new Error('Database lookup failed');
    }

    if (!user) {
      return res.status(404).json({
        error: 'No account found for this email address.',
      });
    }

    if (!user.stripe_customer_id) {
      return res.status(400).json({
        error: 'No billing account found. Please upgrade to Pro first.',
      });
    }

    // 2. Create Stripe billing portal session
    const stripe = new Stripe(stripeKey);

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.headers.origin ||
      'https://partyplann.com';

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${baseUrl}/account?portal=success`,
    });

    if (!session || !session.url) {
      throw new Error('Failed to create portal session');
    }

    console.log('✅ Portal session created for:', email);

    return res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.error('Portal session error:', error);

    let userMessage = 'Failed to access billing portal. Please try again.';
    let statusCode = 500;

    if (error.type === 'StripeInvalidRequestError') {
      userMessage = 'Billing portal is unavailable. Please contact support.';
      statusCode = 503;
    } else if (error.type === 'StripeAuthenticationError') {
      userMessage = 'Billing system error. Please contact support.';
      statusCode = 503;
    }

    return res.status(statusCode).json({
      error: userMessage,
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
