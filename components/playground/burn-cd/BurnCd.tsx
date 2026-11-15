"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Check,
  Download,
  FileAudio,
  FolderDown,
  GripVertical,
  ImagePlus,
  Link2,
  Loader2,
  Pause,
  Play,
  Plus,
  Trash2,
  Upload,
  Wand2,
  X,
} from "lucide-react";
import { canDecode, guessFromFileName, readDuration, readTags, toCdWav } from "./audio";
import { autoMatch } from "./match";
import { makeZip, type ZipEntry } from "./zip";
import {
  BACK_SIZE,
  COVER_FONTS,
  COVER_STYLES,
  DEFAULT_DESIGN,
  FRONT_SIZE,
  PALETTES,
  canvasToBlob,
  drawBack,
  drawFront,
  formatTime,
  loadFonts,
  type Design,
} from "./artwork";

// ---------- Types & storage ----------

interface Track {
  id: string;
  title: string;
  artist: string;
  /** Length from the playlist, in seconds. A matched file's own length wins over this. */
  duration: number | null;
  fileId: string | null;
  /** Remembers which file it was (name + size) so re-adding files after a reload re-attaches them. */
  fileKey: string | null;
}

interface LocalFile {
  id: string;
  key: string;
  file: File;
  title: string;
  artist: string | null;
  duration: number | null;
}

interface Settings {
  format: "wav" | "original";
  gap: 0 | 2;
}

const STORAGE_KEY = "burncd_project";
const CD_SECONDS = 80 * 60;
const AUDIO_ACCEPT = "audio/*,.mp3,.m4a,.aac,.wav,.flac,.ogg,.opus";

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const fileKey = (file: File) => `${file.name}:${file.size}`;

function loadProject(): { tracks: Track[]; design: Design; settings: Settings; photo: string | null } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    return {
      tracks: (saved.tracks ?? []).map((t: Track) => ({ ...t, fileId: null })),
      design: { ...DEFAULT_DESIGN, ...saved.design },
      settings: { format: "wav", gap: 2, ...saved.settings },
      photo: saved.photo ?? null,
    };
  } catch {
    return null;
  }
}

function saveProject(value: unknown) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Full or blocked storage: the project still works, it just won't be remembered.
  }
}

/** Safe file/folder names on Mac, Windows and CD burners. */
const safeName = (text: string) =>
  text
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80) || "Untitled";

const extensionOf = (name: string) => name.split(".").pop()?.toLowerCase() ?? "mp3";

/** Shrinks a photo so it's light enough to remember, but still prints well at 120 mm. */
function shrinkPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale);
      canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That image couldn't be opened."));
    };
    image.src = url;
  });
}

// ---------- Component ----------

type Step = "tracks" | "artwork" | "export";

export default function BurnCd() {
  const [step, setStep] = useState<Step>("tracks");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [design, setDesign] = useState<Design>(DEFAULT_DESIGN);
  const [settings, setSettings] = useState<Settings>({ format: "wav", gap: 2 });
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoImage, setPhotoImage] = useState<HTMLImageElement | null>(null);
  const [ready, setReady] = useState(false);

  // Restore the last project (tracklist and artwork; audio files have to be added again).
  useEffect(() => {
    const saved = loadProject();
    if (saved) {
      setTracks(saved.tracks);
      setDesign(saved.design);
      setSettings(saved.settings);
      setPhoto(saved.photo);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => saveProject({ tracks, design, settings, photo }), 300);
    return () => clearTimeout(timer);
  }, [tracks, design, settings, photo, ready]);

  useEffect(() => {
    if (!photo) {
      setPhotoImage(null);
      return;
    }
    const image = new Image();
    image.onload = () => setPhotoImage(image);
    image.src = photo;
  }, [photo]);

  const fileById = useMemo(() => new Map(files.map((f) => [f.id, f])), [files]);
  const lengthOf = useCallback(
    (track: Track) => (track.fileId ? fileById.get(track.fileId)?.duration : null) ?? track.duration,
    [fileById]
  );

  const usedFileIds = new Set(tracks.map((t) => t.fileId).filter(Boolean));
  const unusedFiles = files.filter((f) => !usedFileIds.has(f.id));
  const withAudio = tracks.filter((t) => t.fileId).length;

  const musicSeconds = tracks.reduce((sum, t) => sum + (lengthOf(t) ?? 0), 0);
  const gapSeconds = settings.gap * Math.max(0, tracks.length - 1);
  const totalSeconds = musicSeconds + gapSeconds;
  const unknownLengths = tracks.filter((t) => lengthOf(t) == null).length;

  return (
    <div className="mx-auto w-full max-w-4xl pb-16 pt-16 sm:px-4">
      <header className="mb-6">
        <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-2 text-xl font-medium">Burn CD</h1>
        <p className="text-sm text-muted-foreground">
          Plan a mix CD from a playlist or your own files, check it fits, design the cover, and download a folder that&apos;s
          ready to burn. Everything happens in your browser; your music never gets uploaded.
        </p>
      </header>

      <DiscMeter tracks={tracks} lengthOf={lengthOf} total={totalSeconds} gap={gapSeconds} unknown={unknownLengths} />

      <nav className="mb-6 mt-4 flex gap-1 border-b border-border" aria-label="Steps">
        {(
          [
            ["tracks", "1  Tracks"],
            ["artwork", "2  Artwork"],
            ["export", "3  Burn folder"],
          ] as [Step, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setStep(key)}
            className={`-mb-px whitespace-pre border-b-2 px-3 py-2 text-sm transition-colors ${
              step === key ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            aria-current={step === key ? "step" : undefined}
          >
            {label}
          </button>
        ))}
      </nav>

      {step === "tracks" && (
        <TracksStep
          tracks={tracks}
          setTracks={setTracks}
          files={files}
          setFiles={setFiles}
          fileById={fileById}
          unusedFiles={unusedFiles}
          withAudio={withAudio}
          lengthOf={lengthOf}
          design={design}
          setDesign={setDesign}
          onNext={() => setStep("artwork")}
        />
      )}
      {step === "artwork" && (
        <ArtworkStep
          design={design}
          setDesign={setDesign}
          photo={photo}
          setPhoto={setPhoto}
          photoImage={photoImage}
          tracks={tracks}
          lengthOf={lengthOf}
          totalSeconds={totalSeconds}
          onNext={() => setStep("export")}
        />
      )}
      {step === "export" && (
        <ExportStep
          tracks={tracks}
          fileById={fileById}
          lengthOf={lengthOf}
          design={design}
          photoImage={photoImage}
          settings={settings}
          setSettings={setSettings}
          totalSeconds={totalSeconds}
          goToTracks={() => setStep("tracks")}
        />
      )}
    </div>
  );
}

// ---------- Disc meter ----------

function DiscMeter({
  tracks,
  lengthOf,
  total,
  gap,
  unknown,
}: {
  tracks: Track[];
  lengthOf: (t: Track) => number | null;
  total: number;
  gap: number;
  unknown: number;
}) {
  const over = total > CD_SECONDS;
  const scale = Math.max(CD_SECONDS, total);
  return (
    <section
      className="sticky top-16 z-20 rounded-lg border border-border bg-background/95 p-3 backdrop-blur"
      aria-label="CD time"
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs">
        <span className="font-mono">
          <span className={over ? "font-medium text-red-500" : "font-medium text-foreground"}>{formatTime(total)}</span>
          <span className="text-muted-foreground"> of 80:00</span>
        </span>
        <span className={`font-mono ${over ? "text-red-500" : "text-muted-foreground"}`}>
          {tracks.length === 0
            ? "Add tracks to fill the disc"
            : over
              ? `Over by ${formatTime(total - CD_SECONDS)}. Remove or shorten something.`
              : `${formatTime(CD_SECONDS - total)} left`}
        </span>
      </div>
      <div className="relative flex h-3 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label={`${formatTime(total)} used of 80 minutes`}>
        {tracks.map((track, i) => {
          const length = lengthOf(track) ?? 0;
          if (!length) return null;
          const fits = tracks.slice(0, i + 1).reduce((s, t) => s + (lengthOf(t) ?? 0), 0) <= CD_SECONDS;
          return (
            <div
              key={track.id}
              title={`${i + 1}. ${track.title} (${formatTime(length)})`}
              className={`h-full border-r border-background/70 ${
                fits ? (i % 2 ? "bg-foreground/60" : "bg-foreground/80") : "bg-red-500/80"
              }`}
              style={{ width: `${(length / scale) * 100}%` }}
            />
          );
        })}
        {over && (
          <div className="absolute inset-y-0 w-0.5 bg-red-500" style={{ left: `${(CD_SECONDS / scale) * 100}%` }} aria-hidden />
        )}
      </div>
      {(gap > 0 || unknown > 0) && tracks.length > 0 && (
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {gap > 0 && `Includes ${formatTime(gap)} of 2-second gaps between tracks. `}
          {unknown > 0 && `${unknown} ${unknown === 1 ? "track has" : "tracks have"} no length yet; add its audio to count it.`}
        </p>
      )}
    </section>
  );
}

// ---------- Step 1: tracks ----------

function TracksStep({
  tracks,
  setTracks,
  files,
  setFiles,
  fileById,
  unusedFiles,
  withAudio,
  lengthOf,
  design,
  setDesign,
  onNext,
}: {
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  files: LocalFile[];
  setFiles: React.Dispatch<React.SetStateAction<LocalFile[]>>;
  fileById: Map<string, LocalFile>;
  unusedFiles: LocalFile[];
  withAudio: number;
  lengthOf: (t: Track) => number | null;
  design: Design;
  setDesign: React.Dispatch<React.SetStateAction<Design>>;
  onNext: () => void;
}) {
  const [link, setLink] = useState("");
  const [importing, setImporting] = useState(false);
  const [readingFiles, setReadingFiles] = useState(0);
  const [message, setMessage] = useState<{ tone: "ok" | "warn" | "error"; text: string } | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [dropActive, setDropActive] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => audioRef.current?.pause(), []);

  /** Matches unmatched tracks against the given files (files already in use are skipped). */
  const matchInto = (current: Track[], pool: LocalFile[]) => {
    const used = new Set(current.map((t) => t.fileId).filter(Boolean));
    const free = pool.filter((f) => !used.has(f.id));
    // First: files we've seen before for these tracks (after a page reload).
    let next = current.map((t) => {
      if (t.fileId || !t.fileKey) return t;
      const same = free.find((f) => f.key === t.fileKey && !used.has(f.id));
      if (!same) return t;
      used.add(same.id);
      return { ...t, fileId: same.id };
    });
    const stillFree = free.filter((f) => !used.has(f.id));
    const pairs = autoMatch(
      next.filter((t) => !t.fileId).map((t) => ({ id: t.id, title: t.title, artist: t.artist, duration: t.duration })),
      stillFree.map((f) => ({ id: f.id, text: `${f.title} ${f.artist ?? ""} ${f.file.name}`, duration: f.duration }))
    );
    next = next.map((t) => {
      const fileId = pairs.get(t.id);
      if (!fileId) return t;
      const file = stillFree.find((f) => f.id === fileId)!;
      return { ...t, fileId, fileKey: file.key };
    });
    return { next, matched: pairs.size };
  };

  const importPlaylist = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!link.trim() || importing) return;
    setImporting(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/burn-cd/playlist?url=${encodeURIComponent(link.trim())}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "That playlist couldn't be read.");

      const incoming: Track[] = body.tracks.map((t: { title: string; artist: string; duration: number | null }) => ({
        id: newId(),
        title: t.title,
        artist: t.artist,
        duration: t.duration,
        fileId: null,
        fileKey: null,
      }));
      const { next, matched } = matchInto([...tracks, ...incoming], files);
      setTracks(next);
      if (design.title === DEFAULT_DESIGN.title) setDesign((d) => ({ ...d, title: body.name }));
      setLink("");
      const parts = [`Added ${incoming.length} tracks from “${body.name}”.`];
      if (matched) parts.push(`${matched} matched to your files.`);
      if (body.maybeTruncated) parts.push("Long playlists only share their first 100 tracks.");
      setMessage({ tone: body.maybeTruncated ? "warn" : "ok", text: parts.join(" ") });
    } catch (error) {
      setMessage({ tone: "error", text: error instanceof Error ? error.message : "That playlist couldn't be read." });
    } finally {
      setImporting(false);
    }
  };

  const addFiles = async (list: FileList | File[]) => {
    const audio = Array.from(list).filter((f) => f.type.startsWith("audio/") || /\.(mp3|m4a|aac|wav|flac|ogg|opus)$/i.test(f.name));
    const skipped = Array.from(list).length - audio.length;
    const known = new Set(files.map((f) => f.key));
    const fresh = audio.filter((f) => !known.has(fileKey(f)));
    if (fresh.length === 0) {
      setMessage({ tone: "warn", text: skipped ? "Those weren't audio files." : "Those files are already here." });
      return;
    }
    setReadingFiles(fresh.length);
    const read = await Promise.all(
      fresh.map(async (file) => {
        const [tags, duration] = await Promise.all([readTags(file), readDuration(file)]);
        const guess = guessFromFileName(file.name);
        return {
          id: newId(),
          key: fileKey(file),
          file,
          title: tags.title || guess.title,
          artist: tags.artist || guess.artist,
          duration,
        } satisfies LocalFile;
      })
    );
    setReadingFiles(0);
    const allFiles = [...files, ...read];
    setFiles(allFiles);

    // Files fill playlist tracks first; anything left over becomes its own track,
    // unless there's a playlist waiting, in which case leftovers wait in "Unused files".
    const { next, matched } = matchInto(tracks, allFiles);
    const hasPlaylist = tracks.some((t) => !t.fileId);
    const used = new Set(next.map((t) => t.fileId));
    const leftovers = read.filter((f) => !used.has(f.id));
    const added: Track[] = hasPlaylist
      ? []
      : leftovers.map((f) => ({ id: newId(), title: f.title, artist: f.artist ?? "", duration: f.duration, fileId: f.id, fileKey: f.key }));
    setTracks([...next, ...added]);

    const parts = [`Read ${read.length} ${read.length === 1 ? "file" : "files"}.`];
    if (matched) parts.push(`${matched} matched to playlist tracks.`);
    if (added.length) parts.push(`${added.length} added to the disc.`);
    if (hasPlaylist && leftovers.length) parts.push(`${leftovers.length} didn't match; they're under Unused files.`);
    if (skipped) parts.push(`${skipped} non-audio ${skipped === 1 ? "file" : "files"} skipped.`);
    setMessage({ tone: "ok", text: parts.join(" ") });
  };

  const runAutoMatch = () => {
    const { next, matched } = matchInto(tracks, files);
    setTracks(next);
    setMessage({ tone: matched ? "ok" : "warn", text: matched ? `Matched ${matched} more.` : "No more confident matches. Pick files by hand below." });
  };

  const update = (id: string, patch: Partial<Track>) => setTracks((all) => all.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const move = (from: number, to: number) =>
    setTracks((all) => {
      if (to < 0 || to >= all.length || from === to) return all;
      const next = [...all];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  const remove = (id: string) => setTracks((all) => all.filter((t) => t.id !== id));

  const togglePlay = (fileId: string) => {
    const file = fileById.get(fileId);
    if (!file) return;
    if (playing === fileId) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    audioRef.current?.pause();
    if (audioRef.current?.src) URL.revokeObjectURL(audioRef.current.src);
    const audio = new Audio(URL.createObjectURL(file.file));
    audio.onended = () => setPlaying(null);
    audio.play().catch(() => setPlaying(null));
    audioRef.current = audio;
    setPlaying(fileId);
  };

  const clearAll = () => {
    if (!window.confirm("Clear the whole tracklist? Your artwork stays.")) return;
    setTracks([]);
    setFiles([]);
    setMessage(null);
  };

  const card = "rounded-lg border border-border bg-card/40 p-4";

  return (
    <div className="space-y-6">
      {/* Add music */}
      <div className="grid gap-3 md:grid-cols-2">
        <form onSubmit={importPlaylist} className={card}>
          <h2 className="mb-1 flex items-center gap-2 text-sm font-medium">
            <Link2 className="h-4 w-4" /> From a playlist
          </h2>
          <p className="mb-3 text-xs text-muted-foreground">
            Spotify, YouTube or YouTube Music. Only the track names and lengths are read; the audio comes from your own files.
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://open.spotify.com/playlist/…"
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Playlist link"
            />
            <button
              type="submit"
              disabled={!link.trim() || importing}
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm text-background transition-opacity disabled:opacity-40"
            >
              {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Import
            </button>
          </div>
        </form>

        <div
          className={`${card} transition-colors ${dropActive ? "border-foreground bg-muted" : ""}`}
          onDragOver={(e) => {
            if (e.dataTransfer.types.includes("Files")) {
              e.preventDefault();
              setDropActive(true);
            }
          }}
          onDragLeave={() => setDropActive(false)}
          onDrop={(e) => {
            if (!e.dataTransfer.files.length) return;
            e.preventDefault();
            setDropActive(false);
            addFiles(e.dataTransfer.files);
          }}
        >
          <h2 className="mb-1 flex items-center gap-2 text-sm font-medium">
            <FileAudio className="h-4 w-4" /> From your computer
          </h2>
          <p className="mb-3 text-xs text-muted-foreground">
            Drop MP3s (or M4A, WAV, FLAC) here. They&apos;re matched to playlist tracks by their tags and file names.
          </p>
          <input
            ref={fileInput}
            type="file"
            accept={AUDIO_ACCEPT}
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-muted"
          >
            {readingFiles ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {readingFiles ? `Reading ${readingFiles} files…` : "Choose audio files"}
          </button>
        </div>
      </div>

      {message && (
        <p
          className={`flex items-start gap-2 rounded-md px-3 py-2 text-xs ${
            message.tone === "error"
              ? "bg-red-500/10 text-red-600 dark:text-red-400"
              : message.tone === "warn"
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                : "bg-muted text-muted-foreground"
          }`}
          role="status"
        >
          {message.tone === "ok" ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
          {message.text}
        </p>
      )}

      {/* Tracklist */}
      <section>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-medium">
            Tracklist{" "}
            <span className="font-normal text-muted-foreground">
              · {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
              {tracks.length > 0 && ` · ${withAudio} with audio`}
            </span>
          </h2>
          {tracks.length > 0 && (
            <div className="flex gap-1">
              {files.length > 0 && withAudio < tracks.length && (
                <button type="button" onClick={runAutoMatch} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Wand2 className="h-3.5 w-3.5" /> Match files
                </button>
              )}
              <button type="button" onClick={clearAll} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
          )}
        </div>

        {tracks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            No tracks yet. Import a playlist or add some audio files above.
          </div>
        ) : (
          <ol className="divide-y divide-border rounded-lg border border-border">
            {tracks.map((track, index) => {
              const file = track.fileId ? fileById.get(track.fileId) : null;
              const length = lengthOf(track);
              const lengthOff = file?.duration && track.duration ? Math.abs(file.duration - track.duration) > 20 : false;
              return (
                <li
                  key={track.id}
                  draggable
                  onDragStart={(e) => {
                    setDragIndex(index);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => {
                    if (dragIndex === null) return;
                    e.preventDefault();
                    setOverIndex(index);
                  }}
                  onDrop={(e) => {
                    if (dragIndex === null) return;
                    e.preventDefault();
                    move(dragIndex, index);
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  className={`group flex items-center gap-2 px-2 py-2 text-sm transition-colors ${
                    dragIndex === index ? "opacity-40" : ""
                  } ${overIndex === index && dragIndex !== index ? "bg-muted" : ""}`}
                >
                  <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/50" aria-hidden />
                  <span className="w-6 shrink-0 text-right font-mono text-xs text-muted-foreground">{index + 1}</span>

                  <div className="min-w-0 flex-1">
                    <input
                      value={track.title}
                      onChange={(e) => update(track.id, { title: e.target.value })}
                      className="w-full truncate rounded bg-transparent px-1 font-medium focus:bg-muted focus:outline-none"
                      aria-label={`Track ${index + 1} title`}
                    />
                    <input
                      value={track.artist}
                      onChange={(e) => update(track.id, { artist: e.target.value })}
                      placeholder="Artist"
                      className="w-full truncate rounded bg-transparent px-1 text-xs text-muted-foreground focus:bg-muted focus:outline-none"
                      aria-label={`Track ${index + 1} artist`}
                    />
                  </div>

                  {/* Audio source */}
                  <div className="hidden w-48 shrink-0 sm:block">
                    {file ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => togglePlay(file.id)}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={playing === file.id ? "Pause" : `Play ${file.file.name}`}
                        >
                          {playing === file.id ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        </button>
                        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground" title={file.file.name}>
                          {file.file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => update(track.id, { fileId: null, fileKey: null })}
                          className="rounded p-1 text-muted-foreground opacity-0 hover:text-foreground group-hover:opacity-100"
                          aria-label="Detach file"
                          title="Detach file"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <select
                        value=""
                        onChange={(e) => {
                          const picked = fileById.get(e.target.value);
                          if (picked) update(track.id, { fileId: picked.id, fileKey: picked.key });
                        }}
                        className="w-full rounded-md border border-dashed border-amber-500/50 bg-transparent px-2 py-1 text-xs text-amber-700 dark:text-amber-300"
                        aria-label={`Pick a file for track ${index + 1}`}
                        disabled={unusedFiles.length === 0}
                      >
                        <option value="">{unusedFiles.length ? "No audio · pick a file" : "No audio yet"}</option>
                        {unusedFiles.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.file.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <span
                    className={`w-11 shrink-0 text-right font-mono text-xs ${lengthOff ? "text-amber-600" : "text-muted-foreground"}`}
                    title={lengthOff ? `The file is ${formatTime(file!.duration)}; the playlist says ${formatTime(track.duration)}. Is it the right version?` : undefined}
                  >
                    {formatTime(length)}
                  </span>

                  <div className="flex shrink-0 items-center opacity-60 transition-opacity group-hover:opacity-100">
                    <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} className="rounded p-1 hover:bg-muted disabled:opacity-30" aria-label="Move up">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, index + 1)}
                      disabled={index === tracks.length - 1}
                      className="rounded p-1 hover:bg-muted disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => remove(track.id)} className="rounded p-1 hover:bg-muted hover:text-red-500" aria-label="Remove track">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        {tracks.length > 0 && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            Drag rows (or use the arrows) to reorder. Click a title or artist to edit it; that&apos;s what prints on the insert and goes into CD-Text.
          </p>
        )}
      </section>

      {/* Files that aren't on the disc */}
      {unusedFiles.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-medium">
              Unused files <span className="font-normal text-muted-foreground">· {unusedFiles.length}</span>
            </h2>
            <button
              type="button"
              onClick={() =>
                setTracks((all) => [
                  ...all,
                  ...unusedFiles.map((f) => ({ id: newId(), title: f.title, artist: f.artist ?? "", duration: f.duration, fileId: f.id, fileKey: f.key })),
                ])
              }
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" /> Add all to the disc
            </button>
          </div>
          <ul className="divide-y divide-border rounded-lg border border-dashed border-border">
            {unusedFiles.map((f) => (
              <li key={f.id} className="flex items-center gap-2 px-3 py-2 text-xs">
                <FileAudio className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate" title={f.file.name}>
                  {f.artist ? `${f.artist} — ${f.title}` : f.title}
                  <span className="ml-2 text-muted-foreground">{f.file.name}</span>
                </span>
                <span className="font-mono text-muted-foreground">{formatTime(f.duration)}</span>
                <button
                  type="button"
                  onClick={() =>
                    setTracks((all) => [...all, { id: newId(), title: f.title, artist: f.artist ?? "", duration: f.duration, fileId: f.id, fileKey: f.key }])
                  }
                  className="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setFiles((all) => all.filter((x) => x.id !== f.id))}
                  className="rounded p-1 text-muted-foreground hover:text-red-500"
                  aria-label={`Remove ${f.file.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tracks.length > 0 && (
        <div className="flex justify-end">
          <button type="button" onClick={onNext} className="rounded-md bg-foreground px-4 py-2 text-sm text-background">
            Next: artwork →
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- Step 2: artwork ----------

function ArtworkStep({
  design,
  setDesign,
  photo,
  setPhoto,
  photoImage,
  tracks,
  lengthOf,
  totalSeconds,
  onNext,
}: {
  design: Design;
  setDesign: React.Dispatch<React.SetStateAction<Design>>;
  photo: string | null;
  setPhoto: (value: string | null) => void;
  photoImage: HTMLImageElement | null;
  tracks: Track[];
  lengthOf: (t: Track) => number | null;
  totalSeconds: number;
  onNext: () => void;
}) {
  const [side, setSide] = useState<"front" | "back">("front");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const [fontsReady, setFontsReady] = useState(0);

  const set = <K extends keyof Design>(key: K, value: Design[K]) => setDesign((d) => ({ ...d, [key]: value }));

  useEffect(() => {
    let alive = true;
    loadFonts(design.font).then(() => alive && setFontsReady((n) => n + 1));
    return () => {
      alive = false;
    };
  }, [design.font]);

  const backTracks = tracks.map((t) => ({ title: t.title, artist: t.artist, duration: lengthOf(t) }));

  useEffect(() => {
    if (frontRef.current) drawFront(frontRef.current, design, photoImage);
    if (backRef.current) drawBack(backRef.current, design, backTracks, totalSeconds);
    // backTracks is rebuilt each render; its content is covered by tracks + lengthOf.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design, photoImage, tracks, lengthOf, totalSeconds, fontsReady, side]);

  const downloadSide = async (which: "front" | "back") => {
    const canvas = which === "front" ? frontRef.current : backRef.current;
    if (!canvas) return;
    const blob = await canvasToBlob(canvas);
    saveBlob(blob, `${safeName(design.title)} - ${which === "front" ? "front cover" : "back insert"}.png`);
  };

  const label = "mb-1 block text-xs text-muted-foreground";
  const field = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const chip = (active: boolean) =>
    `rounded-md border px-2.5 py-1 text-xs transition-colors ${active ? "border-foreground bg-foreground text-background" : "border-border hover:bg-muted"}`;

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      {/* Controls */}
      <div className="space-y-4">
        <div>
          <label className={label} htmlFor="cd-title">Title</label>
          <input id="cd-title" value={design.title} onChange={(e) => set("title", e.target.value)} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="cd-subtitle">Subtitle</label>
          <input
            id="cd-subtitle"
            value={design.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
            placeholder="for Ada · summer 2026 (optional)"
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="cd-note">Note on the back</label>
          <input id="cd-note" value={design.note} onChange={(e) => set("note", e.target.value)} placeholder="Play it loud." className={field} />
        </div>

        <div>
          <span className={label}>Layout</span>
          <div className="flex flex-wrap gap-1.5">
            {COVER_STYLES.map((s) => (
              <button key={s.key} type="button" onClick={() => set("style", s.key)} className={chip(design.style === s.key)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className={label}>Font</span>
          <div className="flex flex-wrap gap-1.5">
            {COVER_FONTS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => set("font", f.key)}
                className={chip(design.font === f.key)}
                style={{ fontFamily: f.family }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className={label}>Colours</span>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {PALETTES.map((p) => {
              const active = p.background === design.background && p.ink === design.ink && p.accent === design.accent;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setDesign((d) => ({ ...d, background: p.background, ink: p.ink, accent: p.accent }))}
                  className={`flex items-center gap-1 rounded-md border px-1.5 py-1 text-xs ${active ? "border-foreground" : "border-border hover:bg-muted"}`}
                  title={p.name}
                >
                  <span className="flex overflow-hidden rounded-sm">
                    {[p.background, p.ink, p.accent].map((c) => (
                      <span key={c} className="h-4 w-3" style={{ background: c }} />
                    ))}
                  </span>
                  {p.name}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground">
            {(
              [
                ["background", "Paper"],
                ["ink", "Ink"],
                ["accent", "Accent"],
              ] as [keyof Design, string][]
            ).map(([key, name]) => (
              <label key={key} className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={design[key] as string}
                  onChange={(e) => set(key, e.target.value as never)}
                  className="h-6 w-6 cursor-pointer rounded border border-border bg-transparent p-0"
                />
                {name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className={label}>Photo (for the Photo and Rings layouts)</span>
          <input
            ref={photoInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              try {
                setPhoto(await shrinkPhoto(file));
                setPhotoError(null);
                if (design.style !== "photo" && design.style !== "rings") set("style", "photo");
              } catch (error) {
                setPhotoError(error instanceof Error ? error.message : "That image couldn't be opened.");
              }
            }}
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => photoInput.current?.click()} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted">
              <ImagePlus className="h-3.5 w-3.5" /> {photo ? "Change photo" : "Add a photo"}
            </button>
            {photo && (
              <button type="button" onClick={() => setPhoto(null)} className="rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
                Remove
              </button>
            )}
          </div>
          {photoError && <p className="mt-1 text-xs text-red-500">{photoError}</p>}
        </div>

        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={design.showTimes} onChange={(e) => set("showTimes", e.target.checked)} />
          Show track lengths on the back
        </label>
      </div>

      {/* Preview */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex gap-1">
            {(["front", "back"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setSide(s)} className={chip(side === s)}>
                {s === "front" ? "Front cover" : "Back insert"}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => downloadSide(side)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
            <Download className="h-3.5 w-3.5" /> PNG
          </button>
        </div>
        <div className="rounded-lg bg-muted/50 p-4">
          <canvas
            ref={frontRef}
            className={`mx-auto w-full shadow-lg ${side === "front" ? "block" : "hidden"}`}
            style={{ aspectRatio: `${FRONT_SIZE.width} / ${FRONT_SIZE.height}` }}
            aria-label="Front cover preview"
          />
          <canvas
            ref={backRef}
            className={`mx-auto w-full shadow-lg ${side === "back" ? "block" : "hidden"}`}
            style={{ aspectRatio: `${BACK_SIZE.width} / ${BACK_SIZE.height}` }}
            aria-label="Back insert preview"
          />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {side === "front"
            ? "120 × 120 mm at 300 dpi: the booklet front of a standard jewel case. Print at 100% (no “fit to page”) and trim."
            : "151 × 118 mm at 300 dpi: the tray card behind the disc. The coloured strips are the spines; fold along the dotted lines."}
        </p>
        <div className="mt-4 flex justify-end">
          <button type="button" onClick={onNext} className="rounded-md bg-foreground px-4 py-2 text-sm text-background">
            Next: burn folder →
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Step 3: export ----------

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

type DirectoryHandle = {
  getDirectoryHandle(name: string, options: { create: boolean }): Promise<DirectoryHandle>;
  getFileHandle(name: string, options: { create: boolean }): Promise<{ createWritable(): Promise<{ write(data: Blob): Promise<void>; close(): Promise<void> }> }>;
};

function ExportStep({
  tracks,
  fileById,
  lengthOf,
  design,
  photoImage,
  settings,
  setSettings,
  totalSeconds,
  goToTracks,
}: {
  tracks: Track[];
  fileById: Map<string, LocalFile>;
  lengthOf: (t: Track) => number | null;
  design: Design;
  photoImage: HTMLImageElement | null;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  totalSeconds: number;
  goToTracks: () => void;
}) {
  const [progress, setProgress] = useState<{ label: string; done: number; total: number } | null>(null);
  const [result, setResult] = useState<{ tone: "ok" | "error"; text: string; notes: string[] } | null>(null);
  const [canPickFolder, setCanPickFolder] = useState(false);

  useEffect(() => setCanPickFolder(typeof window !== "undefined" && "showDirectoryPicker" in window), []);

  const onDisc = tracks.filter((t) => t.fileId && fileById.get(t.fileId));
  const missing = tracks.length - onDisc.length;
  const over = totalSeconds > CD_SECONDS;
  const folder = safeName(design.title);
  const busy = progress !== null;

  /** Converts the audio and draws the artwork. Returns every file for the folder. */
  const prepare = async (): Promise<{ entries: ZipEntry[]; notes: string[] }> => {
    const notes: string[] = [];
    const entries: ZipEntry[] = [];
    const total = onDisc.length + 2;
    const rows: { name: string; track: Track; seconds: number | null }[] = [];

    for (let i = 0; i < onDisc.length; i++) {
      const track = onDisc[i];
      const local = fileById.get(track.fileId!)!;
      const number = String(i + 1).padStart(2, "0");
      const base = safeName(`${number} - ${track.artist ? `${track.artist} - ` : ""}${track.title}`);
      setProgress({ label: `${settings.format === "wav" ? "Converting" : "Adding"} ${i + 1} of ${onDisc.length}: ${track.title}`, done: i, total });

      let data: Blob = local.file;
      let ext = extensionOf(local.file.name);
      if (settings.format === "wav") {
        if (canDecode(local.file)) {
          try {
            data = await toCdWav(local.file);
            ext = "wav";
          } catch {
            notes.push(`${track.title}: this browser couldn't convert it, so the original file was kept.`);
          }
        } else {
          notes.push(`${track.title}: this browser can't read ${ext.toUpperCase()} files, so the original was kept.`);
        }
      }
      const name = `${base}.${ext}`;
      entries.push({ path: `${folder}/${name}`, data });
      rows.push({ name, track, seconds: lengthOf(track) });
    }

    setProgress({ label: "Drawing the artwork", done: onDisc.length, total });
    await loadFonts(design.font);
    const canvas = document.createElement("canvas");
    drawFront(canvas, design, photoImage);
    entries.push({ path: `${folder}/Artwork/Front cover (120x120mm).png`, data: await canvasToBlob(canvas) });
    drawBack(
      canvas,
      design,
      onDisc.map((t) => ({ title: t.title, artist: t.artist, duration: lengthOf(t) })),
      rows.reduce((s, r) => s + (r.seconds ?? 0), 0) + settings.gap * Math.max(0, rows.length - 1)
    );
    entries.push({ path: `${folder}/Artwork/Back insert (151x118mm).png`, data: await canvasToBlob(canvas) });

    setProgress({ label: "Writing the tracklist and burn files", done: onDisc.length + 1, total });
    const text = (s: string) => new Blob([s], { type: "text/plain;charset=utf-8" });
    const q = (s: string) => s.replace(/"/g, "'");
    const performer = design.subtitle.trim();

    // Tracklist
    entries.push({
      path: `${folder}/Tracklist.txt`,
      data: text(
        [
          design.title,
          performer,
          "",
          ...rows.map((r, i) => `${String(i + 1).padStart(2, "0")}. ${r.track.title}${r.track.artist ? ` — ${r.track.artist}` : ""}  (${formatTime(r.seconds)})`),
          "",
          `Total: ${formatTime(rows.reduce((s, r) => s + (r.seconds ?? 0), 0))}`,
          design.note.trim(),
        ]
          .filter((line, i, all) => line !== "" || all[i - 1] !== "")
          .join("\n")
      ),
    });

    // M3U playlist: drag into Apple Music / Windows Media Player in this order.
    entries.push({
      path: `${folder}/${folder}.m3u`,
      data: text(
        ["#EXTM3U", ...rows.flatMap((r) => [`#EXTINF:${Math.round(r.seconds ?? -1)},${r.track.artist ? `${r.track.artist} - ` : ""}${r.track.title}`, r.name])].join("\n") + "\n"
      ),
    });

    // CUE sheet: for burning apps like ImgBurn; carries CD-Text and the gaps.
    const cueType = (name: string) => (name.endsWith(".wav") ? "WAVE" : name.endsWith(".mp3") ? "MP3" : "WAVE");
    entries.push({
      path: `${folder}/${folder}.cue`,
      data: text(
        [
          `REM COMMENT "Made with Burn CD"`,
          performer ? `PERFORMER "${q(performer)}"` : null,
          `TITLE "${q(design.title)}"`,
          ...rows.flatMap((r, i) => [
            `FILE "${q(r.name)}" ${cueType(r.name)}`,
            `  TRACK ${String(i + 1).padStart(2, "0")} AUDIO`,
            `    TITLE "${q(r.track.title)}"`,
            r.track.artist ? `    PERFORMER "${q(r.track.artist)}"` : null,
            i > 0 && settings.gap ? `    PREGAP 00:0${settings.gap}:00` : null,
            `    INDEX 01 00:00:00`,
          ]),
        ]
          .filter(Boolean)
          .join("\r\n") + "\r\n"
      ),
    });

    entries.push({
      path: `${folder}/HOW TO BURN.txt`,
      data: text(
        `${design.title}
${"=".repeat(Math.min(60, design.title.length))}

This folder has everything for an audio CD: ${rows.length} tracks in order${settings.format === "wav" ? " (already CD audio: 44.1 kHz, 16-bit WAV)" : ""}, the artwork, and two playlist files.
You'll need a blank CD-R (80 minutes / 700 MB) and a CD burner (most are USB these days).

On a Mac (Apple Music)
1. Open Music. File > New > Playlist, and name it "${design.title}".
2. Drag the audio files from this folder into the playlist. They're numbered, so sort by name to keep the order.
   (Or: File > Library > Import Playlist… and choose "${folder}.m3u".)
3. With the playlist open: File > Burn Playlist to Disc.
4. Choose "Audio CD", set "Gap Between Songs" to ${settings.gap ? "2 seconds" : "None"}, and tick "Include CD Text".
5. Click Burn.

On Windows
- ImgBurn (free): "Write image file to disc", then choose "${folder}.cue". The track names go on as CD-Text.
- Or Windows Media Player: open the Burn tab, choose "Audio CD", drag the files in order, and click Start burn.

The artwork
- Print the PNGs at 100% / "actual size" (not "fit to page") on matte photo paper or thick paper.
- Front cover (120 × 120 mm) goes in the lid. Back insert (151 × 118 mm) goes under the disc tray; fold along the dotted lines so the coloured spines sit in the case edges.
`
      ),
    });

    return { entries, notes };
  };

  const run = async (mode: "zip" | "folder") => {
    setResult(null);
    let directory: DirectoryHandle | null = null;
    if (mode === "folder") {
      try {
        directory = await (window as unknown as { showDirectoryPicker(o: object): Promise<DirectoryHandle> }).showDirectoryPicker({ mode: "readwrite" });
      } catch {
        return; // Cancelled.
      }
    }
    try {
      const { entries, notes } = await prepare();
      if (directory) {
        for (let i = 0; i < entries.length; i++) {
          setProgress({ label: `Saving ${i + 1} of ${entries.length}`, done: i, total: entries.length });
          const parts = entries[i].path.split("/");
          let dir = directory;
          for (const part of parts.slice(0, -1)) dir = await dir.getDirectoryHandle(part, { create: true });
          const handle = await dir.getFileHandle(parts[parts.length - 1], { create: true });
          const writable = await handle.createWritable();
          await writable.write(entries[i].data);
          await writable.close();
        }
        setResult({ tone: "ok", text: `Saved the “${folder}” folder. Open HOW TO BURN.txt inside it for the next steps.`, notes });
      } else {
        setProgress({ label: "Zipping it up", done: 0, total: entries.length });
        const zip = await makeZip(entries, (done) => setProgress({ label: "Zipping it up", done, total: entries.length }));
        saveBlob(zip, `${folder}.zip`);
        setResult({ tone: "ok", text: `Downloaded ${folder}.zip (${(zip.size / 1024 / 1024).toFixed(1)} MB). Unzip it and open HOW TO BURN.txt.`, notes });
      }
    } catch (error) {
      setResult({
        tone: "error",
        text: error instanceof Error ? `Something went wrong: ${error.message}` : "Something went wrong preparing the folder.",
        notes: [],
      });
    } finally {
      setProgress(null);
    }
  };

  const check = (ok: boolean, text: React.ReactNode, warn = false) => (
    <li className="flex items-start gap-2">
      {ok ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      ) : (
        <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${warn ? "text-amber-500" : "text-red-500"}`} />
      )}
      <span>{text}</span>
    </li>
  );

  const option = (active: boolean) =>
    `flex cursor-pointer gap-3 rounded-lg border p-3 text-sm transition-colors ${active ? "border-foreground bg-muted/50" : "border-border hover:bg-muted/30"}`;

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 text-sm font-medium">Before you burn</h2>
        <ul className="space-y-1.5 text-sm">
          {check(tracks.length > 0, tracks.length ? `${tracks.length} tracks on the list` : "No tracks yet")}
          {tracks.length > 0 &&
            check(
              missing === 0,
              missing === 0 ? (
                "Every track has its audio file"
              ) : (
                <>
                  {missing} {missing === 1 ? "track has" : "tracks have"} no audio file and will be left out.{" "}
                  <button type="button" onClick={goToTracks} className="underline underline-offset-2">
                    Add files
                  </button>
                </>
              ),
              true
            )}
          {check(!over, over ? `It's ${formatTime(totalSeconds - CD_SECONDS)} too long for an 80-minute CD` : `Fits on an 80-minute CD (${formatTime(totalSeconds)})`)}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium">Audio format</h2>
        <div className="grid gap-2 md:grid-cols-2">
          <label className={option(settings.format === "wav")}>
            <input type="radio" name="format" checked={settings.format === "wav"} onChange={() => setSettings((s) => ({ ...s, format: "wav" }))} className="mt-1" />
            <span>
              <span className="font-medium">CD audio (WAV)</span> <span className="text-xs text-muted-foreground">recommended</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Converted here in your browser to 44.1 kHz, 16-bit stereo, exactly what an audio CD holds. Works with any burning app. About 10 MB a minute.
              </span>
            </span>
          </label>
          <label className={option(settings.format === "original")}>
            <input type="radio" name="format" checked={settings.format === "original"} onChange={() => setSettings((s) => ({ ...s, format: "original" }))} className="mt-1" />
            <span>
              <span className="font-medium">Keep my files as they are</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Smaller and faster. Apple Music and most burning apps convert MP3s while burning.
              </span>
            </span>
          </label>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium">Between tracks</h2>
        <div className="flex gap-1.5">
          {(
            [
              [2, "2-second gap (standard)"],
              [0, "No gap (for live or mixed albums)"],
            ] as [0 | 2, string][]
          ).map(([gap, text]) => (
            <button
              key={gap}
              type="button"
              onClick={() => setSettings((s) => ({ ...s, gap }))}
              className={`rounded-md border px-3 py-1.5 text-xs ${settings.gap === gap ? "border-foreground bg-foreground text-background" : "border-border hover:bg-muted"}`}
            >
              {text}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border p-4">
        <h2 className="mb-1 text-sm font-medium">Your burn folder</h2>
        <pre className="mb-4 overflow-x-auto font-mono text-[11px] leading-relaxed text-muted-foreground">
          {[
            `${folder}/`,
            ...(
              [
                [`01 - …${settings.format === "wav" ? ".wav" : ".mp3"}`, `${onDisc.length} tracks, in order`],
                ["Artwork/", "front cover + back insert (300 dpi PNG)"],
                ["Tracklist.txt", ""],
                [`${folder}.m3u`, "playlist for Apple Music / Media Player"],
                [`${folder}.cue`, "for burning apps, with CD-Text"],
                ["HOW TO BURN.txt", "step-by-step for Mac and Windows"],
              ] as [string, string][]
            ).map(([name, about]) => `  ${name.padEnd(28)}${about}`),
          ].join("\n")}
        </pre>

        {progress ? (
          <div role="status">
            <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> {progress.label}
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-foreground transition-all" style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Keep this tab open. Converting takes a few seconds a song.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => run("zip")}
              disabled={busy || onDisc.length === 0}
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm text-background disabled:opacity-40"
            >
              <Download className="h-4 w-4" /> Download .zip
            </button>
            {canPickFolder && (
              <button
                type="button"
                onClick={() => run("folder")}
                disabled={busy || onDisc.length === 0}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm hover:bg-muted disabled:opacity-40"
                title="Writes the folder straight to your computer (Chrome, Edge)"
              >
                <FolderDown className="h-4 w-4" /> Save as a folder…
              </button>
            )}
          </div>
        )}
        {onDisc.length === 0 && !progress && (
          <p className="mt-2 text-xs text-muted-foreground">Add audio files to your tracks first; the folder needs something to burn.</p>
        )}
        {over && onDisc.length > 0 && !progress && (
          <p className="mt-2 text-xs text-amber-600">It&apos;s too long for one CD; the burner will stop partway. You can still download it.</p>
        )}

        {result && (
          <div className={`mt-3 rounded-md px-3 py-2 text-xs ${result.tone === "ok" ? "bg-muted" : "bg-red-500/10 text-red-600 dark:text-red-400"}`} role="status">
            <p>{result.text}</p>
            {result.notes.length > 0 && (
              <ul className="mt-1 list-disc pl-4 text-muted-foreground">
                {result.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <details className="rounded-lg border border-border p-4 text-sm">
        <summary className="cursor-pointer font-medium">How to burn it</summary>
        <div className="mt-3 space-y-3 text-xs leading-relaxed text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">Mac (Apple Music)</p>
            <ol className="list-decimal pl-4">
              <li>Unzip the folder. In Music, make a new playlist and drag the audio files in (they&apos;re numbered, so they stay in order).</li>
              <li>File → Burn Playlist to Disc → Audio CD. Set the gap to {settings.gap ? "2 seconds" : "None"} and tick “Include CD Text”.</li>
            </ol>
          </div>
          <div>
            <p className="font-medium text-foreground">Windows</p>
            <p>ImgBurn: “Write image file to disc” and pick the .cue file. Or Windows Media Player’s Burn tab → Audio CD.</p>
          </div>
          <p>Use a CD-R (not CD-RW) for car and older stereos. Burning slower (16× or less) gives fewer skips.</p>
        </div>
      </details>
    </div>
  );
}
