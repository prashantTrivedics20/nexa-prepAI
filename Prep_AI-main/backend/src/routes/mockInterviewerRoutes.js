const express = require('express');
const router = express.Router();
const mockInterviewerController = require('../controllers/mockInterviewerController');
const { requireAuth } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(requireAuth);

// Start a new mock interview
router.post('/start', mockInterviewerController.startInterview);

// Continue interview conversation
router.post('/continue', mockInterviewerController.continueInterview);

// End interview and get report
router.post('/end', mockInterviewerController.endInterview);

// Get mock interview history
router.get('/history', mockInterviewerController.getHistory);

// Get specific interview details
router.get('/:sessionId', mockInterviewerController.getInterviewDetails);

module.exports = router;
