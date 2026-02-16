# Vercel Environment Variables - Quick Fix

## Problem
After deploying to Vercel, the API and database are not working. No data is being fetched.

## Root Cause
This is a **Vite application**, not Next.js. Vite requires environment variables to use the `VITE_` prefix, not `NEXT_PUBLIC_`.

## Quick Solution

### Step 1: Go to Vercel Dashboard
1. Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add These Variables

Add the following environment variables with **exactly** these names:

```
Name: VITE_SUPABASE_URL
Value: https://tjzwxxxdauovsgvwijpv.supabase.co
```

```
Name: VITE_SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqend4eHhkYXVvdnNndndpanB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTc3NTAsImV4cCI6MjA4NjczMzc1MH0.-fl-zA3Gqr4FcxTqFFb2npoo1uceVgQp5D4uC8mRTXo
```

**Important:**
- ✅ Use `VITE_` prefix (NOT `NEXT_PUBLIC_`)
- ✅ Select all three environments: **Production**, **Preview**, **Development**
- ✅ Click **Save** for each variable

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the three dots (**...**) menu
4. Select **Redeploy**
5. **⚠️ IMPORTANT:** Uncheck "Use existing Build Cache"
6. Click **Redeploy**

### Step 4: Verify

After deployment completes:
1. Visit your deployed site
2. Open browser console (Press F12)
3. Check if products are loading
4. Look for any console errors

## Why This Happens

- **Vite** uses `import.meta.env.VITE_*` for environment variables
- **Next.js** uses `process.env.NEXT_PUBLIC_*`
- Your app is built with Vite, so it needs `VITE_` prefix
- The code in `services/supabase.ts` looks for `VITE_SUPABASE_URL` first

## Checklist

- [ ] Added `VITE_SUPABASE_URL` to Vercel
- [ ] Added `VITE_SUPABASE_ANON_KEY` to Vercel
- [ ] Selected all 3 environments for both variables
- [ ] Redeployed WITHOUT build cache
- [ ] Verified deployment succeeded
- [ ] Checked site - products are loading
- [ ] No errors in browser console

## Still Not Working?

### Check the Browser Console
1. Open your deployed site
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for error messages (especially "Supabase environment variables are missing")

### Check Vercel Logs
1. Go to your project in Vercel
2. Click **Deployments**
3. Click on the latest deployment
4. Check **Build Logs** and **Function Logs** for errors

### Verify Supabase Configuration
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Verify the URL and Anon Key match what you added to Vercel

## Additional Notes

- You can keep both `VITE_*` and `NEXT_PUBLIC_*` variables (the code supports both)
- However, `VITE_*` takes priority and is required for Vercel deployments
- **DO NOT** add `SUPABASE_SERVICE_ROLE_KEY` to Vercel (security risk for client-side apps)
