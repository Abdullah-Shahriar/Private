# 🌹 Valentine Visitor Storage Setup Guide

## Database Implementation: Vercel KV (Redis)

Your visitor data is now stored in **Vercel KV**, a Redis database that works both locally and in production.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create a Vercel KV Database

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Create or select your project**
3. Click on the **Storage** tab
4. Click **Create Database**
5. Select **KV** (Key-Value Store)
6. Name it: `valentine-visitors` (or any name you like)
7. Click **Create**

### Step 2: Get Environment Variables

After creating the database, you'll see environment variables like:

```env
KV_REST_API_URL=https://xxxxxx.upstash.io
KV_REST_API_TOKEN=AXxxxxxxxxxxxxxxxx
KV_REST_API_READ_ONLY_TOKEN=Akxxxxxxxxxxxxxxxx
```

### Step 3: Add to Local Development

1. Open the file: `valentine/.env.local`
2. Replace the placeholder values with your actual KV credentials
3. Save the file

### Step 4: Add to Vercel Production

The environment variables are automatically added to your Vercel project when you connect the KV database!

If not, you can manually add them:
1. Go to your project settings on Vercel
2. Navigate to **Environment Variables**
3. Add the three KV variables
4. Redeploy your project

---

## ✅ How It Works

### Data Storage
- **Key**: `valentine-visitors`
- **Value**: Array of visitor objects containing:
  - `name`: Visitor's name
  - `timestamp`: ISO timestamp
  - `date`: Formatted date
  - `time`: Formatted time

### Secret Codes
- **0328**: Access the visitor log at `/visitors`
- **8888**: Redirect to GitHub profile

### Features
- ✅ Works in local development
- ✅ Works in Vercel production
- ✅ Persistent data storage
- ✅ Fast Redis performance
- ✅ No file system limitations
- ✅ Automatic error handling

---

## 🧪 Testing

### Local Development
```bash
cd valentine
npm run dev
```

1. Enter a name and submit
2. Check the console - you should see "✅ Data saved successfully to KV store!"
3. Enter secret code `0328` to view visitors

### Production
After deploying to Vercel:
1. Visit your site
2. Enter a name
3. Use secret code `0328` to view all visitors

---

## 🔧 Troubleshooting

### Error: "Connection failed"
- Make sure your `.env.local` has the correct KV credentials
- Restart your development server after adding env variables

### No visitors showing up
- Check the console for error messages
- Verify the secret code is `0328`
- Make sure the KV database is connected to your Vercel project

### Local development not saving
- You need to create a KV database even for local development
- The local dev server needs the same KV credentials

---

## 📊 Viewing Visitor Data

Two ways to view visitors:

1. **Through the app**: Enter `0328` as the name
2. **Vercel Dashboard**: 
   - Go to Storage → Your KV database
   - Browse keys → Look for `valentine-visitors`

---

## 💰 Cost

Vercel KV has a **free tier** that includes:
- 256 MB storage
- 10,000 commands per day

This is more than enough for a personal Valentine's project! 💕

---

## 🔒 Security Notes

- The secret code `0328` is hardcoded
- To change it, update the value in `src/app/actions.ts`:
  ```typescript
  if (secretCode !== "0328") {  // Change this
  ```
- The KV tokens in `.env.local` should NEVER be committed to git
- `.env.local` is already in `.gitignore`

---

## 📝 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Check the Vercel deployment logs
3. Verify your KV database is active in Vercel dashboard

---

Happy Valentine's Day! 💕🌹
