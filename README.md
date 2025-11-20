# UW-Madison Course Copilot - Backend

Backend API integration for the UW-Madison Course Enrollment Copilot Chrome Extension.

## Person 2B: Madgrades Integration - SETUP GUIDE

### Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Get your Madgrades API token
# Visit: https://api.madgrades.com
# Sign up and get your token

# 3. Create .env file
cp .env.example .env

# 4. Edit .env and add your token
# MADGRADES_API_TOKEN=your_actual_token_here

# 5. Test the integration
npm test
```

### Files Created

- **madgrades.js** - Main integration module with `getMadgradesData()` function
- **test-madgrades.js** - Test script to verify API is working
- **package.json** - Dependencies (axios for API calls)
- **.env.example** - Template for environment variables

### Interface Contract

Person 2A will use this function:

```javascript
const { getMadgradesData } = require('./madgrades');

// Input
const courseContext = {
  courseCode: 'CS 400',  // Format: "SUBJECT NUMBER"
  term: 'Fall 2024'      // Optional (not currently used)
};

// Output
const data = await getMadgradesData(courseContext);
// Returns: {
//   courseCode: 'COMP SCI 400',
//   courseName: 'Programming III',
//   credits: 'N/A', // Not provided by API
//   totalStudents: 7814,
//   cumulativeGPA: '3.31',
//   gradeDistribution: {
//     'A': { count: 2717, percentage: '34.8' },
//     'AB': { count: 1680, percentage: '21.5' },
//     'B': { count: 2151, percentage: '27.5' },
//     // ... all other grades
//   },
//   offerings: [
//     { term: 'Spring 2025', termCode: 1252, uuid: '...' },
//     { term: 'Summer 2024', termCode: 1244, uuid: '...' },
//     // ... 13 total offerings
//   ]
// }
```

### Testing

```bash
# Run test script
npm test

# Expected output: Course data for CS 400, MATH 221, COMP SCI 577
```

### Integration with Person 2A

Person 2A will import this module in their server:

```javascript
const { getMadgradesData } = require('./madgrades');

// In API endpoint
const madgradesData = await getMadgradesData(courseContext);
```

### API Endpoints Used

- `GET /v1/courses?query=CS+400` - Search for courses
- `GET /v1/courses/:uuid` - Get course details and offerings
- `GET /v1/courses/:uuid/grades` - Get cumulative grade distributions

### Troubleshooting

**401 Error**: Check your API token in .env file
**No results**: Verify course code format (e.g., "CS 400" not "CS400")
**Timeout**: Check internet connection and api.madgrades.com status

### Handoff Checklist

- [ ] `npm install` completed
- [ ] API token obtained from api.madgrades.com
- [ ] `.env` file created with token
- [ ] `npm test` runs successfully
- [ ] Shared madgrades.js with Person 2A
- [ ] Person 2A can import and use `getMadgradesData()`

---

## For Person 2A: Server Integration

Once Person 2B completes the above, import and use:

```javascript
const { getMadgradesData } = require('./madgrades');
```

The function is async and returns formatted data ready for Claude.
