import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle, Bot, Send, User, AlertCircle, Sparkles, Info } from 'lucide-react'
import { SectionCard } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

// Quick questions for users to try - creative & interesting prompts
const QUICK_QUESTIONS = {
  bn: [
    'বাংলাদেশ নিয়ে একটা কবিতা লেখো',
    'আজকে মন খারাপ, কিছু বলো',
    'বাংলাদেশের মজার ইতিহাস বলো',
    'ঢাকার সেরা বিরিয়ানি কোথায়?',
  ],
  en: [
    'Write a poem about Bangladesh',
    'Tell me a Bengali folk tale',
    'Fun facts about Dhaka city',
    'Best biryani spots in Dhaka?',
  ],
}

function AIAssistantSection() {
  const { t, i18n } = useTranslation()
  const { isBangla } = useLanguage()
  const { isAuthenticated } = useAuth()
  const chatContainerRef = useRef(null)
  
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [rateLimit, setRateLimit] = useState(null)
  const [error, setError] = useState(null)

  const questions = QUICK_QUESTIONS[i18n.language] || QUICK_QUESTIONS.bn

  // Initial greeting
  useEffect(() => {
    setMessages([{
      id: 1,
      type: 'bot',
      text: isBangla 
        ? 'আসসালামু আলাইকুম! আমি banglade.sh এর AI সহকারী। বাংলাদেশ সম্পর্কে যেকোনো প্রশ্ন করুন!' 
        : 'Hello! I\'m the banglade.sh AI assistant. Ask me anything about Bangladesh!',
      time: new Date(),
    }])
  }, [isBangla])

  // Fetch rate limit on mount
  useEffect(() => {
    const fetchLimit = async () => {
      try {
        const response = await api.portal.ai.rateLimit()
        if (response.success) {
          setRateLimit(response.data)
        }
      } catch (err) {
        console.error('Failed to fetch rate limit:', err)
      }
    }
    fetchLimit()
  }, [])

  // Scroll to bottom only within the chat container (not the page)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (text) => {
    const messageText = text || input.trim()
    if (!messageText || isTyping) return

    // Check rate limit
    if (rateLimit && !rateLimit.allowed) {
      setError(isBangla 
        ? 'আপনার দৈনিক সীমা শেষ। আগামীকাল আবার চেষ্টা করুন!' 
        : 'Daily limit reached. Try again tomorrow!')
      return
    }

    setError(null)

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText,
      time: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await api.portal.ai.chat(messageText)
      
      if (response.success) {
        // Add bot response
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          text: response.data.message,
          time: new Date(),
          model: response.data.model,
        }
        setMessages(prev => [...prev, botResponse])
        
        // Update rate limit
        if (response.data.rate_limit) {
          setRateLimit(response.data.rate_limit)
        }
      } else {
        throw new Error(response.error?.message || 'Failed to get response')
      }
    } catch (err) {
      console.error('AI error:', err)
      
      // Check if rate limit error
      if (err.message?.includes('rate') || err.message?.includes('limit')) {
        setError(isBangla 
          ? 'আপনার দৈনিক সীমা শেষ হয়েছে।' 
          : 'You\'ve reached your daily limit.')
      } else {
        // Add error as bot message
        const errorResponse = {
          id: Date.now() + 1,
          type: 'bot',
          text: isBangla
            ? 'দুঃখিত, এই মুহূর্তে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Sorry, something went wrong. Please try again.',
          time: new Date(),
          isError: true,
        }
        setMessages(prev => [...prev, errorResponse])
      }
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSend()
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString(isBangla ? 'bn-BD' : 'en-US', {
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  return (
    <SectionCard
      title={t('sections.aiAssistant')}
      icon={MessageCircle}
      iconColor="text-green-600"
      colSpan={2}
      headerRight={
        <div className="flex items-center gap-2">
          {/* Rate limit indicator */}
          {rateLimit && (
            <span className="text-xs text-gray-500 hidden sm:inline">
              {rateLimit.remaining}/{rateLimit.limit} {isBangla ? 'বাকি' : 'left'}
            </span>
          )}
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Sparkles className="w-3 h-3" />
            <span>AI</span>
          </div>
        </div>
      }
    >
      {/* Beta Notice */}
      <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          {isBangla 
            ? `বেটা সংস্করণ। ${isAuthenticated ? '২০' : '৫'}টি প্রশ্ন/দিন। ${!isAuthenticated ? 'লগইন করলে আরও ২০টি!' : ''}`
            : `Beta version. ${isAuthenticated ? '20' : '5'} questions/day. ${!isAuthenticated ? 'Login for 20!' : ''}`}
        </p>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.type === 'user' ? 'bg-blue-500' : msg.isError ? 'bg-red-500' : 'bg-green-500'
                }`}
              >
                {msg.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div
                className={`p-3 rounded-xl ${
                  msg.type === 'user'
                    ? 'bg-blue-500 text-white rounded-tr-sm'
                    : msg.isError 
                      ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-sm'
                      : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <div className={`flex items-center justify-between mt-1.5 text-xs ${
                  msg.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  <span>{formatTime(msg.time)}</span>
                  {msg.model && msg.model !== 'fallback' && (
                    <span className="ml-2 opacity-60">GPT-4o</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="p-3 rounded-xl rounded-tl-sm bg-gray-100">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Quick Questions */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-2">{t('ai.quickQuestions')}:</p>
        <div className="grid grid-cols-2 gap-1.5">
          {questions.map((question) => (
            <button
              key={question}
              onClick={() => handleSend(question)}
              disabled={isTyping || (rateLimit && !rateLimit.allowed)}
              className="text-xs p-2 bg-gray-50 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-200 rounded-lg text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping || (rateLimit && !rateLimit.allowed)}
          maxLength={500}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder={rateLimit && !rateLimit.allowed 
            ? (isBangla ? 'দৈনিক সীমা শেষ' : 'Daily limit reached')
            : t('ai.placeholder')}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping || (rateLimit && !rateLimit.allowed)}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 rounded-lg flex items-center justify-center transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </SectionCard>
  )
}

export default AIAssistantSection
