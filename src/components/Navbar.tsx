"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useTheme } from "../contexts/ThemeContext.tsx" // Assuming this context exists
import "./Navbar.css" // Assuming this file exists

// --- CHANGED ---
// 1. Import Firebase types and functions
import { User as FirebaseUser } from "firebase/auth"
import { signOut } from "firebase/auth"
import { auth } from "../firebase.js"

// --- REMOVED ---
// The old custom 'User' interface is no longer needed here.

// --- CHANGED ---
// 2. Update NavbarProps to use the FirebaseUser type and remove onLogout
interface NavbarProps {
  user: FirebaseUser | null
  isAuthenticated: boolean
}

interface NavItem {
  path: string
  label: string
}

// --- CHANGED ---
// 3. Remove 'onLogout' from the component's props
const Navbar: React.FC<NavbarProps> = ({ user, isAuthenticated }) => {
  const location = useLocation()
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false)
  const { isDarkMode, toggleDarkMode } = useTheme() // Assuming this works as intended

  // --- CHANGED ---
  // 4. Create the logout handler function inside the component
  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout Error:", error))
  }

  const navItems: NavItem[] = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/competitive", label: "Competitive" },
    { path: "/chat", label: "AI Tutor" },
    { path: "/profile", label: "Profile" },
  ]

  // If not authenticated, show the simple "Get Started" navbar
  if (!isAuthenticated) {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              evo<span className="logo-accent">Code</span>
            </motion.div>
          </Link>
          <div className="nav-actions">
            <Link to="/login" className="get-started-link">
              <motion.button className="get-started-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  // If authenticated, show the full navbar
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            evo<span className="logo-accent">Code</span>
          </motion.div>
        </Link>

        <div className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-user">
          <div className="user-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            {/* --- CHANGED --- */}
            {/* 5. Use 'displayName' from the Firebase user object */}
            <div className="user-avatar">{(user?.displayName || "U").charAt(0).toUpperCase()}</div>
            <span className="user-name">{user?.displayName || "User"}</span>
            <span className="dropdown-arrow">▼</span>

            {isProfileOpen && (
              <motion.div
                className="profile-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Link to="/profile" className="dropdown-item">
                  Profile
                </Link>
                <div className="dropdown-item" onClick={toggleDarkMode}>
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </div>
                {/* --- CHANGED --- */}
                {/* 6. Call the new handleLogout function */}
                <div className="dropdown-item" onClick={handleLogout}>
                  Logout
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
