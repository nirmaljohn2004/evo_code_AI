"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User as FirebaseUser } from "firebase/auth"
import "./FloatingAITutor.css"

// --- MERGED INTERFACES ---
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

interface FloatingAITutorProps {
  user: FirebaseUser | null
  lessonContext?: string // To make the tutor context-aware
}

const FloatingAITutor: React.FC<FloatingAITutorProps> = ({ user, lessonContext }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: `Hi ${user?.displayName || 'there'}! I see you're working on ${lessonContext || 'your project'}. How can I help?`,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState<string>("")
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // --- UPDATED with Groq API ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage];
    setMessages(newMessages)
    setInputValue("")
    setIsTyping(true)

    try {
      // --- Groq API Call ---
      // IMPORTANT: Replace with your actual Groq API key
      const groqApiKey = process.env.REACT_APP_GROQ_API_KEY;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: newMessages.map(({ role, content }) => ({ role, content })),
          max_tokens: 100, // Keep responses brief for the popup
        }),
      })

      if (!response.ok) throw new Error("API request failed")

      const data = await response.json()
      const assistantResponse = data.choices[0]?.message?.content
      
      if (assistantResponse) {
        const aiMessage: Message = {
            id: Date.now() + 1,
            role: "assistant",
            content: assistantResponse,
            timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }
    } catch (error) {
      console.error("Groq API error:", error)
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (action: QuickAction) => {
    setInputValue(action.text)
  }

  const quickActions: QuickAction[] = [
    { text: "Explain this concept", icon: "🧠" },
    { text: "Help me debug", icon: "🐛" },
    { text: "Give me practice exercises", icon: "💪" },
    { text: "Show me examples", icon: "📝" },
  ]

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      <motion.button
        className="floating-tutor-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        🤖
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="floating-chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="floating-chat-header">
              <h3>Floating AI Tutor</h3>
              <button onClick={() => setIsOpen(false)} className="close-btn">✖</button>
            </div>
            <div className="floating-chat-messages">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`floating-message ${message.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p>{message.content}</p>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </motion.div>
              ))}
               {isTyping && (
                <div className="floating-message assistant">
                  <div className="typing-indicator"><span></span><span></span><span></span></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
             <div className="quick-actions-popup">
                {quickActions.map((action, index) => (
                    <button key={index} className="quick-action-btn-popup" onClick={() => handleQuickAction(action)}>
                        {action.icon} {action.text}
                    </button>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="floating-chat-form">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a quick question..."
                disabled={isTyping}
              />
              <button type="submit" disabled={isTyping}>Send</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingAITutor
