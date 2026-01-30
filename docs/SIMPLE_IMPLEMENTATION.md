# Simple Static HTML Implementation

## Overview

This is a **pure static HTML/CSS/JavaScript** implementation - no React, no build process, no dependencies to install.

The implementation **enhances the existing musical library pages** rather than replacing them. The existing pages already have rich, hand-crafted content. We simply add links to view complete source files.

## How It Works

### Existing Structure (Preserved)

The docs already have excellent static pages:

- **`index.html`** - Main library homepage with musical cards
- **`musicals/echo.html`** - Synopsis and story for Echo musical
- **`musicals/echo-learn-more.html`** - Complete songs and character details

These pages have:
- ✅ Detailed synopses and themes
- ✅ Story structure breakdowns
- ✅ Complete song lists with descriptions
- ✅ Character profiles
- ✅ Accessibility features
- ✅ Beautiful styling

### What Was Added

1. **`musicals/view-files.html`** - Utility page for browsing raw project files
2. **Link in each *-learn-more.html** - "Complete Project Files" section
3. **`projects-index.json`** - Index of all project files
4. **`generate-index.py`** - Script to regenerate index

### User Flow

1. User visits main library → sees musical cards
2. Clicks "Echo: Digital Immortality" → goes to `echo.html` (synopsis)
3. Clicks "Learn More: Songs & Characters" → goes to `echo-learn-more.html`
4. Scrolls to "Complete Project Files" section
5. Clicks "Browse All Source Files" → goes to `view-files.html?id=echo_musical`
6. Views tabs for Overview, Scenes, Songs with raw markdown content

### Integration Points

Each *-learn-more.html page now includes:

```html
<section>
  <h2>📁 Complete Project Files</h2>
  <p>View the complete source materials for this musical...</p>
  <a href="view-files.html?id=echo_musical">
    Browse All Source Files →
  </a>
</section>
```

This adds functionality **without disrupting** the existing well-crafted pages.

## Technical Details

### Dependencies

- **marked.js** (via CDN) - Markdown rendering
- **Existing accessibility JS** - Theme switching, font controls

### File Size

- `view-files.html`: ~10KB (utility page)
- `projects-index.json`: ~9KB (file manifest)
- Added to each learn-more page: ~500 bytes

### Adding New Content

When project files change:

```bash
python3 generate-index.py
git add docs/projects-index.json
git commit -m "Update project index"
git push
```

## Why This Approach is Better

1. **Respects Existing Work** - Doesn't replace hand-crafted content
2. **Progressive Enhancement** - Adds features without breaking existing pages
3. **Clear Separation** - Curated content vs. raw source files
4. **Maintainable** - Both systems work independently
5. **User Choice** - Users can view summaries OR dive into full source

## For Future Developers

The system has two layers:

**Layer 1: Curated Content** (already existed)
- Hand-crafted HTML pages with summaries
- Designed for reading and discovery
- Rich formatting and structure

**Layer 2: Source Files** (added)
- Raw markdown files from `/projects`
- For those who want complete scripts/lyrics
- Simple viewer with tabs

Both layers complement each other without interfering.
