# 🚀 Quick Deploy Guide

## Fastest Way to Get Your Game Online

### **Option 1: Vercel (Easiest - 2 minutes)**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login (creates account if needed)
vercel login

# 3. Deploy (follow prompts)
vercel

# 4. Get your URL!
# Example: https://escape-nightmare.vercel.app
```

**That's it!** Share the URL with anyone.

---

### **Option 2: Netlify Drop (No CLI needed)**

1. **Build the game:**
   ```bash
   npm run build
   ```

2. **Go to:** https://app.netlify.com/drop

3. **Drag the `dist` folder** onto the page

4. **Get your URL!**
   - Example: https://escape-nightmare-abc123.netlify.app

---

### **Option 3: GitHub Pages (Free Forever)**

```bash
# 1. Create GitHub repo and push code
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/escape-nightmare.git
git push -u origin main

# 2. Install gh-pages
npm install --save-dev gh-pages

# 3. Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# 4. Deploy
npm run deploy

# 5. Enable GitHub Pages in repo settings
# Settings → Pages → Source: gh-pages branch

# 6. Get URL:
# https://YOUR_USERNAME.github.io/escape-nightmare
```

---

## 📱 After Deploying

1. **Open URL on your phone**
2. **Install to home screen** (see MOBILE-PWA-GUIDE.md)
3. **Play!**

---

## 🔗 Share Your Game

Once deployed, anyone can:
- Play in browser
- Install on their phone
- Play offline

Just share the URL! 🎮
