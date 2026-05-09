const mongoose = require('mongoose');

const voiceConversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  mode: {
    type: String,
    enum: ['general', 'communication-practice', 'interview-practice', 'grammar-focus'],
    default: 'general'
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    // Grammar analysis for user messages
    grammarAnalysis: {
      hasErrors: Boolean,
      corrections: [{
        original: String,
        corrected: String,
        explanation: String
      }],
      score: Number // 0-10
    },
    // Communication analysis
    communicationAnalysis: {
      clarity: Number, // 0-10
      fluency: Number, // 0-10
      vocabulary: Number, // 0-10
      suggestions: [String]
    }
  }],
  summary: {
    totalMessages: {
      type: Number,
      default: 0
    },
    averageGrammarScore: {
      type: Number,
      default: 0
    },
    averageClarityScore: {
      type: Number,
      default: 0
    },
    topIssues: [String],
    improvements: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
voiceConversationSchema.index({ user: 1, createdAt: -1 });
voiceConversationSchema.index({ user: 1, sessionId: 1 });
voiceConversationSchema.index({ user: 1, mode: 1 });

module.exports = mongoose.model('VoiceConversation', voiceConversationSchema);
