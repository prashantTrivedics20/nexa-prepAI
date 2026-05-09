const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  getRandomQuestion,
  submitAnswer,
  getPracticeHistory,
  getAnalytics,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  chatWithAI,
  generalChat
} = require('../controllers/questionController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// Public routes (no authentication required for browsing)
router.get('/random', getRandomQuestion);
router.post('/chat', optionalAuth, chatWithAI); // Question-specific chat
router.post('/general-chat', optionalAuth, generalChat); // General AI chat (no question context)
router.post('/submit', optionalAuth, submitAnswer); // Public - anyone can practice (will save if authenticated)

// Protected routes (require authentication) - MUST come before /:id route
router.get('/history', requireAuth, getPracticeHistory);
router.get('/analytics', requireAuth, getAnalytics);

// Dynamic routes (must come after specific routes)
router.get('/:id', getQuestionById);
router.get('/', getQuestions);

// Admin routes
router.post('/', requireAuth, isAdmin, createQuestion);
router.put('/:id', requireAuth, isAdmin, updateQuestion);
router.delete('/:id', requireAuth, isAdmin, deleteQuestion);

module.exports = router;
