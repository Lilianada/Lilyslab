"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Music, 
  Plus, 
  X, 
  Save,
  RefreshCw,
  Settings,
  Volume2,
  Clock,
  Sliders
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase/firebase-config"
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore"

interface Category {
  id: string
  name: string
  count: number
}

interface PlayerSettings {
  defaultVolume: number
  autoplay: boolean
  defaultSpeed: number
  showVisualizer: boolean
}

export function AudioSettings() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isSavingCategory, setIsSavingCategory] = useState(false)
  const [isDeletingCategory, setIsDeletingCategory] = useState(false)
  
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>({
    defaultVolume: 0.8,
    autoplay: false,
    defaultSpeed: 1,
    showVisualizer: true
  })
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  
  const { toast } = useToast()

  // Fetch categories and settings on mount
  useEffect(() => {
    fetchCategories()
    fetchPlayerSettings()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true)
      
      // Get all tracks to count categories
      const tracksSnapshot = await getDocs(collection(db, 'tracks'))
      const categoryCounts: Record<string, number> = {}
      
      tracksSnapshot.forEach(doc => {
        const category = doc.data().category
        if (category) {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1
        }
      })
      
      // Get categories from the categories collection
      const categoriesSnapshot = await getDocs(collection(db, 'categories'))
      const fetchedCategories: Category[] = []
      
      categoriesSnapshot.forEach(doc => {
        fetchedCategories.push({
          id: doc.id,
          name: doc.data().name,
          count: categoryCounts[doc.data().name] || 0
        })
      })
      
      // Sort by name
      fetchedCategories.sort((a, b) => a.name.localeCompare(b.name))
      
      setCategories(fetchedCategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const fetchPlayerSettings = async () => {
    try {
      setIsLoadingSettings(true)
      
      // Get player settings from Firestore
      const settingsDoc = await getDocs(collection(db, 'settings'))
      
      if (!settingsDoc.empty) {
        const data = settingsDoc.docs[0].data()
        setPlayerSettings({
          defaultVolume: data.defaultVolume || 0.8,
          autoplay: data.autoplay || false,
          defaultSpeed: data.defaultSpeed || 1,
          showVisualizer: data.showVisualizer !== undefined ? data.showVisualizer : true
        })
      }
    } catch (error) {
      console.error("Error fetching player settings:", error)
      toast({
        title: "Error",
        description: "Failed to load player settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoadingSettings(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast({
        title: "Invalid category",
        description: "Category name cannot be empty.",
        variant: "destructive"
      })
      return
    }
    
    // Check if category already exists
    if (categories.some(cat => cat.name.toLowerCase() === newCategory.toLowerCase())) {
      toast({
        title: "Duplicate category",
        description: `Category "${newCategory}" already exists.`,
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsSavingCategory(true)
      
      // Generate a unique ID
      const categoryId = `category-${Date.now()}`
      
      // Add to Firestore
      await setDoc(doc(db, 'categories', categoryId), {
        name: newCategory,
        createdAt: new Date()
      })
      
      // Update local state
      setCategories(prev => [
        ...prev,
        { id: categoryId, name: newCategory, count: 0 }
      ].sort((a, b) => a.name.localeCompare(b.name)))
      
      setNewCategory("")
      
      toast({
        title: "Category added",
        description: `Category "${newCategory}" has been added.`,
      })
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSavingCategory(false)
    }
  }

  const handleDeleteCategory = async (category: Category) => {
    // Prevent deleting categories that are in use
    if (category.count > 0) {
      toast({
        title: "Cannot delete",
        description: `Category "${category.name}" is in use by ${category.count} tracks.`,
        variant: "destructive"
      })
      return
    }
    
    if (!confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      return
    }
    
    try {
      setIsDeletingCategory(true)
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'categories', category.id))
      
      // Update local state
      setCategories(prev => prev.filter(c => c.id !== category.id))
      
      toast({
        title: "Category deleted",
        description: `Category "${category.name}" has been deleted.`,
      })
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeletingCategory(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setIsSavingSettings(true)
      
      // Get settings document
      const settingsSnapshot = await getDocs(collection(db, 'settings'))
      
      // Convert playerSettings to a plain object
      const settingsData = {
        defaultVolume: playerSettings.defaultVolume,
        autoplay: playerSettings.autoplay,
        defaultSpeed: playerSettings.defaultSpeed,
        showVisualizer: playerSettings.showVisualizer
      }
      
      if (settingsSnapshot.empty) {
        // Create new settings document
        await setDoc(doc(db, 'settings', 'player'), settingsData)
      } else {
        // Update existing settings
        await updateDoc(doc(db, 'settings', settingsSnapshot.docs[0].id), settingsData)
      }
      
      toast({
        title: "Settings saved",
        description: "Player settings have been updated.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSavingSettings(false)
    }
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
          <TabsTrigger value="player" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            <span>Player Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Categories</CardTitle>
              <CardDescription>
                Add, edit, or delete categories for your audio tracks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add new category */}
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="new-category">New Category</Label>
                    <Input
                      id="new-category"
                      placeholder="Enter category name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddCategory} 
                    disabled={isSavingCategory || !newCategory.trim()}
                  >
                    {isSavingCategory ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add
                  </Button>
                </div>
                
                {/* Categories list */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Existing Categories</h3>
                  
                  {isLoadingCategories ? (
                    <div className="flex items-center justify-center h-32">
                      <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="flex items-center justify-center h-32 border rounded-md bg-muted/20">
                      <p className="text-sm text-muted-foreground">No categories found</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div 
                          key={category.id}
                          className="flex items-center justify-between p-3 border rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <span>{category.name}</span>
                            {category.count > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {category.count} tracks
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCategory(category)}
                            disabled={isDeletingCategory || category.count > 0}
                            title={category.count > 0 ? "Cannot delete category in use" : "Delete category"}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="player" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Player Settings</CardTitle>
              <CardDescription>
                Configure default settings for the music player
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSettings ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="default-volume" className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        <span>Default Volume</span>
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(playerSettings.defaultVolume * 100)}%
                      </span>
                    </div>
                    <Slider
                      id="default-volume"
                      min={0}
                      max={1}
                      step={0.01}
                      value={[playerSettings.defaultVolume]}
                      onValueChange={(value) => 
                        setPlayerSettings(prev => ({ ...prev, defaultVolume: value[0] }))
                      }
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="default-speed" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Default Playback Speed</span>
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        {playerSettings.defaultSpeed}x
                      </span>
                    </div>
                    <Slider
                      id="default-speed"
                      min={0.5}
                      max={2}
                      step={0.25}
                      value={[playerSettings.defaultSpeed]}
                      onValueChange={(value) => 
                        setPlayerSettings(prev => ({ ...prev, defaultSpeed: value[0] }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoplay" className="flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      <span>Autoplay Next Track</span>
                    </Label>
                    <Switch
                      id="autoplay"
                      checked={playerSettings.autoplay}
                      onCheckedChange={(checked) => 
                        setPlayerSettings(prev => ({ ...prev, autoplay: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-visualizer" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Show Audio Visualizer</span>
                    </Label>
                    <Switch
                      id="show-visualizer"
                      checked={playerSettings.showVisualizer}
                      onCheckedChange={(checked) => 
                        setPlayerSettings(prev => ({ ...prev, showVisualizer: checked }))
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings} 
                disabled={isLoadingSettings || isSavingSettings}
                className="ml-auto"
              >
                {isSavingSettings ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
