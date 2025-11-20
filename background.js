// Background service worker
console.log('Badgers Register background service worker loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Badgers Register installed');
    
    // Initialize default settings
    chrome.storage.local.set({
      selectedCourses: [],
      userPreferences: {
        major: '',
        minor: '',
        interests: [],
        notificationsEnabled: true
      },
      apiEndpoint: 'https://your-backend-api.com' // TODO: Update with actual endpoint
    });
    
    // Open welcome page or instructions (optional)
    // chrome.tabs.create({ url: 'welcome.html' });
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'openPopup':
      // Open popup programmatically
      chrome.action.openPopup();
      break;
      
    case 'sendChatMessage':
      // Handle chat message from content script
      handleChatMessage(request.message, request.pageContext)
        .then(data => sendResponse({ success: true, data }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep channel open for async response
      
    case 'fetchCourseData':
      // Fetch course data from backend
      fetchCourseData(request.query)
        .then(data => sendResponse({ success: true, data }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep channel open for async response
      
    case 'saveCourse':
      // Save course to storage
      saveCourse(request.course)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'removeCourse':
      // Remove course from storage
      removeCourse(request.courseCode)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'getStats':
      // Get statistics
      getStats()
        .then(data => sendResponse({ success: true, data }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
  }
});

// Handle chat message
async function handleChatMessage(message, pageContext) {
  try {
    const { apiEndpoint } = await chrome.storage.local.get('apiEndpoint');
    const { selectedCourses } = await chrome.storage.local.get('selectedCourses');
    
    // TODO: Replace with actual backend endpoint when ready
    // For now, return mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: `I can help you with that! Based on the page you're on, here are some suggestions.`,
          courses: [
            {
              code: 'CS 400',
              title: 'Programming III',
              credits: 3,
              instructor: 'Prof. Smith'
            },
            {
              code: 'MATH 340',
              title: 'Elementary Matrix and Linear Algebra',
              credits: 3,
              instructor: 'Prof. Johnson'
            }
          ]
        });
      }, 1000);
    });
    
    /* Uncomment when backend is ready:
    const response = await fetch(`${apiEndpoint}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        pageContext,
        selectedCourses
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send chat message');
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error('Error handling chat message:', error);
    throw error;
  }
}

// Get statistics
async function getStats() {
  try {
    const { selectedCourses } = await chrome.storage.local.get('selectedCourses');
    const courses = selectedCourses || [];
    const credits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
    
    return {
      credits,
      courses: courses.length
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
}

// Fetch course data from backend
async function fetchCourseData(query) {
  try {
    const { apiEndpoint } = await chrome.storage.local.get('apiEndpoint');
    
    // TODO: Replace with actual backend endpoint
    const response = await fetch(`${apiEndpoint}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch course data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching course data:', error);
    throw error;
  }
}

// Save a course to user's selected courses
async function saveCourse(course) {
  try {
    const { selectedCourses } = await chrome.storage.local.get('selectedCourses');
    
    // Avoid duplicates
    if (!selectedCourses.find(c => c.code === course.code)) {
      selectedCourses.push(course);
      await chrome.storage.local.set({ selectedCourses });
      
      // Optionally sync with backend
      await syncWithBackend('addCourse', course);
    }
  } catch (error) {
    console.error('Error saving course:', error);
    throw error;
  }
}

// Remove a course from user's selected courses
async function removeCourse(courseCode) {
  try {
    const { selectedCourses } = await chrome.storage.local.get('selectedCourses');
    const updatedCourses = selectedCourses.filter(c => c.code !== courseCode);
    
    await chrome.storage.local.set({ selectedCourses: updatedCourses });
    
    // Optionally sync with backend
    await syncWithBackend('removeCourse', { courseCode });
  } catch (error) {
    console.error('Error removing course:', error);
    throw error;
  }
}

// Sync data with backend
async function syncWithBackend(action, data) {
  try {
    const { apiEndpoint } = await chrome.storage.local.get('apiEndpoint');
    
    // TODO: Implement actual backend sync
    const response = await fetch(`${apiEndpoint}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, data })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Sync error:', error);
    // Don't throw - allow operation to complete locally even if sync fails
  }
}

// Periodic sync (optional - for keeping data fresh)
chrome.alarms.create('syncData', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncData') {
    // Perform periodic sync
    console.log('Performing periodic sync');
  }
});

// Context menu integration (right-click options)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'addToBadgers',
    title: 'Add to Badgers Register',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'addToBadgers') {
    // Handle right-click action
    console.log('Selected text:', info.selectionText);
  }
});
