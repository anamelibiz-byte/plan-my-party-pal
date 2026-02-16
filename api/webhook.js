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

        // Send confirmation email with subscription details
        if (process.env.RESEND_API_KEY && customerEmail) {
          try {
            // Extract billing details from metadata
            const billingInterval = session.metadata.billingInterval || 'monthly';
            const priceAmount = session.metadata.priceAmount || '4.99';

            // Calculate display values
            const planName = billingInterval === 'yearly'
              ? `Pro - $${priceAmount}/year`
              : `Pro - $${priceAmount}/month`;

            const nextBillingDate = new Date();
            nextBillingDate.setDate(nextBillingDate.getDate() + (billingInterval === 'yearly' ? 365 : 30));
            const formattedNextBilling = nextBillingDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            const formattedToday = new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'Plan My Party Pal <hello@go.partyplann.com>',
                to: [customerEmail],
                subject: '✅ Your Pro Subscription is Confirmed!',
                html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  </head>
                  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

                    <!-- Header -->
                    <div style="text-align: center; padding: 30px 0; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); border-radius: 12px; margin-bottom: 30px;">
                      <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Thank You for Upgrading!</h1>
                    </div>

                    <!-- Greeting -->
                    <p style="font-size: 16px; color: #333;">Hi there,</p>

                    <p style="font-size: 16px; color: #333;">
                      Your Plan My Party Pal <strong>Pro subscription</strong> is now active! We're thrilled to have you as a Pro member.
                    </p>

                    <!-- Subscription Details Box -->
                    <div style="background-color: #fdf2f8; border-left: 4px solid #ec4899; padding: 20px; margin: 30px 0; border-radius: 8px;">
                      <h2 style="margin-top: 0; color: #ec4899; font-size: 20px;">📋 Subscription Details</h2>

                      <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 8px 0; color: #666; font-weight: 600;">Plan:</td>
                          <td style="padding: 8px 0; text-align: right; color: #333; font-weight: bold;">${planName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #666; font-weight: 600;">Subscription Date:</td>
                          <td style="padding: 8px 0; text-align: right; color: #333;">${formattedToday}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #666; font-weight: 600;">Next Billing Date:</td>
                          <td style="padding: 8px 0; text-align: right; color: #333;">${formattedNextBilling}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #666; font-weight: 600;">Amount:</td>
                          <td style="padding: 8px 0; text-align: right; color: #333; font-weight: bold;">$${priceAmount}</td>
                        </tr>
                      </table>

                      <p style="margin: 15px 0 0 0; font-size: 13px; color: #666;">
                        <em>Your subscription will automatically renew on ${formattedNextBilling}.</em>
                      </p>
                    </div>

                    <!-- Pro Features -->
                    <h2 style="color: #333; font-size: 20px; margin-top: 30px;">✨ What You Get with Pro</h2>
                    <ul style="list-style: none; padding: 0; margin: 20px 0;">
                      <li style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                        <span style="color: #10b981; font-weight: bold; margin-right: 8px;">✓</span>
                        <strong>Unlimited Parties</strong> - Create as many events as you want
                      </li>
                      <li style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                        <span style="color: #10b981; font-weight: bold; margin-right: 8px;">✓</span>
                        <strong>Unlimited Guests</strong> - No limit on guest count + RSVP tracking
                      </li>
                      <li style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                        <span style="color: #10b981; font-weight: bold; margin-right: 8px;">✓</span>
                        <strong>Timeline Builder</strong> - Day-of timeline for smooth execution
                      </li>
                      <li style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                        <span style="color: #10b981; font-weight: bold; margin-right: 8px;">✓</span>
                        <strong>PDF Export</strong> - Download checklists and timelines
                      </li>
                      <li style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                        <span style="color: #10b981; font-weight: bold; margin-right: 8px;">✓</span>
                        <strong>Email & SMS</strong> - Send checklists and reminders to guests
                      </li>
                      <li style="padding: 10px 0;">
                        <span style="color: #10b981; font-weight: bold; margin-right: 8px;">✓</span>
                        <strong>Budget Analytics</strong> - Track spending with detailed insights
                      </li>
                    </ul>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 40px 0;">
                      <a href="https://partyplann.com/app" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        Start Planning Your Next Party →
                      </a>
                    </div>

                    <!-- Account Management -->
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
                      <h3 style="margin-top: 0; color: #333; font-size: 18px;">Manage Your Subscription</h3>
                      <p style="margin: 10px 0; color: #666; font-size: 14px;">
                        You can manage your billing, update payment methods, view invoices, or cancel your subscription anytime from your account page.
                      </p>
                      <a href="https://partyplann.com/account" style="color: #ec4899; text-decoration: none; font-weight: 600;">
                        Go to Account Settings →
                      </a>
                    </div>

                    <!-- Footer -->
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 13px;">
                      <p>Thank you for choosing Plan My Party Pal!</p>
                      <p style="margin: 10px 0;">
                        Questions? Reply to this email - we're here to help!
                      </p>
                      <p style="margin-top: 20px;">
                        Plan My Party Pal<br>
                        <a href="https://partyplann.com" style="color: #ec4899; text-decoration: none;">partyplann.com</a>
                      </p>
                    </div>

                  </body>
                  </html>
                `,
              }),
            });
            console.log('✅ Confirmation email sent to:', customerEmail);
          } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
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
