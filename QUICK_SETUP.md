# ⚡ Quick Setup - 5 Minutes

Fast track to get Resend email and Google Analytics working.

---

## 🎯 What You Need

1. **Resend API Key** - for sending emails
2. **Google Analytics ID** - for tracking conversions

---

## 📧 Step 1: Get Resend API Key (2 minutes)

1. Go to **[resend.com](https://resend.com)** → Sign up (free)
2. Click **[API Keys](https://resend.com/api-keys)** → **"Create API Key"**
3. Copy the key (looks like: `re_123abc...`)

**Add to your app:**

Create `.env.local` file in project root:
```bash
RESEND_API_KEY=re_paste_your_key_here
```

**IMPORTANT:** Use Vercel Dev to test emails locally:
```bash
# Install Vercel CLI (one-time, if not installed):
npm install -g vercel

# Run with API support:
npm run dev:vercel
```

Why? Vite doesn't run API routes. `vercel dev` provides the serverless runtime needed for `/api/*` endpoints.

**Test it:** Fill out Step 1, enter your email at Email Gate, check your inbox!

---

## 📊 Step 2: Get Google Analytics ID (3 minutes)

1. Go to **[analytics.google.com](https://analytics.google.com)** → Create account
2. Create a property → Select **Web**
3. Copy your **Measurement ID** (looks like: `G-ABC123XYZ`)

**Add to your app:**

Open `index.html` and replace `GA_MEASUREMENT_ID` (appears twice) with your ID:

```html
<!-- Change this: -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  gtag('config', 'GA_MEASUREMENT_ID');
</script>

<!-- To this: -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
<script>
  gtag('config', 'G-ABC123XYZ');
</script>
```

Save and reload your app.

**Test it:** Go to Google Analytics → **Realtime**, use your app, see events appear!

---

## ✅ You're Done!

Now your app will:
- ✅ Send welcome emails when users enter their email
- ✅ Send checklist emails from the final step
- ✅ Track all Email Gate interactions in Google Analytics

**Note:** Always use `npm run dev:vercel` (not `npm run dev`) to test email functionality locally.

---

## 📈 Track Your Conversion Rate

**In Google Analytics → Realtime:**
- See `email_gate_viewed` - people seeing the gate
- See `email_submitted_success` - people entering email
- See `guest_continue_clicked` - people choosing guest mode

**Calculate:**
```
Conversion Rate = (email_submitted_success / email_gate_viewed) × 100%
```

**Target: 70-85%** email capture rate

---

## 🚀 For Production Deployment

### If using Vercel:
1. Go to project **Settings** → **Environment Variables**
2. Add: `RESEND_API_KEY` = `re_your_key`
3. Redeploy

### If using Netlify:
1. Go to **Site settings** → **Environment variables**
2. Add: `RESEND_API_KEY` = `re_your_key`
3. Redeploy

---

## 🆘 Not Working?

**Emails not sending:**
- **Are you using `npm run dev:vercel`?** (not `npm run dev`)
  - Vite (`npm run dev`) doesn't support API routes
  - You MUST use `npm run dev:vercel` for emails to work locally
- Check `.env.local` has `RESEND_API_KEY=re_...`
- Check browser console for errors
- Check Resend dashboard: [resend.com/emails](https://resend.com/emails)
- Verify `/api/subscribe` returns 200 (not 404) in Network tab

**Analytics not tracking:**
- Replace **both** `GA_MEASUREMENT_ID` in `index.html`
- Hard refresh browser (Ctrl+Shift+R)
- Disable ad blockers
- Check Google Analytics → Realtime (not standard reports)

---

## 📚 Full Details

See `SETUP_GUIDE.md` for:
- Domain verification for custom sender email
- Supabase database setup
- Advanced analytics configuration
- Troubleshooting guide

---

**That's it! 🎉**

Your email gate is now fully functional with email sending and conversion tracking!
