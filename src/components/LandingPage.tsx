"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import "./LandingPage.css"

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Learning",
      description: "Get personalized guidance from our advanced AI tutor that adapts to your learning style and pace.",
    },
    {
      icon: "🏆",
      title: "Competitive Programming",
      description:
        "Challenge yourself with algorithmic problems and participate in coding contests to sharpen your skills.",
    },
    {
      icon: "📚",
      title: "Structured Learning Paths",
      description: "Follow carefully designed curricula for different programming languages and skill levels.",
    },
    {
      icon: "🎮",
      title: "Gamified Experience",
      description: "Earn XP, unlock achievements, and maintain streaks to make learning fun and engaging.",
    },
    {
      icon: "💬",
      title: "Interactive Chat",
      description: "Get instant help and explanations through our intelligent chat system available 24/7.",
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Monitor your growth with detailed analytics and personalized insights into your coding journey.",
    },
  ]

  const developers = [
    {
      name: "Pranav Babu",
      role: "AI Engineer",
      photo: "/placeholder.svg?height=200&width=200",
      contribution: "Designed the AI tutoring system and machine learning algorithms",
      linkedin: "https://linkedin.com/in/alexchen",
    },
    {
      name: "Nirmal John",
      role: "AI Engineer",
      photo: "/placeholder.svg?height=200&width=200",
      contribution: "Designed the  machine learning algorithms",
      linkedin: "https://linkedin.com/in/sarahjohnson",
    },
    {
      name: "Neha Shaju",
      role: "Frontend Architect",
      photo: "/placeholder.svg?height=200&width=200",
      contribution: "Created the user interface and gamification features",
      linkedin: "https://linkedin.com/in/michaelrodriguez",
    },
    {
      name: "Sreelakshmi UV",
      role: "Backend Developer",
      photo: "/placeholder.svg?height=200&width=200",
      contribution: "Built the competitive programming platform and infrastructure",
      linkedin: "https://linkedin.com/in/emilyzhang",
    },
  ]

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Master Coding with
              <span className="gradient-text"> AI-Powered Learning</span>
            </h1>
            <p className="hero-description">
              evoCode revolutionizes programming education by combining artificial intelligence, gamification, and
              competitive programming to create the ultimate learning experience.
            </p>

            <div className="hero-actions">
              <Link to="/login">
                <motion.button className="primary-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Start Learning Free
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="code-window">
              <div className="window-header">
                <div className="window-controls">
                  <span className="control red"></span>
                  <span className="control yellow"></span>
                  <span className="control green"></span>
                </div>
                <span className="window-title">main.py</span>
              </div>
              <div className="code-content">
                <div className="code-line">
                  <span className="line-number">1</span>
                  <span className="code-text">
                    <span className="keyword">def</span> <span className="function">learn_coding</span>():
                  </span>
                </div>
                <div className="code-line">
                  <span className="line-number">2</span>
                  <span className="code-text">
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span>{" "}
                    <span className="string">"evoCode makes it fun!"</span>
                  </span>
                </div>
                <div className="code-line">
                  <span className="line-number">3</span>
                  <span className="code-text"></span>
                </div>
                <div className="code-line">
                  <span className="line-number">4</span>
                  <span className="code-text">
                    <span className="function">print</span>(<span className="function">learn_coding</span>())
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Why Choose evoCode?</h2>
            <p>Discover the features that make evoCode the ultimate coding education platform</p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>About evoCode</h2>
            <p>Our mission is to democratize coding education through innovative technology</p>
          </motion.div>

          <motion.div
            className="about-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="about-text">
              <h3>Revolutionizing Programming Education</h3>
              <p>
                evoCode was born from the vision of making programming education more accessible, engaging, and
                effective. We believe that everyone should have the opportunity to learn coding, regardless of their
                background or experience level.
              </p>
              <p>
                Our platform combines cutting-edge artificial intelligence with proven educational methodologies to
                create personalized learning experiences that adapt to each student's unique needs and learning style.
              </p>
              <p>
                By gamifying the learning process and incorporating competitive programming elements, we've created an
                environment where learning to code is not just educational, but genuinely enjoyable and motivating.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Meet Our Team</h2>
            <p>The passionate developers and designers behind evoCode</p>
          </motion.div>

          <div className="team-grid">
            {developers.map((developer, index) => (
              <motion.div
                key={index}
                className="team-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="team-photo">
                  <img src={developer.photo || "/placeholder.svg"} alt={developer.name} />
                </div>
                <div className="team-info">
                  <h3>{developer.name}</h3>
                  <p className="team-role">{developer.role}</p>
                  <p className="team-contribution">{developer.contribution}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>
                evo<span className="logo-accent">Code</span>
              </h3>
              <p>Empowering the next generation of programmers</p>
            </div>

            <div className="footer-links">
              <div className="link-group">
                <h4>Platform</h4>
                <Link to="/login">Dashboard</Link>
                <Link to="/login">AI Tutor</Link>
                <Link to="/login">Competitive</Link>
              </div>

              <div className="link-group">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#team">Team</a>
                <a href="#contact">Contact</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 evoCode. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
