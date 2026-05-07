# 📱 Mobile & PWA Installation Guide

## Overview
The game is now **fully mobile-compatible** and can be **installed on your phone** like a native app!

---

## ✅ What's Been Added

### 1. **PWA (Progressive Web App) Support**
- ✅ Installable on iPhone, Android, and tablets
- ✅ Works offline after first load
- ✅ Full-screen app experience (no browser UI)
- ✅ App icon on home screen
- ✅ Splash screen on launch

### 2. **Mobile Touch Controls**
- ✅ **D-Pad** (left side) - Move left/right, jump up
- ✅ **Jump Button** (right side) - Large circular button
- ✅ Touch-optimized UI
- ✅ Auto-detects mobile devices
- ✅ Only shows on mobile (hidden on desktop)

### 3. **Responsive Design**
- ✅ Adapts to phone screen sizes
- ✅ Portrait and landscape support
- ✅ Touch-friendly buttons
- ✅ Optimized for small screens

---

## 📲 How to Install on Phone

### **iPhone/iPad (iOS/iPadOS)**

1. **Open in Safari** (must use Safari, not Chrome)
   - Go to your deployed website URL
   
2. **Tap the Share button** (square with arrow pointing up)
   - Located at bottom of screen (iPhone) or top (iPad)

3. **Scroll down and tap "Add to Home Screen"**
   - You'll see the app icon and name

4. **Tap "Add"** in top-right corner
   - App icon appears on your home screen

5. **Launch the app** from home screen
   - Opens in full-screen mode like a native app!

### **Android**

#### Method 1: Chrome Install Prompt
1. **Open in Chrome browser**
   - Go to your deployed website URL

2. **Look for "Install" prompt**
   - Chrome will show a banner at bottom: "Add Escape the Nightmare to Home screen"

3. **Tap "Install"**
   - App installs to home screen

4. **Launch from home screen**
   - Opens as standalone app

#### Method 2: Manual Install
1. **Open in Chrome**
   - Navigate to the website

2. **Tap the 3-dot menu** (⋮) in top-right

3. **Tap "Add to Home screen"** or "Install app"

4. **Tap "Add"** or "Install"

5. **Launch from home screen**

---

## 🎮 Mobile Controls

### Touch Controls Layout
```
┌─────────────────────────────────────┐
│                                     │
│         [Game Canvas]               │
│                                     │
│                                     │
└─────────────────────────────────────┘
  
  [D-Pad]                    [JUMP]
     ↑                         ⭕
   ← + →                    
```

### Controls:
- **D-Pad Left (←)** - Move left
- **D-Pad Right (→)** - Move right  
- **D-Pad Up (↑)** - Jump
- **Jump Button** - Jump (alternative)
- **Tap puzzle answers** - Select answer

### Tips:
- Hold left/right to keep moving
- Tap up quickly for short jumps
- Hold up for higher jumps
- Double-tap up for double jump

---

## 🌐 Deployment Options

To make it accessible on your phone, you need to deploy it online:

### **Option 1: Vercel (Recommended - Free)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts, get URL like: https://your-game.vercel.app
```

### **Option 2: Netlify (Free)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### **Option 3: GitHub Pages (Free)**
1. Push code to GitHub
2. Go to Settings → Pages
3. Select branch and /dist folder
4. Get URL: `https://username.github.io/repo-name`

### **Option 4: Your Own Server**
```bash
# Build the app
npm run build

# Upload the 'dist' folder to your web server
# Access via your domain
```

---

## 📱 Testing Locally on Phone

### **Option 1: Same WiFi Network**
```bash
# Start dev server (already configured)
npm run dev

# Server runs on: http://0.0.0.0:3000
# Find your computer's IP address:
# - Windows: ipconfig (look for IPv4)
# - Mac/Linux: ifconfig (look for inet)

# On phone, open browser and go to:
# http://YOUR_COMPUTER_IP:3000
# Example: http://192.168.1.100:3000
```

### **Option 2: ngrok (Temporary Public URL)**
```bash
# Install ngrok: https://ngrok.com/download

# Start dev server
npm run dev

# In another terminal, expose it:
npx ngrok http 3000

# Get public URL like: https://abc123.ngrok.io
# Open that URL on your phone
```

---

## 🎨 Customizing App Icon

The app currently uses placeholder icons. To add real icons:

### **Create Icons**
1. Design a 512x512 PNG icon (red/dark theme recommended)
2. Use a tool like [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
3. Generate 192x192 and 512x512 versions

### **Replace Placeholders**
```
public/
  ├── icon-192.png  ← Replace this
  └── icon-512.png  ← Replace this
```

### **Icon Design Tips**
- Use dark red/black colors (matches game theme)
- Simple, recognizable design
- Looks good at small sizes
- No text (hard to read when small)
- Suggestion: Skull icon, gate icon, or crystal icon

---

## 🔧 PWA Features

### **Offline Support**
- Game caches all assets after first load
- Can play without internet connection
- Updates automatically when online

### **Full-Screen Mode**
- No browser address bar
- No browser buttons
- Immersive game experience
- Looks like native app

### **App-Like Behavior**
- Appears in app switcher
- Can be uninstalled like regular app
- Separate from browser
- Own icon and name

---

## 📊 Mobile Optimization

### **Performance**
- ✅ Optimized canvas rendering
- ✅ Touch event handling
- ✅ Responsive layout
- ✅ Minimal bundle size

### **Screen Sizes**
- ✅ Phones (portrait & landscape)
- ✅ Tablets
- ✅ Small screens (320px+)
- ✅ Large screens (desktop)

### **Touch Targets**
- ✅ Large buttons (48x48px minimum)
- ✅ Adequate spacing
- ✅ Visual feedback on press
- ✅ No accidental taps

---

## 🐛 Troubleshooting

### **"Add to Home Screen" not showing (iOS)**
- ✅ Must use Safari browser (not Chrome)
- ✅ Must be on HTTPS (or localhost)
- ✅ Check if already installed

### **Install prompt not appearing (Android)**
- ✅ Must use Chrome browser
- ✅ Must be on HTTPS (or localhost)
- ✅ Visit site multiple times (Chrome learns interest)
- ✅ Use manual method (3-dot menu)

### **Touch controls not working**
- ✅ Make sure you're on mobile device
- ✅ Check browser console for errors
- ✅ Try refreshing the page
- ✅ Clear cache and reload

### **Game too small on phone**
- ✅ Rotate to landscape mode
- ✅ Use fullscreen mode
- ✅ Zoom in browser (pinch gesture)

### **Can't install offline**
- ✅ Must visit site online first
- ✅ Service worker needs to cache assets
- ✅ Check internet connection

---

## 📝 Quick Start Checklist

- [ ] Build the game: `npm run build`
- [ ] Deploy to hosting service (Vercel/Netlify/etc)
- [ ] Get public URL
- [ ] Open URL on phone
- [ ] Install to home screen
- [ ] Launch and play!

---

## 🎮 Mobile Gameplay Tips

### **For Non-Gamers**
- Practice in Level 1 first
- Use landscape mode for better view
- Take your time with puzzles
- Remember: 3 lives + checkpoints = forgiving!

### **Controls Tips**
- Light taps for precise movement
- Hold for continuous movement
- Quick tap up for small jumps
- Hold up for high jumps

### **Battery Saving**
- Close other apps
- Lower screen brightness
- Use airplane mode (after first load)
- Pause when not playing

---

## 🚀 Next Steps

1. **Deploy the game** to get a public URL
2. **Test on your phone** using the URL
3. **Install to home screen** following the guide above
4. **Share with friends** - they can install it too!
5. **Customize icons** for better branding

---

## 📱 Supported Devices

### **Fully Supported**
- ✅ iPhone (iOS 11.3+)
- ✅ iPad (iPadOS 11.3+)
- ✅ Android phones (Chrome 40+)
- ✅ Android tablets
- ✅ Desktop browsers (as fallback)

### **Partially Supported**
- ⚠️ Older Android versions (no PWA install)
- ⚠️ Firefox mobile (no PWA install, but playable)
- ⚠️ Samsung Internet (playable, limited PWA)

---

## 🎉 You're Ready!

Your game is now:
- ✅ **Mobile-friendly** with touch controls
- ✅ **Installable** as a PWA
- ✅ **Offline-capable** after first load
- ✅ **Full-screen** app experience
- ✅ **Shareable** via URL

**Deploy it and start playing on your phone!** 📱🎮💀
