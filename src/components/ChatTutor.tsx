"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User as FirebaseUser } from "firebase/auth"
import "./ChatTutor.css"
import { useChatContext } from "../contexts/ChatContext.tsx"

// Firestore read for score
import { db } from "../firebase.js"
import { doc, getDoc } from "firebase/firestore"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface QuickAction {
  text: string
  icon: string
}

interface ChatTutorProps {
  user: FirebaseUser | null
}

const ChatTutor: React.FC<ChatTutorProps> = ({ user }) => {
  const { tutorInstruction, refreshInstruction } = useChatContext()

  // Local psychometric score to scale token budget
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!user) { setScore(null); return }
      try {
        const snap = await getDoc(doc(db, "users", user.uid))
        const data = snap.exists() ? snap.data() : null
        const s = typeof data?.psychometricScore === "number" ? data.psychometricScore : null
        setScore(s)
      } catch (e) {
        console.error("Failed to load psychometricScore:", e)
        setScore(null)
      }
    }
    load()
  }, [user])

  // Map score to token budget: 0..100 -> 120..500, ensure at least 200 if style exists
  const computeTokenBudget = (s: number | null, hasStyle: boolean) => {
    if (typeof s !== "number" || Number.isNaN(s)) {
      return hasStyle ? 300 : 200
    }
    const clamped = Math.max(0, Math.min(100, Math.round(s)))
    const tokens = Math.round(120 + clamped * 3.8) // 120..500
    return hasStyle ? Math.max(tokens, 200) : tokens
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: `Hello ${user?.displayName || "learner"}! 👋 I'm your AI coding tutor. How can I help today?`,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  useEffect(() => { scrollToBottom() }, [messages])

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputValue.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputValue("")
    setIsTyping(true)

    try {
      const groqApiKey = process.env.REACT_APP_GROQ_API_KEY
      if (!groqApiKey) throw new Error("Groq API key is missing. Set REACT_APP_GROQ_API_KEY in .env")

      // Build messages with personalized style and explicit audit line
      const systemMessages = [
        { role: "system", content: "You are an expert, friendly coding tutor." },
        ...(tutorInstruction ? [{ role: "system", content: `Tutor style: ${tutorInstruction}` }] : []),
        { role: "system", content: "At the end of each answer, add one line starting with 'Style-check:' describing how you applied the style (steps/analogy/pace)." },
      ]
      const chatTurns = newMessages.map(({ role, content }) => ({ role, content }))

      // Score-based token budget
      const tokenBudget = computeTokenBudget(score, !!tutorInstruction)
      console.log("Token budget:", tokenBudget, "Score:", score, "Has style:", !!tutorInstruction)

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [...systemMessages, ...chatTurns],
          max_tokens: tokenBudget,
          temperature: 0.4,
          top_p: 0.9,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Groq API error: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      const assistantResponse: string | undefined = data?.choices?.[0]?.message?.content

      if (assistantResponse) {
        // Visible adherence badge
        const checks: { label: string; pass: boolean }[] = []
        const lcStyle = (tutorInstruction || "").toLowerCase()

        if (lcStyle.includes("step-by-step") || lcStyle.includes("step by step")) {
          const hasSteps = /\b(1\)|1\.|step\s*1)\b/i.test(assistantResponse) || /(^|\n)-\s+/.test(assistantResponse)
          checks.push({ label: "steps", pass: hasSteps })
        }
        if (lcStyle.includes("analogy")) {
          const hasAnalogy = /\b(like|as if|imagine)\b/i.test(assistantResponse)
          checks.push({ label: "analogy", pass: hasAnalogy })
        }
        if (lcStyle.includes("checks") || lcStyle.includes("proceed slowly") || lcStyle.includes("periodic checks")) {
          const hasCheck = /(make sense|shall we proceed|ready to continue|does this help|any questions)/i.test(assistantResponse)
          checks.push({ label: "checks", pass: hasCheck })
        }

        const passed = checks.filter((c) => c.pass).length
        const total = checks.length
        const adherenceLine = total ? `Style adherence: ${passed}/${total}` : ""

        const aiMessage: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: adherenceLine ? `${assistantResponse}\n\n_${adherenceLine}_` : assistantResponse,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }
    } catch (error) {
      console.error("Error communicating with Groq API:", error)
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "⚠️ Sorry, I'm having trouble connecting to Groq API. Please check your API key.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (actionText: string) => setInputValue(actionText)

  const quickActions: QuickAction[] = [
    { text: "Explain what a React Hook is", icon: "🧠" },
    { text: "Help me debug a 'TypeError'", icon: "🐛" },
    { text: "How do I optimize a for loop?", icon: "⚡" },
    { text: "What data structure should I use for a social media feed?", icon: "📊" },
  ]

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="chat-tutor">
      <div className="chat-header">
        <div className="tutor-info">
          <div className="tutor-avatar"><span>🤖</span></div>
          <div className="tutor-details">
            <h2>AI Coding Tutor</h2>
            <p className="status">Online • Powered by Groq</p>
            <p className="style-hint">
              {tutorInstruction ? `Style: ${tutorInstruction}` : "Style not set • Take the psychometric test"}
              <button
                type="button"
                onClick={refreshInstruction}
                className="style-refresh-btn"
                title="Reload style"
                style={{ marginLeft: 8, fontSize: 12 }}
              >
                Refresh
              </button>
            </p>
            {typeof score === "number" && (
              <p className="style-hint">Score-based token limit active</p>
            )}
          </div>
        </div>
      </div>

      <div className="chat-messages">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`message ${message.role}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">{message.role === "assistant" ? "AI Tutor" : "You"}</span>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
                <div className="message-text">
                  {message.content.split("\n").map((line, index) => (<p key={index}>{line}</p>))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div className="message assistant typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="message-content">
              <div className="typing-indicator">
                <div className="typing-dots"><span></span><span></span><span></span></div>
                <span className="typing-text">AI Tutor is typing...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-actions">
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              className="quick-action-btn"
              onClick={() => handleQuickAction(action.text)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-text">{action.text}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about coding..."
            className="chat-input"
            disabled={isTyping}
          />
          <motion.button type="submit" className="send-button" disabled={!inputValue.trim() || isTyping}>
            <span className="send-icon">📤</span>
          </motion.button>
        </div>
      </form>
    </div>
  )
}

export default ChatTutor
