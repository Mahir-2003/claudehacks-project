// Content script - runs on wisc.edu pages
console.log('Badgers Register content script loaded');

// State
let sidebarOpen = false;

// Detect when user is on course registration pages
function detectRegistrationPage() {
  const url = window.location.href;
  
  // Specifically check for enroll.wisc.edu
  if (url.includes('enroll.wisc.edu')) {
    console.log('Enrollment page detected');
    injectCopilotButton();
    injectSidebar();
  } else if (url.includes('registration') || url.includes('schedule')) {
    console.log('Registration page detected');
    injectCopilotButton();
    injectSidebar();
  }
}

// Inject a floating copilot button on the page (bottom right)
function injectCopilotButton() {
  // Avoid injecting multiple times
  if (document.getElementById('badgers-copilot-btn')) return;
  
  const button = document.createElement('button');
  button.id = 'badgers-copilot-btn';
  button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
    </svg>
    <span>Badgers Copilot</span>
  `;
  button.className = 'badgers-floating-btn';
  button.title = 'Click to get course recommendations and assistance';
  
  button.addEventListener('click', () => {
    toggleSidebar();
  });
  
  document.body.appendChild(button);
  
  // Add a subtle animation to draw attention
  setTimeout(() => {
    button.style.animation = 'badgers-bounce 2s ease-in-out 3';
  }, 1000);
}

// Inject sidebar interface
function injectSidebar() {
  // Avoid injecting multiple times
  if (document.getElementById('badgers-sidebar')) return;
  
  const sidebar = document.createElement('div');
  sidebar.id = 'badgers-sidebar';
  sidebar.className = 'badgers-sidebar';
  sidebar.innerHTML = `
    <div class="badgers-sidebar-header">
      <div class="badgers-sidebar-title">
        <img src="${chrome.runtime.getURL('icons/icon48.png')}" alt="Badgers Register" style="width: 24px; height: 24px; margin-right: 8px;">
        <h2>Badgers Register</h2>
      </div>
      <button id="badgers-close-sidebar" class="badgers-close-btn">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    
    <div class="badgers-sidebar-stats">
      <div class="badgers-stat">
        <span class="badgers-stat-value" id="badgers-credits">0</span>
        <span class="badgers-stat-label">Credits</span>
      </div>
      <div class="badgers-stat">
        <span class="badgers-stat-value" id="badgers-courses">0</span>
        <span class="badgers-stat-label">Courses</span>
      </div>
    </div>
    
    <div class="badgers-sidebar-chat" id="badgers-chat">
      <div class="badgers-welcome">
        <h3>👋 Hi there!</h3>
        <p>I'm your class registration copilot. I can help you:</p>
        <ul>
          <li>Find courses that fit your schedule</li>
          <li>Get personalized recommendations</li>
          <li>Check prerequisites and availability</li>
          <li>Plan your academic path</li>
        </ul>
        <p style="margin-top: 12px; font-weight: 500;">What can I help you with today?</p>
      </div>
    </div>
    
    <div class="badgers-quick-actions">
      <button class="badgers-action-btn" data-action="recommend">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L10.09 5.26L14.5 5.91L11.25 9.08L12.18 13.47L8 11.27L3.82 13.47L4.75 9.08L1.5 5.91L5.91 5.26L8 1Z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        Recommend
      </button>
      <button class="badgers-action-btn" data-action="analyze">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Analyze Page
      </button>
    </div>
    
    <div class="badgers-sidebar-input">
      <input type="text" id="badgers-input" placeholder="Ask me anything about courses..." />
      <button id="badgers-send" class="badgers-send-btn">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M18.75 10L2.5 2.5L5.625 10L2.5 17.5L18.75 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(sidebar);
  
  // Add event listeners
  setupSidebarListeners();
}

// Toggle sidebar open/close
function toggleSidebar() {
  const sidebar = document.getElementById('badgers-sidebar');
  const button = document.getElementById('badgers-copilot-btn');
  
  if (sidebar) {
    sidebarOpen = !sidebarOpen;
    
    if (sidebarOpen) {
      sidebar.classList.add('open');
      button.style.display = 'none';
      
      // Focus input when opening
      setTimeout(() => {
        document.getElementById('badgers-input')?.focus();
      }, 300);
    } else {
      sidebar.classList.remove('open');
      button.style.display = 'flex';
    }
  }
}

// Setup sidebar event listeners
function setupSidebarListeners() {
  const closeBtn = document.getElementById('badgers-close-sidebar');
  const sendBtn = document.getElementById('badgers-send');
  const input = document.getElementById('badgers-input');
  const actionBtns = document.querySelectorAll('.badgers-action-btn');
  
  // Close button
  closeBtn?.addEventListener('click', toggleSidebar);
  
  // Send button
  sendBtn?.addEventListener('click', handleSendMessage);
  
  // Enter key
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });
  
  // Quick action buttons
  actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      handleQuickAction(action);
    });
  });
}

// Handle sending a message
async function handleSendMessage() {
  const input = document.getElementById('badgers-input');
  const message = input?.value.trim();
  
  if (!message) return;
  
  // Clear input
  input.value = '';
  
  // Add user message
  addMessageToChat(message, 'user');
  
  // Show loading
  const loadingId = addMessageToChat('Thinking<span class="badgers-loading"></span>', 'assistant', true);
  
  try {
    // Send to background script which will handle API call
    const response = await chrome.runtime.sendMessage({
      action: 'sendChatMessage',
      message: message,
      pageContext: extractPageContext()
    });
    
    // Remove loading
    removeMessageFromChat(loadingId);
    
    // Add response
    if (response.success) {
      addMessageToChat(response.data.message, 'assistant');
      
      // If courses returned, display them
      if (response.data.courses) {
        displayCourses(response.data.courses);
      }
    } else {
      addMessageToChat('Sorry, I encountered an error. Please try again.', 'assistant');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    removeMessageFromChat(loadingId);
    addMessageToChat('Sorry, I encountered an error. Please try again.', 'assistant');
  }
}

// Handle quick actions
function handleQuickAction(action) {
  const input = document.getElementById('badgers-input');
  
  switch (action) {
    case 'recommend':
      input.value = 'What courses would you recommend for me based on this page?';
      handleSendMessage();
      break;
    case 'analyze':
      addMessageToChat('Analyzing this page...', 'assistant');
      const courses = extractCourseInfo();
      if (courses.length > 0) {
        addMessageToChat(`I found ${courses.length} courses on this page. Would you like recommendations or help with any specific course?`, 'assistant');
      } else {
        addMessageToChat('I couldn\'t detect specific courses on this page. Try navigating to a course search or schedule page.', 'assistant');
      }
      break;
  }
}

// Add message to chat
function addMessageToChat(content, sender, isLoading = false) {
  const chat = document.getElementById('badgers-chat');
  const messageId = `msg-${Date.now()}`;
  
  const messageDiv = document.createElement('div');
  messageDiv.id = messageId;
  messageDiv.className = `badgers-message badgers-message-${sender}`;
  messageDiv.innerHTML = `<div class="badgers-message-content">${content}</div>`;
  
  chat.appendChild(messageDiv);
  chat.scrollTop = chat.scrollHeight;
  
  return messageId;
}

// Remove message from chat
function removeMessageFromChat(messageId) {
  const message = document.getElementById(messageId);
  message?.remove();
}

// Display courses in chat
function displayCourses(courses) {
  const chat = document.getElementById('badgers-chat');
  
  courses.forEach(course => {
    const courseDiv = document.createElement('div');
    courseDiv.className = 'badgers-course-card';
    courseDiv.innerHTML = `
      <div class="badgers-course-code">${course.code}</div>
      <div class="badgers-course-title">${course.title}</div>
      <div class="badgers-course-details">${course.credits} credits${course.instructor ? ' • ' + course.instructor : ''}</div>
      <button class="badgers-course-add">Add to Schedule</button>
    `;
    
    courseDiv.querySelector('.badgers-course-add')?.addEventListener('click', () => {
      addCourseToSchedule(course);
    });
    
    chat.appendChild(courseDiv);
  });
  
  chat.scrollTop = chat.scrollHeight;
}

// Add course to schedule
async function addCourseToSchedule(course) {
  try {
    await chrome.runtime.sendMessage({
      action: 'saveCourse',
      course: course
    });
    
    addMessageToChat(`✓ Added ${course.code} to your schedule!`, 'assistant');
    updateStats();
  } catch (error) {
    console.error('Error adding course:', error);
    addMessageToChat(`Error adding ${course.code} to schedule.`, 'assistant');
  }
}

// Update stats display
async function updateStats() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getStats' });
    if (response.success) {
      document.getElementById('badgers-credits').textContent = response.data.credits;
      document.getElementById('badgers-courses').textContent = response.data.courses;
    }
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

// Extract context from current page
function extractPageContext() {
  return {
    url: window.location.href,
    title: document.title,
    courses: extractCourseInfo()
  };
}

// Extract course information from the page
function extractCourseInfo() {
  const courses = [];
  
  // Try multiple selectors to find courses on different UW-Madison pages
  const selectors = [
    '.course-item',
    '.course-row',
    '[class*="course"]',
    'tr[class*="course"]',
    '.class-section',
    '[data-course-code]'
  ];
  
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      // Extract text content
      const text = element.textContent || '';
      
      // Try to find course code pattern (e.g., CS 400, MATH 340)
      const codeMatch = text.match(/([A-Z]+)\s*(\d{3})/);
      
      if (codeMatch) {
        const course = {
          code: `${codeMatch[1]} ${codeMatch[2]}`,
          title: extractTitle(element),
          credits: extractCredits(element),
          instructor: extractInstructor(element),
          element: element // Keep reference for highlighting
        };
        
        // Avoid duplicates
        if (!courses.find(c => c.code === course.code)) {
          courses.push(course);
        }
      }
    });
    
    if (courses.length > 0) break; // Found courses, stop trying other selectors
  }
  
  return courses;
}

function extractTitle(element) {
  // Try to find title in various ways
  const titleSelectors = ['.course-title', '.title', '[class*="title"]'];
  
  for (const selector of titleSelectors) {
    const titleEl = element.querySelector(selector);
    if (titleEl) return titleEl.textContent.trim();
  }
  
  // Fallback: try to extract from text
  const text = element.textContent;
  const match = text.match(/[A-Z]+\s*\d{3}\s*[-:]\s*(.+?)(?=\d|$|Credits|Instructor)/);
  return match ? match[1].trim() : '';
}

function extractCredits(element) {
  const text = element.textContent;
  const match = text.match(/(\d+)\s*credits?/i);
  return match ? parseInt(match[1]) : 3; // Default to 3 if not found
}

function extractInstructor(element) {
  const instructorSelectors = ['.instructor', '[class*="instructor"]'];
  
  for (const selector of instructorSelectors) {
    const instEl = element.querySelector(selector);
    if (instEl) return instEl.textContent.trim();
  }
  
  // Try to find in text
  const text = element.textContent;
  const match = text.match(/(?:Instructor|Prof|Dr)\.?\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
  return match ? match[1] : null;
}

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractCourses') {
    const courses = extractCourseInfo();
    sendResponse({ courses });
  }
  
  if (request.action === 'highlightCourse') {
    highlightCourse(request.courseCode);
    sendResponse({ success: true });
  }
  
  if (request.action === 'getStats') {
    chrome.storage.local.get(['selectedCourses'], (data) => {
      const courses = data.selectedCourses || [];
      const credits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
      sendResponse({ 
        success: true, 
        data: { credits, courses: courses.length } 
      });
    });
    return true; // Keep channel open for async response
  }
});

// Highlight a course on the page
function highlightCourse(courseCode) {
  // Remove previous highlights
  document.querySelectorAll('.badgers-highlighted-course').forEach(el => {
    el.classList.remove('badgers-highlighted-course');
  });
  
  // Find and highlight the course
  const courses = extractCourseInfo();
  const course = courses.find(c => c.code === courseCode);
  
  if (course && course.element) {
    course.element.classList.add('badgers-highlighted-course');
    course.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Initialize
detectRegistrationPage();
updateStats();

// Monitor for page changes (for single-page applications)
const observer = new MutationObserver(() => {
  detectRegistrationPage();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
