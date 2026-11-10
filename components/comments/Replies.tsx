"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Reply {
  id: string;
  name: string;
  website?: string;
  message: string;
  date: string;
}

const EMPTY_FORM = { name: "", email: "", website: "", message: "", spam_check: "", company: "" };

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="mb-1 block font-mono text-xs text-muted-foreground">
    {children}
  </label>
);

/** Replies under an essay or note, and a small form to leave one. */
export function Replies({ page, title }: { page: string; title: string }) {
  const [replies, setReplies] = useState<Reply[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thanks, setThanks] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/comments?page=${encodeURIComponent(page)}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { replies: Reply[] }) => !cancelled && setReplies(data.replies))
      .catch(() => !cancelled && setLoadFailed(true));
    return () => {
      cancelled = true;
    };
  }, [page]);

  const update = (field: keyof typeof EMPTY_FORM) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setIsSending(true);
    setError(null);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, page, pageTitle: title }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Couldn't send your reply. Try again.");
      setReplies((current) => [...(current ?? []), data.reply]);
      setForm(EMPTY_FORM);
      setIsOpen(false);
      setThanks(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't send your reply. Try again.");
    } finally {
      setIsSending(false);
    }
  }

  const count = replies?.length ?? 0;

  return (
    <section aria-labelledby="replies-heading" className="mt-12 border-t border-dashed pt-6">
      <h2 id="replies-heading" className="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
        {count > 0 ? `Replies (${count})` : "Replies"}
      </h2>

      {loadFailed ? (
        <p className="mb-4 text-sm text-muted-foreground">Replies couldn&apos;t load right now.</p>
      ) : replies === null ? (
        <p className="mb-4 text-sm text-muted-foreground">Loading replies...</p>
      ) : count === 0 ? (
        <p className="mb-4 text-sm text-muted-foreground">No replies yet. Yours could be the first.</p>
      ) : (
        <ul className="mb-6 divide-y divide-dashed">
          {replies.map((reply) => (
            <li key={reply.id} id={`reply-${reply.id}`} className="scroll-mt-20 py-4 first:pt-0">
              <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
                {reply.website ? (
                  <a
                    href={reply.website}
                    target="_blank"
                    rel="nofollow ugc noopener noreferrer"
                    className="text-sm font-medium underline decoration-primary decoration-2 underline-offset-2 hover:opacity-70"
                  >
                    {reply.name}
                  </a>
                ) : (
                  <span className="text-sm font-medium">{reply.name}</span>
                )}
                <span className="font-mono text-[11px] text-muted-foreground">{formatDate(reply.date)}</span>
              </div>
              <p className="whitespace-pre-line text-sm [overflow-wrap:anywhere]">{reply.message}</p>
            </li>
          ))}
        </ul>
      )}

      {thanks && <p className="mb-4 text-sm">Thank you! Your reply is up.</p>}

      {isOpen ? (
        <form onSubmit={submit} className="space-y-4 rounded-lg border p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="reply-name">Name *</Label>
              <Input id="reply-name" required maxLength={80} value={form.name} onChange={update("name")} autoComplete="name" />
            </div>
            <div>
              <Label htmlFor="reply-email">Email (only I see this)</Label>
              <Input id="reply-email" type="email" value={form.email} onChange={update("email")} autoComplete="email" />
            </div>
          </div>
          <div>
            <Label htmlFor="reply-website">Website (optional)</Label>
            <Input id="reply-website" type="url" placeholder="https://" value={form.website} onChange={update("website")} autoComplete="url" />
          </div>
          <div>
            <Label htmlFor="reply-message">Your reply *</Label>
            <Textarea id="reply-message" required minLength={2} maxLength={2000} className="min-h-[110px] resize-y" value={form.message} onChange={update("message")} />
          </div>
          <div>
            <Label htmlFor="reply-check">Are you human? Type &quot;garden&quot; *</Label>
            <Input id="reply-check" required value={form.spam_check} onChange={update("spam_check")} autoComplete="off" />
          </div>
          {/* Hidden from people; bots tend to fill it in. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="reply-company">Company</label>
            <input id="reply-company" tabIndex={-1} autoComplete="off" value={form.company} onChange={update("company")} />
          </div>
          {error && <p className="text-sm text-codeRed">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={isSending}>
              {isSending ? "Sending..." : "Post reply"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsOpen(true);
            setThanks(false);
          }}
        >
          Reply to this
        </Button>
      )}
    </section>
  );
}
