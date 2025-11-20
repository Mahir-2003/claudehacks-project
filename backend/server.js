require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const { getMadgradesData } = require('./madgrades');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins (required for Chrome extension)
app.use(express.json());

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Validate API key on startup
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('\n⚠️  ERROR: ANTHROPIC_API_KEY not found in environment variables');
  console.error('📝 Please create a .env file and add your Anthropic API key');
  console.error('   Example: ANTHROPIC_API_KEY=sk-ant-api03-...\n');
  console.error('   Get your API key from: https://console.anthropic.com/\n');
}

/**
 * Generate system prompt for Claude with course and grade data
 */
function generateSystemPrompt(courseContext, madgradesData) {
  const gradeDataText = madgradesData
    ? `
Grade Distribution Data:
- Course: ${madgradesData.courseCode} - ${madgradesData.courseName}
- Average GPA: ${madgradesData.averageGPA}
- Grade Distribution: ${JSON.stringify(madgradesData.gradeDistribution, null, 2)}
- Instructors: ${JSON.stringify(madgradesData.instructors, null, 2)}
${madgradesData.note ? `\nNote: ${madgradesData.note}` : ''}
`
    : 'No grade data available for this course.';

  return `You are an expert UW-Madison course advisor assistant embedded in the enroll.wisc.edu website.

Your role:
- Help students choose courses based on difficulty, grade distributions, and requirements
- Explain course content, prerequisites, and workload
- Compare professors using grade data
- Answer questions about degree requirements and how courses fulfill them
- Provide honest, data-driven advice about course difficulty

Available data:
- Current page context: ${JSON.stringify(courseContext, null, 2)}
- ${gradeDataText}

Guidelines:
- Be concise and student-friendly
- Always cite grade data when discussing difficulty
- If you don't have specific data, say so but provide general guidance
- Format responses with clear structure (use line breaks)
- When discussing GPA, explain what it means (e.g., 3.2 = mostly Bs and ABs)
- Be encouraging but honest about course difficulty
- Suggest study strategies when relevant

Current course being discussed: ${courseContext.courseCode} - ${courseContext.courseName}`;
}

/**
 * POST /api/chat
 * Main endpoint for chatbot interactions
 *
 * Request body:
 * {
 *   message: string,
 *   courseContext: {
 *     courseCode: string,
 *     courseName: string,
 *     url: string
 *   }
 * }
 *
 * Response:
 * {
 *   response: string,
 *   madgradesData: object
 * }
 */
app.post('/api/chat', async (req, res) => {
  const requestStart = Date.now();
  console.log('\n📨 [Request] Received chat request');

  try {
    // Validate request body
    const { message, courseContext } = req.body;

    if (!message || typeof message !== 'string') {
      console.error('❌ [Validation] Missing or invalid message');
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    if (!courseContext || !courseContext.courseCode || !courseContext.courseName) {
      console.error('❌ [Validation] Missing or invalid courseContext');
      return res.status(400).json({
        error: 'courseContext with courseCode and courseName is required'
      });
    }

    console.log(`📚 [Course] ${courseContext.courseCode} - ${courseContext.courseName}`);
    console.log(`💬 [Message] "${message}"`);

    // Fetch Madgrades data (non-blocking if it fails)
    let madgradesData = null;
    try {
      console.log('🔍 [Madgrades] Fetching grade data...');
      madgradesData = await getMadgradesData(courseContext);
      if (madgradesData) {
        console.log(`✅ [Madgrades] Data retrieved (Avg GPA: ${madgradesData.averageGPA})`);
      } else {
        console.log('⚠️  [Madgrades] No data returned');
      }
    } catch (error) {
      console.error('⚠️  [Madgrades] Error (continuing without data):', error.message);
      // Continue without Madgrades data - don't crash the request
    }

    // Generate system prompt
    const systemPrompt = generateSystemPrompt(courseContext, madgradesData);

    // Call Claude API with timeout
    console.log('🤖 [Claude] Calling API...');
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 30000)
    );

    const claudePromise = anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    const response = await Promise.race([claudePromise, timeoutPromise]);

    const assistantMessage = response.content[0].text;
    const requestTime = Date.now() - requestStart;

    console.log(`✅ [Claude] Response received (${requestTime}ms)`);
    console.log(`📤 [Response] Sending response (${assistantMessage.length} chars)`);

    // Return response
    res.json({
      response: assistantMessage,
      madgradesData: madgradesData
    });

  } catch (error) {
    const requestTime = Date.now() - requestStart;
    console.error(`❌ [Error] Request failed after ${requestTime}ms:`, error.message);

    // Handle specific error types
    if (error.message === 'Request timeout') {
      return res.status(504).json({
        error: 'Request timeout - please try again'
      });
    }

    if (error.status === 401) {
      return res.status(500).json({
        error: 'API authentication failed - check server configuration'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!process.env.ANTHROPIC_API_KEY
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 UW-Madison Course Advisor API Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('⚠️  WARNING: API key not configured');
    console.log('   Create a .env file with: ANTHROPIC_API_KEY=sk-ant-api03-...\n');
  } else {
    console.log('✅ Anthropic API key configured\n');
  }

  console.log('📝 Ready to accept requests!\n');
});

/*
 * TESTING EXAMPLES
 *
 * Test with curl:
 *
 * curl -X POST http://localhost:3000/api/chat \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "message": "How hard is this class?",
 *     "courseContext": {
 *       "courseCode": "CS 400",
 *       "courseName": "Programming III",
 *       "url": "https://enroll.wisc.edu/search/..."
 *     }
 *   }'
 *
 * Test with JavaScript fetch:
 *
 * fetch('http://localhost:3000/api/chat', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     message: "Should I take this class?",
 *     courseContext: {
 *       courseCode: "MATH 234",
 *       courseName: "Calculus - Functions of Several Variables",
 *       url: "https://enroll.wisc.edu/..."
 *     }
 *   })
 * })
 * .then(r => r.json())
 * .then(data => console.log(data.response));
 *
 * Health check:
 * curl http://localhost:3000/health
 *
 * RATE LIMITING CONSIDERATION:
 * For production deployment, consider adding rate limiting middleware:
 * - npm install express-rate-limit
 * - Limit to ~10 requests per minute per IP
 * - This prevents abuse and manages API costs
 */
