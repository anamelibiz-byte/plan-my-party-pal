# 🚀 Get Emails Working - DO THIS NOW

## The Problem
You need to login to Vercel before the dev server will work.

## The Solution (2 Minutes)

### Open YOUR OWN Terminal (Not This One)

1. **Open Terminal app** (Spotlight → type "Terminal")

2. **Run these commands ONE BY ONE:**

```bash
# Step 1: Login to Vercel
vercel login
```

**What happens:**
- It will ask: "Log in to Vercel..."
- You'll see options like:
  - Continue with GitHub
  - Continue with GitLab
  - Continue with Bitbucket
  - Continue with Email
  - Continue with SAML Single Sign-On

**Choose one:**
- Type `email` and press Enter (easiest)
- OR type `github` if you have a GitHub account
- OR type `gitlab` if you have a GitLab account

**If you chose email:**
- Enter your email address
- Check your email inbox
- You'll get a code
- Enter the code in terminal
- ✅ You're logged in!

**If you chose GitHub/GitLab:**
- It will open your browser
- Login with that account
- ✅ You're logged in!

---

### Step 2: Start the Server

Still in your terminal, run:

```bash
cd "/Users/anameli/party planner app"
npm run dev:vercel
```

**First time questions:**

Question: `Set up and develop "~/party planner app"? [Y/n]`
Answer: Type `y` and press Enter

Question: `Which scope should we use?`
Answer: Just press Enter

Question: `Link to existing project? [y/N]`
Answer: Type `n` and press Enter

Question: `What's your project's name? (party-planner-app)`
Answer: Just press Enter

Question: `In which directory is your code located? ./`
Answer: Just press Enter

Question: `Want to override the settings? [y/N]`
Answer: Type `n` and press Enter

---

### Step 3: Wait for Server to Start

You'll see:

```
> Ready! Available at http://localhost:3000
```

**🎉 SUCCESS!** The server is running!

---

### Step 4: Test Email Sending

1. Open browser to: `http://localhost:3000/app`
2. Fill out Step 1 (Basics):
   - Child's name: Test
   - Age: 5
   - Date: Any date
   - Time: 2:00 PM
   - Guests: 20
   - Budget: 300
3. Click "Continue"
4. You'll see the Email Gate
5. **Enter YOUR real email**
6. Click "Show Me Venue Options"
7. **CHECK YOUR INBOX!** 📧

The welcome email should arrive within 30 seconds.

---

## If Email Still Doesn't Come

1. **Check spam folder**
2. **Open browser DevTools** (F12)
3. Go to **Network tab**
4. Submit the email again
5. Look for `/api/subscribe` request
6. Click on it - what status code do you see?
   - **200 = Success!** Check spam folder
   - **500 = Error** - copy the response and let me know
   - **404 = Not Found** - server isn't running correctly

---

## Quick Troubleshooting

**"Port 3000 already in use"**
```bash
lsof -ti:3000 | xargs kill -9
npm run dev:vercel
```

**"Vercel login not working"**
- Make sure you're using YOUR terminal app (not the Claude interface)
- Try `vercel logout` then `vercel login` again

**"Server starts but emails don't send"**
- Check `.env.local` has `RESEND_API_KEY=re_...`
- Check browser console for errors
- Go to https://resend.com/emails and check if any emails were sent

---

## Summary of Commands

```bash
# 1. Login (one time only)
vercel login

# 2. Start server (every time)
cd "/Users/anameli/party planner app"
npm run dev:vercel

# 3. Open in browser
# Go to: http://localhost:3000/app
```

---

**That's it!** Once you run these commands in YOUR terminal, emails will work! 🚀
