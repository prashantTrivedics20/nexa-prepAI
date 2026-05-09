const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Technical', 'Behavioral', 'HR', 'System Design', 'Coding', 'Situational'],
    index: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
    index: true
  },
  company: {
    type: String,
    default: 'General',
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  sampleAnswer: {
    type: String,
    default: ''
  },
  tips: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ company: 1, category: 1 });
questionSchema.index({ tags: 1 });

module.exports = mongoose.model('Question', questionSchema);
