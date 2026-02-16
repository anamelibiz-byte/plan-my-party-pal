import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.query;

  if (!session_id || !session_id.startsWith('cs_')) {
    return res.status(400).json({ error: 'Invalid session_id' });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(200).json({ verified: false, error: 'Stripe not configured' });
  }

  try {
    const stripe = new Stripe(stripeKey);

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Verify payment succeeded
    if (session.payment_status === 'paid') {
      return res.status(200).json({
        verified: true,
        tier: session.metadata.tier || 'pro',
        email: session.customer_email,
        billingInterval: session.metadata.billingInterval || 'monthly',
        priceAmount: session.metadata.priceAmount || '4.99',
      });
    } else {
      return res.status(200).json({
        verified: false,
        paymentStatus: session.payment_status,
      });
    }
  } catch (error) {
    console.error('Session verification error:', error);
    return res.status(500).json({
      verified: false,
      error: error.message,
    });
  }
}
