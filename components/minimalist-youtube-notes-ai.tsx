'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, FileDown, AlertCircle, Upload, List, Link as LinkIcon } from "lucide-react"

export function MinimalistYoutubeNotesAi() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [youtubeLink, setYoutubeLink] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [notes, setNotes] = useState([
    { id: 1, title: 'Introduction to React', date: '2023-05-15' },
    { id: 2, title: 'Advanced JavaScript Concepts', date: '2023-05-20' },
    { id: 3, title: 'Machine Learning Basics', date: '2023-05-25' },
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent, type: 'link' | 'file') => {
    e.preventDefault()
    setIsProcessing(true)
    setResult(null)

    setTimeout(() => {
      setIsProcessing(false)
      setResult({
        success: true,
        message: `Your PDF notes are ready! (${type === 'link' ? 'YouTube Link' : 'Local File'})`
      })
      setNotes([...notes, { id: notes.length + 1, title: `New Notes (${type})`, date: new Date().toISOString().split('T')[0] }])
    }, 3000)
  }

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
    return youtubeRegex.test(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSubmit(e as any, 'file')
    }
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  }

  return (
    <div className="min-h-screen bg-white p-8 font-sans">
      <h1 className="text-4xl font-light mb-12 text-gray-800 text-center">YouTube Notes AI</h1>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center space-x-4 mb-8">
          {['dashboard', 'notes'].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant="ghost"
              className={`text-lg ${activeTab === tab ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-400'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-800">YouTube Link</CardTitle>
                    <CardDescription className="text-gray-500">Generate notes from a YouTube video link</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => handleSubmit(e, 'link')}>
                      <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="youtubeLink" className="text-gray-700">YouTube Video Link</Label>
                          <Input
                            id="youtubeLink"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={youtubeLink}
                            onChange={(e) => setYoutubeLink(e.target.value)}
                            className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          />
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      type="submit"
                      onClick={(e) => handleSubmit(e, 'link')}
                      disabled={!isValidYouTubeUrl(youtubeLink) || isProcessing}
                      className="bg-gray-800 text-white hover:bg-gray-700"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : (
                        <>
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Generate Notes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-800">Local Video File</CardTitle>
                    <CardDescription className="text-gray-500">Generate notes from a downloaded video</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Click to upload a video file</span>
                        </div>
                      </Label>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-800 text-white hover:bg-gray-700"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Video
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            {activeTab === "notes" && (
              <div className="grid gap-4">
                {notes.map((note) => (
                  <Card key={note.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-gray-800">{note.title}</CardTitle>
                      <CardDescription className="text-gray-500">Generated on {note.date}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        <FileDown className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert variant={result.success ? "default" : "destructive"} className="mt-8 bg-gray-50 border border-gray-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-gray-800">{result.success ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription className="text-gray-600">{result.message}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </div>
    </div>
  )
}