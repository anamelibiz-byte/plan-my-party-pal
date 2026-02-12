export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    // No Stripe configured — upgrade locally for testing
    return res.status(200).json({ url: null, message: 'Stripe not configured — upgraded locally' });
  }

  const { priceId, tier } = req.body;

  if (!priceId || !tier) {
    return res.status(400).json({ error: 'Missing priceId or tier. Please refresh and try again.' });
  }

  try {
    const stripe = require('stripe')(stripeKey);

    // Determine base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.headers.origin || 'https://planmypartypal.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${baseUrl}/app?upgraded=${tier}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/app?upgrade=canceled`,
      metadata: {
        tier,
        app: 'plan-my-party-pal',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    if (!session || !session.url) {
      console.error('Stripe session created but no URL returned:', session?.id);
      return res.status(500).json({ error: 'Checkout session created but no redirect URL was returned. Please try again.' });
    }

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error.type, error.message);

    // Return user-friendly error messages based on Stripe error type
    let userMessage = 'Something went wrong setting up checkout. Please try again.';
    if (error.type === 'StripeInvalidRequestError') {
      if (error.message.includes('No such price')) {
        userMessage = 'The subscription plan is temporarily unavailable. Please contact support.';
      } else if (error.message.includes('api_key')) {
        userMessage = 'Payment system configuration error. Please contact support.';
      } else {
        userMessage = 'Invalid checkout request. Please refresh the page and try again.';
      }
    } else if (error.type === 'StripeAuthenticationError') {
      userMessage = 'Payment system authentication error. Please contact support.';
    } else if (error.type === 'StripeConnectionError') {
      userMessage = 'Could not connect to payment processor. Please check your internet and try again.';
    }

    return res.status(500).json({
      error: userMessage,
      stripeError: error.type || 'unknown',
      stripeDetail: error.message || 'No details available',
      stripeCode: error.code || null,
    });
  }
}
