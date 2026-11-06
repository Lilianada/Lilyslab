# Media Digest

Each month is one file named `YYYY-MM.md`, like `2026-11.md`. The newest file shows at `/garden/media-digest`, and older ones stay available under "Past digests".

Copy this template and delete what you don't need. Empty sections don't appear on the page.

An entry can be one plain line (`- Girl from Nowhere`) or include any of these details: `by`, `url`, `rating` (out of 5, halves are fine), `note` and `cover` (an image link).

```yaml
---
intro: A line or two about the month.
songs:
  - title: Song name
    by: Artist
    url: https://example.com
movies:
  - title: Film name
    rating: 4.5
    note: What I thought of it.
    cover: https://example.com/poster.jpg
shows:
  - Show name
books:
  - title: Book name
    by: Author
    rating: 4
podcasts:
  - title: Episode name
    by: Podcast name
    url: https://example.com
articles:
  - title: Article name
    by: Publication
    url: https://example.com
    note: Why it stayed with me.
in:
  - Something I'm into
out:
  - Something I'm done with
---
```

To keep a month as a draft, add `published: false`. New digests go live on the next deploy.
