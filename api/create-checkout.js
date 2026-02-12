export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    // No Stripe configured — upgrade locally for testing
    return res.status(200).json({ url: null, message: 'Stripe not configured — upgraded locally' });
  }

  const { priceId, tier } = req.body;

  if (!priceId || !tier) {
    return res.status(400).json({ error: 'Missing priceId or tier' });
  }

  try {
    const stripe = require('stripe')(stripeKey);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription', // Pro tier is always subscription (monthly or yearly)
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || req.headers.origin}/app?upgraded=${tier}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || req.headers.origin}/app?upgrade=canceled`,
      metadata: {
        tier,
        app: 'plan-my-party-pal',
      },
      allow_promotion_codes: true, // Allow promo codes
      billing_address_collection: 'auto',
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
}
