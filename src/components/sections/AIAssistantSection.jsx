import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle, Bot, Send, User } from 'lucide-react'
import { SectionCard } from '../common'

// Dummy quick questions
const quickQuestions = {
  bn: [
    'আজকের আবহাওয়া কেমন?',
    'সরকারি চাকরির খবর',
    'শিক্ষা বৃত্তির তথ্য',
    'স্বাস্থ্য সেবা',
  ],
  en: [
    "What's the weather today?",
    'Government job news',
    'Scholarship information',
    'Health services',
  ],
}

function AIAssistantSection() {
  const { t, i18n } = useTranslation()
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: t('ai.greeting'),
      time: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const isBangla = i18n.language === 'bn'
  const questions = quickQuestions[i18n.language] || quickQuestions.bn

  const handleSend = async (text) => {
    const messageText = text || input.trim()
    if (!messageText) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText,
      time: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate bot response (TODO: Connect to actual AI API)
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: isBangla
          ? 'দুঃখিত, এই মুহূর্তে আমি সীমিত প্রতিক্রিয়া দিতে পারছি। শীঘ্রই পূর্ণ AI সেবা চালু হবে!'
          : "Sorry, I can only provide limited responses at the moment. Full AI service coming soon!",
        time: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
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
        <div className="flex items-center space-x-1 text-xs text-green-600">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>{t('common.online')}</span>
        </div>
      }
    >
      {/* Chat Messages */}
      <div className="flex-1 space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  msg.type === 'user' ? 'bg-blue-500' : 'bg-green-500'
                }`}
              >
                {msg.type === 'user' ? (
                  <User className="h-3 w-3 text-white" />
                ) : (
                  <Bot className="h-3 w-3 text-white" />
                )}
              </div>
              <div
                className={`p-3 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(msg.time)}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Bot className="h-3 w-3 text-white" />
              </div>
              <div className="p-3 rounded-lg bg-gray-100">
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-2">{t('ai.quickQuestions')}:</p>
        <div className="grid grid-cols-2 gap-2">
          {questions.map((question) => (
            <button
              key={question}
              onClick={() => handleSend(question)}
              className="text-xs p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-left transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
          placeholder={t('ai.placeholder')}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 rounded-md flex items-center justify-center transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </SectionCard>
  )
}

export default AIAssistantSection
