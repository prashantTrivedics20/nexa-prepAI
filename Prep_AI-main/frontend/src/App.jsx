import { Suspense, lazy, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import EnhancedHome from "./pages/EnhancedHome";
import Toast from "./components/Toast";
import GlobalAIChatbot from "./components/GlobalAIChatbot";
import "./components/components.css";
import "./styles/enhanced-home.css";

const ResumePageNew = lazy(() => import("./pages/ResumePageNew"));
const InterviewPage = lazy(() => import("./pages/Interview"));
const ReportPage = lazy(() => import("./pages/ReportPage"));
const SignupPage = lazy(() => import("./pages/Signup"));
const QuestionBank = lazy(() => import("./pages/QuestionBank"));
const PracticePage = lazy(() => import("./pages/PracticePage"));
const PracticeHistory = lazy(() => import("./pages/PracticeHistory"));
const RandomPractice = lazy(() => import("./pages/RandomPractice"));

function RouteLoadingFallback() {
  return (
    <div className="route-skeleton-shell" role="status" aria-live="polite">
      <div className="route-skeleton-header" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="route-skeleton-grid" aria-hidden="true">
        <span />
        <span />
      </div>
      <p>Loading page...</p>
    </div>
  );
}

function App() {
  useEffect(() => {
    const warmRoutes = () => {
      void import("./pages/ResumePageNew");
      void import("./pages/Interview");
      void import("./pages/ReportPage");
      void import("./pages/Signup");
      void import("./pages/QuestionBank");
      void import("./pages/PracticePage");
      void import("./pages/PracticeHistory");
      void import("./pages/RandomPractice");
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(warmRoutes, { timeout: 1200 });
      return () => {
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = window.setTimeout(warmRoutes, 450);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <Toast />
      <GlobalAIChatbot />
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path="/" element={<EnhancedHome />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/resume" element={<ResumePageNew />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/questions" element={<QuestionBank />} />
          <Route path="/practice/:id" element={<PracticePage />} />
          <Route path="/practice-history" element={<PracticeHistory />} />
          <Route path="/practice-random" element={<RandomPractice />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
