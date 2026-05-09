import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import { isAuthenticated } from "../services/auth";
import ThemeToggleButton from "../components/ThemeToggleButton";
import AuthProfileMenu from "../components/AuthProfileMenu";
import "../styles/professional-pages.css";

const INTERVIEW_HISTORY_KEY = "interviewHistory";
const TOPIC_RULES = [
  {
    topic: "React",
    pattern: /\breact|jsx|hooks|redux|context api|next\.?js\b/i,
  },
  {
    topic: "Node.js",
    pattern: /\bnode\.?js|express|npm|middleware|event loop\b/i,
  },
  {
    topic: "DSA",
    pattern:
      /\bdsa|data structure|algorithm|array|linked list|stack|queue|tree|graph|hash map|binary search|dynamic programming|complexity\b/i,
  },
  {
    topic: "System Design",
    pattern:
      /\bsystem design|scalab|distributed|microservice|load balancer|cache|queue|availability|throughput\b/i,
  },
  {
    topic: "HR Interview",
    pattern: /\bteam|leadership|conflict|motivat|strength|weakness|behavior|communication\b/i,
  },
  {
    topic: "Employee Introduction",
    pattern:
      /\bintroduce yourself|introduction|about yourself|background|career goal|personal strength|hobby|self profile\b/i,
  },
];
const revealUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};
const revealStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};
const revealViewport = { once: true, amount: 0.2 };

function parseStoredResult() {
  const saved = localStorage.getItem("finalResult");
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch (_error) {
    return null;
  }
}

function parseStoredHistory() {
  const savedHistory = localStorage.getItem(INTERVIEW_HISTORY_KEY);
  if (!savedHistory) return [];

  try {
    const parsed = JSON.parse(savedHistory);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeResult(rawResult) {
  if (!rawResult) return null;

  const detailedResponses = Array.isArray(rawResult.detailedResponses)
    ? rawResult.detailedResponses
    : [];
  const confidenceAnalyticsSummary = rawResult.confidenceAnalyticsSummary || null;
  const domain = rawResult.domain || rawResult.selectedDomain || "General";
  const interviewId = rawResult.interviewId || rawResult._id || "";

  if (
    Object.prototype.hasOwnProperty.call(rawResult, "finalScore") ||
    Object.prototype.hasOwnProperty.call(rawResult, "feedback") ||
    Array.isArray(rawResult.detailedResponses)
  ) {
    return {
      finalScore: Number(rawResult.finalScore ?? 0),
      feedback: rawResult.feedback || rawResult.finalFeedback || "No final feedback returned.",
      detailedResponses,
      confidenceAnalyticsSummary,
      domain,
      interviewId,
      answeredQuestions: rawResult.answeredQuestions,
      completedAt: rawResult.completedAt,
    };
  }

  if (rawResult.evaluation) {
    const evaluation = rawResult.evaluation;
    const feedbackParts = [
      evaluation.strengths ? `Strengths: ${evaluation.strengths}` : "",
      evaluation.weaknesses ? `Weaknesses: ${evaluation.weaknesses}` : "",
      evaluation.improvementSuggestions
        ? `Improvements: ${evaluation.improvementSuggestions}`
        : "",
    ].filter(Boolean);

    return {
      finalScore: Number(evaluation.overallScore ?? 0),
      feedback: feedbackParts.join(" | ") || "Evaluation summary available.",
      detailedResponses,
      confidenceAnalyticsSummary,
      domain,
      interviewId,
      answeredQuestions: rawResult.answeredQuestions,
      completedAt: rawResult.completedAt,
    };
  }

  return null;
}

function scoreBand(score) {
  if (score >= 7) return "good";
  if (score >= 5) return "mid";
  return "low";
}

function summarizeConfidenceFromResponses(responses) {
  const confidenceItems = (responses || [])
    .map((item) => item?.confidenceAnalytics)
    .filter(Boolean);

  if (!confidenceItems.length) {
    return null;
  }

  const totalConfidence = confidenceItems.reduce(
    (sum, item) => sum + Number(item.confidenceLevel || 0),
    0
  );
  const totalFillers = confidenceItems.reduce(
    (sum, item) => sum + Number(item.fillerWordsUsed || 0),
    0
  );
  const totalWpm = confidenceItems.reduce(
    (sum, item) => sum + Number(item.speakingSpeedWpm || 0),
    0
  );
  const totalPauses = confidenceItems.reduce(
    (sum, item) => sum + Number(item.pauseCount || 0),
    0
  );

  return {
    confidenceLevel: Math.round(totalConfidence / confidenceItems.length),
    fillerWordsUsed: totalFillers,
    speakingSpeedWpm: Math.round(totalWpm / confidenceItems.length),
    pauseCount: totalPauses,
    analyzedResponses: confidenceItems.length,
  };
}

function normalizeHistoryEntry(rawEntry, index) {
  if (!rawEntry || typeof rawEntry !== "object") {
    return null;
  }

  const detailedResponses = Array.isArray(rawEntry.detailedResponses)
    ? rawEntry.detailedResponses
    : [];
  const finalScore = Number(rawEntry.finalScore ?? rawEntry.score ?? 0);
  const confidenceLevel = Number(rawEntry?.confidenceAnalyticsSummary?.confidenceLevel);

  return {
    interviewId: rawEntry.interviewId || rawEntry._id || `legacy-${index}`,
    domain: rawEntry.domain || "General",
    finalScore: Number.isFinite(finalScore) ? finalScore : 0,
    feedback: rawEntry.feedback || rawEntry.finalFeedback || "",
    answeredQuestions: Number(rawEntry.answeredQuestions ?? detailedResponses.length ?? 0),
    completedAt: rawEntry.completedAt || rawEntry.createdAt || rawEntry.updatedAt || null,
    detailedResponses,
    confidenceAnalyticsSummary: rawEntry.confidenceAnalyticsSummary || null,
    confidenceLevel: Number.isFinite(confidenceLevel) ? confidenceLevel : null,
  };
}

function createHistoryEntryFromReport(report) {
  if (!report) return null;

  const detailedResponses = Array.isArray(report.detailedResponses)
    ? report.detailedResponses
    : [];
  const confidenceAnalyticsSummary =
    report.confidenceAnalyticsSummary || summarizeConfidenceFromResponses(detailedResponses);
  const confidenceLevel = Number(confidenceAnalyticsSummary?.confidenceLevel);

  return {
    interviewId: report.interviewId || `report-${report.completedAt || "current"}`,
    domain: report.domain || "General",
    finalScore: Number.isFinite(Number(report.finalScore)) ? Number(report.finalScore) : 0,
    feedback: report.feedback || "",
    answeredQuestions: Number(report.answeredQuestions ?? detailedResponses.length ?? 0),
    completedAt: report.completedAt || null,
    detailedResponses,
    confidenceAnalyticsSummary,
    confidenceLevel: Number.isFinite(confidenceLevel) ? confidenceLevel : null,
  };
}

function mergeCurrentReportIntoHistory(history, report) {
  const normalizedHistory = Array.isArray(history) ? history.filter(Boolean) : [];
  const currentEntry = createHistoryEntryFromReport(report);

  if (!currentEntry) {
    return normalizedHistory.sort(
      (left, right) => new Date(right.completedAt || 0) - new Date(left.completedAt || 0)
    );
  }

  const hasCurrent = normalizedHistory.some(
    (entry) =>
      entry.interviewId === currentEntry.interviewId ||
      (entry.completedAt && currentEntry.completedAt && entry.completedAt === currentEntry.completedAt)
  );

  const merged = hasCurrent
    ? normalizedHistory.map((entry) =>
        entry.interviewId === currentEntry.interviewId
          ? { ...entry, ...currentEntry }
          : entry
      )
    : [currentEntry, ...normalizedHistory];

  return merged.sort(
    (left, right) => new Date(right.completedAt || 0) - new Date(left.completedAt || 0)
  );
}

function calculateAverageScore(entries) {
  if (!entries.length) return 0;
  const totalScore = entries.reduce(
    (sum, entry) => sum + Number(entry.finalScore || 0),
    0
  );
  return totalScore / entries.length;
}

function formatShortDate(rawDate) {
  if (!rawDate) return "N/A";
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function buildTrendCoordinates(values, width, height, padding = 14) {
  if (!values.length) return [];

  const innerWidth = Math.max(1, width - padding * 2);
  const innerHeight = Math.max(1, height - padding * 2);
  const step = values.length > 1 ? innerWidth / (values.length - 1) : 0;

  return values.map((value, index) => ({
    x: padding + index * step,
    y: padding + (1 - clamp(Number(value || 0) / 100, 0, 1)) * innerHeight,
  }));
}

function buildTrendPoints(values, width, height, padding = 14) {
  return buildTrendCoordinates(values, width, height, padding)
    .map((point) => `${point.x},${point.y}`)
    .join(" ");
}

function analyzeWeakTopics(interviewHistory) {
  const topicScores = new Map(TOPIC_RULES.map((rule) => [rule.topic, []]));

  interviewHistory.forEach((interview) => {
    const responses = Array.isArray(interview?.detailedResponses)
      ? interview.detailedResponses
      : [];

    responses.forEach((response) => {
      const score = Number(response?.score);
      if (!Number.isFinite(score)) {
        return;
      }

      const sourceText = [
        response?.question || "",
        response?.answer || "",
        response?.evaluation || "",
      ].join(" ");

      let matched = false;
      TOPIC_RULES.forEach((rule) => {
        if (rule.pattern.test(sourceText)) {
          topicScores.get(rule.topic).push(score);
          matched = true;
        }
      });

      if (matched) {
        return;
      }

      const domain = String(interview?.domain || "").toLowerCase();
      if (domain.includes("frontend")) {
        topicScores.get("React").push(score);
      } else if (domain.includes("backend")) {
        topicScores.get("Node.js").push(score);
      } else if (domain.includes("data structures")) {
        topicScores.get("DSA").push(score);
      } else if (domain.includes("system design")) {
        topicScores.get("System Design").push(score);
      } else if (domain.includes("employee introduction")) {
        topicScores.get("Employee Introduction").push(score);
      } else if (domain.includes("hr")) {
        topicScores.get("HR Interview").push(score);
      }
    });
  });

  const analyzedTopics = Array.from(topicScores.entries())
    .filter(([, scores]) => scores.length > 0)
    .map(([topic, scores]) => {
      const averageScore =
        scores.reduce((sum, score) => sum + score, 0) / scores.length;
      return {
        topic,
        averageScore: Math.round(averageScore * 10) / 10,
        attempts: scores.length,
        isSample: false,
      };
    })
    .sort((left, right) => left.averageScore - right.averageScore);

  // Return empty array if no real data, don't show sample data
  if (!analyzedTopics.length) {
    return [];
  }

  return analyzedTopics.slice(0, 5);
}

function ReportPage() {
  const navigate = useNavigate();
  const [dbInterviewHistory, setDbInterviewHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [currentReport, setCurrentReport] = useState(null);
  
  // Only use current report from localStorage if it exists (for just-completed interview)
  const localReport = useMemo(() => normalizeResult(parseStoredResult()), []);

  // Fetch interview history from database
  useEffect(() => {
    const fetchInterviewHistory = async () => {
      if (!isAuthenticated()) {
        setLoadingHistory(false);
        return;
      }

      try {
        const response = await API.get('/interview/history');
        if (response.data?.data) {
          setDbInterviewHistory(response.data.data);
          
          // If no local report, use the most recent from database
          if (!localReport && response.data.data.length > 0) {
            setCurrentReport(response.data.data[0]);
          } else if (localReport) {
            setCurrentReport(localReport);
          }
        }
      } catch (error) {
        console.error('Failed to fetch interview history from database:', error);
        // If fetch fails and we have local report, use it
        if (localReport) {
          setCurrentReport(localReport);
        }
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchInterviewHistory();
  }, [localReport]);

  const report = currentReport;
  const score = Number.isFinite(report?.finalScore) ? report.finalScore : 0;
  const responses = report?.detailedResponses || [];
  const answeredCount = report?.answeredQuestions || responses.length;
  const scorePercent = Math.max(0, Math.min(score * 10, 100));
  const confidenceSummary =
    report?.confidenceAnalyticsSummary || summarizeConfidenceFromResponses(responses);
  
  // Use database history directly (no localStorage merge)
  const interviewHistory = useMemo(() => {
    return mergeCurrentReportIntoHistory(dbInterviewHistory, report);
  }, [dbInterviewHistory, report]);
  
  const recentHistory = interviewHistory.slice(0, 8);
  const scoreGraphEntries = [...recentHistory].reverse();
  const averageHistoricalScore = calculateAverageScore(interviewHistory);
  const confidenceTrendEntries = interviewHistory
    .filter((entry) => Number.isFinite(entry.confidenceLevel))
    .slice(0, 8)
    .reverse();
  const confidenceTrendValues = confidenceTrendEntries.map((entry) =>
    Number(entry.confidenceLevel || 0)
  );
  const trendWidth = 340;
  const trendHeight = 140;
  const confidenceTrendPoints = buildTrendPoints(
    confidenceTrendValues,
    trendWidth,
    trendHeight,
    14
  );
  const confidenceTrendCoordinates = buildTrendCoordinates(
    confidenceTrendValues,
    trendWidth,
    trendHeight,
    14
  );
  const weakTopics = analyzeWeakTopics(interviewHistory);

  return (
    <div className="home-shell app-shell">
      <nav className="home-navbar">
        <a href="/" className="home-brand" aria-label="NexaAura InterviewAI Home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span className="brand-text">NexaAura InterviewAI</span>
        </a>

        <div className="home-menu">
          <Link to="/">Home</Link>
          <Link to="/resume">Resume</Link>
          <Link to="/interview">Interview</Link>
          <Link to="/report">Report</Link>
          <a 
            href="https://nexaaura-doc-hub.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '0.4rem 0.9rem',
              borderRadius: '6px',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            📚 NexaDoc
          </a>
        </div>

        <div className="nav-actions">
          <button type="button" className="home-signin" onClick={() => navigate("/interview")}>
            Retake
          </button>
          <AuthProfileMenu />
          <ThemeToggleButton />
        </div>
      </nav>

      <main className="app-page">
        <motion.section
          className="app-page-header home-fade-up"
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="app-kicker">Step 3</p>
          <h1>Interview Report</h1>
          <p>Review your final score, AI feedback, and answer-by-answer evaluation details.</p>
        </motion.section>

        {!report && !loadingHistory && interviewHistory.length === 0 && (
          <motion.section
            className="single-card-wrap home-fade-up"
            variants={revealUp}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.article className="glass-card" variants={revealUp}>
              <h2>No Report Found</h2>
              <p className="muted-copy">
                Complete an interview session first to generate report analytics.
              </p>
              <div className="app-button-row">
                <button
                  type="button"
                  className="app-btn"
                  onClick={() => navigate("/interview")}
                >
                  Start Interview
                </button>
                <button
                  type="button"
                  className="app-btn secondary"
                  onClick={() => navigate("/questions")}
                >
                  Practice Questions
                </button>
              </div>
            </motion.article>
          </motion.section>
        )}

        {loadingHistory && !report && (
          <motion.section
            className="single-card-wrap home-fade-up"
            variants={revealUp}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.article className="glass-card" variants={revealUp}>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  border: '4px solid var(--border-primary)', 
                  borderTop: '4px solid var(--color-primary-500)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}></div>
                <p className="muted-copy">Loading your interview history...</p>
              </div>
            </motion.article>
          </motion.section>
        )}

        {(!!report || (!loadingHistory && interviewHistory.length > 0)) && (
          <>
            {!report && interviewHistory.length > 0 && (
              <motion.section
                className="single-card-wrap home-fade-up"
                variants={revealUp}
                initial="hidden"
                whileInView="show"
                viewport={revealViewport}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ marginBottom: '2rem' }}
              >
                <motion.article className="glass-card" variants={revealUp}>
                  <h2>📊 Your Interview History</h2>
                  <p className="muted-copy">
                    You have completed {interviewHistory.length} interview{interviewHistory.length > 1 ? 's' : ''}. 
                    View your past performance and analytics below.
                  </p>
                  <div className="app-button-row">
                    <button
                      type="button"
                      className="app-btn"
                      onClick={() => navigate("/interview")}
                    >
                      Start New Interview
                    </button>
                    <button
                      type="button"
                      className="app-btn secondary"
                      onClick={() => navigate("/questions")}
                    >
                      Practice Questions
                    </button>
                  </div>
                </motion.article>
              </motion.section>
            )}
            
            {!!report && (
            <motion.section
              className="app-grid report-layout home-fade-up"
              variants={revealStagger}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <motion.article className="glass-card" variants={revealUp}>
                <div className="title-row">
                  <h2>Overall Score</h2>
                  <span className={`score-chip ${scoreBand(score)}`}>{score.toFixed(1)} / 10</span>
                </div>

                <div className="progress-track report-progress">
                  <div style={{ width: `${scorePercent}%` }} />
                </div>

                <p className="muted-copy">
                  Answered {answeredCount} {answeredCount === 1 ? "question" : "questions"}.
                </p>

                {report.domain && <p className="muted-copy">Domain: {report.domain}</p>}

                {report.completedAt && (
                  <p className="muted-copy">
                    Completed: {new Date(report.completedAt).toLocaleString()}
                  </p>
                )}

                {confidenceSummary && (
                  <div className="confidence-report-box">
                    <h3>Confidence Detection</h3>
                    <p className="confidence-metric-line">
                      Confidence Level: <strong>{confidenceSummary.confidenceLevel}%</strong>
                    </p>
                    <p className="confidence-metric-line">
                      Filler Words Used: <strong>{confidenceSummary.fillerWordsUsed}</strong>
                    </p>
                    <p className="confidence-metric-line">
                      Speaking Speed: <strong>{confidenceSummary.speakingSpeedWpm} WPM</strong>
                    </p>
                    <p className="confidence-metric-line">
                      Pause Detection: <strong>{confidenceSummary.pauseCount}</strong>
                    </p>
                  </div>
                )}

                <div className="app-feedback-box">
                  <h3>Final Feedback</h3>
                  <p>{report.feedback || "No final feedback returned from backend."}</p>
                </div>

                <div className="app-button-row">
                  <button type="button" className="app-btn" onClick={() => navigate("/interview")}>
                    Retake Interview
                  </button>
                  <button type="button" className="app-btn secondary" onClick={() => navigate("/resume")}>
                    Upload New Resume
                  </button>
                </div>
              </motion.article>

              <motion.article className="glass-card" variants={revealUp}>
                <h2>Detailed Responses</h2>
                {!responses.length && (
                  <p className="muted-copy">
                    No per-question breakdown was returned for this report.
                  </p>
                )}

                {!!responses.length && (
                  <div className="history-list">
                    {responses.map((response, index) => (
                      <div key={`${response.question}-${index}`} className="history-item">
                        <div className="title-row">
                          <p className="history-question">
                            <strong>Q{index + 1}:</strong> {response.question}
                          </p>
                          <span className={`score-chip ${scoreBand(Number(response.score || 0))}`}>
                            {Number(response.score || 0)}/10
                          </span>
                        </div>
                        <p className="history-answer">
                          <strong>Answer:</strong> {response.answer}
                        </p>
                        <p className="evaluation-text">
                          {response.evaluation || "No evaluation text returned for this answer."}
                        </p>
                        {response.confidenceAnalytics && (
                          <div className="confidence-inline-summary">
                            <p>
                              Confidence Level: <strong>{response.confidenceAnalytics.confidenceLevel}%</strong>
                            </p>
                            <p>
                              Filler Words Used: <strong>{response.confidenceAnalytics.fillerWordsUsed}</strong>
                            </p>
                            <p>
                              Speaking Speed: <strong>{response.confidenceAnalytics.speakingSpeedWpm} WPM</strong>
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.article>
            </motion.section>
            )}

            <motion.section
              className="app-grid progress-dashboard home-fade-up"
              variants={revealStagger}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <motion.article className="glass-card" variants={revealUp}>
                <h2>Past Interviews</h2>
                {!interviewHistory.length && (
                  <p className="muted-copy">Complete interviews to build your learning timeline.</p>
                )}
                {!!interviewHistory.length && (
                  <div className="dashboard-list">
                    {interviewHistory.slice(0, 8).map((entry) => (
                      <div key={entry.interviewId} className="dashboard-list-item">
                        <div>
                          <p className="dashboard-item-title">{entry.domain || "General"}</p>
                          <p className="dashboard-item-meta">
                            {formatShortDate(entry.completedAt)} • {entry.answeredQuestions} Q
                          </p>
                        </div>
                        <div className="dashboard-item-right">
                          <span className={`score-chip ${scoreBand(entry.finalScore)}`}>
                            {entry.finalScore.toFixed(1)}
                          </span>
                          {Number.isFinite(entry.confidenceLevel) && (
                            <span className="dashboard-confidence">{entry.confidenceLevel}%</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.article>

              <motion.article className="glass-card" variants={revealUp}>
                <div className="title-row">
                  <h2>Average Score Graph</h2>
                  <span className={`score-chip ${scoreBand(averageHistoricalScore)}`}>
                    {averageHistoricalScore.toFixed(1)}
                  </span>
                </div>
                {!scoreGraphEntries.length && (
                  <p className="muted-copy">No interviews available yet for score trend.</p>
                )}
                {!!scoreGraphEntries.length && (
                  <div className="score-graph-shell">
                    <p className="muted-copy">
                      Average across {interviewHistory.length} interviews
                    </p>
                    <div className="score-graph-plot">
                      <div
                        className="score-average-line"
                        style={{
                          bottom: `${clamp(averageHistoricalScore * 10, 0, 100)}%`,
                        }}
                      >
                        <span>Avg {averageHistoricalScore.toFixed(1)}</span>
                      </div>
                      {scoreGraphEntries.map((entry) => (
                        <div key={`${entry.interviewId}-bar`} className="score-bar-column">
                          <div className="score-bar-track-vertical">
                            <div
                              className={`score-bar-fill ${scoreBand(entry.finalScore)}`}
                              style={{ height: `${clamp(entry.finalScore * 10, 0, 100)}%` }}
                            />
                          </div>
                          <span className="score-bar-label">{formatShortDate(entry.completedAt)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.article>

              <motion.article className="glass-card" variants={revealUp}>
                <h2>Confidence Trend</h2>
                {!confidenceTrendEntries.length && (
                  <p className="muted-copy">
                    Confidence trend appears after voice responses are analyzed.
                  </p>
                )}
                {!!confidenceTrendEntries.length && (
                  <div className="confidence-trend-shell">
                    <p className="muted-copy">
                      Latest confidence:{" "}
                      <strong>{confidenceTrendEntries[confidenceTrendEntries.length - 1].confidenceLevel}%</strong>
                    </p>
                    <svg
                      viewBox={`0 0 ${trendWidth} ${trendHeight}`}
                      className="confidence-trend-chart"
                      preserveAspectRatio="none"
                      role="img"
                      aria-label="Confidence trend over past interviews"
                    >
                      <polyline points={confidenceTrendPoints} className="confidence-trend-line" />
                      {confidenceTrendCoordinates.map((point, index) => (
                        <circle
                          key={`trend-dot-${index}`}
                          className="confidence-trend-dot"
                          cx={point.x}
                          cy={point.y}
                          r="4.2"
                        />
                      ))}
                    </svg>
                    <div className="confidence-trend-labels">
                      {confidenceTrendEntries.map((entry) => (
                        <span key={`${entry.interviewId}-label`}>{formatShortDate(entry.completedAt)}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.article>

              <motion.article className="glass-card" variants={revealUp}>
                <h2>Weak Topic Analysis</h2>
                {weakTopics.length === 0 ? (
                  <p className="muted-copy">
                    Complete more interviews to see topic-wise performance analysis.
                  </p>
                ) : (
                  <div className="topic-analysis-list">
                    {weakTopics.map((topic) => (
                      <div key={topic.topic} className="topic-analysis-item">
                        <div className="title-row">
                          <p className="dashboard-item-title">{topic.topic}</p>
                          <span className={`score-chip ${scoreBand(topic.averageScore)}`}>
                            {topic.averageScore.toFixed(1)}
                          </span>
                        </div>
                        <div className="topic-score-track">
                          <div style={{ width: `${clamp(topic.averageScore * 10, 0, 100)}%` }} />
                        </div>
                        <p className="dashboard-item-meta">
                          {topic.attempts} scored responses
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.article>
            </motion.section>
          </>
        )}
      </main>
    </div>
  );
}

export default ReportPage;
