import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import AppContent from "./components/AppContent.tsx";
import "./App.css";

import { auth } from "./firebase.js";
import { onAuthStateChanged, User } from "firebase/auth";

import Profile from "./components/Profile.tsx";
import PsychometricTest from "./components/PsychometricTest.tsx";

// Providers
import { PsychometricProvider } from "./contexts/PsychometricContext.tsx";
import { ChatProvider } from "./contexts/ChatContext.tsx"; // NEW: provides tutorInstruction to chat

function App(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const isAuthenticated = !!user;

  return (
    <ThemeProvider>
      <PsychometricProvider>
        <ChatProvider>
          <Router>
            <Routes>
              <Route
                path="/profile"
                element={isAuthenticated ? <Profile user={user} /> : <Navigate to="/" replace />}
              />
              <Route
                path="/psychometric-test"
                element={isAuthenticated ? <PsychometricTest user={user} /> : <Navigate to="/" replace />}
              />
              <Route path="/*" element={<AppContent user={user} isAuthenticated={isAuthenticated} />} />
            </Routes>
          </Router>
        </ChatProvider>
      </PsychometricProvider>
    </ThemeProvider>
  );
}

export default App;
