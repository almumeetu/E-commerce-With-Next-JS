# Deployment Guide for Vercel

This project is configured as a Vite Single Page Application (SPA) and is ready for deployment on Vercel.

## 1. Prerequisites

Ensure you have the following environment variables ready. You can find these in your `.env.local` file.

**Required Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Same as Anonymous Key (or your specific publishable key)

**Note:** Do NOT add `SUPABASE_SERVICE_ROLE_KEY` to Vercel environment variables unless you are using Vercel Serverless Functions. Exposing this key in a client-side application is a security risk.

## 2. Deployment Steps

1.  **Push to GitHub/GitLab/Bitbucket**:
    ```bash
    git add .
    git commit -m "Prepare for Vercel deployment"
    git push origin main
    ```

2.  **Import Project in Vercel**:
    - Go to [Vercel Dashboard](https://vercel.com/dashboard).
    - Click **"Add New..."** -> **"Project"**.
    - Import your repository `Frinds-Gallery-E-commerce-with-React-Next-Js`.

3.  **Configure Project**:
    - **Framework Preset**: Vercel should automatically detect **Vite**. If not, select **Vite**.
    - **Root Directory**: Ensure this is set to `./` (or the folder where `package.json` is located).
    - **Build Command**: `vite build` (Default)
    - **Output Directory**: `dist` (Default)

4.  **Environment Variables**:
    - Expand the **Environment Variables** section.
    - Add the variables listed in step 1.

5.  **Deploy**:
    - Click **Deploy**.

## 3. Configuration Details

- **Routing**: A `vercel.json` file is included to handle client-side routing (redirecting all traffic to `index.html`).
- **Build**: The `vite.config.ts` is optimized for production builds, including code splitting and compression.
