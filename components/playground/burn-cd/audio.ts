/**
 * Audio helpers that run entirely in the browser: reading tags and lengths,
 * and converting to CD audio (WAV, 44.1 kHz, 16-bit, stereo) with the Web Audio API.
 */

export const CD_SAMPLE_RATE = 44100;

export interface FileTags {
  title: string | null;
  artist: string | null;
  album: string | null;
}

/** Length in seconds, read from the file's header by the browser (fast; nothing is decoded). */
export function readDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    const done = (value: number | null) => {
      URL.revokeObjectURL(url);
      audio.removeAttribute("src");
      resolve(value);
    };
    audio.preload = "metadata";
    audio.onloadedmetadata = () => done(Number.isFinite(audio.duration) ? audio.duration : null);
    audio.onerror = () => done(null);
    setTimeout(() => done(null), 15000);
    audio.src = url;
  });
}

function decodeText(bytes: Uint8Array): string {
  const encoding = bytes[0];
  const body = bytes.subarray(1);
  let text: string;
  if (encoding === 1 || encoding === 2) {
    // UTF-16, with a byte-order mark for 1, big-endian for 2.
    let littleEndian = encoding === 1;
    let start = 0;
    if (body[0] === 0xff && body[1] === 0xfe) {
      littleEndian = true;
      start = 2;
    } else if (body[0] === 0xfe && body[1] === 0xff) {
      littleEndian = false;
      start = 2;
    }
    text = new TextDecoder(littleEndian ? "utf-16le" : "utf-16be").decode(body.subarray(start));
  } else if (encoding === 3) {
    text = new TextDecoder("utf-8").decode(body);
  } else {
    text = new TextDecoder("latin1").decode(body);
  }
  return text.replace(/\0+$/g, "").split("\0")[0].trim();
}

/** Reads title/artist/album from an MP3's ID3v2 tag. Other formats get nulls (the file name is used instead). */
export async function readTags(file: File): Promise<FileTags> {
  const empty: FileTags = { title: null, artist: null, album: null };
  try {
    const head = new Uint8Array(await file.slice(0, 10).arrayBuffer());
    if (head[0] !== 0x49 || head[1] !== 0x44 || head[2] !== 0x33) return empty; // "ID3"
    const version = head[3];
    const size = (head[6] << 21) | (head[7] << 14) | (head[8] << 7) | head[9];
    const tag = new Uint8Array(await file.slice(10, 10 + Math.min(size, 2_000_000)).arrayBuffer());

    const wanted: Record<string, keyof FileTags> =
      version === 2
        ? { TT2: "title", TP1: "artist", TAL: "album" }
        : { TIT2: "title", TPE1: "artist", TALB: "album" };
    const idLength = version === 2 ? 3 : 4;
    const headerLength = version === 2 ? 6 : 10;
    const tags = { ...empty };

    let offset = 0;
    while (offset + headerLength < tag.length) {
      const id = String.fromCharCode(...tag.subarray(offset, offset + idLength));
      if (!/^[A-Z0-9]+$/.test(id)) break; // Padding.
      let frameSize: number;
      if (version === 2) {
        frameSize = (tag[offset + 3] << 16) | (tag[offset + 4] << 8) | tag[offset + 5];
      } else if (version === 4) {
        frameSize = (tag[offset + 4] << 21) | (tag[offset + 5] << 14) | (tag[offset + 6] << 7) | tag[offset + 7];
      } else {
        frameSize = ((tag[offset + 4] << 24) | (tag[offset + 5] << 16) | (tag[offset + 6] << 8) | tag[offset + 7]) >>> 0;
      }
      const start = offset + headerLength;
      if (frameSize <= 0 || start + frameSize > tag.length) break;
      const key = wanted[id];
      if (key && !tags[key]) tags[key] = decodeText(tag.subarray(start, start + frameSize)) || null;
      offset = start + frameSize;
    }
    return tags;
  } catch {
    return empty;
  }
}

/** Best guess at artist and title from a name like "03 - Artist - Song.mp3". */
export function guessFromFileName(name: string): { title: string; artist: string | null } {
  const base = name.replace(/\.[a-z0-9]{2,4}$/i, "").replace(/_/g, " ").trim();
  const withoutNumber = base.replace(/^\d{1,3}\s*[-.)]?\s+/, "");
  const parts = withoutNumber.split(/\s+-\s+/);
  if (parts.length >= 2) return { artist: parts[0].trim(), title: parts.slice(1).join(" - ").trim() };
  return { title: withoutNumber, artist: null };
}

/** Can this browser decode this file? (Safari can't do Ogg, for example.) */
export function canDecode(file: File): boolean {
  const audio = document.createElement("audio");
  const type = file.type || guessType(file.name);
  return !!type && audio.canPlayType(type) !== "";
}

function guessType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  return (
    { mp3: "audio/mpeg", m4a: "audio/mp4", aac: "audio/aac", wav: "audio/wav", flac: "audio/flac", ogg: "audio/ogg", opus: "audio/ogg" }[
      ext ?? ""
    ] ?? ""
  );
}

/**
 * Decodes any browser-supported audio file and writes it as CD audio:
 * 44.1 kHz, 16-bit, stereo WAV — what audio CDs actually hold.
 */
export async function toCdWav(file: File): Promise<Blob> {
  const data = await file.arrayBuffer();
  // decodeAudioData resamples to the context's rate, so decode straight at 44.1 kHz.
  const context = new OfflineAudioContext(2, CD_SAMPLE_RATE, CD_SAMPLE_RATE);
  const decoded = await context.decodeAudioData(data);

  // Mix mono up to stereo (or more channels down to stereo) by rendering through a stereo context.
  let buffer = decoded;
  if (decoded.numberOfChannels !== 2 || decoded.sampleRate !== CD_SAMPLE_RATE) {
    const render = new OfflineAudioContext(2, Math.ceil(decoded.duration * CD_SAMPLE_RATE), CD_SAMPLE_RATE);
    const source = render.createBufferSource();
    source.buffer = decoded;
    source.connect(render.destination);
    source.start();
    buffer = await render.startRendering();
  }

  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  const frames = buffer.length;
  const dataSize = frames * 4;
  const out = new DataView(new ArrayBuffer(44 + dataSize));

  const ascii = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) out.setUint8(offset + i, text.charCodeAt(i));
  };
  ascii(0, "RIFF");
  out.setUint32(4, 36 + dataSize, true);
  ascii(8, "WAVE");
  ascii(12, "fmt ");
  out.setUint32(16, 16, true);
  out.setUint16(20, 1, true); // PCM
  out.setUint16(22, 2, true); // stereo
  out.setUint32(24, CD_SAMPLE_RATE, true);
  out.setUint32(28, CD_SAMPLE_RATE * 4, true);
  out.setUint16(32, 4, true);
  out.setUint16(34, 16, true);
  ascii(36, "data");
  out.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < frames; i++) {
    for (const channel of [left, right]) {
      const sample = Math.max(-1, Math.min(1, channel[i]));
      out.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([out.buffer], { type: "audio/wav" });
}
