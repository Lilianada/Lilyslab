// Optimized imports to reduce bundle size
// This file consolidates common imports to help with tree shaking

import { lazy } from 'react';

// Re-export commonly used Radix UI components with optimized imports
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
export { Button } from "@/components/ui/button"
export { Input } from "@/components/ui/input"
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
export { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Re-export commonly used icons
export { 
  Music, 
  Settings, 
  User, 
  FileText, 
  Upload, 
  Search, 
  Trash, 
  RefreshCw,
  AlertTriangle,
  Database,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Heart,
  Share,
  Eye
} from "lucide-react"

// Lazy loaded components for better performance
export const LazyMusicPlayerWidget = lazy(() => import('@/components/audio/music-player-widget').then(m => ({ default: m.MusicPlayerWidget })));
export const LazyAudioUploader = lazy(() => import('@/components/ctrl-room/audio-uploader').then(m => ({ default: m.AudioUploader })));
export const LazyManageLibrary = lazy(() => import('@/components/ctrl-room/manage-library').then(m => ({ default: m.ManageLibrary })));
export const LazyAudioSettings = lazy(() => import('@/components/ctrl-room/audio-settings').then(m => ({ default: m.AudioSettings })));
export const LazyUploadAudio = lazy(() => import('@/components/ctrl-room/upload-audio'));

// Form and interaction lazy imports
export const LazyGuestbookForm = lazy(() => import('@/app/(with-sidebar)/guestbook/guestbook-form'));
export const LazyGuestbookEntries = lazy(() => import('@/app/(with-sidebar)/guestbook/guestbook-entries'));

// Markdown renderer lazy import with optimization
export const LazyReactMarkdown = lazy(() => import("react-markdown"));
