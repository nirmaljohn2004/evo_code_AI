"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import FloatingAITutor from "./FloatingAITutor.tsx"
import "./Lesson.css"

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

interface LessonProps {
  user: User
}

interface LessonContent {
  id: number
  title: string
  type: "text" | "code" | "quiz" | "video"
  content: string
  codeExample?: string
  language?: string
  quiz?: {
    question: string
    options: string[]
    correct: number
  }
}

const Lesson: React.FC<LessonProps> = ({ user }) => {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [showAITutor, setShowAITutor] = useState<boolean>(false)
  const [userCode, setUserCode] = useState<string>("")
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState<boolean>(false)

  const lessonContent: LessonContent[] = [
    {
      id: 1,
      title: "Introduction to Variables",
      type: "text",
      content:
        "Variables are containers that store data values. In Python, you don't need to declare the type of variable - Python automatically determines the type based on the value you assign.\n\nVariables are fundamental building blocks in programming. They allow us to store, modify, and retrieve data throughout our program's execution.",
    },
    {
      id: 2,
      title: "Creating Variables",
      type: "code",
      content: "Let's create some variables in Python. Here are different types of variables you can create:",
      codeExample: `# String variable
name = "Alice"

# Integer variable
age = 25

# Float variable
height = 5.6

# Boolean variable
is_student = True

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height}")
print(f"Is student: {is_student}")`,
      language: "python",
    },
    {
      id: 3,
      title: "Practice: Create Your Own Variables",
      type: "code",
      content:
        "Now it's your turn! Create variables for your favorite movie, the year it was released, and whether you would recommend it.",
      codeExample: `# Create your variables here
# Example:
# movie_title = "Your favorite movie"
# release_year = 2020
# would_recommend = True

`,
      language: "python",
    },
    {
      id: 4,
      title: "Knowledge Check",
      type: "quiz",
      content: "Let's test your understanding of variables!",
      quiz: {
        question: "Which of the following is a valid variable name in Python?",
        options: ["2variable", "my-variable", "my_variable", "my variable"],
        correct: 2,
      },
    },
    {
      id: 5,
      title: "Variable Naming Rules",
      type: "text",
      content:
        "When naming variables in Python, follow these important rules:\n\n• Variable names must start with a letter or underscore\n• Cannot start with a number\n• Can only contain letters, numbers, and underscores\n• Case-sensitive (myVar and myvar are different)\n• Cannot use Python keywords (like 'if', 'for', 'while')\n\nBest practices:\n• Use descriptive names (user_age instead of x)\n• Use snake_case for multi-word variables\n• Keep names concise but meaningful",
    },
  ]

  const currentContent = lessonContent[currentStep]
  const progress = ((currentStep + 1) / lessonContent.length) * 100

  const handleNext = () => {
    if (currentStep < lessonContent.length - 1) {
      setCurrentStep(currentStep + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setUserCode("")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const handleQuizSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true)
    }
  }

  const handleRunCode = () => {
    // Simulate code execution
    console.log("Running code:", userCode)
    alert("Code executed successfully! Check the console for output.")
  }

  const toggleAITutor = () => {
    setShowAITutor(!showAITutor)
  }

  return (
    <div className="lesson">
      <div className="lesson-header">
        <div className="lesson-nav">
          <Link to="/learning/python" className="back-btn">
            ← Back to Python Course
          </Link>
          <div className="lesson-info">
            <h1>Python Basics: Variables</h1>
            <div className="lesson-meta">
              <span className="lesson-step">
                Step {currentStep + 1} of {lessonContent.length}
              </span>
              <span className="lesson-time">⏱️ 15 min</span>
            </div>
          </div>
        </div>

        <div className="lesson-actions">
          <button className={`ai-tutor-toggle ${showAITutor ? "active" : ""}`} onClick={toggleAITutor}>
            🤖 AI Tutor
          </button>
        </div>
      </div>

      <div className="lesson-progress">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="progress-text">{Math.round(progress)}% Complete</span>
      </div>

      <div className={`lesson-container ${showAITutor ? "with-tutor" : ""}`}>
        <div className="lesson-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="content-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="step-header">
                <h2>{currentContent.title}</h2>
                <div className="step-type">
                  {currentContent.type === "text" && "📖 Reading"}
                  {currentContent.type === "code" && "💻 Coding"}
                  {currentContent.type === "quiz" && "❓ Quiz"}
                  {currentContent.type === "video" && "🎥 Video"}
                </div>
              </div>

              <div className="step-content">
                {currentContent.type === "text" && (
                  <div className="text-content">
                    {currentContent.content.split("\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {currentContent.type === "code" && (
                  <div className="code-content">
                    <div className="content-text">
                      <p>{currentContent.content}</p>
                    </div>

                    {currentContent.codeExample && (
                      <div className="code-example">
                        <div className="code-header">
                          <span className="code-language">{currentContent.language}</span>
                          <button
                            className="copy-btn"
                            onClick={() => navigator.clipboard.writeText(currentContent.codeExample || "")}
                          >
                            📋 Copy
                          </button>
                        </div>
                        <pre>
                          <code>{currentContent.codeExample}</code>
                        </pre>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="code-editor">
                        <div className="editor-header">
                          <span>✏️ Your Code</span>
                          <button className="run-btn" onClick={handleRunCode}>
                            ▶️ Run Code
                          </button>
                        </div>
                        <textarea
                          value={userCode}
                          onChange={(e) => setUserCode(e.target.value)}
                          placeholder="Write your code here..."
                          className="code-textarea"
                        />
                      </div>
                    )}
                  </div>
                )}

                {currentContent.type === "quiz" && currentContent.quiz && (
                  <div className="quiz-content">
                    <div className="quiz-question">
                      <h3>{currentContent.quiz.question}</h3>
                    </div>

                    <div className="quiz-options">
                      {currentContent.quiz.options.map((option, index) => (
                        <motion.button
                          key={index}
                          className={`quiz-option ${selectedAnswer === index ? "selected" : ""} ${
                            showResult
                              ? index === currentContent.quiz!.correct
                                ? "correct"
                                : selectedAnswer === index
                                  ? "incorrect"
                                  : ""
                              : ""
                          }`}
                          onClick={() => !showResult && setSelectedAnswer(index)}
                          disabled={showResult}
                          whileHover={{ scale: showResult ? 1 : 1.02 }}
                          whileTap={{ scale: showResult ? 1 : 0.98 }}
                        >
                          <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                          <span className="option-text">{option}</span>
                          {showResult && index === currentContent.quiz!.correct && (
                            <span className="option-icon">✅</span>
                          )}
                          {showResult && selectedAnswer === index && index !== currentContent.quiz!.correct && (
                            <span className="option-icon">❌</span>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {!showResult && selectedAnswer !== null && (
                      <button className="submit-quiz-btn" onClick={handleQuizSubmit}>
                        Submit Answer
                      </button>
                    )}

                    {showResult && (
                      <div
                        className={`quiz-result ${
                          selectedAnswer === currentContent.quiz.correct ? "correct" : "incorrect"
                        }`}
                      >
                        {selectedAnswer === currentContent.quiz.correct ? (
                          <div className="result-content">
                            <span className="result-icon">🎉</span>
                            <div>
                              <h4>Correct!</h4>
                              <p>Great job! You've got it right.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="result-content">
                            <span className="result-icon">💡</span>
                            <div>
                              <h4>Not quite right</h4>
                              <p>
                                The correct answer is option {String.fromCharCode(65 + currentContent.quiz.correct)}.
                                Variable names in Python must follow specific naming rules.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="lesson-navigation">
            <button className="nav-btn prev" onClick={handlePrevious} disabled={currentStep === 0}>
              ← Previous
            </button>

            <div className="step-indicators">
              {lessonContent.map((_, index) => (
                <button
                  key={index}
                  className={`step-indicator ${
                    index === currentStep ? "active" : ""
                  } ${index < currentStep ? "completed" : ""}`}
                  onClick={() => setCurrentStep(index)}
                >
                  {index < currentStep ? "✓" : index + 1}
                </button>
              ))}
            </div>

            {currentStep === lessonContent.length - 1 ? (
              <Link to="/learning/python" className="nav-btn next complete">
                Complete Lesson ✓
              </Link>
            ) : (
              <button
                className="nav-btn next"
                onClick={handleNext}
                disabled={currentContent.type === "quiz" && (selectedAnswer === null || !showResult)}
              >
                Next →
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showAITutor && (
            <motion.div
              className="ai-tutor-sidebar"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FloatingAITutor
                user={user}
                lessonContext={`Currently learning about: ${currentContent.title}`}
                onClose={() => setShowAITutor(false)}
                isEmbedded={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Only show floating button when sidebar is not open */}
      {!showAITutor && <FloatingAITutor user={user} />}
    </div>
  )
}

export default Lesson
