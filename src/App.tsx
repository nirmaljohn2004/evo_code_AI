import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext.tsx"; // This import is crucial
import AppContent from "./components/AppContent.tsx";
import "./App.css";

// Firebase
import { auth } from "./firebase.js";
import { onAuthStateChanged, User } from "firebase/auth";

function App(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // This listener is the core of the auth system
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return (
    // By wrapping the Router with the ThemeProvider, we guarantee
    // that any component rendered by the router (including Navbar)
    // will have access to the theme context.
    <ThemeProvider>
      <Router>
        <AppContent user={user} isAuthenticated={!!user} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
