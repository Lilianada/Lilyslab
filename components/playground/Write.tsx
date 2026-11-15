"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Download,
  Heading,
  Info,
  Maximize2,
  Minimize2,
  Moon,
  PanelLeft,
  Plus,
  RotateCcw,
  Sun,
  Timer,
  Trash2,
  X,
} from "lucide-react";

/**
 * A quiet place to write. Notes live only in this browser (localStorage),
 * nothing is sent anywhere.
 */

interface Note {
  id: string;
  title: string;
  content: JSONContent | null;
  createdAt: number;
  updatedAt: number;
}

interface Settings {
  font: FontKey;
  size: number;
  showTitle: boolean;
}

const NOTES_KEY = "write_notes";
const CURRENT_KEY = "write_current";
const SETTINGS_KEY = "write_settings";
// What the old Terminal toy saved, carried over once.
const OLD_TERMINAL_KEY = "terminal_notes";

const FONTS = {
  system: { label: "System", className: "font-sans" },
  serif: { label: "Serif", className: "font-poem" },
  mono: { label: "Mono", className: "font-mono" },
} as const;
type FontKey = keyof typeof FONTS;
const FONT_ORDER: FontKey[] = ["system", "serif", "mono"];
const SIZES = [14, 16, 18, 20, 22, 24];
const TIMER_SECONDS = 15 * 60;

const DEFAULT_SETTINGS: Settings = {
  font: "system",
  size: 16,
  showTitle: true,
};

const SHORTCUTS: [string, string][] = [
  ["Heading 1", "# text"],
  ["Heading 2", "## text"],
  ["Bold", "**text**"],
  ["Italic", "*text*"],
  ["Bullet list", "- item"],
  ["Numbered list", "1. item"],
  ["Quote", "> text"],
  ["Code", "`text`"],
  ["Divider", "---"],
];

// localStorage can be missing or full (private windows, blocked storage); never let that break writing.
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function store(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is unavailable; the note still lives on screen.
  }
}

const newId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const blankNote = (): Note => ({
  id: newId(),
  title: "",
  content: null,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

/** Turns plain text (like the old Terminal notes) into editor paragraphs. */
function textToDoc(text: string): JSONContent {
  return {
    type: "doc",
    content: text
      .split("\n")
      .map((line) =>
        line
          ? { type: "paragraph", content: [{ type: "text", text: line }] }
          : { type: "paragraph" },
      ),
  };
}

/** Editor content to Markdown, for the download button. */
function toMarkdown(node: JSONContent | null | undefined): string {
  if (!node) return "";
  const inline = (nodes: JSONContent[] = []) =>
    nodes
      .map((n) => {
        if (n.type === "hardBreak") return "  \n";
        let text = n.text ?? "";
        for (const mark of n.marks ?? []) {
          if (mark.type === "bold") text = `**${text}**`;
          if (mark.type === "italic") text = `*${text}*`;
          if (mark.type === "strike") text = `~~${text}~~`;
          if (mark.type === "code") text = `\`${text}\``;
        }
        return text;
      })
      .join("");

  const block = (n: JSONContent, prefix = ""): string => {
    switch (n.type) {
      case "heading":
        return `${"#".repeat(n.attrs?.level ?? 1)} ${inline(n.content)}`;
      case "paragraph":
        return inline(n.content);
      case "blockquote":
        return (n.content ?? [])
          .map((c) => block(c))
          .join("\n\n")
          .replace(/^/gm, "> ");
      case "codeBlock":
        return `\`\`\`\n${inline(n.content)}\n\`\`\``;
      case "horizontalRule":
        return "---";
      case "bulletList":
      case "orderedList":
        return (n.content ?? [])
          .map((item, i) => {
            const marker = n.type === "orderedList" ? `${i + 1}. ` : "- ";
            const [first, ...rest] = (item.content ?? []).map((c) =>
              block(c, prefix + "  "),
            );
            return [
              prefix + marker + (first ?? ""),
              ...rest.map((r) => r.replace(/^/gm, prefix + "  ")),
            ].join("\n");
          })
          .join("\n");
      default:
        return (n.content ?? []).map((c) => block(c, prefix)).join("\n\n");
    }
  };

  return block(node).trim() + "\n";
}

const formatStamp = (time: number) =>
  new Date(time).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const formatTimer = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export default function Write() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [words, setWords] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerRunning, setTimerRunning] = useState(false);

  const shellRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const currentIdRef = useRef<string | null>(null);
  currentIdRef.current = currentId;

  const { resolvedTheme, setTheme } = useTheme();

  const current = notes.find((n) => n.id === currentId) ?? null;

  const updateCurrent = useCallback((patch: Partial<Note>) => {
    const id = currentIdRef.current;
    if (!id) return;
    setNotes((all) =>
      all.map((n) =>
        n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n,
      ),
    );
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing…" }),
    ],
    editorProps: {
      attributes: { class: "write-body focus:outline-none min-h-[50vh]" },
    },
    onUpdate: ({ editor }) => {
      updateCurrent({ content: editor.getJSON() });
      setWords(editor.getText().trim().split(/\s+/).filter(Boolean).length);
    },
  });

  // Load notes and settings once, on this browser.
  useEffect(() => {
    let saved = load<Note[]>(NOTES_KEY, []);
    if (saved.length === 0) {
      const note = blankNote();
      try {
        const old = localStorage.getItem(OLD_TERMINAL_KEY);
        if (old?.trim()) {
          note.title = "From the old Terminal";
          note.content = textToDoc(old.trim());
        }
      } catch {
        // No storage; start blank.
      }
      saved = [note];
    }
    const lastId = load<string | null>(CURRENT_KEY, null);
    setNotes(saved);
    setCurrentId(saved.some((n) => n.id === lastId) ? lastId : saved[0].id);
    setSettings({
      ...DEFAULT_SETTINGS,
      ...load<Partial<Settings>>(SETTINGS_KEY, {}),
    });
    setReady(true);
  }, []);

  // Save as I go.
  useEffect(() => {
    if (ready) store(NOTES_KEY, notes);
  }, [notes, ready]);
  useEffect(() => {
    if (ready) store(CURRENT_KEY, currentId);
  }, [currentId, ready]);
  useEffect(() => {
    if (ready) store(SETTINGS_KEY, settings);
  }, [settings, ready]);

  // Put the right note in the editor when switching notes.
  useEffect(() => {
    if (!editor || !ready || !currentId) return;
    const note = notes.find((n) => n.id === currentId);
    editor.commands.setContent(note?.content ?? "", false);
    setWords(editor.getText().trim().split(/\s+/).filter(Boolean).length);
    editor.commands.focus("end");
    // Only when the note changes, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, ready, currentId]);

  // Let the title box grow with long titles.
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [current?.title, settings.showTitle, settings.size, settings.font]);

  // Timer.
  useEffect(() => {
    if (!timerRunning) return;
    const tick = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [timerRunning]);

  // Keep the button in sync if fullscreen is left with Esc.
  useEffect(() => {
    const sync = () =>
      setFullscreen(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await shellRef.current?.requestFullscreen();
    } catch {
      // Some browsers (iPhone Safari) don't allow it; just stay as is.
    }
  };

  const newNote = () => {
    const note = blankNote();
    setNotes((all) => [note, ...all]);
    setCurrentId(note.id);
    setDrawerOpen(false);
  };

  const deleteNote = (id: string) => {
    const note = notes.find((n) => n.id === id);
    const name = note?.title.trim() || "this untitled note";
    if (!window.confirm(`Delete ${name}? This can't be undone.`)) return;
    const rest = notes.filter((n) => n.id !== id);
    if (rest.length === 0) {
      const fresh = blankNote();
      setNotes([fresh]);
      setCurrentId(fresh.id);
      return;
    }
    setNotes(rest);
    if (id === currentId) setCurrentId(rest[0].id);
  };

  const clearAll = () => {
    if (!editor || !window.confirm("Clear all the text in this note?")) return;
    editor.commands.clearContent(true);
    updateCurrent({ title: "" });
  };

  const download = () => {
    if (!current) return;
    const title = current.title.trim();
    const body = toMarkdown(current.content);
    const text = title ? `# ${title}\n\n${body}` : body;
    const blob = new Blob([text], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${
      (title || "note")
        .replace(/[^\w\- ]+/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase() || "note"
    }.md`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  const font = FONTS[settings.font];
  const barButton =
    "inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const divider = <span className="h-4 w-px bg-border" aria-hidden />;

  return (
    <div
      ref={shellRef}
      className={`relative flex flex-1 flex-col bg-background ${font.className} ${fullscreen ? "overflow-y-auto" : ""}`}
    >
      {/* Drawer button */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className={`${barButton} fixed z-30 bg-background/80 ${fullscreen ? "left-4 top-4" : "left-4 top-16 lg:left-8"}`}
        aria-label="Open notes"
        title="Notes"
      >
        <PanelLeft className="h-4 w-4" />
      </button>

      {/* Drawer: drawn at the top of the page so the site's nav bar can't cover it (inside the editor when fullscreen). */}
      {ready &&
        createPortal(
          <>
            {drawerOpen && (
              <div
                className="fixed inset-0 z-[60] bg-black/20 animate-fade-in"
                onClick={() => setDrawerOpen(false)}
                aria-hidden
              />
            )}
            <aside
              className={`${font.className} fixed inset-y-0 left-0 z-[61] flex w-72 max-w-[85vw] flex-col border-r border-border bg-background shadow-xl transition-transform duration-200 ${
                drawerOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              aria-label="Notes"
              aria-hidden={!drawerOpen}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-sm font-medium">Notes</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={newNote} className={barButton}>
                    <Plus className="h-3.5 w-3.5" /> New
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className={barButton}
                    aria-label="Close notes"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <ul className="flex-1 overflow-y-auto p-2">
                {sorted.map((note) => (
                  <li key={note.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentId(note.id);
                        setDrawerOpen(false);
                      }}
                      className={`w-full rounded-md px-3 py-2 pr-9 text-left transition-colors hover:bg-muted ${
                        note.id === currentId ? "bg-muted" : ""
                      }`}
                    >
                      <div className="truncate text-sm">
                        {note.title.trim() || "Untitled"}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {formatStamp(note.updatedAt)}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteNote(note.id)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground opacity-60 transition hover:bg-background hover:text-red-500 group-hover:opacity-100"
                      aria-label={`Delete ${note.title.trim() || "untitled note"}`}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
                These are stored locally in your browser.
              </p>
            </aside>
          </>,
          (fullscreen && shellRef.current) || document.body,
        )}

      {/* Page */}
      <div
        className={`mx-auto w-full max-w-2xl flex-1 px-2 pb-24 pt-14 ${fullscreen ? "px-6" : ""}`}
        style={{ fontSize: `${settings.size}px` }}
      >
        {ready && settings.showTitle && (
          <textarea
            ref={titleRef}
            value={current?.title ?? ""}
            onChange={(e) =>
              updateCurrent({ title: e.target.value.replace(/\n/g, " ") })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                editor?.commands.focus("start");
              }
            }}
            placeholder="Title"
            rows={1}
            className="mb-4 w-full resize-none overflow-hidden bg-transparent text-[2em] font-bold leading-tight tracking-tight placeholder:text-muted-foreground/40 focus:outline-none"
            aria-label="Title"
          />
        )}
        <EditorContent editor={editor} />
      </div>

      {/* Markdown shortcuts */}
      {showShortcuts && (
        <div className="fixed bottom-16 right-4 z-30 w-64 rounded-lg border border-border bg-background p-4 shadow-lg animate-fade-in">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Markdown shortcuts</span>
            <button
              type="button"
              onClick={() => setShowShortcuts(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close shortcuts"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <dl className="space-y-1 text-xs">
            {SHORTCUTS.map(([name, keys]) => (
              <div key={name} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{name}</dt>
                <dd>{keys}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Type them at the start of a line, then a space.
          </p>
        </div>
      )}

      {/* Bottom bar: pinned to the screen so it stays put while long notes scroll; quiet until hovered */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-end gap-2 bg-background/90 py-2 pl-4 pr-16 lg:pl-8 opacity-30 backdrop-blur transition-opacity duration-300 hover:opacity-100 focus-within:opacity-100 max-sm:opacity-100">
        <div className="flex flex-wrap items-center justify-end gap-0.5">
          <button
            type="button"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className={barButton}
            aria-label="Toggle dark mode"
            title="Light / dark"
          >
            {!ready ? (
              <span className="h-3.5 w-3.5" />
            ) : resolvedTheme === "dark" ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </button>
          {divider}
          <button
            type="button"
            onClick={() =>
              setSettings((s) => ({
                ...s,
                font: FONT_ORDER[
                  (FONT_ORDER.indexOf(s.font) + 1) % FONT_ORDER.length
                ],
              }))
            }
            className={`${barButton} w-14`}
            title="Font"
          >
            {font.label}
          </button>
          <button
            type="button"
            onClick={() =>
              setSettings((s) => ({
                ...s,
                size: SIZES[(SIZES.indexOf(s.size) + 1) % SIZES.length],
              }))
            }
            className={barButton}
            title="Font size"
            aria-label={`Font size ${settings.size}`}
          >
            {settings.size}
          </button>
          <button
            type="button"
            onClick={() =>
              setSettings((s) => ({ ...s, showTitle: !s.showTitle }))
            }
            className={`${barButton} ${settings.showTitle ? "text-foreground" : ""}`}
            aria-pressed={settings.showTitle}
            title={settings.showTitle ? "Hide title" : "Show title"}
          >
            <Heading className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className={barButton}
            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {fullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowShortcuts((v) => !v)}
            className={`${barButton} ${showShortcuts ? "text-foreground" : ""}`}
            title="Markdown shortcuts"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={download}
            className={barButton}
            title="Download as Markdown"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          {divider}
          <button
            type="button"
            onClick={() => {
              if (timeLeft === 0) setTimeLeft(TIMER_SECONDS);
              setTimerRunning((r) => !r);
            }}
            className={`${barButton} tabular-nums ${timerRunning ? "text-foreground" : ""} ${timeLeft === 0 ? "text-primary" : ""}`}
            title={timerRunning ? "Pause timer" : "Start a 15 minute timer"}
          >
            <Timer className="h-3.5 w-3.5" />
            {formatTimer(timeLeft)}
          </button>
          {(timerRunning || timeLeft !== TIMER_SECONDS) && (
            <button
              type="button"
              onClick={() => {
                setTimerRunning(false);
                setTimeLeft(TIMER_SECONDS);
              }}
              className={barButton}
              aria-label="Reset timer"
              title="Reset timer"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
          {divider}
          <button
            type="button"
            onClick={clearAll}
            className={`${barButton} hover:text-red-500`}
            title="Clear all text"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <span
            className="px-2 text-xs tabular-nums text-muted-foreground"
            title="Words"
          >
            {words}
          </span>
        </div>
      </div>
    </div>
  );
}
