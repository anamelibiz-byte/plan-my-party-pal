# Deployment Guide for Plan My Party Pal

## 🚀 Quick Start - Deploy to Vercel (Recommended)

### Prerequisites
- [ ] Domain registered (planmypartypal.com)
- [ ] Stripe account set up with products
- [ ] Supabase account (optional)
- [ ] Resend account for emails (optional)

### Step 1: Prepare Your App

1. **Add the hero image:**
   - Save hero image to: `/public/images/hero-party.jpg`

2. **Update Stripe Price IDs:**
   Edit `src/config/tiers.js`:
   ```javascript
   stripe_price_id: 'price_1Sz4igIVX3wrRyGSNKMMcjLj', // Your monthly price ID
   stripe_price_id_yearly: 'price_1Sz4igIVX3wrRyGSNKMMcjLj_YEARLY', // Your yearly price ID
   ```

3. **Test the build:**
   ```bash
   npm run build
   npm run preview
   ```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Answer the setup questions
   - Choose "Yes" to link to existing project or create new
   - Framework Preset: `Vite`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

### Step 3: Configure Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these (all optional):

```bash
# Supabase (for storing email subscribers)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend (for sending emails)
RESEND_API_KEY=your_resend_api_key

# Stripe (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Step 4: Set Up Custom Domain

1. **In Vercel Dashboard:**
   - Go to Settings → Domains
   - Click "Add Domain"
   - Enter `planmypartypal.com`
   - Also add `www.planmypartypal.com`

2. **Update DNS Records at Your Domain Registrar:**

   Add these records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 3600

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **Wait for DNS Propagation** (5 minutes to 48 hours)
   - Check status: https://dnschecker.org

4. **Enable HTTPS:**
   - Vercel automatically provisions SSL certificates
   - Your site will be available at `https://planmypartypal.com`

---

## 🔧 Post-Deployment Setup

### 1. Create Stripe Products

In Stripe Dashboard (https://dashboard.stripe.com):

**Product 1: Pro Monthly**
- Name: "Plan My Party Pal - Pro"
- Price: $4.99/month
- Billing: Recurring
- Copy the Price ID → Update `src/config/tiers.js`

**Product 2: Pro Yearly**
- Name: "Plan My Party Pal - Pro (Yearly)"
- Price: $29.99/year
- Billing: Recurring (annual)
- Copy the Price ID → Update `src/config/tiers.js`

### 2. Set Up Stripe Checkout

Create `/api/create-checkout.js`:

```javascript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId, tier } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/app?upgrade=success&tier=${tier}`,
      cancel_url: `${req.headers.origin}/app?upgrade=canceled`,
      metadata: {
        tier: tier,
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
```

### 3. Set Up Stripe Webhooks

1. **In Stripe Dashboard:**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://planmypartypal.com/api/stripe-webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.deleted`
     - `customer.subscription.updated`

2. **Copy Webhook Signing Secret**
   - Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

3. **Create webhook handler** `/api/stripe-webhook.js`

### 4. Set Up Email Service (Optional)

**Using Resend (Recommended):**

1. Sign up at https://resend.com
2. Get API key
3. Add to Vercel environment variables: `RESEND_API_KEY`
4. Verify your domain (planmypartypal.com) in Resend
5. Update email "from" address in `/api/send-checklist.js`:
   ```javascript
   from: 'Plan My Party Pal <hello@planmypartypal.com>',
   ```

### 5. Set Up Database (Optional)

**Using Supabase:**

1. Create project at https://supabase.com
2. Create `subscribers` table:
   ```sql
   CREATE TABLE subscribers (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     source TEXT,
     party_data JSONB,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```
3. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Vercel environment variables

---

## 📊 Analytics Setup (Recommended)

### Google Analytics
1. Create GA4 property at https://analytics.google.com
2. Add tracking code to `index.html`:
   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

### Track Key Events
- Landing page visits
- Email captures
- Free signups
- Upgrade modal views
- Pro conversions

---

## ✅ Pre-Launch Checklist

### Testing
- [ ] Landing page loads correctly
- [ ] Email capture works
- [ ] "Start Planning Free" button works
- [ ] Free tier limits are enforced (15 guests max)
- [ ] Upgrade modal appears when hitting limits
- [ ] Stripe checkout flow works
- [ ] Payment success redirects correctly
- [ ] User can plan a party end-to-end

### SEO & Meta Tags
- [ ] Update page titles
- [ ] Add meta descriptions
- [ ] Add Open Graph tags for social sharing
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Submit to Google Search Console

### Legal
- [ ] Add Privacy Policy
- [ ] Add Terms of Service
- [ ] Add Cookie Consent banner
- [ ] GDPR compliance (if serving EU customers)

### Performance
- [ ] Run Lighthouse audit
- [ ] Optimize images
- [ ] Enable caching
- [ ] Set up CDN (Vercel does this automatically)

---

## 🐛 Troubleshooting

### Domain not working?
- Check DNS propagation: https://dnschecker.org
- Verify DNS records are correct
- Wait 24-48 hours for full propagation
- Check Vercel dashboard for domain status

### Stripe checkout failing?
- Verify environment variables are set
- Check Stripe price IDs are correct
- Ensure you're using live mode keys (not test)
- Check browser console for errors

### Emails not sending?
- Verify Resend API key is set
- Check domain is verified in Resend
- Look at Resend dashboard for error logs
- Check spam folder

### Images not loading?
- Ensure images are in `/public/images/` folder
- Check file paths are correct (case-sensitive!)
- Verify images are committed to git
- Clear browser cache

---

## 📈 Post-Launch Monitoring

### Week 1: Watch These Metrics
- Landing page traffic
- Email capture conversion rate
- Free signup rate
- Error rates
- Page load times

### Set Up Alerts
- Vercel: Monitor deployments and errors
- Stripe: Set up notifications for new subscriptions
- Google Analytics: Track goal completions

### Iterate Based on Data
- A/B test landing page headlines
- Test different email capture CTAs
- Optimize upgrade modal messaging
- Adjust pricing if needed

---

## 🆘 Support

If you run into issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Test in incognito mode
4. Check environment variables are set
5. Verify DNS settings

---

## 🎉 You're Live!

Once deployed:
1. Share on social media
2. Add to Product Hunt
3. Set up email drip campaigns
4. Create content marketing strategy
5. Monitor conversion funnel

**Good luck with your launch! 🚀**
