import { collection, doc, documentId, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/garden/firebase";
import type { GardenHealth } from "@/lib/garden-health";

const CHART_DAYS = 30;
const TOP_LIMIT = 5;

export type Ranked = [name: string, count: number][];

export interface VisitorSummary {
  total: number;
  today: number;
  lastWeek: number;
  days: { date: string; count: number }[];
  sources: Ranked;
  landings: Ranked;
  countries: Ranked;
}

export interface AmaQuestion {
  id: string;
  name: string;
  question: string;
}

export interface InboxItem {
  collectionName: string;
  id: string;
  kind: string;
  title: string;
  url?: string;
  detail?: string;
  time: number;
}

const INBOX_SOURCES = [
  { collectionName: "suggestions", kind: "Suggestion" },
  { collectionName: "webroll-submissions", kind: "Webroll link" },
];

const firestore = () => {
  if (!db) throw new Error("Firebase isn't configured");
  return db;
};

const dayKey = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 86_400_000).toISOString().slice(0, 10);

function rank(maps: (Record<string, number> | undefined)[]): Ranked {
  const totals = new Map<string, number>();
  for (const map of maps) {
    for (const [name, count] of Object.entries(map ?? {})) {
      totals.set(name, (totals.get(name) ?? 0) + count);
    }
  }
  return [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, TOP_LIMIT);
}

export async function loadVisitors(): Promise<VisitorSummary> {
  const store = firestore();
  const stats = collection(store, "visitorStats");
  const [allTime, recent] = await Promise.all([
    getDoc(doc(stats, "all-time")),
    getDocs(
      query(
        stats,
        where(documentId(), ">=", dayKey(CHART_DAYS - 1)),
        where(documentId(), "<=", dayKey(0))
      )
    ),
  ]);

  const byDay = new Map(recent.docs.map((snapshot) => [snapshot.id, snapshot.data()]));
  const days = Array.from({ length: CHART_DAYS }, (_, index) => {
    const date = dayKey(CHART_DAYS - 1 - index);
    return { date, count: (byDay.get(date)?.visitors as number) ?? 0 };
  });
  const records = [...byDay.values()];

  return {
    total: (allTime.data()?.visitors as number) ?? 0,
    today: days[days.length - 1].count,
    lastWeek: days.slice(-7).reduce((sum, day) => sum + day.count, 0),
    days,
    sources: rank(records.map((record) => record.referrers)),
    landings: rank(records.map((record) => record.landings)),
    countries: rank(records.map((record) => record.countries)),
  };
}

export async function loadUnansweredAma(): Promise<AmaQuestion[]> {
  const response = await fetch("/api/ask-me-anything");
  if (!response.ok) throw new Error("Couldn't load AMA questions");
  const { questions } = (await response.json()) as { questions: (AmaQuestion & { response: string })[] };
  return questions
    .filter((question) => !question.response.trim())
    .map(({ id, name, question }) => ({ id, name, question }));
}

export async function loadInbox(): Promise<InboxItem[]> {
  const store = firestore();
  const groups = await Promise.all(
    INBOX_SOURCES.map(async ({ collectionName, kind }) => {
      const snapshot = await getDocs(query(collection(store, collectionName), where("reviewed", "==", false)));
      return snapshot.docs.map((item) => {
        const data = item.data();
        return {
          collectionName,
          id: item.id,
          kind,
          title: data.title ?? "Untitled",
          url: data.url || undefined,
          detail: data.notes || data.category || undefined,
          time: data.createdAt?.toMillis?.() ?? 0,
        };
      });
    })
  );
  return groups.flat().sort((a, b) => b.time - a.time);
}

export const markReviewed = ({ collectionName, id }: InboxItem) =>
  updateDoc(doc(firestore(), collectionName, id), { reviewed: true });

export async function loadGardenHealth(idToken: string): Promise<GardenHealth> {
  const response = await fetch("/api/ctrl-room/garden-health", {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!response.ok) throw new Error("Couldn't load garden health");
  return response.json();
}
