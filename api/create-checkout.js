export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(200).json({ url: null, message: 'Stripe not configured — upgraded locally' });
  }

  const { priceId, tier } = req.body;

  try {
    const stripe = require('stripe')(stripeKey);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: tier === 'plus' ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || req.headers.origin}/?upgraded=${tier}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || req.headers.origin}/`,
      metadata: { tier },
    });
    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
