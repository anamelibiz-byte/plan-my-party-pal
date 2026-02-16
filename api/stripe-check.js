import Stripe from 'stripe';

export default async function handler(req, res) {
  const results = {
    timestamp: new Date().toISOString(),
    checks: {},
  };

  // Check 1: Is STRIPE_SECRET_KEY set?
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    results.checks.stripeKey = 'MISSING - not set in Vercel environment variables';
    return res.status(200).json(results);
  }
  results.checks.stripeKey = 'OK - starts with ' + stripeKey.substring(0, 12) + '...';

  // Check 2: Can we load the stripe module?
  let stripe;
  try {
    stripe = new Stripe(stripeKey);
    results.checks.stripeModule = 'OK - stripe module loaded';
  } catch (e) {
    results.checks.stripeModule = 'FAILED - ' + e.message;
    return res.status(200).json(results);
  }

  // Check 3: Can we connect to Stripe API?
  try {
    const balance = await stripe.balance.retrieve();
    results.checks.stripeConnection = 'OK - connected to Stripe';
  } catch (e) {
    results.checks.stripeConnection = 'FAILED - ' + (e.type || '') + ' ' + e.message;
    return res.status(200).json(results);
  }

  // Check 4: Is the monthly price ID valid?
  try {
    const price = await stripe.prices.retrieve('price_1T07BaIVX3wrRyGSVSqVAyVu');
    results.checks.monthlyPrice = 'OK - $' + (price.unit_amount / 100) + '/' + (price.recurring ? price.recurring.interval : 'one-time') + ' active=' + price.active;
  } catch (e) {
    results.checks.monthlyPrice = 'FAILED - ' + (e.type || '') + ' ' + e.message;
  }

  // Check 5: Is the yearly price ID valid?
  try {
    const price = await stripe.prices.retrieve('price_1T031QIVX3wrRyGS8kY6iCcZ');
    results.checks.yearlyPrice = 'OK - $' + (price.unit_amount / 100) + '/' + (price.recurring ? price.recurring.interval : 'one-time') + ' active=' + price.active;
  } catch (e) {
    results.checks.yearlyPrice = 'FAILED - ' + (e.type || '') + ' ' + e.message;
  }

  // Check 6: Can we create a checkout session?
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: 'price_1T07BaIVX3wrRyGSVSqVAyVu', quantity: 1 }],
      mode: 'subscription',
      success_url: 'https://www.partyplann.com/app?upgraded=pro',
      cancel_url: 'https://www.partyplann.com/app',
      metadata: { tier: 'pro', app: 'plan-my-party-pal-test' },
    });
    results.checks.checkoutSession = 'OK - session created: ' + session.id;
    results.checks.checkoutUrl = session.url ? 'OK - URL generated' : 'FAILED - no URL';

    // Expire the test session
    await stripe.checkout.sessions.expire(session.id);
    results.checks.sessionExpired = 'OK - test session cleaned up';
  } catch (e) {
    results.checks.checkoutSession = 'FAILED - ' + (e.type || '') + ' ' + e.message;
  }

  // Check 7: Other env vars
  results.checks.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ? 'OK - set' : 'MISSING';
  results.checks.siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET (will use request origin)';

  return res.status(200).json(results);
}
