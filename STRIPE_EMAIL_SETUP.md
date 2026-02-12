# Stripe & Email Service Setup Guide

## 🎯 Quick Setup Checklist

- [ ] Create Stripe products and get price IDs
- [ ] Add Stripe environment variables to Vercel
- [ ] Set up Stripe webhook
- [ ] Create Resend account and verify domain
- [ ] Add Resend API key to Vercel
- [ ] Test payment flow
- [ ] Test email sending

---

## Part 1: Stripe Setup (15 minutes)

### Step 1: Create Stripe Products

1. **Go to Stripe Dashboard:**
   - https://dashboard.stripe.com/products
   - Make sure you're in **LIVE MODE** (toggle in top right)

2. **Create Product: Pro Monthly**
   - Click "+ New product"
   - **Product name:** Plan My Party Pal - Pro
   - **Description:** Unlimited parties, unlimited guests, AI-powered suggestions, RSVP tracking, and more!
   - **Image:** Upload a party planning image (optional)

   **Pricing:**
   - Click "Add pricing"
   - **Price:** $4.99 USD
   - **Billing period:** Monthly
   - **Payment type:** Recurring
   - Click "Add pricing"

   - **Copy the Price ID:** `price_xxxxxxxxxxxxx`
   - Save this! You'll need it in Step 2.

3. **Add Yearly Pricing to Same Product**
   - On the same product page, click "Add another price"
   - **Price:** $29.99 USD
   - **Billing period:** Yearly
   - **Payment type:** Recurring
   - Click "Add pricing"

   - **Copy the Price ID:** `price_yyyyyyyyyyyyyyy`
   - Save this! You'll need it in Step 2.

### Step 2: Update Your Code with Price IDs

Edit `/Users/anameli/party planner app/src/config/tiers.js`:

```javascript
export const TIERS = {
  // ... free tier ...

  pro: {
    id: 'pro',
    name: 'Pro',
    price: 4.99,
    priceLabel: '$4.99/month',
    priceYearly: 29.99,
    priceYearlyLabel: '$29.99/year',
    billing: 'monthly',
    stripe_price_id: 'price_xxxxxxxxxxxxx',  // ← PASTE YOUR MONTHLY PRICE ID HERE
    stripe_price_id_yearly: 'price_yyyyyyyyyyyyyyy',  // ← PASTE YOUR YEARLY PRICE ID HERE
    // ... rest of config
  },
};
```

### Step 3: Add Stripe Environment Variables

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Click on your "plan-my-party-pal" project
   - Go to **Settings** → **Environment Variables**

2. **Add these variables:**

   **Variable 1: STRIPE_SECRET_KEY**
   - Get from: https://dashboard.stripe.com/apikeys
   - Click "Reveal test key token" (or use live key if ready)
   - Copy the secret key (starts with `sk_live_...` or `sk_test_...`)
   - In Vercel: Name = `STRIPE_SECRET_KEY`, Value = paste the key
   - Environment: **Production, Preview, Development**

   **Variable 2: STRIPE_WEBHOOK_SECRET**
   - We'll get this in Step 4, leave blank for now

### Step 4: Set Up Stripe Webhook

1. **In Stripe Dashboard:**
   - Go to: https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"

2. **Configure Endpoint:**
   - **Endpoint URL:** `https://planmypartypal.com/api/webhook`
   - **Description:** Plan My Party Pal subscription events

   **Select events to listen to:**
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_failed`
   - ✅ `invoice.payment_succeeded`

   - Click "Add endpoint"

3. **Get Webhook Signing Secret:**
   - After creating the endpoint, click on it
   - Click "Reveal" under "Signing secret"
   - Copy the secret (starts with `whsec_...`)

4. **Add to Vercel:**
   - Go back to Vercel → Settings → Environment Variables
   - Add variable:
     - Name: `STRIPE_WEBHOOK_SECRET`
     - Value: paste the signing secret
     - Environment: **Production, Preview, Development**

### Step 5: Redeploy

After adding environment variables, redeploy:

```bash
cd "/Users/anameli/party planner app"
git add -A
git commit -m "Update Stripe configuration with live price IDs"
git push origin main
```

Vercel will automatically redeploy with the new environment variables.

---

## Part 2: Resend Email Setup (10 minutes)

### Step 1: Create Resend Account

1. **Sign up:** https://resend.com/signup
2. **Verify your email**
3. **Go to API Keys:** https://resend.com/api-keys

### Step 2: Get API Key

1. Click "Create API Key"
2. **Name:** Plan My Party Pal Production
3. **Permission:** Full access (or Sending access)
4. Click "Add"
5. **Copy the API key** (starts with `re_...`)
   - ⚠️ Save this now! You can't see it again.

### Step 3: Add to Vercel

1. **Go to Vercel:**
   - Dashboard → Your project → Settings → Environment Variables

2. **Add variable:**
   - Name: `RESEND_API_KEY`
   - Value: paste your Resend API key
   - Environment: **Production, Preview, Development**
   - Click "Save"

### Step 4: Verify Your Domain (Important!)

To send emails from `hello@planmypartypal.com`:

1. **In Resend Dashboard:**
   - Go to: https://resend.com/domains
   - Click "Add Domain"
   - Enter: `planmypartypal.com`
   - Click "Add"

2. **Add DNS Records:**
   - Resend will show you DNS records to add
   - Go to your domain registrar (where you bought planmypartypal.com)
   - Add these DNS records (usually 3-4 TXT records)

   **Example records (yours will be different):**
   ```
   Type: TXT
   Name: resend._domainkey
   Value: [long value provided by Resend]

   Type: TXT
   Name: @
   Value: [SPF record provided by Resend]
   ```

3. **Verify:**
   - Wait 5-10 minutes for DNS propagation
   - In Resend, click "Verify" on your domain
   - Once verified, you can send emails from `hello@planmypartypal.com`!

### Step 5: Redeploy

```bash
cd "/Users/anameli/party planner app"
git push origin main
```

---

## Part 3: Testing (10 minutes)

### Test 1: Email Capture (Free)

1. **Go to:** https://planmypartypal.com
2. **Enter your email** in the email capture form
3. **Check:**
   - Browser console for errors
   - Your email inbox for welcome email
   - Supabase dashboard (if configured) to see subscriber

### Test 2: Payment Flow (Use Stripe Test Mode First!)

**For testing, use Stripe TEST mode:**

1. **Switch to test mode** in Stripe dashboard (toggle top right)
2. **Get test price IDs** (they start with `price_test_...`)
3. **Update tiers.js temporarily** with test price IDs
4. **Deploy** and test

**Test the flow:**

1. **Go to:** https://planmypartypal.com/app
2. **Try to add 16th guest** → Upgrade modal should appear
3. **Click "Upgrade to Pro"**
4. **Use test card:** `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any 5-digit ZIP
5. **Complete checkout**
6. **You should be redirected back** with success message

**Check Stripe Dashboard:**
- Go to: https://dashboard.stripe.com/test/payments
- You should see the test payment
- Check: https://dashboard.stripe.com/test/subscriptions
- You should see the test subscription

**Check Webhook:**
- Go to: https://dashboard.stripe.com/test/webhooks
- Click on your webhook
- Check recent events - should see `checkout.session.completed`

### Test 3: Email Sending (Pro Feature)

1. **In the app**, complete a party checklist
2. **Click "Email Your Checklist"**
3. **Enter your email**
4. **Check your inbox** - should receive formatted party checklist

---

## Part 4: Go Live! (5 minutes)

Once testing is complete:

1. **Switch Stripe to LIVE mode:**
   - Update `tiers.js` with **live** price IDs (start with `price_...`, not `price_test_...`)
   - Commit and push

2. **Update Vercel environment variables:**
   - Use **live** Stripe secret key (`sk_live_...`)
   - Use **live** webhook secret

3. **Update Stripe webhook:**
   - Create a NEW webhook for production
   - Use live mode keys

4. **Monitor:**
   - Stripe Dashboard → Payments
   - Check webhook deliveries
   - Monitor email sending in Resend dashboard

---

## 📊 What Emails Get Sent?

### 1. **Landing Page Email Capture**
- **Trigger:** User submits email on landing page
- **Content:** Welcome + free checklist PDF (not implemented yet)
- **Sender:** `hello@planmypartypal.com`

### 2. **Pro Upgrade Welcome Email**
- **Trigger:** Successful payment (Stripe webhook)
- **Content:** Welcome to Pro + feature list
- **Sender:** `hello@planmypartypal.com`
- **Location:** `/api/webhook.js` (line ~47)

### 3. **Party Checklist Email**
- **Trigger:** User clicks "Email Your Checklist" (Pro only)
- **Content:** Complete party plan with zones, budget, activities
- **Sender:** `hello@planmypartypal.com`
- **Location:** `/api/send-checklist.js`

---

## 🐛 Troubleshooting

### Stripe Issues

**Problem: "Stripe not configured" message**
- ✅ Check environment variables are set in Vercel
- ✅ Redeploy after adding variables
- ✅ Check price IDs are correct in `tiers.js`

**Problem: Checkout fails**
- ✅ Check browser console for errors
- ✅ Verify price ID exists in Stripe
- ✅ Make sure you're using same mode (test/live) everywhere
- ✅ Check `/api/create-checkout.js` logs in Vercel

**Problem: Webhook not receiving events**
- ✅ Check webhook URL is correct: `https://planmypartypal.com/api/webhook`
- ✅ Verify webhook secret matches Vercel env variable
- ✅ Check "Recent events" in Stripe webhook dashboard
- ✅ Look for errors in webhook delivery attempts

### Email Issues

**Problem: Emails not sending**
- ✅ Check Resend API key is set in Vercel
- ✅ Verify domain in Resend dashboard (must show "Verified")
- ✅ Check DNS records are correctly configured
- ✅ Look at Resend logs: https://resend.com/emails

**Problem: Emails going to spam**
- ✅ Make sure domain is verified
- ✅ All DNS records (SPF, DKIM) are properly set
- ✅ Send test email to yourself and check spam folder
- ✅ Consider adding DMARC record

**Problem: "Email service not configured"**
- ✅ `RESEND_API_KEY` must be set in Vercel
- ✅ Redeploy after adding the variable
- ✅ Check the variable name is exact (case-sensitive)

---

## 🔐 Security Checklist

- [ ] Never commit API keys to git
- [ ] Use environment variables for all secrets
- [ ] Test in Stripe test mode first
- [ ] Verify webhook signature (already implemented)
- [ ] Use HTTPS only (Vercel does this automatically)
- [ ] Monitor Stripe dashboard for unusual activity
- [ ] Set up Stripe email notifications for payments

---

## 💡 Pro Tips

1. **Test thoroughly in test mode** before going live
2. **Set up Stripe email notifications** for new subscriptions
3. **Monitor webhook delivery** in Stripe dashboard
4. **Check Resend logs** regularly for email delivery issues
5. **Add promo codes** in Stripe for launch discounts
6. **Set up billing alerts** in Stripe
7. **Create saved replies** in support system for common questions

---

## 📈 Monitoring After Launch

### Daily Checks (First Week)
- ✅ Stripe dashboard - new subscriptions
- ✅ Webhook delivery success rate
- ✅ Resend dashboard - email delivery rate
- ✅ Vercel logs - API errors

### Weekly Checks
- ✅ Conversion rate (free → pro)
- ✅ Churn rate (cancellations)
- ✅ Email open rates
- ✅ Support tickets related to payments

---

## 🎉 You're All Set!

Your payment and email systems are now ready! Users can:
- ✅ Sign up for free
- ✅ Upgrade to Pro via Stripe
- ✅ Receive welcome emails
- ✅ Email their party checklists

**Next steps:**
1. Create the free checklist PDF for lead magnet
2. Set up email drip campaigns
3. Add analytics tracking
4. Monitor conversion funnel

Good luck with your launch! 🚀
