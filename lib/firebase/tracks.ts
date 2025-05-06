import { db, storage } from "./firebase-config";
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { AudioTrack } from "../audio/howler-service";

// Define audio collection types
export type AudioCollectionType = "tracks" | "voice_memo";

// Function to get all audio items from a specific collection
export const getAllAudioItems = async (collectionType: AudioCollectionType = "tracks"): Promise<AudioTrack[]> => {
  try {
    const audioCollection = collection(db, collectionType);
    const audioSnapshot = await getDocs(audioCollection);
    const audioItems: AudioTrack[] = [];
    
    audioSnapshot.forEach((doc) => {
      const data = doc.data();
      audioItems.push({
        id: doc.id,
        title: data.title || "Untitled",
        artist: data.artist || "Unknown Artist",
        duration: data.duration || 0,
        url: data.url,
        coverImage: data.coverImage || null,
        category: data.category || "Uncategorized",
        isPremium: data.isPremium || false,
        isVoiceMemo: collectionType === "voice_memo"
      });
    });
    
    return audioItems;
  } catch (error) {
    console.error(`Error getting ${collectionType}:`, error);
    throw error;
  }
};

// Function to get all tracks (for backward compatibility)
export const getAllTracks = async (): Promise<AudioTrack[]> => {
  return getAllAudioItems("tracks");
};

// Function to get all voice memos
export const getAllVoiceMemos = async (): Promise<AudioTrack[]> => {
  return getAllAudioItems("voice_memo");
};

// Function to get all audio items (both tracks and voice memos)
export const getAllAudio = async (): Promise<AudioTrack[]> => {
  try {
    const tracks = await getAllTracks();
    const voiceMemos = await getAllVoiceMemos();
    
    return [...tracks, ...voiceMemos];
  } catch (error) {
    console.error("Error getting all audio:", error);
    throw error;
  }
};

// Function to get audio items by category
export const getAudioByCategory = async (category: string, collectionType: AudioCollectionType = "tracks"): Promise<AudioTrack[]> => {
  try {
    const audioQuery = query(
      collection(db, collectionType),
      where("category", "==", category),
      orderBy("title")
    );
    
    const audioSnapshot = await getDocs(audioQuery);
    const audioItems: AudioTrack[] = [];
    
    audioSnapshot.forEach((doc) => {
      const data = doc.data();
      audioItems.push({
        id: doc.id,
        title: data.title || "Untitled",
        artist: data.artist || "Unknown Artist",
        duration: data.duration || 0,
        url: data.url,
        coverImage: data.coverImage || null,
        category: data.category || "Uncategorized",
        isPremium: data.isPremium || false,
        isVoiceMemo: collectionType === "voice_memo"
      });
    });
    
    return audioItems;
  } catch (error) {
    console.error(`Error getting ${collectionType} by category:`, error);
    throw error;
  }
};

// Function to get tracks by category (for backward compatibility)
export const getTracksByCategory = async (category: string): Promise<AudioTrack[]> => {
  return getAudioByCategory(category, "tracks");
};

// Function to get a single audio item by ID
export const getAudioItemById = async (itemId: string, collectionType: AudioCollectionType = "tracks"): Promise<AudioTrack | null> => {
  try {
    const audioDoc = doc(db, collectionType, itemId);
    const audioSnapshot = await getDoc(audioDoc);
    
    if (audioSnapshot.exists()) {
      const data = audioSnapshot.data();
      return {
        id: audioSnapshot.id,
        title: data.title || "Untitled",
        artist: data.artist || "Unknown Artist",
        duration: data.duration || 0,
        url: data.url,
        coverImage: data.coverImage || null,
        category: data.category || "Uncategorized",
        isPremium: data.isPremium || false,
        isVoiceMemo: collectionType === "voice_memo"
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting ${collectionType} by ID:`, error);
    throw error;
  }
};

// Function to get a track by ID (for backward compatibility)
export const getTrackById = async (trackId: string): Promise<AudioTrack | null> => {
  return getAudioItemById(trackId, "tracks");
};

// Function to add a new audio item
export const addAudioItem = async (item: Omit<AudioTrack, "id">, collectionType: AudioCollectionType = "tracks"): Promise<string> => {
  try {
    const audioCollection = collection(db, collectionType);
    const docRef = await addDoc(audioCollection, item);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding ${collectionType}:`, error);
    throw error;
  }
};

// Function to add a track (for backward compatibility)
export const addTrack = async (track: Omit<AudioTrack, "id">): Promise<string> => {
  return addAudioItem(track, "tracks");
};

// Function to update an audio item
export const updateAudioItem = async (itemId: string, updates: Partial<AudioTrack>, collectionType: AudioCollectionType = "tracks"): Promise<void> => {
  try {
    const audioDoc = doc(db, collectionType, itemId);
    await updateDoc(audioDoc, updates);
  } catch (error) {
    console.error(`Error updating ${collectionType}:`, error);
    throw error;
  }
};

// Function to update a track (for backward compatibility)
export const updateTrack = async (trackId: string, updates: Partial<AudioTrack>): Promise<void> => {
  return updateAudioItem(trackId, updates, "tracks");
};

// Function to delete an audio item
export const deleteAudioItem = async (itemId: string, collectionType: AudioCollectionType = "tracks"): Promise<void> => {
  try {
    const audioDoc = doc(db, collectionType, itemId);
    await deleteDoc(audioDoc);
  } catch (error) {
    console.error(`Error deleting ${collectionType}:`, error);
    throw error;
  }
};

// Function to delete a track (for backward compatibility)
export const deleteTrack = async (trackId: string): Promise<void> => {
  return deleteAudioItem(trackId, "tracks");
};

// Helper function to upload tracks to Firestore (for admin use)
export async function uploadTrackMetadata(track: Omit<AudioTrack, 'id'>): Promise<string> {
  // This would be implemented in an admin interface
  // Not exposed to regular users
  return 'track-id';
}
