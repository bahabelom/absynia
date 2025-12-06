"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { MessageCircle, X, Send, Bot, User, Globe, Sparkles, Loader2, Plus, MessageSquare, History } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
    id: string
    role: 'user' | 'assistant'
    text: string
    timestamp?: number
}

type Language = {
    code: string
    name: string
    flag: string
}

type Conversation = {
    id: string
    title: string
    messages: Message[]
    createdAt: number
    updatedAt: number
}

type ConversationHistory = {
    [courseId: string]: Conversation[]
}

const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'am', name: 'Amharic', flag: '🇪🇹' },
    { code: 'om', name: 'Afan Oromo', flag: '🇪🇹' },
    { code: 'ti', name: 'Tigrinya', flag: '🇪🇹' },
]

const getInitialGreeting = (languageCode: string): string => {
    const greetings: Record<string, string> = {
        en: 'Hello! I am your AI study assistant. Ask me anything about this chapter!',
        am: 'ሰላም! እኔ የእርስዎ AI የትምህርት ረዳት ነኝ። ስለዚህ ምዕራፍ ማንኛውንም ነገር ይጠይቁኝ!',
        om: 'Akkam! Ani gargaarsa qo\'annoo AI keessan. Waa\'ee kutaa kanaa waan hunda na gaafadhu!',
        ti: 'ሰላም! ኣነ ናይ እርስዎ AI መማህርቲ ሓጋዚ እየ። ብዛዕባ እዚ ምዕራፍ እዚ ነገር ዝዀነ ይሓትቱኒ!',
    }
    return greetings[languageCode] || greetings.en
}

// Storage key for conversations
const STORAGE_KEY = 'ai-chat-conversations'

// Helper functions for localStorage
const getConversations = (courseId: string): Conversation[] => {
    if (typeof window === 'undefined') return []
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return []
        const allConversations: ConversationHistory = JSON.parse(stored)
        return allConversations[courseId] || []
    } catch {
        return []
    }
}

const saveConversations = (courseId: string, conversations: Conversation[]) => {
    if (typeof window === 'undefined') return
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const allConversations: ConversationHistory = stored ? JSON.parse(stored) : {}
        allConversations[courseId] = conversations
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allConversations))
    } catch (error) {
        console.error('Failed to save conversations:', error)
    }
}

const generateConversationTitle = (firstMessage: string): string => {
    const maxLength = 40
    const trimmed = firstMessage.trim()
    if (trimmed.length <= maxLength) return trimmed
    return trimmed.substring(0, maxLength) + '...'
}

export function AIChatWidget() {
    const params = useParams()
    const courseId = (params?.id as string) || 'default'
    
    const [isOpen, setIsOpen] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', text: getInitialGreeting('en'), timestamp: Date.now() }
    ])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const languageDropdownRef = useRef<HTMLDivElement>(null)
    const historyDropdownRef = useRef<HTMLDivElement>(null)
    const historyButtonRef = useRef<HTMLButtonElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Load conversations for this course
    useEffect(() => {
        const loaded = getConversations(courseId)
        setConversations(loaded)
    }, [courseId])

    // Save messages to current conversation
    useEffect(() => {
        if (messages.length > 1 && currentConversationId) {
            const updated = conversations.map(conv => 
                conv.id === currentConversationId
                    ? { ...conv, messages, updatedAt: Date.now() }
                    : conv
            )
            setConversations(updated)
            saveConversations(courseId, updated)
        }
    }, [messages, currentConversationId, courseId])

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
                setIsLanguageDropdownOpen(false)
            }
            if (historyDropdownRef.current && !historyDropdownRef.current.contains(event.target as Node)) {
                setIsHistoryOpen(false)
            }
        }

        if (isLanguageDropdownOpen || isHistoryOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isLanguageDropdownOpen, isHistoryOpen])

    // Update greeting when language changes (only if it's just the greeting)
    useEffect(() => {
        if (messages.length === 1 && messages[0].role === 'assistant' && !currentConversationId) {
            setMessages([{
                id: '1',
                role: 'assistant',
                text: getInitialGreeting(selectedLanguage.code),
                timestamp: Date.now()
            }])
        }
    }, [selectedLanguage, currentConversationId])

    const handleNewChat = () => {
        setCurrentConversationId(null)
        setMessages([{
            id: '1',
            role: 'assistant',
            text: getInitialGreeting(selectedLanguage.code),
            timestamp: Date.now()
        }])
        setIsHistoryOpen(false)
    }

    const handleSelectConversation = (conversationId: string) => {
        const conversation = conversations.find(c => c.id === conversationId)
        if (conversation) {
            setCurrentConversationId(conversationId)
            setMessages(conversation.messages)
            setIsHistoryOpen(false)
        }
    }

    const handleDeleteConversation = (conversationId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        const updated = conversations.filter(c => c.id !== conversationId)
        setConversations(updated)
        saveConversations(courseId, updated)
        
        if (currentConversationId === conversationId) {
            handleNewChat()
        }
    }

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        // Create new conversation if this is the first user message
        if (!currentConversationId && messages.length === 1 && messages[0].role === 'assistant') {
            const newConv: Conversation = {
                id: Date.now().toString(),
                title: generateConversationTitle(inputValue),
                messages: [...messages],
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
            const updated = [newConv, ...conversations]
            setConversations(updated)
            setCurrentConversationId(newConv.id)
            saveConversations(courseId, updated)
        }

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: inputValue,
            timestamp: Date.now()
        }

        setMessages(prev => [...prev, newUserMessage])
        const userInput = inputValue
        setInputValue("")
        setIsTyping(true)

        try {
            const response = await fetch('/api/ask-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: userInput,
                    language: selectedLanguage.code,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to get AI response')
            }

            const data = await response.json()
            
            const newAiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                text: data.aiReply,
                timestamp: Date.now()
            }

            setMessages(prev => [...prev, newAiMessage])
            
            // Update conversation title if it's still the default
            if (currentConversationId) {
                const conv = conversations.find(c => c.id === currentConversationId)
                if (conv && conv.title === generateConversationTitle(userInput)) {
                    const updated = conversations.map(c => 
                        c.id === currentConversationId
                            ? { ...c, title: generateConversationTitle(userInput), updatedAt: Date.now() }
                            : c
                    )
                    setConversations(updated)
                    saveConversations(courseId, updated)
                }
            }
        } catch (error) {
            console.error('Error fetching AI response:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                text: 'Sorry, I encountered an error. Please try again later.',
                timestamp: Date.now()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsTyping(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleLanguageChange = (language: Language) => {
        setSelectedLanguage(language)
        setIsLanguageDropdownOpen(false)
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="mb-4 w-80 md:w-96 shadow-2xl rounded-2xl"
                        style={{ overflow: 'visible' }}
                    >
                        <Card className="border-0 flex flex-col h-[700px] md:h-[750px] bg-white" style={{ overflow: 'visible' }}>
                            {/* Enhanced Header with Gradient */}
                            <CardHeader className="bg-gradient-to-br from-primary via-primary to-[#1e4d3a] text-white p-6 flex flex-row items-center justify-between space-y-0 relative z-30" style={{ overflow: 'visible' }}>
                                {/* Decorative background elements */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl"></div>
                                </div>
                                
                                <div className="flex items-center gap-3 relative z-10">
                                    <motion.div 
                                        className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl shadow-lg"
                                        animate={{ 
                                            boxShadow: [
                                                "0 0 0 0 rgba(255, 255, 255, 0.4)",
                                                "0 0 0 10px rgba(255, 255, 255, 0)",
                                                "0 0 0 0 rgba(255, 255, 255, 0)"
                                            ]
                                        }}
                                        transition={{ 
                                            duration: 2, 
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Bot className="h-5 w-5" />
                                    </motion.div>
                                    <div>
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            AI Mentor
                                            <motion.div
                                                animate={{ rotate: [0, 10, -10, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <Sparkles className="h-4 w-4 text-yellow-300" />
                                            </motion.div>
                                        </CardTitle>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                            <p className="text-xs text-white/90 font-medium">Always here to help</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 relative z-10">
                                    {/* New Chat Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleNewChat}
                                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white h-9 px-3 rounded-lg flex items-center gap-1.5 transition-all duration-200 border border-white/20"
                                        title="New Chat"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                    </motion.button>

                                    {/* Conversation History */}
                                    <div className="relative" ref={historyDropdownRef}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                                            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white h-9 px-3 rounded-lg flex items-center gap-1.5 transition-all duration-200 border border-white/20"
                                            title="Chat History"
                                        >
                                            <History className="h-3.5 w-3.5" />
                                            {conversations.length > 0 && (
                                                <span className="text-xs bg-white/30 px-1.5 py-0.5 rounded-full">
                                                    {conversations.length}
                                                </span>
                                            )}
                                        </motion.button>
                                        
                                        <AnimatePresence>
                                            {isHistoryOpen && (
                                                <>
                                                    {/* Backdrop */}
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        onClick={() => setIsHistoryOpen(false)}
                                                        className="fixed inset-0 z-[9998] bg-black/10"
                                                    />
                                                    {/* Dropdown - positioned just below the header */}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[10000] backdrop-blur-sm max-h-96"
                                                    >
                                                    <div className="p-2 border-b border-gray-100">
                                                        <p className="text-xs font-semibold text-gray-500 px-3 py-2">Chat History</p>
                                                    </div>
                                                    <div className="overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                                        {conversations.length === 0 ? (
                                                            <div className="p-4 text-center text-sm text-gray-500">
                                                                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                                                <p>No conversations yet</p>
                                                                <p className="text-xs mt-1">Start a new chat to begin</p>
                                                            </div>
                                                        ) : (
                                                            conversations.map((conv, index) => (
                                                                <motion.div
                                                                    key={conv.id}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: index * 0.03 }}
                                                                    onClick={() => handleSelectConversation(conv.id)}
                                                                    className={`
                                                                        p-3 mx-2 my-1 rounded-lg cursor-pointer transition-all duration-200 group
                                                                        ${currentConversationId === conv.id
                                                                            ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary'
                                                                            : 'hover:bg-gray-50'
                                                                        }
                                                                    `}
                                                                >
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className={`text-sm font-medium truncate ${currentConversationId === conv.id ? 'text-primary' : 'text-gray-700'}`}>
                                                                                {conv.title}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                                {new Date(conv.updatedAt).toLocaleDateString()}
                                                                            </p>
                                                                        </div>
                                                                        <button
                                                                            onClick={(e) => handleDeleteConversation(conv.id, e)}
                                                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500 transition-opacity"
                                                                            title="Delete conversation"
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </button>
                                                                    </div>
                                                                </motion.div>
                                                            ))
                                                        )}
                                                    </div>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Enhanced Language Selector */}
                                    <div className="relative" ref={languageDropdownRef}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white h-9 px-3 rounded-lg flex items-center gap-1.5 transition-all duration-200 border border-white/20"
                                        >
                                            <Globe className="h-3.5 w-3.5" />
                                            <span className="text-sm font-medium">{selectedLanguage.flag}</span>
                                        </motion.button>
                                        
                                        <AnimatePresence>
                                            {isLanguageDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[10000] backdrop-blur-sm"
                                                >
                                                    <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                                        {languages.map((lang, index) => (
                                                            <motion.button
                                                                key={lang.code}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.05 }}
                                                                onClick={() => handleLanguageChange(lang)}
                                                                className={`
                                                                    w-full px-4 py-3 text-left text-sm transition-all duration-200
                                                                    flex items-center gap-3 group
                                                                    ${selectedLanguage.code === lang.code 
                                                                        ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-semibold border-l-4 border-primary' 
                                                                        : 'text-gray-700 hover:bg-gray-50'
                                                                    }
                                                                `}
                                                            >
                                                                <span className="text-xl">{lang.flag}</span>
                                                                <span className="flex-1">{lang.name}</span>
                                                                {selectedLanguage.code === lang.code && (
                                                                    <motion.span 
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        className="text-primary text-lg"
                                                                    >
                                                                        ✓
                                                                    </motion.span>
                                                                )}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsOpen(false)}
                                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200 border border-white/20"
                                    >
                                        <X className="h-4 w-4" />
                                    </motion.button>
                                </div>
                            </CardHeader>

                            {/* Enhanced Messages Area */}
                            <CardContent className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-gray-50 to-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                <AnimatePresence mode="popLayout">
                                    {messages.map((msg, index) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ 
                                                duration: 0.3,
                                                delay: index === messages.length - 1 ? 0.1 : 0
                                            }}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2`}
                                        >
                                            {msg.role === 'assistant' && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="mt-1 bg-primary/10 p-1.5 rounded-lg"
                                                >
                                                    <Bot className="h-3.5 w-3.5 text-primary" />
                                                </motion.div>
                                            )}
                                            <motion.div
                                                className={`
                                                    max-w-[80%] rounded-2xl px-5 py-4 text-base leading-relaxed
                                                    ${msg.role === 'user'
                                                        ? 'bg-gradient-to-br from-primary to-[#1e4d3a] text-white rounded-br-md shadow-lg'
                                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm hover:shadow-md transition-shadow'
                                                    }
                                                `}
                                                whileHover={{ scale: 1.02 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                                            </motion.div>
                                            {msg.role === 'user' && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="mt-1 bg-primary/20 p-1.5 rounded-lg"
                                                >
                                                    <User className="h-3.5 w-3.5 text-primary" />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-start items-start gap-2"
                                    >
                                        <div className="mt-1 bg-primary/10 p-1.5 rounded-lg">
                                            <Bot className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-5 py-4 shadow-sm">
                                            <div className="flex gap-1.5 items-center">
                                                <motion.span
                                                    className="w-2 h-2 bg-primary rounded-full"
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                />
                                                <motion.span
                                                    className="w-2 h-2 bg-primary rounded-full"
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                />
                                                <motion.span
                                                    className="w-2 h-2 bg-primary rounded-full"
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </CardContent>

                            {/* Enhanced Input Area */}
                            <div className="p-5 bg-white border-t border-gray-200/50 backdrop-blur-sm">
                                <div className="relative flex items-center gap-3">
                                    <motion.div
                                        className="flex-1 relative"
                                        whileFocus={{ scale: 1.01 }}
                                    >
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Type your question..."
                                            disabled={isTyping}
                                            className="w-full pl-6 pr-16 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-base placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        {isTyping && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2"
                                            >
                                                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim() || isTyping}
                                        className={`
                                            h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-200
                                            ${!inputValue.trim() || isTyping
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-br from-primary to-[#1e4d3a] text-white shadow-lg hover:shadow-xl'
                                            }
                                        `}
                                    >
                                        <Send className="h-5 w-5" />
                                    </motion.button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enhanced Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    h-18 w-18 md:h-20 md:w-20 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300
                    ${isOpen 
                        ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white rotate-90' 
                        : 'bg-gradient-to-br from-primary to-[#1e4d3a] text-white hover:shadow-primary/50'
                    }
                `}
            >
                <motion.div
                    animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {isOpen ? (
                        <X className="h-7 w-7 md:h-8 md:w-8" />
                    ) : (
                        <motion.div
                            animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <MessageCircle className="h-8 w-8 md:h-9 md:w-9" />
                        </motion.div>
                    )}
                </motion.div>
            </motion.button>
        </div>
    )
}
