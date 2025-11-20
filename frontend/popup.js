// DOM Elements
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const actionButtons = document.querySelectorAll('.action-btn');
const settingsBtn = document.getElementById('settingsBtn');
const creditsCount = document.getElementById('creditsCount');
const coursesCount = document.getElementById('coursesCount');

// State
let conversationHistory = [];
let selectedCourses = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
  setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
  // Send button
  sendBtn.addEventListener('click', handleSendMessage);
  
  // Enter key in input
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });
  
  // Enable/disable send button based on input
  userInput.addEventListener('input', () => {
    sendBtn.disabled = userInput.value.trim() === '';
  });
  
  // Quick action buttons
  actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      handleQuickAction(action);
    });
  });
  
  // Settings button
  settingsBtn.addEventListener('click', () => {
    // TODO: Open settings modal or page
    console.log('Settings clicked');
  });
}

// Load user data from storage
async function loadUserData() {
  try {
    const data = await chrome.storage.local.get(['selectedCourses', 'userPreferences']);
    
    if (data.selectedCourses) {
      selectedCourses = data.selectedCourses;
      updateStats();
    }
    
    // TODO: Load user preferences and apply them
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}

// Update statistics display
function updateStats() {
  const totalCredits = selectedCourses.reduce((sum, course) => sum + (course.credits || 0), 0);
  creditsCount.textContent = totalCredits;
  coursesCount.textContent = selectedCourses.length;
}

// Handle sending a message
async function handleSendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  
  // Clear input and disable button
  userInput.value = '';
  sendBtn.disabled = true;
  
  // Add user message to chat
  addMessage(message, 'user');
  
  // Add to conversation history
  conversationHistory.push({ role: 'user', content: message });
  
  // Show loading indicator
  const loadingId = addMessage('Thinking<span class="loading"></span>', 'assistant', true);
  
  try {
    console.log('[Popup] Calling backend...');

    // Call backend API
    const response = await sendToBackend(message);

    console.log('[Popup] Got response:', response);

    // Remove loading message
    removeMessage(loadingId);

    // Validate response
    if (!response || !response.message) {
      console.error('[Popup] Invalid response format:', response);
      addMessage('Sorry, got an invalid response from the server.', 'assistant');
      return;
    }

    // Add assistant response
    addMessage(response.message, 'assistant');

    // If response includes course suggestions, display them
    if (response.courses && response.courses.length > 0) {
      displayCourseSuggestions(response.courses);
    }

    // Add to conversation history
    conversationHistory.push({ role: 'assistant', content: response.message });

  } catch (error) {
    console.error('[Popup] Error sending message:', error);
    console.error('[Popup] Error stack:', error.stack);
    removeMessage(loadingId);
    addMessage(`Sorry, I encountered an error: ${error.message}`, 'assistant');
  }
}

// Handle quick action buttons
function handleQuickAction(action) {
  switch (action) {
    case 'recommend':
      userInput.value = 'What courses would you recommend for me?';
      handleSendMessage();
      break;
    case 'search':
      userInput.value = 'Help me search for a specific class';
      handleSendMessage();
      break;
    case 'schedule':
      userInput.value = 'Show me my current schedule';
      handleSendMessage();
      break;
  }
}

// Add message to chat
function addMessage(content, sender, isLoading = false) {
  const messageId = `msg-${Date.now()}`;
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${sender}`;
  messageDiv.id = messageId;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.innerHTML = content;
  
  messageDiv.appendChild(contentDiv);
  chatContainer.appendChild(messageDiv);
  
  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  return messageId;
}

// Remove message from chat
function removeMessage(messageId) {
  const message = document.getElementById(messageId);
  if (message) {
    message.remove();
  }
}

// Display course suggestions
function displayCourseSuggestions(courses) {
  courses.forEach(course => {
    const suggestionDiv = document.createElement('div');
    suggestionDiv.className = 'course-suggestion';
    suggestionDiv.innerHTML = `
      <div class="course-code">${course.code}</div>
      <div class="course-title">${course.title}</div>
      <div class="course-details">${course.credits} credits • ${course.instructor || 'TBA'}</div>
    `;
    
    suggestionDiv.addEventListener('click', () => {
      handleCourseSelection(course);
    });
    
    chatContainer.appendChild(suggestionDiv);
  });
  
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Handle course selection
async function handleCourseSelection(course) {
  try {
    // Add to selected courses
    if (!selectedCourses.find(c => c.code === course.code)) {
      selectedCourses.push(course);
      
      // Save to storage
      await chrome.storage.local.set({ selectedCourses });
      
      // Update stats
      updateStats();
      
      // Show confirmation
      addMessage(`Added ${course.code} to your schedule!`, 'assistant');
    } else {
      addMessage(`${course.code} is already in your schedule.`, 'assistant');
    }
  } catch (error) {
    console.error('Error selecting course:', error);
    addMessage('Error adding course to schedule.', 'assistant');
  }
}

// Send message to backend API
async function sendToBackend(message) {
  try {
    // Get API endpoint from storage (with fallback)
    let API_ENDPOINT = 'http://localhost:3000'; // Emergency fallback
    try {
      const { apiEndpoint } = await chrome.storage.local.get(['apiEndpoint']);
      if (apiEndpoint) API_ENDPOINT = apiEndpoint;
    } catch (storageError) {
      console.warn('[Popup] Storage error, using fallback:', storageError);
    }

    // Get current tab to extract course context
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Create course context
    const courseContext = {
      courseCode: 'GENERAL',
      courseName: 'UW-Madison Course Exploration',
      url: tab?.url || 'https://enroll.wisc.edu'
    };

    console.log('[Popup] Sending to backend:', { message, courseContext });

    // Call backend API
    const response = await fetch(`${API_ENDPOINT}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        courseContext: courseContext
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Popup] Backend HTTP error:', response.status, errorText);
      throw new Error(`Backend returned ${response.status}: ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    console.log('[Popup] Backend raw response:', data);

    // Validate backend response structure
    if (!data || typeof data !== 'object') {
      console.error('[Popup] Invalid data type:', typeof data);
      throw new Error('Backend returned invalid data type');
    }

    if (!data.response) {
      console.error('[Popup] Missing response field in:', data);
      throw new Error('Backend response missing required "response" field');
    }

    // Transform backend response to frontend format
    const transformed = {
      message: data.response,
      madgradesData: data.madgradesData || null,
      courses: data.madgradesData ? [{
        code: data.madgradesData.courseCode,
        title: data.madgradesData.courseName,
        credits: 3,
        avgGPA: data.madgradesData.averageGPA
      }] : []
    };

    console.log('[Popup] Transformed response:', transformed);
    return transformed;

  } catch (error) {
    console.error('[Popup] sendToBackend error:', error);
    console.error('[Popup] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'courseDetected') {
    // Handle course detection from content script
    console.log('Course detected:', request.course);
  }
});
