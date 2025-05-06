import { 
  getStorage, 
  ref, 
  listAll, 
  getDownloadURL, 
  getMetadata,
  uploadBytes
} from 'firebase/storage';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { storage, db } from './firebaseService';

// Types
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverImage: string;
  category: string;
  isPremium: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Bookmark {
  id: string;
  userId: string;
  trackId: string;
  position: number;
  label: string;
  timestamp: number;
}

// Fetch all tracks from Firestore
export const fetchTracks = async (): Promise<Track[]> => {
  try {
    const tracksCollection = collection(db, 'tracks');
    const tracksSnapshot = await getDocs(tracksCollection);
    
    return tracksSnapshot.docs.map(doc => {
      const data = doc.data() as Omit<Track, 'id'>;
      return { ...data, id: doc.id };
    });
  } catch (error) {
    console.error('Error fetching tracks:', error);
    throw error;
  }
};

// Fetch tracks by category
export const fetchTracksByCategory = async (category: string): Promise<Track[]> => {
  try {
    const tracksCollection = collection(db, 'tracks');
    const tracksQuery = query(tracksCollection, where('category', '==', category));
    const tracksSnapshot = await getDocs(tracksQuery);
    
    return tracksSnapshot.docs.map(doc => {
      const data = doc.data() as Omit<Track, 'id'>;
      return { ...data, id: doc.id };
    });
  } catch (error) {
    console.error('Error fetching tracks by category:', error);
    throw error;
  }
};

// Get track by ID
export const getTrackById = async (trackId: string): Promise<Track | null> => {
  try {
    const trackDoc = doc(db, 'tracks', trackId);
    const trackSnapshot = await getDoc(trackDoc);
    
    if (trackSnapshot.exists()) {
      const data = trackSnapshot.data() as Omit<Track, 'id'>;
      return { ...data, id: trackSnapshot.id };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting track by ID:', error);
    throw error;
  }
};

// Get all bookmarks for a user
export const getUserBookmarks = async (userId: string): Promise<Bookmark[]> => {
  try {
    const bookmarksCollection = collection(db, 'bookmarks');
    const bookmarksQuery = query(bookmarksCollection, where('userId', '==', userId));
    const bookmarksSnapshot = await getDocs(bookmarksQuery);
    
    return bookmarksSnapshot.docs.map(doc => {
      const data = doc.data() as Omit<Bookmark, 'id'>;
      return { ...data, id: doc.id };
    });
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    throw error;
  }
};

// Add a bookmark
export const addBookmark = async (bookmark: Omit<Bookmark, 'id'>): Promise<string> => {
  try {
    const bookmarksCollection = collection(db, 'bookmarks');
    const newBookmarkRef = doc(bookmarksCollection);
    
    await setDoc(newBookmarkRef, bookmark);
    
    return newBookmarkRef.id;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};

// Delete a bookmark
export const deleteBookmark = async (bookmarkId: string): Promise<void> => {
  try {
    const bookmarkDoc = doc(db, 'bookmarks', bookmarkId);
    await updateDoc(bookmarkDoc, { deleted: true });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    throw error;
  }
};

// Get download URL for a track
export const getTrackDownloadUrl = async (trackPath: string): Promise<string> => {
  try {
    const trackRef = ref(storage, trackPath);
    return await getDownloadURL(trackRef);
  } catch (error) {
    console.error('Error getting track download URL:', error);
    throw error;
  }
};

// Get all categories
export const getAllCategories = async (): Promise<string[]> => {
  try {
    const tracksCollection = collection(db, 'tracks');
    const tracksSnapshot = await getDocs(tracksCollection);
    
    const categories = new Set<string>();
    
    tracksSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.category) {
        categories.add(data.category);
      }
    });
    
    return Array.from(categories);
  } catch (error) {
    console.error('Error getting all categories:', error);
    throw error;
  }
};

// Update user's last played position
export const updateLastPlayedPosition = async (
  userId: string, 
  trackId: string, 
  position: number
): Promise<void> => {
  try {
    const userHistoryDoc = doc(db, 'userHistory', userId);
    const userHistorySnapshot = await getDoc(userHistoryDoc);
    
    if (userHistorySnapshot.exists()) {
      await updateDoc(userHistoryDoc, {
        [`lastPlayed.${trackId}`]: {
          position,
          timestamp: Date.now()
        }
      });
    } else {
      await setDoc(userHistoryDoc, {
        lastPlayed: {
          [trackId]: {
            position,
            timestamp: Date.now()
          }
        }
      });
    }
  } catch (error) {
    console.error('Error updating last played position:', error);
    throw error;
  }
};

// Get user's last played position
export const getLastPlayedPosition = async (
  userId: string, 
  trackId: string
): Promise<number | null> => {
  try {
    const userHistoryDoc = doc(db, 'userHistory', userId);
    const userHistorySnapshot = await getDoc(userHistoryDoc);
    
    if (userHistorySnapshot.exists()) {
      const data = userHistorySnapshot.data();
      if (data.lastPlayed && data.lastPlayed[trackId]) {
        return data.lastPlayed[trackId].position;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting last played position:', error);
    throw error;
  }
};
