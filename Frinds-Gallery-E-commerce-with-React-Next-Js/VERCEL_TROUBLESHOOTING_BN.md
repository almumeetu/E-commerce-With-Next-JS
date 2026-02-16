# Vercel Deployment সমস্যা সমাধান

## সমস্যা: Vercel এ deploy করার পর API বা Database থেকে কোন data আসছে না

### কারণ:
Vite application এ environment variable গুলো `VITE_` prefix দিয়ে শুরু করতে হয়। `NEXT_PUBLIC_` prefix শুধুমাত্র Next.js এর জন্য।

### সমাধান:

#### ১. Vercel Dashboard এ যান
1. [Vercel Dashboard](https://vercel.com/dashboard) এ যান
2. আপনার project select করুন
3. **Settings** > **Environment Variables** এ যান

#### ২. নতুন Environment Variables যোগ করুন

**অবশ্যই এই variable গুলো add করুন:**

```
VITE_SUPABASE_URL=https://tjzwxxxdauovsgvwijpv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqend4eHhkYXVvdnNndndpanB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTc3NTAsImV4cCI6MjA4NjczMzc1MH0.-fl-zA3Gqr4FcxTqFFb2npoo1uceVgQp5D4uC8mRTXo
```

**গুরুত্বপূর্ণ:**
- Variable name এ `VITE_` prefix ব্যবহার করুন, `NEXT_PUBLIC_` নয়
- **Production**, **Preview**, এবং **Development** তিনটি environment এর জন্যই এই variables add করুন

#### ৩. পুরনো Variables মুছে ফেলুন (যদি থাকে)

যদি আগে `NEXT_PUBLIC_SUPABASE_URL` বা `NEXT_PUBLIC_SUPABASE_ANON_KEY` add করে থাকেন, সেগুলো রাখতে পারেন (optional), তবে `VITE_` prefix যুক্ত variables অবশ্যই থাকতে হবে।

#### ৪. Redeploy করুন

Environment variables add/update করার পর:
1. **Deployments** tab এ যান
2. সবচেয়ে recent deployment খুঁজুন
3. তিন ডট (...) মেনুতে click করুন
4. **Redeploy** select করুন
5. ✅ "Use existing Build Cache" **uncheck** করুন (গুরুত্বপূর্ণ!)
6. **Redeploy** button এ click করুন

#### ৫. Deployment সফল হওয়ার পর Test করুন

1. আপনার deployed site visit করুন
2. Browser console খুলুন (F12 চাপুন)
3. Console এ কোন error দেখা যাচ্ছে কিনা check করুন
4. Products load হচ্ছে কিনা দেখুন

## Local Environment Variable Setup

আপনার local `.env.local` file এও `VITE_` prefix যোগ করতে পারেন:

```bash
# Vite Environment Variables (Primary)
VITE_SUPABASE_URL=https://tjzwxxxdauovsgvwijpv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqend4eHhkYXVvdnNndndpanB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTc3NTAsImV4cCI6MjA4NjczMzc1MH0.-fl-zA3Gqr4FcxTqFFb2npoo1uceVgQp5D4uC8mRTXo

# Alternative (Also Supported)
NEXT_PUBLIC_SUPABASE_URL=https://tjzwxxxdauovsgvwijpv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqend4eHhkYXVvdnNndndpanB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTc3NTAsImV4cCI6MjA4NjczMzc1MH0.-fl-zA3Gqr4FcxTqFFb2npoo1uceVgQp5D4uC8mRTXo
```

## অন্যান্য সমস্যা সমাধান

### ১. Build Failed Error

যদি build fail হয়, terminal এ এই command run করুন:

```bash
npm run build
```

কোন error দেখা গেলে সেটা আগে fix করুন।

### ২. Supabase Connection Error

যদি Supabase এ connect হতে না পারে:

1. Supabase Dashboard এ যান
2. **Settings** > **API** check করুন
3. URL এবং Anon Key সঠিক আছে কিনা verify করুন

### ৩. CORS Error

যদি CORS error দেখা যায়:

1. Supabase Dashboard > **Settings** > **API**
2. **URL Configuration** section এ আপনার Vercel domain add করুন

## চেকলিস্ট

- [ ] Vercel এ `VITE_SUPABASE_URL` variable add করেছি
- [ ] Vercel এ `VITE_SUPABASE_ANON_KEY` variable add করেছি
- [ ] তিনটি environment (Production, Preview, Development) এর জন্যই add করেছি
- [ ] Build cache ছাড়া redeploy করেছি
- [ ] Deployment সফল হয়েছে
- [ ] Browser console এ কোন error নেই
- [ ] Products এবং data load হচ্ছে

## সাহায্য প্রয়োজন?

যদি এখনও সমস্যা থাকে:

1. Browser console এ error message দেখুন (F12)
2. Vercel deployment logs check করুন
3. Supabase logs check করুন: Dashboard > Logs
