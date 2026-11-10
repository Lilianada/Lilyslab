# Build Your Own Website

The free course at `/resources/build-your-own-website`. Each folder is a track, and each Markdown file inside it is a lesson.

## Add a lesson

Create a file in the track's folder. Start the name with a number so lessons stay in order, like `html/01-what-is-html.md`. The number doesn't show in the address, so that lesson lives at `/resources/build-your-own-website/html/what-is-html`.

```yaml
---
title: What Is HTML?
description: One line about what this lesson covers.
createdAt: 2026-11-10
published: true
---

The lesson itself, in Markdown.
```

A lesson only appears once it has `published: true`, so you can keep drafts here. Every published lesson gets a page and downloadable `.md` and `.txt` copies.

## Add or change a track

Each track's `index.md` holds its title, a one-line description and its place in the course (`order`). Anything you write below the frontmatter appears as an introduction at the top of the track's page.

```yaml
---
title: "HTML"
description: "The building blocks: putting words, links and images on a page."
order: 2
---
```

Wrap a description in quotes if it contains a colon. To add a new track, create a folder with its own `index.md`.
