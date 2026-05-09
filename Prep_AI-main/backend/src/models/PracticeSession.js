const mongoose = require('mongoose');

const practiceSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for analytics queries
practiceSessionSchema.index({ user: 1, createdAt: -1 });
practiceSessionSchema.index({ user: 1, category: 1 });
practiceSessionSchema.index({ user: 1, difficulty: 1 });

module.exports = mongoose.model('PracticeSession', practiceSessionSchema);
