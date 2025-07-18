"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import "./CompetitiveCoding.css"

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

interface CompetitiveCodingProps {
  user: User
}

interface Problem {
  id: number
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  solved: boolean
  attempts: number
  successRate: number
  points: number
}

const CompetitiveCoding: React.FC<CompetitiveCodingProps> = ({ user }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")

  const problems: Problem[] = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      category: "Array",
      solved: true,
      attempts: 2,
      successRate: 85,
      points: 100,
    },
    {
      id: 2,
      title: "Binary Tree Traversal",
      difficulty: "Medium",
      category: "Tree",
      solved: true,
      attempts: 3,
      successRate: 70,
      points: 200,
    },
    {
      id: 3,
      title: "Dynamic Programming - Knapsack",
      difficulty: "Hard",
      category: "DP",
      solved: false,
      attempts: 1,
      successRate: 0,
      points: 300,
    },
    {
      id: 4,
      title: "Graph Shortest Path",
      difficulty: "Medium",
      category: "Graph",
      solved: false,
      attempts: 0,
      successRate: 0,
      points: 250,
    },
    {
      id: 5,
      title: "String Manipulation",
      difficulty: "Easy",
      category: "String",
      solved: true,
      attempts: 1,
      successRate: 95,
      points: 120,
    },
  ]

  const categories = ["all", "Array", "String", "Tree", "Graph", "DP", "Math"]
  const difficulties = ["all", "Easy", "Medium", "Hard"]

  const filteredProblems = problems.filter((problem) => {
    const categoryMatch = selectedCategory === "all" || problem.category === selectedCategory
    const difficultyMatch = selectedDifficulty === "all" || problem.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#10b981"
      case "Medium":
        return "#f59e0b"
      case "Hard":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const solvedCount = problems.filter((p) => p.solved).length
  const successRate = problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0

  return (
    <div className="competitive-coding">
      <div className="competitive-header">
        <motion.div
          className="header-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/dashboard" className="back-btn">
            ← Back to Dashboard
          </Link>
          <h1>Competitive Programming</h1>
          <p>Challenge yourself with algorithmic problems and contests</p>
        </motion.div>

        <motion.div
          className="competitive-stats"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="stat-card">
            <h3>🏆 {user.level}</h3>
            <p>Rating</p>
          </div>
          <div className="stat-card">
            <h3>✅ {solvedCount}</h3>
            <p>Solved</p>
          </div>
          <div className="stat-card">
            <h3>🎯 {successRate}%</h3>
            <p>Success Rate</p>
          </div>
          <div className="stat-card">
            <h3>🔥 {user.streak}</h3>
            <p>Contest Streak</p>
          </div>
        </motion.div>
      </div>

      <div className="competitive-content">
        <div className="main-content">
          <motion.section
            className="problems-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="problems-header">
              <h2>💻 Practice Problems</h2>
              <div className="filters">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="filter-select"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty === "all" ? "All Difficulties" : difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="problems-list1">
              {filteredProblems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  className={`problem-card1 ${problem.solved ? "solved" : ""}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="problem-info1">
                    <div className="problem-title1">
                      <span className="solve-status1">{problem.solved ? "✅" : "⭕"}</span>
                      <h3>{problem.title}</h3>
                    </div>
                    <div className="problem-meta1">
                      <span className="difficulty1" style={{ color: getDifficultyColor(problem.difficulty) }}>
                        {problem.difficulty}
                      </span>
                      <span className="category1">{problem.category}</span>
                      <span className="points1">+{problem.points} pts</span>
                    </div>
                  </div>
                  <div className="problem-stats1">
                    <div className="stat1">
                      <span className="stat-label1">Attempts:</span>
                      <span className="stat-value1">{problem.attempts}</span>
                    </div>
                    <div className="stat1">
                      <span className="stat-label1">Success:</span>
                      <span className="stat-value1">{problem.successRate}%</span>
                    </div>
                  </div>
                  <Link to={`/problem/${problem.id}`}>
                    <motion.button className="solve-btn1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      {problem.solved ? "Review" : "Solve"}
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="sidebar-content">
          <motion.div
            className="leaderboard-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3>🏆 Leaderboard</h3>
            <div className="leaderboard-list">
              {[
                { rank: 1, name: "CodeMaster", rating: 2150, change: "+25" },
                { rank: 2, name: "AlgoWiz", rating: 2089, change: "+12" },
                { rank: 3, name: "ByteNinja", rating: 2034, change: "-8" },
                { rank: 4, name: user.name || "You", rating: user.level, change: "+15" },
                { rank: 5, name: "DevGuru", rating: 1398, change: "+3" },
              ].map((player, index) => (
                <div
                  key={index}
                  className={`leaderboard-item ${player.name === (user.name || "You") ? "current-user" : ""}`}
                >
                  <span className="rank">#{player.rank}</span>
                  <span className="name">{player.name}</span>
                  <span className="rating">{player.rating}</span>
                  <span className={`change ${player.change.startsWith("+") ? "positive" : "negative"}`}>
                    {player.change}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="achievements-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3>🎖️ Recent Achievements</h3>
            <div className="achievements-list">
              <div className="achievement-item earned">
                <span className="achievement-icon">🥉</span>
                <div className="achievement-info">
                  <h4>Bronze Solver</h4>
                  <p>Solved 20+ problems</p>
                </div>
              </div>
              <div className="achievement-item earned">
                <span className="achievement-icon">🔥</span>
                <div className="achievement-info">
                  <h4>Hot Streak</h4>
                  <p>10 days in a row</p>
                </div>
              </div>
              <div className="achievement-item locked">
                <span className="achievement-icon">🥈</span>
                <div className="achievement-info">
                  <h4>Silver Solver</h4>
                  <p>Solve 50+ problems</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CompetitiveCoding
