---
createdAt: 2025-06-21
lastUpdated: 2025-06-23
---
# Lily's Garden Bookmarks System

## Overview

The bookmarks system in Lily's Garden has been reorganized to use a category-based approach rather than individual files for each bookmark. This improves scalability, makes filtering easier, and simplifies the process of adding new bookmarks.

## Directory Structure

Bookmarks are now stored in the `Content/bookmarks/` directory, with separate files for each category:

- `article.md` - Contains all article/essay bookmarks
- `website.md` - Contains all website bookmarks
- `video.md` - Contains all video bookmarks
- `misc.md` - Contains all miscellaneous bookmarks

## Bookmark Format

Each bookmark is stored in a markdown file with YAML frontmatter. Here's an example:

```markdown
---
publish: true
title: The Slow Web
URL: https://www.jackcheng.com/the-slow-web/
createdAt: 2025-06-06
lastUpdated: 2025-06-06
tags:
  - the internet
  - web
  - essay
type: article
id: article-017
---
```

Required fields:
- `publish`: Boolean indicating if the bookmark should be displayed (true/false)
- `title`: The title of the bookmark
- `URL`: The URL of the bookmark
- `date`: The date the bookmark was added (YYYY-MM-DD format)
- `tags`: Array of tags for filtering
- `type`: The category of the bookmark (article, website, video, misc)
- `id`: A unique identifier for the bookmark, format: `[category]-[number]`

## Adding New Bookmarks

### Using the Add Script

The easiest way to add a new bookmark is to use the provided script:

```bash
node scripts/add-bookmark.js
```

This interactive script will prompt you for all required information and add the bookmark to the appropriate category file.

### Manual Addition

To manually add a bookmark:

1. Open the appropriate category file (`article.md`, `website.md`, etc.)
2. Add a new entry at the end of the file using the format above
3. Make sure to increment the ID number from the last entry
4. Ensure there are no extra blank lines between entries

## Scripts

Several scripts are available to help manage bookmarks:

- `scripts/add-bookmark.js` - Interactive script to add a new bookmark
- `scripts/update-bookmarks-structure.js` - Used to rename the bookmarks directory
- `scripts/add-new-articles.js` - Used to batch add new article bookmarks
- `scripts/bookmark-migration.js` - Migration tool to convert between individual and category-based systems

### Migration Options

If needed, you can convert between the old individual file system and the new category-based system:

```bash
# Convert to individual files
node scripts/bookmark-migration.js to-individual

# Convert to category files
node scripts/bookmark-migration.js to-category
```

## User Interface

The bookmarks page allows filtering by both category and tag:

1. The category filter shows the count of bookmarks in each category
2. The tag filter allows filtering by specific tags
3. Filters can be combined to narrow down results

## Color Coding

Bookmarks are color-coded by category for easy visual identification:

- Article: Lavender (`bg-lavender`)
- Website: Peach (`bg-peach`)
- Video: Steel Blue (`bg-steelBlue`)
- Misc: Yellow (`bg-siteYellow`)
