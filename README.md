# UW-Madison Course Advisor API

Project developed as part of ClaudeHacks 2025

An intelligent course advisor chatbot API for UW-Madison students, powered by Claude AI. This API integrates with the enroll.wisc.edu website via a Chrome extension to provide personalized course advice based on grade distributions, difficulty, and student requirements.

## Features

- **AI-Powered Advice**: Uses Claude Sonnet 4 to provide intelligent, context-aware course recommendations
- **Grade Data Integration**: Incorporates Madgrades data for accurate difficulty assessments
- **Professor Comparisons**: Analyzes instructor performance based on historical grade data
- **Student-Friendly**: Concise, helpful responses tailored to UW-Madison students
- **Chrome Extension Ready**: CORS-enabled API designed for browser extension integration

## Quick Start

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the backend folder:

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

Get your API key from: https://console.anthropic.com/

### 4. Start the Server

```bash
npm start
```

You should see:

```
🚀 UW-Madison Course Advisor API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Server running on port 3000
📍 API endpoint: http://localhost:3000/api/chat
🏥 Health check: http://localhost:3000/health
```

## API Documentation

### POST `/api/chat`

Main endpoint for chatbot interactions.

**Request Body:**
```json
{
  "message": "How hard is this class?",
  "courseContext": {
    "courseCode": "CS 400",
    "courseName": "Programming III",
    "url": "https://enroll.wisc.edu/..."
  }
}
```

**Response:**
```json
{
  "response": "Based on the grade data, CS 400 has an average GPA of 3.15...",
  "madgradesData": {
    "courseCode": "CS 400",
    "averageGPA": 3.15,
    "gradeDistribution": { ... },
    "instructors": [ ... ]
  }
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-19T...",
  "apiKeyConfigured": true
}
```

## Testing

### Using the test script (Recommended)

The easiest way to test the API:

```bash
# Make sure server is running in one terminal:
cd backend && npm start

# In another terminal, run the test:
cd backend && node test-api.js
```

### Using curl

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Should I take this class?",
    "courseContext": {
      "courseCode": "MATH 234",
      "courseName": "Calculus - Functions of Several Variables",
      "url": "https://enroll.wisc.edu/..."
    }
  }'
```

### Using JavaScript fetch

```javascript
fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "How do the professors compare?",
    courseContext: {
      courseCode: "CS 400",
      courseName: "Programming III",
      url: "https://enroll.wisc.edu/..."
    }
  })
})
.then(r => r.json())
.then(data => console.log(data.response));
```

## Project Structure

```
claudehacks-project/
├── backend/              # Backend API server
│   ├── server.js         # Main Express server with Claude integration
│   ├── madgrades.js      # Madgrades API integration (currently mock)
│   ├── test-api.js       # Test script to verify API functionality
│   ├── package.json      # Dependencies and scripts
│   ├── .env.example      # Environment variable template
│   ├── .env              # Your actual API keys (not in git)
│   ├── .gitignore        # Git ignore rules
│   └── node_modules/     # Dependencies (generated)
└── README.md             # This file
```

## Architecture

1. **Chrome Extension** (separate project) → Injects into enroll.wisc.edu and sends course context
2. **Express API** (this project) → Receives requests, fetches grade data, calls Claude
3. **Claude AI** → Processes context and generates intelligent responses
4. **Madgrades Integration** → Provides historical grade distribution data

## Madgrades Integration

The `backend/madgrades.js` module currently returns mock data. The real Madgrades API integration will be implemented by Person 2B.

**Current mock data structure:**
```javascript
{
  courseCode: "CS 400",
  courseName: "Programming III",
  averageGPA: 3.15,
  gradeDistribution: { A: 28, AB: 22, B: 25, BC: 15, C: 8, D: 1, F: 1 },
  instructors: [
    { name: "Professor Name", sections: 3, avgGPA: 3.2 }
  ],
  note: "This is mock data - real Madgrades integration in progress"
}
```

## Development

### Error Handling

The API includes comprehensive error handling:
- ✅ Request validation (checks for required fields)
- ✅ Graceful Madgrades failures (continues without data if unavailable)
- ✅ 30-second timeout on Claude API calls
- ✅ Detailed logging for debugging
- ✅ Environment-specific error messages

### Logging

The server logs all important events:
- 📨 Incoming requests
- 📚 Course context
- 💬 User messages
- 🔍 Madgrades data fetching
- 🤖 Claude API calls
- ✅ Successful responses
- ❌ Errors and failures

### Security Considerations

**Current setup:**
- CORS enabled for all origins (required for Chrome extension)
- Environment variables for sensitive keys
- Request validation

**Production recommendations:**
- Add rate limiting (see comments in `backend/server.js`)
- Restrict CORS to specific extension origin
- Add authentication/API keys for client requests
- Monitor and log suspicious activity

## Dependencies

- **express** (^4.18.2) - Web framework
- **@anthropic-ai/sdk** (^0.32.1) - Claude AI integration
- **cors** (^2.8.5) - Enable cross-origin requests
- **dotenv** (^16.4.5) - Environment variable management
- **axios** (^1.6.8) - HTTP client (for future Madgrades API calls)

## Troubleshooting

### Server won't start

**Issue:** `ANTHROPIC_API_KEY not found`
**Solution:** Create a `.env` file in the `backend/` folder with your API key (see Quick Start above)

### CORS errors in Chrome extension

**Issue:** `Access-Control-Allow-Origin` errors
**Solution:** The server already enables CORS for all origins. Ensure the server is running and you're using the correct URL.

### Claude API errors

**Issue:** `API authentication failed`
**Solution:** Check that your API key is valid and has sufficient credits at https://console.anthropic.com/

### Timeout errors

**Issue:** `Request timeout`
**Solution:** The server has a 30-second timeout. If Claude is slow, consider increasing the timeout in `backend/server.js`.

## Team

- **Person 2A** (you): Express API server with Claude integration
- **Person 2B**: Madgrades API integration
- **Chrome Extension Team**: Browser extension for enroll.wisc.edu

## License

MIT
