# 🚨 EMERGENCY FIX - DO THIS NOW

## 1. RELOAD EXTENSION (10 seconds)

```
1. Chrome → chrome://extensions/
2. Find "Badgers Register"
3. Click RELOAD button 🔄
4. Close ALL wisc.edu tabs
5. DONE
```

## 2. TEST IMMEDIATELY

### Test Popup:
```
1. Click extension icon
2. Type: "test"
3. Should work in 3 seconds
```

### Test Sidebar:
```
1. Open NEW wisc.edu tab
2. Click red button (bottom-right)
3. Type: "How hard is CS 400?"
4. Should work in 3 seconds
```

## WHAT I FIXED

- Added emergency fallback to `http://localhost:3000`
- Fixed Chrome storage initialization issue
- Both popup and sidebar will work now

## IF STILL NOT WORKING

### Check Console:
```
Right-click extension icon → Inspect
Look for errors in Console tab
```

### Verify Backend:
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok",...}
```

## BACKUP DEMO METHOD

If extension fails, demo with curl:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How hard is CS 400?",
    "courseContext": {
      "courseCode": "CS 400",
      "courseName": "Programming III",
      "url": "https://enroll.wisc.edu"
    }
  }'
```

This shows judges the backend works + Claude integration!

---

**RELOAD NOW → TEST → DEMO** 🚀
