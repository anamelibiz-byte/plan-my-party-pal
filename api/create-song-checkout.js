import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return res.status(500).json({ error: 'Stripe not configured' });

  const { email, discountMode } = req.body || {};
  const isDiscount = discountMode === true;

  try {
    const stripe = new Stripe(stripeKey);
    const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://partyplann.com';
    const baseUrl = rawUrl.trim().replace(/\/$/, '') || 'https://partyplann.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: isDiscount ? 'Custom Birthday Song — Returning Customer' : 'Custom Birthday Song',
            description: isDiscount
              ? 'Another personalized AI-generated birthday song at a special returning customer rate'
              : 'A personalized AI-generated birthday song — ready in ~60 seconds',
          },
          unit_amount: isDiscount ? 499 : 1499, // $4.99 or $14.99
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: email || undefined,
      success_url: `${baseUrl}/song/build?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/song`,
      metadata: { app: 'party-plann', product: 'custom-song' },
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Song checkout error:', error.type, error.message);
    return res.status(500).json({
      error: 'Failed to create checkout session. Please try again.',
      stripeError: error.type || 'unknown',
      stripeDetail: error.message || 'No details',
    });
  }
}
