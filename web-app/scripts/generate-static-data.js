#!/usr/bin/env node

/**
 * Generate Static Data for GitHub Pages Deployment
 * 
 * This script reads the projects directory and generates static JSON files
 * that can be served from GitHub Pages without needing a Node.js backend.
 */

const fs = require('fs-extra');
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, '../../projects');
const OUTPUT_DIR = path.join(__dirname, '../client/public/api');

// Sanitize project name (same logic as server.js)
const sanitizeProjectName = (name) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid project name: must be a non-empty string');
  }

  const sanitized = name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '');

  if (!sanitized) {
    throw new Error('Invalid project name: must contain alphanumeric characters');
  }

  return sanitized;
};

// Main function to generate all static data
async function generateStaticData() {
  console.log('🎭 Generating static data for GitHub Pages...\n');

  // Ensure output directory exists
  await fs.ensureDir(OUTPUT_DIR);
  await fs.ensureDir(path.join(OUTPUT_DIR, 'projects'));

  // Read projects directory
  const projects = await fs.readdir(PROJECTS_DIR);
  const projectList = [];

  for (const project of projects) {
    const projectPath = path.join(PROJECTS_DIR, project);
    const stat = await fs.stat(projectPath);

    if (!stat.isDirectory() || project.startsWith('.')) {
      continue;
    }

    console.log(`Processing project: ${project}`);

    try {
      // Generate project metadata
      const metadata = await generateProjectMetadata(project, projectPath);
      projectList.push(metadata);

      // Generate detailed project data
      await generateProjectDetails(project, projectPath);
      await generateProjectScript(project, projectPath);
      await generateProjectScenes(project, projectPath);
      await generateProjectSongs(project, projectPath);
      await generateProjectCharacters(project, projectPath);

    } catch (error) {
      console.error(`  ❌ Error processing ${project}:`, error.message);
    }
  }

  // Write projects list
  await fs.writeJson(
    path.join(OUTPUT_DIR, 'projects.json'),
    projectList,
    { spaces: 2 }
  );

  console.log(`\n✅ Generated static data for ${projectList.length} projects`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

// Generate project metadata for the list view
async function generateProjectMetadata(projectId, projectPath) {
  const charactersDir = path.join(projectPath, 'characters');
  const scenesDir = path.join(projectPath, 'scenes');
  const songsDir = path.join(projectPath, 'songs');

  const charactersCount = await fs.pathExists(charactersDir)
    ? (await fs.readdir(charactersDir)).filter(f => f.endsWith('.md')).length
    : 0;
  const scenesCount = await fs.pathExists(scenesDir)
    ? (await fs.readdir(scenesDir)).filter(f => f.endsWith('.md')).length
    : 0;
  const songsCount = await fs.pathExists(songsDir)
    ? (await fs.readdir(songsDir)).filter(f => f.endsWith('.md')).length
    : 0;

  const stat = await fs.stat(projectPath);

  return {
    id: projectId,
    name: projectId.replace(/_/g, ' ').replace(/musical/i, 'Musical'),
    status: scenesCount > 8 ? 'Complete' : scenesCount > 4 ? 'In Progress' : 'Planning',
    progress: Math.min(100, (scenesCount * 8 + songsCount * 10 + charactersCount * 5)),
    lastModified: stat.mtime.toISOString().split('T')[0],
    charactersCount,
    scenesCount,
    songsCount,
  };
}

// Generate project details (overview files)
async function generateProjectDetails(projectId, projectPath) {
  const details = {
    id: projectId,
    name: projectId.replace(/_/g, ' ').replace(/musical/i, 'Musical'),
    path: projectPath,
  };

  const overviewFiles = [
    'README.md',
    'concept.md',
    'COMPLETE_MUSICAL_SUMMARY.md',
    'story_structure.md',
    'concept_overview.md'
  ];

  for (const file of overviewFiles) {
    const filePath = path.join(projectPath, file);
    if (await fs.pathExists(filePath)) {
      const content = await fs.readFile(filePath, 'utf8');
      details[file] = content;
    }
  }

  await fs.writeJson(
    path.join(OUTPUT_DIR, 'projects', `${projectId}-details.json`),
    details,
    { spaces: 2 }
  );
}

// Generate script data
async function generateProjectScript(projectId, projectPath) {
  const scriptFiles = [
    'COMPLETE_MUSICAL_FINAL.md',
    'COMPLETE_MUSICAL_SUMMARY.md',
    'complete_musical_summary.md',
    'full_script.md'
  ];

  let scriptData = { found: false };

  for (const file of scriptFiles) {
    const filePath = path.join(projectPath, file);
    if (await fs.pathExists(filePath)) {
      const content = await fs.readFile(filePath, 'utf8');
      scriptData = {
        filename: file,
        content,
        found: true
      };
      break;
    }
  }

  // If no complete script found, compile from scenes
  if (!scriptData.found) {
    const scenesDir = path.join(projectPath, 'scenes');
    if (await fs.pathExists(scenesDir)) {
      const sceneFiles = await fs.readdir(scenesDir);
      const mdFiles = sceneFiles.filter(f => f.endsWith('.md')).sort();
      
      if (mdFiles.length > 0) {
        let compiledScript = `# ${projectId.replace(/_/g, ' ').replace(/musical/i, 'Musical')}\n## Compiled from Individual Scenes\n\n`;
        
        for (const sceneFile of mdFiles) {
          const scenePath = path.join(scenesDir, sceneFile);
          const sceneContent = await fs.readFile(scenePath, 'utf8');
          compiledScript += `\n---\n\n${sceneContent}\n\n`;
        }

        scriptData = {
          filename: 'compiled_script',
          content: compiledScript,
          found: true,
          compiled: true
        };
      }
    }
  }

  await fs.writeJson(
    path.join(OUTPUT_DIR, 'projects', `${projectId}-script.json`),
    scriptData,
    { spaces: 2 }
  );
}

// Generate scenes data
async function generateProjectScenes(projectId, projectPath) {
  const scenes = [];
  const sceneDirs = ['scenes', 'scenes_revised'];

  for (const dirName of sceneDirs) {
    const scenesDir = path.join(projectPath, dirName);
    if (await fs.pathExists(scenesDir)) {
      const sceneFiles = await fs.readdir(scenesDir);
      const mdFiles = sceneFiles.filter(f => f.endsWith('.md')).sort();
      
      for (const sceneFile of mdFiles) {
        const scenePath = path.join(scenesDir, sceneFile);
        const content = await fs.readFile(scenePath, 'utf8');
        scenes.push({
          filename: sceneFile,
          name: sceneFile.replace('.md', '').replace(/_/g, ' '),
          content,
          directory: dirName
        });
      }
    }
  }

  await fs.writeJson(
    path.join(OUTPUT_DIR, 'projects', `${projectId}-scenes.json`),
    { scenes, count: scenes.length },
    { spaces: 2 }
  );
}

// Generate songs data
async function generateProjectSongs(projectId, projectPath) {
  const songs = [];
  const songDirs = ['songs', 'songs_transcendent'];

  for (const dirName of songDirs) {
    const songsDir = path.join(projectPath, dirName);
    if (await fs.pathExists(songsDir)) {
      const songFiles = await fs.readdir(songsDir);
      const mdFiles = songFiles.filter(f => f.endsWith('.md')).sort();
      
      for (const songFile of mdFiles) {
        const songPath = path.join(songsDir, songFile);
        const content = await fs.readFile(songPath, 'utf8');
        songs.push({
          filename: songFile,
          name: songFile.replace('.md', '').replace(/_/g, ' ').replace(/COMPLETE/i, '').trim(),
          content,
          directory: dirName
        });
      }
    }
  }

  await fs.writeJson(
    path.join(OUTPUT_DIR, 'projects', `${projectId}-songs.json`),
    { songs, count: songs.length },
    { spaces: 2 }
  );
}

// Generate characters data
async function generateProjectCharacters(projectId, projectPath) {
  const characters = [];

  // Check for characters.md file first
  const charactersFile = path.join(projectPath, 'characters.md');
  if (await fs.pathExists(charactersFile)) {
    const content = await fs.readFile(charactersFile, 'utf8');
    characters.push({
      filename: 'characters.md',
      name: 'All Characters',
      content,
      isCollection: true
    });
  }

  // Then check characters directory
  const charactersDir = path.join(projectPath, 'characters');
  if (await fs.pathExists(charactersDir)) {
    const characterFiles = await fs.readdir(charactersDir);
    const mdFiles = characterFiles.filter(f => f.endsWith('.md')).sort();
    
    for (const characterFile of mdFiles) {
      const characterPath = path.join(charactersDir, characterFile);
      const content = await fs.readFile(characterPath, 'utf8');
      characters.push({
        filename: characterFile,
        name: characterFile.replace('.md', '').replace(/_/g, ' '),
        content,
        isCollection: false
      });
    }
  }

  await fs.writeJson(
    path.join(OUTPUT_DIR, 'projects', `${projectId}-characters.json`),
    { characters, count: characters.length },
    { spaces: 2 }
  );
}

// Run the script
generateStaticData()
  .then(() => {
    console.log('\n✨ Static data generation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error generating static data:', error);
    process.exit(1);
  });
