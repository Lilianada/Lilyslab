/**
 * Reads a playlist's tracklist (names, artists, lengths) from Spotify, YouTube or YouTube Music.
 * No API keys: it reads the same public pages a browser would. Only metadata, never audio.
 */

export interface PlaylistTrack {
  title: string;
  artist: string;
  /** Seconds, when the source gives it. */
  duration: number | null;
}

export interface Playlist {
  source: "spotify" | "youtube";
  name: string;
  owner: string | null;
  tracks: PlaylistTrack[];
  /** True when the source only showed the first part of a long playlist. */
  maybeTruncated: boolean;
}

export class PlaylistError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  // Skips YouTube's cookie-consent page.
  Cookie: "CONSENT=YES+1",
};

type Parsed =
  | { source: "spotify"; kind: "playlist" | "album" | "track"; id: string }
  | { source: "youtube"; listId: string };

/** Works out what kind of link this is. */
export function parsePlaylistUrl(input: string): Parsed {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new PlaylistError("That doesn't look like a link.");
  }
  const host = url.hostname.toLowerCase().replace(/^www\./, "");

  if (host === "open.spotify.com") {
    // Handles /playlist/ID, /album/ID, /track/ID and localized /intl-xx/playlist/ID.
    const match = url.pathname.match(/\/(playlist|album|track)\/([A-Za-z0-9]+)/);
    if (!match) throw new PlaylistError("Use a Spotify playlist, album or track link.");
    return { source: "spotify", kind: match[1] as "playlist" | "album" | "track", id: match[2] };
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com" || host === "youtu.be") {
    let listId = url.searchParams.get("list");
    // YouTube Music sometimes links playlists as /browse/VL<id>.
    const browse = url.pathname.match(/\/browse\/VL([\w-]+)/);
    if (!listId && browse) listId = browse[1];
    if (!listId) throw new PlaylistError("Use a playlist link (it has list= in it), not a single video.");
    if (listId.startsWith("RD")) {
      throw new PlaylistError("That's an auto-generated mix, which YouTube doesn't share. Save it as a playlist first.");
    }
    return { source: "youtube", listId };
  }

  throw new PlaylistError("Only Spotify, YouTube and YouTube Music links work here.");
}

async function getPage(url: string) {
  const response = await fetch(url, { headers: BROWSER_HEADERS, cache: "no-store", redirect: "follow" });
  if (response.status === 404) throw new PlaylistError("That playlist couldn't be found. Is it public?", 404);
  if (!response.ok) throw new PlaylistError(`The playlist page didn't load (${response.status}). Try again in a bit.`, 502);
  return response.text();
}

// ---------- Spotify ----------

async function spotify(kind: "playlist" | "album" | "track", id: string): Promise<Playlist> {
  // The embed player page carries the tracklist as JSON.
  const html = await getPage(`https://open.spotify.com/embed/${kind}/${id}`);
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) throw new PlaylistError("Spotify didn't share that playlist. Make sure it's public.", 502);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let entity: any;
  try {
    entity = JSON.parse(match[1])?.props?.pageProps?.state?.data?.entity;
  } catch {
    entity = null;
  }
  if (!entity) throw new PlaylistError("Spotify didn't share that playlist. Make sure it's public.", 502);

  const cleanArtist = (s: string | undefined) => (s ?? "").replace(/ /g, " ").trim();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const list: any[] = kind === "track" ? [entity] : entity.trackList ?? [];
  const tracks = list
    .filter((t) => t?.title)
    .map((t) => ({
      title: String(t.title).trim(),
      artist: cleanArtist(t.subtitle ?? t.artists?.map((a: { name: string }) => a.name).join(", ")),
      duration: typeof t.duration === "number" ? Math.round(t.duration / 1000) : null,
    }));

  if (tracks.length === 0) throw new PlaylistError("That Spotify link has no tracks in it.");

  return {
    source: "spotify",
    name: entity.name || entity.title || "Spotify playlist",
    owner: kind === "playlist" ? cleanArtist(entity.subtitle) || null : cleanArtist(entity.subtitle) || null,
    tracks,
    // The embed shows up to 100 tracks.
    maybeTruncated: tracks.length >= 100,
  };
}

// ---------- YouTube / YouTube Music ----------

/** "4:13" or "1:02:03" to seconds. */
function clockToSeconds(text: string | undefined): number | null {
  if (!text || !/^\d+(:\d{1,2}){1,2}$/.test(text.trim())) return null;
  return text
    .trim()
    .split(":")
    .reduce((total, part) => total * 60 + Number(part), 0);
}

/** Video titles are messy: "Artist - Song (Official Video) [4K]". Pull out the song and artist. */
export function splitVideoTitle(rawTitle: string, channel: string): { title: string; artist: string } {
  const noise =
    /\s*[([](official|music video|lyric|lyrics|audio|visuali[sz]er|hd|hq|4k|remaster(ed)?|video|mv|clip officiel)[^)\]]*[)\]]\s*/gi;
  let title = rawTitle.replace(noise, " ").replace(/\s+/g, " ").trim();
  let artist = channel.replace(/\s*-\s*Topic$/i, "").replace(/VEVO$/i, "").trim();

  // "Artist - Song" (only trust the split when it isn't a "Topic" auto channel, which already has clean titles).
  const parts = title.split(/\s+[-–—|]\s+/);
  if (!/-\s*Topic$/i.test(channel) && parts.length >= 2) {
    artist = parts[0].trim();
    title = parts.slice(1).join(" - ").trim();
  }
  return { title: title || rawTitle, artist };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function collect(node: any, out: { kind: string; value: any }[]) {
  if (Array.isArray(node)) {
    for (const child of node) collect(child, out);
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "playlistVideoRenderer" || key === "lockupViewModel") out.push({ kind: key, value });
      else collect(value, out);
    }
  }
}

async function youtube(listId: string): Promise<Playlist> {
  const html = await getPage(`https://www.youtube.com/playlist?list=${encodeURIComponent(listId)}&hl=en`);
  const match = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
  if (!match) throw new PlaylistError("YouTube didn't share that playlist. Make sure it's public or unlisted.", 502);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try {
    data = JSON.parse(match[1]);
  } catch {
    throw new PlaylistError("YouTube's page couldn't be read. Try again in a bit.", 502);
  }

  const alert = JSON.stringify(data.alerts ?? "");
  if (/does not exist|private/i.test(alert)) throw new PlaylistError("That playlist is private or doesn't exist.", 404);

  const items: { kind: string; value: any }[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  collect(data.contents, items);

  const tracks: PlaylistTrack[] = [];
  for (const { kind, value } of items) {
    let rawTitle = "";
    let channel = "";
    let duration: number | null = null;

    if (kind === "playlistVideoRenderer") {
      rawTitle = value.title?.runs?.[0]?.text ?? value.title?.simpleText ?? "";
      channel = value.shortBylineText?.runs?.[0]?.text ?? "";
      duration = value.lengthSeconds ? Number(value.lengthSeconds) : clockToSeconds(value.lengthText?.simpleText);
    } else {
      const meta = value.metadata?.lockupMetadataViewModel;
      rawTitle = meta?.title?.content ?? "";
      channel = meta?.metadata?.contentMetadataViewModel?.metadataRows?.[0]?.metadataParts?.[0]?.text?.content ?? "";
      const badges = value.contentImage?.thumbnailViewModel?.overlays ?? [];
      for (const overlay of badges) {
        for (const badge of overlay?.thumbnailBottomOverlayViewModel?.badges ?? []) {
          duration ??= clockToSeconds(badge?.thumbnailBadgeViewModel?.text);
        }
      }
    }

    // Deleted/private videos show up as placeholders.
    if (!rawTitle || /^\[(deleted|private) video\]$/i.test(rawTitle)) continue;
    tracks.push({ ...splitVideoTitle(rawTitle, channel), duration });
  }

  if (tracks.length === 0) throw new PlaylistError("That playlist looks empty, or YouTube hid its videos.");

  const header = data.metadata?.playlistMetadataRenderer;
  return {
    source: "youtube",
    name: header?.title || "YouTube playlist",
    owner: null,
    tracks,
    // The first page of a YouTube playlist holds 100 videos.
    maybeTruncated: tracks.length >= 100,
  };
}

export async function fetchPlaylist(input: string): Promise<Playlist> {
  const parsed = parsePlaylistUrl(input);
  return parsed.source === "spotify" ? spotify(parsed.kind, parsed.id) : youtube(parsed.listId);
}
