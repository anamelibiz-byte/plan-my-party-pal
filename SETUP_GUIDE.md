# 🚀 Backend & Analytics Setup Guide

Complete guide to setting up Resend email service and Google Analytics for your party planner app.

---

## 📧 Part 1: Resend Email Setup

Resend is already integrated into your app! You just need to get an API key and configure it.

### Step 1: Create a Resend Account

1. Go to **[resend.com](https://resend.com)**
2. Click **"Sign Up"** (it's free to start - 100 emails/day, 3,000/month free tier)
3. Verify your email address

### Step 2: Get Your API Key

1. Once logged in, go to **[API Keys](https://resend.com/api-keys)**
2. Click **"Create API Key"**
3. Name it: `Party Planner Production`
4. Click **"Create"**
5. **COPY THE KEY IMMEDIATELY** (you won't see it again!)
   - It will look like: `re_123abc456def789...`

### Step 3: Verify Your Domain (Important!)

**By default, Resend emails come from `onboarding@resend.dev`**. To send from your own domain (`hello@partyplann.com`), you need to verify it:

1. Go to **[Domains](https://resend.com/domains)** in Resend
2. Click **"Add Domain"**
3. Enter your domain: `partyplann.com`
4. Resend will give you DNS records to add
5. Add these DNS records to your domain provider:
   - **If you use Cloudflare, Namecheap, GoDaddy, etc.:**
     - Log into your domain registrar
     - Go to DNS settings
     - Add the TXT, MX, and CNAME records Resend provides
   - Wait 5-30 minutes for DNS propagation
6. Click **"Verify"** in Resend
7. Once verified, update the `from` address in your API files

**For now, you can test with the default `onboarding@resend.dev` sender!**

### Step 4: Add API Key to Environment Variables

You need to set up environment variables. The method depends on your hosting:

#### Option A: Local Development (.env file)

1. Create a file called `.env.local` in the root of your project:
   ```bash
   cd "/Users/anameli/party planner app"
   touch .env.local
   ```

2. Add this line (replace with your actual key):
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

#### Option B: Vercel Deployment

1. Go to your project on **[vercel.com](https://vercel.com)**
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_your_actual_api_key_here`
   - **Environment:** Production, Preview, Development (check all)
4. Click **"Save"**
5. Redeploy your app for changes to take effect

#### Option C: Netlify Deployment

1. Go to your site on **[netlify.com](https://netlify.com)**
2. Click **Site settings** → **Environment variables**
3. Click **"Add a variable"**
   - **Key:** `RESEND_API_KEY`
   - **Value:** `re_your_actual_api_key_here`
4. Click **"Save"**
5. Trigger a new deploy

### Step 5: Test Email Sending

Once your API key is set up, test it:

1. Go to your app: `http://localhost:5173/app`
2. Fill out Step 1 (Basics) with test data:
   - Child's name: `Test Child`
   - Age: `5`
   - Other required fields
3. On the Email Gate (Step 2), enter **your real email**
4. Click **"Show Me Venue Options"**
5. **Check your inbox!** You should receive a welcome email

**If you don't receive it:**
- Check spam folder
- Verify `RESEND_API_KEY` is set correctly
- Check browser console for errors
- Check your Resend dashboard for logs: [resend.com/emails](https://resend.com/emails)

### Step 6: Update Email Sender (After Domain Verification)

Once your domain is verified, update the sender address:

**File:** `api/subscribe.js` (line 125)
```javascript
from: 'Plan My Party Pal <hello@partyplann.com>',
```

**File:** `api/send-checklist.js` (line 26)
```javascript
from: 'Plan My Party Pal <hello@partyplann.com>',
```

Replace `hello@partyplann.com` with whatever email you want to send from (must be on your verified domain).

### What Emails Are Sent?

Your app now sends **2 types of emails**:

1. **Welcome Email** (when user enters email at Email Gate)
   - Sent immediately after Step 1
   - Personalized with child's name
   - Includes link to continue planning

2. **Checklist Email** (when user emails their checklist from Step 6)
   - Sent from the checklist page
   - Contains full party plan with zones
   - Formatted HTML email

---

## 📊 Part 2: Google Analytics Setup

Google Analytics is already integrated - you just need to create an account and add your tracking ID.

### Step 1: Create Google Analytics Account

1. Go to **[analytics.google.com](https://analytics.google.com)**
2. Click **"Start measuring"** or **"Admin"**
3. Create a new account:
   - **Account name:** `Plan My Party Pal`
   - Check all data sharing settings (optional)
   - Click **"Next"**

### Step 2: Create a Property

1. **Property name:** `Party Planner App`
2. **Reporting time zone:** Your time zone
3. **Currency:** Your currency (USD, etc.)
4. Click **"Next"**

### Step 3: Set Up Business Information

1. **Industry:** Education / Entertainment / Other
2. **Business size:** Choose your size
3. Click **"Next"**

### Step 4: Create a Data Stream

1. Choose platform: **Web**
2. **Website URL:** Your production URL
   - If testing locally, use: `http://localhost:5173`
   - For production: `https://partyplann.com`
3. **Stream name:** `Party Planner Website`
4. Click **"Create stream"**

### Step 5: Get Your Measurement ID

After creating the stream, you'll see:
- **Measurement ID:** `G-XXXXXXXXXX` (starts with "G-")

**COPY THIS ID!**

### Step 6: Add Measurement ID to Your App

1. Open `index.html`
2. Find these two lines (near the bottom of `<head>`):
   ```javascript
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```
   and
   ```javascript
   gtag('config', 'GA_MEASUREMENT_ID');
   ```

3. Replace **both** instances of `GA_MEASUREMENT_ID` with your actual ID:
   ```javascript
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
   ```
   and
   ```javascript
   gtag('config', 'G-ABC123XYZ');
   ```

4. Save the file

### Step 7: Test Google Analytics

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Open your app in a browser
3. Open Google Analytics (keep it open in another tab)
4. Go to **Reports** → **Realtime**
5. In your app, navigate through the steps and interact
6. **You should see live events appearing in Google Analytics!**

**Events you'll see:**
- `email_gate_viewed` - When Email Gate loads
- `email_entered` - When user focuses email input
- `email_submitted_success` - When valid email is submitted
- `email_submitted_error` - When invalid email attempted
- `guest_continue_clicked` - When guest mode selected

### Step 8: Create Custom Reports (Optional)

To track Email Gate conversion rates:

1. In Google Analytics, go to **Explore** → **Blank exploration**
2. Name it: `Email Gate Conversion`
3. Add dimensions:
   - `Event name`
4. Add metrics:
   - `Event count`
5. Add a filter:
   - Event name contains: `email_gate` OR `email_` OR `guest_`
6. Save the report

### Step 9: Set Up Conversion Goals

To track email captures as conversions:

1. Go to **Admin** → **Events**
2. Find `email_submitted_success`
3. Toggle **"Mark as conversion"** to ON
4. Do the same for `guest_continue_clicked` if you want to track guest mode

Now you can see conversion rates in your reports!

---

## 🗄️ Part 3: Supabase Database Setup (Optional)

Your app saves emails to localStorage by default. To save to a database:

### Step 1: Create Supabase Project

1. Go to **[supabase.com](https://supabase.com)**
2. Click **"Start your project"** (free tier available)
3. Create a new organization (if needed)
4. Create a new project:
   - **Name:** `party-planner`
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users
5. Wait 2-3 minutes for project to be ready

### Step 2: Create the Subscribers Table

1. In your Supabase project, go to **Table Editor**
2. Click **"Create a new table"**
3. Table name: `subscribers`
4. Add these columns:

| Column Name  | Type        | Default Value | Additional Settings |
|--------------|-------------|---------------|---------------------|
| id           | uuid        | gen_random_uuid() | Primary key |
| email        | text        | -             | Unique, not null |
| source       | text        | -             | - |
| party_data   | jsonb       | null          | Nullable |
| created_at   | timestamptz | now()         | - |
| unsubscribed_at | timestamptz | null       | Nullable |

5. Click **"Save"**

### Step 3: Get API Keys

1. Go to **Settings** → **API**
2. Copy these two values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGc...` (long string)

### Step 4: Add to Environment Variables

Add these to your `.env.local` (or deployment platform):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
RESEND_API_KEY=re_your_resend_key_here
```

### Step 5: Test Database Integration

1. Restart your server
2. Go through Email Gate and submit an email
3. Go to Supabase → **Table Editor** → **subscribers**
4. You should see your email saved!

---

## 📊 Conversion Metrics Dashboard

Once everything is set up, you can track these metrics:

### Key Metrics to Monitor

**In Google Analytics:**
1. **Email Gate Views:** Count of `email_gate_viewed`
2. **Email Submissions:** Count of `email_submitted_success`
3. **Guest Mode:** Count of `guest_continue_clicked`
4. **Validation Errors:** Count of `email_submitted_error`

**Calculate Conversion Rate:**
```
Email Capture Rate = (email_submitted_success / email_gate_viewed) × 100%
```

**Target Conversion Rates (from spec):**
- ✅ Email capture: **70-85%**
- ✅ Guest mode: **15-30%**
- ✅ Validation errors: **<5%**

**In Resend Dashboard:**
1. **Emails Sent:** Total welcome emails
2. **Emails Delivered:** Successfully delivered
3. **Open Rate:** % of emails opened
4. **Click Rate:** % clicking "Continue Planning" link

**In Supabase (if set up):**
- Query subscriber count by source
- Track growth over time
- Export email lists for campaigns

---

## 🧪 Testing Checklist

Before going live, test everything:

### Email Testing:
- [ ] Send test email to yourself
- [ ] Check inbox (not spam)
- [ ] Verify personalization (child's name)
- [ ] Click "Continue Planning" button
- [ ] Test checklist email from Step 6

### Analytics Testing:
- [ ] Open Google Analytics Realtime view
- [ ] Navigate to Email Gate
- [ ] Verify `email_gate_viewed` fires
- [ ] Click email input
- [ ] Verify `email_entered` fires
- [ ] Submit valid email
- [ ] Verify `email_submitted_success` fires
- [ ] Try invalid email
- [ ] Verify `email_submitted_error` fires
- [ ] Click "Continue as Guest"
- [ ] Verify `guest_continue_clicked` fires

### Database Testing (if Supabase enabled):
- [ ] Submit email via Email Gate
- [ ] Check Supabase table for new row
- [ ] Verify JSON data is saved correctly
- [ ] Test duplicate email (should fail gracefully)

---

## 🔐 Security Best Practices

### API Keys:
- ✅ Never commit API keys to Git
- ✅ Add `.env.local` to `.gitignore`
- ✅ Use environment variables on hosting platforms
- ✅ Rotate keys periodically

### Email Sending:
- ✅ Rate limiting already handled by Resend
- ✅ Validate email format (already implemented)
- ✅ Unsubscribe link included (implement unsubscribe page)

### Database:
- ✅ Use Row Level Security (RLS) in Supabase
- ✅ Never expose database credentials in frontend
- ✅ API calls happen server-side only

---

## 🆘 Troubleshooting

### "Email not sending"
- Check `RESEND_API_KEY` is set correctly
- Verify Resend account isn't over free tier limit
- Check Resend dashboard for delivery logs
- Verify "from" email is on verified domain (or use default)

### "Google Analytics not tracking"
- Replace `GA_MEASUREMENT_ID` with actual ID (starts with G-)
- Check browser console for gtag errors
- Disable ad blockers when testing
- Wait 24-48 hours for data to appear in standard reports (Realtime works immediately)

### "Database not saving"
- Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
- Verify table exists and has correct columns
- Check Supabase logs for errors
- Ensure RLS policies allow inserts

### "Environment variables not working"
- Restart dev server after changing `.env.local`
- On Vercel/Netlify, redeploy after adding variables
- Check variable names match exactly (case-sensitive)
- Ensure `.env.local` is in project root

---

## 📈 Next Steps After Setup

1. **Monitor Conversion Rates:**
   - Check Google Analytics weekly
   - Aim for 70-85% email capture rate
   - If below 60%, consider A/B testing

2. **Email Campaigns:**
   - Export subscriber list from Supabase
   - Create drip campaigns in Resend
   - Send party planning tips

3. **A/B Testing:**
   - Test different headlines
   - Test button copy
   - Test social proof numbers

4. **Scale:**
   - Resend free tier: 100/day, 3,000/month
   - Upgrade to Pro when you hit limits ($20/month for 50k emails)
   - Supabase free tier: 500MB database, 2GB bandwidth

---

## 📧 Quick Reference

### Important URLs:
- **Resend Dashboard:** [resend.com/emails](https://resend.com/emails)
- **Google Analytics:** [analytics.google.com](https://analytics.google.com)
- **Supabase Dashboard:** [supabase.com/dashboard](https://supabase.com/dashboard)

### Environment Variables:
```bash
RESEND_API_KEY=re_...         # Required for emails
SUPABASE_URL=https://...      # Optional for database
SUPABASE_ANON_KEY=eyJ...      # Optional for database
```

### Files Modified:
- `api/subscribe.js` - Sends welcome email
- `api/send-checklist.js` - Sends checklist email
- `index.html` - Google Analytics tracking
- `src/components/EmailGate.jsx` - Analytics events

---

**All set! 🎉** Your email capture and analytics are fully integrated. Just add your API keys and you're ready to track conversions!
