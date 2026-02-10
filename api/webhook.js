export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return res.status(200).json({ received: true, message: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'];

  try {
    const stripe = require('stripe')(stripeKey);
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Payment successful:', session.metadata.tier, session.customer_email);
        break;
      }
      case 'customer.subscription.deleted': {
        console.log('Subscription cancelled');
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    return res.status(400).json({ error: 'Webhook error' });
  }
}

export const config = {
  api: { bodyParser: false },
};
