const express = require('express');
const router = express.Router();
const {
  voiceChat,
  getConversationHistory,
  getConversationAnalytics,
  endConversation
} = require('../controllers/voiceController');
const { requireAuth } = require('../middleware/authMiddleware');

// All voice routes require authentication
router.post('/chat', requireAuth, voiceChat);
router.get('/history', requireAuth, getConversationHistory);
router.get('/analytics', requireAuth, getConversationAnalytics);
router.post('/end', requireAuth, endConversation);

module.exports = router;
