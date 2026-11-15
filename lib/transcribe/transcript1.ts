/**
 * A thin client for the Transcript1 API (https://transcript1.com/docs).
 * Server only: it uses TRANSCRIPT1_API_KEY, which must never reach the browser.
 */
const BASE_URL = process.env.TRANSCRIPT1_API_URL || "https://api.transcript1.com/v1";

/**
 * Seconds to let Transcript1 hold each request open while it works.
 * Kept under Netlify's function time limit; the page keeps checking until it's done.
 */
const WAIT_SECONDS = 8;

export type JobStatus = "awaiting_upload" | "queued" | "fetching" | "transcribing" | "completed" | "failed" | "canceled" | "live";

/** What the page needs from a transcription. */
export interface Job {
  id: string;
  status: JobStatus;
  title: string | null;
  author: string | null;
  durationSeconds: number | null;
  billedMinutes: number | null;
  text: string | null;
  error: string | null;
}

export class Transcript1Error extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

// Plain-English versions of Transcript1's failure codes.
const FRIENDLY_ERRORS: Record<string, string> = {
  media_unavailable: "That video couldn't be found. It may have been deleted.",
  media_private: "That video is private, so it can't be transcribed.",
  login_required: "That video needs a login to watch, so it can't be transcribed.",
  age_restricted: "That video is age-restricted, so it can't be transcribed.",
  live_stream: "Live streams can't be transcribed until they've ended.",
  no_audio: "That video has no sound to transcribe.",
  no_speech: "No speech was found in that video.",
  no_captions: "That video has no captions.",
  media_too_long: "That video is too long (the limit is 5 hours).",
  fetch_failed: "Transcript1 couldn't download that video. Try again in a bit.",
  transcription_failed: "The transcription failed. Try again in a bit.",
  rate_limited: "Too many requests at once. Wait a minute and try again.",
  insufficient_credits: "You're out of Transcript1 minutes.",
};

function apiKey() {
  const key = process.env.TRANSCRIPT1_API_KEY;
  if (!key) throw new Transcript1Error("TRANSCRIPT1_API_KEY isn't set, so the transcriber can't run yet.", 500);
  return key;
}

async function call(path: string, init: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${apiKey()}`, ...init.headers },
    cache: "no-store",
  });
  return response;
}

async function errorFrom(response: Response): Promise<Transcript1Error> {
  let code = "";
  let message = "";
  try {
    const body = await response.json();
    code = body?.error?.code ?? "";
    message = body?.error?.message ?? "";
  } catch {
    // Not JSON; fall back to the status below.
  }
  if (response.status === 401) return new Transcript1Error("Transcript1 didn't accept the API key. Check TRANSCRIPT1_API_KEY.", 500);
  if (response.status === 402) return new Transcript1Error(FRIENDLY_ERRORS.insufficient_credits, 402);
  return new Transcript1Error(FRIENDLY_ERRORS[code] || message || `Transcript1 returned an error (${response.status}).`, response.status);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toJob(body: any): Job {
  const code: string | undefined = body?.error?.code;
  return {
    id: body.id,
    status: body.status,
    title: body.media?.title ?? null,
    author: body.media?.author ?? null,
    durationSeconds: body.media?.duration_seconds ?? null,
    billedMinutes: body.billed_minutes ?? null,
    text: body.transcript?.text ?? null,
    error: body.status === "failed" ? (code && FRIENDLY_ERRORS[code]) || body.error?.message || "The transcription failed." : null,
  };
}

/** Starts a transcription (or reuses one of the same video from the last 24 hours, free). */
export async function startTranscription(url: string): Promise<Job> {
  const response = await call(`/transcriptions?wait=${WAIT_SECONDS}&reuse_recent=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, source: "auto", language: "auto" }),
  });
  if (!response.ok) throw await errorFrom(response);
  return toJob(await response.json());
}

/** Checks on a transcription, waiting briefly for it to finish. */
export async function getTranscription(id: string): Promise<Job> {
  const response = await call(`/transcriptions/${encodeURIComponent(id)}?wait=${WAIT_SECONDS}&wait_for=transcript`);
  if (!response.ok) throw await errorFrom(response);
  return toJob(await response.json());
}

/** A finished transcript as plain text (optionally with timestamps) or SRT subtitles. */
export async function downloadTranscription(id: string, format: "text" | "srt", timestamps = false): Promise<string> {
  const query = format === "text" && timestamps ? "format=text&timestamps=true" : `format=${format}`;
  const response = await call(`/transcriptions/${encodeURIComponent(id)}?${query}`);
  if (response.status === 202) throw new Transcript1Error("That transcript isn't ready yet.", 409);
  if (!response.ok) throw await errorFrom(response);
  return response.text();
}

/** How many minutes I have left, and when they come back. */
export interface Account {
  plan: string | null;
  minutesLeft: number;
  renewsAt: string | null;
}

/** Reads my balance. Free: Transcript1 doesn't charge for this. */
export async function getAccount(): Promise<Account> {
  const response = await call("/account");
  if (!response.ok) throw await errorFrom(response);
  const body = await response.json();
  return {
    plan: body.plan?.name ?? null,
    minutesLeft: body.minutes?.remaining ?? 0,
    renewsAt: body.minutes?.resets_at ?? body.renews_at ?? null,
  };
}
