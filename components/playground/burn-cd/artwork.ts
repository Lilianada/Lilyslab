/**
 * Draws the CD artwork on a canvas at print size (300 dpi):
 * - front cover: 120 × 120 mm (the booklet front of a standard jewel case)
 * - back insert: 151 × 118 mm (the tray card, with a 6.5 mm spine on each side)
 */

export const DPI = 300;
const mm = (value: number) => Math.round((value / 25.4) * DPI);

export const FRONT_SIZE = { width: mm(120), height: mm(120) };
export const BACK_SIZE = { width: mm(151), height: mm(118) };
const SPINE = mm(6.5);

export type CoverStyle = "minimal" | "bold" | "rings" | "photo";
export type CoverFont = "sans" | "serif" | "mono" | "pixel";

export const COVER_STYLES: { key: CoverStyle; label: string }[] = [
  { key: "minimal", label: "Minimal" },
  { key: "bold", label: "Big type" },
  { key: "rings", label: "Rings" },
  { key: "photo", label: "Photo" },
];

export const COVER_FONTS: { key: CoverFont; label: string; family: string }[] = [
  { key: "sans", label: "Sans", family: '"PP Mori", system-ui, sans-serif' },
  { key: "serif", label: "Serif", family: '"Sorts Mill Goudy", Georgia, serif' },
  { key: "mono", label: "Mono", family: '"Nitti", ui-monospace, monospace' },
  { key: "pixel", label: "Pixel", family: '"Rainy Hearts", ui-monospace, monospace' },
];

export interface Design {
  title: string;
  subtitle: string;
  note: string;
  style: CoverStyle;
  font: CoverFont;
  background: string;
  ink: string;
  accent: string;
  /** Show track lengths on the back. */
  showTimes: boolean;
}

export const DEFAULT_DESIGN: Design = {
  title: "Untitled Mix",
  subtitle: "",
  note: "",
  style: "minimal",
  font: "sans",
  background: "#f3efe6",
  ink: "#1d1b18",
  accent: "#e4572e",
  showTimes: true,
};

export const PALETTES: { name: string; background: string; ink: string; accent: string }[] = [
  { name: "Paper", background: "#f3efe6", ink: "#1d1b18", accent: "#e4572e" },
  { name: "Night", background: "#14161c", ink: "#f1f1ee", accent: "#8ab4f8" },
  { name: "Blush", background: "#f6d7d3", ink: "#3b1f2b", accent: "#b23a48" },
  { name: "Moss", background: "#2f3e2c", ink: "#e9edd8", accent: "#c9d77a" },
  { name: "Sky", background: "#cfe3f2", ink: "#16324f", accent: "#ff8c42" },
  { name: "Lilac", background: "#e3dcf5", ink: "#2c2346", accent: "#6b4fbb" },
];

export interface BackTrack {
  title: string;
  artist: string;
  duration: number | null;
}

const familyOf = (font: CoverFont) => COVER_FONTS.find((f) => f.key === font)!.family;

/** Waits for the site's fonts so the canvas doesn't draw with a fallback. */
export async function loadFonts(font: CoverFont) {
  const family = familyOf(font).split(",")[0];
  try {
    await Promise.all([document.fonts.load(`400 40px ${family}`), document.fonts.load(`700 40px ${family}`)]);
  } catch {
    // Fallback fonts are fine.
  }
}

export const formatTime = (seconds: number | null) => {
  if (seconds == null) return "–:––";
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** Splits text into lines that fit `maxWidth`. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    lines.push(line);
  }
  return lines;
}

/** Shrinks text until it fits in one line. */
function fit(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, size: number, weight: number, family: string) {
  let s = size;
  ctx.font = `${weight} ${s}px ${family}`;
  while (s > 8 && ctx.measureText(text).width > maxWidth) {
    s -= 2;
    ctx.font = `${weight} ${s}px ${family}`;
  }
  return s;
}

/** Truncates with an ellipsis to fit. */
function clip(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

function drawImageCover(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
  const iw = image.naturalWidth * scale;
  const ih = image.naturalHeight * scale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(image, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  ctx.restore();
}

export function drawFront(canvas: HTMLCanvasElement, design: Design, image: HTMLImageElement | null) {
  const { width: W, height: H } = FRONT_SIZE;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const family = familyOf(design.font);
  const pad = mm(9);
  const title = design.title.trim() || "Untitled Mix";
  const subtitle = design.subtitle.trim();

  ctx.fillStyle = design.background;
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "alphabetic";

  if (design.style === "photo" && image) {
    drawImageCover(ctx, image, 0, 0, W, H);
    const shade = ctx.createLinearGradient(0, H * 0.45, 0, H);
    shade.addColorStop(0, "rgba(0,0,0,0)");
    shade.addColorStop(1, "rgba(0,0,0,0.65)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, W, H);
  }

  if (design.style === "minimal") {
    ctx.strokeStyle = design.ink;
    ctx.lineWidth = mm(0.4);
    ctx.strokeRect(pad / 2, pad / 2, W - pad, H - pad);
    ctx.fillStyle = design.accent;
    ctx.beginPath();
    ctx.arc(W - pad * 1.6, pad * 1.6, mm(4), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = design.ink;
    ctx.font = `700 ${mm(11)}px ${family}`;
    const lines = wrap(ctx, title, W - pad * 2);
    const lineHeight = mm(12);
    let y = H - pad - (subtitle ? mm(9) : 0) - (lines.length - 1) * lineHeight;
    for (const line of lines) {
      ctx.fillText(line, pad, y);
      y += lineHeight;
    }
    if (subtitle) {
      ctx.font = `400 ${mm(4.2)}px ${family}`;
      ctx.globalAlpha = 0.75;
      ctx.fillText(clip(ctx, subtitle, W - pad * 2), pad, H - pad);
      ctx.globalAlpha = 1;
    }
  }

  if (design.style === "bold") {
    ctx.fillStyle = design.ink;
    const text = title.toUpperCase();
    // Largest size whose wrapped lines fill the square without spilling.
    let size = mm(40);
    let lines: string[] = [];
    while (size > mm(8)) {
      ctx.font = `700 ${size}px ${family}`;
      lines = wrap(ctx, text, W - pad * 2);
      const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
      if (widest <= W - pad * 2 && lines.length * size * 0.92 <= H - pad * 2 - mm(14)) break;
      size -= mm(1);
    }
    let y = pad + size * 0.8;
    for (const line of lines) {
      ctx.fillText(line, pad, y);
      y += size * 0.92;
    }
    ctx.fillStyle = design.accent;
    ctx.fillRect(pad, H - pad - mm(9), mm(14), mm(1.6));
    if (subtitle) {
      ctx.fillStyle = design.ink;
      ctx.font = `400 ${mm(4.2)}px ${family}`;
      ctx.fillText(clip(ctx, subtitle, W - pad * 2), pad, H - pad);
    }
  }

  if (design.style === "rings") {
    const cx = W / 2;
    const cy = H / 2 - mm(6);
    const outer = mm(46);
    if (image) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, outer, 0, Math.PI * 2);
      ctx.clip();
      drawImageCover(ctx, image, cx - outer, cy - outer, outer * 2, outer * 2);
      ctx.restore();
    }
    ctx.strokeStyle = design.ink;
    for (let i = 0; i < 14; i++) {
      ctx.globalAlpha = image ? 0.35 : i % 3 === 0 ? 0.9 : 0.35;
      ctx.lineWidth = i % 3 === 0 ? mm(0.5) : mm(0.25);
      ctx.beginPath();
      ctx.arc(cx, cy, outer - i * mm(2.3), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = design.accent;
    ctx.beginPath();
    ctx.arc(cx, cy, mm(7.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = design.background;
    ctx.beginPath();
    ctx.arc(cx, cy, mm(2.2), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = design.ink;
    ctx.textAlign = "center";
    fit(ctx, title, W - pad * 2, mm(8), 700, family);
    ctx.fillText(title, cx, H - pad - (subtitle ? mm(6) : 0));
    if (subtitle) {
      ctx.font = `400 ${mm(3.8)}px ${family}`;
      ctx.globalAlpha = 0.75;
      ctx.fillText(clip(ctx, subtitle, W - pad * 2), cx, H - pad);
      ctx.globalAlpha = 1;
    }
    ctx.textAlign = "left";
  }

  if (design.style === "photo") {
    const ink = image ? "#ffffff" : design.ink;
    ctx.fillStyle = ink;
    ctx.font = `700 ${mm(10)}px ${family}`;
    const lines = wrap(ctx, title, W - pad * 2);
    const lineHeight = mm(11);
    let y = H - pad - (subtitle ? mm(8) : 0) - (lines.length - 1) * lineHeight;
    for (const line of lines) {
      ctx.fillText(line, pad, y);
      y += lineHeight;
    }
    if (subtitle) {
      ctx.font = `400 ${mm(4.2)}px ${family}`;
      ctx.fillText(clip(ctx, subtitle, W - pad * 2), pad, H - pad);
    }
    if (!image) {
      ctx.font = `400 ${mm(3.5)}px ${family}`;
      ctx.globalAlpha = 0.5;
      ctx.fillText("Add a photo to fill the cover", pad, pad + mm(4));
      ctx.globalAlpha = 1;
    }
  }
}

export function drawBack(canvas: HTMLCanvasElement, design: Design, tracks: BackTrack[], totalSeconds: number) {
  const { width: W, height: H } = BACK_SIZE;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const family = familyOf(design.font);
  const title = design.title.trim() || "Untitled Mix";
  const subtitle = design.subtitle.trim();

  ctx.fillStyle = design.background;
  ctx.fillRect(0, 0, W, H);

  // Spines: title reads bottom-to-top on the left, top-to-bottom on the right.
  ctx.fillStyle = design.accent;
  ctx.fillRect(0, 0, SPINE, H);
  ctx.fillRect(W - SPINE, 0, SPINE, H);
  const spineText = subtitle ? `${title}  ·  ${subtitle}` : title;
  for (const side of ["left", "right"] as const) {
    ctx.save();
    if (side === "left") {
      ctx.translate(SPINE / 2, H / 2);
      ctx.rotate(-Math.PI / 2);
    } else {
      ctx.translate(W - SPINE / 2, H / 2);
      ctx.rotate(Math.PI / 2);
    }
    ctx.fillStyle = design.background;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    fit(ctx, spineText, H - mm(10), mm(3.4), 700, family);
    ctx.fillText(spineText, 0, 0);
    ctx.restore();
  }
  // Fold guides, faint, for cutting/folding.
  ctx.strokeStyle = design.ink;
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 2;
  ctx.setLineDash([mm(1), mm(1)]);
  for (const x of [SPINE, W - SPINE]) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  const left = SPINE + mm(8);
  const right = W - SPINE - mm(8);
  const width = right - left;
  let top = mm(10);

  ctx.fillStyle = design.ink;
  ctx.textBaseline = "alphabetic";
  fit(ctx, title, width, mm(6.5), 700, family);
  ctx.fillText(title, left, top + mm(5));
  top += mm(8);
  if (subtitle) {
    ctx.font = `400 ${mm(3.2)}px ${family}`;
    ctx.globalAlpha = 0.7;
    ctx.fillText(clip(ctx, subtitle, width), left, top + mm(2));
    ctx.globalAlpha = 1;
    top += mm(5);
  }
  ctx.fillStyle = design.accent;
  ctx.fillRect(left, top, mm(10), mm(0.8));
  top += mm(5);

  // Footer: total time and note.
  const footerHeight = mm(design.note.trim() ? 14 : 8);
  const bottom = H - mm(8) - footerHeight;

  // Tracklist: one column up to 12 tracks, then two; text shrinks to fit.
  const columns = tracks.length > 12 ? 2 : 1;
  const perColumn = Math.max(1, Math.ceil(tracks.length / columns));
  const gap = mm(6);
  const columnWidth = (width - gap * (columns - 1)) / columns;
  const rowHeight = Math.min(mm(10), (bottom - top) / perColumn);
  // With room to spare, the artist gets its own smaller line under the title.
  const twoLines = rowHeight >= mm(7.5);
  const size = Math.max(14, Math.round(twoLines ? Math.min(mm(3.6), rowHeight * 0.4) : rowHeight * 0.58));

  tracks.forEach((track, i) => {
    const column = Math.floor(i / perColumn);
    const row = i % perColumn;
    const x = left + column * (columnWidth + gap);
    const y = top + row * rowHeight + size;

    ctx.fillStyle = design.accent;
    ctx.font = `700 ${size}px ${family}`;
    const number = String(i + 1).padStart(2, "0");
    ctx.fillText(number, x, y);
    const numberWidth = ctx.measureText("00").width + size * 0.6;

    const time = design.showTimes ? formatTime(track.duration) : "";
    ctx.font = `400 ${size}px ${family}`;
    const timeWidth = time ? ctx.measureText(time).width + size * 0.6 : 0;

    ctx.fillStyle = design.ink;
    if (twoLines) {
      ctx.fillText(clip(ctx, track.title, columnWidth - numberWidth - timeWidth), x + numberWidth, y);
      if (track.artist) {
        ctx.font = `400 ${Math.round(size * 0.8)}px ${family}`;
        ctx.globalAlpha = 0.6;
        ctx.fillText(clip(ctx, track.artist, columnWidth - numberWidth), x + numberWidth, y + size * 1.15);
        ctx.globalAlpha = 1;
        ctx.font = `400 ${size}px ${family}`;
      }
    } else {
      const label = track.artist ? `${track.title} — ${track.artist}` : track.title;
      ctx.fillText(clip(ctx, label, columnWidth - numberWidth - timeWidth), x + numberWidth, y);
    }
    if (time) {
      ctx.globalAlpha = 0.6;
      ctx.textAlign = "right";
      ctx.fillText(time, x + columnWidth, y);
      ctx.textAlign = "left";
      ctx.globalAlpha = 1;
    }
  });

  ctx.fillStyle = design.ink;
  ctx.font = `400 ${mm(2.8)}px ${family}`;
  const footerY = H - mm(8);
  if (design.note.trim()) {
    ctx.globalAlpha = 0.8;
    ctx.fillText(clip(ctx, design.note.trim(), width - mm(30)), left, footerY - mm(6));
    ctx.globalAlpha = 1;
  }
  ctx.globalAlpha = 0.6;
  ctx.fillText(`${tracks.length} ${tracks.length === 1 ? "track" : "tracks"}`, left, footerY);
  ctx.textAlign = "right";
  ctx.fillText(formatTime(totalSeconds), right, footerY);
  ctx.textAlign = "left";
  ctx.globalAlpha = 1;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Couldn't draw the artwork."))), "image/png")
  );
}
