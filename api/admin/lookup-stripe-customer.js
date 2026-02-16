import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  try {
    const stripe = new Stripe(stripeKey);

    // Search for customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return res.status(404).json({ error: 'No Stripe customer found for this email' });
    }

    const customer = customers.data[0];

    // Get their subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 1,
    });

    return res.status(200).json({
      customer_id: customer.id,
      email: customer.email,
      subscription_id: subscriptions.data.length > 0 ? subscriptions.data[0].id : null,
      subscription_status: subscriptions.data.length > 0 ? subscriptions.data[0].status : null,
    });
  } catch (error) {
    console.error('Lookup error:', error);
    return res.status(500).json({ error: error.message });
  }
}
