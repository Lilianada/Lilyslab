/**
 * The garden's topics: the "beds" essays and notes are planted in.
 *
 * Each post lands in one topic, picked from its tags: the first tag (in the order
 * the post lists them) that belongs to a topic below wins. Posts whose tags match
 * nothing go to the last topic, "Life & opinions".
 *
 * DEMO CONTENT: the titles are a starting point and every `intro` is placeholder
 * text. Rewrite them in your own words, rename or merge topics, and move tags
 * between them. Nothing in the posts needs to change.
 */

export type Topic = {
  /** Used in the address: /garden/topics/<id>. */
  id: string;
  title: string;
  /** One line under the title on the garden map. */
  blurb: string;
  /** The short introduction at the top of the topic's own page. */
  intro: string;
  /** Tags that put a post in this topic. */
  tags: string[];
};

export const TOPICS: Topic[] = [
  {
    id: "writing",
    title: "Writing",
    blurb: "Why I write, how I write, and the notebooks that hold it all.",
    intro:
      "Demo intro. This is where everything about writing lives: why I bother, the habits that keep me at it, and the notebooks, commonplace books and reading that feed it. Start with the evergreen essays, then wander into the notes.",
    tags: ["writing", "writing-platform", "notebooks", "notebook", "commonplace-notes", "reading", "creative-tool", "snail-mail", "stationery"],
  },
  {
    id: "creativity",
    title: "Creativity",
    blurb: "Making things, remixing things, and getting unstuck.",
    intro:
      "Demo intro. Notes and essays on making things: where ideas come from, why constraints help, and how anyone can call themselves creative. Some of these are a series, best read in order.",
    tags: ["creativity", "art", "design", "design-thinking", "constraints", "inspiration", "ideas", "flow", "research", "photography", "music", "poem", "personal-space"],
  },
  {
    id: "gardening",
    title: "Gardens & Note-taking",
    blurb: "Digital gardens, personal knowledge and how I keep notes.",
    intro:
      "Demo intro. The ideas this website is built on: digital gardens, personal knowledge management, and the habits of collecting and connecting notes. If you're new here, this is a good place to start.",
    tags: ["digital-garden", "note-taking", "pkm", "knowledge-management", "knowledge", "knowledge-building", "information", "bookmarks", "concepts"],
  },
  {
    id: "personal-web",
    title: "The Personal Web",
    blurb: "Owning a website, the indie web, and being online on purpose.",
    intro:
      "Demo intro. Why everyone should own a little corner of the internet, how to build one, and how to use the rest of the web without it using you.",
    tags: [
      "personal-website", "personal-websites", "personal-site", "website", "build-your-own-website", "indieweb", "indie-web",
      "web-discovery", "web-development", "web-dev", "frontend", "coding", "webmasters", "questionnaire", "web-projects",
      "internet", "internet-interests", "social-media", "digital-minimalism", "content-creation", "monetization",
    ],
  },
  {
    id: "work",
    title: "Work & Projects",
    blurb: "Building things, shipping them, and staying productive.",
    intro: "Demo intro. Notes on projects, products and work: shipping small, planning less, and what jobs have taught me.",
    tags: [
      "productivity", "product-development", "product-management", "project-management", "mvp", "building-in-public", "planning",
      "projects", "career-development", "work-update", "network-marketing", "business-lessons", "workplace-culture", "software-issues",
    ],
  },
  {
    id: "mind",
    title: "Mind & Self",
    blurb: "Mental health, growth, purpose and the questions in between.",
    intro: "Demo intro. Thinking out loud about the mind: anxiety, purpose, grief, habits, and learning to be kind to myself.",
    tags: [
      "psychology", "mental-health", "self", "personal-growth", "self-care", "wellbeing", "wellness", "happiness", "purpose",
      "life-purpose", "existential-crisis", "existence", "frustration", "dopamine", "toxic-positivity", "philosophy",
      "self-discovery", "spirituality", "depression", "grief", "loss", "health",
    ],
  },
  {
    id: "books",
    title: "Book Reviews",
    blurb: "Reviews and notes on what I've read and watched.",
    intro: "Demo intro. Book and film reviews, and notes from the stories that stayed with me.",
    tags: ["book-review", "fiction", "non-fiction", "psychological-fiction", "movie-review", "self-help"],
  },
  {
    id: "life",
    title: "Life & Opinions",
    blurb: "Love, style, growing up, and things I have opinions about.",
    intro: "Demo intro. Everything else: relationships, fashion, growing up in Nigeria, old teen writing, and opinions I stand by.",
    tags: [],
  },
];

/** Where posts go when none of their tags belong to a topic. */
export const FALLBACK_TOPIC = TOPICS[TOPICS.length - 1];

/** Tags so broad they shouldn't decide a post's topic on their own. */
const TOO_BROAD = new Set(["self-expression", "personal", "personal-expressions", "relatable", "lessons", "life"]);

const TOPIC_BY_TAG = new Map<string, Topic>();
for (const topic of TOPICS) for (const tag of topic.tags) TOPIC_BY_TAG.set(tag.toLowerCase(), topic);

/** The one topic a post belongs to, from its tags. */
export function topicFor(tags: string[] = []): Topic {
  for (const tag of tags) {
    const key = tag.toLowerCase();
    if (TOO_BROAD.has(key)) continue;
    const topic = TOPIC_BY_TAG.get(key);
    if (topic) return topic;
  }
  return FALLBACK_TOPIC;
}

export const getTopic = (id: string) => TOPICS.find((topic) => topic.id === id);

/** How grown a post is. Anything that isn't a seedling or budding counts as evergreen. */
export type Stage = "seedling" | "budding" | "evergreen";

export function stageOf(type: unknown): Stage {
  const value = String(type ?? "").toLowerCase();
  return value === "seedling" || value === "budding" ? value : "evergreen";
}

export const STAGES: Record<Stage, { label: string; description: string }> = {
  seedling: { label: "Seedling", description: "A rough idea, just planted" },
  budding: { label: "Budding", description: "Still growing and changing" },
  evergreen: { label: "Evergreen", description: "Mostly finished, still tended" },
};
