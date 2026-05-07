# 🚀 Complete Deployment Steps

## ✅ Step 1: Create GitHub Repository (1 minute)

### Option A: Using Web Browser (Easiest)
1. **Go to:** https://github.com/new
2. **Repository name:** `escape-the-nightmare`
3. **Description:** `Horror-themed escape room puzzle game`
4. **Visibility:** Public
5. **DO NOT check any boxes** (no README, no .gitignore, no license)
6. Click **"Create repository"**

### Option B: Using GitHub CLI (if you have it)
```bash
gh repo create escape-the-nightmare --public --source=. --remote=origin --push
```

---

## ✅ Step 2: Push Your Code (30 seconds)

After creating the repo on GitHub, run these commands:

```bash
# Already done:
# git init ✅
# git add . ✅
# git commit ✅
# git remote add origin ✅
# git branch -M main ✅

# Just need to push:
git push -u origin main
```

**That's it!** Your code is now on GitHub.

---

## ✅ Step 3: Deploy to Vercel (2 minutes)

### Option A: Using Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI (if not installed)
npm install -g vercel

# 2. Login to Vercel (creates account if needed)
vercel login

# 3. Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - What's your project's name? escape-the-nightmare
# - In which directory is your code located? ./
# - Want to override settings? No

# 4. Deploy to production
vercel --prod
```

### Option B: Using Vercel Website (No CLI needed)

1. **Go to:** https://vercel.com/new
2. **Sign in** with GitHub
3. **Import** your `escape-the-nightmare` repository
4. **Framework Preset:** Vite
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. Click **"Deploy"**

**Done!** You'll get a URL like: `https://escape-the-nightmare.vercel.app`

---

## 📱 Step 4: Test on Your Phone

1. **Open the Vercel URL** on your phone
2. **Install to home screen:**
   - **iPhone:** Safari → Share → Add to Home Screen
   - **Android:** Chrome → Menu → Install app
3. **Launch and play!** 🎮

---

## 🎯 Quick Summary

```bash
# 1. Create repo on GitHub (web browser)
# 2. Push code
git push -u origin main

# 3. Deploy to Vercel
npm install -g vercel
vercel login
vercel --prod

# 4. Open URL on phone and install!
```

---

## 🔗 Your URLs

After deployment, you'll have:
- **GitHub:** `https://github.com/Aweskouki/escape-the-nightmare`
- **Vercel:** `https://escape-the-nightmare.vercel.app` (or similar)

Share the Vercel URL with anyone to play! 🎮

---

## 🐛 Troubleshooting

### "Repository not found" when pushing
- Make sure you created the repo on GitHub first
- Check the repo name matches: `escape-the-nightmare`
- Make sure it's under your account: `Aweskouki`

### Vercel build fails
- Check that `package.json` has correct scripts
- Make sure all dependencies are installed
- Try building locally first: `npm run build`

### Can't install on phone
- Make sure you're using HTTPS (Vercel provides this)
- iPhone: Must use Safari browser
- Android: Must use Chrome browser

---

## ✅ Checklist

- [ ] Create GitHub repo at https://github.com/new
- [ ] Push code: `git push -u origin main`
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Deploy: `vercel --prod`
- [ ] Test on phone
- [ ] Install to home screen
- [ ] Share with girlfriend! 💕

---

## 🎉 You're Done!

Your game will be:
- ✅ Live on the internet
- ✅ Accessible from any device
- ✅ Installable on phones
- ✅ Works offline
- ✅ Shareable via URL

**Enjoy!** 🎮💀✨
