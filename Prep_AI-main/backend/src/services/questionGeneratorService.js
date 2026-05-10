const { chatWithAI } = require('./aiService');
const Resume = require('../models/Resume');
const PracticeSession = require('../models/PracticeSession');
const Question = require('../models/Question');

/**
 * AI Question Generator Service
 * Generates personalized interview questions based on user profile
 */

// Generate questions based on user's resume
exports.generateResumeBasedQuestions = async (userId, count = 5, difficulty = 'medium') => {
  try {
    // Get user's resume
    const resume = await Resume.findOne({ user: userId }).sort({ createdAt: -1 });
    
    if (!resume) {
      throw new Error('Resume not found. Please upload your resume first.');
    }

    const resumeText = typeof resume.parsedData === 'string' 
      ? resume.parsedData 
      : JSON.stringify(resume.parsedData);

    const prompt = `You are an expert technical interviewer. Based on the candidate's resume below, generate ${count} highly relevant interview questions.

RESUME:
${resumeText}

REQUIREMENTS:
- Generate ${count} questions at ${difficulty} difficulty level
- Questions should be specific to the candidate's experience and skills
- Mix technical and behavioral questions
- Focus on projects, technologies, and achievements mentioned
- Make questions realistic and commonly asked in interviews
- Each question should test different aspects of their experience

DIFFICULTY LEVELS:
- easy: Basic concepts and straightforward questions
- medium: Moderate complexity, requires good understanding
- hard: Advanced concepts, problem-solving, system design

FORMAT YOUR RESPONSE AS JSON ARRAY:
[
  {
    "question": "Question text here",
    "type": "technical" or "behavioral",
    "topic": "Main topic (e.g., React, System Design, Leadership)",
    "difficulty": "${difficulty}",
    "context": "Why this question is relevant to their resume",
    "expectedKeyPoints": ["Key point 1", "Key point 2", "Key point 3"]
  }
]

Generate ${count} questions now:`;

    const response = await chatWithAI('', prompt, { temperature: 0.8, maxTokens: 2000 });
    
    // Parse JSON response
    const questions = parseQuestionsFromResponse(response.response || response);
    
    return {
      success: true,
      questions,
      source: 'resume',
      generatedAt: new Date()
    };
  } catch (error) {
    console.error('Error generating resume-based questions:', error);
    throw error;
  }
};

// Generate role-specific questions
exports.generateRoleSpecificQuestions = async (role, experience, count = 5, difficulty = 'medium') => {
  try {
    const prompt = `You are an expert technical interviewer. Generate ${count} interview questions for a ${role} position with ${experience} years of experience.

REQUIREMENTS:
- Generate ${count} questions at ${difficulty} difficulty level
- Questions should be specific to ${role} role
- Consider ${experience} years of experience level
- Include both technical and behavioral questions
- Focus on skills and responsibilities typical for this role
- Make questions realistic and commonly asked

DIFFICULTY: ${difficulty}

FORMAT YOUR RESPONSE AS JSON ARRAY:
[
  {
    "question": "Question text here",
    "type": "technical" or "behavioral",
    "topic": "Main topic",
    "difficulty": "${difficulty}",
    "context": "Why this question is relevant for ${role}",
    "expectedKeyPoints": ["Key point 1", "Key point 2", "Key point 3"]
  }
]

Generate ${count} questions now:`;

    const response = await chatWithAI('', prompt, { temperature: 0.8, maxTokens: 2000 });
    const questions = parseQuestionsFromResponse(response.response || response);
    
    return {
      success: true,
      questions,
      source: 'role',
      role,
      experience,
      generatedAt: new Date()
    };
  } catch (error) {
    console.error('Error generating role-specific questions:', error);
    throw error;
  }
};

// Generate company-specific questions
exports.generateCompanySpecificQuestions = async (company, role, count = 5) => {
  try {
    const prompt = `You are an expert interviewer familiar with ${company}'s interview process. Generate ${count} interview questions that ${company} typically asks for ${role} position.

REQUIREMENTS:
- Generate ${count} questions specific to ${company}'s culture and values
- Include questions about ${company}'s products/services
- Focus on skills ${company} values
- Include behavioral questions aligned with ${company}'s culture
- Make questions realistic based on ${company}'s known interview style

FORMAT YOUR RESPONSE AS JSON ARRAY:
[
  {
    "question": "Question text here",
    "type": "technical" or "behavioral" or "cultural",
    "topic": "Main topic",
    "difficulty": "easy/medium/hard",
    "context": "Why ${company} asks this question",
    "expectedKeyPoints": ["Key point 1", "Key point 2", "Key point 3"]
  }
]

Generate ${count} questions now:`;

    const response = await chatWithAI('', prompt, { temperature: 0.8, maxTokens: 2000 });
    const questions = parseQuestionsFromResponse(response.response || response);
    
    return {
      success: true,
      questions,
      source: 'company',
      company,
      role,
      generatedAt: new Date()
    };
  } catch (error) {
    console.error('Error generating company-specific questions:', error);
    throw error;
  }
};

// Generate questions for weak topics
exports.generateWeakTopicQuestions = async (userId, count = 5) => {
  try {
    // Analyze user's weak topics
    const weakTopics = await analyzeWeakTopics(userId);
    
    if (weakTopics.length === 0) {
      return {
        success: true,
        questions: [],
        message: 'No weak topics found. Great job!'
      };
    }

    const topicsText = weakTopics.map(t => `${t.topic} (avg score: ${t.avgScore})`).join(', ');

    const prompt = `You are an expert interviewer. Generate ${count} interview questions focused on the candidate's weak areas.

WEAK TOPICS:
${topicsText}

REQUIREMENTS:
- Generate ${count} questions targeting these weak topics
- Start with easier questions to build confidence
- Gradually increase difficulty
- Provide clear, focused questions
- Help the candidate improve in these areas

FORMAT YOUR RESPONSE AS JSON ARRAY:
[
  {
    "question": "Question text here",
    "type": "technical" or "behavioral",
    "topic": "Topic from weak areas",
    "difficulty": "easy/medium/hard",
    "context": "Why this helps improve weak area",
    "expectedKeyPoints": ["Key point 1", "Key point 2", "Key point 3"]
  }
]

Generate ${count} questions now:`;

    const response = await chatWithAI('', prompt, { temperature: 0.8, maxTokens: 2000 });
    const questions = parseQuestionsFromResponse(response.response || response);
    
    return {
      success: true,
      questions,
      source: 'weak-topics',
      weakTopics,
      generatedAt: new Date()
    };
  } catch (error) {
    console.error('Error generating weak topic questions:', error);
    throw error;
  }
};

// Generate scenario-based questions
exports.generateScenarioQuestions = async (domain, count = 5, difficulty = 'medium') => {
  try {
    const prompt = `You are an expert interviewer. Generate ${count} scenario-based interview questions for ${domain} domain.

REQUIREMENTS:
- Generate ${count} real-world scenario questions
- Difficulty level: ${difficulty}
- Questions should present realistic workplace situations
- Require problem-solving and critical thinking
- Test both technical and soft skills
- Include context and constraints

FORMAT YOUR RESPONSE AS JSON ARRAY:
[
  {
    "question": "Scenario description and question",
    "type": "scenario",
    "topic": "${domain}",
    "difficulty": "${difficulty}",
    "context": "What this scenario tests",
    "expectedKeyPoints": ["Key point 1", "Key point 2", "Key point 3"]
  }
]

Generate ${count} questions now:`;

    const response = await chatWithAI('', prompt, { temperature: 0.8, maxTokens: 2000 });
    const questions = parseQuestionsFromResponse(response.response || response);
    
    return {
      success: true,
      questions,
      source: 'scenario',
      domain,
      generatedAt: new Date()
    };
  } catch (error) {
    console.error('Error generating scenario questions:', error);
    throw error;
  }
};

// Generate STAR format behavioral questions
exports.generateBehavioralQuestions = async (count = 5, focus = 'general') => {
  try {
    const prompt = `You are an expert behavioral interviewer. Generate ${count} behavioral interview questions using the STAR method (Situation, Task, Action, Result).

FOCUS AREA: ${focus}

REQUIREMENTS:
- Generate ${count} behavioral questions
- Questions should elicit STAR format responses
- Focus on: ${focus}
- Cover different competencies (leadership, teamwork, problem-solving, conflict resolution, etc.)
- Make questions open-ended and thought-provoking

FORMAT YOUR RESPONSE AS JSON ARRAY:
[
  {
    "question": "Behavioral question text",
    "type": "behavioral",
    "topic": "Competency being tested",
    "difficulty": "medium",
    "context": "What this question reveals about the candidate",
    "expectedKeyPoints": ["Situation", "Task", "Action", "Result"]
  }
]

Generate ${count} questions now:`;

    const response = await chatWithAI('', prompt, { temperature: 0.8, maxTokens: 2000 });
    const questions = parseQuestionsFromResponse(response.response || response);
    
    return {
      success: true,
      questions,
      source: 'behavioral',
      focus,
      generatedAt: new Date()
    };
  } catch (error) {
    console.error('Error generating behavioral questions:', error);
    throw error;
  }
};

// Generate adaptive questions based on user's performance
exports.generateAdaptiveQuestions = async (userId, count = 5) => {
  try {
    // Analyze user's performance
    const performance = await analyzeUserPerformance(userId);
    
    const prompt = `You are an expert interviewer. Generate ${count} adaptive interview questions based on the candidate's performance.

PERFORMANCE ANALYSIS:
- Average Score: ${performance.avgScore}/10
- Strong Topics: ${performance.strongTopics.join(', ')}
- Weak Topics: ${performance.weakTopics.join(', ')}
- Total Sessions: ${performance.totalSessions}
- Improvement Rate: ${performance.improvementRate}%

REQUIREMENTS:
- Generate ${count} questions that adapt to their level
- Challenge them in strong areas
- Support them in weak areas
- Gradually increase difficulty
- Mix different question types

FORMAT YOUR RESPONSE AS JSON ARRAY:
[
  {
    "question": "Question text here",
    "type": "technical" or "behavioral",
    "topic": "Topic name",
    "difficulty": "easy/medium/hard",
    "context": "Why this question is appropriate for their level",
    "expectedKeyPoints": ["Key point 1", "Key point 2", "Key point 3"]
  }
]

Generate ${count} questions now:`;

    const response = await chatWithAI('', prompt, { temperature: 0.8, maxTokens: 2000 });
    const questions = parseQuestionsFromResponse(response.response || response);
    
    return {
      success: true,
      questions,
      source: 'adaptive',
      performance,
      generatedAt: new Date()
    };
  } catch (error) {
    console.error('Error generating adaptive questions:', error);
    throw error;
  }
};

// Helper: Parse questions from AI response
function parseQuestionsFromResponse(response) {
  try {
    // Remove markdown code blocks if present
    let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to find JSON array in the response
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
    
    const questions = JSON.parse(cleaned);
    
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array');
    }
    
    return questions;
  } catch (error) {
    console.error('Error parsing questions:', error);
    // Return empty array if parsing fails
    return [];
  }
}

// Helper: Analyze weak topics
async function analyzeWeakTopics(userId) {
  try {
    const sessions = await PracticeSession.find({ user: userId });
    
    const topicScores = {};
    
    sessions.forEach(session => {
      if (session.topic && session.score !== undefined) {
        if (!topicScores[session.topic]) {
          topicScores[session.topic] = { total: 0, count: 0 };
        }
        topicScores[session.topic].total += session.score;
        topicScores[session.topic].count += 1;
      }
    });
    
    const weakTopics = Object.entries(topicScores)
      .map(([topic, data]) => ({
        topic,
        avgScore: Math.round((data.total / data.count) * 10) / 10,
        count: data.count
      }))
      .filter(t => t.avgScore < 6)
      .sort((a, b) => a.avgScore - b.avgScore)
      .slice(0, 5);
    
    return weakTopics;
  } catch (error) {
    console.error('Error analyzing weak topics:', error);
    return [];
  }
}

// Helper: Analyze user performance
async function analyzeUserPerformance(userId) {
  try {
    const sessions = await PracticeSession.find({ user: userId }).sort({ createdAt: -1 });
    
    if (sessions.length === 0) {
      return {
        avgScore: 0,
        strongTopics: [],
        weakTopics: [],
        totalSessions: 0,
        improvementRate: 0
      };
    }
    
    // Calculate average score
    const avgScore = sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length;
    
    // Analyze topics
    const topicScores = {};
    sessions.forEach(session => {
      if (session.topic && session.score !== undefined) {
        if (!topicScores[session.topic]) {
          topicScores[session.topic] = { total: 0, count: 0 };
        }
        topicScores[session.topic].total += session.score;
        topicScores[session.topic].count += 1;
      }
    });
    
    const topics = Object.entries(topicScores).map(([topic, data]) => ({
      topic,
      avgScore: data.total / data.count
    }));
    
    const strongTopics = topics.filter(t => t.avgScore >= 7).map(t => t.topic);
    const weakTopics = topics.filter(t => t.avgScore < 6).map(t => t.topic);
    
    // Calculate improvement rate
    const recentSessions = sessions.slice(0, 5);
    const oldSessions = sessions.slice(-5);
    const recentAvg = recentSessions.reduce((sum, s) => sum + (s.score || 0), 0) / recentSessions.length;
    const oldAvg = oldSessions.reduce((sum, s) => sum + (s.score || 0), 0) / oldSessions.length;
    const improvementRate = oldAvg > 0 ? Math.round(((recentAvg - oldAvg) / oldAvg) * 100) : 0;
    
    return {
      avgScore: Math.round(avgScore * 10) / 10,
      strongTopics,
      weakTopics,
      totalSessions: sessions.length,
      improvementRate
    };
  } catch (error) {
    console.error('Error analyzing user performance:', error);
    return {
      avgScore: 0,
      strongTopics: [],
      weakTopics: [],
      totalSessions: 0,
      improvementRate: 0
    };
  }
}

module.exports = exports;
