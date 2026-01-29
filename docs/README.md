# Musical Library - GitHub Pages

This directory contains a complete GitHub Pages site for the PlayWright Musical Library, featuring 10 original musicals with full accessibility features, plus an interactive web application for viewing complete scripts, songs, and characters.

## Features

### 🎭 Interactive Web Application (NEW!)

A modern React-based web app is now available at `/app/`:
- **View Complete Scripts**: Read full musical scripts with scene compilation
- **Browse Songs & Lyrics**: Access all song lyrics with staging notes  
- **Character Profiles**: Detailed character backgrounds and development
- **Tabbed Navigation**: Easy access to all project content
- **Search & Filter**: Find specific projects, scenes, or songs
- **Responsive Design**: Works on all devices

Access the web app at: `https://<username>.github.io/PlayWright/app/`

For deployment and development instructions, see [web-app/DEPLOYMENT.md](../web-app/DEPLOYMENT.md)

### Accessibility
- **Theme Options**: Light, dark, and system-preferred themes
- **Text Size Control**: 5 levels from small to extra-extra-large
- **Dyslexia-Friendly Font**: Toggle OpenDyslexic-style font
- **Screen Reader Compatible**: Full ARIA labels and semantic HTML
- **Keyboard Navigation**: Complete keyboard support
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### Content
- **10 Complete Musicals**: Each with full synopsis, character profiles, and song lists
- **Individual Reader Pages**: Clean, organized presentation for each musical
- **Learn More Pages**: Detailed breakdowns of songs, characters, and production details
- **Musical Index**: Browse all musicals from the homepage

## Musicals Included

1. **Echo: Digital Immortality** - Sci-Fi Musical Drama
2. **Electric Dreams** - Psychological Musical Thriller
3. **Fractured Mirrors** - Psychological Musical Thriller
4. **Midnight at the Majestic** - Murder Mystery Musical
5. **Neon Hearts** - Burlesque Musical Drama
6. **Neon Rebellion** - Teen Rock Musical
7. **Picket Fence Prison** - Suburban Drama Musical
8. **Rainbow Academy** - Children's Musical Mystery
9. **The Silly Magic Academy** - Children's Comedy Musical
10. **Second Act** - Broadway Comeback Musical

## File Structure

```
docs/
├── index.html                  # Main library homepage
├── _config.yml                 # GitHub Pages configuration
├── app/                        # Interactive web application
│   ├── index.html             # React app entry point
│   ├── static/                # Built JavaScript and CSS
│   └── api/                   # Static JSON data for projects
│       ├── projects.json      # List of all projects
│       └── projects/          # Individual project data files
├── assets/
│   ├── css/
│   │   └── main.css           # Main stylesheet with accessibility features
│   └── js/
│       └── main.js            # Accessibility controls JavaScript
└── musicals/
    ├── echo.html              # Individual musical reader pages
    ├── echo-learn-more.html   # Detailed song/character pages
    └── [... 18 more pages]
```

## Setup

### Enable GitHub Pages

1. Go to your repository Settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select the branch (usually `main` or `copilot/create-github-page-for-musicals`)
4. Select `/docs` as the folder
5. Click "Save"
6. Your site will be published at: `https://[username].github.io/[repository-name]/`

### Local Development

To test locally:

1. Open `docs/index.html` in a web browser
2. All links are relative and will work locally
3. JavaScript features (theme switching, font size) work without a server

## Accessibility Features Implementation

### Theme Switching
- Light/Dark/System themes
- CSS custom properties for easy theming
- Persists user preference in localStorage
- System theme respects OS preference

### Font Size Control
- 5 size levels: small, normal, large, xlarge, xxlarge
- Increase/Decrease/Reset buttons
- Persists preference in localStorage
- Affects all text elements proportionally

### Dyslexia-Friendly Font
- Toggle button for dyslexia-friendly typography
- Increased letter and word spacing
- Persists preference in localStorage
- Falls back gracefully if font unavailable

### Screen Reader Support
- Semantic HTML5 elements
- ARIA labels on all interactive elements
- Skip to content link
- Status announcements for dynamic changes
- Proper heading hierarchy

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Visible focus indicators
- Logical tab order
- No keyboard traps

## Browser Support

- Modern Chrome, Firefox, Safari, Edge
- iOS Safari 12+
- Android Chrome 80+
- Graceful degradation for older browsers

## Customization

### Updating Musical Content
Edit individual HTML files in `docs/musicals/` to update content.

### Styling Changes
Modify `docs/assets/css/main.css` to change colors, fonts, or layout.

### Adding Musicals
1. Create new HTML files following the existing structure
2. Update `docs/index.html` to add new musical to the grid
3. Ensure all links are relative and functional

## License

Content is part of the PlayWright repository. See main repository LICENSE for details.

## Credits

Created as part of the PlayWright project - an experimental musical creation platform.
