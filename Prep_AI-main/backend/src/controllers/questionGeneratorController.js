const questionGeneratorService = require('../services/questionGeneratorService');

// Generate resume-based questions
exports.generateResumeQuestions = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    const { count = 5, difficulty = 'medium' } = req.body;

    const result = await questionGeneratorService.generateResumeBasedQuestions(
      userId,
      parseInt(count),
      difficulty
    );

    res.json(result);
  } catch (error) {
    console.error('Generate resume questions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate questions'
    });
  }
};

// Generate role-specific questions
exports.generateRoleQuestions = async (req, res) => {
  try {
    const { role, experience, count = 5, difficulty = 'medium' } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      });
    }

    const result = await questionGeneratorService.generateRoleSpecificQuestions(
      role,
      experience || '0-2',
      parseInt(count),
      difficulty
    );

    res.json(result);
  } catch (error) {
    console.error('Generate role questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate questions'
    });
  }
};

// Generate company-specific questions
exports.generateCompanyQuestions = async (req, res) => {
  try {
    const { company, role, count = 5 } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: 'Company and role are required'
      });
    }

    const result = await questionGeneratorService.generateCompanySpecificQuestions(
      company,
      role,
      parseInt(count)
    );

    res.json(result);
  } catch (error) {
    console.error('Generate company questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate questions'
    });
  }
};

// Generate questions for weak topics
exports.generateWeakTopicQuestions = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    const { count = 5 } = req.body;

    const result = await questionGeneratorService.generateWeakTopicQuestions(
      userId,
      parseInt(count)
    );

    res.json(result);
  } catch (error) {
    console.error('Generate weak topic questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate questions'
    });
  }
};

// Generate scenario-based questions
exports.generateScenarioQuestions = async (req, res) => {
  try {
    const { domain, count = 5, difficulty = 'medium' } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: 'Domain is required'
      });
    }

    const result = await questionGeneratorService.generateScenarioQuestions(
      domain,
      parseInt(count),
      difficulty
    );

    res.json(result);
  } catch (error) {
    console.error('Generate scenario questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate questions'
    });
  }
};

// Generate behavioral questions
exports.generateBehavioralQuestions = async (req, res) => {
  try {
    const { count = 5, focus = 'general' } = req.body;

    const result = await questionGeneratorService.generateBehavioralQuestions(
      parseInt(count),
      focus
    );

    res.json(result);
  } catch (error) {
    console.error('Generate behavioral questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate questions'
    });
  }
};

// Generate adaptive questions
exports.generateAdaptiveQuestions = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    const { count = 5 } = req.body;

    const result = await questionGeneratorService.generateAdaptiveQuestions(
      userId,
      parseInt(count)
    );

    res.json(result);
  } catch (error) {
    console.error('Generate adaptive questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate questions'
    });
  }
};

module.exports = exports;
