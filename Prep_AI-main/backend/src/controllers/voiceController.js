const VoiceConversation = require('../models/VoiceConversation');
const { voiceChat } = require('../services/aiService');
const mongoose = require('mongoose');

// Start or continue a voice conversation session
exports.voiceChat = async (req, res) => {
  try {
    const { sessionId, message, mode = 'general' } = req.body;
    const userId = req.user?.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find or create conversation session
    let conversation = await VoiceConversation.findOne({
      user: userObjectId,
      sessionId: sessionId,
      isActive: true
    });

    if (!conversation) {
      conversation = await VoiceConversation.create({
        user: userObjectId,
        sessionId: sessionId,
        mode: mode,
        messages: []
      });
    }

    // Add user message
    const userMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    // Analyze grammar and communication
    const analysis = await analyzeUserMessage(message, mode);
    userMessage.grammarAnalysis = analysis.grammar;
    userMessage.communicationAnalysis = analysis.communication;

    conversation.messages.push(userMessage);

    // Build context for AI
    const systemContext = buildAIContext(conversation, mode);

    // Get AI response using voiceChat
    const aiResponse = await voiceChat(
      message,
      systemContext,
      conversation.messages
    );

    // Add AI message
    const assistantMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };

    conversation.messages.push(assistantMessage);

    // Update summary
    updateConversationSummary(conversation);

    await conversation.save();

    res.json({
      success: true,
      data: {
        sessionId: conversation.sessionId,
        userMessage: userMessage,
        aiResponse: assistantMessage.content,
        analysis: {
          grammar: userMessage.grammarAnalysis,
          communication: userMessage.communicationAnalysis
        },
        summary: conversation.summary
      }
    });
  } catch (error) {
    console.error('Voice chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice chat',
      error: error.message
    });
  }
};

// Get conversation history
exports.getConversationHistory = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    const { sessionId, page = 1, limit = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const query = { user: userObjectId };

    if (sessionId) {
      query.sessionId = sessionId;
    }

    const skip = (page - 1) * limit;

    const conversations = await VoiceConversation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await VoiceConversation.countDocuments(query);

    res.json({
      success: true,
      data: conversations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get conversation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation history',
      error: error.message
    });
  }
};

// Get conversation analytics
exports.getConversationAnalytics = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const conversations = await VoiceConversation.find({ user: userObjectId });

    const analytics = {
      totalSessions: conversations.length,
      totalMessages: 0,
      averageGrammarScore: 0,
      averageClarityScore: 0,
      modeBreakdown: {},
      commonIssues: [],
      improvements: []
    };

    let grammarScores = [];
    let clarityScores = [];
    const issuesMap = new Map();

    conversations.forEach(conv => {
      analytics.totalMessages += conv.messages.length;

      // Mode breakdown
      analytics.modeBreakdown[conv.mode] = (analytics.modeBreakdown[conv.mode] || 0) + 1;

      // Collect scores
      conv.messages.forEach(msg => {
        if (msg.role === 'user') {
          if (msg.grammarAnalysis?.score) {
            grammarScores.push(msg.grammarAnalysis.score);
          }
          if (msg.communicationAnalysis?.clarity) {
            clarityScores.push(msg.communicationAnalysis.clarity);
          }

          // Collect issues
          if (msg.grammarAnalysis?.corrections) {
            msg.grammarAnalysis.corrections.forEach(corr => {
              const count = issuesMap.get(corr.explanation) || 0;
              issuesMap.set(corr.explanation, count + 1);
            });
          }
        }
      });
    });

    // Calculate averages
    if (grammarScores.length > 0) {
      analytics.averageGrammarScore = 
        Math.round((grammarScores.reduce((a, b) => a + b, 0) / grammarScores.length) * 10) / 10;
    }

    if (clarityScores.length > 0) {
      analytics.averageClarityScore = 
        Math.round((clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length) * 10) / 10;
    }

    // Top issues
    analytics.commonIssues = Array.from(issuesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([issue, count]) => ({ issue, count }));

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get conversation analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

// End conversation session
exports.endConversation = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user?.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const conversation = await VoiceConversation.findOneAndUpdate(
      { user: userObjectId, sessionId: sessionId },
      { isActive: false },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      data: {
        sessionId: conversation.sessionId,
        summary: conversation.summary
      }
    });
  } catch (error) {
    console.error('End conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end conversation',
      error: error.message
    });
  }
};

// Helper: Analyze user message for grammar and communication
async function analyzeUserMessage(message, mode) {
  // Simple grammar and communication analysis
  // In production, you could use a dedicated grammar checking API
  
  const analysis = {
    grammar: {
      hasErrors: false,
      corrections: [],
      score: 8 // Default score
    },
    communication: {
      clarity: 8,
      fluency: 8,
      vocabulary: 8,
      suggestions: []
    }
  };

  // Basic grammar checks
  const words = message.trim().split(/\s+/);
  const sentences = message.split(/[.!?]+/).filter(s => s.trim());

  // Check for common issues
  if (message.toLowerCase().includes('i is')) {
    analysis.grammar.hasErrors = true;
    analysis.grammar.corrections.push({
      original: 'I is',
      corrected: 'I am',
      explanation: 'Subject-verb agreement: Use "I am" not "I is"'
    });
    analysis.grammar.score = 6;
  }

  if (message.toLowerCase().includes('he go') || message.toLowerCase().includes('she go')) {
    analysis.grammar.hasErrors = true;
    analysis.grammar.corrections.push({
      original: 'he/she go',
      corrected: 'he/she goes',
      explanation: 'Third person singular: Add "s" to the verb'
    });
    analysis.grammar.score = 6;
  }

  // Check sentence structure
  if (sentences.length > 0 && sentences[0].trim().length > 0) {
    const firstChar = sentences[0].trim()[0];
    if (firstChar !== firstChar.toUpperCase()) {
      analysis.grammar.hasErrors = true;
      analysis.grammar.corrections.push({
        original: sentences[0].trim(),
        corrected: sentences[0].trim().charAt(0).toUpperCase() + sentences[0].trim().slice(1),
        explanation: 'Capitalize the first letter of a sentence'
      });
    }
  }

  // Communication analysis
  if (words.length < 5) {
    analysis.communication.clarity = 6;
    analysis.communication.suggestions.push('Try to provide more detailed responses');
  }

  if (words.length > 50) {
    analysis.communication.clarity = 7;
    analysis.communication.suggestions.push('Consider breaking long responses into shorter sentences');
  }

  // Check for filler words
  const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'actually'];
  const fillerCount = fillerWords.reduce((count, filler) => {
    return count + (message.toLowerCase().match(new RegExp(`\\b${filler}\\b`, 'g')) || []).length;
  }, 0);

  if (fillerCount > 2) {
    analysis.communication.fluency = 6;
    analysis.communication.suggestions.push('Try to reduce filler words like "um", "like", "you know"');
  }

  return analysis;
}

// Helper: Build AI context based on mode
function buildAIContext(conversation, mode) {
  const messageCount = conversation.messages.length;
  const isFirstMessage = messageCount === 0;

  const contexts = {
    'general': 'You are a helpful AI assistant. Keep responses concise and natural.',
    
    'communication-practice': isFirstMessage 
      ? `You are a communication coach. Your FIRST message must be ONLY a question. No introduction, no explanation.
Just ask ONE of these: "What did you do today?", "Tell me about your hobbies", "What's your dream job?", "Describe your favorite place".
ONLY the question. Nothing else.`
      : `You are a communication coach. Keep responses under 2 sentences.
If grammar error: "You said [X], but it should be [Y]." Then ask next question.
If no error: Give quick feedback (Good!, Nice!, Great answer!) then ask next question.
NO introductions. NO explanations. Just correction + question.`,
    
    'interview-practice': isFirstMessage
      ? `You are an interview coach. Your FIRST message must be ONLY an interview question.
Ask ONE of these: "Tell me about yourself", "What are your strengths?", "Why should we hire you?", "Describe a challenge you faced".
ONLY the question. No greeting. No explanation.`
      : `You are an interview coach. Keep responses under 2 sentences.
If answer was good: "Good answer!" then ask next interview question.
If grammar error: "You said [X], correct is [Y]." then ask next question.
NO long feedback. Just quick comment + next question.`,
    
    'grammar-focus': isFirstMessage
      ? `You are a grammar coach. Your FIRST message must be ONLY a simple question.
Ask ONE of these: "What are you working on?", "What did you eat today?", "Where do you live?".
ONLY the question. Nothing else.`
      : `You are a grammar coach. Keep responses under 2 sentences.
If grammar error: Point it out: "You said [X]. Correct: [Y]. Rule: [brief rule]."
Then ask another simple question to practice.
NO long explanations. Just correction + question.`
  };

  return contexts[mode] || contexts['general'];
}

// Helper: Update conversation summary
function updateConversationSummary(conversation) {
  const userMessages = conversation.messages.filter(m => m.role === 'user');
  
  conversation.summary.totalMessages = conversation.messages.length;

  // Calculate average scores
  const grammarScores = userMessages
    .filter(m => m.grammarAnalysis?.score)
    .map(m => m.grammarAnalysis.score);

  if (grammarScores.length > 0) {
    conversation.summary.averageGrammarScore = 
      Math.round((grammarScores.reduce((a, b) => a + b, 0) / grammarScores.length) * 10) / 10;
  }

  const clarityScores = userMessages
    .filter(m => m.communicationAnalysis?.clarity)
    .map(m => m.communicationAnalysis.clarity);

  if (clarityScores.length > 0) {
    conversation.summary.averageClarityScore = 
      Math.round((clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length) * 10) / 10;
  }

  // Collect top issues
  const issuesMap = new Map();
  userMessages.forEach(msg => {
    if (msg.grammarAnalysis?.corrections) {
      msg.grammarAnalysis.corrections.forEach(corr => {
        const count = issuesMap.get(corr.explanation) || 0;
        issuesMap.set(corr.explanation, count + 1);
      });
    }
  });

  conversation.summary.topIssues = Array.from(issuesMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([issue]) => issue);
}

module.exports = exports;
