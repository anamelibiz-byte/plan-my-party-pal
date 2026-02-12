# Troubleshooting: Modal Not Appearing

## Quick Diagnostics

### Step 1: Check Your Tier in Browser

1. Go to: https://planmypartypal.com/app
2. Open Console (F12)
3. Type: `localStorage.getItem('pp_user_tier')`

**Result:**
- If `null` or `"free"` → Good! ✅
- If `"pro"` → Reset it: `localStorage.setItem('pp_user_tier', 'free')` then refresh

### Step 2: Check If Environment Variables Are Set

The most common issue is that the environment variables aren't added to Vercel yet!

**Go check:** https://vercel.com/tinas-projects-c03f9000/~/settings/environment-variables

**You should see:**
- ✅ STRIPE_SECRET_KEY
- ✅ STRIPE_WEBHOOK_SECRET
- ✅ RESEND_API_KEY

**If they're NOT there**, add them now using the values from `ADD_TO_VERCEL.md`!

### Step 3: Force a Redeploy

After adding environment variables:

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Go to "Deployments" tab
4. Click the "..." menu on latest deployment
5. Click "Redeploy"

OR just push a small change:
```bash
cd "/Users/anameli/party planner app"
echo "# Testing" >> README.md
git add README.md
git commit -m "Trigger redeploy"
git push origin main
```

### Step 4: Test the Modal Manually

In browser console, type:
```javascript
// This should trigger the modal
const event = new Event('upgrade-required');
window.dispatchEvent(event);
```

### Step 5: Check for Console Errors

When you try to add the 16th guest:
1. Open Console (F12)
2. Try to add guest
3. Look for RED errors
4. Screenshot and share any errors you see

---

## Common Issues

### Issue 1: "Nothing happens when I try to add 16th guest"
**Cause:** Tier is set to 'pro' in localStorage
**Fix:**
```javascript
localStorage.setItem('pp_user_tier', 'free')
// Then refresh page
```

### Issue 2: "Modal doesn't appear"
**Cause:** Environment variables not set in Vercel
**Fix:** Add the 3 variables to Vercel (see ADD_TO_VERCEL.md)

### Issue 3: "Guest list doesn't show"
**Cause:** Need to complete party wizard first
**Fix:** Fill in Step 1-4 of the wizard first

---

## Test Checklist

- [ ] Environment variables added to Vercel
- [ ] Tier set to 'free' in localStorage
- [ ] Page refreshed after adding env vars
- [ ] Tried adding 15 guests first
- [ ] Checked console for errors
- [ ] Waited for Vercel deployment to complete

---

## Still Not Working?

Share:
1. Screenshot of Vercel environment variables page
2. Screenshot of browser console (any errors?)
3. What tier shows: `localStorage.getItem('pp_user_tier')`
