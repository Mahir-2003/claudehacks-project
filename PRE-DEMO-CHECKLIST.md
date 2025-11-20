# ✅ Pre-Demo Checklist - Badgers Register

**Complete these 5 minutes before your presentation**

---

## 🔴 CRITICAL - Do These First

### 1. Test Backend API Key
```bash
cd backend
cat .env
# Verify ANTHROPIC_API_KEY is present and starts with "sk-ant-"
```

### 2. Start Backend Server
```bash
cd backend
npm start
```

**✅ Success looks like:**
```
🚀 UW-Madison Course Advisor API Server
✅ Server running on port 3000
✅ Anthropic API key configured
```

**❌ If you see "API key not found":**
- Check `.env` file exists in `backend/` folder
- Verify it contains: `ANTHROPIC_API_KEY=sk-ant-...`

### 3. Test Backend Health
**In a new terminal:**
```bash
curl http://localhost:3000/health
```

**✅ Should return:**
```json
{"status":"ok","timestamp":"...","apiKeyConfigured":true}
```

### 4. Load Chrome Extension
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode" (top-right)
3. Click "Load unpacked"
4. Select `/Users/Mahir/Documents/GitHub/claudehacks-project/frontend`
5. Verify "Badgers Register" appears with **NO error badges**

**❌ If you see "Could not load icon" error:**
```bash
# Run this to create icons
cd frontend
node create-icons.js
# Then reload extension
```

### 5. Test End-to-End
1. Click extension icon in Chrome
2. Type: "Test message"
3. **✅ Should get a response from Claude**
4. **❌ If error**: Check browser console (F12) and backend terminal

---

## 🟡 OPTIONAL - But Recommended

### 6. Test Madgrades Integration
```bash
cd backend  # or project root if madgrades.js is there
node test-madgrades.js
```

**Should show:** Real grade data for CS 400, MATH 221, etc.

### 7. Test On-Page Sidebar
1. Navigate to `wisc.edu`
2. Look for red "Badgers Copilot" button (bottom-right)
3. Click it - sidebar should slide in
4. Send a test message

### 8. Prepare Demo URLs
**Open these tabs in Chrome:**
- Tab 1: `wisc.edu` (for on-page demo)
- Tab 2: `chrome://extensions/` (to show extension is loaded)
- Tab 3: Backend terminal (to show API logs)
- Tab 4: Your code in VS Code (optional, if showing code)

---

## 📋 Final Verification Checklist

- [ ] Backend running on port 3000
- [ ] `curl http://localhost:3000/health` works
- [ ] Extension loaded in Chrome with no errors
- [ ] Extension icon appears in toolbar
- [ ] Can send message from extension popup and get response
- [ ] Backend terminal shows API request logs
- [ ] Browser console (F12) shows no errors
- [ ] Madgrades test passes (if using real API)

---

## 🚨 Quick Fixes

### "Extension won't load"
```bash
cd frontend
node create-icons.js
# Then reload extension in chrome://extensions/
```

### "Backend fails to start"
```bash
cd backend
rm -rf node_modules
npm install
npm start
```

### "No response from Claude"
1. Check backend terminal for errors
2. Verify `.env` has valid API key
3. Test: `curl http://localhost:3000/health`
4. Check API credits at console.anthropic.com

### "CORS errors"
- Restart backend server
- Make sure using `http://localhost:3000` not `127.0.0.1:3000`

---

## 🎤 Right Before You Present

1. **Close unnecessary apps** - keep only:
   - Chrome (with extension)
   - Terminal (with backend running)
   - This checklist

2. **Set terminal font size large** - judges need to see logs

3. **Clear browser console** - F12 → Clear console

4. **Test one final message** - make sure it works

5. **Have backup plan** - if live demo fails, show:
   - Code in VS Code
   - README.md screenshots
   - Explain architecture

---

## 💡 Demo Tips

1. **Start with the problem**: "Students don't know which courses to take"
2. **Show the solution live**: Actually use the extension
3. **Highlight technical aspects**: Show backend logs, API calls
4. **End with impact**: "Could help 45,000 UW students"

---

## 📞 Emergency Contacts

If something breaks:
1. Check `SHOWCASE.md` troubleshooting section
2. Check browser console (F12)
3. Check backend terminal logs
4. Fall back to explaining architecture + showing code

---

## ✨ You're Ready!

**Demo script:** See `SHOWCASE.md`

**Good luck! 🦡🏆**
