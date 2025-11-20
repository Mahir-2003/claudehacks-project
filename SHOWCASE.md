# 🦡 Badgers Register - Judge Showcase Guide

**ClaudeHacks 2025 - UW-Madison Course Advisor**

A full-stack AI-powered course advisor that brings Claude AI directly into the UW-Madison enrollment experience.

---

## 🎯 What This Does

Students struggle with choosing courses at UW-Madison. **Badgers Register** solves this by:

1. **Embedding an AI advisor directly into enroll.wisc.edu** via Chrome extension
2. **Providing grade data analysis** using real Madgrades API integration
3. **Giving personalized recommendations** powered by Claude Sonnet 4

---

## 🚀 Quick Demo Setup (5 Minutes)

### Step 1: Start the Backend

```bash
# Navigate to project
cd /Users/Mahir/Documents/GitHub/claudehacks-project

# Start backend server
cd backend
npm start
```

**Expected output:**
```
🚀 UW-Madison Course Advisor API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Server running on port 3000
📍 API endpoint: http://localhost:3000/api/chat
🏥 Health check: http://localhost:3000/health
✅ Anthropic API key configured
```

### Step 2: Load Chrome Extension

1. **Open Chrome** → Navigate to `chrome://extensions/`
2. **Enable Developer Mode** (toggle in top-right)
3. **Click "Load unpacked"**
4. **Select folder**: `/Users/Mahir/Documents/GitHub/claudehacks-project/frontend`
5. **Verify**: "Badgers Register" appears with no errors

### Step 3: Test the Integration

**Option A: Extension Popup**
1. Click the Badgers Register icon in Chrome toolbar
2. Type: "What CS courses do you recommend?"
3. See Claude's AI response with grade data

**Option B: On-Page Sidebar (Best Demo)**
1. Navigate to any `*.wisc.edu` page (or just `wisc.edu`)
2. Click the red **"Badgers Copilot"** floating button (bottom-right)
3. Sidebar slides in from the right
4. Ask questions like:
   - "How hard is CS 400?"
   - "Should I take this class?"
   - "What's the average GPA?"

---

## 🎬 Demo Script for Judges

### 1. Show the Problem (30 seconds)

> "Students at UW-Madison face a common problem: they don't know which courses to take.
> They need to consider difficulty, grade distributions, professor ratings, and prerequisites.
> Currently, they have to check multiple websites and make decisions without guidance."

### 2. Show the Solution (2 minutes)

#### Backend Demo:
```bash
# In terminal, show API is running
curl http://localhost:3000/health

# Test a real query
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

**Point out:**
- Claude Sonnet 4 integration
- UW-Madison specific system prompt
- Madgrades data integration
- Real-time grade analysis

#### Frontend Demo:
1. Open `wisc.edu` in Chrome
2. Show floating button appears automatically
3. Click to open sidebar
4. Ask: **"I'm a computer science major. What courses should I take?"**
5. Show Claude's response with grade data
6. Ask: **"How does CS 400 compare to CS 300 in difficulty?"**
7. Show the stats panel (credits, courses selected)

### 3. Show the Architecture (1 minute)

**Draw or show diagram:**
```
Chrome Extension (Frontend)
    ↓ (User asks question)
Express API Server (Backend)
    ↓ (Fetches grade data)
Madgrades API
    ↓ (Returns grade distributions)
Backend combines with context
    ↓ (Sends to Claude)
Claude Sonnet 4 (Anthropic)
    ↓ (Generates response)
Chrome Extension (Shows answer)
```

**Technologies:**
- **Frontend**: Chrome Extension (Vanilla JS, no frameworks)
- **Backend**: Node.js + Express
- **AI**: Claude Sonnet 4 API
- **Data**: Madgrades API (real UW-Madison grade distributions)

### 4. Show Key Features (1 minute)

1. **Real-time Grade Data**
   - Show how it includes actual GPA averages
   - Grade distribution percentages
   - Professor comparisons

2. **Context Awareness**
   - Show it knows what page you're on
   - Detects courses automatically
   - Remembers conversation history

3. **UW-Madison Specific**
   - System prompt tailored for UW-Madison
   - Understands UW's AB grade system
   - Knows about UW course codes

4. **Production Ready**
   - Error handling
   - Logging
   - CORS configured
   - Environment variables
   - 30-second timeouts

---

## 💡 Technical Highlights

### Backend (`backend/server.js`)

**Claude Integration:**
```javascript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  system: generateSystemPrompt(courseContext, madgradesData),
  messages: [{ role: 'user', content: message }]
});
```

**UW-Madison Specific System Prompt:**
- Explains UW's unique AB/BC grade system
- Provides honest, data-driven course difficulty advice
- Formats GPAs in student-friendly language
- Cites actual grade distributions

**Madgrades Integration** (`backend/madgrades.js` or `madgrades.js`):
- Real-time API calls to Madgrades
- Fetches course offerings, grade distributions
- Calculates GPAs from raw data
- Handles multiple terms and instructors

### Frontend (`frontend/`)

**Content Script Injection:**
- Automatically appears on `*.wisc.edu` pages
- Floating button with bounce animation
- Smooth sidebar slide-in
- Course detection from page HTML

**Background Service Worker:**
- Handles API calls to backend
- Manages Chrome storage
- Coordinates between popup and content scripts

**Popup Interface:**
- Clean UW-Madison themed UI (red #C5050C)
- Real-time credit/course counter
- Quick action buttons
- Chat history

---

## 🎨 Visual Elements to Highlight

1. **Wisconsin Branding**
   - Cardinal red (#C5050C) throughout
   - Clean, modern UI
   - Professional typography

2. **User Experience**
   - Non-intrusive floating button
   - Slides in only when needed
   - Quick actions for common tasks
   - Responsive chat interface

3. **Data Visualization**
   - Grade distribution display
   - GPA comparisons
   - Credit totals
   - Course statistics

---

## 🔧 What Judges Can Try

### Easy Tests:

1. **Health Check**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Simple Question**
   - Open extension
   - Ask: "What should I know about CS courses?"

3. **Course Comparison**
   - Ask: "Compare CS 400 and MATH 340 difficulty"

### Advanced Tests:

1. **View Backend Logs**
   - Watch terminal while asking questions
   - See Claude API calls in real-time

2. **Inspect Network**
   - F12 → Network tab
   - See API requests/responses

3. **Check Extension Console**
   - Right-click extension icon → "Inspect popup"
   - See frontend logs

---

## 📊 Metrics to Share

- **API Response Time**: ~2-3 seconds (Claude processing)
- **Grade Data Coverage**: All UW-Madison courses in Madgrades
- **Extension Size**: Lightweight (<500KB without node_modules)
- **Backend Dependencies**: Only 5 packages (express, @anthropic-ai/sdk, cors, dotenv, axios)

---

## ❓ Anticipated Judge Questions

**Q: Does this work on the real enroll.wisc.edu?**
A: Yes! It's a Chrome extension that injects into any `*.wisc.edu` page. For the demo, we use wisc.edu since we may not have access to the enrollment system, but it works identically.

**Q: Is the grade data real?**
A: Yes! We integrate with the official Madgrades API (api.madgrades.com) which has historical grade distributions for all UW-Madison courses.

**Q: How does Claude know about UW-Madison?**
A: We use a custom system prompt that teaches Claude about:
- UW's AB/BC grade system
- Course code formats
- Common degree requirements
- How to interpret Madgrades data

**Q: Can students actually use this?**
A: Yes! To deploy:
1. Host backend on Heroku/Railway (free tier works)
2. Update extension with production API URL
3. Publish to Chrome Web Store ($5 fee)
4. Students install like any extension

**Q: What about API costs?**
A: Claude Sonnet 4 is very affordable:
- ~$3 per 1M input tokens
- ~$15 per 1M output tokens
- Average query: ~$0.002
- Could serve thousands of students for <$50/month

**Q: How do you handle incorrect/outdated grade data?**
A:
- Madgrades updates regularly
- We show data timestamps
- Claude is instructed to indicate when data might be old
- Fallback: general advice if no data available

---

## 🏆 Why This Wins

1. **Solves a Real Problem**: Every UW-Madison student struggles with course selection
2. **Full-Stack Integration**: Not just a chatbot - embedded in actual enrollment flow
3. **Production Ready**: Error handling, logging, environment configs
4. **Data-Driven**: Uses real grade distributions, not opinions
5. **Great UX**: Non-intrusive, helpful, fast
6. **Scalable**: Could serve entire UW-Madison student body
7. **Extensible**: Easy to add more features (schedule visualization, conflict detection, etc.)

---

## 🚨 Troubleshooting During Demo

**If backend won't start:**
```bash
cd backend
rm -rf node_modules
npm install
npm start
```

**If extension won't load:**
- Check `chrome://extensions/` for errors
- Try removing and re-adding
- Make sure you selected the `frontend/` folder

**If API calls fail:**
- Check backend is running: `curl http://localhost:3000/health`
- Check browser console (F12) for CORS errors
- Verify .env has ANTHROPIC_API_KEY

**If no response from Claude:**
- Check backend terminal for errors
- Verify API key is valid at console.anthropic.com
- Check API credits available

---

## 📁 File Structure for Judges

```
claudehacks-project/
├── backend/                    # Express API Server
│   ├── server.js              # Main server with Claude integration
│   ├── madgrades.js           # Madgrades API integration
│   ├── package.json           # Dependencies
│   └── .env                   # API keys (Anthropic + Madgrades)
│
├── frontend/                   # Chrome Extension
│   ├── manifest.json          # Extension configuration
│   ├── background.js          # Service worker (API calls)
│   ├── content.js             # Page injection script
│   ├── popup.html/js/css      # Extension popup UI
│   └── icons/                 # Extension icons
│
└── README.md                   # Full documentation
```

---

## 🎤 Closing Statement for Judges

> "Badgers Register demonstrates how AI can be seamlessly integrated into existing student workflows.
> Instead of going to ChatGPT and copying course codes, students get intelligent, data-driven advice
> right where they need it - in the enrollment system.
>
> This is production-ready software that could help thousands of UW-Madison students make better
> course decisions, backed by real grade data and powered by Claude's advanced reasoning.
>
> Thank you!"

---

## 📞 For Questions

- Backend API: See `backend/README.md`
- Frontend: See `frontend/README.md`
- Architecture: See main `README.md`

**Demo ready! Good luck! 🦡**
