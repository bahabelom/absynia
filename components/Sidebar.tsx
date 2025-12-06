'use client';

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, BookOpen, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useAuthContext } from "@/lib/firebase/AuthProvider"
import { signOut } from "@/lib/firebase/auth"

export function Sidebar() {
    const router = useRouter()
    const { user, userProfile, loading } = useAuthContext()

    const handleLogout = async () => {
        try {
            await signOut()
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    if (loading) {
        return (
            <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col h-screen sticky top-0">
                <div className="p-6 flex flex-col items-center border-b border-gray-50">
                    <div className="h-24 w-24 rounded-full bg-gray-100 mb-4 animate-pulse" />
                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mb-2" />
                    <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
                </div>
            </aside>
        )
    }

    const displayName = userProfile?.displayName || user?.displayName || 'User'
    const email = user?.email || ''

    return (
        <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-6 flex flex-col items-center border-b border-gray-50">
                <div className="h-24 w-24 rounded-full bg-orange-100 mb-4 overflow-hidden relative">
                    {/* Placeholder for Avatar */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <User className="h-12 w-12 text-orange-300" />
                    </div>
                    {/* In a real app, use Image component */}
                    {/* {user?.photoURL && <Image src={user.photoURL} alt={displayName} fill className="object-cover" />} */}
                </div>
                <h2 className="text-lg font-bold text-gray-900">{displayName}</h2>
                <p className="text-sm text-primary">{email}</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-medium">
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        Dashboard
                    </Button>
                </Link>
                <Link href="/dashboard/textbooks">
                    <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                        <BookOpen className="mr-3 h-5 w-5" />
                        My Textbooks
                    </Button>
                </Link>
                <Link href="/dashboard/study-history">
                    <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                        <BookOpen className="mr-3 h-5 w-5" />
                        Study History
                    </Button>
                </Link>
                
            </nav>

            <div className="p-4 space-y-2 border-t border-gray-50">
                <Link href="/profile">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white mb-6">
                        Edit Profile
                    </Button>
                </Link>

                <Link href="/settings">
                    <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                        <Settings className="mr-3 h-5 w-5" />
                        Settings
                    </Button>
                </Link>
                <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Log Out
                </Button>
            </div>
        </aside>
    )
}
