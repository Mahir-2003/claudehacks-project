/**
 * Simple test script to verify the API is working
 * Run this with: node test-api.js
 */

const testRequest = {
  message: "How hard is this class? What should I expect?",
  courseContext: {
    courseCode: "CS 400",
    courseName: "Programming III",
    url: "https://enroll.wisc.edu/search"
  }
};

console.log('🧪 Testing UW-Madison Course Advisor API\n');
console.log('📤 Sending request...');
console.log('Course:', testRequest.courseContext.courseCode, '-', testRequest.courseContext.courseName);
console.log('Question:', testRequest.message);
console.log('\n⏳ Waiting for response...\n');

fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testRequest)
})
  .then(async response => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error || error.message}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('✅ Response received!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🤖 Claude\'s Response:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(data.response);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Grade Data Used:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(JSON.stringify(data.madgradesData, null, 2));
    console.log('\n✅ Test completed successfully!');
  })
  .catch(error => {
    console.error('\n❌ Test failed:');
    console.error(error.message);
    console.error('\nMake sure the server is running: npm start');
    process.exit(1);
  });
