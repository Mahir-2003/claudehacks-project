# Badgers Register - Chrome Extension Frontend

UW-Madison Course Advisor Chrome Extension powered by Claude AI.

## Overview

This Chrome extension injects a smart course advisor assistant into UW-Madison enrollment pages (enroll.wisc.edu). It connects to the backend API server to provide AI-powered course recommendations and advice.

## Features

- **Sidebar Assistant**: Click the floating button on enroll.wisc.edu to open the advisor
- **Popup Interface**: Click the extension icon for quick access
- **Course Detection**: Automatically detects courses on enrollment pages
- **Grade Data Integration**: Shows grade distributions and professor comparisons
- **Smart Recommendations**: Get personalized course suggestions

## File Structure

```
frontend/
├── manifest.json         # Extension configuration
├── background.js         # Service worker (handles API calls)
├── content.js            # Content script (injected into pages)
├── content.css          # Styles for injected elements
├── popup.html           # Extension popup UI
├── popup.js             # Popup logic
├── popup.css            # Popup styles
├── icons/               # Extension icons (add your own)
└── README.md            # This file
```

## Setup Instructions

### Prerequisites

1. **Backend API server must be running**
   ```bash
   cd ../backend
   npm install
   npm start
   ```
   The backend should be running on `http://localhost:3000`

2. **Chrome or Chromium-based browser** (Chrome, Edge, Brave, etc.)

### Loading the Extension

1. **Open Chrome Extension Management**
   - Navigate to `chrome://extensions/`
   - Or click the three dots → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right

3. **Load Unpacked Extension**
   - Click "Load unpacked"
   - Navigate to and select the `frontend/` folder
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "Badgers Register" in your extensions list
   - The extension icon will appear in your browser toolbar
   - Check for any errors in the extension details

### Adding Icons (Optional)

The extension references icon files that don't exist yet. To add proper icons:

1. Create PNG files in the `icons/` folder:
   - `icon16.png` (16x16px)
   - `icon32.png` (32x32px)
   - `icon48.png` (48x48px)
   - `icon128.png` (128x128px)

2. Or update `manifest.json` to remove icon references temporarily

Without icons, the extension will still work but may show broken images.

## Usage

### Method 1: On-Page Sidebar (Recommended)

1. Navigate to any `*.wisc.edu` page (e.g., `enroll.wisc.edu`)
2. Look for the "Badgers Copilot" floating button (bottom right)
3. Click it to open the sidebar assistant
4. Ask questions about courses, get recommendations, etc.

### Method 2: Extension Popup

1. Click the Badgers Register icon in your browser toolbar
2. Use the chat interface to ask questions
3. Quick action buttons for common tasks

## API Integration

The extension is fully integrated with the backend:

- **Endpoint**: `http://localhost:3000/api/chat`
- **Request Format**:
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
- **Response Format**:
  ```json
  {
    "response": "Claude's AI response...",
    "madgradesData": {
      "courseCode": "CS 400",
      "averageGPA": 3.15,
      "gradeDistribution": {...},
      "instructors": [...]
    }
  }
  ```

## Development

### Debugging

1. **Check Background Script Logs**:
   - Go to `chrome://extensions/`
   - Find Badgers Register
   - Click "service worker" link
   - View console logs

2. **Check Content Script Logs**:
   - Open any wisc.edu page
   - Press F12 to open DevTools
   - Check Console tab for `[Content]` logs

3. **Check Popup Logs**:
   - Right-click the extension icon
   - Select "Inspect popup"
   - View console logs

### Making Changes

After modifying any files:

1. Go to `chrome://extensions/`
2. Find Badgers Register
3. Click the refresh icon 🔄
4. Reload any open wisc.edu pages

### Common Issues

**"Failed to send chat message"**
- Make sure the backend server is running (`npm start` in backend folder)
- Check that it's on `http://localhost:3000`
- Look at backend console for error messages

**Extension not appearing**
- Check `chrome://extensions/` for errors
- Make sure Developer mode is enabled
- Try removing and re-adding the extension

**Sidebar not showing on pages**
- The extension only works on `*.wisc.edu` domains
- Check the browser console for errors
- Make sure content.js is loading

**CORS errors**
- The backend has CORS enabled for all origins
- If you still see errors, check your backend server logs

## Configuration

The extension stores its configuration in Chrome's local storage:

- `apiEndpoint`: Backend URL (default: `http://localhost:3000`)
- `selectedCourses`: User's saved courses
- `userPreferences`: User settings

You can view/modify storage:
1. `chrome://extensions/` → Badgers Register → Details
2. Scroll to "Inspect views"
3. Click "service worker"
4. In console, run: `chrome.storage.local.get(null, console.log)`

## Testing

1. **Test Backend Connection**:
   ```javascript
   // In extension console
   fetch('http://localhost:3000/health')
     .then(r => r.json())
     .then(console.log)
   ```

2. **Test Chat Function**:
   - Open sidebar or popup
   - Send a message like "What courses do you recommend?"
   - Check both frontend and backend logs

3. **Test Course Detection**:
   - Navigate to a course page on enroll.wisc.edu
   - Open sidebar
   - Click "Analyze Page" button

## Permissions

The extension requires these permissions (defined in manifest.json):

- `storage`: Save user data and preferences
- `activeTab`: Access current tab URL
- `scripting`: Inject content scripts
- `host_permissions` for `*.wisc.edu`: Run on UW-Madison sites

All permissions are necessary for core functionality.

## Production Deployment

To publish the extension:

1. **Prepare for Production**:
   - Add proper icons (required for Chrome Web Store)
   - Update `apiEndpoint` to production URL in background.js
   - Update version in manifest.json
   - Add privacy policy (required for store)

2. **Package Extension**:
   - Zip the frontend folder
   - Or use Chrome's "Pack extension" feature

3. **Publish**:
   - Create Chrome Web Store developer account ($5 one-time fee)
   - Upload packaged extension
   - Fill out store listing
   - Submit for review

## License

MIT

## Support

For issues or questions:
- Check backend logs for API errors
- Check browser console for frontend errors
- See main README.md for full project documentation
