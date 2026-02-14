# Development Commands Guide

## Quick Reference

| Command | Use When | API Routes Work? | Speed |
|---------|----------|------------------|-------|
| `npm run dev` | Building UI, testing frontend only | ❌ No | ⚡ Fast |
| `npm run dev:vercel` | Testing email, API endpoints, full-stack | ✅ Yes | 🐢 Slower |

---

## `npm run dev` (Vite Only)

**What it does:**
- Runs Vite dev server
- Serves React frontend
- Hot module replacement (instant updates)
- NO backend/API support

**Use for:**
- ✅ Building UI components
- ✅ Styling and layout
- ✅ Testing Google Analytics (external service)
- ✅ Frontend logic and state management
- ✅ Quick iterations

**Won't work:**
- ❌ Email sending (Resend API)
- ❌ Stripe checkout
- ❌ Database operations
- ❌ Any `/api/*` endpoints

**Start command:**
```bash
npm run dev
```

Server runs at: `http://localhost:5173`

---

## `npm run dev:vercel` (Full Stack)

**What it does:**
- Runs Vercel's local runtime
- Serves React frontend (via Vite internally)
- Runs API routes as serverless functions
- Loads environment variables from `.env.local`

**Use for:**
- ✅ Testing email functionality
- ✅ Testing Stripe integration
- ✅ Testing any API endpoints
- ✅ Full-stack development
- ✅ Pre-deployment testing

**Requires:**
- Vercel CLI installed: `npm install -g vercel`
- `.env.local` with API keys

**Start command:**
```bash
npm run dev:vercel
```

Server runs at: `http://localhost:3000` (or auto-assigned port)

**First-time setup:**
Vercel CLI will ask a few questions:
1. "Set up and develop?" → **Yes**
2. "Which scope?" → Choose your account or skip
3. "Link to existing project?" → **No** (unless you have one)
4. "Project name?" → `party-planner-app` (or press Enter)
5. "Which directory?" → `.` (press Enter)
6. "Override settings?" → **No** (press Enter)

These settings are saved in `.vercel/` folder (already gitignored).

---

## When to Use Which?

### Frontend-Only Changes:
```bash
npm run dev
```
Example: Updating styles, fixing layout, adding components

### Testing Email Gate:
```bash
npm run dev:vercel
```
Required! Vite cannot run the `/api/subscribe` endpoint.

### Testing Stripe Checkout:
```bash
npm run dev:vercel
```
Required! Vite cannot run the `/api/create-checkout` endpoint.

### Testing Full User Flow (Sign up → Email → Checklist):
```bash
npm run dev:vercel
```
Recommended to test the complete experience.

---

## Troubleshooting

### "Emails not sending"
**Problem:** Using `npm run dev` instead of `npm run dev:vercel`

**Solution:**
```bash
# Stop current server (Ctrl+C)
npm run dev:vercel
```

### "Port already in use"
**Problem:** Server already running on that port

**Solution:**
```bash
# Kill the process:
lsof -ti:3000 | xargs kill -9  # for Vercel dev
lsof -ti:5173 | xargs kill -9  # for Vite

# Or just close the terminal tab and start fresh
```

### "vercel: command not found"
**Problem:** Vercel CLI not installed

**Solution:**
```bash
npm install -g vercel
```

### "Environment variables not loading"
**Problem:** `.env.local` not in project root

**Solution:**
```bash
# Make sure file exists:
ls -la .env.local

# Should be in same folder as package.json
```

---

## Performance Comparison

### Vite (`npm run dev`)
- **Startup:** ~1-2 seconds
- **Hot reload:** Instant
- **Best for:** Rapid UI development

### Vercel Dev (`npm run dev:vercel`)
- **Startup:** ~5-10 seconds (first time), ~3-5 seconds (subsequent)
- **Hot reload:** Slightly slower (rebuilds serverless functions)
- **Best for:** Full-stack testing

---

## Production vs Development

### Development (Local):
- Use `npm run dev:vercel` for full testing
- Vercel CLI simulates production environment
- Environment variables from `.env.local`

### Production (Deployed):
- Vercel automatically detects `/api/*.js` as serverless functions
- Environment variables from Vercel dashboard
- No CLI needed - just works!

---

## Quick Tips

**Tip 1:** Keep two terminals open
- Terminal 1: `npm run dev` for fast UI iteration
- Terminal 2: `npm run dev:vercel` for testing APIs

**Tip 2:** Switch between them
```bash
# Working on styles? Use Vite:
npm run dev

# Ready to test email? Switch to Vercel:
# (Stop Vite with Ctrl+C first)
npm run dev:vercel
```

**Tip 3:** Production parity
Use `npm run dev:vercel` before deploying to catch issues early.

---

## Deployment Note

When you deploy to Vercel:
- You don't need to run any special commands
- Just `git push` and Vercel auto-deploys
- API routes work automatically in production
- No Vercel CLI needed on the server

---

**Need help?** Check `QUICK_SETUP.md` for setup instructions.
