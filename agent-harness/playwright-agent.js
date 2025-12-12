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

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

/** @constant {string} PROJECTS_DIR - Directory path for storing project files */
const PROJECTS_DIR = path.join(__dirname, '../projects');

/** @constant {string} TEMPLATES_DIR - Directory path for template files */
const TEMPLATES_DIR = path.join(__dirname, '../templates');

/** @constant {string} STATE_FILE - Path to the agent state file */
const STATE_FILE = path.join(__dirname, '.agent-state.json');

// ============================================================================
// EVALUATION SCORE CONSTANTS
// ============================================================================

/** @constant {Object} SCORES - Evaluation scoring thresholds and values */
const SCORES = {
  // Individual criteria scores
  CULTURAL_SPECIFICITY: 15,
  INTERNAL_CONTRADICTIONS: 15,
  PERSONAL_TRAUMA: 15,
  ECONOMIC_REALITY: 15,
  COMPLETE_ARC: 20,
  FOUR_LAYERS: 20,
  CLEAR_OBJECTIVES: 20,
  OBSTACLES_PRESENT: 20,
  CONFLICT_PRESENT: 20,
  SCENE_CHANGE: 20,
  THEME_CONNECTION: 20,
  DRAMATIC_FUNCTION: 20,
  CHARACTER_VOICE: 20,
  EMOTIONAL_JOURNEY: 20,
  ADVANCES_STORY: 20,
  LYRICS_PRESENT: 20,

  // Thresholds
  PASSING_SCORE: 70,
  GRADE_A_THRESHOLD: 90,
  GRADE_B_THRESHOLD: 80,
  GRADE_C_THRESHOLD: 70,
  GRADE_D_THRESHOLD: 60,

  // Minimum lengths for validation
  MIN_CULTURAL_BACKGROUND_LENGTH: 20,
  MIN_FIELD_LENGTH: 10,

  // Project progress weights
  SCENE_WEIGHT: 8,
  SONG_WEIGHT: 10,
  CHARACTER_WEIGHT: 5,

  // Content targets
  MIN_CHARACTERS: 3,
  TARGET_CHARACTERS: 5,
  MIN_SCENES: 8,
  TARGET_SCENES: 10,
  MIN_SONGS: 6,
  TARGET_SONGS: 8,

  // Act structure
  ACT1_SCENES: 4,
  ACT2A_SCENES: 8,
  ACT2B_SCENES: 12,
  ACT1_SONGS: 4,
  ACT2A_SONGS: 7,
  ACT2B_SONGS: 10
};

/** @constant {Object} ERROR_MESSAGES - Standardized error messages */
const ERROR_MESSAGES = {
  PROJECT_NOT_FOUND: 'Project not found',
  PROJECT_EXISTS: 'Project already exists',
  CHARACTER_NOT_FOUND: 'Character not found',
  SCENE_NOT_FOUND: 'Scene not found',
  SONG_NOT_FOUND: 'Song not found',
  CONCEPT_NOT_FOUND: 'Concept not found',
  WORKFLOW_NOT_FOUND: 'Workflow state not found',
  INVALID_JSON: 'Invalid JSON data provided',
  MISSING_JSON_OPTION: 'The --json option is required for this command',
  INVALID_ACT_NUMBER: 'Act number must be a positive integer (1-3)',
  INVALID_SCENE_NUMBER: 'Scene number must be a positive integer',
  INVALID_PROJECT_NAME: 'Project name must contain only alphanumeric characters, spaces, and underscores',
  PATH_TRAVERSAL_DETECTED: 'Invalid name: path traversal detected'
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

/**
 * Selects a random element from an array
 * @param {Array} array - The array to select from
 * @returns {*} A randomly selected element
 */
const randomElement = (array) => array[Math.floor(Math.random() * array.length)];

/**
 * Selects multiple random elements from an array without repetition
 * @param {Array} array - The array to select from
 * @param {number} count - Number of elements to select
 * @returns {Array} Array of randomly selected elements
 */
const randomElements = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Sanitizes a name for use as a filename, preventing path traversal attacks
 * @param {string} name - The name to sanitize
 * @returns {string} Sanitized name safe for filesystem use
 * @throws {Error} If path traversal is detected
 */
const sanitizeName = (name) => {
  if (!name || typeof name !== 'string') {
    throw new Error(ERROR_MESSAGES.INVALID_PROJECT_NAME);
  }

  // First, decode any URL-encoded characters to catch obfuscated attacks
  let decoded = name;
  try {
    decoded = decodeURIComponent(name);
  } catch {
    // If decoding fails, use original string
    decoded = name;
  }

  // Check for path traversal patterns before sanitization
  const pathTraversalPatterns = [
    /\.\./,           // Parent directory reference
    /^\//,            // Absolute path
    /^[a-zA-Z]:\\/,   // Windows absolute path
    /\0/,             // Null byte injection
    /[/\\]/           // Forward or backslashes
  ];

  for (const pattern of pathTraversalPatterns) {
    if (pattern.test(decoded)) {
      throw new Error(ERROR_MESSAGES.PATH_TRAVERSAL_DETECTED);
    }
  }

  // Sanitize the name: lowercase, replace spaces with underscores, keep only safe chars
  const sanitized = decoded
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

  // Ensure the result is not empty
  if (!sanitized) {
    throw new Error(ERROR_MESSAGES.INVALID_PROJECT_NAME);
  }

  return sanitized;
};

/**
 * Safely parses JSON with error handling
 * @param {string} jsonString - The JSON string to parse
 * @param {string} [errorContext='JSON data'] - Context for error messages
 * @returns {{success: boolean, data?: any, error?: string}} Parse result
 */
const safeJsonParse = (jsonString, errorContext = 'JSON data') => {
  if (!jsonString || typeof jsonString !== 'string') {
    return {
      success: false,
      error: `${ERROR_MESSAGES.MISSING_JSON_OPTION}: ${errorContext}`
    };
  }

  try {
    const data = JSON.parse(jsonString);
    return { success: true, data };
  } catch (parseError) {
    return {
      success: false,
      error: `${ERROR_MESSAGES.INVALID_JSON} for ${errorContext}: ${parseError.message}`
    };
  }
};

/**
 * Validates that a required --json option is provided
 * @param {Object} options - Command options object
 * @param {string} optionName - Name of the option to validate
 * @returns {{valid: boolean, error?: string}} Validation result
 */
const validateRequiredJsonOption = (options, optionName = 'json') => {
  if (!options[optionName]) {
    return {
      valid: false,
      error: ERROR_MESSAGES.MISSING_JSON_OPTION
    };
  }
  return { valid: true };
};

/**
 * Validates act and scene numbers for scene commands
 * @param {string|number} act - The act number
 * @param {string|number} num - The scene number
 * @returns {{valid: boolean, act?: number, num?: number, error?: string}} Validation result
 */
const validateActSceneNumbers = (act, num) => {
  const actNum = parseInt(act, 10);
  const sceneNum = parseInt(num, 10);

  if (isNaN(actNum) || actNum < 1 || actNum > 3) {
    return {
      valid: false,
      error: ERROR_MESSAGES.INVALID_ACT_NUMBER
    };
  }

  if (isNaN(sceneNum) || sceneNum < 1) {
    return {
      valid: false,
      error: ERROR_MESSAGES.INVALID_SCENE_NUMBER
    };
  }

  return { valid: true, act: actNum, num: sceneNum };
};

/**
 * Validates a project name
 * @param {string} name - The project name to validate
 * @returns {{valid: boolean, error?: string}} Validation result
 */
const validateProjectName = (name) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: ERROR_MESSAGES.INVALID_PROJECT_NAME };
  }

  // Allow alphanumeric, spaces, underscores, and hyphens
  const validNamePattern = /^[a-zA-Z0-9\s_-]+$/;
  if (!validNamePattern.test(name)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_PROJECT_NAME };
  }

  return { valid: true };
};

/**
 * Outputs data as formatted JSON to stdout
 * @param {Object} data - The data to output
 */
const output = (data) => {
  process.stdout.write(JSON.stringify(data, null, 2) + '\n');
};

/**
 * Outputs an error response with standardized format
 * @param {string} errorMessage - The error message
 */
const outputError = (errorMessage) => {
  output({ success: false, error: errorMessage });
};

/**
 * Gets the current agent state from the state file
 * @returns {Promise<Object>} The agent state
 */
const getState = async () => {
  try {
    return await fs.readJson(STATE_FILE);
  } catch {
    return { activeProject: null, lastAction: null };
  }
};

/**
 * Saves the agent state to the state file
 * @param {Object} state - The state to save
 * @returns {Promise<void>}
 */
const setState = async (state) => {
  await fs.writeJson(STATE_FILE, state, { spaces: 2 });
};

/**
 * Gets the full path to a project directory
 * @param {string} projectName - The project name
 * @returns {string} The full project path
 * @throws {Error} If the project name is invalid
 */
const getProjectPath = (projectName) => {
  const safeName = sanitizeName(projectName);
  const projectPath = path.join(PROJECTS_DIR, safeName);

  // Verify the path is still within PROJECTS_DIR (defense in depth)
  const resolvedPath = path.resolve(projectPath);
  const resolvedProjectsDir = path.resolve(PROJECTS_DIR);

  if (!resolvedPath.startsWith(resolvedProjectsDir + path.sep)) {
    throw new Error(ERROR_MESSAGES.PATH_TRAVERSAL_DETECTED);
  }

  return projectPath;
};

/**
 * Calculates a letter grade from a score
 * @param {number} score - The score (0-100)
 * @returns {string} The letter grade (A, B, C, D, or F)
 */
const calculateGrade = (score) => {
  if (score >= SCORES.GRADE_A_THRESHOLD) return 'A';
  if (score >= SCORES.GRADE_B_THRESHOLD) return 'B';
  if (score >= SCORES.GRADE_C_THRESHOLD) return 'C';
  if (score >= SCORES.GRADE_D_THRESHOLD) return 'D';
  return 'F';
};

/**
 * Adds an evaluation criterion to an evaluation object
 * @param {Object} evaluation - The evaluation object to update
 * @param {string} name - The criterion name
 * @param {boolean} passed - Whether the criterion passed
 * @param {number} scoreValue - The score value if passed
 * @param {string} [suggestion] - Suggestion if criterion failed
 */
const addEvaluationCriterion = (evaluation, name, passed, scoreValue, suggestion) => {
  evaluation.criteria.push({
    name,
    passed,
    score: passed ? scoreValue : 0
  });

  if (passed) {
    evaluation.score += scoreValue;
  } else if (suggestion) {
    evaluation.suggestions.push(suggestion);
  }
};

/**
 * Finalizes an evaluation by calculating pass status and grade
 * @param {Object} evaluation - The evaluation object to finalize
 */
const finalizeEvaluation = (evaluation) => {
  evaluation.passed = evaluation.score >= SCORES.PASSING_SCORE;
  evaluation.grade = calculateGrade(evaluation.score);
};

// ============================================================================
// PROJECT MANAGEMENT COMMANDS
// ============================================================================

program
  .command('project:list')
  .description('List all projects with status')
  .addHelpText('after', `
Examples:
  $ playwright-agent project:list
  Returns JSON with all projects, their status, progress, and content counts.`)
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
  .addHelpText('after', `
Examples:
  $ playwright-agent project:create "My Musical"
  Creates project directory with characters/, scenes/, songs/, research/ folders.`)
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
  .addHelpText('after', `
Examples:
  $ playwright-agent concept:generate
  $ playwright-agent concept:generate --mode guided --genre Drama --theme Identity`)
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
  .requiredOption('--json <json>', 'Concept JSON data (required)')
  .action(async (project, options) => {
    try {
      // Validate project name
      const projectValidation = validateProjectName(project);
      if (!projectValidation.valid) {
        return outputError(projectValidation.error);
      }

      const projectPath = getProjectPath(project);

      if (!await fs.pathExists(projectPath)) {
        return outputError(ERROR_MESSAGES.PROJECT_NOT_FOUND);
      }

      // Safely parse JSON
      const parseResult = safeJsonParse(options.json, 'concept data');
      if (!parseResult.success) {
        return outputError(parseResult.error);
      }

      const concept = parseResult.data;
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
      outputError(error.message);
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
  .addHelpText('after', `
Examples:
  $ playwright-agent character:create myproject "Maria Santos"
  $ playwright-agent character:create myproject "John" --json '{"role":"protagonist","culturalBackground":"Second-generation Korean-American"}'`)
  .option('--json <json>', 'Character JSON data (optional - uses defaults if not provided)')
  .action(async (project, name, options) => {
    try {
      // Validate project and character names
      const projectValidation = validateProjectName(project);
      if (!projectValidation.valid) {
        return outputError(projectValidation.error);
      }

      const nameValidation = validateProjectName(name);
      if (!nameValidation.valid) {
        return outputError('Invalid character name: ' + nameValidation.error);
      }

      const projectPath = getProjectPath(project);
      const charactersDir = path.join(projectPath, 'characters');

      if (!await fs.pathExists(projectPath)) {
        return outputError(ERROR_MESSAGES.PROJECT_NOT_FOUND);
      }

      await fs.ensureDir(charactersDir);

      // Safely parse JSON if provided
      let characterData = {};
      if (options.json) {
        const parseResult = safeJsonParse(options.json, 'character data');
        if (!parseResult.success) {
          return outputError(parseResult.error);
        }
        characterData = parseResult.data;
      }

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
  .requiredOption('--json <json>', 'Updated character data (merged with existing) - required')
  .action(async (project, name, options) => {
    try {
      // Validate inputs
      const projectValidation = validateProjectName(project);
      if (!projectValidation.valid) {
        return outputError(projectValidation.error);
      }

      const projectPath = getProjectPath(project);
      const characterPath = path.join(projectPath, 'characters', sanitizeName(name) + '.json');

      if (!await fs.pathExists(characterPath)) {
        return outputError(ERROR_MESSAGES.CHARACTER_NOT_FOUND);
      }

      // Safely parse JSON
      const parseResult = safeJsonParse(options.json, 'character update data');
      if (!parseResult.success) {
        return outputError(parseResult.error);
      }

      const existing = await fs.readJson(characterPath);
      const updates = parseResult.data;

      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await fs.writeJson(characterPath, updated, { spaces: 2 });
      output({ success: true, message: 'Character updated', character: name });
    } catch (error) {
      outputError(error.message);
    }
  });

program
  .command('character:evaluate <project> <name>')
  .description('Evaluate character against quality criteria')
  .action(async (project, name) => {
    try {
      // Validate inputs
      const projectValidation = validateProjectName(project);
      if (!projectValidation.valid) {
        return outputError(projectValidation.error);
      }

      const projectPath = getProjectPath(project);
      const characterPath = path.join(projectPath, 'characters', sanitizeName(name) + '.json');

      if (!await fs.pathExists(characterPath)) {
        return outputError(ERROR_MESSAGES.CHARACTER_NOT_FOUND);
      }

      const character = await fs.readJson(characterPath);
      const evaluation = {
        character: name,
        criteria: [],
        score: 0,
        maxScore: 100,
        suggestions: []
      };

      // Check cultural specificity
      const hasCulturalBackground = character.culturalBackground &&
        character.culturalBackground.length > SCORES.MIN_CULTURAL_BACKGROUND_LENGTH;
      addEvaluationCriterion(
        evaluation,
        'Cultural Specificity',
        hasCulturalBackground,
        SCORES.CULTURAL_SPECIFICITY,
        'Add specific cultural background (e.g., "Second-generation Korean-American" not just "Asian")'
      );

      // Check internal contradictions
      const hasContradictions = character.layers?.psychology?.contradictions?.length > 0;
      addEvaluationCriterion(
        evaluation,
        'Internal Contradictions',
        hasContradictions,
        SCORES.INTERNAL_CONTRADICTIONS,
        'Add internal contradictions (public persona vs private reality)'
      );

      // Check personal trauma
      const hasPersonalTrauma = character.personalTrauma &&
        character.personalTrauma.length > SCORES.MIN_FIELD_LENGTH;
      addEvaluationCriterion(
        evaluation,
        'Personal Trauma',
        hasPersonalTrauma,
        SCORES.PERSONAL_TRAUMA,
        'Add personal trauma that reveals character (not just serves plot)'
      );

      // Check economic reality
      const hasEconomicReality = character.economicReality &&
        character.economicReality.length > SCORES.MIN_FIELD_LENGTH;
      addEvaluationCriterion(
        evaluation,
        'Economic Reality',
        hasEconomicReality,
        SCORES.ECONOMIC_REALITY,
        'Add economic pressures affecting decisions'
      );

      // Check character arc
      const hasArc = character.arc?.beginning && character.arc?.catalyst && character.arc?.breakthrough;
      addEvaluationCriterion(
        evaluation,
        'Complete Character Arc',
        hasArc,
        SCORES.COMPLETE_ARC,
        'Complete the character arc (beginning, catalyst, resistance, breakthrough, integration)'
      );

      // Check four layers
      const hasLayers = character.layers?.surface && character.layers?.behavior &&
                       character.layers?.psychology && character.layers?.soul;
      addEvaluationCriterion(
        evaluation,
        'Four Character Layers',
        hasLayers,
        SCORES.FOUR_LAYERS,
        'Define all four layers (surface, behavior, psychology, soul)'
      );

      finalizeEvaluation(evaluation);
      output({ success: true, evaluation });
    } catch (error) {
      outputError(error.message);
    }
  });

// ============================================================================
// SCENE COMMANDS
// ============================================================================

program
  .command('scene:create <project> <act> <num>')
  .description('Create a new scene')
  .addHelpText('after', `
Examples:
  $ playwright-agent scene:create myproject 1 1
  $ playwright-agent scene:create myproject 2 3 --json '{"title":"The Confrontation","location":"Kitchen"}'`)
  .option('--json <json>', 'Scene JSON data (optional - uses defaults if not provided)')
  .action(async (project, act, num, options) => {
    try {
      // Validate project name
      const projectValidation = validateProjectName(project);
      if (!projectValidation.valid) {
        return outputError(projectValidation.error);
      }

      // Validate act and scene numbers
      const actSceneValidation = validateActSceneNumbers(act, num);
      if (!actSceneValidation.valid) {
        return outputError(actSceneValidation.error);
      }

      const projectPath = getProjectPath(project);
      const scenesDir = path.join(projectPath, 'scenes');

      if (!await fs.pathExists(projectPath)) {
        return outputError(ERROR_MESSAGES.PROJECT_NOT_FOUND);
      }

      await fs.ensureDir(scenesDir);

      // Safely parse JSON if provided
      let sceneData = {};
      if (options.json) {
        const parseResult = safeJsonParse(options.json, 'scene data');
        if (!parseResult.success) {
          return outputError(parseResult.error);
        }
        sceneData = parseResult.data;
      }

      const scene = {
        act: actSceneValidation.act,
        sceneNumber: actSceneValidation.num,
        ...sceneData,
        // Ensure required fields
        title: sceneData.title || `Act ${act} Scene ${num}`,
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

      const filename = `act${act}_scene${num}.json`;
      await fs.writeJson(path.join(scenesDir, filename), scene, { spaces: 2 });

      output({
        success: true,
        scene: `Act ${act} Scene ${num}`,
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
      const projectPath = getProjectPath(project);
      const scenePath = path.join(projectPath, 'scenes', `act${act}_scene${num}.json`);

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
  .requiredOption('--json <json>', 'Updated scene data (required)')
  .action(async (project, act, num, options) => {
    try {
      // Validate project name
      const projectValidation = validateProjectName(project);
      if (!projectValidation.valid) {
        return outputError(projectValidation.error);
      }

      // Validate act and scene numbers
      const actSceneValidation = validateActSceneNumbers(act, num);
      if (!actSceneValidation.valid) {
        return outputError(actSceneValidation.error);
      }

      const projectPath = getProjectPath(project);
      const scenePath = path.join(
        projectPath,
        'scenes',
        `act${actSceneValidation.act}_scene${actSceneValidation.num}.json`
      );

      if (!await fs.pathExists(scenePath)) {
        return outputError(ERROR_MESSAGES.SCENE_NOT_FOUND);
      }

      // Safely parse JSON
      const parseResult = safeJsonParse(options.json, 'scene update data');
      if (!parseResult.success) {
        return outputError(parseResult.error);
      }

      const existing = await fs.readJson(scenePath);
      const updates = parseResult.data;

      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await fs.writeJson(scenePath, updated, { spaces: 2 });
      output({
        success: true,
        message: 'Scene updated',
        scene: `Act ${actSceneValidation.act} Scene ${actSceneValidation.num}`
      });
    } catch (error) {
      outputError(error.message);
    }
  });

program
  .command('scene:evaluate <project> <act> <num>')
  .description('Evaluate scene against quality criteria')
  .action(async (project, act, num) => {
    try {
      // Validate inputs
      const projectValidation = validateProjectName(project);
      if (!projectValidation.valid) {
        return outputError(projectValidation.error);
      }

      const actSceneValidation = validateActSceneNumbers(act, num);
      if (!actSceneValidation.valid) {
        return outputError(actSceneValidation.error);
      }

      const projectPath = getProjectPath(project);
      const scenePath = path.join(
        projectPath,
        'scenes',
        `act${actSceneValidation.act}_scene${actSceneValidation.num}.json`
      );

      if (!await fs.pathExists(scenePath)) {
        return outputError(ERROR_MESSAGES.SCENE_NOT_FOUND);
      }

      const scene = await fs.readJson(scenePath);
      const evaluation = {
        scene: `Act ${actSceneValidation.act} Scene ${actSceneValidation.num}`,
        criteria: [],
        score: 0,
        maxScore: 100,
        suggestions: []
      };

      // Check clear objectives
      const hasObjectives = scene.objectives && Object.keys(scene.objectives).length > 0;
      addEvaluationCriterion(
        evaluation,
        'Clear Character Objectives',
        hasObjectives,
        SCORES.CLEAR_OBJECTIVES,
        'Define clear objective for each character in scene'
      );

      // Check obstacles
      const hasObstacles = scene.obstacles && scene.obstacles.length > 0;
      addEvaluationCriterion(
        evaluation,
        'Obstacles Present',
        hasObstacles,
        SCORES.OBSTACLES_PRESENT,
        'Add obstacles preventing easy achievement of objectives'
      );

      // Check conflict
      const hasConflict = scene.conflict && scene.conflict.description;
      addEvaluationCriterion(
        evaluation,
        'Conflict (Internal/External)',
        hasConflict,
        SCORES.CONFLICT_PRESENT,
        'Add clear conflict (internal or external)'
      );

      // Check change
      const hasChange = scene.change && scene.change.length > SCORES.MIN_FIELD_LENGTH;
      addEvaluationCriterion(
        evaluation,
        'Change in Character/Situation',
        hasChange,
        SCORES.SCENE_CHANGE,
        'Define what changes by end of scene'
      );

      // Check theme connection
      const hasTheme = scene.themeConnection && scene.themeConnection.length > SCORES.MIN_FIELD_LENGTH;
      addEvaluationCriterion(
        evaluation,
        'Theme Connection',
        hasTheme,
        SCORES.THEME_CONNECTION,
        'Connect scene to overall story theme'
      );

      finalizeEvaluation(evaluation);
      output({ success: true, evaluation });
    } catch (error) {
      outputError(error.message);
    }
  });

// ============================================================================
// SONG COMMANDS
// ============================================================================

program
  .command('song:create <project> <name>')
  .description('Create a new song')
  .addHelpText('after', `
Examples:
  $ playwright-agent song:create myproject "Opening Number"
  $ playwright-agent song:create myproject "I Want Song" --json '{"function":"character-revealing","character":"Maria"}'`)
  .option('--json <json>', 'Song JSON data (optional - uses defaults if not provided)')
  .action(async (project, name, options) => {
    try {
      // Validate project and song names
      const projectValidation = validateProjectName(project);
      if (!projectValidation.valid) {
        return outputError(projectValidation.error);
      }

      const nameValidation = validateProjectName(name);
      if (!nameValidation.valid) {
        return outputError('Invalid song name: ' + nameValidation.error);
      }

      const projectPath = getProjectPath(project);
      const songsDir = path.join(projectPath, 'songs');

      if (!await fs.pathExists(projectPath)) {
        return outputError(ERROR_MESSAGES.PROJECT_NOT_FOUND);
      }

      await fs.ensureDir(songsDir);

      // Safely parse JSON if provided
      let songData = {};
      if (options.json) {
        const parseResult = safeJsonParse(options.json, 'song data');
        if (!parseResult.success) {
          return outputError(parseResult.error);
        }
        songData = parseResult.data;
      }

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
  .requiredOption('--json <json>', 'Updated song data (required)')
  .action(async (project, name, options) => {
    try {
      // Validate inputs
      const projectValidation = validateProjectName(project);
      if (!projectValidation.valid) {
        return outputError(projectValidation.error);
      }

      const projectPath = getProjectPath(project);
      const songPath = path.join(projectPath, 'songs', sanitizeName(name) + '.json');

      if (!await fs.pathExists(songPath)) {
        return outputError(ERROR_MESSAGES.SONG_NOT_FOUND);
      }

      // Safely parse JSON
      const parseResult = safeJsonParse(options.json, 'song update data');
      if (!parseResult.success) {
        return outputError(parseResult.error);
      }

      const existing = await fs.readJson(songPath);
      const updates = parseResult.data;

      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await fs.writeJson(songPath, updated, { spaces: 2 });
      output({ success: true, message: 'Song updated', song: name });
    } catch (error) {
      outputError(error.message);
    }
  });

program
  .command('song:evaluate <project> <name>')
  .description('Evaluate song against quality criteria')
  .action(async (project, name) => {
    try {
      // Validate inputs
      const projectValidation = validateProjectName(project);
      if (!projectValidation.valid) {
        return outputError(projectValidation.error);
      }

      const projectPath = getProjectPath(project);
      const songPath = path.join(projectPath, 'songs', sanitizeName(name) + '.json');

      if (!await fs.pathExists(songPath)) {
        return outputError(ERROR_MESSAGES.SONG_NOT_FOUND);
      }

      const song = await fs.readJson(songPath);
      const evaluation = {
        song: name,
        criteria: [],
        score: 0,
        maxScore: 100,
        suggestions: []
      };

      // Check dramatic function
      const hasFunction = song.function && song.function.length > 0;
      addEvaluationCriterion(
        evaluation,
        'Specific Dramatic Function',
        hasFunction,
        SCORES.DRAMATIC_FUNCTION,
        'Define dramatic function (plot-advancing, character-revealing, relationship, world-building)'
      );

      // Check character voice
      const hasCharacter = song.character && song.character.length > 0;
      addEvaluationCriterion(
        evaluation,
        'Character Voice',
        hasCharacter,
        SCORES.CHARACTER_VOICE,
        'Specify which character sings this song'
      );

      // Check emotional journey
      const hasEmotionalJourney = song.emotionalJourney &&
                                  song.emotionalJourney.start &&
                                  song.emotionalJourney.end;
      addEvaluationCriterion(
        evaluation,
        'Clear Emotional Journey',
        hasEmotionalJourney,
        SCORES.EMOTIONAL_JOURNEY,
        'Define emotional journey (start, middle, end)'
      );

      // Check plot/character advancement
      const advancesStory = (song.plotAdvancement && song.plotAdvancement.length > SCORES.MIN_FIELD_LENGTH) ||
                           (song.characterRevelation && song.characterRevelation.length > SCORES.MIN_FIELD_LENGTH);
      addEvaluationCriterion(
        evaluation,
        'Advances Plot or Reveals Character',
        advancesStory,
        SCORES.ADVANCES_STORY,
        'Ensure song advances plot or reveals character significantly'
      );

      // Check lyrics exist
      const hasLyrics = song.lyrics && (song.lyrics.verse1 || song.lyrics.chorus);
      addEvaluationCriterion(
        evaluation,
        'Lyrics Present',
        hasLyrics,
        SCORES.LYRICS_PRESENT,
        'Write lyrics (verse1, chorus, verse2, bridge, finalChorus)'
      );

      finalizeEvaluation(evaluation);
      output({ success: true, evaluation });
    } catch (error) {
      outputError(error.message);
    }
  });

// ============================================================================
// DECISION ENGINE COMMANDS
// ============================================================================

program
  .command('decide:story-direction')
  .description('Get guidance on story direction')
  .option('--context <json>', 'Context JSON with current situation (optional)')
  .action(async (options) => {
    try {
      // Safely parse context JSON if provided
      let context = {};
      if (options.context) {
        const parseResult = safeJsonParse(options.context, 'story direction context');
        if (!parseResult.success) {
          return outputError(parseResult.error);
        }
        context = parseResult.data;
      }

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
  .option('--context <json>', 'Context JSON with character and situation (optional)')
  .action(async (options) => {
    try {
      // Safely parse context JSON if provided
      let context = {};
      if (options.context) {
        const parseResult = safeJsonParse(options.context, 'character behavior context');
        if (!parseResult.success) {
          return outputError(parseResult.error);
        }
        context = parseResult.data;
      }

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
  .option('--context <json>', 'Context JSON with scene/moment details (optional)')
  .action(async (options) => {
    try {
      // Safely parse context JSON if provided
      let context = {};
      if (options.context) {
        const parseResult = safeJsonParse(options.context, 'musical moment context');
        if (!parseResult.success) {
          return outputError(parseResult.error);
        }
        context = parseResult.data;
      }

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
    const reference = {
      title: 'PLAYWRIGHT AGENT HARNESS - API REFERENCE',
      description: 'This CLI provides a complete API for an agentic LLM to drive musical creation.',
      categories: {
        projectManagement: {
          description: 'Project Management Commands',
          commands: [
            { command: 'project:list', description: 'List all projects with status' },
            { command: 'project:create <name>', description: 'Create new project with scaffolding' },
            { command: 'project:status <name>', description: 'Get detailed project status' },
            { command: 'project:set-active <name>', description: 'Set active project context' }
          ]
        },
        conceptGeneration: {
          description: 'Concept Generation Commands',
          commands: [
            { command: 'concept:generate [options]', description: 'Generate story concept', options: ['--mode <mode>', '--genre <genre>', '--setting <setting>', '--theme <theme>', '--conflict <conflict>'] },
            { command: 'concept:save <project> --json', description: 'Save concept to project (--json required)' },
            { command: 'concept:get <project>', description: 'Get project concept' }
          ]
        },
        characterCommands: {
          description: 'Character Commands',
          commands: [
            { command: 'character:create <project> <name> --json', description: 'Create character (--json optional)' },
            { command: 'character:list <project>', description: 'List characters' },
            { command: 'character:get <project> <name>', description: 'Get character details' },
            { command: 'character:update <project> <name> --json', description: 'Update character (--json required)' },
            { command: 'character:evaluate <project> <name>', description: 'Evaluate character quality' }
          ]
        },
        sceneCommands: {
          description: 'Scene Commands',
          commands: [
            { command: 'scene:create <project> <act> <num> --json', description: 'Create scene (--json optional, act must be 1-3)' },
            { command: 'scene:list <project>', description: 'List scenes' },
            { command: 'scene:get <project> <act> <num>', description: 'Get scene details' },
            { command: 'scene:update <project> <act> <num> --json', description: 'Update scene (--json required)' },
            { command: 'scene:evaluate <project> <act> <num>', description: 'Evaluate scene quality' }
          ]
        },
        songCommands: {
          description: 'Song Commands',
          commands: [
            { command: 'song:create <project> <name> --json', description: 'Create song (--json optional)' },
            { command: 'song:list <project>', description: 'List songs' },
            { command: 'song:get <project> <name>', description: 'Get song details' },
            { command: 'song:update <project> <name> --json', description: 'Update song (--json required)' },
            { command: 'song:evaluate <project> <name>', description: 'Evaluate song quality' }
          ]
        },
        decisionEngine: {
          description: 'Decision Engine Commands',
          commands: [
            { command: 'decide:story-direction --context', description: 'Get story direction guidance (--context optional)' },
            { command: 'decide:character-behavior --context', description: 'Get character behavior guidance (--context optional)' },
            { command: 'decide:musical-moment --context', description: 'Decide if moment needs song (--context optional)' },
            { command: 'decide:resolve-block --type --context', description: 'Get creative block resolution' }
          ]
        },
        validation: {
          description: 'Validation Commands',
          commands: [
            { command: 'validate:project <project>', description: 'Full project validation' },
            { command: 'validate:transcendence <project>', description: 'Check transcendence criteria' }
          ]
        },
        workflow: {
          description: 'Workflow Commands',
          commands: [
            { command: 'workflow:status <project>', description: 'Get current workflow state' },
            { command: 'workflow:next-task <project>', description: 'Get next recommended task' },
            { command: 'workflow:complete-task <project> <task>', description: 'Mark task complete' }
          ]
        },
        generators: {
          description: 'Generator Commands',
          commands: [
            { command: 'generate:title --genre --theme', description: 'Generate title options' },
            { command: 'generate:character-traits', description: 'Get trait suggestions' },
            { command: 'generate:plot-twist', description: 'Get plot twist suggestions' },
            { command: 'generate:dialogue-starter --type', description: 'Get dialogue starters' }
          ]
        }
      },
      note: 'All commands output JSON to stdout for easy parsing by an LLM agent.'
    };
    output({ success: true, reference });
  });

// Parse arguments
program.parse(process.argv);

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
