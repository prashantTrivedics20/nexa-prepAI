#!/usr/bin/env node

/**
 * API Test Script for NexaAura InterviewAI
 * Tests all critical endpoints to verify functionality
 */

const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:5000';
const TEST_EMAIL = 'admin@test.com';
const TEST_PASSWORD = 'admin123';

let authToken = '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'cyan');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

async function testEndpoint(name, method, url, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    logSuccess(`${name}: ${response.status} ${response.statusText}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      logError(`${name}: ${error.response.status} ${error.response.statusText}`);
      if (error.response.data) {
        console.log('  Response:', error.response.data);
      }
    } else {
      logError(`${name}: ${error.message}`);
    }
    return null;
  }
}

async function runTests() {
  log('\n🚀 NexaAura InterviewAI - API Test Suite\n', 'blue');
  log(`Testing API at: ${BASE_URL}\n`, 'cyan');

  // Test 1: Health Check
  log('1. Testing Health Endpoint...', 'yellow');
  await testEndpoint('Health Check', 'GET', '/health');

  // Test 2: Root Endpoint
  log('\n2. Testing Root Endpoint...', 'yellow');
  await testEndpoint('Root', 'GET', '/');

  // Test 3: Login
  log('\n3. Testing Login...', 'yellow');
  const loginData = await testEndpoint('Login', 'POST', '/api/auth/login', {
    email: TEST_EMAIL,
    password: TEST_PASSWORD
  });

  if (loginData && loginData.token) {
    authToken = loginData.token;
    logInfo(`Auth token received: ${authToken.substring(0, 20)}...`);
  } else {
    logWarning('Login failed - some tests will be skipped');
  }

  // Test 4: Get Questions
  log('\n4. Testing Questions Endpoint...', 'yellow');
  const questions = await testEndpoint('Get Questions', 'GET', '/api/questions');
  if (questions && questions.data) {
    logInfo(`Found ${questions.data.length} questions`);
  }

  // Test 5: Get Random Question
  log('\n5. Testing Random Question...', 'yellow');
  await testEndpoint('Random Question', 'GET', '/api/questions/random');

  // Test 6: Submit Answer (with auth)
  if (authToken && questions && questions.data && questions.data.length > 0) {
    log('\n6. Testing Submit Answer (Authenticated)...', 'yellow');
    const questionId = questions.data[0]._id;
    await testEndpoint('Submit Answer', 'POST', '/api/questions/submit', {
      questionId,
      answer: 'This is a test answer for API testing purposes.',
      timeSpent: 60
    }, {
      'Authorization': `Bearer ${authToken}`
    });
  } else {
    logWarning('\n6. Skipping Submit Answer test (no auth or questions)');
  }

  // Test 7: Get Practice History (requires auth)
  if (authToken) {
    log('\n7. Testing Practice History (Authenticated)...', 'yellow');
    const history = await testEndpoint('Practice History', 'GET', '/api/questions/history', null, {
      'Authorization': `Bearer ${authToken}`
    });
    if (history && history.data) {
      logInfo(`Found ${history.data.length} practice sessions`);
    }
  } else {
    logWarning('\n7. Skipping Practice History test (no auth)');
  }

  // Test 8: Get Analytics (requires auth)
  if (authToken) {
    log('\n8. Testing Analytics (Authenticated)...', 'yellow');
    const analytics = await testEndpoint('Analytics', 'GET', '/api/questions/analytics', null, {
      'Authorization': `Bearer ${authToken}`
    });
    if (analytics && analytics.data) {
      logInfo(`Total Sessions: ${analytics.data.totalSessions}`);
      logInfo(`Average Score: ${analytics.data.averageScore}`);
    }
  } else {
    logWarning('\n8. Skipping Analytics test (no auth)');
  }

  // Test 9: Get Resume (requires auth)
  if (authToken) {
    log('\n9. Testing Get Resume (Authenticated)...', 'yellow');
    const resume = await testEndpoint('Get Resume', 'GET', '/api/resume/me', null, {
      'Authorization': `Bearer ${authToken}`
    });
    if (resume && resume.parsedData) {
      logInfo('Resume found in database');
    } else {
      logInfo('No resume found (user may not have uploaded one)');
    }
  } else {
    logWarning('\n9. Skipping Resume test (no auth)');
  }

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log('Test Suite Completed!', 'green');
  log('='.repeat(50) + '\n', 'blue');

  if (!authToken) {
    logWarning('⚠ Some tests were skipped due to authentication failure');
    logInfo(`Make sure user exists: ${TEST_EMAIL} / ${TEST_PASSWORD}`);
  }
}

// Run tests
runTests().catch(error => {
  logError(`\nFatal error: ${error.message}`);
  process.exit(1);
});
