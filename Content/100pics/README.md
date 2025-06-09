# 100 Pics in 100 Days

This folder contains the data for the "100 pics in 100 days" project.

## Structure

- `pictures.md` - Main content file containing all picture entries in markdown format

## Adding New Pictures

To add a new picture to the collection, edit the `pictures.md` file and add a new day section following this format:

```markdown
## Day [NUMBER]
- **Title**: [Your picture title]
- **Date Taken**: YYYY-MM-DD
- **Image URL**: [URL to your image]
```

### Steps to Add a Picture:

1. Open `pictures.md`
2. Add a new day section at the end
3. Update the frontmatter:
   - Increment `totalPictures` count
   - Update `lastUpdated` date

### Example Entry:

```markdown
## Day 4
- **Title**: Beautiful sunrise over the mountains
- **Date Taken**: 2024-01-04
- **Image URL**: https://res.cloudinary.com/your-cloud/image/upload/v1/100pics/day4.jpg
```

### Tips:

1. Always increment the `dayNumber` sequentially
2. Use descriptive titles that capture the essence of the moment
3. Ensure image URLs are accessible and permanent
4. Keep the date format consistent (YYYY-MM-DD)
5. Images should ideally be square or will be cropped to square in the grid view
6. Consider image loading times - optimize images for web when possible
