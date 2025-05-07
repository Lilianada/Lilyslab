import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { FileAudio, Music, Database, Settings } from "lucide-react"
import { AudioUploader } from "./audio-uploader"
import { ManageLibrary } from "./manage-library"
import { AudioSettings } from "./audio-settings"

export default function UploadAudio() {
  const [activeComponent, setActiveComponent] = useState<"upload" | "manage" | "settings">("upload")

  return (
    <>
      {/* Show cards only when no component is active */}
      {activeComponent === "upload" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileAudio className="h-5 w-5 text-primary" />
                <span>Upload Audio</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Upload new audio tracks to your library
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-4 pt-0">
              <p className="text-sm text-muted-foreground ">
                Upload MP3 files with metadata. The system will automatically extract
                available tags and let you edit them before saving.
              </p>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Audio Files
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%] max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Upload Audio Files</DialogTitle>
                    <DialogDescription>
                      Upload MP3 files to your library. Metadata will be automatically extracted when possible.
                    </DialogDescription>
                  </DialogHeader>
                  <AudioUploader />
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                <span>Manage Library</span>
              </CardTitle>
              <CardDescription>
                View and manage your audio library
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">
                Browse, edit, and delete tracks in your audio library.
                Update metadata, change categories, or toggle premium status.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setActiveComponent("manage")}
              >
                <Database className="h-4 w-4 mr-2" />
                Manage Tracks
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <span>Audio Settings</span>
              </CardTitle>
              <CardDescription>
                Configure audio player settings
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">
                Manage categories, default playback settings, and other audio player configurations.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setActiveComponent("settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Show ManageLibrary component when active */}
      {activeComponent === "manage" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Manage Audio Library</h2>
            <Button variant="outline" onClick={() => setActiveComponent("upload")}>
              Back to Dashboard
            </Button>
          </div>
          <ManageLibrary />
        </div>
      )}

      {/* Show AudioSettings component when active */}
      {activeComponent === "settings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Audio Settings</h2>
            <Button variant="outline" onClick={() => setActiveComponent("upload")}>
              Back to Dashboard
            </Button>
          </div>
          <AudioSettings />
        </div>
      )}
    </>
  )
}