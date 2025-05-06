import { AudioTrack } from './howler-service';

// Mock data for audio tracks using local files
const localTracks: AudioTrack[] = [
  {
    id: '1',
    title: 'Sample Track 1',
    artist: 'Local Artist',
    url: '/audio/sample-track.mp3',
    coverImage: null,
    duration: 180, // 3 minutes in seconds
    category: 'Music',
    isPremium: false,
    isVoiceMemo: false
  },
  {
    id: '2',
    title: 'Voice Memo Sample',
    artist: 'Recorded by You',
    url: '/audio/sample-voice-memo.mp3',
    coverImage: null,
    duration: 60, // 1 minute in seconds
    category: 'Voice Memo',
    isPremium: false,
    isVoiceMemo: true
  }
];

// Type for audio collection
export type AudioCollectionType = 'tracks' | 'voice_memo';

/**
 * Get all audio items of a specific type
 */
export const getAllAudioItems = async (type: AudioCollectionType = 'tracks'): Promise<AudioTrack[]> => {
  // Filter by type
  if (type === 'tracks') {
    return localTracks.filter(track => !track.isVoiceMemo);
  } else {
    return localTracks.filter(track => track.isVoiceMemo);
  }
};

/**
 * Get all music tracks
 */
export const getAllTracks = async (): Promise<AudioTrack[]> => {
  return localTracks.filter(track => !track.isVoiceMemo);
};

/**
 * Get all voice memos
 */
export const getAllVoiceMemos = async (): Promise<AudioTrack[]> => {
  return localTracks.filter(track => track.isVoiceMemo);
};

/**
 * Get audio items by category
 */
export const getAudioByCategory = async (category: string, type: AudioCollectionType = 'tracks'): Promise<AudioTrack[]> => {
  const items = type === 'tracks' 
    ? localTracks.filter(track => !track.isVoiceMemo) 
    : localTracks.filter(track => track.isVoiceMemo);
  
  return items.filter(item => item.category === category);
};

/**
 * Get audio item by ID
 */
export const getAudioItemById = async (id: string): Promise<AudioTrack | null> => {
  const track = localTracks.find(track => track.id === id);
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
