const fs = require('fs');

// Parse .env file
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  if (!line || line.startsWith('#')) return;
  const eqIndex = line.indexOf('=');
  if (eqIndex === -1) return;
  const key = line.substring(0, eqIndex).trim();
  const val = line.substring(eqIndex + 1).trim();
  if (key && val) env[key] = val;
});

const stripeClient = require('stripe')(env.STRIPE_SECRET_KEY);

async function test() {
  console.log('=== Stripe Configuration Test ===\n');
  console.log('Key starts with:', env.STRIPE_SECRET_KEY ? env.STRIPE_SECRET_KEY.substring(0, 12) + '...' : 'MISSING');

  // Test 1: Can we connect to Stripe?
  try {
    const balance = await stripeClient.balance.retrieve();
    console.log('\n1. Stripe connection: OK');
  } catch(e) {
    console.log('\n1. Stripe connection FAILED:', e.type, e.message);
    return;
  }

  // Test 2: Is the monthly price ID valid?
  try {
    const price = await stripeClient.prices.retrieve('price_1Sz4iglVX3wrRyGSNKMMcjLj');
    console.log('2. Monthly price ID: OK -', '$' + price.unit_amount/100, price.currency.toUpperCase(), price.recurring ? price.recurring.interval : 'one-time');
    console.log('   Active:', price.active);
    console.log('   Product:', price.product);
  } catch(e) {
    console.log('2. Monthly price ID FAILED:', e.type, '-', e.message);
  }

  // Test 3: Is the yearly price ID valid?
  try {
    const price = await stripeClient.prices.retrieve('price_1T031QIVX3wrRyGS8kY6iCcZ');
    console.log('3. Yearly price ID: OK -', '$' + price.unit_amount/100, price.currency.toUpperCase(), price.recurring ? price.recurring.interval : 'one-time');
    console.log('   Active:', price.active);
  } catch(e) {
    console.log('3. Yearly price ID FAILED:', e.type, '-', e.message);
  }

  // Test 4: Can we create a checkout session?
  try {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: 'price_1Sz4iglVX3wrRyGSNKMMcjLj', quantity: 1 }],
      mode: 'subscription',
      success_url: 'https://www.planmypartypal.com/app?upgraded=pro&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://www.planmypartypal.com/app?upgrade=canceled',
      metadata: { tier: 'pro', app: 'plan-my-party-pal' },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });
    console.log('4. Checkout session: OK!');
    console.log('   URL:', session.url ? session.url.substring(0, 70) + '...' : 'NO URL');
    console.log('   Session ID:', session.id);

    // Expire it immediately so it doesnt stay open
    await stripeClient.checkout.sessions.expire(session.id);
    console.log('   (Test session expired)');
  } catch(e) {
    console.log('4. Checkout session FAILED:', e.type, '-', e.message);
  }

  console.log('\n=== Test Complete ===');
}

test().catch(e => console.error('Script error:', e.message));
