# 🚀 START HERE - Complete Setup Guide

**Follow these steps in order. Takes 3 minutes.**

---

## ⚠️ IMPORTANT: Do This Every Time

**When you reload the extension, you MUST reload all wisc.edu pages!**

Why? Chrome extensions can't talk to old pages after being reloaded.

---

## 📋 Step-by-Step Setup

### Step 1: Start Backend (Terminal 1)

```bash
cd /Users/Mahir/Documents/GitHub/claudehacks-project/backend
npm start
```

**Wait for:**
```
✅ Server running on port 3000
✅ Anthropic API key configured
```

**✅ Test it works:**
```bash
# In a new terminal
curl http://localhost:3000/health
```

Should return: `{"status":"ok",...}`

---

### Step 2: Load Extension in Chrome

1. **Open Chrome** → Go to: `chrome://extensions/`

2. **Enable Developer Mode**
   - Toggle switch in top-right corner

3. **Load the Extension**
   - Click **"Load unpacked"** button
   - Navigate to: `/Users/Mahir/Documents/GitHub/claudehacks-project/frontend`
   - Click **"Select Folder"**

4. **Verify**
   - "Badgers Register" appears in the list
   - **NO red error badges**
   - Extension icon appears in toolbar

**❌ If you see "Could not load icon" error:**
```bash
cd /Users/Mahir/Documents/GitHub/claudehacks-project/frontend
node create-icons.js
# Then reload extension (step 5)
```

---

### Step 3: CLOSE All wisc.edu Tabs

**CRITICAL:** Before testing, close any open wisc.edu tabs!

- This prevents the "Extension context invalidated" error
- Old pages can't talk to the new extension

---

### Step 4: Test with Extension Popup

1. **Click** the Badgers Register icon in Chrome toolbar
2. **Right-click** the popup → **"Inspect"** (opens DevTools)
3. **Go to Console tab**
4. **Type a message** in the popup: "Test"
5. **Watch the console** for logs

**✅ Good - You should see:**
```
[Popup] Calling backend...
[Popup] Backend raw response: {response: "...", madgradesData: {...}}
[Popup] Got response: {message: "..."}
```

**Then Claude's response appears in the chat!**

---

### Step 5: Test On-Page Sidebar

1. **Open a NEW tab** → Navigate to: `wisc.edu`
2. **Look for** the red **"Badgers Copilot"** button (bottom-right)
3. **Click it** → Sidebar slides in
4. **Type:** "How hard is CS 400?"
5. **Wait 2-3 seconds** → Response appears!

---

## 🔄 If You Need to Reload Extension

**EVERY TIME you reload the extension:**

```bash
1. Go to chrome://extensions/
2. Click reload 🔄 on "Badgers Register"
3. ⚠️ CLOSE ALL wisc.edu TABS
4. Open NEW wisc.edu tab
5. Test again
```

**Why close tabs?** Old tabs still have old code that can't talk to new extension.

---

## 🐛 Common Issues & Fixes

### Issue: "Extension context invalidated"

**Cause:** You reloaded the extension while a page was open

**Fix:**
```bash
1. Close ALL wisc.edu tabs
2. Reload extension (chrome://extensions/)
3. Open NEW tab with wisc.edu
```

### Issue: "Stuck on Thinking..."

**Fix:**
```bash
# Check if backend is running
curl http://localhost:3000/health

# If not, start it
cd backend
npm start
```

### Issue: "Failed to fetch"

**Cause:** Backend not running or wrong URL

**Fix:**
```bash
# Make sure backend is on port 3000
cd backend
npm start

# Test health endpoint
curl http://localhost:3000/health
```

### Issue: No floating button appears

**Cause:** Extension only works on *.wisc.edu domains

**Fix:**
- Make sure you're on a `.wisc.edu` URL
- Or use the popup (click extension icon)
- Check console (F12) for content script errors

---

## ✅ Success Checklist

Before demoing to judges, verify:

- [ ] Backend running: `curl http://localhost:3000/health` works
- [ ] Extension loaded in Chrome (no errors)
- [ ] Can send message from popup and get response
- [ ] Can open sidebar on wisc.edu and get response
- [ ] Backend logs show requests coming in
- [ ] Browser console shows no red errors

---

## 🎯 Demo Workflow

**For judges (recommended order):**

### 1. Show Backend (Terminal)
```bash
cd backend
npm start
# Point out: Claude integration, Madgrades, logging
```

### 2. Show Extension Loading
```bash
# In Chrome
chrome://extensions/
# Show it's loaded, no errors
```

### 3. Demo Extension Popup
```bash
# Click extension icon
# Ask: "What CS courses do you recommend?"
# Show: Claude's response with grade data
```

### 4. Demo On-Page Sidebar (Best Part!)
```bash
# Navigate to wisc.edu
# Show: Floating button appears automatically
# Click: Sidebar slides in
# Ask: "How hard is CS 400?"
# Show: Real-time grade data integration
```

### 5. Show Technical Details
```bash
# Backend terminal: Show API logs
# Browser console: Show frontend logs
# Explain: Full-stack architecture
```

---

## 📚 Additional Resources

- **`SHOWCASE.md`** - Complete demo script for judges
- **`PRE-DEMO-CHECKLIST.md`** - Last-minute checklist
- **`QUICK-FIX.md`** - Troubleshooting guide
- **`README.md`** - Full technical documentation

---

## 🆘 Still Having Issues?

1. **Check backend logs** - Look for errors in terminal
2. **Check browser console** - Right-click popup → Inspect
3. **Restart everything:**
   ```bash
   # Kill backend (Ctrl+C)
   # Remove extension
   # Start backend again
   # Load extension again
   # Close all tabs
   # Open new tab
   ```

---

## 🎤 Ready to Demo!

**Quick test before judges:**
```bash
1. Backend running? ✓
2. Extension loaded? ✓
3. Test message works? ✓
4. On-page sidebar works? ✓
```

**You're ready! 🦡🏆**

See `SHOWCASE.md` for the complete demo script!
