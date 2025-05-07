import { cloudConfig, getCloudinaryUrl } from './cloudinary-config';
import { AudioTrack } from '@/lib/audio/howler-service';

// Define folder paths for different audio types
const TRACKS_FOLDER = 'tracks';
const RECORDS_FOLDER = 'records';

/**
 * Upload an audio file to Cloudinary
 * @param file File to upload
 * @param isVoiceMemo Whether this is a voice memo or a music track
 * @returns Promise with upload result
 */
export async function uploadAudioToCloudinary(
  file: File,
  isVoiceMemo: boolean = false
): Promise<CloudinaryUploadResult> {
  try {
    // Convert file to base64
    const base64Data = await fileToBase64(file);
    
    // Determine folder based on file type
    const folder = isVoiceMemo ? RECORDS_FOLDER : TRACKS_FOLDER;
    
    // Create a unique public_id based on timestamp and random string
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const publicId = `${folder}/${timestamp}_${randomStr}`;
    
    // For client-side uploads, use the Cloudinary Upload Widget or unsigned upload API
    // This is a simplified example using fetch to an unsigned upload endpoint
    const { cloudName, uploadPreset } = cloudConfig;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset || '');
    formData.append('folder', folder);
    formData.append('public_id', publicId);
    formData.append('tags', isVoiceMemo ? 'voice_memo' : 'music_track');
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const result = await response.json();
    return result as CloudinaryUploadResult;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Delete an audio file from Cloudinary
 * @param publicId The public ID of the file to delete
 * @returns Promise with deletion result
 */
export async function deleteAudioFromCloudinary(publicId: string): Promise<CloudinaryDeleteResult> {
  try {
    // Call the server-side API endpoint to delete the file
    const response = await fetch('/api/cloudinary/delete-audio', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete audio');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting audio from Cloudinary:', error);
    throw error;
  }
}

/**
 * Get a signed URL for an audio file from Cloudinary
 * @param publicId The public ID of the file
 * @param expiresAt Optional expiration time in seconds (default: 1 hour)
 * @returns Signed URL for the audio file
 */
export function getSignedAudioUrl(publicId: string, expiresAt: number = 3600): string {
  // In a client-side context, we can't generate signed URLs directly
  // In a real app, this would call a server-side API endpoint
  // For now, we'll just return a regular Cloudinary URL
  return getCloudinaryUrl(publicId);
}

/**
 * Convert a File object to base64 string
 * @param file File to convert
 * @returns Promise with base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Get all audio tracks from Cloudinary
 * @param isVoiceMemo Whether to get voice memos or music tracks
 * @returns Promise with array of audio tracks
 */
export async function getAudioFromCloudinary(isVoiceMemo: boolean = false): Promise<AudioTrack[]> {
  try {
    // Call the server-side API endpoint to fetch audio tracks
    const response = await fetch(`/api/cloudinary/fetch-audio?isVoiceMemo=${isVoiceMemo}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch audio');
    }
    
    const tracks = await response.json();
    return tracks;
  } catch (error) {
    console.error('Error fetching audio from Cloudinary:', error);
    return [];
  }
}

/**
 * Get a specific audio track from Cloudinary
 * @param publicId The public ID of the track
 * @returns Promise with the audio track
 */
export async function getAudioByIdFromCloudinary(publicId: string): Promise<AudioTrack | null> {
  try {
    // Determine if this is a voice memo based on the publicId
    const isVoiceMemo = publicId.includes('records/');
    
    // Get all tracks of the appropriate type and find the one with matching ID
    const allTracks = await getAudioFromCloudinary(isVoiceMemo);
    const track = allTracks.find(track => track.id === publicId);
    
    if (!track) {
      console.error(`Track not found with ID: ${publicId}`);
      return null;
    }
    
    return track;
  } catch (error) {
    console.error('Error fetching audio by ID from Cloudinary:', error);
    return null;
  }
}

// Add function to update audio metadata
/**
 * Update metadata for an audio track in Cloudinary
 * @param track The track with updated metadata
 * @returns Promise with the updated track
 */
export async function updateAudioMetadata(track: AudioTrack): Promise<AudioTrack> {
  try {
    // Call the server-side API endpoint to update metadata
    const response = await fetch('/api/cloudinary/update-metadata', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publicId: track.id,
        metadata: {
          title: track.title,
          artist: track.artist,
          category: track.category,
          isPremium: track.isPremium,
        },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update metadata');
    }
    
    const result = await response.json();
    return track;
  } catch (error) {
    console.error('Error updating audio metadata in Cloudinary:', error);
    throw error;
  }
}

// Type definitions
export interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  url: string;
  secure_url: string;
  original_filename: string;
  duration?: number;
}

export interface CloudinaryDeleteResult {
  result: string;
}
