"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/ui/Navbar"
import { Footer } from "@/components/ui/Footer"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Upload, FileText, CheckCircle, Loader2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function UploadPage() {
    const router = useRouter()
    const [isDragging, setIsDragging] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete'>('idle')
    const [progress, setProgress] = useState(0)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const startUpload = () => {
        if (!file) return
        setUploadStatus('uploading')

        // Simulate upload
        let p = 0
        const interval = setInterval(() => {
            p += 5
            setProgress(p)
            if (p >= 100) {
                clearInterval(interval)
                setUploadStatus('processing')
                startProcessing()
            }
        }, 100)
    }

    const startProcessing = () => {
        // Simulate AI processing
        setTimeout(() => {
            setUploadStatus('complete')
        }, 3000)
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-foreground">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12 md:px-6 flex flex-col items-center justify-center min-h-[80vh]">
                <div className="w-full max-w-2xl space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Upload your Textbook</h1>
                        <p className="text-gray-500">
                            We support PDF and DOCX files up to 50MB.
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {uploadStatus === 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                key="idle"
                            >
                                <Card
                                    className={`border-2 border-dashed transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-gray-200"
                                        }`}
                                >
                                    <CardContent
                                        className="flex flex-col items-center justify-center py-16 text-center"
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        {!file ? (
                                            <>
                                                <div className="mb-4 rounded-full bg-gray-100 p-4">
                                                    <Upload className="h-8 w-8 text-gray-500" />
                                                </div>
                                                <h3 className="mb-2 text-lg font-semibold">Drag & Drop your file here</h3>
                                                <p className="mb-6 text-sm text-gray-500">or click to browse from your computer</p>
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    className="hidden"
                                                    accept=".pdf,.docx"
                                                    onChange={handleFileChange}
                                                />
                                                <Button onClick={() => document.getElementById('file-upload')?.click()}>
                                                    Select File
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="w-full max-w-md">
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 bg-red-100 rounded flex items-center justify-center text-red-500">
                                                            <FileText className="h-6 w-6" />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                                                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <Button className="w-full mt-6" onClick={startUpload}>
                                                    Start Processing
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                key="processing"
                                className="text-center space-y-8"
                            >
                                <div className="relative mx-auto h-32 w-32">
                                    <svg className="h-full w-full" viewBox="0 0 100 100">
                                        <circle
                                            className="text-gray-200 stroke-current"
                                            strokeWidth="8"
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="transparent"
                                        />
                                        <circle
                                            className="text-primary stroke-current transition-all duration-300 ease-in-out"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="transparent"
                                            strokeDasharray="251.2"
                                            strokeDashoffset={251.2 - (251.2 * progress) / 100}
                                            transform="rotate(-90 50 50)"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {uploadStatus === 'uploading' ? (
                                            <span className="text-xl font-bold">{progress}%</span>
                                        ) : (
                                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">
                                        {uploadStatus === 'uploading' ? 'Uploading Textbook...' : 'Analyzing Content with Vertex AI...'}
                                    </h3>
                                    <p className="text-gray-500">
                                        {uploadStatus === 'uploading'
                                            ? 'Please wait while we upload your file.'
                                            : 'Generating summaries, flashcards, and quizzes.'}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {uploadStatus === 'complete' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key="complete"
                                className="text-center space-y-6"
                            >
                                <div className="mx-auto h-24 w-24 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle className="h-12 w-12" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">Processing Complete!</h3>
                                    <p className="text-gray-500">Your textbook is ready for study.</p>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <Link href="/dashboard">
                                        <Button variant="outline">Back to Dashboard</Button>
                                    </Link>
                                    <Link href="/study/1">
                                        <Button>Start Studying</Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    )
}
