const { chatWithAI } = require('./aiService');
const MockInterview = require('../models/MockInterview');
const Resume = require('../models/Resume');

/**
 * AI Mock Interviewer Service
 * Conducts realistic conversational interviews with follow-ups
 */

// Start a new mock interview
exports.startMockInterview = async (userId, role, interviewerStyle = 'professional', difficulty = 'medium') => {
  try {
    const sessionId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Get user's resume for context
    const resume = await Resume.findOne({ user: userId }).sort({ createdAt: -1 });
    const resumeContext = resume ? (typeof resume.parsedData === 'string' ? resume.parsedData : JSON.stringify(resume.parsedData)) : '';

    // Create mock interview session
    const mockInterview = await MockInterview.create({
      user: userId,
      sessionId,
      interviewerStyle,
      role,
      difficulty,
      conversation: [],
      startedAt: new Date()
    });

    // Generate opening message from interviewer
    const openingMessage = await generateOpeningMessage(role, interviewerStyle, resumeContext);

    // Add interviewer's opening to conversation
    mockInterview.conversation.push({
      role: 'interviewer',
      message: openingMessage,
      timestamp: new Date()
    });

    await mockInterview.save();

    return {
      success: true,
      sessionId,
      interviewerMessage: openingMessage,
      interviewerStyle,
      role,
      difficulty
    };
  } catch (error) {
    console.error('Start mock interview error:', error);
    throw error;
  }
};

// Continue mock interview conversation
exports.continueInterview = async (sessionId, candidateMessage) => {
  try {
    const mockInterview = await MockInterview.findOne({ sessionId, status: 'in-progress' });

    if (!mockInterview) {
      throw new Error('Interview session not found or already completed');
    }

    // Add candidate's message to conversation
    const candidateEntry = {
      role: 'candidate',
      message: candidateMessage,
      timestamp: new Date()
    };

    // Analyze candidate's answer in real-time
    const analysis = await analyzeAnswer(candidateMessage, mockInterview);
    candidateEntry.analysis = analysis;

    mockInterview.conversation.push(candidateEntry);

    // Generate interviewer's response (follow-up question or feedback)
    const interviewerResponse = await generateInterviewerResponse(
      mockInterview,
      candidateMessage,
      analysis
    );

    // Add interviewer's response
    mockInterview.conversation.push({
      role: 'interviewer',
      message: interviewerResponse.message,
      timestamp: new Date()
    });

    // Update performance metrics
    updatePerformanceMetrics(mockInterview, analysis);

    await mockInterview.save();

    return {
      success: true,
      interviewerMessage: interviewerResponse.message,
      analysis,
      shouldContinue: interviewerResponse.shouldContinue,
      conversationLength: mockInterview.conversation.length
    };
  } catch (error) {
    console.error('Continue interview error:', error);
    throw error;
  }
};

// End mock interview and generate report
exports.endMockInterview = async (sessionId) => {
  try {
    const mockInterview = await MockInterview.findOne({ sessionId });

    if (!mockInterview) {
      throw new Error('Interview session not found');
    }

    // Generate comprehensive feedback
    const feedback = await generateFinalFeedback(mockInterview);

    mockInterview.status = 'completed';
    mockInterview.completedAt = new Date();
    mockInterview.feedback = feedback;

    // Calculate final scores
    calculateFinalScores(mockInterview);

    await mockInterview.save();

    return {
      success: true,
      sessionId,
      performance: mockInterview.performance,
      feedback: mockInterview.feedback,
      duration: Math.round((mockInterview.completedAt - mockInterview.startedAt) / 1000 / 60), // minutes
      totalQuestions: mockInterview.conversation.filter(c => c.role === 'interviewer').length
    };
  } catch (error) {
    console.error('End mock interview error:', error);
    throw error;
  }
};

// Get mock interview history
exports.getMockInterviewHistory = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const interviews = await MockInterview.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-conversation') // Exclude full conversation for list view
      .lean();

    const total = await MockInterview.countDocuments({ user: userId });

    return {
      success: true,
      interviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Get mock interview history error:', error);
    throw error;
  }
};

// Get specific mock interview details
exports.getMockInterviewDetails = async (sessionId, userId) => {
  try {
    const mockInterview = await MockInterview.findOne({ sessionId, user: userId }).lean();

    if (!mockInterview) {
      throw new Error('Interview not found');
    }

    return {
      success: true,
      interview: mockInterview
    };
  } catch (error) {
    console.error('Get mock interview details error:', error);
    throw error;
  }
};

// Helper: Generate opening message
async function generateOpeningMessage(role, interviewerStyle, resumeContext) {
  const stylePrompts = {
    friendly: "You are a friendly, warm interviewer. Start with a welcoming greeting and make the candidate feel comfortable.",
    professional: "You are a professional interviewer. Start with a polite greeting and set clear expectations.",
    technical: "You are a technical interviewer. Start with a brief introduction and dive into technical topics quickly.",
    tough: "You are a challenging interviewer. Start professionally but indicate you'll ask difficult questions.",
    casual: "You are a casual, relaxed interviewer. Start with a friendly, conversational tone."
  };

  const prompt = `${stylePrompts[interviewerStyle]}

You are interviewing a candidate for the ${role} position.

${resumeContext ? `Candidate's Resume Summary:\n${resumeContext.substring(0, 500)}` : ''}

Generate ONLY the opening message (2-3 sentences max). Include:
1. Brief greeting
2. Mention the role
3. Ask the first question (usually "Tell me about yourself" or similar)

Keep it natural and conversational. Don't explain what you'll do - just start the interview.

Opening message:`;

  const response = await chatWithAI('', prompt, { temperature: 0.7, maxTokens: 150 });
  return (response.response || response).trim();
}

// Helper: Generate interviewer response
async function generateInterviewerResponse(mockInterview, candidateMessage, analysis) {
  const conversationHistory = mockInterview.conversation
    .slice(-6) // Last 3 exchanges
    .map(c => `${c.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${c.message}`)
    .join('\n');

  const questionCount = mockInterview.conversation.filter(c => c.role === 'interviewer').length;
  const shouldEnd = questionCount >= 8 || mockInterview.conversation.length >= 16;

  const styleInstructions = {
    friendly: "Be warm and encouraging. Give positive feedback before asking next question.",
    professional: "Be polite and professional. Acknowledge their answer briefly, then ask next question.",
    technical: "Focus on technical depth. Ask follow-up questions to probe deeper into technical details.",
    tough: "Challenge their answers. Ask difficult follow-up questions or point out gaps.",
    casual: "Keep it conversational and relaxed. React naturally to their answers."
  };

  const prompt = `You are conducting a ${mockInterview.interviewerStyle} interview for ${mockInterview.role} position.

${styleInstructions[mockInterview.interviewerStyle]}

Recent conversation:
${conversationHistory}
Candidate: ${candidateMessage}

Candidate's answer analysis:
- Clarity: ${analysis.clarity}/10
- Relevance: ${analysis.relevance}/10
- Completeness: ${analysis.completeness}/10

${shouldEnd ? 
  'This should be your LAST question or closing statement. Thank them and wrap up the interview.' :
  'Generate your response (1-2 sentences max):\n1. Brief reaction to their answer (optional)\n2. Ask a relevant follow-up question OR move to next topic'
}

Keep it natural and conversational. Don't use formal sections or bullet points.

Your response:`;

  const response = await chatWithAI('', prompt, { temperature: 0.8, maxTokens: 150 });
  const message = (response.response || response).trim();

  return {
    message,
    shouldContinue: !shouldEnd
  };
}

// Helper: Analyze candidate's answer
async function analyzeAnswer(answer, mockInterview) {
  const words = answer.trim().split(/\s+/);
  const wordCount = words.length;

  // Basic analysis
  const analysis = {
    clarity: 7,
    relevance: 7,
    completeness: 7,
    confidence: 7,
    technicalAccuracy: 7,
    fillerWords: 0,
    pace: 'good',
    suggestions: []
  };

  // Word count analysis
  if (wordCount < 20) {
    analysis.completeness = 5;
    analysis.suggestions.push('Provide more detailed answers');
  } else if (wordCount > 150) {
    analysis.clarity = 6;
    analysis.suggestions.push('Keep answers more concise');
  }

  // Filler words detection
  const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally'];
  analysis.fillerWords = fillerWords.reduce((count, filler) => {
    return count + (answer.toLowerCase().match(new RegExp(`\\b${filler}\\b`, 'g')) || []).length;
  }, 0);

  if (analysis.fillerWords > 3) {
    analysis.confidence = 6;
    analysis.suggestions.push('Reduce filler words for more confident delivery');
  }

  // Check for specific examples
  const hasExample = /for example|for instance|such as|like when|in my experience/i.test(answer);
  if (hasExample) {
    analysis.relevance += 1;
    analysis.completeness += 1;
  } else {
    analysis.suggestions.push('Include specific examples to strengthen your answer');
  }

  // Check for STAR format (for behavioral questions)
  const hasSTAR = /situation|task|action|result|challenge|problem|solution/i.test(answer);
  if (hasSTAR) {
    analysis.completeness += 1;
  }

  // Normalize scores
  analysis.clarity = Math.min(10, analysis.clarity);
  analysis.relevance = Math.min(10, analysis.relevance);
  analysis.completeness = Math.min(10, analysis.completeness);
  analysis.confidence = Math.min(10, analysis.confidence);
  analysis.technicalAccuracy = Math.min(10, analysis.technicalAccuracy);

  return analysis;
}

// Helper: Update performance metrics
function updatePerformanceMetrics(mockInterview, analysis) {
  const candidateAnswers = mockInterview.conversation.filter(c => c.role === 'candidate' && c.analysis);
  
  if (candidateAnswers.length === 0) return;

  // Calculate averages
  const avgClarity = candidateAnswers.reduce((sum, c) => sum + (c.analysis.clarity || 0), 0) / candidateAnswers.length;
  const avgRelevance = candidateAnswers.reduce((sum, c) => sum + (c.analysis.relevance || 0), 0) / candidateAnswers.length;
  const avgCompleteness = candidateAnswers.reduce((sum, c) => sum + (c.analysis.completeness || 0), 0) / candidateAnswers.length;
  const avgConfidence = candidateAnswers.reduce((sum, c) => sum + (c.analysis.confidence || 0), 0) / candidateAnswers.length;

  mockInterview.performance.communicationScore = Math.round((avgClarity + avgConfidence) / 2 * 10) / 10;
  mockInterview.performance.technicalScore = Math.round(avgRelevance * 10) / 10;
  mockInterview.performance.problemSolvingScore = Math.round(avgCompleteness * 10) / 10;
  mockInterview.performance.overallScore = Math.round((avgClarity + avgRelevance + avgCompleteness + avgConfidence) / 4 * 10) / 10;
  
  mockInterview.performance.questionsAsked = mockInterview.conversation.filter(c => c.role === 'interviewer').length;
  mockInterview.performance.questionsAnswered = candidateAnswers.length;
}

// Helper: Calculate final scores
function calculateFinalScores(mockInterview) {
  const candidateAnswers = mockInterview.conversation.filter(c => c.role === 'candidate' && c.analysis);
  
  if (candidateAnswers.length === 0) return;

  // Identify strengths and weaknesses
  const avgScores = {
    clarity: candidateAnswers.reduce((sum, c) => sum + (c.analysis.clarity || 0), 0) / candidateAnswers.length,
    relevance: candidateAnswers.reduce((sum, c) => sum + (c.analysis.relevance || 0), 0) / candidateAnswers.length,
    completeness: candidateAnswers.reduce((sum, c) => sum + (c.analysis.completeness || 0), 0) / candidateAnswers.length,
    confidence: candidateAnswers.reduce((sum, c) => sum + (c.analysis.confidence || 0), 0) / candidateAnswers.length
  };

  mockInterview.performance.strengths = [];
  mockInterview.performance.weaknesses = [];

  if (avgScores.clarity >= 8) mockInterview.performance.strengths.push('Clear communication');
  else if (avgScores.clarity < 6) mockInterview.performance.weaknesses.push('Communication clarity');

  if (avgScores.relevance >= 8) mockInterview.performance.strengths.push('Relevant answers');
  else if (avgScores.relevance < 6) mockInterview.performance.weaknesses.push('Answer relevance');

  if (avgScores.completeness >= 8) mockInterview.performance.strengths.push('Complete responses');
  else if (avgScores.completeness < 6) mockInterview.performance.weaknesses.push('Answer completeness');

  if (avgScores.confidence >= 8) mockInterview.performance.strengths.push('Confident delivery');
  else if (avgScores.confidence < 6) mockInterview.performance.weaknesses.push('Confidence in delivery');

  // Cultural fit (based on overall performance)
  mockInterview.performance.culturalFitScore = Math.round((avgScores.clarity + avgScores.confidence) / 2 * 10) / 10;
}

// Helper: Generate final feedback
async function generateFinalFeedback(mockInterview) {
  const conversationSummary = mockInterview.conversation
    .map(c => `${c.role === 'interviewer' ? 'Q' : 'A'}: ${c.message.substring(0, 100)}...`)
    .join('\n');

  const prompt = `You are an expert interview coach. Provide comprehensive feedback for this mock interview.

Role: ${mockInterview.role}
Interview Style: ${mockInterview.interviewerStyle}
Overall Score: ${mockInterview.performance.overallScore}/10
Communication Score: ${mockInterview.performance.communicationScore}/10
Technical Score: ${mockInterview.performance.technicalScore}/10

Conversation Summary:
${conversationSummary}

Provide feedback in this format:

SUMMARY: (2-3 sentences overall assessment)

DETAILED ANALYSIS: (Paragraph analyzing their performance)

RECOMMENDATIONS: (3-5 specific actionable recommendations)

NEXT STEPS: (3-4 concrete next steps to improve)

READINESS: (One of: not-ready, needs-practice, ready, well-prepared)

Generate the feedback:`;

  const response = await chatWithAI('', prompt, { temperature: 0.7, maxTokens: 800 });
  const feedbackText = (response.response || response).trim();

  // Parse feedback
  const feedback = {
    summary: extractSection(feedbackText, 'SUMMARY'),
    detailedAnalysis: extractSection(feedbackText, 'DETAILED ANALYSIS'),
    recommendations: extractList(feedbackText, 'RECOMMENDATIONS'),
    nextSteps: extractList(feedbackText, 'NEXT STEPS'),
    estimatedReadiness: extractSection(feedbackText, 'READINESS').toLowerCase().replace(/[^a-z-]/g, '') || 'needs-practice'
  };

  return feedback;
}

// Helper: Extract section from feedback
function extractSection(text, sectionName) {
  const regex = new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=\\n\\n[A-Z]+:|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

// Helper: Extract list from feedback
function extractList(text, sectionName) {
  const section = extractSection(text, sectionName);
  return section
    .split('\n')
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(line => line.length > 0);
}

module.exports = exports;
