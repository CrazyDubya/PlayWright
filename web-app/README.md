# PlayWright GUI - Modern Web Application

Welcome to the **PlayWright GUI** - a modern, web-based interface for the PlayWright Musical Theater Creation Framework!

## 🎭 Overview

This web application transforms the command-line PlayWright tools into a beautiful, user-friendly graphical interface featuring:

- **Modern UI** with Material Design components
- **Interactive Canvas** for visualizing story structure and character relationships
- **Tab-based Navigation** for easy access to all features
- **Real-time Concept Generation** with AI-powered suggestions
- **Project Management** with visual progress tracking
- **Template Editor** with live preview
- **Validation Dashboard** with detailed quality metrics
- **Comprehensive Documentation** built-in

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Navigate to the web-app directory**:
   ```bash
   cd web-app
   ```

2. **Install all dependencies** (root, client, and server):
   ```bash
   npm run install-all
   ```

### Running the Application

**Option 1: Run both client and server together** (recommended):
```bash
npm run dev
```

**Option 2: Run separately**:

Terminal 1 - Start the backend server:
```bash
npm run server
```

Terminal 2 - Start the frontend client:
```bash
npm run client
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
web-app/
├── package.json          # Root package with workspace config
├── client/               # React frontend application
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   │   ├── Navbar.js
│   │   │   └── Sidebar.js
│   │   ├── pages/       # Main application pages
│   │   │   ├── Dashboard.js
│   │   │   ├── ConceptGenerator.js
│   │   │   ├── ProjectManager.js
│   │   │   ├── CanvasWorkspace.js
│   │   │   ├── TemplateEditor.js
│   │   │   ├── ValidationDashboard.js
│   │   │   └── Documentation.js
│   │   ├── App.js       # Main app component
│   │   └── index.js     # Entry point
│   └── package.json
└── server/              # Node.js/Express backend
    ├── server.js        # Main server file
    └── package.json
```

## 🎨 Features

### 1. Dashboard
- Overview of all projects
- Quick action cards
- Recent activity feed
- Statistics and metrics

### 2. Concept Generator
- **Random Mode**: AI generates unique concepts
- **Guided Mode**: Select specific elements (genre, setting, theme, conflict)
- **Custom Mode**: Input your own ideas
- Save and export generated concepts

### 3. Project Manager
- Create and manage multiple musical projects
- Visual progress tracking
- Filter by status (All, In Progress, Completed)
- Track characters, scenes, and songs

### 4. Canvas Workspace
- **Interactive Canvas** with drawing tools
- **Character Mapping**: Visualize character relationships
- **Story Timeline**: Plot scenes chronologically
- **Relationship Web**: Map character connections
- Zoom, pan, and save functionality

### 5. Template Editor
- Access all 6 professional templates:
  - Character Development
  - Scene Structure
  - Song Lyrics
  - Dance Numbers
  - Ensemble Pieces
  - Technical Requirements
- **Live Preview** with Markdown rendering
- Edit and save customized templates

### 6. Validation Dashboard
- Comprehensive project validation
- Visual quality metrics
- Category breakdown:
  - Project Structure
  - Content Development
  - Cultural Authenticity
  - Professional Formatting
- Actionable recommendations

### 7. Documentation
- Built-in guides and tutorials
- Quick Start Guide
- Creative Methodology
- Feature documentation
- Template guides

## 🛠 Technology Stack

### Frontend
- **React** 18.2 - UI framework
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **fs-extra** - File system utilities
- **Marked** - Markdown processing
- **CORS** - Cross-origin support

## 🎯 Development

### Available Scripts

From the root `web-app/` directory:

- `npm run dev` - Run both client and server concurrently
- `npm run client` - Run only the React frontend
- `npm run server` - Run only the Node.js backend
- `npm run install-all` - Install all dependencies

From the `client/` directory:

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

From the `server/` directory:

- `npm start` - Start server
- `npm run dev` - Start server with auto-reload (nodemon)

## 📡 API Endpoints

The backend server provides the following REST API endpoints:

- `GET /api/health` - Health check
- `GET /api/dashboard/stats` - Dashboard statistics
- `POST /api/concepts/generate` - Generate musical concept
- `POST /api/concepts/save` - Save generated concept
- `GET /api/projects` - List all projects
- `POST /api/projects/create` - Create new project
- `POST /api/validation/run` - Run project validation

## 🎨 UI Components

### Navigation
- **Top Navbar**: App branding, menu toggle, version info
- **Side Sidebar**: Main navigation menu with icons

### Pages
All pages feature:
- Consistent header styling
- Gradient accent colors
- Responsive grid layouts
- Interactive cards and buttons
- Smooth transitions and animations

### Canvas Features
- Grid background
- Drag-and-drop elements
- Character nodes
- Scene blocks
- Relationship connections
- Zoom controls
- Save/load functionality

## 🔧 Configuration

### Port Configuration
- Frontend: Port 3000 (configurable in `client/.env`)
- Backend: Port 5000 (configurable in `server/.env` or `PORT` env variable)

### Proxy Setup
The client is configured to proxy API requests to the backend server. This is defined in `client/package.json`:

```json
"proxy": "http://localhost:5000"
```

## 📦 Building for Production

### Build the frontend:
```bash
cd client
npm run build
```

This creates an optimized production build in `client/build/`.

### Serve the production build:

You can serve the built files using the Express server by adding static file serving:

```javascript
app.use(express.static(path.join(__dirname, '../client/build')));
```

## 🚀 Deployment

### Option 1: Traditional Hosting
1. Build the React app
2. Configure Express to serve static files
3. Deploy to your hosting service (Heroku, AWS, DigitalOcean, etc.)

### Option 2: Separate Deployment
- Deploy frontend to: Vercel, Netlify, GitHub Pages
- Deploy backend to: Heroku, AWS Lambda, DigitalOcean

### Option 3: Docker
Create a Dockerfile for containerized deployment (coming soon)

## 🎭 Migration from CLI

The GUI replaces the following CLI tools:

| CLI Tool | GUI Equivalent |
|----------|---------------|
| `generate_concept.sh` | Concept Generator page |
| `init_musical.sh` | Project Manager - New Project |
| `validate_musical.sh` | Validation Dashboard |
| Manual file editing | Template Editor |
| Directory navigation | Project Manager |

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000 or 5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API requests failing
- Ensure backend server is running on port 5000
- Check proxy configuration in `client/package.json`
- Verify CORS is enabled in `server/server.js`

## 🤝 Contributing

This GUI is part of the PlayWright framework. To contribute:

1. Make your changes in the `web-app/` directory
2. Test thoroughly
3. Update documentation
4. Submit a pull request

## 📄 License

Part of the PlayWright Musical Theater Creation Framework.

## 🎉 Acknowledgments

Built with ❤️ to make musical theater creation accessible to everyone, not just command-line wizards!

---

**Ready to create amazing musicals?** Start the app and visit http://localhost:3000! 🎭✨
