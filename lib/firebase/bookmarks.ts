import { db } from './firebase-config'
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore'
import { AudioTrack } from '../audio/howler-service'

export interface Bookmark {
  id: string;
  userId: string;
  trackId: string;
  position: number;
  label: string;
  timestamp: number;
}

// Collection name in Firestore
const BOOKMARKS_COLLECTION = 'bookmarks'

/**
 * Save a bookmark to Firestore
 */
export async function saveBookmark(
  userId: string,
  trackId: string,
  position: number,
  label: string
): Promise<Bookmark> {
  try {
    const bookmark = {
      userId,
      trackId,
      position,
      label,
      timestamp: Date.now()
    }
    
    const docRef = await addDoc(collection(db, BOOKMARKS_COLLECTION), bookmark)
    
    return {
      id: docRef.id,
      ...bookmark
    }
  } catch (error) {
    console.error('Error saving bookmark:', error)
    throw new Error('Failed to save bookmark')
  }
}

/**
 * Get all bookmarks for a user
 */
export async function getUserBookmarks(userId: string): Promise<Bookmark[]> {
  try {
    const q = query(
      collection(db, BOOKMARKS_COLLECTION),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    const bookmarks: Bookmark[] = []
    
    querySnapshot.forEach((doc) => {
      bookmarks.push({
        id: doc.id,
        ...doc.data()
      } as Bookmark)
    })
    
    return bookmarks
  } catch (error) {
    console.error('Error getting bookmarks:', error)
    throw new Error('Failed to get bookmarks')
  }
}

/**
 * Delete a bookmark
 */
export async function deleteBookmark(bookmarkId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, BOOKMARKS_COLLECTION, bookmarkId))
  } catch (error) {
    console.error('Error deleting bookmark:', error)
    throw new Error('Failed to delete bookmark')
  }
}
