"use client"

import { useState, useRef, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, X, Music, Check, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { storage, db } from "@/lib/firebase/firebase-config"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { collection, addDoc } from "firebase/firestore"
import * as musicMetadata from 'music-metadata-browser'

interface AudioFile {
  file: File
  id: string
  name: string
  progress: number
  status: 'idle' | 'uploading' | 'success' | 'error'
  metadata: {
    title: string
    artist: string
    album?: string
    year?: number
    duration: number
    category: string
    isPremium: boolean
    coverImage?: string | null
  }
}

// Default categories - these would ideally come from Firestore
const DEFAULT_CATEGORIES = [
  "Afro Beats",
  "Voice Memos",
  "White Noise"
]

export function AudioUploader() {
  const [files, setFiles] = useState<AudioFile[]>([])
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [newCategory, setNewCategory] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Handle file selection
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles: AudioFile[] = []
    
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i]
      
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an audio file.`,
          variant: "destructive"
        })
        continue
      }
      
      try {
        // Extract metadata from file
        const metadata = await extractMetadata(file)
        
        newFiles.push({
          file,
          id: `file-${Date.now()}-${i}`,
          name: file.name,
          progress: 0,
          status: 'idle',
          metadata
        })
      } catch (error) {
        console.error("Error extracting metadata:", error)
        toast({
          title: "Metadata extraction failed",
          description: `Could not extract metadata from ${file.name}.`,
          variant: "destructive"
        })
      }
    }
    
    setFiles(prev => [...prev, ...newFiles])
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Extract metadata from audio file
  const extractMetadata = async (file: File) => {
    try {
      // Parse metadata using music-metadata-browser
      const parsedMetadata = await musicMetadata.parseBlob(file)
      
      // Get duration in seconds
      const duration = parsedMetadata.format.duration || 0
      
      // Extract basic metadata
      const metadata = {
        title: parsedMetadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
        artist: parsedMetadata.common.artist || "Unknown Artist",
        album: parsedMetadata.common.album,
        year: parsedMetadata.common.year,
        duration: Math.round(duration),
        category: guessCategory(parsedMetadata.common.genre?.[0] || ""),
        isPremium: false,
        coverImage: null as string | null
      }
      
      // Extract cover image if available
      if (parsedMetadata.common.picture && parsedMetadata.common.picture.length > 0) {
        const picture = parsedMetadata.common.picture[0]
        const blob = new Blob([picture.data], { type: picture.format })
        metadata.coverImage = URL.createObjectURL(blob)
      }
      
      return metadata
    } catch (error) {
      console.error("Error parsing metadata:", error)
      
      // Return default metadata if parsing fails
      return {
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Unknown Artist",
        duration: 0,
        category: "Uncategorized",
        isPremium: false,
        coverImage: null
      }
    }
  }

  // Try to match genre to one of our categories
  const guessCategory = (genre: string): string => {
    if (!genre) return "Uncategorized"
    
    // Normalize the genre
    const normalizedGenre = genre.toLowerCase()
    
    // Try to find a matching category
    for (const category of categories) {
      if (normalizedGenre.includes(category.toLowerCase())) {
        return category
      }
    }
    
    // Check for common mappings
    if (normalizedGenre.includes("afro beats")) return "Afro Beats"
    if (normalizedGenre.includes("voice memos")) return "Voice Memos"
    if (normalizedGenre.includes("white noise")) return "White Noise"
    
    return "Uncategorized"
  }

  // Update file metadata
  const updateFileMetadata = (id: string, field: string, value: any) => {
    setFiles(prev => 
      prev.map(file => 
        file.id === id 
          ? { ...file, metadata: { ...file.metadata, [field]: value } } 
          : file
      )
    )
  }

  // Remove file from list
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  // Add a new category
  const addCategory = () => {
    if (!newCategory.trim()) return
    
    if (categories.includes(newCategory)) {
      toast({
        title: "Category exists",
        description: `The category "${newCategory}" already exists.`,
        variant: "destructive"
      })
      return
    }
    
    setCategories(prev => [...prev, newCategory])
    setNewCategory("")
  }

  // Upload files to Firebase
  const uploadFiles = async () => {
    if (files.length === 0) return
    
    setIsUploading(true)
    
    // Track successful uploads
    let successCount = 0
    
    // Process each file
    for (const file of files) {
      try {
        // Update status to uploading
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'uploading' } 
              : f
          )
        )
        
        // 1. Upload the audio file to Firebase Storage
        const audioStoragePath = `audio/tracks/${Date.now()}_${file.file.name}`
        const audioStorageRef = ref(storage, audioStoragePath)
        
        // Create upload task
        const uploadTask = uploadBytesResumable(audioStorageRef, file.file)
        
        // Wait for upload to complete
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Update progress
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
              setFiles(prev => 
                prev.map(f => 
                  f.id === file.id 
                    ? { ...f, progress } 
                    : f
                )
              )
            },
            (error) => {
              console.error("Upload error:", error)
              setFiles(prev => 
                prev.map(f => 
                  f.id === file.id 
                    ? { ...f, status: 'error' } 
                    : f
                )
              )
              reject(error)
            },
            async () => {
              // Upload completed successfully
              resolve()
            }
          )
        })
        
        // Get the download URL
        const audioDownloadURL = await getDownloadURL(audioStorageRef)
        
        // 2. Upload cover image if available
        let coverImageURL = null
        if (file.metadata.coverImage && file.metadata.coverImage.startsWith('blob:')) {
          // Convert blob URL to File
          const response = await fetch(file.metadata.coverImage)
          const blob = await response.blob()
          
          const coverStoragePath = `images/covers/${Date.now()}_${file.metadata.title.replace(/\s+/g, '_')}.jpg`
          const coverStorageRef = ref(storage, coverStoragePath)
          
          // Upload cover image
          await uploadBytesResumable(coverStorageRef, blob)
          
          // Get cover image URL
          coverImageURL = await getDownloadURL(coverStorageRef)
        }
        
        // 3. Save metadata to Firestore
        await addDoc(collection(db, 'tracks'), {
          title: file.metadata.title,
          artist: file.metadata.artist,
          album: file.metadata.album || null,
          year: file.metadata.year || null,
          duration: file.metadata.duration,
          url: audioDownloadURL,
          coverImage: coverImageURL,
          category: file.metadata.category,
          isPremium: file.metadata.isPremium,
          createdAt: new Date()
        })
        
        // Update status to success
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'success' } 
              : f
          )
        )
        
        successCount++
      } catch (error) {
        console.error("Error uploading file:", error)
        
        // Update status to error
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'error' } 
              : f
          )
        )
      }
    }
    
    setIsUploading(false)
    
    // Show toast with results
    toast({
      title: "Upload complete",
      description: `Successfully uploaded ${successCount} of ${files.length} files.`,
      variant: successCount === files.length ? "default" : "destructive"
    })
    
    // Clear successful uploads after a delay
    setTimeout(() => {
      setFiles(prev => prev.filter(file => file.status !== 'success'))
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* File input */}
      <div className="space-y-2">
        <Label htmlFor="audio-files">Select Audio Files</Label>
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            id="audio-files"
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileSelect}
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={uploadFiles} 
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload All
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Category management */}
      <div className="space-y-2">
        <Label>Add New Category</Label>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={addCategory}>
            Add
          </Button>
        </div>
      </div>
      
      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-4 max-h-[500px] overflow-y-auto border rounded-md p-4">
          <h3 className="text-lg font-medium">Files to Upload</h3>
          
          {files.map((file) => (
            <div 
              key={file.id} 
              className="border rounded-md p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'idle' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFile(file.id)}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  {file.status === 'uploading' && (
                    <div className="text-xs text-muted-foreground">
                      {file.progress}%
                    </div>
                  )}
                  {file.status === 'success' && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
              
              {/* Progress bar for uploading files */}
              {file.status === 'uploading' && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}
              
              {/* Metadata form */}
              {file.status === 'idle' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${file.id}`}>Title</Label>
                    <Input
                      id={`title-${file.id}`}
                      value={file.metadata.title}
                      onChange={(e) => updateFileMetadata(file.id, 'title', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`artist-${file.id}`}>Artist</Label>
                    <Input
                      id={`artist-${file.id}`}
                      value={file.metadata.artist}
                      onChange={(e) => updateFileMetadata(file.id, 'artist', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`category-${file.id}`}>Category</Label>
                    <Select
                      value={file.metadata.category}
                      onValueChange={(value) => updateFileMetadata(file.id, 'category', value)}
                    >
                      <SelectTrigger id={`category-${file.id}`}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`duration-${file.id}`}>Duration (seconds)</Label>
                    <Input
                      id={`duration-${file.id}`}
                      type="number"
                      value={file.metadata.duration}
                      onChange={(e) => updateFileMetadata(file.id, 'duration', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`premium-${file.id}`}
                      checked={file.metadata.isPremium}
                      onCheckedChange={(checked) => 
                        updateFileMetadata(file.id, 'isPremium', checked === true)
                      }
                    />
                    <Label htmlFor={`premium-${file.id}`}>Premium Content</Label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
