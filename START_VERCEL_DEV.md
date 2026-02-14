# 🚀 How to Start Vercel Dev Server

## Why You Need This

Your emails aren't sending because `npm run dev` (Vite) doesn't run API routes. You need `vercel dev` to test email functionality locally.

---

## Step-by-Step Instructions

### Step 1: Login to Vercel (One-Time Setup)

Open your terminal and run:

```bash
vercel login
```

**What happens:**
1. Vercel will ask how you want to login
2. Choose **"Continue with Email"** (easiest) or GitHub/GitLab if you prefer
3. If you choose email:
   - Enter your email address
   - Check your inbox for verification code
   - Enter the code in terminal
4. You're now logged in! (This saves credentials locally)

**Alternative:** If you have a Vercel account already:
- Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
- Create a token
- Run: `vercel login --token YOUR_TOKEN`

---

### Step 2: Navigate to Your Project

```bash
cd "/Users/anameli/party planner app"
```

---

### Step 3: Start Vercel Dev

```bash
npm run dev:vercel
```

Or directly:
```bash
vercel dev
```

**First time setup questions:**

1. **"Set up and develop?"** → Type: `y` (Yes)

2. **"Which scope?"** → Press Enter (use your account)

3. **"Link to existing project?"** → Type: `n` (No)
   - Unless you already have this project on Vercel

4. **"Project name?"** → Press Enter (accepts default: `party-planner-app`)

5. **"Which directory is your code?"** → Press Enter (current directory)

6. **"Want to override settings?"** → Type: `n` (No)

**These settings are saved in `.vercel/` folder - you only do this once!**

---

### Step 4: Wait for Server to Start

You'll see output like:
```
Ready! Available at http://localhost:3000
```

The server is now running with full API support!

---

### Step 5: Test Email Sending

1. Open your browser to `http://localhost:3000` (not 5173!)
2. Navigate to `/app`
3. Fill out Step 1 (Basics)
4. On Email Gate, enter your real email
5. Click "Show Me Venue Options"
6. **Check your inbox!** 📧

---

## What's Different from Regular Dev?

| Feature | `npm run dev` (Vite) | `npm run dev:vercel` |
|---------|---------------------|---------------------|
| Frontend | ✅ Works | ✅ Works |
| Hot reload | ✅ Instant | ✅ Works (slightly slower) |
| API routes | ❌ 404 errors | ✅ Works! |
| Email sending | ❌ No | ✅ Yes |
| Stripe | ❌ No | ✅ Yes |
| Port | 5173 | 3000 |
| Speed | ⚡ Fast | 🐢 Slightly slower |

---

## Verifying It Works

### Check 1: Browser Console

Open DevTools (F12) and go to Console. You should see:
```
Vercel Dev Server
```

### Check 2: Network Tab

1. Open DevTools → Network tab
2. Submit email at Email Gate
3. Look for `/api/subscribe` request
4. Should show **200 OK** (not 404!)
5. Response should be: `{success: true, emailSent: true}`

### Check 3: Resend Dashboard

Go to [resend.com/emails](https://resend.com/emails)

You should see your sent email with:
- ✅ Status: Delivered
- ✅ To: Your email
- ✅ Subject: "Let's plan [Child Name]'s perfect party!"

---

## Common Issues

### "vercel: command not found"

**Solution:** Install Vercel CLI
```bash
npm install -g vercel
```

### "No existing credentials found"

**Solution:** Login first
```bash
vercel login
```

### "Port 3000 already in use"

**Solution:** Kill the process
```bash
# Find and kill:
lsof -ti:3000 | xargs kill -9

# Or use a different port:
vercel dev --listen 3001
```

### "Environment variables not loading"

**Solution:** Make sure `.env.local` exists in project root
```bash
# Check if file exists:
cat .env.local

# Should show:
# RESEND_API_KEY=re_...
```

### Emails still not sending

**Check these:**
1. ✅ Using `vercel dev` (not `vite`)
2. ✅ `.env.local` has correct `RESEND_API_KEY`
3. ✅ Resend account is active (check [resend.com](https://resend.com))
4. ✅ Browser console shows 200 response from `/api/subscribe`
5. ✅ Check spam folder

---

## Stopping the Server

Press **Ctrl+C** in the terminal where `vercel dev` is running.

---

## Daily Workflow

### Option 1: Full-stack development
```bash
# Start Vercel dev (slower but complete):
npm run dev:vercel

# Open: http://localhost:3000
# Test email functionality ✅
```

### Option 2: Fast UI iteration
```bash
# Use Vite for quick changes:
npm run dev

# Open: http://localhost:5173
# Email won't work, but UI updates are instant ⚡
```

### Option 3: Both at once
```bash
# Terminal 1:
npm run dev
# Use this for UI work

# Terminal 2:
npm run dev:vercel
# Switch to this when testing emails
```

---

## Next Steps

Once `vercel dev` is running:

1. Test email sending (Step 1 → Email Gate → Submit)
2. Check inbox for welcome email
3. Verify Google Analytics events still work
4. Test the full user flow

---

## Deployment

When you're ready to deploy for real:

```bash
# Deploy to Vercel:
vercel --prod

# Or connect to GitHub and auto-deploy on push
```

No need to run `vercel dev` on the server - it works automatically!

---

**🎉 That's it!** Once you run `vercel dev`, your emails will work locally.

---

## Quick Command Reference

```bash
# One-time setup:
vercel login                    # Login to Vercel
cd "/Users/anameli/party planner app"
npm run dev:vercel              # First time setup

# Daily use:
npm run dev:vercel              # Start full-stack server
# or
npm run dev                     # Start frontend-only (faster)
```

---

**Need help?** See `DEV_COMMANDS.md` for detailed comparison of dev modes.
