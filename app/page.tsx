import Link from "next/link"
import { Sidebar } from "@/components/Sidebar"
import { StatsCard } from "@/components/StatsCard"
import { StudyActivityChart } from "@/components/StudyActivityChart"
import { SubjectProgressChart } from "@/components/SubjectProgressChart"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, Abebe!</h1>
            <p className="text-teal-600 font-medium">Here's a summary of your learning journey.</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="border-teal-400 text-gray-900 whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm">
                Progress Overview
              </button>
              <button className="border-transparent text-teal-600 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Saved Textbooks
              </button>
              <button className="border-transparent text-teal-600 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Study History
              </button>
            </nav>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <StatsCard
              title="Chapters Completed"
              value="42"
              change="+12% this month"
              changeType="positive"
            />
            <StatsCard
              title="Total Hours Studied"
              value="128"
              change="+8% this month"
              changeType="positive"
            />
            <StatsCard
              title="Active Streak"
              value="14 Days"
              change="+2 days"
              changeType="positive"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <StudyActivityChart />
            <SubjectProgressChart />
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Quick Links</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Link href="/dashboard" className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Full Dashboard</h3>
                <p className="text-gray-600">Access the detailed dashboard view with recent uploads and stats.</p>
              </Link>
              <Link href="/profile" className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">My Profile</h3>
                <p className="text-gray-600">View and edit your personal information and settings.</p>
              </Link>
              <Link href="/upload" className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Textbook</h3>
                <p className="text-gray-600">Upload new study materials and textbooks to your library.</p>
              </Link>
              <Link href="/study/1" className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Resume Study</h3>
                <p className="text-gray-600">Continue studying "Introduction to Economics".</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
