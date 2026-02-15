import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return res.status(200).json({ received: true, message: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'];

  try {
    const stripe = new Stripe(stripeKey);
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

        // Save to Supabase users table
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        if (supabaseUrl && supabaseKey) {
          try {
            const supabase = createClient(supabaseUrl, supabaseKey);

            const { error } = await supabase
              .from('users')
              .upsert({
                email: customerEmail,
                tier: tier,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                subscription_status: 'active',
                updated_at: new Date().toISOString(),
              }, {
                onConflict: 'email'
              });

            if (error) {
              console.error('Failed to save user:', error);
            } else {
              console.log('✅ User tier saved to database:', customerEmail, tier);
            }
          } catch (dbError) {
            console.error('Database error:', dbError);
          }
        }

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
                from: 'Plan My Party Pal <hello@go.planmypartypal.com>',
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

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        if (supabaseUrl && supabaseKey) {
          try {
            const supabase = createClient(supabaseUrl, supabaseKey);

            const tier = subscription.status === 'active' ? 'pro' : 'free';

            await supabase
              .from('users')
              .update({
                tier,
                subscription_status: subscription.status,
                subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('stripe_subscription_id', subscription.id);

            console.log('✅ Subscription status updated in database');
          } catch (error) {
            console.error('Failed to update subscription:', error);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('❌ Subscription cancelled:', subscription.customer);

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        if (supabaseUrl && supabaseKey) {
          try {
            const supabase = createClient(supabaseUrl, supabaseKey);

            await supabase
              .from('users')
              .update({
                tier: 'free',
                subscription_status: 'canceled',
                updated_at: new Date().toISOString(),
              })
              .eq('stripe_subscription_id', subscription.id);

            console.log('✅ User downgraded to free tier in database');
          } catch (error) {
            console.error('Failed to downgrade user:', error);
          }
        }
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
