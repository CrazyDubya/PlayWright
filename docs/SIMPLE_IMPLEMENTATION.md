# Simple Static HTML Implementation

## Overview

This is a **pure static HTML/CSS/JavaScript** implementation - no React, no build process, no dependencies to install.

## How It Works

### Files

1. **`projects.html`** - Lists all musical projects
2. **`project.html`** - Displays individual project content with tabs
3. **`projects-index.json`** - Index of all project files (generated)
4. **`generate-index.py`** - Script to regenerate index when projects change

### Features

- ✅ Browse all musical projects
- ✅ View scripts, scenes, songs with tabbed interface
- ✅ Markdown rendering (using marked.js from CDN)
- ✅ Responsive design
- ✅ Full accessibility features (inherited from existing site)
- ✅ No build process needed
- ✅ No Node.js dependencies

### How Content is Loaded

1. User clicks on a project in `projects.html`
2. `project.html?id=echo_musical` loads
3. JavaScript fetches `projects-index.json` to get file list
4. User clicks tabs to load different content types
5. Files are fetched directly from `/projects/` directory
6. Markdown is rendered client-side with marked.js

### Adding New Content

When you add or modify project files:

```bash
python3 generate-index.py
git add docs/projects-index.json
git commit -m "Update project index"
git push
```

That's it! No build process, no npm install, no complex deployment.

## Technical Details

### Dependencies

- **marked.js** (via CDN) - Markdown rendering
- **Existing accessibility JS** - Theme switching, font controls

### Browser Requirements

- Modern browser with ES6 support
- JavaScript enabled
- Fetch API support

### File Size

- `projects.html`: ~5KB
- `project.html`: ~11KB  
- `projects-index.json`: ~9KB (varies with content)
- Total overhead: ~25KB (vs 210KB+ for React bundle)

## Comparison to Previous Implementation

| Feature | React Version | Static HTML Version |
|---------|--------------|---------------------|
| Bundle Size | 210KB+ | ~25KB |
| Dependencies | 1440+ npm packages | 0 |
| Build Time | ~65 seconds | 0 seconds |
| Build Process | 3-step (generate, build, deploy) | 1-step (generate index) |
| Deployment | Complex scripts | Copy files |
| Maintenance | Complex | Simple |
| Learning Curve | React knowledge needed | Basic HTML/JS |

## Why This is Better

1. **Simpler** - No build toolchain, no transpilation, no bundling
2. **Faster** - Smaller files, instant deployment
3. **Maintainable** - Anyone can edit HTML/JS
4. **Portable** - Works anywhere static files are served
5. **Debuggable** - View source shows actual code
6. **Future-proof** - No framework version upgrades needed

## For Future Developers

If you need to modify this:

1. **Add a new tab** - Edit the `initProject()` function in `project.html`
2. **Change styling** - Edit `assets/css/main.css`
3. **Modify layout** - Edit the HTML directly
4. **Add features** - Add vanilla JavaScript

No webpack config, no babel, no complex toolchain. Just edit and deploy.
