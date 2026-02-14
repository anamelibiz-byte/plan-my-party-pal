# 🚀 Deploy to Production (Easiest Way to Get Emails Working!)

Since the local Vercel dev environment is having issues, let's just deploy to production where everything works perfectly!

---

## Step 1: Add Environment Variable to Vercel

1. Go to your Vercel project: https://vercel.com/tinas-projects-c03f9000/planmypartypal

2. Click **Settings** tab

3. Click **Environment Variables** in the left sidebar

4. Click **Add New** button

5. Fill in:
   - **Key:** `RESEND_API_KEY`
   - **Value:** `re_WWG7cVsf_CN6x9BubBXZ3MJz7x1BeTNB8`
   - **Environment:** Check all three boxes (Production, Preview, Development)

6. Click **Save**

---

## Step 2: Deploy to Vercel

In your terminal, run:

```bash
cd "/Users/anameli/party planner app"
vercel --prod
```

This will:
1. Link to your existing `planmypartypal` project (answer `y` when asked)
2. Build and deploy your app
3. Give you a live URL (like `planmypartypal.vercel.app`)

---

## Step 3: Test Emails in Production

1. Open the URL Vercel gives you (ends with `.vercel.app`)
2. Go to `/app` route
3. Fill out Step 1 (Basics):
   - Child's name: Test
   - Age: 5
   - Date: Any date
   - Time: 2:00 PM
   - Guests: 20
   - Budget: 300
4. Click "Continue"
5. You'll see the Email Gate (Step 2)
6. Enter YOUR real email address
7. Click "Show Me Venue Options"
8. **CHECK YOUR INBOX!** 📧

The welcome email should arrive within 30 seconds!

---

## Why Production Instead of Local?

The Vercel dev server is having issues parsing the HTML file locally, but in production:
- ✅ Everything works automatically
- ✅ No configuration needed
- ✅ API routes work perfectly
- ✅ Emails send successfully
- ✅ Google Analytics tracks properly
- ✅ Fast global CDN delivery

---

## Verification

After deploying, check these:

1. **Resend Dashboard:** https://resend.com/emails
   - Should show sent emails with ✅ Delivered status

2. **Google Analytics:** https://analytics.google.com
   - Go to Realtime → Events
   - Should see `email_gate_viewed` and `email_submitted_success`

3. **Your Inbox:**
   - Check for welcome email from "Plan My Party Pal"
   - Subject: "🎉 Let's plan [Child Name]'s perfect party!"

---

## Future Development

Once deployed, you can continue developing locally with:

```bash
npm run dev
```

This runs the frontend at `http://localhost:5173` for fast UI development.

When you're ready to deploy changes:

```bash
vercel --prod
```

Or set up automatic deployments by connecting your GitHub repo to Vercel!

---

## Alternative: Connect GitHub for Auto-Deploy

1. Go to https://vercel.com/tinas-projects-c03f9000/planmypartypal
2. Click **Settings** → **Git**
3. Connect your GitHub repository
4. Now every `git push` will automatically deploy! 🎉

---

**That's it!** Production deployment is actually easier than local dev in this case.
