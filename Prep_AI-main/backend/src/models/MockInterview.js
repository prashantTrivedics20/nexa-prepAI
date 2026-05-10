const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  interviewerStyle: {
    type: String,
    enum: ['friendly', 'professional', 'technical', 'tough', 'casual'],
    default: 'professional'
  },
  role: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  duration: {
    type: Number, // in minutes
    default: 30
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  conversation: [{
    role: {
      type: String,
      enum: ['interviewer', 'candidate'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    // Real-time analysis of candidate's answer
    analysis: {
      clarity: Number, // 0-10
      relevance: Number, // 0-10
      completeness: Number, // 0-10
      confidence: Number, // 0-10
      technicalAccuracy: Number, // 0-10
      fillerWords: Number,
      pace: String, // 'too-fast', 'good', 'too-slow'
      suggestions: [String]
    }
  }],
  // Overall interview performance
  performance: {
    overallScore: {
      type: Number,
      default: 0
    },
    technicalScore: {
      type: Number,
      default: 0
    },
    communicationScore: {
      type: Number,
      default: 0
    },
    problemSolvingScore: {
      type: Number,
      default: 0
    },
    culturalFitScore: {
      type: Number,
      default: 0
    },
    strengths: [String],
    weaknesses: [String],
    improvements: [String],
    topicsDiscussed: [String],
    questionsAsked: Number,
    questionsAnswered: Number
  },
  // Detailed feedback
  feedback: {
    summary: String,
    detailedAnalysis: String,
    recommendations: [String],
    nextSteps: [String],
    estimatedReadiness: String // 'not-ready', 'needs-practice', 'ready', 'well-prepared'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
mockInterviewSchema.index({ user: 1, createdAt: -1 });
mockInterviewSchema.index({ user: 1, status: 1 });
mockInterviewSchema.index({ sessionId: 1 });

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
