"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import "./ProblemSolver.css"

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

interface ProblemSolverProps {
  user: User
}

interface Message {
  id: number
  type: "ai" | "user"
  content: string
  timestamp: Date
}

const ProblemSolver: React.FC<ProblemSolverProps> = ({ user }) => {
  const { problemId } = useParams<{ problemId: string }>()
  const [activeTab, setActiveTab] = useState<string>("problem")
  const [code, setCode] = useState(`if __name__ == '__main__':
    print("Hello, World!")`)
  const [output, setOutput] = useState("")
  const [chatMessage, setChatMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content: "Hi Coding Enthusiast! 🔥 I'm your AI Coding assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleRunCode = () => {
    setOutput("Hello, World!")
  }

  const handleSubmit = () => {
    setOutput("✅ All test cases passed!\nExecution time: 45ms\nMemory usage: 14.2MB")
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: chatMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setChatMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(chatMessage)
      const aiMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()

    if (lowerInput.includes("algorithm") || lowerInput.includes("explain")) {
      return "For the Two Sum problem, you can use a hash map approach:\n\n1. Create a hash map to store numbers and their indices\n2. For each number, check if (target - current number) exists in the map\n3. If found, return the indices\n4. Otherwise, add the current number to the map\n\nThis gives you O(n) time complexity!"
    }

    if (lowerInput.includes("debug") || lowerInput.includes("error")) {
      return "I can help you debug! Common issues in Two Sum:\n\n• Make sure you're not using the same element twice\n• Check if your hash map lookup is correct\n• Verify you're returning indices, not values\n• Test with edge cases like duplicate numbers\n\nShare your code and I'll take a closer look!"
    }

    if (lowerInput.includes("optimize")) {
      return "Great question! Here are optimization tips:\n\n• Use a hash map instead of nested loops (O(n) vs O(n²))\n• Consider space-time tradeoffs\n• For sorted arrays, try two pointers technique\n• Think about edge cases and constraints\n\nWould you like me to explain any of these approaches in detail?"
    }

    if (lowerInput.includes("hint") || lowerInput.includes("help")) {
      return "Here's a hint for Two Sum:\n\n💡 Think about what you need to find: target - current_number\n💡 What data structure allows fast lookups?\n💡 Can you solve it in one pass through the array?\n\nTry implementing with a hash map and let me know if you get stuck!"
    }

    return "I'm here to help with your coding journey! You can ask me about:\n\n• Algorithm explanations\n• Code debugging\n• Optimization techniques\n• Problem-solving strategies\n• Best practices\n\nWhat would you like to explore?"
  }

  const handleQuickAction = (action: string) => {
    setChatMessage(action)
    handleSendMessage()
  }

  const getLineNumbers = () => {
    const lines = code.split("\n")
    return lines.map((_, index) => index + 1).join("\n")
  }

  return (
    <div className="problem-solver">
      <div className="main-content">
        <div className="problem-tabs">
          <button
            className={`tab-button ${activeTab === "problem" ? "active" : ""}`}
            onClick={() => setActiveTab("problem")}
          >
            Problem
          </button>
          <button
            className={`tab-button ${activeTab === "submissions" ? "active" : ""}`}
            onClick={() => setActiveTab("submissions")}
          >
            Submissions
          </button>
          <button
            className={`tab-button ${activeTab === "discussions" ? "active" : ""}`}
            onClick={() => setActiveTab("discussions")}
          >
            Discussions
          </button>
        </div>

        <div className="content-area">
          <div className="problem-content">
            <Link
              to="/competitive"
              style={{
                color: "var(--accent-color)",
                textDecoration: "none",
                marginBottom: "1rem",
                display: "inline-block",
              }}
            >
              ← Back to Problems
            </Link>

            {activeTab === "problem" && (
              <>
                <div className="problem-statement">
                  <h2>Problem Statement</h2>
                  <p>
                    Given an array of integers nums and an integer target, return indices of the two numbers such that
                    they add up to target. You may assume that each input would have exactly one solution, and you may
                    not use the same element twice. You can return the answer in any order.
                  </p>

                  <div className="examples-section">
                    <h3>Examples</h3>

                    <div className="example">
                      <h4>Example 1:</h4>
                      <div className="example-line">
                        <strong>Input:</strong> <code>nums = [2,7,11,15], target = 9</code>
                      </div>
                      <div className="example-line">
                        <strong>Output:</strong> <code>[0,1]</code>
                      </div>
                      <div className="explanation">
                        <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
                      </div>
                    </div>

                    <div className="example">
                      <h4>Example 2:</h4>
                      <div className="example-line">
                        <strong>Input:</strong> <code>nums = [3,2,4], target = 6</code>
                      </div>
                      <div className="example-line">
                        <strong>Output:</strong> <code>[1,2]</code>
                      </div>
                    </div>
                  </div>

                  <div className="constraints-section">
                    <h3>Constraints</h3>
                    <ul>
                      <li>2 ≤ nums.length ≤ 10⁴</li>
                      <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                      <li>-10⁹ ≤ target ≤ 10⁹</li>
                      <li>Only one valid answer exists.</li>
                    </ul>
                  </div>
                </div>

                <div className="code-section">
                  <div className="code-header">
                    <select className="language-selector" defaultValue="python">
                      <option value="python">Code (py)</option>
                      <option value="javascript">Code (js)</option>
                      <option value="java">Code (java)</option>
                      <option value="cpp">Code (cpp)</option>
                    </select>
                    <button className="custom-input-btn">📝 Custom Input</button>
                  </div>

                  <div className="editor-container">
                    <div className="line-numbers">
                      <pre>{getLineNumbers()}</pre>
                    </div>
                    <textarea
                      className="code-editor"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Write your code here..."
                    />
                  </div>
                </div>

                <div className="output-section">
                  <h4>Output</h4>
                  <div className="output-content">{output || 'Click "Run Code" to see the output here'}</div>
                </div>

                <div className="action-buttons">
                  <button className="action-btn test-btn">🧪 Test against custom input</button>
                  <button className="action-btn run-btn" onClick={handleRunCode}>
                    ▶️ Run Code
                  </button>
                  <button className="action-btn submit-btn" onClick={handleSubmit}>
                    📤 Submit
                  </button>
                </div>
              </>
            )}

            {activeTab === "submissions" && (
              <div className="problem-statement">
                <h2>Your Submissions</h2>
                <p>No submissions yet. Submit your solution to see it here.</p>
              </div>
            )}

            {activeTab === "discussions" && (
              <div className="problem-statement">
                <h2>Discussions</h2>
                <p>Join the community discussion about this problem.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="ai-tutor-sidebar">
        <div className="ai-tutor-header">
          <h3>AI Tutor</h3>
          <div className="ai-status">Online</div>
        </div>

        <div className="chat-container">
          <div className="chat-messages">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className="chat-message"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {message.content}
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div className="chat-message" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <span>AI is typing</span>
                  <div style={{ display: "flex", gap: "2px" }}>
                    <div
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: "var(--accent-color)",
                        animation: "pulse 1.5s infinite",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: "var(--accent-color)",
                        animation: "pulse 1.5s infinite 0.2s",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: "var(--accent-color)",
                        animation: "pulse 1.5s infinite 0.4s",
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => handleQuickAction("Explain algorithm")}>
              🧠 Explain algorithm
            </button>
            <button className="quick-action-btn" onClick={() => handleQuickAction("Debug my code")}>
              🐛 Debug my code
            </button>
            <button className="quick-action-btn" onClick={() => handleQuickAction("Optimize solution")}>
              ⚡ Optimize solution
            </button>
            <button className="quick-action-btn" onClick={() => handleQuickAction("Practice hints")}>
              💡 Practice hints
            </button>
          </div>

          <div className="chat-input-container">
            <div className="input-wrapper">
              <input
                type="text"
                className="chat-input"
                placeholder="Ask me anything..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button className="send-btn" onClick={handleSendMessage}>
                ↗️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProblemSolver
