import Link from "next/link"
import { Navbar } from "@/components/ui/Navbar"
import { Footer } from "@/components/ui/Footer"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { User, Settings, BookOpen, Clock, Award, TrendingUp, Calendar } from "lucide-react"

export default function ProfilePage() {
    const user = {
        name: "Abebe Kebede",
        email: "abebe.kebede@example.com",
        university: "Addis Ababa University",
        major: "Economics",
        joinDate: "September 2024",
        avatar: null
    }

    const stats = [
        { label: "Books Studied", value: "12", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-100" },
        { label: "Study Hours", value: "48", icon: Clock, color: "text-accent-yellow", bg: "bg-accent-yellow/10" },
        { label: "Quizzes Passed", value: "8", icon: Award, color: "text-accent-green", bg: "bg-accent-green/10" },
        { label: "Avg. Score", value: "85%", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
    ]

    const history = [
        { id: 1, title: "Introduction to Economics", action: "Completed Quiz", date: "2 hours ago", score: "90%" },
        { id: 2, title: "Ethiopian History: Grade 12", action: "Read Summary", date: "Yesterday", score: null },
        { id: 3, title: "Physics 101: Mechanics", action: "Created Flashcards", date: "3 days ago", score: null },
        { id: 4, title: "Introduction to Economics", action: "Started Reading", date: "1 week ago", score: null },
    ]

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-foreground">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12 md:px-6">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-sm">
                            <User className="h-12 w-12 md:h-16 md:w-16 text-gray-400" />
                        </div>
                        <div className="text-center md:text-left space-y-2 flex-1">
                            <h1 className="text-3xl font-bold">{user.name}</h1>
                            <p className="text-gray-500">{user.major} Student at {user.university}</p>
                            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined {user.joinDate}</span>
                                <span>•</span>
                                <span>{user.email}</span>
                            </div>
                        </div>
                        <Button variant="outline">
                            <Settings className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, idx) => (
                            <Card key={idx}>
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                                    <div className={`h-10 w-10 rounded-full ${stat.bg} flex items-center justify-center ${stat.color}`}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {history.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                        <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                                        <div className="flex-1 space-y-1">
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-gray-500">{item.action} • {item.date}</p>
                                        </div>
                                        {item.score && (
                                            <div className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">
                                                {item.score}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </main>

            <Footer />
        </div>
    )
}
