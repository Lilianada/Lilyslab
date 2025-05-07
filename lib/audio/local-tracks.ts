// Tracks service that uses Cloudinary for audio files
import { AudioTrack } from "./howler-service";
import { 
  getAudioFromCloudinary, 
  getAudioByIdFromCloudinary,
  uploadAudioToCloudinary,
  deleteAudioFromCloudinary
} from "../cloudinary/audio-service";

// Collection types
export type AudioCollectionType = "tracks" | "voice_memo"

// Fallback local tracks in case Cloudinary fetch fails
const fallbackTracks: AudioTrack[] = [
  {
    id: "track-1",
    title: "Sample Track",
    artist: "Lily's Lab",
    duration: 30,
    url: "/audio/sample-track.mp3",
    coverImage: null,
    category: "Music",
    isPremium: false,
    isVoiceMemo: false
  },
  {
    id: "voice-memo-1",
    title: "Sample Voice Memo",
    artist: "Lily's Lab",
    duration: 15,
    url: "/audio/sample-voice-memo.mp3",
    coverImage: null,
    category: "Voice Memo",
    isPremium: false,
    isVoiceMemo: true
  }
];


/**
 * Get all audio items of a specific type
 */
export const getAllAudioItems = async (type: AudioCollectionType = 'tracks'): Promise<AudioTrack[]> => {
  // Filter by type
  if (type === 'tracks') {
    return fallbackTracks.filter(track => !track.isVoiceMemo);
  } else {
    return fallbackTracks.filter(track => track.isVoiceMemo);
  }
};

/**
 * Get all music tracks
 */
export const getAllTracks = async (): Promise<AudioTrack[]> => {
  return fallbackTracks.filter(track => !track.isVoiceMemo);
};

/**
 * Get all voice memos
 */
export const getAllVoiceMemos = async (): Promise<AudioTrack[]> => {
  return fallbackTracks.filter(track => track.isVoiceMemo);
};

/**
 * Get audio items by category
 */
export const getAudioByCategory = async (category: string, type: AudioCollectionType = 'tracks'): Promise<AudioTrack[]> => {
  const items = type === 'tracks' 
    ? fallbackTracks.filter(track => !track.isVoiceMemo) 
    : fallbackTracks.filter(track => track.isVoiceMemo);
  
  return items.filter(item => item.category === category);
};

/**
 * Get audio item by ID
 */
export const getAudioItemById = async (id: string): Promise<AudioTrack | null> => {
  const track = fallbackTracks.find(track => track.id === id);
  return track || null;
};

/**
 * Add a new audio item
 * In a real app, this would save to a database, but here we just log
 */
export const addAudioItem = async (track: AudioTrack, type: AudioCollectionType = 'tracks'): Promise<AudioTrack> => {
  console.log('Adding track (mock):', track);
  return track;
};

/**
 * Update an existing audio item
 * In a real app, this would update the database, but here we just log
 */
export const updateAudioItem = async (id: string, updatedTrack: AudioTrack, type: AudioCollectionType = 'tracks'): Promise<AudioTrack> => {
  console.log('Updating track (mock):', id, updatedTrack);
  return updatedTrack;
};

/**
 * Delete an audio item
 * In a real app, this would delete from the database, but here we just log
 */
export const deleteAudioItem = async (id: string, type: AudioCollectionType = 'tracks'): Promise<void> => {
  console.log('Deleting track (mock):', id);
};
