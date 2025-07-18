import type React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { User as FirebaseUser } from "firebase/auth";

// Import your page components
import LandingPage from "./LandingPage.tsx";
import LoginPage from "./LoginPage.tsx";
import Dashboard from "./Dashboard.tsx";
import LearningPath from "./LearningPath.tsx";
import ChatTutor from "./ChatTutor.tsx";
import Profile from "./Profile.tsx";
import CompetitiveCoding from "./CompetitiveCoding.tsx";
import Navbar from "./Navbar.tsx";
import FloatingAITutor from "./FloatingAITutor.tsx";
import ProblemSolver from "./ProblemSolver.tsx";
import Lesson from "./Lesson.tsx";

interface AppContentProps {
  user: FirebaseUser | null;
  isAuthenticated: boolean;
}

const AppContent: React.FC<AppContentProps> = ({ user, isAuthenticated }) => {
  const location = useLocation();

  return (
    <div className="App">
      {/* Render Navbar on all pages except the login page */}
      {location.pathname !== "/login" && <Navbar user={user} isAuthenticated={isAuthenticated} />}
      
      <Routes>
        {isAuthenticated ? (
          // --- AUTHENTICATED ROUTES ---
          <>
            {/* Add a unique route for each page linked in your Navbar */}
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/competitive" element={<CompetitiveCoding user={user} />} />
            <Route path="/chat" element={<ChatTutor user={user} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/learning/:language" element={<LearningPath user={user} />} />
            <Route path="/lesson/:language/:lessonId" element={<Lesson user={user} />} />
            <Route path="/problem/:problemId" element={<ProblemSolver user={user} />} />

            {/* If a logged-in user tries any other path, redirect them to the dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          // --- PUBLIC ROUTES ---
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* If a logged-out user tries any other path, redirect them to the landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>

      {/* Logic for the floating AI tutor */}
      {isAuthenticated &&
        user &&
        location.pathname !== "/chat" &&
        location.pathname !== "/competitive" &&
        !location.pathname.startsWith("/problem/") && <FloatingAITutor user={user} />}
    </div>
  );
};

export default AppContent;
