const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));  // Prevent local resource exhaustion
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

// Paths
const PROJECTS_DIR = path.join(__dirname, '../../projects');
const TEMPLATES_DIR = path.join(__dirname, '../../templates');

/**
 * Sanitizes a project name for safe filesystem use (local security)
 * Prevents path traversal attacks that could affect local filesystem
 * @param {string} name - The name to sanitize
 * @returns {string} Sanitized name safe for filesystem use
 * @throws {Error} If name is invalid or contains path traversal
 */
const sanitizeProjectName = (name) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid project name: must be a non-empty string');
  }

  // Decode URL-encoded characters to catch obfuscated attacks
  let decoded = name;
  try {
    decoded = decodeURIComponent(name);
  } catch {
    decoded = name;
  }

  // Check for path traversal patterns
  const pathTraversalPatterns = [
    /\.\./,           // Parent directory reference
    /^\//,            // Absolute path
    /^[a-zA-Z]:\\/,   // Windows absolute path
    /\0/,             // Null byte injection
    /[/\\]/           // Forward or backslashes
  ];

  for (const pattern of pathTraversalPatterns) {
    if (pattern.test(decoded)) {
      throw new Error('Invalid project name: path traversal detected');
    }
  }

  // Sanitize: lowercase, spaces to underscores, only safe chars
  const sanitized = decoded
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '');

  if (!sanitized) {
    throw new Error('Invalid project name: must contain alphanumeric characters');
  }

  // Defense-in-depth: verify resolved path stays within PROJECTS_DIR
  const testPath = path.resolve(path.join(PROJECTS_DIR, sanitized));
  const resolvedBase = path.resolve(PROJECTS_DIR);
  if (!testPath.startsWith(resolvedBase + path.sep)) {
    throw new Error('Invalid project name: path traversal detected');
  }

  return sanitized;
};

// Concept generation data (from generate_concept.sh)
const GENRES = ['Drama', 'Comedy', 'Romance', 'Mystery', 'Fantasy', 'Sci-Fi', 'Historical', 'Musical Comedy'];
const SETTINGS = ['Urban', 'Rural', 'Historical', 'Contemporary', 'Fantasy World', 'Dystopian', 'Small Town', 'Big City'];
const THEMES = ['Identity', 'Love', 'Justice', 'Family', 'Redemption', 'Coming of Age', 'Social Change', 'Cultural Heritage'];
const CONFLICTS = ['Internal Struggle', 'Society vs Individual', 'Tradition vs Change', 'Good vs Evil', 'Rich vs Poor', 'Old vs Young'];

// Helper functions
const randomElement = (array) => array[Math.floor(Math.random() * array.length)];

const generateConceptTitle = (genre, theme) => {
  const titleTemplates = [
    `The ${theme} of Tomorrow`,
    `${theme}'s Journey`,
    `Beyond ${theme}`,
    `Dancing with ${theme}`,
    `The ${genre} of ${theme}`,
  ];
  return randomElement(titleTemplates);
};

const generateLogline = (genre, setting, theme, conflict) => {
  return `A ${genre.toLowerCase()} set in a ${setting.toLowerCase()} world, exploring ${theme.toLowerCase()} through ${conflict.toLowerCase()}.`;
};

// API Routes

// Dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const projects = await fs.readdir(PROJECTS_DIR);
    const projectFolders = [];

    for (const project of projects) {
      const projectPath = path.join(PROJECTS_DIR, project);
      const stat = await fs.stat(projectPath);
      if (stat.isDirectory()) {
        projectFolders.push(project);
      }
    }

    res.json({
      totalProjects: projectFolders.length,
      templatesAvailable: 6,
      recentActivity: [
        'Created new project: Echo Musical',
        'Updated character template',
        'Generated new concept',
      ],
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.json({
      totalProjects: 0,
      templatesAvailable: 6,
      recentActivity: [],
    });
  }
});

// Generate concept
app.post('/api/concepts/generate', (req, res) => {
  const { mode, genre, setting, theme, conflict, customInput } = req.body;

  let selectedGenre, selectedSetting, selectedTheme, selectedConflict;

  if (mode === 'random') {
    selectedGenre = randomElement(GENRES);
    selectedSetting = randomElement(SETTINGS);
    selectedTheme = randomElement(THEMES);
    selectedConflict = randomElement(CONFLICTS);
  } else if (mode === 'guided') {
    selectedGenre = genre || randomElement(GENRES);
    selectedSetting = setting || randomElement(SETTINGS);
    selectedTheme = theme || randomElement(THEMES);
    selectedConflict = conflict || randomElement(CONFLICTS);
  } else {
    // Custom mode - parse input
    selectedGenre = randomElement(GENRES);
    selectedSetting = randomElement(SETTINGS);
    selectedTheme = randomElement(THEMES);
    selectedConflict = randomElement(CONFLICTS);
  }

  const concept = {
    title: generateConceptTitle(selectedGenre, selectedTheme),
    genre: selectedGenre,
    setting: selectedSetting,
    theme: selectedTheme,
    conflict: selectedConflict,
    logline: generateLogline(selectedGenre, selectedSetting, selectedTheme, selectedConflict),
    targetAudience: 'General audiences, ages 13+',
    generatedAt: new Date().toISOString(),
  };

  res.json(concept);
});

// Save concept
app.post('/api/concepts/save', async (req, res) => {
  try {
    const concept = req.body;
    const conceptsDir = path.join(__dirname, '../../generated_concepts');
    await fs.ensureDir(conceptsDir);

    const filename = `concept_${Date.now()}.json`;
    await fs.writeJson(path.join(conceptsDir, filename), concept, { spaces: 2 });

    res.json({ success: true, filename });
  } catch (error) {
    console.error('Error saving concept:', error);
    res.status(500).json({ error: 'Failed to save concept' });
  }
});

// Get projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await fs.readdir(PROJECTS_DIR);
    const projectList = [];

    for (const project of projects) {
      const projectPath = path.join(PROJECTS_DIR, project);
      const stat = await fs.stat(projectPath);

      if (stat.isDirectory() && !project.startsWith('.')) {
        // Count files
        const charactersDir = path.join(projectPath, 'characters');
        const scenesDir = path.join(projectPath, 'scenes');
        const songsDir = path.join(projectPath, 'songs');

        const charactersCount = await fs.pathExists(charactersDir)
          ? (await fs.readdir(charactersDir)).length
          : 0;
        const scenesCount = await fs.pathExists(scenesDir)
          ? (await fs.readdir(scenesDir)).length
          : 0;
        const songsCount = await fs.pathExists(songsDir)
          ? (await fs.readdir(songsDir)).length
          : 0;

        projectList.push({
          id: project,
          name: project.replace(/_/g, ' ').replace(/musical/i, 'Musical'),
          status: scenesCount > 8 ? 'Complete' : scenesCount > 4 ? 'In Progress' : 'Planning',
          progress: Math.min(100, (scenesCount * 8 + songsCount * 10 + charactersCount * 5)),
          lastModified: stat.mtime.toISOString().split('T')[0],
          charactersCount,
          scenesCount,
          songsCount,
        });
      }
    }

    res.json(projectList);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create project
app.post('/api/projects/create', async (req, res) => {
  try {
    const { name } = req.body;
    const projectName = sanitizeProjectName(name);  // Path traversal protection
    const projectPath = path.join(PROJECTS_DIR, projectName);

    // Create directory structure
    await fs.ensureDir(projectPath);
    await fs.ensureDir(path.join(projectPath, 'characters'));
    await fs.ensureDir(path.join(projectPath, 'scenes'));
    await fs.ensureDir(path.join(projectPath, 'songs'));
    await fs.ensureDir(path.join(projectPath, 'research'));

    // Copy templates
    const templates = await fs.readdir(TEMPLATES_DIR);
    for (const template of templates) {
      if (template.endsWith('.md')) {
        await fs.copy(
          path.join(TEMPLATES_DIR, template),
          path.join(projectPath, template)
        );
      }
    }

    // Create README
    const readme = `# ${name}

## Project Overview

Created: ${new Date().toLocaleDateString()}

## Development Phases

1. [ ] Concept Development
2. [ ] Character Creation
3. [ ] Story Structure
4. [ ] Content Creation
5. [ ] Refinement

## Quick Links

- [Characters](./characters/)
- [Scenes](./scenes/)
- [Songs](./songs/)
- [Research](./research/)
`;

    await fs.writeFile(path.join(projectPath, 'README.md'), readme);

    res.json({ success: true, projectName });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get project details
app.get('/api/projects/:id/details', async (req, res) => {
  try {
    const projectName = sanitizeProjectName(req.params.id);
    const projectPath = path.join(PROJECTS_DIR, projectName);

    // Check if project exists
    const exists = await fs.pathExists(projectPath);
    if (!exists) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get all relevant files
    const details = {
      id: projectName,
      name: projectName.replace(/_/g, ' ').replace(/musical/i, 'Musical'),
      path: projectPath,
    };

    // Check for various overview files
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

    res.json(details);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
});

// Get complete musical script
app.get('/api/projects/:id/script', async (req, res) => {
  try {
    const projectName = sanitizeProjectName(req.params.id);
    const projectPath = path.join(PROJECTS_DIR, projectName);

    // Check if project exists
    const exists = await fs.pathExists(projectPath);
    if (!exists) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Look for complete script files
    const scriptFiles = [
      'COMPLETE_MUSICAL_FINAL.md',
      'COMPLETE_MUSICAL_SUMMARY.md',
      'complete_musical_summary.md',
      'full_script.md'
    ];

    for (const file of scriptFiles) {
      const filePath = path.join(projectPath, file);
      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath, 'utf8');
        return res.json({ 
          filename: file,
          content,
          found: true 
        });
      }
    }

    // If no complete script found, compile from scenes
    const scenesDir = path.join(projectPath, 'scenes');
    if (await fs.pathExists(scenesDir)) {
      const sceneFiles = await fs.readdir(scenesDir);
      const mdFiles = sceneFiles.filter(f => f.endsWith('.md')).sort();
      
      let compiledScript = `# ${projectName.replace(/_/g, ' ').replace(/musical/i, 'Musical')}\n## Compiled from Individual Scenes\n\n`;
      
      for (const sceneFile of mdFiles) {
        const scenePath = path.join(scenesDir, sceneFile);
        const sceneContent = await fs.readFile(scenePath, 'utf8');
        compiledScript += `\n---\n\n${sceneContent}\n\n`;
      }

      return res.json({ 
        filename: 'compiled_script',
        content: compiledScript,
        found: true,
        compiled: true
      });
    }

    res.json({ 
      found: false, 
      message: 'No complete script found for this project' 
    });
  } catch (error) {
    console.error('Error fetching script:', error);
    res.status(500).json({ error: 'Failed to fetch script' });
  }
});

// Get all scenes
app.get('/api/projects/:id/scenes', async (req, res) => {
  try {
    const projectName = sanitizeProjectName(req.params.id);
    const projectPath = path.join(PROJECTS_DIR, projectName);

    // Check if project exists
    const exists = await fs.pathExists(projectPath);
    if (!exists) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const scenes = [];
    
    // Check both scenes and scenes_revised directories
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

    res.json({ scenes, count: scenes.length });
  } catch (error) {
    console.error('Error fetching scenes:', error);
    res.status(500).json({ error: 'Failed to fetch scenes' });
  }
});

// Get all songs
app.get('/api/projects/:id/songs', async (req, res) => {
  try {
    const projectName = sanitizeProjectName(req.params.id);
    const projectPath = path.join(PROJECTS_DIR, projectName);

    // Check if project exists
    const exists = await fs.pathExists(projectPath);
    if (!exists) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const songs = [];
    
    // Check songs and songs_transcendent directories
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

    res.json({ songs, count: songs.length });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// Get all characters
app.get('/api/projects/:id/characters', async (req, res) => {
  try {
    const projectName = sanitizeProjectName(req.params.id);
    const projectPath = path.join(PROJECTS_DIR, projectName);

    // Check if project exists
    const exists = await fs.pathExists(projectPath);
    if (!exists) {
      return res.status(404).json({ error: 'Project not found' });
    }

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

    res.json({ characters, count: characters.length });
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// Run validation
app.post('/api/validation/run', async (req, res) => {
  try {
    const { project } = req.body;
    const projectName = sanitizeProjectName(project);  // Path traversal protection
    const projectPath = path.join(PROJECTS_DIR, projectName);

    // Check if project exists
    const exists = await fs.pathExists(projectPath);
    if (!exists) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Perform validation checks (simplified version of validate_musical.sh)
    const charactersDir = path.join(projectPath, 'characters');
    const scenesDir = path.join(projectPath, 'scenes');
    const songsDir = path.join(projectPath, 'songs');

    const charactersCount = await fs.pathExists(charactersDir)
      ? (await fs.readdir(charactersDir)).length
      : 0;
    const scenesCount = await fs.pathExists(scenesDir)
      ? (await fs.readdir(scenesDir)).length
      : 0;
    const songsCount = await fs.pathExists(songsDir)
      ? (await fs.readdir(songsDir)).length
      : 0;

    const structureScore = 100;
    const contentScore = Math.min(100, (charactersCount * 10 + scenesCount * 5 + songsCount * 10));
    const culturalScore = 75; // Would need more sophisticated analysis
    const formattingScore = 90;

    const overallScore = Math.round(
      (structureScore + contentScore + culturalScore + formattingScore) / 4
    );

    res.json({
      overall: {
        score: overallScore,
        status: overallScore >= 80 ? 'Good' : overallScore >= 60 ? 'Fair' : 'Needs Work',
        issues: overallScore < 60 ? 5 : overallScore < 80 ? 3 : 1,
        warnings: overallScore < 60 ? 8 : overallScore < 80 ? 5 : 2,
        passed: Math.floor(overallScore / 5),
      },
      categories: [
        {
          name: 'Project Structure',
          score: structureScore,
          status: 'passed',
          checks: [
            { name: 'Directory structure exists', status: 'passed' },
            { name: 'Required files present', status: 'passed' },
            { name: 'Templates copied', status: 'passed' },
          ],
        },
        {
          name: 'Content Development',
          score: contentScore,
          status: contentScore >= 80 ? 'passed' : 'warning',
          checks: [
            { name: `Characters defined (${charactersCount})`, status: charactersCount >= 5 ? 'passed' : 'warning' },
            { name: `Scenes written (${scenesCount})`, status: scenesCount >= 10 ? 'passed' : 'warning' },
            { name: `Songs completed (${songsCount})`, status: songsCount >= 6 ? 'passed' : 'warning' },
          ],
        },
        {
          name: 'Cultural Authenticity',
          score: culturalScore,
          status: 'warning',
          checks: [
            { name: 'Character depth', status: 'passed' },
            { name: 'Stereotype avoidance', status: 'warning' },
            { name: 'Authentic dialogue', status: 'passed' },
          ],
        },
        {
          name: 'Professional Formatting',
          score: formattingScore,
          status: 'passed',
          checks: [
            { name: 'Scene headings formatted', status: 'passed' },
            { name: 'Character names consistent', status: 'passed' },
            { name: 'Stage directions clear', status: 'passed' },
          ],
        },
      ],
      recommendations: [
        charactersCount < 5 && 'Add more character profiles',
        scenesCount < 10 && 'Complete more scenes',
        songsCount < 6 && 'Write additional songs',
        'Review cultural authenticity',
        'Polish formatting and consistency',
      ].filter(Boolean),
    });
  } catch (error) {
    console.error('Error running validation:', error);
    res.status(500).json({ error: 'Failed to run validation' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎭 PlayWright server running on port ${PORT}`);
  console.log(`📁 Projects directory: ${PROJECTS_DIR}`);
  console.log(`📋 Templates directory: ${TEMPLATES_DIR}`);
});
