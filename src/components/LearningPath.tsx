"use client"

import type React from "react"
import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import "./LearningPath.css"

interface User {
  id: number
  name: string
  email: string
  level: number
  xp: number
  streak: number
  badges: string[]
  completedLessons: number[]
}

interface LearningPathProps {
  user: User
}

interface Lesson {
  id: number
  title: string
  description: string
  status: "completed" | "current" | "locked"
  difficulty: string
  duration: string
  xp: number
}

const LearningPath: React.FC<LearningPathProps> = ({ user }) => {
  const { language } = useParams<{ language: string }>()

  const lessons: Lesson[] = [
    {
      id: 1,
      title: "Introduction to Python",
      description: "Learn the basics of Python programming language and set up your development environment",
      status: "completed",
      difficulty: "Beginner",
      duration: "15 min",
      xp: 100,
    },
    {
      id: 2,
      title: "Variables and Data Types",
      description: "Understanding different data types in Python: strings, numbers, booleans, and more",
      status: "completed",
      difficulty: "Beginner",
      duration: "20 min",
      xp: 150,
    },
    {
      id: 3,
      title: "Comments in Python",
      description: "Learn how to write single-line and multi-line comments in your Python code",
      status: "current",
      difficulty: "Beginner",
      duration: "15 min",
      xp: 100,
    },
    {
      id: 4,
      title: "Control Structures",
      description: "Master if statements, loops, and conditional logic in Python",
      status: "locked",
      difficulty: "Beginner",
      duration: "25 min",
      xp: 200,
    },
    {
      id: 5,
      title: "Functions",
      description: "Create reusable code with functions, parameters, and return values",
      status: "locked",
      difficulty: "Intermediate",
      duration: "30 min",
      xp: 250,
    },
    {
      id: 6,
      title: "Object-Oriented Programming",
      description: "Introduction to classes, objects, and OOP principles in Python",
      status: "locked",
      difficulty: "Intermediate",
      duration: "35 min",
      xp: 300,
    },
  ]

  const completedLessons = lessons.filter((lesson) => lesson.status === "completed").length
  const totalLessons = lessons.length
  const progressPercentage = (completedLessons / totalLessons) * 100

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅"
      case "current":
        return "🎯"
      case "locked":
        return "🔒"
      default:
        return "📝"
    }
  }

  return (
    <div className="learning-path">
      <div className="path-header">
        <motion.div
          className="path-info"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/dashboard" className="back-btn">
            ← Back to Dashboard
          </Link>
          <h1>{language?.charAt(0).toUpperCase() + language?.slice(1)} Learning Path</h1>
          <p>Master the fundamentals of {language} programming through our structured learning path</p>
        </motion.div>

        <motion.div
          className="path-stats"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="stat">
            <span className="stat-value">
              {completedLessons}/{totalLessons}
            </span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat">
            <span className="stat-value">{Math.round(progressPercentage)}%</span>
            <span className="stat-label">Progress</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {lessons.reduce((total, lesson) => (lesson.status === "completed" ? total + lesson.xp : total), 0)}
            </span>
            <span className="stat-label">XP Earned</span>
          </div>
        </motion.div>
      </div>

      <div className="path-content">
        <div className="lessons-path">
          <div className="path-line">
            <div className="progress-line" style={{ height: `${progressPercentage}%` }}></div>
          </div>

          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              className={`lesson-node ${lesson.status}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="lesson-connector"></div>
              <div className="lesson-card">
                <div className="lesson-status">
                  <span className="status-icon">{getStatusIcon(lesson.status)}</span>
                </div>

                <div className="lesson-info">
                  <h3>{lesson.title}</h3>
                  <p>{lesson.description}</p>

                  <div className="lesson-meta">
                    <span className="difficulty">{lesson.difficulty}</span>
                    <span className="duration">{lesson.duration}</span>
                    <span className="xp">+{lesson.xp} XP</span>
                  </div>

                  {lesson.status !== "locked" && (
                    <Link to={`/lesson/${language}/${lesson.id}`} className="start-btn-link">
                      <button className="start-btn">
                        {lesson.status === "completed" ? "Review" : lesson.status === "current" ? "Continue" : "Start"}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="path-sidebar">
          <motion.div
            className="current-lesson-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2>Current Lesson</h2>
            {(() => {
              const currentLesson = lessons.find((lesson) => lesson.status === "current")
              return currentLesson ? (
                <div className="lesson-preview">
                  <h3>{currentLesson.title}</h3>
                  <p>{currentLesson.description}</p>
                  <div className="lesson-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "0%" }}></div>
                    </div>
                    <span>Ready to start</span>
                  </div>
                  <Link to={`/lesson/${language}/${currentLesson.id}`} className="continue-btn">
                    Continue Learning
                  </Link>
                </div>
              ) : (
                <p>All lessons completed! 🎉</p>
              )
            })()}
          </motion.div>

          <motion.div
            className="tips-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2>Learning Tips</h2>
            <ul>
              <li>Practice coding every day to build consistency</li>
              <li>Don't rush - take time to understand each concept</li>
              <li>Use the AI tutor when you're stuck</li>
              <li>Try to solve problems without looking at hints first</li>
              <li>Review completed lessons to reinforce learning</li>
            </ul>
          </motion.div>

          <motion.div
            className="streak-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2>Learning Streak</h2>
            <div className="streak-info">
              <span className="streak-number">{user.streak || 7}</span>
              <p>Days in a row!</p>
            </div>
            <div className="streak-calendar">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`day ${i < (user.streak || 7) ? "active" : ""}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LearningPath
