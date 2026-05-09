const Question = require('../models/Question');
const PracticeSession = require('../models/PracticeSession');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all questions with filters
exports.getQuestions = async (req, res) => {
  try {
    const { category, difficulty, company, page = 1, limit = 20 } = req.query;
    
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (company) filter.company = company;

    const skip = (page - 1) * limit;
    
    const questions = await Question.find(filter)
      .select('-sampleAnswer -createdBy') // Don't send sample answers initially
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments(filter);

    res.json({
      success: true,
      data: questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions',
      error: error.message
    });
  }
};

// Get single question with sample answer
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question',
      error: error.message
    });
  }
};

// Get random question
exports.getRandomQuestion = async (req, res) => {
  try {
    const { category, difficulty, company } = req.query;
    
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (company) filter.company = company;

    const count = await Question.countDocuments(filter);
    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions found matching criteria'
      });
    }

    const random = Math.floor(Math.random() * count);
    const question = await Question.findOne(filter)
      .select('-sampleAnswer -createdBy')
      .skip(random);

    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Get random question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch random question',
      error: error.message
    });
  }
};

// Submit answer and get AI feedback
exports.submitAnswer = async (req, res) => {
  try {
    const { questionId, answer, timeSpent } = req.body;

    if (!questionId || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Question ID and answer are required'
      });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Get AI feedback using the evaluateAnswer service
    const { evaluateAnswer } = require('../services/aiService');
    
    let feedback;
    let score = 5;

    try {
      const evaluation = await evaluateAnswer(question.question, answer, {
        domain: question.category,
        resumeData: null
      });

      score = evaluation.score || 5;
      feedback = {
        score: evaluation.score,
        strengths: evaluation.matchedPoints?.filter(p => p.status === 'full').map(p => p.point) || [],
        improvements: evaluation.missingPoints || [],
        suggestions: evaluation.suggestions || [],
        raw: evaluation.feedback
      };
    } catch (aiError) {
      console.error('AI evaluation error:', aiError);
      // Fallback feedback if AI fails
      feedback = {
        score: 5,
        strengths: ['Answer submitted successfully'],
        improvements: ['AI evaluation temporarily unavailable'],
        suggestions: ['Please try again later'],
        raw: 'Your answer has been recorded.'
      };
    }

    // Save practice session only if user is authenticated
    let sessionId = null;
    if (req.user) {
      try {
        const userId = req.user.userId || req.user._id;
        console.log('Saving practice session for user:', userId);
        const session = await PracticeSession.create({
          user: userId,
          question: questionId,
          userAnswer: answer,
          score,
          feedback: JSON.stringify(feedback),
          timeSpent: timeSpent || 0,
          category: question.category,
          difficulty: question.difficulty
        });
        sessionId = session._id;
        console.log('Practice session saved successfully:', sessionId);
      } catch (sessionError) {
        console.error('Failed to save session:', sessionError);
        // Continue even if session save fails
      }
    } else {
      console.log('No user authenticated - practice session not saved');
    }

    res.json({
      success: true,
      data: {
        session: sessionId,
        score,
        feedback,
        sampleAnswer: question.sampleAnswer,
        tips: question.tips
      }
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit answer',
      error: error.message
    });
  }
};

// Get user's practice history
exports.getPracticeHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user.userId || req.user._id;

    const sessions = await PracticeSession.find({ user: userId })
      .populate('question', 'question category difficulty company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PracticeSession.countDocuments({ user: userId });

    res.json({
      success: true,
      data: sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get practice history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch practice history',
      error: error.message
    });
  }
};

// Get user analytics
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Total sessions
    const totalSessions = await PracticeSession.countDocuments({ user: userObjectId });

    // Average score
    const scoreAgg = await PracticeSession.aggregate([
      { $match: { user: userObjectId } },
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);
    const averageScore = scoreAgg.length > 0 ? scoreAgg[0].avgScore : 0;

    // Category breakdown
    const categoryStats = await PracticeSession.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Difficulty breakdown
    const difficultyStats = await PracticeSession.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      }
    ]);

    // Recent progress (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentProgress = await PracticeSession.aggregate([
      {
        $match: {
          user: userObjectId,
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Total time spent
    const timeAgg = await PracticeSession.aggregate([
      { $match: { user: userObjectId } },
      { $group: { _id: null, totalTime: { $sum: '$timeSpent' } } }
    ]);
    const totalTimeSpent = timeAgg.length > 0 ? timeAgg[0].totalTime : 0;

    res.json({
      success: true,
      data: {
        totalSessions,
        averageScore: Math.round(averageScore * 10) / 10,
        totalTimeSpent,
        categoryStats,
        difficultyStats,
        recentProgress
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

// Admin: Create question
exports.createQuestion = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const question = await Question.create({
      ...req.body,
      createdBy: userId
    });

    res.status(201).json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create question',
      error: error.message
    });
  }
};

// Admin: Update question
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update question',
      error: error.message
    });
  }
};

// Admin: Delete question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete question',
      error: error.message
    });
  }
};


// Chat with AI about a question
exports.chatWithAI = async (req, res) => {
  try {
    const { questionId, message } = req.body;

    if (!questionId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Question ID and message are required'
      });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const { chatWithAI } = require('../services/aiService');
    const aiResponse = await chatWithAI(question.question, message, {
      category: question.category,
      difficulty: question.difficulty,
      tags: question.tags
    });

    res.json({
      success: true,
      data: aiResponse
    });
  } catch (error) {
    console.error('Chat with AI error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI response',
      error: error.message
    });
  }
};

// General AI chat (no specific question context)
exports.generalChat = async (req, res) => {
  try {
    const { message, context, stream = true } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const { generalChat } = require('../services/aiService');

    if (stream) {
      // Set headers for Server-Sent Events
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

      // Send initial connection message
      res.write('data: {"type":"connected"}\n\n');

      try {
        await generalChat(message, context, {
          stream: true,
          onChunk: (chunk) => {
            // Send each chunk as SSE
            res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
          }
        });

        // Send completion message
        res.write('data: {"type":"done"}\n\n');
        res.end();
      } catch (streamError) {
        console.error('Streaming error:', streamError);
        res.write(`data: ${JSON.stringify({ type: 'error', message: streamError.message })}\n\n`);
        res.end();
      }
    } else {
      // Non-streaming response (fallback)
      const aiResponse = await generalChat(message, context);
      res.json({
        success: true,
        data: aiResponse
      });
    }
  } catch (error) {
    console.error('General chat error:', error);
    
    // If headers not sent, send JSON error
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to get AI response',
        error: error.message
      });
    } else {
      // If streaming already started, send error event
      res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
      res.end();
    }
  }
};
