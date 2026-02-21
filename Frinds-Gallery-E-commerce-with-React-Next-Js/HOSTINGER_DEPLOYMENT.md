# Friends Gallery E-commerce - Hostinger Deployment Guide

## Prerequisites
1. Hostinger Cloud Hosting account with Node.js plan
2. Domain name (or use Hostinger's free subdomain)
3. Supabase project (your backend/database)

## Step 1: Configure Environment Variables

Create a `.env.production` file in the project root with your production values:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Steadfast Courier (if using delivery in Bangladesh)
NEXT_PUBLIC_STEADFAST_API_KEY=your_steadfast_api_key
NEXT_PUBLIC_STEADFAST_SECRET_KEY=your_steadfast_secret_key

# Marketing
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_facebook_pixel_id
NEXT_PUBLIC_FACEBOOK_CATALOG_ID=your_catalog_id
NEXT_PUBLIC_FACEBOOK_BUSINESS_ID=your_business_id

# Website Configuration
NEXT_PUBLIC_WEBSITE_URL=https://your-domain.com
NEXT_PUBLIC_WEBSITE_NAME=Friends Gallery
NEXT_PUBLIC_CONTACT_PHONE=+8801XXXXXXXXX
NEXT_PUBLIC_CONTACT_EMAIL=info@friendsgallery.com
NEXT_PUBLIC_BUSINESS_ADDRESS=Your Business Address, Dhaka, Bangladesh
```

## Step 2: Build the Application

Run the build command locally to test:

```bash
cd Frinds-Gallery-E-commerce-with-React-Next-Js
npm run build
```

This will create a `.next/standalone` folder with the optimized build.

## Step 3: Deploy to Hostinger Cloud

### Option A: Deploy via Git (Recommended)

1. **Push your code to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Prepare for Hostinger deployment"
   git push origin main
   ```

2. **Connect Git to Hostinger**
   - Log in to [Hostinger](https://hpanel.hostinger.com)
   - Go to Cloud Hosting → Your Plan → Git
   - Connect your Git repository
   - Set the branch to `main`
   - Set build command: `npm run build`
   - Set publish directory: `.next/standalone`

3. **Add Environment Variables in Hostinger**
   - Go to Cloud Hosting → Your Plan → Environment Variables
   - Add all the variables from `.env.production`

4. **Deploy**
   - Click "Deploy Changes" in Hostinger panel

### Option B: Deploy via FTP/SFTP

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Upload to Hostinger:**
   - Connect to Hostinger via FTP/SFTP
   - Navigate to your domain's root directory
   - Upload the contents of `.next/standalone` folder
   - Also upload these folders/files:
     - `.next/static` (create this folder and upload static assets)
     - `public/` folder
     - `package.json`
     - `.env.production`

3. **Install dependencies on Hostinger:**
   - Go to Node.js section in Hostinger
   - Run: `npm install`

4. **Set up start script:**
   - In Hostinger Node.js settings, set:
     - Application root: your domain root
     - Application start file: `server.js` (or `npm start`)

## Step 4: Configure Domain

1. In Hostinger panel, go to **Domains** → **DNS / DNS Records**
2. If using external domain, update nameservers to Hostinger's
3. Or connect via Cloudflare for better performance

## Step 5: Verify Deployment

After deployment:
1. Visit your domain
2. Check that:
   - Homepage loads correctly
   - Products display from Supabase
   - Cart functionality works
   - Checkout process works

## Troubleshooting

### Common Issues:

1. **Page not found (404)**
   - Ensure you're using the standalone output
   - Check that `server.js` is in the correct location

2. **Database connection error**
   - Verify Supabase URL and keys in environment variables
   - Check that your Supabase project allows connections from your Hostinger IP

3. **Images not loading**
   - Verify `public/` folder is uploaded
   - Check image paths in the application

4. **Build failed**
   - Ensure Node.js version is 18.x or higher
   - Check that all dependencies are in package.json

### Hostinger Specific:
- Minimum Node.js version required: 18.x
- Recommended plan: Cloud Startup or higher for e-commerce
- Enable "Keep processes running" in Node.js settings

## Support

For Hostinger support: https://www.hostinger.com/contact
