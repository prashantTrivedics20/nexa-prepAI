const mockInterviewerService = require('../services/mockInterviewerService');

// Start a new mock interview
exports.startInterview = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    const { role, interviewerStyle = 'professional', difficulty = 'medium' } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      });
    }

    const result = await mockInterviewerService.startMockInterview(
      userId,
      role,
      interviewerStyle,
      difficulty
    );

    res.json(result);
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to start interview'
    });
  }
};

// Continue interview conversation
exports.continueInterview = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and message are required'
      });
    }

    const result = await mockInterviewerService.continueInterview(sessionId, message);

    res.json(result);
  } catch (error) {
    console.error('Continue interview error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to continue interview'
    });
  }
};

// End interview and get report
exports.endInterview = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    const result = await mockInterviewerService.endMockInterview(sessionId);

    res.json(result);
  } catch (error) {
    console.error('End interview error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to end interview'
    });
  }
};

// Get mock interview history
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    const { page = 1, limit = 10 } = req.query;

    const result = await mockInterviewerService.getMockInterviewHistory(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    res.json(result);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview history'
    });
  }
};

// Get specific interview details
exports.getInterviewDetails = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    const { sessionId } = req.params;

    const result = await mockInterviewerService.getMockInterviewDetails(sessionId, userId);

    res.json(result);
  } catch (error) {
    console.error('Get interview details error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch interview details'
    });
  }
};

module.exports = exports;
