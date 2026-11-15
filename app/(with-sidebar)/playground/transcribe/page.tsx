"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ClipboardPaste, Copy, Download, Lock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import {
  PLATFORM_LABELS,
  checkLink,
  type Platform,
} from "@/lib/transcribe/platforms";
import type { Account, Job } from "@/lib/transcribe/transcript1";

const API = "/api/transcribe";

const STATUS_TEXT: Record<string, string> = {
  queued: "Waiting in line…",
  fetching: "Getting the video…",
  transcribing: "Transcribing…",
};

const BUTTON =
  "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function fileName(job: Job, extension: string) {
  const base = (job.title || job.id)
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)
    .toLowerCase();
  return `${base || "transcript"}.${extension}`;
}

export default function TranscribePage() {
  const { user, isAdmin, loading } = useAuth();

  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const cancelled = useRef(false);

  // Stop checking on a job if I leave the page.
  useEffect(() => {
    cancelled.current = false;
    return () => {
      cancelled.current = true;
    };
  }, []);

  const authedFetch = useCallback(
    async (input: string, init: RequestInit = {}) => {
      if (!user) throw new Error("Not signed in");
      const token = await user.getIdToken();
      return fetch(input, {
        ...init,
        headers: { ...init.headers, Authorization: `Bearer ${token}` },
      });
    },
    [user],
  );

  // My Transcript1 balance. Checked on load and after each transcription.
  const loadAccount = useCallback(async () => {
    try {
      const response = await authedFetch(`${API}/account`);
      if (response.ok) setAccount((await response.json()).account);
    } catch {
      // Not worth an error message; the counter just stays hidden.
    }
  }, [authedFetch]);

  useEffect(() => {
    if (isAdmin) loadAccount();
  }, [isAdmin, loadAccount]);

  async function paste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      setError(
        "Your browser didn't allow pasting. Paste into the box with Cmd+V instead.",
      );
    }
  }

  const linkCheck = url.trim() ? checkLink(url) : null;

  async function transcribe(event: React.FormEvent) {
    event.preventDefault();
    if (!linkCheck?.ok || isWorking) return;

    setIsWorking(true);
    setError(null);
    setJob(null);
    setCopied(false);
    setPlatform(linkCheck.platform);

    try {
      const response = await authedFetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkCheck.url }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Something went wrong.");

      let current: Job = body.job;
      setJob(current);

      // Each check waits a few seconds on the server, so this loop doesn't hammer anything.
      while (
        !cancelled.current &&
        !["completed", "failed", "canceled"].includes(current.status)
      ) {
        const poll = await authedFetch(
          `${API}?id=${encodeURIComponent(current.id)}`,
        );
        const pollBody = await poll.json();
        if (!poll.ok)
          throw new Error(pollBody.error || "Something went wrong.");
        current = pollBody.job;
        setJob(current);
      }

      if (current.status === "failed") setError(current.error);
      if (current.status === "canceled")
        setError("That transcription was canceled.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsWorking(false);
      loadAccount();
    }
  }

  async function copy() {
    if (!job?.text) return;
    try {
      await navigator.clipboard.writeText(job.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy. Select the text and copy it by hand.");
    }
  }

  async function download(format: "text" | "srt", timestamps = false) {
    if (!job) return;
    try {
      const response = await authedFetch(
        `${API}?id=${encodeURIComponent(job.id)}&format=${format}${timestamps ? "&timestamps=true" : ""}`,
      );
      if (!response.ok)
        throw new Error((await response.json()).error || "Couldn't download.");
      const blob = new Blob([await response.text()], {
        type: "text/plain;charset=utf-8",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName(job, format === "srt" ? "srt" : "txt");
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't download.");
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // The playground is public, but this runs on my paid minutes, so visitors just get a peek.
  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-3xl animate-fade-in pb-8 pt-16 sm:px-4">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="mb-2 text-xl font-medium">Transcriber</h1>
          <p className="text-sm text-muted-foreground">
            Paste a YouTube, Instagram, TikTok, Pinterest or X video link and
            get its words back as text.
          </p>
        </header>
        <div className="flex items-start gap-3 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          <Lock size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>
            This one&apos;s just for me for now. Every transcription uses up
            paid minutes, so it&apos;s locked to visitors.
          </p>
        </div>
      </div>
    );
  }

  const isDone = job?.status === "completed" && job.text !== null;

  return (
    <div className="mx-auto w-full max-w-3xl animate-fade-in pb-8 pt-16 sm:px-4">
      <header className="mb-8">
        <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-2 text-xl font-medium">Transcriber</h1>
        {account && (
          <div className="flex flex-col font-mono text-xs text-muted-foreground">
            <div>
              Minutes left:{" "}
              <span
                className={
                  account.minutesLeft <= 5
                    ? "text-destructive"
                    : "text-foreground"
                }
              >
                {account.minutesLeft}
              </span>
              {account.plan && ` (${account.plan} plan)`}
            </div>
            {account.renewsAt && (
              <div>
                Renews:{" "}
                {new Date(account.renewsAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            )}
          </div>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          Paste a YouTube, Instagram, TikTok, Pinterest or X video link and get
          its words back as text.
        </p>
      </header>

      <form onSubmit={transcribe} className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <input
              type="url"
              inputMode="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
              aria-label="Video link"
              disabled={isWorking}
              className="h-11 w-full rounded-lg border border-border bg-card pl-3 pr-11 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60 sm:text-sm"
            />
            <button
              type="button"
              onClick={paste}
              disabled={isWorking}
              aria-label="Paste link"
              title="Paste link"
              className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
            >
              <ClipboardPaste size={16} />
            </button>
          </div>
          <button
            type="submit"
            disabled={!linkCheck?.ok || isWorking}
            className="h-11 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isWorking ? "Working…" : "Transcribe"}
          </button>
        </div>
        <p
          className="min-h-[1rem] font-mono text-xs text-muted-foreground"
          aria-live="polite"
        >
          {linkCheck &&
            (linkCheck.ok
              ? `${PLATFORM_LABELS[linkCheck.platform]} link`
              : linkCheck.reason)}
        </p>
      </form>

      {isWorking && job && (
        <p
          className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
          aria-live="polite"
        >
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          {STATUS_TEXT[job.status] ?? "Working…"}
        </p>
      )}
      {isWorking && !job && (
        <p
          className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
          aria-live="polite"
        >
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Starting…
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-dashed border-destructive/50 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      {isDone && job && (
        <section className="mt-8">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <div className="min-w-0">
              {job.title && (
                <h2 className="text-sm font-medium [overflow-wrap:anywhere]">
                  {job.title}
                </h2>
              )}
              <p className="font-mono text-xs text-muted-foreground">
                {[
                  platform && PLATFORM_LABELS[platform],
                  job.author,
                  job.durationSeconds
                    ? formatDuration(job.durationSeconds)
                    : null,
                  job.billedMinutes !== null
                    ? `${job.billedMinutes} ${job.billedMinutes === 1 ? "minute" : "minutes"} used`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            <button type="button" onClick={copy} className={BUTTON}>
              {copied ? (
                <Check size={12} aria-hidden="true" />
              ) : (
                <Copy size={12} aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={() => download("text")}
              className={BUTTON}
            >
              <Download size={12} aria-hidden="true" /> .txt
            </button>
            <button
              type="button"
              onClick={() => download("text", true)}
              className={BUTTON}
            >
              <Download size={12} aria-hidden="true" /> .txt with timestamps
            </button>
            <button
              type="button"
              onClick={() => download("srt")}
              className={BUTTON}
            >
              <Download size={12} aria-hidden="true" /> .srt subtitles
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap rounded-lg border border-border bg-card p-4 text-sm leading-relaxed [overflow-wrap:anywhere]">
            {job.text || "No words were found in this video."}
          </div>
        </section>
      )}
    </div>
  );
}
