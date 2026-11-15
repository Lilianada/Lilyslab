/** Matching playlist tracks to local audio files by name, artist and length. */

const NOISE =
  /\b(feat|ft|featuring|official|video|audio|lyrics?|visuali[sz]er|remaster(ed)?|hd|hq|4k|mp3|explicit|clean|version|radio edit)\b/g;

export function words(text: string | null | undefined): string[] {
  return (text ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // accents
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(NOISE, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !/^(the|a|an|and|of|by)$/.test(w));
}

/** How much of `wanted` appears in `haystack`, 0..1. */
function coverage(wanted: string[], haystack: Set<string>) {
  if (wanted.length === 0) return 0;
  return wanted.filter((w) => haystack.has(w)).length / wanted.length;
}

export interface Matchable {
  id: string;
  title: string;
  artist: string;
  duration: number | null;
}

export interface MatchCandidate {
  id: string;
  /** Everything known about the file: tags and file name. */
  text: string;
  duration: number | null;
}

/** 0..1: how likely this file is this track. */
export function score(track: Matchable, file: MatchCandidate): number {
  // Drop "(feat. X)"-style extras from the title before comparing.
  const titleWords = words(track.title.replace(/[([].*?[)\]]/g, " ")) || [];
  const fileWords = new Set(words(file.text));
  const titleScore = coverage(titleWords.length ? titleWords : words(track.title), fileWords);
  if (titleScore < 0.5) return 0;
  const artistScore = coverage(words(track.artist), fileWords);

  let total = titleScore * 0.7 + artistScore * 0.3;
  if (track.duration && file.duration) {
    const off = Math.abs(track.duration - file.duration);
    if (off <= 3) total += 0.1;
    else if (off > 30) total -= 0.25;
  }
  return Math.max(0, Math.min(1, total));
}

/** Pairs tracks with files, best matches first, each file used once. Returns trackId → fileId. */
export function autoMatch(tracks: Matchable[], files: MatchCandidate[], threshold = 0.6): Map<string, string> {
  const pairs: { trackId: string; fileId: string; s: number }[] = [];
  for (const track of tracks) {
    for (const file of files) {
      const s = score(track, file);
      if (s >= threshold) pairs.push({ trackId: track.id, fileId: file.id, s });
    }
  }
  pairs.sort((a, b) => b.s - a.s);

  const result = new Map<string, string>();
  const usedFiles = new Set<string>();
  for (const { trackId, fileId } of pairs) {
    if (result.has(trackId) || usedFiles.has(fileId)) continue;
    result.set(trackId, fileId);
    usedFiles.add(fileId);
  }
  return result;
}
