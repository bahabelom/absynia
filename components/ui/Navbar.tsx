'use client';

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { BookOpen } from "lucide-react"
import { useAuthContext } from "@/lib/firebase/AuthProvider"
import { signOut } from "@/lib/firebase/auth"

export function Navbar() {
    const router = useRouter()
    const { user, loading, isAuthenticated } = useAuthContext()

    const handleLogout = async () => {
        try {
            await signOut()
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
                    <BookOpen className="h-6 w-6" />
                    <span className="text-lg tracking-tight">AI Mentor Ethiopia</span>
                </Link>
                <nav className="hidden gap-6 md:flex">
                    <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-primary">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary">
                        How it Works
                    </Link>
                    <Link href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-primary">
                        Success Stories
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    {loading ? (
                        <div className="h-8 w-20 bg-gray-100 rounded animate-pulse" />
                    ) : isAuthenticated ? (
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                                    Dashboard
                                </Button>
                            </Link>
                            <Button size="sm" onClick={handleLogout}>
                                Log out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
