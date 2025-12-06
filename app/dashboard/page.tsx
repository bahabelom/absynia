'use client';

import { useAuthContext } from "@/lib/firebase/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/ui/Navbar"
import { Footer } from "@/components/ui/Footer"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Plus, FileText, Clock, MoreVertical, BookOpen, BrainCircuit, GraduationCap, Star, Quote } from "lucide-react"

export default function Dashboard() {
    const { user, userProfile, loading, isAuthenticated } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login?callbackUrl=/dashboard')
        }
    }, [loading, isAuthenticated, router])

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-foreground items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    const userName = userProfile?.displayName || user?.displayName || 'User'

    // Mock data for recent uploads
    const recentUploads = [
        { id: 1, title: "Introduction to Economics", date: "2 hours ago", pages: 142, progress: 15 },
        { id: 2, title: "Ethiopian History: Grade 12", date: "Yesterday", pages: 89, progress: 45 },
        { id: 3, title: "Physics 101: Mechanics", date: "3 days ago", pages: 210, progress: 0 },
    ]

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-foreground">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8 md:px-6 md:py-12">
                <div className="flex flex-col gap-8">
                    {/* Header Section */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userName.split(' ')[0]}</h1>
                            <p className="text-gray-500">
                                Ready to continue learning? Here's what's happening.
                            </p>
                        </div>
                        <Link href="/upload">
                            <Button className="w-full md:w-auto">
                                <Plus className="mr-2 h-4 w-4" />
                                Upload New Textbook
                            </Button>
                        </Link>
                    </div>

                    {/* Quick Stats / Overview */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-accent-green/10 flex items-center justify-center text-accent-green">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Books Uploaded</p>
                                    <h3 className="text-2xl font-bold">12</h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-accent-yellow/10 flex items-center justify-center text-accent-yellow">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Study Hours</p>
                                    <h3 className="text-2xl font-bold">24.5</h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Quizzes Passed</p>
                                    <h3 className="text-2xl font-bold">8</h3>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Uploads */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Recent Textbooks</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {recentUploads.map((upload) => (
                                <Card key={upload.id} className="overflow-hidden transition-all hover:shadow-md group">
                                    <div className="aspect-[4/3] w-full bg-gray-100 relative flex items-center justify-center overflow-hidden">
                                        {/* Placeholder for PDF Thumbnail */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                            <Link href={`/study/${upload.id}`} className="w-full">
                                                <Button variant="secondary" className="w-full bg-white/90 hover:bg-white text-black border-none">
                                                    Continue Studying
                                                </Button>
                                            </Link>
                                        </div>
                                        <FileText className="h-16 w-16 text-gray-300" />
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <h3 className="font-semibold line-clamp-1" title={upload.title}>{upload.title}</h3>
                                                <p className="text-xs text-gray-500">{upload.pages} pages • {upload.date}</p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>Progress</span>
                                                <span>{upload.progress}%</span>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full bg-gray-100">
                                                <div
                                                    className="h-full rounded-full bg-primary transition-all"
                                                    style={{ width: `${upload.progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
                                            <Link href={`/study/${upload.id}?tab=summary`} className="flex-1">
                                                <Button variant="ghost" size="sm" className="w-full text-xs h-8 gap-1">
                                                    <FileText className="h-3 w-3" /> Summary
                                                </Button>
                                            </Link>
                                            <Link href={`/study/${upload.id}?tab=quiz`} className="flex-1">
                                                <Button variant="ghost" size="sm" className="w-full text-xs h-8 gap-1">
                                                    <GraduationCap className="h-3 w-3" /> Quiz
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Upload New Card */}
                            <Link href="/upload">
                                <Card className="flex h-full min-h-[300px] flex-col items-center justify-center border-dashed border-2 border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-primary/50 transition-colors">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm mb-4">
                                        <Plus className="h-6 w-6 text-primary" />
                                    </div>
                                    <p className="font-medium text-gray-900">Upload New Textbook</p>
                                    <p className="text-sm text-gray-500">PDF, DOCX supported</p>
                                </Card>
                            </Link>
                        </div>
                    </div>

                    {/* Success Stories Section */}
                    <section className="py-12 space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                See how students are improving their grades with AI Mentor
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="p-6">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <Quote className="h-8 w-8 text-teal-600 mb-4" />
                                <p className="text-gray-700 mb-4 italic">
                                    "AI Mentor helped me understand complex economics concepts that I struggled with for months. My grades improved from C+ to A- in just one semester!"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                                        <span className="text-teal-600 font-bold">AM</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Alemayehu M.</p>
                                        <p className="text-sm text-gray-500">Grade 12 Student, Addis Ababa</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <Quote className="h-8 w-8 text-teal-600 mb-4" />
                                <p className="text-gray-700 mb-4 italic">
                                    "The AI tutor is available 24/7 and explains everything in a way that makes sense. I've saved so much time and my understanding of physics has dramatically improved."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                                        <span className="text-teal-600 font-bold">SM</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Sara M.</p>
                                        <p className="text-sm text-gray-500">University Student, Hawassa</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <Quote className="h-8 w-8 text-teal-600 mb-4" />
                                <p className="text-gray-700 mb-4 italic">
                                    "I love how I can upload my textbooks and ask questions anytime. The progress tracking keeps me motivated. Best study tool I've ever used!"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                                        <span className="text-teal-600 font-bold">DT</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Daniel T.</p>
                                        <p className="text-sm text-gray-500">Grade 11 Student, Bahir Dar</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
