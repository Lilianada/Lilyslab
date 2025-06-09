---
author: Lilian
cover:
  - "[[architecture-diagram.jpg]]"
date: 2025-04-22
excerpt: My practical experience, how I structured my code, and my decision-making process regarding technologies, design patterns, and tools.
published: true
slug: the-architecture-of-lilyslab
tags:
  - Documentation
  - Strategy
  - NextJS
  - Web-Development
title: The Architecture of Lily's Garden
readingTime: 7
wordCount: 1540
---

Building a personal website seems straightforward at first—until you start making technical decisions. Should you use a traditional CMS? A static site generator? What about content storage, styling approach, deployment strategy? As someone who's walked this path recently with Lilyslab, I want to share my architecture decisions and the thinking behind them.

## Technology Stack Selection

### The Framework Decision: Next.js

When I began planning Lilyslab, I evaluated several options:

- **Traditional CMS** (WordPress, Ghost): Great content management, but less developer flexibility
- **Static Site Generators** (11ty, Hugo): Lightning fast, but limited dynamic features
- **JavaScript Frameworks** (React, Vue): Flexible but require more infrastructure decisions
- **Meta-frameworks** (Next.js, Remix, Astro): Combines React with built-in optimization

I chose **Next.js with the App Router** for several reasons:

1. **Hybrid Rendering**: I wanted both static content (writings, notes) and dynamic features (comments, analytics)
2. **React Ecosystem**: Leveraging my existing knowledge and the component ecosystem
3. **Built-in Optimizations**: Image handling, route pre-fetching, and code splitting
4. **Server Components**: Reducing client-side JavaScript while maintaining interactivity where needed
5. **Simplified API Routes**: For future features like newsletter subscriptions

The App Router specifically offered better file-based routing and simplified data fetching patterns, which made organizing the various sections of my digital garden more intuitive.

### Content Management: The Filesystem Approach

Rather than using a headless CMS, I decided to store content in Markdown files within the codebase:

```
Content/
├── writings/     # Long-form articles
├── notes/        # Quick thoughts
├── bookmarks/    # Interesting links
├── logs/         # Changelog entries
└── resources/    # Learning materials
```

This approach has several benefits:

1. **Git Version Control**: Every content change is versioned
2. **No External Dependencies**: No database or API to maintain
3. **Local Editing**: I can use Obsidian as my primary editor
4. **Content Portability**: Easy to migrate if I change platforms

I use a combination of `fs` and `path` modules to read directories and files, and `gray-matter` to parse frontmatter. Each content type has a standardized schema that I validate using Zod.

## Architecture Patterns

### Separation of Concerns

I've organized the codebase into clear domains:

```
app/              # Application routes and pages
  ├── api/        # API endpoints
  ├── digital-garden/  # Garden section routes
  ├── workshop/   # Workshop section routes
components/       # Shared React components
lib/              # Utilities and helpers
  ├── types/      # TypeScript definitions
  ├── config/     # Configuration
  └── utils/      # Helper functions
Content/          # All content files
public/           # Static assets
```

This structure allows me to:

1. Separate presentation from business logic
2. Reuse components across different sections
3. Centralize content fetching and processing

### Content Modules

For each content type, I've created a dedicated module that handles:

1. **Fetching**: Reading files from the filesystem
2. **Parsing**: Converting markdown to HTML
3. **Validation**: Ensuring content follows the expected schema
4. **Transformation**: Preparing data for display

This pattern makes it easy to add new content types or modify existing ones without touching the presentation layer.

## Styling Approach

I use Tailwind CSS with a custom theme, which gives me:

1. **Rapid Iteration**: Fast styling without context switching
2. **Consistent Design**: Theme variables enforce a cohesive look
3. **Dark Mode Support**: Built-in with minimal effort
4. **Small Bundle Size**: Only includes CSS I actually use

For complex components, I combine Tailwind with [shadcn/ui](https://ui.shadcn.com/), a collection of unstyled, accessible components that I can customize. This gives me the design control I want without reinventing complex behaviors like modals, dropdowns, and form controls.

## Key Technical Decisions

### MDX over Plain Markdown

I chose MDX (Markdown with JSX) to allow:

1. **Interactive Examples**: Embedding React components in content
2. **Custom Components**: Creating specialized displays for code, quotes, etc.
3. **Dynamic Content**: Adding visualizations and special layouts

### TypeScript for Type Safety

TypeScript has been essential for:

1. **Content Validation**: Creating interfaces for each content type
2. **Refactoring Confidence**: Changing code structure with safety
3. **Better Developer Experience**: Autocomplete and documentation

It did lead to some challenges with dynamic route types, but the benefits far outweighed the costs.

### Client-Side vs. Server Components

I carefully consider which components need interactivity:

- **Server Components**: Content display, navigation, static elements
- **Client Components**: Interactive filters, search, theme toggles

This "server-first" approach significantly reduces the JavaScript sent to browsers.

## Deployment and Hosting

I deploy Lilyslab to Vercel because:

1. **Next.js Integration**: Perfect pairing with my framework
2. **Preview Deployments**: Every PR gets a live preview
3. **Edge Functions**: API routes run closer to users
4. **Analytics**: Built-in web vitals tracking

The site is set to rebuild daily, ensuring fresh content without manual deploys.

## Reflections and Lessons

### What Worked Well

1. **File-based Content**: Simple, portable, and version-controlled
2. **Component Modularity**: Easy to add new sections and features
3. **Type Safety**: Caught many bugs during development

### What I'd Reconsider

1. **Metadata Handling**: Setting up consistent metadata was trickier than expected
2. **Image Management**: Next.js image optimization is powerful but required more configuration than anticipated
3. **State Management**: For simpler features, prop drilling would have been sufficient

## Future Architecture Plans

As Lilyslab grows, I'm planning several architectural improvements:

1. **Content Search**: Adding vector search for semantic queries
2. **Interactive Components**: More dynamic elements in the digital garden
3. **Automated Testing**: Expanding test coverage for critical paths
4. **Performance Optimization**: Further reducing bundle sizes and load times

## Conclusion

Architecture isn't just about technical decisions—it's about creating systems that support your goals and workflow. For my [digital garden](/cultivating-my-digital-garden) and [digital workshop](/building-a-digital-workshop), this architecture provides the right balance of flexibility, performance, and maintainability.

Every project has unique requirements, so your choices may differ. The important thing is to make deliberate decisions based on your specific needs rather than blindly following trends.

If you're building your own digital space, I hope these insights help you navigate your own architectural decisions.

---

*Have questions about my approach or want to discuss web architecture? Feel free to reach out—I'd love to exchange ideas.*
