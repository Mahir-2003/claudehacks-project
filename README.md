# Badgers Register - UW-Madison Course Copilot

An intelligent copilot for UW-Madison class registration that provides personalized course suggestions and recommendations.

## 🦡 Features

- **Floating Button**: Appears automatically on enroll.wisc.edu in the bottom-right corner
- **Sidebar Interface**: Full-featured chat copilot that slides in from the right
- **Smart Course Recommendations**: Get AI-powered suggestions based on your interests and academic goals
- **Interactive Chat Interface**: Natural language interface to ask about courses
- **Quick Actions**: Fast access to recommendations and page analysis
- **Schedule Planning**: Track your selected courses and total credits in real-time
- **Page Integration**: Automatically detects and extracts course information from registration pages
- **Course Highlighting**: Highlights courses on the page when discussed

---

## Backend API - Madgrades Integration

Backend API integration for the UW-Madison Course Enrollment Copilot Chrome Extension.

### Person 2B: Madgrades Integration - SETUP GUIDE

#### Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Get your Madgrades API token
# Visit: https://api.madgrades.com
# Sign up and get your token

# 3. Create .env file
cp .env.example .env

# 4. Edit .env and add your token
# MADGRADES_API_TOKEN=your_actual_token_here

# 5. Test the integration
npm test
```

#### Files Created

- **madgrades.js** - Main integration module with `getMadgradesData()` function
- **test-madgrades.js** - Test script to verify API is working
- **package.json** - Dependencies (axios for API calls)
- **.env.example** - Template for environment variables

#### Interface Contract

Person 2A will use this function:

```javascript
const { getMadgradesData } = require('./madgrades');

// Input
const courseContext = {
  courseCode: 'CS 400',  // Format: "SUBJECT NUMBER"
  term: 'Fall 2024'      // Optional (not currently used)
};

// Output
const data = await getMadgradesData(courseContext);
// Returns: {
//   courseCode: 'COMP SCI 400',
//   courseName: 'Programming III',
//   credits: 'N/A', // Not provided by API
//   totalStudents: 7814,
//   cumulativeGPA: '3.31',
//   gradeDistribution: {
//     'A': { count: 2717, percentage: '34.8' },
//     'AB': { count: 1680, percentage: '21.5' },
//     'B': { count: 2151, percentage: '27.5' },
//     // ... all other grades
//   },
//   offerings: [
//     { term: 'Spring 2025', termCode: 1252, uuid: '...' },
//     { term: 'Summer 2024', termCode: 1244, uuid: '...' },
//     // ... 13 total offerings
//   ]
// }
```

#### Testing

```bash
# Run test script
npm test

# Expected output: Course data for CS 400, MATH 221, COMP SCI 577
```

#### Integration with Person 2A

Person 2A will import this module in their server:

```javascript
const { getMadgradesData } = require('./madgrades');

// In API endpoint
const madgradesData = await getMadgradesData(courseContext);
```

#### API Endpoints Used

- `GET /v1/courses?query=CS+400` - Search for courses
- `GET /v1/courses/:uuid` - Get course details and offerings
- `GET /v1/courses/:uuid/grades` - Get cumulative grade distributions

#### Troubleshooting

**401 Error**: Check your API token in .env file
**No results**: Verify course code format (e.g., "CS 400" not "CS400")
**Timeout**: Check internet connection and api.madgrades.com status

#### Handoff Checklist

- [ ] `npm install` completed
- [ ] API token obtained from api.madgrades.com
- [ ] `.env` file created with token
- [ ] `npm test` runs successfully
- [ ] Shared madgrades.js with Person 2A
- [ ] Person 2A can import and use `getMadgradesData()`

---

## Chrome Extension - Frontend

### 📋 Project Structure

```
badgers-register/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── content.js            # Script injected into wisc.edu pages
├── content.css           # Styling for injected elements
├── background.js         # Service worker for background tasks
└── icons/                # Extension icons (needs to be created)
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

### 🚀 Installation (Development Mode)

1. **Create Icons** (required before loading):
   - Create 4 icon images in the `icons/` folder:
     - icon16.png (16x16 pixels)
     - icon32.png (32x32 pixels)
     - icon48.png (48x48 pixels)
     - icon128.png (128x128 pixels)
   - Suggested: Use Wisconsin red (#c5050c) and white colors
   - Can use placeholder images for testing

2. **Load Extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `badgers-register` folder
   - The extension should now appear in your extensions list

3. **Pin the Extension**:
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Badgers Register" and click the pin icon
   - The extension icon will now appear in your toolbar

### 🔧 Configuration

#### Backend Integration

The extension is set up to communicate with a backend API. To connect your backend:

1. Open `popup.js` and update the `API_ENDPOINT` constant:
   ```javascript
   const API_ENDPOINT = 'https://your-backend-api.com/chat';
   ```

2. Open `background.js` and update the default `apiEndpoint`:
   ```javascript
   apiEndpoint: 'https://your-backend-api.com'
   ```

3. Uncomment the actual fetch code in `popup.js` (currently using mock data)

#### Expected Backend API Format

The backend should expect POST requests with this format:

**Request:**
```json
{
  "message": "What courses would you recommend?",
  "conversationHistory": [...],
  "selectedCourses": [...]
}
```

**Response:**
```json
{
  "message": "Here are some recommendations...",
  "courses": [
    {
      "code": "CS 400",
      "title": "Programming III",
      "credits": 3,
      "instructor": "Prof. Smith"
    }
  ]
}
```

### 🧪 Testing

1. **Test the Popup**:
   - Click the extension icon in your toolbar
   - Try typing messages in the chat
   - Click the quick action buttons
   - Currently shows mock responses until backend is connected

2. **Test on enroll.wisc.edu**:
   - Navigate to `enroll.wisc.edu` (or any wisc.edu page for testing)
   - Look for the red floating "⭐ Badgers Copilot" button (bottom right)
   - Click the button to open the sidebar
   - Try typing messages in the chat
   - Use the "Recommend" and "Analyze Page" quick action buttons
   - Close the sidebar with the X button
   - Check browser console for confirmation that content script loaded

3. **Test Course Interaction**:
   - When courses are suggested, click "Add to Schedule"
   - Watch the stats update in real-time
   - Check Chrome DevTools console for any errors

4. **Check Storage**:
   - Open Chrome DevTools (F12)
   - Go to Application → Storage → Extension Storage
   - Verify data is being saved correctly

### 🎨 Customization

#### Styling
- Edit `popup.css` to change colors, fonts, or layout
- Wisconsin colors are defined in CSS variables:
  ```css
  --primary-red: #c5050c;
  --primary-dark: #9b0000;
  ```

#### Chat Interface
- Modify `popup.html` to change the layout
- Edit `popup.js` to adjust chat behavior

#### Page Integration
- Update `content.js` to customize how the extension interacts with registration pages
- Add course detection logic specific to UW-Madison's system

### 🐛 Debugging

1. **Popup Issues**:
   - Right-click extension icon → "Inspect popup"
   - Check console for errors

2. **Content Script Issues**:
   - Open DevTools on a wisc.edu page
   - Look for "Badgers Register content script loaded" in console

3. **Background Script Issues**:
   - Go to `chrome://extensions/`
   - Click "Service worker" link under your extension
   - Check the console for errors

### 📝 TODO

- [ ] Create proper extension icons
- [ ] Connect to actual backend API
- [ ] Implement course extraction from UW-Madison pages
- [ ] Add user preferences/settings modal
- [ ] Implement schedule visualization
- [ ] Add course conflict detection
- [ ] Create onboarding flow for new users
- [ ] Add unit tests
- [ ] Implement error handling and retry logic

### 🔒 Permissions Explained

- **storage**: Save user preferences and selected courses
- **activeTab**: Access the current tab when user clicks the extension
- **scripting**: Inject scripts into wisc.edu pages
- **host_permissions**: Access wisc.edu pages to read course information

---

## 🤝 Contributing

When the backend team provides API endpoints, update:
1. `popup.js` - sendToBackend() function
2. `background.js` - fetchCourseData() function
3. Any authentication tokens or API keys (use chrome.storage for sensitive data)

## 👥 Team

Project developed as part of ClaudeHacks 2025
- Frontend/UI: Chrome Extension Team
- Backend: Madgrades Integration Team