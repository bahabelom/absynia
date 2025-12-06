import Link from "next/link"
import { LayoutDashboard, BookOpen, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-6 flex flex-col items-center border-b border-gray-50">
                <div className="h-24 w-24 rounded-full bg-orange-100 mb-4 overflow-hidden relative">
                    {/* Placeholder for Avatar */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <User className="h-12 w-12 text-orange-300" />
                    </div>
                    {/* In a real app, use Image component */}
                    {/* <Image src="/avatar.png" alt="Abebe Bikila" fill className="object-cover" /> */}
                </div>
                <h2 className="text-lg font-bold text-gray-900">Abebe Bikila</h2>
                <p className="text-sm text-primary">abebe.b@aastu.edu.et</p>
                <p className="text-xs text-gray-500 mt-1">Addis Ababa University</p>
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
                <Link href="/profile/edit">
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
                <Link href="/logout">
                    <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                        <LogOut className="mr-3 h-5 w-5" />
                        Log Out
                    </Button>
                </Link>
            </div>
        </aside>
    )
}
