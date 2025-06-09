"use client"

import { useState, useRef, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, X, Music, Check, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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
    coverImageBlob?: Blob | null
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
        coverImage: null as string | null,
        coverImageBlob: null as Blob | null
      }
      
      // Extract cover image if available
      if (parsedMetadata.common.picture && parsedMetadata.common.picture.length > 0) {
        const picture = parsedMetadata.common.picture[0]
        const blob = new Blob([picture.data], { type: picture.format })
        metadata.coverImageBlob = blob;
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
  const updateFileMetadata = (id: string, field: string, value: string | number | boolean) => {
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
      // Create a variable for the progress interval that's accessible in the try/catch blocks
      let progressInterval: NodeJS.Timeout | null = null;
      
      try {
        // Update status to uploading
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'uploading', progress: 0 } 
              : f
          )
        )
        
        // Set up progress tracking
        const updateProgress = (progress: number) => {
          setFiles(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, progress } 
                : f
            )
          );
        };
        
        // Simulate upload progress since we can't get real-time progress from the server
        // Use a faster, more responsive progress simulation
        progressInterval = setInterval(() => {
          setFiles(prev => {
            const currentFile = prev.find(f => f.id === file.id);
            if (currentFile && currentFile.status === 'uploading') {
              // Faster progress simulation with dynamic increments
              // This ensures the progress bar moves more quickly
              let increment = 10; // Default fast increment
              
              if (currentFile.progress < 50) {
                increment = 15; // Very fast at the beginning
              } else if (currentFile.progress < 80) {
                increment = 8; // Medium speed in the middle
              } else if (currentFile.progress < 98) {
                increment = 3; // Slower near the end
              }
              
              // Allow progress to go up to 98% during simulation
              // The final 100% will be set when the upload actually completes
              return prev.map(f => 
                f.id === file.id 
                  ? { ...f, progress: Math.min(98, f.progress + increment) } 
                  : f
              );
            }
            return prev;
          });
        }, 300); // Faster interval for more responsive UI
        
        // 1. Upload the audio file to Cloudinary using our server-side API
        const audioFormData = new FormData();
        audioFormData.append('file', file.file);
        audioFormData.append('folder', 'tracks');
        audioFormData.append('resourceType', 'video');
        audioFormData.append('tags', 'music_track');
        
        // Add metadata to the form data
        audioFormData.append('title', file.metadata.title);
        audioFormData.append('artist', file.metadata.artist);
        audioFormData.append('category', file.metadata.category);
        audioFormData.append('isPremium', file.metadata.isPremium ? 'true' : 'false');
        
        console.log('Uploading file with metadata:', {
          title: file.metadata.title,
          artist: file.metadata.artist,
          category: file.metadata.category,
          isPremium: file.metadata.isPremium
        });
        
        // Use our server-side API route for the upload
        const audioRes = await fetch('/api/cloudinary/upload', {
          method: 'POST',
          body: audioFormData,
        });
        const audioData = await audioRes.json();
        if (!audioData.secure_url) throw new Error(audioData.error?.message || 'Audio upload failed');
        const audioDownloadURL = audioData.secure_url;
        
        // 2. Upload cover image if available
        let coverImageURL = null;
        if (file.metadata.coverImageBlob) {
          const coverFormData = new FormData();
          coverFormData.append('file', file.metadata.coverImageBlob, `${file.metadata.title.replace(/\s+/g, '_')}.jpg`);
          coverFormData.append('folder', 'covers');
          coverFormData.append('resourceType', 'image');
          coverFormData.append('tags', 'cover_image');
          
          // Use our server-side API route for the cover image upload
          const coverRes = await fetch('/api/cloudinary/upload', {
            method: 'POST',
            body: coverFormData,
          });
          const coverData = await coverRes.json();
          if (!coverData.secure_url) throw new Error(coverData.error?.message || 'Cover upload failed');
          coverImageURL = coverData.secure_url;
        }

        // 3. Save metadata to your DB if needed
        // Clear the progress interval
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
        
        // Set progress to 100% and status to success
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'success', progress: 100 } : f));
        successCount++;
      } catch (error) {
        console.error("Error uploading file:", error);
        // Clear the progress interval
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'error' } : f));
      }
    }
    setIsUploading(false);
    toast({
      title: "Upload complete",
      description: `Successfully uploaded ${successCount} of ${files.length} files.`,
      variant: successCount === files.length ? "default" : "destructive"
    });
    setTimeout(() => {
      setFiles(prev => prev.filter(file => file.status !== 'success'));
    }, 3000);
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
