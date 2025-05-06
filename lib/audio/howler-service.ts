import { Howl, HowlOptions } from 'howler';

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverImage?: string | null;
  category: string;
  isPremium: boolean;
  isVoiceMemo?: boolean;
}

export interface AudioBookmark {
  id: string;
  trackId: string;
  position: number;
  label: string;
  timestamp: number;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  speed: number;
  loop: boolean;
}

class HowlerService {
  private howl: Howl | null = null;
  private currentTrack: AudioTrack | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private seekInterval: NodeJS.Timeout | null = null;
  
  // Initialize a new Howl instance for a track
  loadTrack(track: AudioTrack): Promise<void> {
    return new Promise((resolve, reject) => {
      // If there's an existing howl instance, unload it
      if (this.howl) {
        this.stopSeekInterval();
        this.howl.unload();
      }
      
      this.currentTrack = track;
      
      // Ensure URL is absolute for local files
      let audioUrl = track.url;
      if (audioUrl.startsWith('/')) {
        audioUrl = window.location.origin + audioUrl;
      }
      
      console.log('Loading audio track:', { ...track, url: audioUrl });
      
      const options: HowlOptions = {
        src: [audioUrl],
        html5: true, // Enable streaming
        preload: true,
        volume: 0.8,
        rate: 1.0,
        onload: () => {
          // Update the track duration from the actual audio file
          if (this.howl) {
            const actualDuration = this.howl.duration();
            if (actualDuration > 0 && (!track.duration || Math.abs(track.duration - actualDuration) > 1)) {
              console.log(`Updating duration for ${track.title} from ${track.duration} to ${actualDuration}`);
              track.duration = actualDuration;
            }
          }
          this.emit('loaded', track);
          this.emit('durationchange', track.duration);
          resolve();
        },
        onloaderror: (id, error) => {
          console.error('Error loading audio:', error);
          this.emit('error', { id, error, track });
          reject(error);
        },
        onplay: () => {
          this.startSeekInterval();
          this.emit('play');
        },
        onpause: () => {
          this.stopSeekInterval();
          this.emit('pause');
        },
        onstop: () => {
          this.stopSeekInterval();
          this.emit('stop');
        },
        onend: () => {
          this.stopSeekInterval();
          this.emit('end');
        },
        onseek: () => {
          this.emit('seek', this.getCurrentTime());
        }
      };
      
      this.howl = new Howl(options);
    });
  }
  
  // Play the current track
  play(): void {
    if (this.howl) {
      this.howl.play();
    }
  }
  
  // Pause the current track
  pause(): void {
    if (this.howl) {
      this.howl.pause();
    }
  }
  
  // Stop the current track
  stop(): void {
    if (this.howl) {
      this.howl.stop();
    }
  }
  
  // Seek to a specific position (in seconds)
  seek(position: number): void {
    if (this.howl) {
      this.howl.seek(position);
      this.emit('timeupdate', position);
    }
  }
  
  // Get current playback position (in seconds)
  getCurrentTime(): number {
    if (this.howl) {
      return this.howl.seek() as number;
    }
    return 0;
  }
  
  // Get total duration (in seconds)
  getDuration(): number {
    if (this.howl) {
      return this.howl.duration();
    }
    return 0;
  }
  
  // Set volume (0 to 1)
  setVolume(volume: number): void {
    if (this.howl) {
      this.howl.volume(volume);
      this.emit('volumechange', volume);
    }
  }
  
  // Get current volume
  getVolume(): number {
    if (this.howl) {
      return this.howl.volume();
    }
    return 0.8; // Default volume
  }
  
  // Mute/unmute
  setMuted(muted: boolean): void {
    if (this.howl) {
      this.howl.mute(muted);
      this.emit('mutechange', muted);
    }
  }
  
  // Get mute state
  isMuted(): boolean {
    if (this.howl) {
      return this.howl.mute();
    }
    return false;
  }
  
  // Set playback rate (speed)
  setPlaybackRate(rate: number): void {
    if (this.howl) {
      this.howl.rate(rate);
      this.emit('ratechange', rate);
    }
  }
  
  // Get playback rate
  getPlaybackRate(): number {
    if (this.howl) {
      return this.howl.rate();
    }
    return 1.0; // Default rate
  }
  
  // Set loop mode
  setLoop(loop: boolean): void {
    if (this.howl) {
      this.howl.loop(loop);
      this.emit('loopchange', loop);
    }
  }
  
  // Get loop state
  isLooping(): boolean {
    if (this.howl) {
      return this.howl.loop();
    }
    return false;
  }
  
  // Check if audio is currently playing
  isPlaying(): boolean {
    if (this.howl) {
      return this.howl.playing();
    }
    return false;
  }
  
  // Get current track
  getCurrentTrack(): AudioTrack | null {
    return this.currentTrack;
  }
  
  // Get current playback state
  getPlaybackState(): PlaybackState {
    return {
      isPlaying: this.isPlaying(),
      currentTime: this.getCurrentTime(),
      duration: this.getDuration(),
      volume: this.getVolume(),
      muted: this.isMuted(),
      speed: this.getPlaybackRate(),
      loop: this.isLooping()
    };
  }
  
  // Start interval to emit time updates
  private startSeekInterval(): void {
    if (this.seekInterval) {
      clearInterval(this.seekInterval);
    }
    
    this.seekInterval = setInterval(() => {
      if (this.howl && this.isPlaying()) {
        const currentTime = this.getCurrentTime();
        this.emit('timeupdate', currentTime);
      }
    }, 100); // Update every 100ms for smooth progress bar
  }
  
  // Stop the seek interval
  private stopSeekInterval(): void {
    if (this.seekInterval) {
      clearInterval(this.seekInterval);
      this.seekInterval = null;
    }
  }
  
  // Event handling
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    const callbacks = this.listeners.get(event) || [];
    callbacks.push(callback);
    this.listeners.set(event, callbacks);
  }
  
  // Remove event listener
  off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event) || [];
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
      this.listeners.set(event, callbacks);
    }
  }
  
  // Emit event to all listeners
  private emit(event: string, ...args: any[]): void {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => {
      callback(...args);
    });
  }
  
  // Clean up resources
  destroy(): void {
    if (this.howl) {
      this.howl.unload();
      this.howl = null;
    }
    
    this.stopSeekInterval();
    this.listeners.clear();
    this.currentTrack = null;
  }
}

// Create a singleton instance
const howlerService = new HowlerService();

export default howlerService;
