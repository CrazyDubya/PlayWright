# Deploying to GitHub Pages

## Overview

The PlayWright web application can be deployed to GitHub Pages as a static site. This guide explains how the deployment works and how to update it.

## How It Works

The deployment process converts the dynamic React web app into a static site that can be served from GitHub Pages:

1. **Static Data Generation**: Project data from `/projects` is converted to JSON files
2. **Static Build**: React app is built to work without a Node.js backend
3. **Deploy to `/docs/app`**: Built files are copied to the docs folder for GitHub Pages

## Prerequisites

- Node.js and npm installed
- All dependencies installed (`npm run install-all` from `/web-app`)

## Deployment Steps

### Full Deployment (Recommended)

Run this command from the `/web-app` directory:

```bash
npm run build:github-pages
```

This command:
1. Generates static JSON files from project data
2. Builds the React app with static mode enabled
3. Copies everything to `/docs/app`
4. Creates `.nojekyll` file for GitHub Pages compatibility

### Step-by-Step Deployment

If you prefer to run each step separately:

```bash
# 1. Generate static data
npm run generate-data

# 2. Build the React app
cd client
cross-env REACT_APP_STATIC_MODE=true PUBLIC_URL=/PlayWright/app npm run build
cd ..

# 3. Deploy to docs folder
node scripts/deploy-to-docs.js
```

## After Deployment

1. **Commit the changes**:
   ```bash
   git add docs/
   git commit -m "Deploy web app to GitHub Pages"
   ```

2. **Push to GitHub**:
   ```bash
   git push
   ```

3. **Configure GitHub Pages** (one-time setup):
   - Go to repository Settings → Pages
   - Set source to "Deploy from a branch"
   - Select branch: `main` (or your default branch)
   - Select folder: `/docs`
   - Save

4. **Access your site**:
   - Main library: `https://<username>.github.io/PlayWright/`
   - Web app: `https://<username>.github.io/PlayWright/app/`

## File Structure

After deployment, the structure looks like this:

```
docs/
├── index.html           # Main musical library page
├── musicals/            # Static musical pages
├── assets/              # CSS, JS for library
├── .nojekyll           # Tells GitHub Pages to serve all files
└── app/                # React web application
    ├── index.html      # App entry point
    ├── static/         # Built JS and CSS
    └── api/            # Static JSON data
        ├── projects.json
        └── projects/   # Individual project data
            ├── echo_musical-details.json
            ├── echo_musical-script.json
            ├── echo_musical-scenes.json
            ├── echo_musical-songs.json
            └── ...
```

## How the App Works

### Development Mode (Local)
- Backend: Express server on http://localhost:5000
- Frontend: React app on http://localhost:3000
- API calls: Direct to backend via axios

### Production Mode (GitHub Pages)
- No backend server needed
- Frontend: Static React app at `/docs/app`
- API calls: Fetch from static JSON files in `/docs/app/api`

The app automatically detects which mode to use based on:
- Environment variable: `REACT_APP_STATIC_MODE=true`
- Domain: Checks if running on `github.io`

## Updating Content

When you add or modify projects:

1. Make changes to files in `/projects` directory
2. Run the deployment script again:
   ```bash
   cd web-app
   npm run build:github-pages
   ```
3. Commit and push the updated `/docs` folder

## Troubleshooting

### Build Fails with Lint Errors

The build treats warnings as errors in CI mode. Fix any lint errors before building:
- Remove unused imports
- Fix React Hook dependencies
- Address ESLint warnings

### App Shows 404 Errors

Check that:
- `.nojekyll` file exists in `/docs`
- `PUBLIC_URL` is set correctly in build command
- GitHub Pages is configured to serve from `/docs` folder

### Data Not Loading

Verify that:
- Static JSON files exist in `/docs/app/api/`
- File paths match the project IDs
- Browser console shows no 404 errors

### App Not Updating on GitHub Pages

GitHub Pages can take a few minutes to update. To force refresh:
1. Clear browser cache
2. Wait 5-10 minutes after pushing
3. Check GitHub Actions for any deployment errors

## Scripts Reference

### In `/web-app/package.json`:

- `npm run build:github-pages` - Full deployment process
- `npm run generate-data` - Generate static JSON files only
- `npm run build` - Build React app (for local use)
- `npm run dev` - Run app locally with backend

### Available Scripts:

- `/web-app/scripts/generate-static-data.js` - Converts projects to JSON
- `/web-app/scripts/deploy-to-docs.js` - Copies build to docs folder

## Key Files

### `/web-app/client/src/utils/apiClient.js`
Abstraction layer that handles both API and static file access. Automatically switches based on environment.

### `/web-app/scripts/generate-static-data.js`
Reads all projects from `/projects` directory and generates:
- `projects.json` - List of all projects with metadata
- `{project-id}-details.json` - Overview and summary files
- `{project-id}-script.json` - Complete script or compiled scenes
- `{project-id}-scenes.json` - All scene files
- `{project-id}-songs.json` - All song files
- `{project-id}-characters.json` - Character profiles

## Development vs Production

### Development (with backend):
```bash
cd web-app
npm run dev
# Opens http://localhost:3000
```

### Production (GitHub Pages):
```bash
cd web-app
npm run build:github-pages
git add docs/
git commit -m "Update deployment"
git push
# Visit https://<username>.github.io/PlayWright/app/
```

## Notes

- The static build includes all project data, making the deployment self-contained
- No server-side code runs on GitHub Pages
- Features like creating new projects are disabled in static mode
- The app gracefully falls back to static mode when backend is unavailable
