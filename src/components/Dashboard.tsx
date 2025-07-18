"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts"
import "./Dashboard.css"

// --- CORRECTED ---
// 1. Import Firebase types and Firestore functions
import { User as FirebaseUser } from "firebase/auth"
import { db } from "../firebase.js"
import { doc, getDoc } from "firebase/firestore"

// This interface defines the structure of the profile data we fetch from Firestore
interface UserProfileData {
  name: string
  level: number
  xp: number
  streak: number
  // Add other fields you store in Firestore
}

// --- CORRECTED ---
// 2. Update DashboardProps to accept the FirebaseUser object
interface DashboardProps {
  user: FirebaseUser | null
}

// --- DUMMY DATA (can be replaced with data from Firestore later) ---
interface Language {
  name: string
  icon: string
  progress: number
  lessons: number
  completed: number
  color: string
}
const languages: Language[] = [
    { name: "Python", icon: "🐍", progress: 65, lessons: 24, completed: 15, color: "#3776ab" },
    { name: "JavaScript", icon: "⚡", progress: 40, lessons: 30, completed: 12, color: "#f7df1e" },
    { name: "Java", icon: "☕", progress: 25, lessons: 28, completed: 7, color: "#ed8b00" },
    { name: "C++", icon: "⚙️", progress: 10, lessons: 32, completed: 3, color: "#00599c" },
]
const progressData = [
    { day: "Mon", xp: 120 }, { day: "Tue", xp: 180 }, { day: "Wed", xp: 150 },
    { day: "Thu", xp: 220 }, { day: "Fri", xp: 190 }, { day: "Sat", xp: 280 }, { day: "Sun", xp: 240 },
]
const achievements = [
    { name: "First Steps", icon: "👶", earned: true }, { name: "Code Warrior", icon: "⚔️", earned: true },
    { name: "Bug Hunter", icon: "🐛", earned: false }, { name: "Speed Demon", icon: "⚡", earned: false },
    { name: "Master Coder", icon: "👑", earned: false },
]


const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  // --- NEW ---
  // 3. State to hold the user's profile data from Firestore
  const [profileData, setProfileData] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  // --- NEW ---
  // 4. useEffect to fetch the user's profile from Firestore
  useEffect(() => {
    if (user) {
      const fetchProfileData = async () => {
        setLoading(true)
        const userDocRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(userDocRef)
        if (docSnap.exists()) {
          setProfileData(docSnap.data() as UserProfileData)
        } else {
          console.log("No such document!"); // Handle case where profile doesn't exist yet
        }
        setLoading(false)
      }
      fetchProfileData()
    }
  }, [user])

  // --- CORRECTED ---
  // 5. Handle loading and null user states
  if (loading || !user) {
    return <div>Loading Dashboard...</div>
  }

  const displayName = profileData?.name || user.displayName || "Learner"

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <motion.div
          className="welcome-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Welcome back, {displayName}! 🚀</h1>
          <p>Let's continue your coding journey</p>
        </motion.div>

        <motion.div
          className="stats-overview"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* --- CORRECTED --- */}
          {/* 6. Use data from Firestore with fallbacks */}
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <h3>{profileData?.streak || 0}</h3>
              <p>Day Streak</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>{profileData?.xp || 0}</h3>
              <p>Total XP</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>{profileData?.level || 1}</h3>
              <p>Level</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          <motion.section
            className="languages-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2>Choose Your Language</h2>
            <div className="languages-grid">
              {languages.map((lang, index) => (
                <motion.div
                  key={lang.name}
                  className="language-card"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Link to={`/learning/${lang.name.toLowerCase()}`}>
                    <div className="language-icon">{lang.icon}</div>
                    <h3>{lang.name}</h3>
                    <div className="progress-info">
                      <div className="progress-bar">
                        <motion.div
                          className="progress-fill"
                          style={{ backgroundColor: lang.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${lang.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 + 0.1 * index }}
                        />
                      </div>
                      <span>{lang.completed}/{lang.lessons} lessons</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="progress-chart-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2>Weekly Progress</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="day" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px" }}/>
                  <Line type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.section>
        </div>

        <div className="sidebar-content">
          <motion.section
            className="achievements-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2>Achievements</h2>
            <div className="achievements-list">
              {achievements.map((achievement) => (
                <div key={achievement.name} className={`achievement-item ${achievement.earned ? "earned" : "locked"}`}>
                  <div className="achievement-icon">{achievement.icon}</div>
                  <span>{achievement.name}</span>
                  {achievement.earned && <div className="earned-badge">✓</div>}
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="daily-goal-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2>Daily Goal</h2>
            <div className="goal-progress">
              <div className="goal-circle">
                <ResponsiveContainer width={120} height={120}>
                  <RadialBarChart cx={60} cy={60} innerRadius={40} outerRadius={55} data={[{ value: 75 }]} startAngle={90} endAngle={-270}>
                    <RadialBar dataKey="value" fill="#6366f1" cornerRadius={10} background/>
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="goal-text">
                  <span className="goal-percentage">75%</span>
                  <span className="goal-label">Complete</span>
                </div>
              </div>
              <p>3 out of 4 lessons completed today!</p>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
