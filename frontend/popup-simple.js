// SIMPLIFIED POPUP - NO CHROME STORAGE, DIRECT API CALLS
// Use this if the main popup.js has issues

const API_URL = 'http://localhost:3000/api/chat';

// DOM Elements
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Enable send button on input
userInput.addEventListener('input', () => {
  sendBtn.disabled = userInput.value.trim() === '';
});

// Send on Enter key
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !sendBtn.disabled) {
    handleSend();
  }
});

// Send on button click
sendBtn.addEventListener('click', handleSend);

// Handle sending message
async function handleSend() {
  const message = userInput.value.trim();
  if (!message) return;

  // Clear input
  userInput.value = '';
  sendBtn.disabled = true;

  // Add user message
  addMessage(message, 'user');

  // Show loading
  const loadingId = 'loading-' + Date.now();
  addMessage('Thinking...', 'assistant', loadingId);

  try {
    console.log('[Simple Popup] Sending:', message);

    // Direct API call - no Chrome storage
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        courseContext: {
          courseCode: 'GENERAL',
          courseName: 'UW-Madison Course',
          url: 'https://enroll.wisc.edu'
        }
      })
    });

    // Remove loading
    document.getElementById(loadingId)?.remove();

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('[Simple Popup] Got response:', data);

    // Add response
    addMessage(data.response, 'assistant');

  } catch (error) {
    console.error('[Simple Popup] Error:', error);
    document.getElementById(loadingId)?.remove();
    addMessage('Error: ' + error.message, 'assistant');
  }
}

// Add message to chat
function addMessage(text, sender, id) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message message-${sender}`;
  if (id) msgDiv.id = id;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = text;

  msgDiv.appendChild(contentDiv);
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  return id;
}

console.log('[Simple Popup] Loaded - API URL:', API_URL);
