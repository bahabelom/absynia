"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/ui/Navbar"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { FileText, BrainCircuit, BookOpen, GraduationCap, ChevronLeft, ChevronRight, Check, RotateCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AIChatWidget } from "@/components/AIChatWidget"

export default function StudyPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const initialTab = searchParams.get('tab') || 'summary'
    const [activeTab, setActiveTab] = useState(initialTab)
    const [currentFlashcard, setCurrentFlashcard] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
    const [quizSubmitted, setQuizSubmitted] = useState(false)

    // Mock Data
    const summaryContent = `
    # Introduction to Economics
    
    ## 1. The Economic Problem
    Economics is the study of how people use scarce resources to satisfy unlimited wants. The fundamental economic problem is scarcity. Resources are limited, but human wants are unlimited.
    
    ### Key Concepts:
    - **Scarcity**: The basic economic problem that arises because people have unlimited wants but resources are limited.
    - **Opportunity Cost**: The cost of the next best alternative foregone when a choice is made.
    - **Factors of Production**: Land, Labor, Capital, and Entrepreneurship.
    
    ## 2. Supply and Demand
    The law of demand states that, all else being equal, as the price of a good increases, quantity demanded decreases. Conversely, as the price of a good decreases, quantity demanded increases.
    
    The law of supply states that, all else being equal, as the price of a good increases, quantity supplied increases.
  `

    const explanations = [
        {
            title: "Opportunity Cost Explained",
            content: "Imagine you have 100 Birr. You can either buy a movie ticket or buy lunch. If you choose the movie, the opportunity cost is the lunch you didn't eat. It's the value of the 'next best thing' you gave up.",
            example: "Example: A farmer in Oromia can plant either Teff or Wheat on his land. If he plants Teff, the opportunity cost is the Wheat he could have grown."
        },
        {
            title: "Scarcity in Daily Life",
            content: "Scarcity doesn't just mean 'rare'. It means there isn't enough for everyone to have everything they want for free. Even water is scarce because it requires resources to clean and transport it.",
            example: "Example: There are limited seats on the Light Rail Transit (LRT) during rush hour. The seats are scarce resources."
        }
    ]

    const flashcards = [
        { front: "What is Scarcity?", back: "The fundamental economic problem of having seemingly unlimited human wants in a world of limited resources." },
        { front: "Define Opportunity Cost", back: "The value of the next-best alternative that is forgone when a choice is made." },
        { front: "Law of Demand", back: "As price increases, quantity demanded decreases (ceteris paribus)." },
        { front: "Factors of Production", back: "Land, Labor, Capital, Entrepreneurship" }
    ]

    const quizQuestions = [
        {
            id: 1,
            question: "What is the fundamental economic problem?",
            options: ["Inflation", "Unemployment", "Scarcity", "Taxes"],
            correct: 2
        },
        {
            id: 2,
            question: "Which of the following is NOT a factor of production?",
            options: ["Money", "Land", "Labor", "Capital"],
            correct: 0
        },
        {
            id: 3,
            question: "If the price of Teff rises, what happens to the quantity demanded?",
            options: ["It increases", "It decreases", "It stays the same", "It becomes zero"],
            correct: 1
        }
    ]

    const handleNextCard = () => {
        setIsFlipped(false)
        setTimeout(() => {
            setCurrentFlashcard((prev) => (prev + 1) % flashcards.length)
        }, 200)
    }

    const handlePrevCard = () => {
        setIsFlipped(false)
        setTimeout(() => {
            setCurrentFlashcard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
        }, 200)
    }

    const handleQuizSelect = (qId: number, optionIdx: number) => {
        if (quizSubmitted) return
        setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }))
    }

    const calculateScore = () => {
        let score = 0
        quizQuestions.forEach(q => {
            if (quizAnswers[q.id] === q.correct) score++
        })
        return score
    }

    return (
        <div className="flex h-screen flex-col bg-gray-50 font-sans text-foreground overflow-hidden">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="w-64 border-r border-gray-200 bg-white hidden md:flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="font-semibold truncate">Intro to Economics</h2>
                        <p className="text-xs text-gray-500">Chapter 1</p>
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                        <Button
                            variant={activeTab === 'summary' ? 'primary' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => setActiveTab('summary')}
                        >
                            <FileText className="mr-2 h-4 w-4" /> Summary
                        </Button>
                        <Button
                            variant={activeTab === 'explanation' ? 'primary' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => setActiveTab('explanation')}
                        >
                            <BrainCircuit className="mr-2 h-4 w-4" /> Explanations
                        </Button>
                        <Button
                            variant={activeTab === 'flashcards' ? 'primary' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => setActiveTab('flashcards')}
                        >
                            <BookOpen className="mr-2 h-4 w-4" /> Flashcards
                        </Button>
                        <Button
                            variant={activeTab === 'quiz' ? 'primary' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => setActiveTab('quiz')}
                        >
                            <GraduationCap className="mr-2 h-4 w-4" /> Mock Exam
                        </Button>
                    </nav>
                    <div className="p-4 border-t border-gray-100">
                        <Link href="/dashboard">
                            <Button variant="outline" className="w-full">
                                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </aside>

                {/* Mobile Nav (Top) - Visible only on small screens */}
                <div className="md:hidden w-full fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-around p-2">
                    <Button variant="ghost" size="sm" className={`flex-col h-auto py-1 gap-1 ${activeTab === 'summary' ? 'text-primary' : ''}`} onClick={() => setActiveTab('summary')}>
                        <FileText className="h-5 w-5" /> <span className="text-[10px]">Summary</span>
                    </Button>
                    <Button variant="ghost" size="sm" className={`flex-col h-auto py-1 gap-1 ${activeTab === 'explanation' ? 'text-primary' : ''}`} onClick={() => setActiveTab('explanation')}>
                        <BrainCircuit className="h-5 w-5" /> <span className="text-[10px]">Explain</span>
                    </Button>
                    <Button variant="ghost" size="sm" className={`flex-col h-auto py-1 gap-1 ${activeTab === 'flashcards' ? 'text-primary' : ''}`} onClick={() => setActiveTab('flashcards')}>
                        <BookOpen className="h-5 w-5" /> <span className="text-[10px]">Cards</span>
                    </Button>
                    <Button variant="ghost" size="sm" className={`flex-col h-auto py-1 gap-1 ${activeTab === 'quiz' ? 'text-primary' : ''}`} onClick={() => setActiveTab('quiz')}>
                        <GraduationCap className="h-5 w-5" /> <span className="text-[10px]">Quiz</span>
                    </Button>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8 bg-gray-50">
                    <div className="max-w-3xl mx-auto">

                        {/* Summary Tab */}
                        {activeTab === 'summary' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Chapter Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="prose max-w-none">
                                        <div className="whitespace-pre-line leading-relaxed">
                                            {summaryContent.split('\n').map((line, i) => {
                                                if (line.trim().startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-6 mb-4">{line.replace('# ', '')}</h1>
                                                if (line.trim().startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>
                                                if (line.trim().startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.replace('### ', '')}</h3>
                                                if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.replace('- ', '')}</li>
                                                return <p key={i} className="mb-2">{line}</p>
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Explanation Tab */}
                        {activeTab === 'explanation' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">Deep Dive Explanations</h2>
                                </div>
                                {explanations.map((exp, idx) => (
                                    <Card key={idx}>
                                        <CardHeader>
                                            <CardTitle className="text-primary">{exp.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-gray-700">{exp.content}</p>
                                            <div className="bg-accent-yellow/10 p-4 rounded-lg border border-accent-yellow/20">
                                                <p className="text-sm font-medium text-yellow-800">
                                                    <span className="font-bold">💡 Local Context:</span> {exp.example}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </motion.div>
                        )}

                        {/* Flashcards Tab */}
                        {activeTab === 'flashcards' && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="flex flex-col items-center justify-center h-[60vh]">
                                <div className="w-full max-w-md perspective-1000">
                                    <div
                                        className="relative h-64 w-full cursor-pointer transition-transform duration-500 transform-style-3d"
                                        onClick={() => setIsFlipped(!isFlipped)}
                                        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}
                                    >
                                        {/* Front */}
                                        <Card className="absolute inset-0 flex items-center justify-center backface-hidden border-2 border-primary/10 shadow-lg">
                                            <CardContent className="text-center p-8">
                                                <p className="text-sm text-gray-400 uppercase tracking-widest mb-4">Question</p>
                                                <h3 className="text-2xl font-bold">{flashcards[currentFlashcard].front}</h3>
                                                <p className="text-xs text-gray-400 mt-8">Tap to flip</p>
                                            </CardContent>
                                        </Card>

                                        {/* Back */}
                                        <Card className="absolute inset-0 flex items-center justify-center backface-hidden border-2 border-accent-green/20 bg-accent-green/5 shadow-lg" style={{ transform: 'rotateY(180deg)' }}>
                                            <CardContent className="text-center p-8">
                                                <p className="text-sm text-accent-green uppercase tracking-widest mb-4">Answer</p>
                                                <h3 className="text-xl font-medium">{flashcards[currentFlashcard].back}</h3>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 mt-8">
                                    <Button variant="outline" size="lg" onClick={handlePrevCard}>
                                        <ChevronLeft className="mr-2 h-4 w-4" /> Prev
                                    </Button>
                                    <span className="text-sm font-medium text-gray-500">
                                        {currentFlashcard + 1} / {flashcards.length}
                                    </span>
                                    <Button variant="outline" size="lg" onClick={handleNextCard}>
                                        Next <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Mock Exam Tab */}
                        {activeTab === 'quiz' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">Chapter Quiz</h2>
                                    {!quizSubmitted && (
                                        <span className="text-sm text-gray-500">3 Questions</span>
                                    )}
                                    {quizSubmitted && (
                                        <span className="text-lg font-bold text-primary">Score: {calculateScore()} / {quizQuestions.length}</span>
                                    )}
                                </div>

                                {quizQuestions.map((q) => (
                                    <Card key={q.id} className={quizSubmitted ? (quizAnswers[q.id] === q.correct ? "border-green-500 bg-green-50/50" : "border-red-500 bg-red-50/50") : ""}>
                                        <CardHeader>
                                            <CardTitle className="text-lg">{q.id}. {q.question}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {q.options.map((opt, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => handleQuizSelect(q.id, idx)}
                                                    className={`
                            flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                            ${quizAnswers[q.id] === idx ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:bg-gray-50'}
                            ${quizSubmitted && idx === q.correct ? 'bg-green-100 border-green-500' : ''}
                            ${quizSubmitted && quizAnswers[q.id] === idx && idx !== q.correct ? 'bg-red-100 border-red-500' : ''}
                          `}
                                                >
                                                    <div className={`
                            h-5 w-5 rounded-full border flex items-center justify-center mr-3
                            ${quizAnswers[q.id] === idx ? 'border-primary bg-primary text-white' : 'border-gray-300'}
                          `}>
                                                        {quizAnswers[q.id] === idx && <div className="h-2 w-2 rounded-full bg-white" />}
                                                    </div>
                                                    <span>{opt}</span>
                                                    {quizSubmitted && idx === q.correct && <Check className="ml-auto h-4 w-4 text-green-600" />}
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))}

                                {!quizSubmitted ? (
                                    <Button className="w-full" size="lg" onClick={() => setQuizSubmitted(true)} disabled={Object.keys(quizAnswers).length < quizQuestions.length}>
                                        Submit Exam
                                    </Button>
                                ) : (
                                    <Button className="w-full" variant="outline" size="lg" onClick={() => {
                                        setQuizSubmitted(false)
                                        setQuizAnswers({})
                                    }}>
                                        <RotateCw className="mr-2 h-4 w-4" /> Retake Exam
                                    </Button>
                                )}
                            </motion.div>
                        )}

                    </div>
                </main>
            </div>
            <AIChatWidget />
        </div>
    )
}
