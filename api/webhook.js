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

    console.log('Webhook event received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const tier = session.metadata.tier;
        const customerEmail = session.customer_email;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        console.log('✅ Payment successful:', {
          tier,
          email: customerEmail,
          customerId,
          subscriptionId,
        });

        // TODO: Store in Supabase or your database
        // Example:
        // await supabase.from('users').upsert({
        //   email: customerEmail,
        //   tier: tier,
        //   stripe_customer_id: customerId,
        //   stripe_subscription_id: subscriptionId,
        //   subscription_status: 'active',
        // });

        // Send welcome email
        if (process.env.RESEND_API_KEY && customerEmail) {
          try {
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'Plan My Party Pal <hello@planmypartypal.com>',
                to: [customerEmail],
                subject: '🎉 Welcome to Plan My Party Pal Pro!',
                html: `
                  <h1>Welcome to Pro! 🎉</h1>
                  <p>Thank you for upgrading to Plan My Party Pal Pro!</p>
                  <p>You now have access to:</p>
                  <ul>
                    <li>✅ Unlimited parties</li>
                    <li>✅ Unlimited guests + RSVP tracking</li>
                    <li>✅ AI-powered suggestions</li>
                    <li>✅ Budget analytics</li>
                    <li>✅ And much more!</li>
                  </ul>
                  <p><a href="https://planmypartypal.com/app">Start planning your next party →</a></p>
                `,
              }),
            });
          } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
          }
        }

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription.status);
        // TODO: Update user's subscription status in database
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('❌ Subscription cancelled:', subscription.customer);
        // TODO: Downgrade user to free tier in database
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('⚠️ Payment failed:', invoice.customer_email);
        // TODO: Send payment failure email
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return res.status(400).json({ error: 'Webhook error: ' + error.message });
  }
}

export const config = {
  api: { bodyParser: false },
};
