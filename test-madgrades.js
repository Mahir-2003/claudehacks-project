// test-madgrades.js - Test script for Madgrades integration
require('dotenv').config();
const { getMadgradesData } = require('./madgrades');

async function runTests() {
  console.log('🧪 Testing Madgrades Integration...\n');

  // Test cases
  const testCases = [
    { courseCode: 'CS 400', description: 'Computer Science 400' },
    { courseCode: 'MATH 221', description: 'Calculus 1' },
    { courseCode: 'COMP SCI 577', description: 'Intro to Algorithms' }
  ];

  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📚 Testing: ${testCase.description} (${testCase.courseCode})`);
    console.log('='.repeat(60));

    try {
      const result = await getMadgradesData({ courseCode: testCase.courseCode });

      if (result) {
        console.log('✅ Success! Data retrieved:\n');
        console.log(`Course: ${result.courseCode} - ${result.courseName}`);
        console.log(`Credits: ${result.credits}`);
        console.log(`Total Students: ${result.totalStudents}`);
        console.log(`Cumulative GPA: ${result.cumulativeGPA || 'N/A'}`);

        if (result.gradeDistribution) {
          console.log('\nGrade Distribution:');
          Object.keys(result.gradeDistribution)
            .sort()
            .forEach(grade => {
              const data = result.gradeDistribution[grade];
              console.log(`  ${grade}: ${data.count} students (${data.percentage}%)`);
            });
        }

        if (result.instructors && result.instructors.length > 0) {
          console.log(`\nInstructors (${result.instructors.length}):`, result.instructors.slice(0, 5).join(', '));
        }

        console.log(`\nOfferings: ${result.offerings.length} terms`);
      } else {
        console.log('❌ No data found for this course');
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('🎉 Testing complete!');
  console.log('='.repeat(60));
}

// Check if API token is set
if (!process.env.MADGRADES_API_TOKEN) {
  console.error('❌ ERROR: MADGRADES_API_TOKEN not found in environment variables');
  console.error('Please create a .env file with your API token:');
  console.error('  MADGRADES_API_TOKEN=your_token_here\n');
  console.error('Get your token from https://api.madgrades.com');
  process.exit(1);
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
