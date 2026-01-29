#!/usr/bin/env node

/**
 * Deploy to GitHub Pages (docs folder)
 * 
 * This script copies the built React app to the /docs/app folder
 * so it can be served by GitHub Pages.
 */

const fs = require('fs-extra');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../client/build');
const DOCS_APP_DIR = path.join(__dirname, '../../docs/app');

async function deployToGitHubPages() {
  console.log('📦 Deploying to GitHub Pages...\n');

  try {
    // Check if build directory exists
    if (!await fs.pathExists(BUILD_DIR)) {
      throw new Error('Build directory not found. Please run "npm run build:static" first.');
    }

    // Remove old app directory if it exists
    if (await fs.pathExists(DOCS_APP_DIR)) {
      console.log('🗑️  Removing old deployment...');
      await fs.remove(DOCS_APP_DIR);
    }

    // Create docs/app directory
    await fs.ensureDir(DOCS_APP_DIR);

    // Copy build files to docs/app
    console.log('📂 Copying build files to docs/app...');
    await fs.copy(BUILD_DIR, DOCS_APP_DIR);

    // Create a .nojekyll file in docs to prevent GitHub Pages from ignoring files with underscores
    const nojekyllPath = path.join(__dirname, '../../docs/.nojekyll');
    await fs.ensureFile(nojekyllPath);

    console.log('\n✅ Deployment complete!');
    console.log('📁 Files copied to:', DOCS_APP_DIR);
    console.log('\n🌐 Your app will be available at:');
    console.log('   https://<username>.github.io/PlayWright/app/');
    console.log('\n📝 Next steps:');
    console.log('   1. Commit the changes in the docs/ folder');
    console.log('   2. Push to GitHub');
    console.log('   3. Ensure GitHub Pages is configured to serve from /docs folder');

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run the deployment
deployToGitHubPages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
