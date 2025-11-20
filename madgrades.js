// madgrades.js - Madgrades API Integration for UW-Madison
const axios = require('axios');

const MADGRADES_BASE = 'https://api.madgrades.com';
const API_TOKEN = process.env.MADGRADES_API_TOKEN; // Add your token to .env

/**
 * Fetch comprehensive grade distribution data for a course
 * @param {Object} courseContext - { courseCode: 'CS 400', term: 'Fall 2024' }
 * @param {string} courseContext.courseCode - e.g., "CS 400" or "MATH 221"
 * @param {string} [courseContext.term] - e.g., "Fall 2024" (optional)
 * @returns {Promise<Object|null>} Formatted grade data or null if not found
 */
async function getMadgradesData(courseContext) {
  if (!courseContext || !courseContext.courseCode) {
    console.warn('No course code provided to getMadgradesData');
    return null;
  }

  try {
    // Parse course code (e.g., "CS 400" -> subject: "CS", number: "400")
    const courseCode = courseContext.courseCode.trim();
    const parts = courseCode.split(/\s+/);

    if (parts.length < 2) {
      console.warn(`Invalid course code format: ${courseCode}`);
      return null;
    }

    const subject = parts[0];
    const number = parts[1];

    // Search for the course
    const searchQuery = `${subject} ${number}`;
    console.log(`Searching Madgrades for: ${searchQuery}`);

    const searchResponse = await axios.get(`${MADGRADES_BASE}/v1/courses`, {
      params: {
        query: searchQuery,
        per_page: 5
      },
      headers: {
        'Authorization': `Token token=${API_TOKEN}`
      }
    });

    if (!searchResponse.data || !searchResponse.data.results || searchResponse.data.results.length === 0) {
      console.warn(`No courses found for: ${searchQuery}`);
      return null;
    }

    // Get the first matching course (most relevant)
    const course = searchResponse.data.results[0];
    console.log(`Found course: ${course.name} (UUID: ${course.uuid})`);

    // Fetch detailed course information including grade distributions
    const detailResponse = await axios.get(`${MADGRADES_BASE}/v1/courses/${course.uuid}`, {
      headers: {
        'Authorization': `Token token=${API_TOKEN}`
      }
    });

    const detailedCourse = detailResponse.data;

    // Fetch grade distributions from the grades endpoint
    let gradesData = null;
    if (detailedCourse.gradesUrl) {
      try {
        const gradesResponse = await axios.get(detailedCourse.gradesUrl, {
          headers: {
            'Authorization': `Token token=${API_TOKEN}`
          }
        });
        gradesData = gradesResponse.data;
      } catch (error) {
        console.warn('Could not fetch grade data:', error.message);
      }
    }

    // Format the data for Claude
    const formattedData = formatGradeData(detailedCourse, gradesData);
    return formattedData;

  } catch (error) {
    if (error.response) {
      console.error(`Madgrades API error: ${error.response.status} - ${error.response.statusText}`);
      if (error.response.status === 401) {
        console.error('Authentication failed. Check your MADGRADES_API_TOKEN');
      }
    } else {
      console.error('Madgrades API error:', error.message);
    }
    return null;
  }
}

/**
 * Format grade data into a readable structure for Claude
 * @param {Object} rawData - Raw API response from Madgrades
 * @param {Object} gradesData - Grade distribution data from grades endpoint
 * @returns {Object} Formatted grade data
 */
function formatGradeData(rawData, gradesData) {
  // Extract subject abbreviation from subjects array
  const subjectAbbr = rawData.subjects?.[0]?.abbreviation || 'N/A';

  const formatted = {
    courseCode: `${subjectAbbr} ${rawData.number}`,
    courseName: rawData.name,
    credits: 'N/A', // Not provided in API response
    description: 'No description available', // Not in basic response
    offerings: []
  };

  // Process course offerings (note: camelCase, not snake_case)
  if (rawData.courseOfferings && rawData.courseOfferings.length > 0) {
    rawData.courseOfferings.forEach(offering => {
      formatted.offerings.push({
        term: parseTermCode(offering.termCode),
        termCode: offering.termCode,
        uuid: offering.uuid
      });
    });
  }

  // Process grade distributions if available
  if (gradesData && gradesData.cumulative) {
    const cum = gradesData.cumulative;
    const totalStudents = cum.total || 0;

    // Map API fields to grade names
    const gradeAggregate = {
      'A': cum.aCount || 0,
      'AB': cum.abCount || 0,
      'B': cum.bCount || 0,
      'BC': cum.bcCount || 0,
      'C': cum.cCount || 0,
      'D': cum.dCount || 0,
      'F': cum.fCount || 0,
      'S': cum.sCount || 0,
      'U': cum.uCount || 0,
      'CR': cum.crCount || 0,
      'N': cum.nCount || 0,
      'P': cum.pCount || 0,
      'I': cum.iCount || 0,
      'NW': cum.nwCount || 0,
      'NR': cum.nrCount || 0,
      'Other': cum.otherCount || 0
    };

    // Calculate percentages and filter out zero counts
    const gradeDistribution = {};
    Object.keys(gradeAggregate).forEach(grade => {
      const count = gradeAggregate[grade];
      if (count > 0) {
        gradeDistribution[grade] = {
          count: count,
          percentage: totalStudents > 0
            ? ((count / totalStudents) * 100).toFixed(1)
            : 0
        };
      }
    });

    formatted.gradeDistribution = gradeDistribution;
    formatted.totalStudents = totalStudents;
    formatted.cumulativeGPA = calculateGPA(gradeAggregate, totalStudents);
  } else {
    formatted.totalStudents = 0;
    formatted.gradeDistribution = null;
    formatted.cumulativeGPA = null;
  }

  return formatted;
}

/**
 * Parse Madgrades term code to readable format
 * Format: 1234 where 123 is year and 4 is term (2=Spring, 4=Summer, 6=Fall)
 * @param {number} termCode - e.g., 1252 = Spring 2025
 * @returns {string} Readable term name
 */
function parseTermCode(termCode) {
  if (!termCode) return 'Unknown';

  const codeStr = termCode.toString();
  if (codeStr.length !== 4) return 'Unknown';

  const year = parseInt(codeStr.substring(0, 3)) + 1900;
  const termDigit = parseInt(codeStr.substring(3));

  const termMap = {
    2: 'Spring',
    4: 'Summer',
    6: 'Fall'
  };

  const term = termMap[termDigit] || 'Unknown';
  return `${term} ${year}`;
}

/**
 * Calculate GPA from grade distribution
 * @param {Object} gradeAggregate - Grade counts
 * @param {number} totalStudents - Total number of students
 * @returns {number|null} Calculated GPA or null
 */
function calculateGPA(gradeAggregate, totalStudents) {
  if (totalStudents === 0) return null;

  const gradePoints = {
    'A': 4.0,
    'AB': 3.5,
    'B': 3.0,
    'BC': 2.5,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0
  };

  let totalPoints = 0;
  let countedStudents = 0;

  Object.keys(gradeAggregate).forEach(grade => {
    if (gradePoints[grade] !== undefined) {
      totalPoints += gradePoints[grade] * gradeAggregate[grade];
      countedStudents += gradeAggregate[grade];
    }
  });

  return countedStudents > 0
    ? (totalPoints / countedStudents).toFixed(2)
    : null;
}

module.exports = { getMadgradesData };
