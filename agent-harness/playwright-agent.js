#!/usr/bin/env node

/**
 * PlayWright Agent Harness
 *
 * A CLI tool that exposes the musical creation workflow as commands
 * for an agentic LLM to drive autonomously.
 *
 * API REFERENCE:
 * ==============
 *
 * PROJECT MANAGEMENT:
 *   project:list                    - List all projects
 *   project:create <name>           - Create new project with scaffolding
 *   project:status <name>           - Get detailed project status
 *   project:set-active <name>       - Set active project context
 *
 * CONCEPT GENERATION:
 *   concept:generate [--mode]       - Generate story concept (random|guided|custom)
 *   concept:save <project>          - Save concept to project
 *   concept:get <project>           - Get project's concept
 *
 * CHARACTER COMMANDS:
 *   character:create <project> <name> --json <data>  - Create character
 *   character:list <project>                          - List characters
 *   character:get <project> <name>                    - Get character details
 *   character:update <project> <name> --json <data>  - Update character
 *   character:evaluate <project> <name>               - Evaluate against criteria
 *
 * SCENE COMMANDS:
 *   scene:create <project> <act> <num> --json <data> - Create scene
 *   scene:list <project>                              - List all scenes
 *   scene:get <project> <act> <num>                   - Get scene content
 *   scene:update <project> <act> <num> --json <data> - Update scene
 *   scene:evaluate <project> <act> <num>              - Evaluate against criteria
 *
 * SONG COMMANDS:
 *   song:create <project> <name> --json <data>       - Create song
 *   song:list <project>                               - List all songs
 *   song:get <project> <name>                         - Get song content
 *   song:update <project> <name> --json <data>       - Update song
 *   song:evaluate <project> <name>                    - Evaluate against criteria
 *
 * DECISION ENGINE:
 *   decide:story-direction --context <json>          - Get story direction guidance
 *   decide:character-behavior --context <json>       - Get character behavior guidance
 *   decide:musical-moment --context <json>           - Decide if moment needs song
 *   decide:resolve-block --type <type> --context     - Get creative block resolution
 *
 * VALIDATION:
 *   validate:project <project>                        - Full project validation
 *   validate:scene <project> <act> <num>             - Validate single scene
 *   validate:song <project> <name>                   - Validate single song
 *   validate:character <project> <name>              - Validate character
 *   validate:transcendence <project>                 - Check transcendence criteria
 *
 * WORKFLOW:
 *   workflow:status <project>                         - Get current workflow state
 *   workflow:next-task <project>                      - Get next recommended task
 *   workflow:complete-task <project> <task-id>       - Mark task complete
 *   workflow:iterate <project>                        - Run iteration loop
 *
 * GENERATORS:
 *   generate:title --genre --theme                   - Generate title options
 *   generate:logline --json <concept>                - Generate logline
 *   generate:character-traits                        - Get trait suggestions
 *   generate:plot-twist                              - Get plot twist suggestions
 *   generate:dialogue-starter                        - Get dialogue starters
 */

const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// Paths
const PROJECTS_DIR = path.join(__dirname, '../projects');
const TEMPLATES_DIR = path.join(__dirname, '../templates');
const STATE_FILE = path.join(__dirname, '.agent-state.json');

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

const VALIDATION_LIMITS = {
  MIN_ACT: 1,
  MAX_ACT: 10,
  MIN_SCENE: 1,
  MAX_SCENE: 50,
  MIN_TEXT_LENGTH: 10,
  MIN_CULTURAL_LENGTH: 20
};

const EVALUATION_SCORES = {
  CULTURAL_SPECIFICITY: 15,
  INTERNAL_CONTRADICTIONS: 15,
  PERSONAL_TRAUMA: 15,
  ECONOMIC_REALITY: 15,
  CHARACTER_ARC: 20,
  FOUR_LAYERS: 20,
  CLEAR_OBJECTIVES: 20,
  OBSTACLES: 20,
  CONFLICT: 20,
  CHANGE: 20,
  THEME_CONNECTION: 20,
  DRAMATIC_FUNCTION: 20,
  CHARACTER_VOICE: 20,
  EMOTIONAL_JOURNEY: 20,
  STORY_ADVANCEMENT: 20,
  LYRICS: 20
};

const GRADE_THRESHOLDS = {
  PASSING: 70,
  A: 90,
  B: 80,
  C: 70,
  D: 60
};

// ============================================================================
// DATA ARRAYS (from original system)
// ============================================================================

const GENRES = ['Drama', 'Comedy', 'Romance', 'Mystery', 'Fantasy', 'Sci-Fi', 'Historical', 'Musical Comedy'];
const SETTINGS = ['Urban', 'Rural', 'Historical', 'Contemporary', 'Fantasy World', 'Dystopian', 'Small Town', 'Big City'];
const THEMES = ['Identity', 'Love', 'Justice', 'Family', 'Redemption', 'Coming of Age', 'Social Change', 'Cultural Heritage'];
const CONFLICTS = ['Internal Struggle', 'Society vs Individual', 'Tradition vs Change', 'Good vs Evil', 'Rich vs Poor', 'Old vs Young'];

const CULTURAL_PERSPECTIVES = [
  "Second-generation Korean-American family",
  "Puerto Rican community in the Bronx",
  "Irish-Catholic working-class neighborhood",
  "Mexican-American border town family",
  "Italian-American restaurant dynasty",
  "Jewish Orthodox family in transition",
  "African-American church community",
  "Polish immigrant family in Chicago",
  "Chinese-American Chinatown residents",
  "Lebanese-American family business",
  "Indian-American tech professionals",
  "Filipino-American healthcare workers",
  "Vietnamese-American nail salon owners",
  "Salvadoran immigrant construction workers",
  "Brazilian-American dance community"
];

const PERSONAL_STAKES = [
  "Saving family business from closure",
  "Protecting cultural traditions from disappearing",
  "Choosing between love and family duty",
  "Overcoming immigration trauma",
  "Healing broken family relationships",
  "Finding authentic identity",
  "Pursuing delayed dreams",
  "Standing up to neighborhood gentrification",
  "Preserving community gathering space",
  "Balancing tradition with modernity"
];

const CHARACTER_TRAITS = {
  positive: ['Brave', 'Kind', 'Intelligent', 'Funny', 'Loyal', 'Creative', 'Determined', 'Honest', 'Generous', 'Optimistic'],
  flaws: ['Stubborn', 'Naive', 'Arrogant', 'Impulsive', 'Jealous', 'Pessimistic', 'Controlling', 'Insecure', 'Reckless', 'Perfectionist'],
  secrets: ['Hidden talent', 'Past mistake', 'Secret love', 'Family shame', 'Lost opportunity', 'Hidden identity', 'Broken promise', 'Suppressed trauma'],
  goals: ['Fame', 'Love', 'Revenge', 'Redemption', 'Acceptance', 'Freedom', 'Knowledge', 'Power', 'Peace', 'Adventure']
};

const PLOT_TWISTS = [
  "Character is not who they claim to be",
  "The goal was wrong all along",
  "The enemy becomes an ally",
  "The solution creates new problems",
  "The past catches up unexpectedly",
  "Love interest has hidden agenda",
  "Mentor has been lying",
  "Success comes with unexpected cost",
  "The real villain is revealed",
  "Character discovers hidden talent"
];

const DIALOGUE_STARTERS = {
  conflict: [
    "I never told you this, but...",
    "You can't be serious about...",
    "I won't let you...",
    "How could you...",
    "I have to tell you something...",
    "You don't understand...",
    "This changes everything...",
    "I can't do this anymore...",
    "You're making a mistake...",
    "I know what you did..."
  ],
  emotional: [
    "I've been waiting my whole life for...",
    "I never thought I'd see you again...",
    "This is harder than I thought...",
    "I'm not the person you think I am...",
    "I've always wanted to tell you...",
    "I'm scared that...",
    "I dream about...",
    "I wish I could...",
    "I remember when...",
    "I hope someday..."
  ]
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const randomElement = (array) => array[Math.floor(Math.random() * array.length)];

/**
 * Returns random elements from an array using Fisher-Yates shuffle.
 * @param {Array} array - Source array
 * @param {number} count - Number of elements to return
 * @returns {Array} Array of random elements
 */
const randomElements = (array, count) => {
  const shuffled = [...array];
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

/**
 * Sanitizes a name for use in file paths and project names.
 * Removes path separators, parent directory references, and special characters.
 * @param {string} name - The name to sanitize
 * @returns {string} Sanitized name containing only lowercase letters, numbers, and underscores
 * @throws {Error} If name is invalid or contains only invalid characters
 */
const sanitizeName = (name) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Name must be a non-empty string');
  }
  // Remove path separators and parent directory references to prevent path traversal
  const cleaned = name.replace(/[\/\\]/g, '').replace(/\.\./g, '');
  const sanitized = cleaned.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  if (!sanitized) {
    throw new Error('Name contains only invalid characters');
  }
  return sanitized;
};

/**
 * Outputs data as JSON to stdout for LLM consumption.
 * @param {Object} data - The data to output
 */
const output = (data) => {
  console.log(JSON.stringify(data, null, 2));
};

/**
 * Gets the current agent state from file.
 * @returns {Promise<Object>} The current state or default state if file doesn't exist
 */
const getState = async () => {
  try {
    return await fs.readJson(STATE_FILE);
  } catch {
    return { activeProject: null, lastAction: null };
  }
};

/**
 * Saves the agent state to file.
 * @param {Object} state - The state to save
 */
const setState = async (state) => {
  await fs.writeJson(STATE_FILE, state, { spaces: 2 });
};

/**
 * Gets the full path for a project directory.
 * @param {string} projectName - The project name
 * @returns {string} The full path to the project directory
 */
const getProjectPath = (projectName) => {
  return path.join(PROJECTS_DIR, sanitizeName(projectName));
};

/**
 * Safely parses JSON with error handling.
 * @param {string} jsonString - The JSON string to parse
 * @param {string} errorContext - Context for error messages
 * @returns {Object} Parsed JSON object
 * @throws {Error} If JSON is invalid or missing
 */
const parseJSON = (jsonString, errorContext = 'JSON') => {
  try {
    if (!jsonString) {
      throw new Error(`${errorContext} is required but was not provided`);
    }
    return JSON.parse(jsonString);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid ${errorContext}: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Validates act and scene numbers are within acceptable ranges.
 * @param {string|number} act - The act number
 * @param {string|number} num - The scene number
 * @returns {{act: number, scene: number}} Validated act and scene numbers
 * @throws {Error} If act or scene numbers are out of range
 */
const validateActSceneNumbers = (act, num) => {
  const actNum = parseInt(act, 10);
  const sceneNum = parseInt(num, 10);
  
  if (isNaN(actNum) || actNum < VALIDATION_LIMITS.MIN_ACT || actNum > VALIDATION_LIMITS.MAX_ACT) {
    throw new Error(`Act number must be between ${VALIDATION_LIMITS.MIN_ACT} and ${VALIDATION_LIMITS.MAX_ACT}`);
  }
  if (isNaN(sceneNum) || sceneNum < VALIDATION_LIMITS.MIN_SCENE || sceneNum > VALIDATION_LIMITS.MAX_SCENE) {
    throw new Error(`Scene number must be between ${VALIDATION_LIMITS.MIN_SCENE} and ${VALIDATION_LIMITS.MAX_SCENE}`);
  }
  
  return { act: actNum, scene: sceneNum };
};

/**
 * Creates a new evaluation object with initial structure.
 * @param {string} itemType - The type of item being evaluated (e.g., 'character', 'scene', 'song')
 * @param {string} itemName - The name of the item being evaluated
 * @param {number} maxScore - Maximum possible score (default: 100)
 * @returns {Object} Initialized evaluation object
 */
const createEvaluation = (itemType, itemName, maxScore = 100) => {
  return {
    [itemType]: itemName,
    criteria: [],
    score: 0,
    maxScore,
    suggestions: [],
    passed: false,
    grade: 'F'
  };
};

/**
 * Adds a criterion to an evaluation and updates the score if passed.
 * @param {Object} evaluation - The evaluation object
 * @param {string} name - Name of the criterion
 * @param {boolean} passed - Whether the criterion passed
 * @param {number} score - Points to award if passed
 * @returns {boolean} Whether the criterion passed
 */
const addCriterion = (evaluation, name, passed, score) => {
  evaluation.criteria.push({ name, passed, score: passed ? score : 0 });
  if (passed) {
    evaluation.score += score;
  }
  return passed;
};

/**
 * Finalizes an evaluation by calculating the grade and passed status.
 * @param {Object} evaluation - The evaluation object to finalize
 * @returns {Object} The finalized evaluation with grade and passed status
 */
const finalizeEvaluation = (evaluation) => {
  evaluation.passed = evaluation.score >= GRADE_THRESHOLDS.PASSING;
  if (evaluation.score >= GRADE_THRESHOLDS.A) {
    evaluation.grade = 'A';
  } else if (evaluation.score >= GRADE_THRESHOLDS.B) {
    evaluation.grade = 'B';
  } else if (evaluation.score >= GRADE_THRESHOLDS.C) {
    evaluation.grade = 'C';
  } else if (evaluation.score >= GRADE_THRESHOLDS.D) {
    evaluation.grade = 'D';
  } else {
    evaluation.grade = 'F';
  }
  return evaluation;
};

// ============================================================================
// PROJECT MANAGEMENT COMMANDS
// ============================================================================

program
  .command('project:list')
  .description('List all projects with status')
  .action(async () => {
    try {
      const projects = await fs.readdir(PROJECTS_DIR);
      const projectList = [];

      for (const project of projects) {
        const projectPath = path.join(PROJECTS_DIR, project);
        const stat = await fs.stat(projectPath);

        if (stat.isDirectory() && !project.startsWith('.')) {
          const charactersDir = path.join(projectPath, 'characters');
          const scenesDir = path.join(projectPath, 'scenes');
          const songsDir = path.join(projectPath, 'songs');

          const charactersCount = await fs.pathExists(charactersDir)
            ? (await fs.readdir(charactersDir)).filter(f => f.endsWith('.md') || f.endsWith('.json')).length
            : 0;
          const scenesCount = await fs.pathExists(scenesDir)
            ? (await fs.readdir(scenesDir)).filter(f => f.endsWith('.md') || f.endsWith('.json')).length
            : 0;
          const songsCount = await fs.pathExists(songsDir)
            ? (await fs.readdir(songsDir)).filter(f => f.endsWith('.md') || f.endsWith('.json')).length
            : 0;

          const progress = Math.min(100, (scenesCount * 8 + songsCount * 10 + charactersCount * 5));

          projectList.push({
            name: project,
            status: scenesCount >= 10 ? 'complete' : scenesCount >= 5 ? 'in_progress' : 'planning',
            progress,
            characters: charactersCount,
            scenes: scenesCount,
            songs: songsCount,
            lastModified: stat.mtime.toISOString()
          });
        }
      }

      output({ success: true, projects: projectList });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('project:create <name>')
  .description('Create new project with full scaffolding')
  .action(async (name) => {
    try {
      const projectName = sanitizeName(name);
      const projectPath = path.join(PROJECTS_DIR, projectName);

      if (await fs.pathExists(projectPath)) {
        output({ success: false, error: 'Project already exists' });
        return;
      }

      // Create directory structure
      await fs.ensureDir(projectPath);
      await fs.ensureDir(path.join(projectPath, 'characters'));
      await fs.ensureDir(path.join(projectPath, 'scenes'));
      await fs.ensureDir(path.join(projectPath, 'songs'));
      await fs.ensureDir(path.join(projectPath, 'research'));

      // Create workflow state
      const workflowState = {
        phase: 1,
        phaseName: 'foundation',
        currentAct: null,
        completedTasks: [],
        pendingTasks: [
          { id: 'concept', type: 'concept', description: 'Generate and save concept' },
          { id: 'characters', type: 'characters', description: 'Create 3-5 core characters' },
          { id: 'structure', type: 'structure', description: 'Plan three-act structure' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await fs.writeJson(path.join(projectPath, 'workflow-state.json'), workflowState, { spaces: 2 });

      // Create README
      const readme = `# ${name}

## Project Overview
Created: ${new Date().toLocaleDateString()}
Status: Planning

## Development Phases

### Phase 1: Foundation Building
- [ ] Concept Generation
- [ ] Character Foundation (3-5 core characters)
- [ ] Structure Planning (Three-Act)

### Phase 2: Systematic Creation
- [ ] Act I Development (Scenes 1-4, Songs 1-4)
- [ ] Act II-A Development (Scenes 5-8, Songs 5-7)
- [ ] Act II-B Development (Scenes 9-12, Songs 8-10)
- [ ] Integration and Polish

### Phase 3: Breaking Protocol
- [ ] Cultural Specificity Injection
- [ ] Personal Trauma Integration
- [ ] Moral Complexity Development
- [ ] Character Contradiction Creation

### Phase 4: Transcendence Verification
- [ ] Success Metrics Checklist
- [ ] Professional Standards Verification

## Quick Links
- [Characters](./characters/)
- [Scenes](./scenes/)
- [Songs](./songs/)
- [Research](./research/)
`;

      await fs.writeFile(path.join(projectPath, 'README.md'), readme);

      // Set as active project
      await setState({ activeProject: projectName, lastAction: 'project:create' });

      output({
        success: true,
        project: projectName,
        path: projectPath,
        structure: ['characters/', 'scenes/', 'songs/', 'research/', 'README.md', 'workflow-state.json'],
        nextStep: 'Run concept:generate to create the story concept'
      });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('project:status <name>')
  .description('Get detailed project status')
  .action(async (name) => {
    try {
      const projectPath = getProjectPath(name);

      if (!await fs.pathExists(projectPath)) {
        output({ success: false, error: 'Project not found' });
        return;
      }

      // Get workflow state
      const workflowPath = path.join(projectPath, 'workflow-state.json');
      const workflow = await fs.pathExists(workflowPath)
        ? await fs.readJson(workflowPath)
        : { phase: 1, phaseName: 'foundation' };

      // Get concept
      const conceptPath = path.join(projectPath, 'concept.json');
      const concept = await fs.pathExists(conceptPath)
        ? await fs.readJson(conceptPath)
        : null;

      // Count content
      const charactersDir = path.join(projectPath, 'characters');
      const scenesDir = path.join(projectPath, 'scenes');
      const songsDir = path.join(projectPath, 'songs');

      const characters = await fs.pathExists(charactersDir)
        ? await fs.readdir(charactersDir)
        : [];
      const scenes = await fs.pathExists(scenesDir)
        ? await fs.readdir(scenesDir)
        : [];
      const songs = await fs.pathExists(songsDir)
        ? await fs.readdir(songsDir)
        : [];

      output({
        success: true,
        project: name,
        workflow,
        concept: concept ? { title: concept.title, logline: concept.logline } : null,
        content: {
          characters: characters.filter(f => f.endsWith('.json')).map(f => f.replace('.json', '')),
          scenes: scenes.filter(f => f.endsWith('.json')).map(f => f.replace('.json', '')),
          songs: songs.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''))
        },
        counts: {
          characters: characters.filter(f => f.endsWith('.json')).length,
          scenes: scenes.filter(f => f.endsWith('.json')).length,
          songs: songs.filter(f => f.endsWith('.json')).length
        }
      });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('project:set-active <name>')
  .description('Set active project context')
  .action(async (name) => {
    try {
      const projectPath = getProjectPath(name);

      if (!await fs.pathExists(projectPath)) {
        output({ success: false, error: 'Project not found' });
        return;
      }

      await setState({ activeProject: sanitizeName(name), lastAction: 'project:set-active' });
      output({ success: true, activeProject: sanitizeName(name) });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

// ============================================================================
// CONCEPT GENERATION COMMANDS
// ============================================================================

program
  .command('concept:generate')
  .description('Generate story concept')
  .option('-m, --mode <mode>', 'Generation mode: random, guided, custom', 'random')
  .option('--genre <genre>', 'Genre (for guided mode)')
  .option('--setting <setting>', 'Setting (for guided mode)')
  .option('--theme <theme>', 'Theme (for guided mode)')
  .option('--conflict <conflict>', 'Conflict (for guided mode)')
  .option('--cultural <cultural>', 'Cultural perspective (for guided mode)')
  .option('--stakes <stakes>', 'Personal stakes (for guided mode)')
  .action(async (options) => {
    try {
      let genre, setting, theme, conflict, cultural, stakes;

      if (options.mode === 'random') {
        genre = randomElement(GENRES);
        setting = randomElement(SETTINGS);
        theme = randomElement(THEMES);
        conflict = randomElement(CONFLICTS);
        cultural = randomElement(CULTURAL_PERSPECTIVES);
        stakes = randomElement(PERSONAL_STAKES);
      } else if (options.mode === 'guided') {
        genre = options.genre || randomElement(GENRES);
        setting = options.setting || randomElement(SETTINGS);
        theme = options.theme || randomElement(THEMES);
        conflict = options.conflict || randomElement(CONFLICTS);
        cultural = options.cultural || randomElement(CULTURAL_PERSPECTIVES);
        stakes = options.stakes || randomElement(PERSONAL_STAKES);
      } else {
        genre = randomElement(GENRES);
        setting = randomElement(SETTINGS);
        theme = randomElement(THEMES);
        conflict = randomElement(CONFLICTS);
        cultural = randomElement(CULTURAL_PERSPECTIVES);
        stakes = randomElement(PERSONAL_STAKES);
      }

      // Generate title options
      const titleTemplates = [
        `The ${theme} of Tomorrow`,
        `${theme}'s Journey`,
        `Beyond ${theme}`,
        `Dancing with ${theme}`,
        `The ${genre} of ${theme}`
      ];

      const concept = {
        title: randomElement(titleTemplates),
        titleOptions: titleTemplates,
        genre,
        setting,
        theme,
        conflict,
        culturalPerspective: cultural,
        personalStakes: stakes,
        logline: `A ${genre.toLowerCase()} set in a ${setting.toLowerCase()} world, exploring ${theme.toLowerCase()} through ${conflict.toLowerCase()}.`,
        extendedLogline: `When ${conflict.toLowerCase()} threatens a ${setting.toLowerCase()}, a ${cultural.toLowerCase()} must overcome ${stakes.toLowerCase()} to explore themes of ${theme.toLowerCase()}.`,
        targetAudience: 'General audiences, ages 13+',
        generatedAt: new Date().toISOString(),
        suggestedCharacterCount: '3-5 core characters',
        suggestedSceneCount: '10-12 scenes',
        suggestedSongCount: '8-10 songs'
      };

      output({ success: true, concept });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('concept:save <project>')
  .description('Save concept to project')
  .option('--json <json>', 'Concept JSON data')
  .action(async (project, options) => {
    try {
      const projectPath = getProjectPath(project);

      if (!await fs.pathExists(projectPath)) {
        output({ success: false, error: 'Project not found' });
        return;
      }

      const concept = parseJSON(options.json, 'Concept data');
      concept.savedAt = new Date().toISOString();

      await fs.writeJson(path.join(projectPath, 'concept.json'), concept, { spaces: 2 });

      // Update workflow state
      const workflowPath = path.join(projectPath, 'workflow-state.json');
      if (await fs.pathExists(workflowPath)) {
        const workflow = await fs.readJson(workflowPath);
        workflow.completedTasks.push('concept');
        workflow.pendingTasks = workflow.pendingTasks.filter(t => t.id !== 'concept');
        workflow.updatedAt = new Date().toISOString();
        await fs.writeJson(workflowPath, workflow, { spaces: 2 });
      }

      output({ success: true, message: 'Concept saved', project });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('concept:get <project>')
  .description('Get project concept')
  .action(async (project) => {
    try {
      const projectPath = getProjectPath(project);
      const conceptPath = path.join(projectPath, 'concept.json');

      if (!await fs.pathExists(conceptPath)) {
        output({ success: false, error: 'Concept not found' });
        return;
      }

      const concept = await fs.readJson(conceptPath);
      output({ success: true, concept });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

// ============================================================================
// CHARACTER COMMANDS
// ============================================================================

program
  .command('character:create <project> <name>')
  .description('Create a new character')
  .option('--json <json>', 'Character JSON data')
  .action(async (project, name, options) => {
    try {
      const projectPath = getProjectPath(project);
      const charactersDir = path.join(projectPath, 'characters');

      if (!await fs.pathExists(projectPath)) {
        output({ success: false, error: 'Project not found' });
        return;
      }

      await fs.ensureDir(charactersDir);

      const characterData = options.json ? parseJSON(options.json, 'Character data') : {};

      const character = {
        name,
        ...characterData,
        // Ensure required fields
        layers: characterData.layers || {
          surface: { occupation: '', publicPersona: '', reputation: '' },
          behavior: { actions: [], habits: [], underPressure: '' },
          psychology: { motivations: [], fears: [], contradictions: [] },
          soul: { coreValues: [], deepestDreams: [], wouldDieFor: '' }
        },
        arc: characterData.arc || {
          beginning: { patterns: '', worldview: '', blindSpots: [] },
          catalyst: { externalPressure: '', internalCrisis: '', challengingRelationship: '' },
          resistance: { oldPatterns: '', fearOfGrowth: '', externalObstacles: [] },
          breakthrough: { forcedChoice: '', crisis: '', authenticSelf: '' },
          integration: { newPatterns: '', expandedCapacity: '', changed: '' }
        },
        culturalBackground: characterData.culturalBackground || '',
        economicReality: characterData.economicReality || '',
        personalTrauma: characterData.personalTrauma || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const filename = sanitizeName(name) + '.json';
      await fs.writeJson(path.join(charactersDir, filename), character, { spaces: 2 });

      output({
        success: true,
        character: name,
        path: path.join(charactersDir, filename),
        message: 'Character created successfully'
      });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('character:list <project>')
  .description('List all characters in project')
  .action(async (project) => {
    try {
      const projectPath = getProjectPath(project);
      const charactersDir = path.join(projectPath, 'characters');

      if (!await fs.pathExists(charactersDir)) {
        output({ success: true, characters: [] });
        return;
      }

      const files = await fs.readdir(charactersDir);
      const characters = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const data = await fs.readJson(path.join(charactersDir, file));
          characters.push({
            name: data.name,
            role: data.role || 'undefined',
            culturalBackground: data.culturalBackground || 'undefined',
            hasArc: !!(data.arc && data.arc.beginning),
            hasLayers: !!(data.layers && data.layers.surface)
          });
        }
      }

      output({ success: true, characters });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('character:get <project> <name>')
  .description('Get character details')
  .action(async (project, name) => {
    try {
      const projectPath = getProjectPath(project);
      const characterPath = path.join(projectPath, 'characters', sanitizeName(name) + '.json');

      if (!await fs.pathExists(characterPath)) {
        output({ success: false, error: 'Character not found' });
        return;
      }

      const character = await fs.readJson(characterPath);
      output({ success: true, character });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('character:update <project> <name>')
  .description('Update character')
  .option('--json <json>', 'Updated character data (merged with existing)')
  .action(async (project, name, options) => {
    try {
      const projectPath = getProjectPath(project);
      const characterPath = path.join(projectPath, 'characters', sanitizeName(name) + '.json');

      if (!await fs.pathExists(characterPath)) {
        output({ success: false, error: 'Character not found' });
        return;
      }

      const existing = await fs.readJson(characterPath);
      const updates = parseJSON(options.json, 'Character update data');

      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await fs.writeJson(characterPath, updated, { spaces: 2 });
      output({ success: true, message: 'Character updated', character: name });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('character:evaluate <project> <name>')
  .description('Evaluate character against quality criteria')
  .action(async (project, name) => {
    try {
      const projectPath = getProjectPath(project);
      const characterPath = path.join(projectPath, 'characters', sanitizeName(name) + '.json');

      if (!await fs.pathExists(characterPath)) {
        output({ success: false, error: 'Character not found' });
        return;
      }

      const character = await fs.readJson(characterPath);
      const evaluation = createEvaluation('character', name);

      // Check cultural specificity
      if (!addCriterion(
        evaluation,
        'Cultural Specificity',
        character.culturalBackground && character.culturalBackground.length > VALIDATION_LIMITS.MIN_CULTURAL_LENGTH,
        EVALUATION_SCORES.CULTURAL_SPECIFICITY
      )) {
        evaluation.suggestions.push('Add specific cultural background (e.g., "Second-generation Korean-American" not just "Asian")');
      }

      // Check internal contradictions
      if (!addCriterion(
        evaluation,
        'Internal Contradictions',
        character.layers?.psychology?.contradictions?.length > 0,
        EVALUATION_SCORES.INTERNAL_CONTRADICTIONS
      )) {
        evaluation.suggestions.push('Add internal contradictions (public persona vs private reality)');
      }

      // Check personal trauma
      if (!addCriterion(
        evaluation,
        'Personal Trauma',
        character.personalTrauma && character.personalTrauma.length > VALIDATION_LIMITS.MIN_TEXT_LENGTH,
        EVALUATION_SCORES.PERSONAL_TRAUMA
      )) {
        evaluation.suggestions.push('Add personal trauma that reveals character (not just serves plot)');
      }

      // Check economic reality
      if (!addCriterion(
        evaluation,
        'Economic Reality',
        character.economicReality && character.economicReality.length > VALIDATION_LIMITS.MIN_TEXT_LENGTH,
        EVALUATION_SCORES.ECONOMIC_REALITY
      )) {
        evaluation.suggestions.push('Add economic pressures affecting decisions');
      }

      // Check character arc
      if (!addCriterion(
        evaluation,
        'Complete Character Arc',
        character.arc?.beginning && character.arc?.catalyst && character.arc?.breakthrough,
        EVALUATION_SCORES.CHARACTER_ARC
      )) {
        evaluation.suggestions.push('Complete the character arc (beginning, catalyst, resistance, breakthrough, integration)');
      }

      // Check four layers
      if (!addCriterion(
        evaluation,
        'Four Character Layers',
        character.layers?.surface && character.layers?.behavior && character.layers?.psychology && character.layers?.soul,
        EVALUATION_SCORES.FOUR_LAYERS
      )) {
        evaluation.suggestions.push('Define all four layers (surface, behavior, psychology, soul)');
      }

      output({ success: true, evaluation: finalizeEvaluation(evaluation) });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

// ============================================================================
// SCENE COMMANDS
// ============================================================================

program
  .command('scene:create <project> <act> <num>')
  .description('Create a new scene')
  .option('--json <json>', 'Scene JSON data')
  .action(async (project, act, num, options) => {
    try {
      const projectPath = getProjectPath(project);
      const scenesDir = path.join(projectPath, 'scenes');

      if (!await fs.pathExists(projectPath)) {
        output({ success: false, error: 'Project not found' });
        return;
      }

      // Validate act and scene numbers
      const validated = validateActSceneNumbers(act, num);

      await fs.ensureDir(scenesDir);

      const sceneData = options.json ? parseJSON(options.json, 'Scene data') : {};

      const scene = {
        act: validated.act,
        sceneNumber: validated.scene,
        ...sceneData,
        // Ensure required fields
        title: sceneData.title || `Act ${validated.act} Scene ${validated.scene}`,
        location: sceneData.location || '',
        time: sceneData.time || '',
        charactersPresent: sceneData.charactersPresent || [],
        objectives: sceneData.objectives || {},  // { characterName: objective }
        obstacles: sceneData.obstacles || [],
        conflict: sceneData.conflict || { type: '', description: '' },
        change: sceneData.change || '',  // What changes by end of scene
        themeConnection: sceneData.themeConnection || '',
        dialogue: sceneData.dialogue || [],
        stageDirections: sceneData.stageDirections || [],
        transitionTo: sceneData.transitionTo || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const filename = `act${validated.act}_scene${validated.scene}.json`;
      await fs.writeJson(path.join(scenesDir, filename), scene, { spaces: 2 });

      output({
        success: true,
        scene: `Act ${validated.act} Scene ${validated.scene}`,
        path: path.join(scenesDir, filename),
        message: 'Scene created successfully'
      });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('scene:list <project>')
  .description('List all scenes in project')
  .action(async (project) => {
    try {
      const projectPath = getProjectPath(project);
      const scenesDir = path.join(projectPath, 'scenes');

      if (!await fs.pathExists(scenesDir)) {
        output({ success: true, scenes: [] });
        return;
      }

      const files = await fs.readdir(scenesDir);
      const scenes = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const data = await fs.readJson(path.join(scenesDir, file));
          scenes.push({
            act: data.act,
            sceneNumber: data.sceneNumber,
            title: data.title,
            location: data.location,
            charactersPresent: data.charactersPresent,
            hasConflict: !!(data.conflict && data.conflict.description),
            hasChange: !!data.change
          });
        }
      }

      // Sort by act and scene number
      scenes.sort((a, b) => {
        if (a.act !== b.act) return a.act - b.act;
        return a.sceneNumber - b.sceneNumber;
      });

      output({ success: true, scenes });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('scene:get <project> <act> <num>')
  .description('Get scene details')
  .action(async (project, act, num) => {
    try {
      // Validate act and scene numbers
      const validated = validateActSceneNumbers(act, num);
      
      const projectPath = getProjectPath(project);
      const scenePath = path.join(projectPath, 'scenes', `act${validated.act}_scene${validated.scene}.json`);

      if (!await fs.pathExists(scenePath)) {
        output({ success: false, error: 'Scene not found' });
        return;
      }

      const scene = await fs.readJson(scenePath);
      output({ success: true, scene });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('scene:update <project> <act> <num>')
  .description('Update scene')
  .option('--json <json>', 'Updated scene data')
  .action(async (project, act, num, options) => {
    try {
      // Validate act and scene numbers
      const validated = validateActSceneNumbers(act, num);
      
      const projectPath = getProjectPath(project);
      const scenePath = path.join(projectPath, 'scenes', `act${validated.act}_scene${validated.scene}.json`);

      if (!await fs.pathExists(scenePath)) {
        output({ success: false, error: 'Scene not found' });
        return;
      }

      const existing = await fs.readJson(scenePath);
      const updates = parseJSON(options.json, 'Scene update data');

      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await fs.writeJson(scenePath, updated, { spaces: 2 });
      output({ success: true, message: 'Scene updated', scene: `Act ${validated.act} Scene ${validated.scene}` });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('scene:evaluate <project> <act> <num>')
  .description('Evaluate scene against quality criteria')
  .action(async (project, act, num) => {
    try {
      // Validate act and scene numbers
      const validated = validateActSceneNumbers(act, num);
      
      const projectPath = getProjectPath(project);
      const scenePath = path.join(projectPath, 'scenes', `act${validated.act}_scene${validated.scene}.json`);

      if (!await fs.pathExists(scenePath)) {
        output({ success: false, error: 'Scene not found' });
        return;
      }

      const scene = await fs.readJson(scenePath);
      const evaluation = createEvaluation('scene', `Act ${validated.act} Scene ${validated.scene}`);

      // Check clear objectives
      if (!addCriterion(
        evaluation,
        'Clear Character Objectives',
        scene.objectives && Object.keys(scene.objectives).length > 0,
        EVALUATION_SCORES.CLEAR_OBJECTIVES
      )) {
        evaluation.suggestions.push('Define clear objective for each character in scene');
      }

      // Check obstacles
      if (!addCriterion(
        evaluation,
        'Obstacles Present',
        scene.obstacles && scene.obstacles.length > 0,
        EVALUATION_SCORES.OBSTACLES
      )) {
        evaluation.suggestions.push('Add obstacles preventing easy achievement of objectives');
      }

      // Check conflict
      if (!addCriterion(
        evaluation,
        'Conflict (Internal/External)',
        scene.conflict && scene.conflict.description,
        EVALUATION_SCORES.CONFLICT
      )) {
        evaluation.suggestions.push('Add clear conflict (internal or external)');
      }

      // Check change
      if (!addCriterion(
        evaluation,
        'Change in Character/Situation',
        scene.change && scene.change.length > VALIDATION_LIMITS.MIN_TEXT_LENGTH,
        EVALUATION_SCORES.CHANGE
      )) {
        evaluation.suggestions.push('Define what changes by end of scene');
      }

      // Check theme connection
      if (!addCriterion(
        evaluation,
        'Theme Connection',
        scene.themeConnection && scene.themeConnection.length > VALIDATION_LIMITS.MIN_TEXT_LENGTH,
        EVALUATION_SCORES.THEME_CONNECTION
      )) {
        evaluation.suggestions.push('Connect scene to overall story theme');
      }

      output({ success: true, evaluation: finalizeEvaluation(evaluation) });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

// ============================================================================
// SONG COMMANDS
// ============================================================================

program
  .command('song:create <project> <name>')
  .description('Create a new song')
  .option('--json <json>', 'Song JSON data')
  .action(async (project, name, options) => {
    try {
      const projectPath = getProjectPath(project);
      const songsDir = path.join(projectPath, 'songs');

      if (!await fs.pathExists(projectPath)) {
        output({ success: false, error: 'Project not found' });
        return;
      }

      await fs.ensureDir(songsDir);

      const songData = options.json ? parseJSON(options.json, 'Song data') : {};

      const song = {
        name,
        ...songData,
        title: songData.title || name,
        function: songData.function || '',  // plot-advancing, character-revealing, relationship, world-building
        character: songData.character || '',  // Who sings this
        placement: songData.placement || { act: 0, afterScene: 0 },
        storyMoment: songData.storyMoment || '',
        emotionalJourney: songData.emotionalJourney || { start: '', middle: '', end: '' },
        musicalStyle: songData.musicalStyle || '',
        lyrics: songData.lyrics || {
          verse1: '',
          chorus: '',
          verse2: '',
          bridge: '',
          finalChorus: ''
        },
        dramaticPurpose: songData.dramaticPurpose || '',
        plotAdvancement: songData.plotAdvancement || '',
        characterRevelation: songData.characterRevelation || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const filename = sanitizeName(name) + '.json';
      await fs.writeJson(path.join(songsDir, filename), song, { spaces: 2 });

      output({
        success: true,
        song: name,
        path: path.join(songsDir, filename),
        message: 'Song created successfully'
      });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('song:list <project>')
  .description('List all songs in project')
  .action(async (project) => {
    try {
      const projectPath = getProjectPath(project);
      const songsDir = path.join(projectPath, 'songs');

      if (!await fs.pathExists(songsDir)) {
        output({ success: true, songs: [] });
        return;
      }

      const files = await fs.readdir(songsDir);
      const songs = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const data = await fs.readJson(path.join(songsDir, file));
          songs.push({
            name: data.name,
            title: data.title,
            function: data.function,
            character: data.character,
            placement: data.placement,
            hasLyrics: !!(data.lyrics && data.lyrics.verse1)
          });
        }
      }

      output({ success: true, songs });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('song:get <project> <name>')
  .description('Get song details')
  .action(async (project, name) => {
    try {
      const projectPath = getProjectPath(project);
      const songPath = path.join(projectPath, 'songs', sanitizeName(name) + '.json');

      if (!await fs.pathExists(songPath)) {
        output({ success: false, error: 'Song not found' });
        return;
      }

      const song = await fs.readJson(songPath);
      output({ success: true, song });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('song:update <project> <name>')
  .description('Update song')
  .option('--json <json>', 'Updated song data')
  .action(async (project, name, options) => {
    try {
      const projectPath = getProjectPath(project);
      const songPath = path.join(projectPath, 'songs', sanitizeName(name) + '.json');

      if (!await fs.pathExists(songPath)) {
        output({ success: false, error: 'Song not found' });
        return;
      }

      const existing = await fs.readJson(songPath);
      const updates = parseJSON(options.json, 'Song update data');

      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await fs.writeJson(songPath, updated, { spaces: 2 });
      output({ success: true, message: 'Song updated', song: name });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('song:evaluate <project> <name>')
  .description('Evaluate song against quality criteria')
  .action(async (project, name) => {
    try {
      const projectPath = getProjectPath(project);
      const songPath = path.join(projectPath, 'songs', sanitizeName(name) + '.json');

      if (!await fs.pathExists(songPath)) {
        output({ success: false, error: 'Song not found' });
        return;
      }

      const song = await fs.readJson(songPath);
      const evaluation = createEvaluation('song', name);

      // Check dramatic function
      if (!addCriterion(
        evaluation,
        'Specific Dramatic Function',
        song.function && song.function.length > 0,
        EVALUATION_SCORES.DRAMATIC_FUNCTION
      )) {
        evaluation.suggestions.push('Define dramatic function (plot-advancing, character-revealing, relationship, world-building)');
      }

      // Check character voice
      if (!addCriterion(
        evaluation,
        'Character Voice',
        song.character && song.character.length > 0,
        EVALUATION_SCORES.CHARACTER_VOICE
      )) {
        evaluation.suggestions.push('Specify which character sings this song');
      }

      // Check emotional journey
      if (!addCriterion(
        evaluation,
        'Clear Emotional Journey',
        song.emotionalJourney && song.emotionalJourney.start && song.emotionalJourney.end,
        EVALUATION_SCORES.EMOTIONAL_JOURNEY
      )) {
        evaluation.suggestions.push('Define emotional journey (start, middle, end)');
      }

      // Check plot/character advancement
      if (!addCriterion(
        evaluation,
        'Advances Plot or Reveals Character',
        (song.plotAdvancement && song.plotAdvancement.length > VALIDATION_LIMITS.MIN_TEXT_LENGTH) ||
        (song.characterRevelation && song.characterRevelation.length > VALIDATION_LIMITS.MIN_TEXT_LENGTH),
        EVALUATION_SCORES.STORY_ADVANCEMENT
      )) {
        evaluation.suggestions.push('Ensure song advances plot or reveals character significantly');
      }

      // Check lyrics exist
      if (!addCriterion(
        evaluation,
        'Lyrics Present',
        song.lyrics && (song.lyrics.verse1 || song.lyrics.chorus),
        EVALUATION_SCORES.LYRICS
      )) {
        evaluation.suggestions.push('Write lyrics (verse1, chorus, verse2, bridge, finalChorus)');
      }

      output({ success: true, evaluation: finalizeEvaluation(evaluation) });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

// ============================================================================
// DECISION ENGINE COMMANDS
// ============================================================================

program
  .command('decide:story-direction')
  .description('Get guidance on story direction')
  .option('--context <json>', 'Context JSON with current situation')
  .action(async (options) => {
    try {
      const context = options.context ? parseJSON(options.context, 'Context data') : {};

      const guidance = {
        decisionFramework: [
          'What raises the stakes highest?',
          'What creates the most character conflict?',
          'What serves the central theme best?',
          'What provides the most dramatic potential?',
          'What feels most surprising yet inevitable?'
        ],
        defaultChoice: 'Always choose the option that creates the most emotional impact for the audience',
        suggestions: [
          context.stuck ? 'Introduce new information/revelation' : null,
          context.stuck ? 'Add external pressure/deadline' : null,
          context.stuck ? 'Create unexpected alliance or betrayal' : null,
          context.stuck ? 'Raise the stakes significantly' : null,
          context.stuck ? 'Force characters to make difficult choices' : null
        ].filter(Boolean),
        plotTwistOptions: randomElements(PLOT_TWISTS, 3)
      };

      output({ success: true, guidance });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('decide:character-behavior')
  .description('Get guidance on character behavior')
  .option('--context <json>', 'Context JSON with character and situation')
  .action(async (options) => {
    try {
      const context = options.context ? parseJSON(options.context, 'Context data') : {};

      const guidance = {
        decisionFramework: [
          'What would THIS specific character do (based on their established traits)?',
          'What choice creates the most internal conflict?',
          'What serves their character arc progression?',
          'What creates the most interesting dynamics with other characters?',
          'What feels most human and relatable?'
        ],
        defaultChoice: 'Characters should act consistently with their established personality while being pushed to grow',
        exercises: [
          "Write character's diary entry for this moment",
          'Imagine them in a completely different situation',
          'Give them the opposite trait temporarily',
          'Explore their biggest fear',
          'Reveal their secret shame'
        ]
      };

      output({ success: true, guidance });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('decide:musical-moment')
  .description('Decide if a moment should be a song')
  .option('--context <json>', 'Context JSON with scene/moment details')
  .action(async (options) => {
    try {
      const context = options.context ? parseJSON(options.context, 'Context data') : {};

      const guidance = {
        decisionFramework: [
          'Is the emotion too big for words alone?',
          'Does this advance plot or reveal character significantly?',
          'Would music enhance the theatrical impact?',
          'Is this a natural emotional peak?',
          'Does the pacing need a musical moment here?'
        ],
        defaultChoice: 'Use songs for emotional peaks, character revelations, and plot advancement',
        songFunctions: [
          { type: 'plot-advancing', description: 'Move story forward significantly, reveal crucial information' },
          { type: 'character-revealing', description: 'Show internal thoughts/feelings, explore motivations' },
          { type: 'relationship', description: 'Explore dynamics between characters, show connection/conflict' },
          { type: 'world-building', description: 'Establish setting and atmosphere, show community values' }
        ],
        musicalStyleSuggestions: randomElements([
          'Jazzy number about deception',
          'Folk ballad about homecoming',
          'Rock anthem about rebellion',
          'Waltz about lost love',
          'Gospel-inspired song about hope',
          'Tango about passion',
          'Hip-hop number about ambition',
          'Blues song about heartbreak'
        ], 3)
      };

      output({ success: true, guidance });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('decide:resolve-block')
  .description('Get creative block resolution strategies')
  .option('--type <type>', 'Block type: story, character, dialogue, pacing')
  .option('--context <json>', 'Context JSON')
  .action(async (options) => {
    try {
      const blockType = options.type || 'story';

      const strategies = {
        story: {
          problem: 'Story isn\'t moving forward',
          solutions: [
            'Introduce new information/revelation',
            'Add external pressure/deadline',
            'Create unexpected alliance or betrayal',
            'Raise the stakes significantly',
            'Force characters to make difficult choices'
          ],
          randomGenerators: [
            'Roll dice for character choices',
            'Use opposite of first instinct',
            'Combine two unrelated ideas',
            'Ask "What would make this worse?"',
            'Consider what audience expects, then subvert'
          ]
        },
        character: {
          problem: 'Character lacks clear motivation',
          solutions: [
            'Give them something to lose',
            'Create a deadline/time pressure',
            'Add a personal connection to the stakes',
            'Reveal a secret that changes everything',
            'Introduce a rival or obstacle'
          ],
          exercises: [
            "Write character's diary entry",
            'Imagine them in different situation',
            'Give them opposite trait temporarily',
            'Explore their biggest fear',
            'Reveal their secret shame'
          ]
        },
        dialogue: {
          problem: 'Conversations lack energy',
          solutions: [
            'Add subtext (characters want different things)',
            'Create interruptions or urgency',
            'Use conflict instead of agreement',
            'Add physical actions during dialogue',
            'Give characters opposing goals in the scene'
          ],
          starters: {
            conflict: randomElements(DIALOGUE_STARTERS.conflict, 3),
            emotional: randomElements(DIALOGUE_STARTERS.emotional, 3)
          }
        },
        pacing: {
          problem: 'Story drags or rushes',
          solutions: [
            'Identify where energy drops/spikes',
            'Add/remove obstacles as needed',
            'Adjust scene lengths appropriately',
            'Balance action with reflection',
            'Ensure proper build to climaxes'
          ]
        }
      };

      output({
        success: true,
        blockType,
        strategy: strategies[blockType] || strategies.story
      });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

// ============================================================================
// VALIDATION COMMANDS
// ============================================================================

program
  .command('validate:project <project>')
  .description('Run full project validation')
  .action(async (project) => {
    try {
      const projectPath = getProjectPath(project);

      if (!await fs.pathExists(projectPath)) {
        output({ success: false, error: 'Project not found' });
        return;
      }

      const validation = {
        project,
        timestamp: new Date().toISOString(),
        categories: [],
        overallScore: 0,
        passed: false,
        recommendations: []
      };

      // Structure check
      const structureScore = await (async () => {
        let score = 0;
        if (await fs.pathExists(path.join(projectPath, 'characters'))) score += 25;
        if (await fs.pathExists(path.join(projectPath, 'scenes'))) score += 25;
        if (await fs.pathExists(path.join(projectPath, 'songs'))) score += 25;
        if (await fs.pathExists(path.join(projectPath, 'concept.json'))) score += 25;
        return score;
      })();

      validation.categories.push({
        name: 'Project Structure',
        score: structureScore,
        maxScore: 100,
        passed: structureScore >= 75
      });

      // Content count
      const charactersDir = path.join(projectPath, 'characters');
      const scenesDir = path.join(projectPath, 'scenes');
      const songsDir = path.join(projectPath, 'songs');

      const charactersCount = await fs.pathExists(charactersDir)
        ? (await fs.readdir(charactersDir)).filter(f => f.endsWith('.json')).length
        : 0;
      const scenesCount = await fs.pathExists(scenesDir)
        ? (await fs.readdir(scenesDir)).filter(f => f.endsWith('.json')).length
        : 0;
      const songsCount = await fs.pathExists(songsDir)
        ? (await fs.readdir(songsDir)).filter(f => f.endsWith('.json')).length
        : 0;

      const contentScore = Math.min(100, charactersCount * 15 + scenesCount * 6 + songsCount * 10);

      validation.categories.push({
        name: 'Content Development',
        score: contentScore,
        maxScore: 100,
        passed: contentScore >= 70,
        details: {
          characters: { count: charactersCount, target: 5, met: charactersCount >= 3 },
          scenes: { count: scenesCount, target: 10, met: scenesCount >= 8 },
          songs: { count: songsCount, target: 8, met: songsCount >= 6 }
        }
      });

      if (charactersCount < 3) validation.recommendations.push('Create at least 3 core characters');
      if (scenesCount < 8) validation.recommendations.push('Write at least 8 scenes');
      if (songsCount < 6) validation.recommendations.push('Compose at least 6 songs');

      // Evaluate individual content quality
      let qualityScore = 0;
      let qualityChecks = 0;

      // Sample character evaluation
      if (await fs.pathExists(charactersDir)) {
        const charFiles = (await fs.readdir(charactersDir)).filter(f => f.endsWith('.json'));
        for (const file of charFiles.slice(0, 3)) {
          const char = await fs.readJson(path.join(charactersDir, file));
          qualityChecks++;
          if (char.culturalBackground) qualityScore += 10;
          if (char.layers?.psychology?.contradictions?.length > 0) qualityScore += 10;
          if (char.arc?.breakthrough) qualityScore += 10;
        }
      }

      // Sample scene evaluation
      if (await fs.pathExists(scenesDir)) {
        const sceneFiles = (await fs.readdir(scenesDir)).filter(f => f.endsWith('.json'));
        for (const file of sceneFiles.slice(0, 3)) {
          const scene = await fs.readJson(path.join(scenesDir, file));
          qualityChecks++;
          if (scene.conflict?.description) qualityScore += 10;
          if (scene.change) qualityScore += 10;
          if (scene.themeConnection) qualityScore += 10;
        }
      }

      const avgQuality = qualityChecks > 0 ? Math.round(qualityScore / qualityChecks) : 0;

      validation.categories.push({
        name: 'Content Quality',
        score: avgQuality,
        maxScore: 30,
        passed: avgQuality >= 20
      });

      if (avgQuality < 20) validation.recommendations.push('Improve content quality - add cultural specificity, conflicts, and character arcs');

      // Calculate overall
      validation.overallScore = Math.round(
        (structureScore + contentScore + (avgQuality * 3.33)) / 3
      );
      validation.passed = validation.overallScore >= 70;
      validation.grade = validation.overallScore >= 90 ? 'A' :
                        validation.overallScore >= 80 ? 'B' :
                        validation.overallScore >= 70 ? 'C' :
                        validation.overallScore >= 60 ? 'D' : 'F';

      output({ success: true, validation });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('validate:transcendence <project>')
  .description('Check transcendence criteria')
  .action(async (project) => {
    try {
      const projectPath = getProjectPath(project);

      if (!await fs.pathExists(projectPath)) {
        output({ success: false, error: 'Project not found' });
        return;
      }

      const transcendence = {
        project,
        criteria: [
          {
            name: 'Real People',
            description: 'Characters feel like people you could meet',
            checkMethod: 'Review character layers and contradictions',
            status: 'manual_review_required'
          },
          {
            name: 'Lived-In Culture',
            description: 'Details feel authentic, not researched',
            checkMethod: 'Verify cultural specificity over generic representations',
            status: 'manual_review_required'
          },
          {
            name: 'Moral Complexity',
            description: 'No clear villains, competing human needs',
            checkMethod: 'Check antagonist motivations are understandable',
            status: 'manual_review_required'
          },
          {
            name: 'Emotional Resonance',
            description: 'Complex, sometimes contradictory feelings',
            checkMethod: 'Review emotional journeys in songs and scenes',
            status: 'manual_review_required'
          },
          {
            name: 'Hidden Scaffolding',
            description: 'Systematic construction invisible behind authenticity',
            checkMethod: 'Structure should not feel formulaic',
            status: 'manual_review_required'
          },
          {
            name: 'Universal Access',
            description: 'Specific experiences reveal universal themes',
            checkMethod: 'Cultural specificity should illuminate, not alienate',
            status: 'manual_review_required'
          }
        ],
        breakingProtocolChecklist: [
          { task: 'Replace all generic cultural references with specific ones', status: 'pending' },
          { task: 'Add personal trauma that doesn\'t serve plot', status: 'pending' },
          { task: 'Give antagonists understandable motivations', status: 'pending' },
          { task: 'Make protagonists make questionable choices', status: 'pending' },
          { task: 'Add contradictions to each major character', status: 'pending' }
        ]
      };

      output({ success: true, transcendence });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

// ============================================================================
// WORKFLOW COMMANDS
// ============================================================================

program
  .command('workflow:status <project>')
  .description('Get current workflow state')
  .action(async (project) => {
    try {
      const projectPath = getProjectPath(project);
      const workflowPath = path.join(projectPath, 'workflow-state.json');

      if (!await fs.pathExists(workflowPath)) {
        output({ success: false, error: 'Workflow state not found' });
        return;
      }

      const workflow = await fs.readJson(workflowPath);
      output({ success: true, workflow });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('workflow:next-task <project>')
  .description('Get next recommended task')
  .action(async (project) => {
    try {
      const projectPath = getProjectPath(project);
      const workflowPath = path.join(projectPath, 'workflow-state.json');

      let workflow;
      if (await fs.pathExists(workflowPath)) {
        workflow = await fs.readJson(workflowPath);
      } else {
        workflow = { phase: 1, phaseName: 'foundation', completedTasks: [], pendingTasks: [] };
      }

      // Determine next task based on current state
      const projectStatus = await (async () => {
        const charactersDir = path.join(projectPath, 'characters');
        const scenesDir = path.join(projectPath, 'scenes');
        const songsDir = path.join(projectPath, 'songs');
        const conceptPath = path.join(projectPath, 'concept.json');

        return {
          hasConcept: await fs.pathExists(conceptPath),
          charactersCount: await fs.pathExists(charactersDir)
            ? (await fs.readdir(charactersDir)).filter(f => f.endsWith('.json')).length
            : 0,
          scenesCount: await fs.pathExists(scenesDir)
            ? (await fs.readdir(scenesDir)).filter(f => f.endsWith('.json')).length
            : 0,
          songsCount: await fs.pathExists(songsDir)
            ? (await fs.readdir(songsDir)).filter(f => f.endsWith('.json')).length
            : 0
        };
      })();

      let nextTask;

      // Phase 1: Foundation
      if (!projectStatus.hasConcept) {
        nextTask = {
          phase: 1,
          phaseName: 'foundation',
          task: 'generate_concept',
          description: 'Generate and save story concept',
          command: `concept:generate && concept:save ${project} --json <concept>`,
          priority: 'critical'
        };
      } else if (projectStatus.charactersCount < 3) {
        nextTask = {
          phase: 1,
          phaseName: 'foundation',
          task: 'create_characters',
          description: `Create core characters (${projectStatus.charactersCount}/3 minimum)`,
          command: `character:create ${project} <name> --json <data>`,
          priority: 'high'
        };
      }
      // Phase 2: Systematic Creation - Act I
      else if (projectStatus.scenesCount < 4) {
        nextTask = {
          phase: 2,
          phaseName: 'systematic_creation',
          task: 'create_act1_scenes',
          description: `Create Act I scenes (${projectStatus.scenesCount}/4)`,
          command: `scene:create ${project} 1 ${projectStatus.scenesCount + 1} --json <data>`,
          priority: 'high'
        };
      } else if (projectStatus.songsCount < 4) {
        nextTask = {
          phase: 2,
          phaseName: 'systematic_creation',
          task: 'create_act1_songs',
          description: `Create Act I songs (${projectStatus.songsCount}/4)`,
          command: `song:create ${project} <name> --json <data>`,
          priority: 'high'
        };
      }
      // Phase 2: Act II-A
      else if (projectStatus.scenesCount < 8) {
        nextTask = {
          phase: 2,
          phaseName: 'systematic_creation',
          task: 'create_act2a_scenes',
          description: `Create Act II-A scenes (${projectStatus.scenesCount}/8)`,
          command: `scene:create ${project} 2 ${projectStatus.scenesCount - 3} --json <data>`,
          priority: 'high'
        };
      } else if (projectStatus.songsCount < 7) {
        nextTask = {
          phase: 2,
          phaseName: 'systematic_creation',
          task: 'create_act2a_songs',
          description: `Create Act II-A songs (${projectStatus.songsCount}/7)`,
          command: `song:create ${project} <name> --json <data>`,
          priority: 'medium'
        };
      }
      // Phase 2: Act II-B
      else if (projectStatus.scenesCount < 12) {
        nextTask = {
          phase: 2,
          phaseName: 'systematic_creation',
          task: 'create_act2b_scenes',
          description: `Create Act II-B scenes (${projectStatus.scenesCount}/12)`,
          command: `scene:create ${project} 2 ${projectStatus.scenesCount - 3} --json <data>`,
          priority: 'medium'
        };
      } else if (projectStatus.songsCount < 10) {
        nextTask = {
          phase: 2,
          phaseName: 'systematic_creation',
          task: 'create_act2b_songs',
          description: `Create Act II-B songs (${projectStatus.songsCount}/10)`,
          command: `song:create ${project} <name> --json <data>`,
          priority: 'medium'
        };
      }
      // Phase 3: Breaking Protocol
      else {
        nextTask = {
          phase: 3,
          phaseName: 'breaking_protocol',
          task: 'transcendence',
          description: 'Run breaking protocol - inject cultural specificity and human messiness',
          command: `validate:transcendence ${project}`,
          priority: 'high',
          subtasks: [
            'Review and enhance cultural specificity in all characters',
            'Add personal trauma that doesn\'t serve plot',
            'Ensure no clear villains - give antagonists understandable motivations',
            'Add contradictions to make characters unpredictably human'
          ]
        };
      }

      output({ success: true, nextTask, projectStatus });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('workflow:complete-task <project> <taskId>')
  .description('Mark task as complete')
  .action(async (project, taskId) => {
    try {
      const projectPath = getProjectPath(project);
      const workflowPath = path.join(projectPath, 'workflow-state.json');

      let workflow;
      if (await fs.pathExists(workflowPath)) {
        workflow = await fs.readJson(workflowPath);
      } else {
        workflow = { phase: 1, phaseName: 'foundation', completedTasks: [], pendingTasks: [] };
      }

      workflow.completedTasks.push({
        id: taskId,
        completedAt: new Date().toISOString()
      });

      workflow.pendingTasks = workflow.pendingTasks.filter(t => t.id !== taskId);
      workflow.updatedAt = new Date().toISOString();

      await fs.writeJson(workflowPath, workflow, { spaces: 2 });

      output({ success: true, message: `Task ${taskId} marked complete`, workflow });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

// ============================================================================
// GENERATOR COMMANDS
// ============================================================================

program
  .command('generate:title')
  .description('Generate title options')
  .option('--genre <genre>', 'Genre')
  .option('--theme <theme>', 'Theme')
  .action(async (options) => {
    try {
      const genre = options.genre || randomElement(GENRES);
      const theme = options.theme || randomElement(THEMES);

      const titles = [
        `The ${theme} of Tomorrow`,
        `${theme}'s Journey`,
        `Beyond ${theme}`,
        `Dancing with ${theme}`,
        `The ${genre} of ${theme}`,
        `When ${theme} Calls`,
        `${theme} in ${randomElement(SETTINGS)}`,
        `The Last ${theme}`,
        `${theme} Rising`,
        `Shadows of ${theme}`
      ];

      output({ success: true, genre, theme, titles });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('generate:character-traits')
  .description('Get character trait suggestions')
  .action(async () => {
    try {
      output({
        success: true,
        suggestions: {
          positive: randomElements(CHARACTER_TRAITS.positive, 3),
          flaws: randomElements(CHARACTER_TRAITS.flaws, 3),
          secrets: randomElements(CHARACTER_TRAITS.secrets, 2),
          goals: randomElements(CHARACTER_TRAITS.goals, 2)
        },
        allTraits: CHARACTER_TRAITS
      });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('generate:plot-twist')
  .description('Get plot twist suggestions')
  .action(async () => {
    try {
      output({
        success: true,
        suggestions: randomElements(PLOT_TWISTS, 3),
        allTwists: PLOT_TWISTS
      });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

program
  .command('generate:dialogue-starter')
  .description('Get dialogue starter suggestions')
  .option('--type <type>', 'Type: conflict, emotional', 'conflict')
  .action(async (options) => {
    try {
      const type = options.type || 'conflict';

      output({
        success: true,
        type,
        suggestions: randomElements(DIALOGUE_STARTERS[type] || DIALOGUE_STARTERS.conflict, 5),
        allStarters: DIALOGUE_STARTERS
      });
    } catch (error) {
      output({ success: false, error: error.message });
    }
  });

// ============================================================================
// HELP COMMAND
// ============================================================================

program
  .command('api-reference')
  .description('Show full API reference')
  .action(() => {
    const reference = `
PLAYWRIGHT AGENT HARNESS - API REFERENCE
=========================================

This CLI provides a complete API for an agentic LLM to drive musical creation.

PROJECT MANAGEMENT:
  project:list                        List all projects with status
  project:create <name>               Create new project with scaffolding
  project:status <name>               Get detailed project status
  project:set-active <name>           Set active project context

CONCEPT GENERATION:
  concept:generate [options]          Generate story concept
    --mode <mode>                     random|guided|custom (default: random)
    --genre <genre>                   Genre for guided mode
    --setting <setting>               Setting for guided mode
    --theme <theme>                   Theme for guided mode
    --conflict <conflict>             Conflict for guided mode
  concept:save <project> --json       Save concept to project
  concept:get <project>               Get project's concept

CHARACTER COMMANDS:
  character:create <project> <name> --json   Create character
  character:list <project>                    List characters
  character:get <project> <name>              Get character details
  character:update <project> <name> --json   Update character
  character:evaluate <project> <name>         Evaluate character quality

SCENE COMMANDS:
  scene:create <project> <act> <num> --json  Create scene
  scene:list <project>                        List scenes
  scene:get <project> <act> <num>             Get scene details
  scene:update <project> <act> <num> --json  Update scene
  scene:evaluate <project> <act> <num>        Evaluate scene quality

SONG COMMANDS:
  song:create <project> <name> --json        Create song
  song:list <project>                         List songs
  song:get <project> <name>                   Get song details
  song:update <project> <name> --json        Update song
  song:evaluate <project> <name>              Evaluate song quality

DECISION ENGINE:
  decide:story-direction --context           Get story direction guidance
  decide:character-behavior --context        Get character behavior guidance
  decide:musical-moment --context            Decide if moment needs song
  decide:resolve-block --type --context      Get creative block resolution

VALIDATION:
  validate:project <project>                 Full project validation
  validate:transcendence <project>           Check transcendence criteria

WORKFLOW:
  workflow:status <project>                  Get current workflow state
  workflow:next-task <project>               Get next recommended task
  workflow:complete-task <project> <task>    Mark task complete

GENERATORS:
  generate:title --genre --theme             Generate title options
  generate:character-traits                  Get trait suggestions
  generate:plot-twist                        Get plot twist suggestions
  generate:dialogue-starter --type           Get dialogue starters

All commands output JSON to stdout for easy parsing by an LLM agent.
`;
    output({ success: true, reference });
  });

// Parse arguments
program.parse(process.argv);

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
