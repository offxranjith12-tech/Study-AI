'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, File, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function MaterialsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStatus('idle')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setStatus('idle')
    setMessage('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setStatus('success')
        setMessage('Material uploaded and analyzed successfully! You can now ask the AI Tutor about it.')
        setFile(null)
      } else {
        const data = await res.json()
        setStatus('error')
        setMessage(data.error || 'Failed to process document.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('A network error occurred.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Study Materials</h1>
        <p className="text-muted-foreground mt-2">Upload your PDFs, lecture notes, or textbooks to make them searchable by the AI.</p>
      </div>

      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Upload New Material</CardTitle>
          <CardDescription>Supported formats: PDF (Max 10MB)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center space-y-4 hover:bg-muted/50 transition-colors">
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">PDF documents only</p>
            </div>
            <input 
              type="file" 
              accept="application/pdf" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>

          {file && (
            <div className="flex items-center p-3 bg-muted rounded-md">
              <File className="h-5 w-5 text-primary mr-3" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button size="sm" onClick={handleUpload} disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Upload & Analyze'
                )}
              </Button>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center p-3 bg-green-500/10 text-green-600 rounded-md text-sm">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {message}
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              {message}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Existing Materials List (Placeholder for now) */}
      <div className="pt-8 border-t mt-8">
        <h3 className="text-xl font-bold mb-4">Your Uploaded Materials</h3>
        <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed">
          <p className="text-muted-foreground text-sm">No materials uploaded yet. Upload a PDF to get started.</p>
        </div>
      </div>
    </div>
  )
}
