# Date Format Standards for Lilyslab Digital Garden

This document outlines the standards for date handling across the Lilyslab digital garden project.

## Date Fields in Content Files

### Standard Fields

- `createdAt`: When the content was first created (preferred over legacy `date` field)
- `lastUpdated`: When the content was last modified or updated

### Format

All dates should use the **ISO 8601** format: `YYYY-MM-DD` or full ISO timestamp `YYYY-MM-DDThh:mm:ss.sssZ`

Examples:
- `2025-04-30`
- `2025-04-30T14:28:00.000Z`

## Date Handling Guidelines

### When Migrating Content

1. When processing content files, maintain both `date` and `createdAt` fields temporarily for backward compatibility
2. For new content, use `createdAt` and `lastUpdated` fields exclusively

### For Client-side Display

1. Use the centralized formatting utilities in `lib/utils.ts`:
   - `formatDate`: For human-readable dates (Month Day, Year)
   - `formatDateForDisplay`: For compact date display (dd-mm-yyyy)
   - `safeFormatDate`: For data storage and sorting operations

## Fallbacks

1. If a date is invalid or missing, display a placeholder like "n/a" or "N/A" rather than "Invalid Date"
2. When data is required for sorting, default to the current date if the original date is invalid

## Technical Implementation

1. Dates should be validated at the data processing layer (e.g., in `lib/notes.ts`, `lib/garden/writings.ts`)
2. Components should prefer using the pre-formatted dates from data layers
3. For sorting operations, always use proper date objects with validation
