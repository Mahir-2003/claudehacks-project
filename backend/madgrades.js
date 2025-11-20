// TODO: Replace with real Madgrades API integration from Person 2B

/**
 * Mock Madgrades data module
 * This will be replaced with actual API calls to Madgrades
 *
 * @param {Object} courseContext - Contains courseCode, courseName, url
 * @returns {Promise<Object>} Grade distribution and instructor data
 */
async function getMadgradesData(courseContext) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock data structure - matches expected Madgrades API response
    const mockData = {
      courseCode: courseContext.courseCode,
      courseName: courseContext.courseName,
      averageGPA: 3.15,
      gradeDistribution: {
        A: 28,
        AB: 22,
        B: 25,
        BC: 15,
        C: 8,
        D: 1,
        F: 1
      },
      instructors: [
        {
          name: "Mock Professor",
          sections: 3,
          avgGPA: 3.2
        },
        {
          name: "Another Professor",
          sections: 2,
          avgGPA: 2.9
        }
      ],
      note: "This is mock data - real Madgrades integration in progress"
    };

    console.log(`[Madgrades] Retrieved mock data for ${courseContext.courseCode}`);
    return mockData;

  } catch (error) {
    console.error('[Madgrades] Error fetching data:', error.message);
    // Return null on error - server will handle gracefully
    return null;
  }
}

module.exports = { getMadgradesData };
