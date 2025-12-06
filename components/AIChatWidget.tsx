"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { MessageCircle, X, Send, Bot, User, Globe, Sparkles, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
    id: string
    role: 'user' | 'assistant'
    text: string
}

type Language = {
    code: string
    name: string
    flag: string
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

export function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', text: getInitialGreeting('en') }
    ])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const languageDropdownRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    // Close language dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
                setIsLanguageDropdownOpen(false)
            }
        }

        if (isLanguageDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isLanguageDropdownOpen])

    // Update greeting when language changes
    useEffect(() => {
        if (messages.length === 1 && messages[0].role === 'assistant') {
            setMessages([{
                id: '1',
                role: 'assistant',
                text: getInitialGreeting(selectedLanguage.code)
            }])
        }
    }, [selectedLanguage])

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: inputValue
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
                text: data.aiReply
            }

            setMessages(prev => [...prev, newAiMessage])
        } catch (error) {
            console.error('Error fetching AI response:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                text: 'Sorry, I encountered an error. Please try again later.'
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
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-80 md:w-96 shadow-2xl"
                    >
                        <Card className="border-primary/20 overflow-hidden flex flex-col h-[500px]">
                            <CardHeader className="bg-primary text-white p-4 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white/20 p-1.5 rounded-full">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">AI Mentor</CardTitle>
                                        <p className="text-xs text-primary-foreground/80">Always here to help</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Language Selector */}
                                    <div className="relative" ref={languageDropdownRef}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-white hover:bg-white/20 h-8 px-2"
                                            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                        >
                                            <Globe className="h-4 w-4 mr-1" />
                                            <span className="text-xs">{selectedLanguage.flag}</span>
                                        </Button>
                                        
                                        <AnimatePresence>
                                            {isLanguageDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                                                >
                                                    <div className="max-h-64 overflow-y-auto">
                                                        {languages.map((lang) => (
                                                            <button
                                                                key={lang.code}
                                                                onClick={() => handleLanguageChange(lang)}
                                                                className={`
                                                                    w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors
                                                                    flex items-center gap-2
                                                                    ${selectedLanguage.code === lang.code ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700'}
                                                                `}
                                                            >
                                                                <span className="text-lg">{lang.flag}</span>
                                                                <span>{lang.name}</span>
                                                                {selectedLanguage.code === lang.code && (
                                                                    <span className="ml-auto text-primary">✓</span>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-white hover:bg-white/20 h-8 w-8 p-0"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`
                        max-w-[80%] rounded-2xl px-4 py-3 text-sm
                        ${msg.role === 'user'
                                                    ? 'bg-primary text-white rounded-br-none'
                                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                                }
                      `}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </CardContent>

                            <div className="p-3 bg-white border-t border-gray-100">
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask a question..."
                                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                                    />
                                    <Button
                                        size="sm"
                                        className="absolute right-1.5 h-8 w-8 rounded-full p-0"
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim() || isTyping}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`
          h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-colors
          ${isOpen ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-primary text-white hover:bg-primary/90'}
        `}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
            </motion.button>
        </div>
    )
}
