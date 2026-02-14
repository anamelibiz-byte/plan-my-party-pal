# 🔗 Link to Your Existing Vercel Project

## The Problem
You got a project name validation error because the setup tried to create a NEW project with spaces in the name.

## The Solution
Link to your EXISTING project: `planmypartypal`

---

## Step-by-Step Instructions

### 1. Open YOUR Terminal (not Claude interface)

### 2. Navigate to project folder
```bash
cd "/Users/anameli/party planner app"
```

### 3. Start Vercel Dev
```bash
npm run dev:vercel
```

### 4. Answer the questions DIFFERENTLY this time:

**Question 1:** `Set up and develop "~/party planner app"? [Y/n]`
**Answer:** Type `y` and press Enter

**Question 2:** `Which scope should contain your project?`
**Answer:** Just press Enter (use default scope)

**Question 3:** `Link to existing project? [y/N]`
**⚠️ IMPORTANT - Answer YES this time:**
**Answer:** Type `y` and press Enter

**Question 4:** `What's the name of your existing project?`
**Answer:** Type `planmypartypal` and press Enter
(This is your existing project name from https://vercel.com/tinas-projects-c03f9000/planmypartypal)

**Done!** ✅ It should now link to your existing project and start the dev server.

---

## What You'll See When It Works

```
Vercel CLI 33.x.x
? Set up and develop "~/party planner app"? Yes
? Which scope should contain your project? Your Scope
? Link to existing project? Yes
? What's the name of your existing project? planmypartypal
🔗 Linked to tinas-projects-c03f9000/planmypartypal (created .vercel and added it to .gitignore)
> Ready! Available at http://localhost:3000
```

---

## Then Test Emails

1. Open browser: `http://localhost:3000/app`
2. Fill out Step 1 (Basics):
   - Child's name: Test
   - Age: 5
   - Date: Any date
   - Time: 2:00 PM
   - Guests: 20
   - Budget: 300
3. Click "Continue"
4. You'll see the Email Gate (Step 2)
5. Enter YOUR real email address
6. Click "Show Me Venue Options"
7. **CHECK YOUR INBOX!** 📧

The welcome email should arrive within 30 seconds.

---

## If It Still Doesn't Work

**Try removing the .vercel folder first:**
```bash
cd "/Users/anameli/party planner app"
rm -rf .vercel
npm run dev:vercel
```

Then answer the questions as shown above.

---

## Alternative: Deploy to Production

If local dev is too complicated, you can deploy to production where emails will work automatically:

### Add API Key to Vercel Project
1. Go to: https://vercel.com/tinas-projects-c03f9000/planmypartypal
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - Name: `RESEND_API_KEY`
   - Value: `re_FDkVyG8r_DsHBKPr9rwSKDv1tLdJKYe9X`
   - Scope: **Production, Preview, Development** (check all)
4. Click **Save**

### Deploy
```bash
cd "/Users/anameli/party planner app"
vercel --prod
```

Or just push to GitHub and Vercel will auto-deploy!

---

**🎯 Bottom Line:**

When asked "Link to existing project?", answer **YES** (`y`) and use the project name **`planmypartypal`**.

That's the key difference from last time!
