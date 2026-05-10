const express = require('express');
const router = express.Router();
const questionGeneratorController = require('../controllers/questionGeneratorController');
const { requireAuth } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(requireAuth);

// Generate resume-based questions
router.post('/generate/resume', questionGeneratorController.generateResumeQuestions);

// Generate role-specific questions
router.post('/generate/role', questionGeneratorController.generateRoleQuestions);

// Generate company-specific questions
router.post('/generate/company', questionGeneratorController.generateCompanyQuestions);

// Generate questions for weak topics
router.post('/generate/weak-topics', questionGeneratorController.generateWeakTopicQuestions);

// Generate scenario-based questions
router.post('/generate/scenario', questionGeneratorController.generateScenarioQuestions);

// Generate behavioral questions
router.post('/generate/behavioral', questionGeneratorController.generateBehavioralQuestions);

// Generate adaptive questions based on performance
router.post('/generate/adaptive', questionGeneratorController.generateAdaptiveQuestions);

module.exports = router;
