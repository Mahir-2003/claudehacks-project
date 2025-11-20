# 🔧 Quick Fix - "Stuck on Thinking" Issue

## Steps to Fix

### 1. Reload the Extension
```bash
# Go to Chrome
chrome://extensions/

# Find "Badgers Register"
# Click the refresh/reload icon 🔄
```

### 2. Test Again
1. Click the extension icon
2. Type a message
3. **Open DevTools**: Right-click on popup → "Inspect"
4. Check the **Console** tab

### 3. What to Look For

**✅ Good - You should see:**
```
[Popup] Calling backend...
[Popup] Sending to backend: {message: "test", courseContext: {...}}
[Popup] Backend raw response: {response: "...", madgradesData: {...}}
[Popup] Transformed response: {message: "...", madgradesData: {...}}
[Popup] Got response: {message: "...", ...}
```

**❌ Bad - If you see errors:**

**Error: "Failed to fetch"**
- Backend isn't running
- Fix: `cd backend && npm start`

**Error: "Backend returned 500"**
- Backend crashed
- Check backend terminal for error
- Might be API key issue

**Error: "Missing response field"**
- Backend returned wrong format
- Check backend is the correct version

**Error: Nothing at all**
- Extension might be using old code
- Hard refresh: `chrome://extensions/` → Remove extension → Re-add

### 4. Test Backend Directly

```bash
# Test health
curl http://localhost:3000/health

# Test actual API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "test",
    "courseContext": {
      "courseCode": "CS 400",
      "courseName": "Programming III",
      "url": "https://enroll.wisc.edu"
    }
  }'
```

**✅ Should return:**
```json
{
  "response": "Based on the grade data...",
  "madgradesData": {
    "courseCode": "CS 400",
    ...
  }
}
```

### 5. Common Fixes

**Fix #1: Reload Extension**
1. `chrome://extensions/`
2. Click reload icon for Badgers Register
3. Close and reopen popup
4. Try again

**Fix #2: Clear Extension Storage**
1. Open popup
2. Right-click → Inspect
3. Go to Application tab → Storage → Extension Storage
4. Right-click → Clear
5. Reload extension

**Fix #3: Restart Backend**
```bash
# Kill backend
Ctrl+C in backend terminal

# Restart
cd backend
npm start
```

**Fix #4: Check API Key**
```bash
cd backend
cat .env
# Should show: ANTHROPIC_API_KEY=sk-ant-...
```

**Fix #5: Nuclear Option**
```bash
# Remove and reinstall extension
# 1. Go to chrome://extensions/
# 2. Remove "Badgers Register"
# 3. Refresh the page
# 4. Click "Load unpacked"
# 5. Select frontend/ folder again
```

### 6. Still Stuck?

**Check these logs in order:**

1. **Extension Console** (Right-click icon → Inspect):
   - Look for `[Popup]` logs
   - Any red errors?

2. **Backend Terminal**:
   - See the `✅ [Claude] Response received` message?
   - Any errors after that?

3. **Browser Page Console** (if using sidebar on wisc.edu):
   - Press F12
   - Check Console tab
   - Look for `[Content]` or `[Background]` logs

### 7. Working Now?

After the fix, you should see:
1. Type message
2. "Thinking..." appears
3. ~2-3 seconds later
4. Claude's response appears
5. Backend logs show the request

---

## 🎯 Most Likely Fix

**90% of the time, this works:**

1. `chrome://extensions/`
2. Click reload 🔄 on "Badgers Register"
3. Close popup
4. Open popup again
5. Try message

**Still not working?**

Check browser console (right-click popup → inspect) and send me the red errors!
