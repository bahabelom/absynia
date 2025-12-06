'use client';

import { useAuthContext } from "@/lib/firebase/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { loading, isAuthenticated } = useAuthContext()
  const router = useRouter()

  // Redirect all users based on auth status
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [loading, isAuthenticated, router])

  // Show loading state
  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900 items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
