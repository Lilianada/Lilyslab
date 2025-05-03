import { getRecentlyPlayedMusic } from '@/lib/youtube';
import { MusicPlayerWidget } from './music-player-widget';
import { formatDistanceToNow } from 'date-fns';

export async function YouTubeMusicWidget() {
  // Fetch the most recent song from YouTube
  const recentSongs = await getRecentlyPlayedMusic(1);
  
  if (recentSongs.length === 0) {
    // Fallback if no songs are found
    return (
      <MusicPlayerWidget
        imageUrl="/cover.png"
        title="Aura Phonk"
        artist="Curse Devil"
        lastPlayed="Last played on Apr 22, 09:13 AM WAT"
      />
    );
  }
  
  const recentSong = recentSongs[0];
  
  // Format the published date
  const publishedDate = new Date(recentSong.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });
  
  return (
    <MusicPlayerWidget
      imageUrl={recentSong.thumbnailUrl}
      title={recentSong.title}
      artist={recentSong.channelTitle}
      lastPlayed={`Played ${timeAgo}`}
      // videoId={recentSong.id}
    />
  );
}
