"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  loadGardenHealth,
  loadInbox,
  loadUnansweredAma,
  loadVisitors,
  markReviewed,
  type InboxItem,
  type Ranked,
  type VisitorSummary,
} from "@/lib/ctrl-room";

const LIST_LIMIT = 5;

const formatDay = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

const daysSince = (date: string) => Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);

function useLoad<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    load()
      .then((result) => !cancelled && setData(result))
      .catch((caught: { code?: string; message?: string }) => {
        if (cancelled) return;
        setError(
          caught?.code === "permission-denied"
            ? "Firestore won't let this through yet. Add the rules in docs/firestore-rules.md."
            : caught?.message || "Couldn't load this."
        );
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  return { data, error, setData };
}

function Panel({ title, error, loaded, children }: { title: string; error: string | null; loaded: boolean; children: ReactNode }) {
  return (
    <section className="rounded-md border border-dashed p-4">
      <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">{title}</h2>
      {error ? (
        <p className="text-xs text-codeRed">{error}</p>
      ) : loaded ? (
        children
      ) : (
        <p className="text-xs text-muted-foreground">Loading...</p>
      )}
    </section>
  );
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="text-2xl font-medium tabular-nums">{value.toLocaleString("en-US")}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

const RankedList = ({ title, items }: { title: string; items: Ranked }) => (
  <div className="min-w-0">
    <h3 className="mb-1 text-xs font-medium">{title}</h3>
    {items.length === 0 ? (
      <p className="text-xs text-muted-foreground">Nothing yet</p>
    ) : (
      <ul className="space-y-0.5">
        {items.map(([name, count]) => (
          <li key={name} className="flex justify-between gap-2 text-xs text-muted-foreground">
            <span className="truncate" title={name}>{name}</span>
            <span className="tabular-nums text-foreground">{count}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

function DayBars({ days }: { days: VisitorSummary["days"] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...days.map((day) => day.count));
  const shown = active === null ? null : days[active];

  return (
    <div>
      <p className="mb-2 h-4 text-xs text-muted-foreground" aria-hidden="true">
        {shown
          ? `${formatDay(shown.date)}: ${shown.count} new ${shown.count === 1 ? "visitor" : "visitors"}`
          : "New visitors per day, last 30 days"}
      </p>
      <div className="flex h-20 items-end gap-0.5 border-b" aria-hidden="true" onMouseLeave={() => setActive(null)}>
        {days.map((day, index) => (
          <div
            key={day.date}
            className="flex h-full flex-1 cursor-default items-end"
            onMouseEnter={() => setActive(index)}
            onClick={() => setActive(index)}
          >
            {day.count > 0 && (
              <div
                className={`w-full rounded-t bg-codeRed transition-opacity ${active === index ? "" : "opacity-80"}`}
                style={{ height: `${Math.max(6, (day.count / max) * 100)}%` }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground" aria-hidden="true">
        <span>{formatDay(days[0].date)}</span>
        <span>{formatDay(days[days.length - 1].date)}</span>
      </div>
      <table className="sr-only">
        <caption>New visitors per day, last 30 days</caption>
        <tbody>
          {days.map((day) => (
            <tr key={day.date}>
              <th scope="row">{day.date}</th>
              <td>{day.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VisitorsPanel() {
  const { data, error } = useLoad(loadVisitors);

  return (
    <Panel title="Visitors" error={error} loaded={!!data}>
      {data && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <Stat label="New today" value={data.today} />
            <Stat label="Last 7 days" value={data.lastWeek} />
            <Stat label="All time" value={data.total} />
          </div>
          <DayBars days={data.days} />
          <div className="grid gap-4 sm:grid-cols-3">
            <RankedList title="Came from" items={data.sources} />
            <RankedList title="First page" items={data.landings} />
            <RankedList title="Countries" items={data.countries} />
          </div>
        </div>
      )}
    </Panel>
  );
}

function AmaPanel() {
  const { data, error } = useLoad(loadUnansweredAma);

  return (
    <Panel title={data ? `AMA waiting (${data.length})` : "AMA waiting"} error={error} loaded={!!data}>
      {data?.length === 0 ? (
        <p className="text-xs text-muted-foreground">All caught up.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {data?.slice(0, LIST_LIMIT).map((question) => (
              <li key={question.id} className="text-xs">
                <p className="line-clamp-2">{question.question}</p>
                <p className="text-muted-foreground">from {question.name}</p>
              </li>
            ))}
          </ul>
          <Link href="/ask-me-anything" className="mt-3 inline-block text-xs text-codeRed hover:italic">
            Go reply →
          </Link>
        </>
      )}
    </Panel>
  );
}

function InboxPanel() {
  const { data, error, setData } = useLoad(loadInbox);
  const [failed, setFailed] = useState(false);

  const dismiss = async (item: InboxItem) => {
    setFailed(false);
    try {
      await markReviewed(item);
      setData((items) => items?.filter((other) => other !== item) ?? null);
    } catch {
      setFailed(true);
    }
  };

  return (
    <Panel title={data ? `Inbox (${data.length})` : "Inbox"} error={error} loaded={!!data}>
      {data?.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nothing new.</p>
      ) : (
        <ul className="space-y-3">
          {data?.map((item) => (
            <li key={`${item.collectionName}-${item.id}`} className="flex items-start justify-between gap-3 text-xs">
              <div className="min-w-0 break-words">
                <span className="text-muted-foreground">{item.kind}: </span>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-codeRed hover:italic">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
                {item.detail && <p className="text-muted-foreground">{item.detail}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item)}
                className="flex-shrink-0 rounded-md border border-dashed px-2 py-0.5 text-muted-foreground hover:text-foreground"
              >
                Done
              </button>
            </li>
          ))}
        </ul>
      )}
      {failed && <p className="mt-2 text-xs text-codeRed">That didn't save. Try again.</p>}
    </Panel>
  );
}

function HealthPanel({ getToken }: { getToken: () => Promise<string> }) {
  const load = useCallback(async () => loadGardenHealth(await getToken()), [getToken]);
  const { data, error } = useLoad(load);

  return (
    <Panel title="Garden health" error={error} loaded={!!data}>
      {data && (
        <div className="space-y-4 text-xs">
          <div>
            <h3 className="mb-1 font-medium">Last planted</h3>
            <ul className="space-y-0.5">
              {data.latest.map(({ label, date }) => (
                <li key={label} className="flex justify-between gap-2 text-muted-foreground">
                  <span>{label}</span>
                  <span className="text-foreground">{date ? `${daysSince(date)} days ago` : "Never"}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-1 font-medium">Published with no text ({data.empty.length})</h3>
            {data.empty.length === 0 ? (
              <p className="text-muted-foreground">None. Nice.</p>
            ) : (
              <ul className="space-y-0.5">
                {data.empty.map(({ title, href }) => (
                  <li key={href}>
                    <Link href={href} className="text-codeRed hover:italic">{title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="mb-1 font-medium">Drafts ({data.drafts.length})</h3>
            {data.drafts.length === 0 ? (
              <p className="text-muted-foreground">None.</p>
            ) : (
              <ul className="space-y-0.5 text-muted-foreground">
                {data.drafts.map(({ title, section }) => (
                  <li key={`${section}-${title}`}>{title} <span className="opacity-60">({section})</span></li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Panel>
  );
}

/** What needs attention today. Each panel loads and fails on its own. */
export function TodayPanel({ getToken }: { getToken: () => Promise<string> }) {
  return (
    <div className="grid gap-4 font-mono lg:grid-cols-2 [&_p]:text-xs">
      <div className="lg:col-span-2">
        <VisitorsPanel />
      </div>
      <AmaPanel />
      <InboxPanel />
      <div className="lg:col-span-2">
        <HealthPanel getToken={getToken} />
      </div>
    </div>
  );
}
