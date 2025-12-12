/**
 * Unit Tests for PlayWright Agent Harness
 *
 * Run with: npm test
 * Requires: npm install --save-dev jest
 */

const path = require('path');
const fs = require('fs-extra');
const { spawnSync } = require('child_process');

// Test configuration
const TEST_PROJECTS_DIR = path.join(__dirname, '../test-projects');
const CLI_PATH = path.join(__dirname, '../playwright-agent.js');

/**
 * Helper to run CLI commands and return parsed JSON output
 * Uses spawnSync with array arguments to prevent command injection
 * @param {string} command - The CLI command to run (will be split into args)
 * @returns {Object} Parsed JSON response
 */
const runCli = (command) => {
  try {
    // Parse command string into arguments safely
    // Handle quoted strings to preserve them as single arguments
    const args = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (const char of command) {
      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = '';
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          args.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
    if (current) args.push(current);

    // Use spawnSync with array arguments (safe from injection)
    const result = spawnSync('node', [CLI_PATH, ...args], {
      encoding: 'utf-8',
      cwd: path.join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    if (result.stdout && result.stdout.trim()) {
      return JSON.parse(result.stdout.trim());
    }

    if (result.status !== 0) {
      if (result.stderr && result.stderr.trim()) {
        try {
          return JSON.parse(result.stderr.trim());
        } catch {
          return { success: false, error: result.stderr.trim() };
        }
      }
      return { success: false, error: 'Command failed with no output' };
    }

    return { success: false, error: 'No output from command' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Test setup and teardown
beforeAll(async () => {
  await fs.ensureDir(TEST_PROJECTS_DIR);
});

afterAll(async () => {
  await fs.remove(TEST_PROJECTS_DIR);
});

describe('Input Validation', () => {
  describe('sanitizeName', () => {
    test('rejects path traversal attempts', () => {
      const result = runCli('project:create "../malicious"');
      expect(result.success).toBe(false);
      expect(result.error).toContain('path traversal');
    });

    test('rejects absolute paths', () => {
      const result = runCli('project:create "/etc/passwd"');
      expect(result.success).toBe(false);
      expect(result.error).toContain('path traversal');
    });

    test('rejects URL-encoded path traversal', () => {
      const result = runCli('project:create "%2e%2e%2fmalicious"');
      expect(result.success).toBe(false);
      expect(result.error).toContain('path traversal');
    });

    test('accepts valid project names', () => {
      const result = runCli('project:create "Test Project 123"');
      expect(result.success).toBe(true);
      // Clean up
      fs.removeSync(path.join(__dirname, '../projects/test_project_123'));
    });
  });

  describe('validateActSceneNumbers', () => {
    test('rejects invalid act numbers', () => {
      const result = runCli('scene:create testproject 5 1');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Act number must be');
    });

    test('rejects negative scene numbers', () => {
      const result = runCli('scene:create testproject 1 -- -1');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Scene number must be');
    });

    test('rejects non-numeric values', () => {
      const result = runCli('scene:create testproject abc 1');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Act number');
    });
  });

  describe('JSON validation', () => {
    test('rejects invalid JSON in --json option', () => {
      const result = runCli('concept:save testproject --json "{invalid"');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid JSON');
    });

    test('requires --json for update commands', () => {
      const result = runCli('character:update testproject testchar');
      expect(result.success).toBe(false);
      expect(result.error).toContain('--json');
    });
  });
});

describe('Project Management', () => {
  const testProjectName = 'unit_test_project';

  afterEach(async () => {
    const projectPath = path.join(__dirname, '../projects', testProjectName);
    await fs.remove(projectPath);
  });

  test('project:list returns array of projects', () => {
    const result = runCli('project:list');
    expect(result.success).toBe(true);
    expect(Array.isArray(result.projects)).toBe(true);
  });

  test('project:create creates directory structure', async () => {
    const result = runCli(`project:create "${testProjectName}"`);
    expect(result.success).toBe(true);

    const projectPath = path.join(__dirname, '../projects', testProjectName);
    expect(await fs.pathExists(path.join(projectPath, 'characters'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'scenes'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'songs'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'research'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'workflow-state.json'))).toBe(true);
  });

  test('project:create rejects duplicate names', async () => {
    runCli(`project:create "${testProjectName}"`);
    const result = runCli(`project:create "${testProjectName}"`);
    expect(result.success).toBe(false);
    expect(result.error).toContain('already exists');
  });

  test('project:status returns 404 for non-existent project', () => {
    const result = runCli('project:status nonexistent_project_12345');
    expect(result.success).toBe(false);
    expect(result.error).toContain('not found');
  });
});

describe('Concept Generation', () => {
  test('concept:generate returns valid concept structure', () => {
    const result = runCli('concept:generate');
    expect(result.success).toBe(true);
    expect(result.concept).toBeDefined();
    expect(result.concept.genre).toBeDefined();
    expect(result.concept.theme).toBeDefined();
    expect(result.concept.setting).toBeDefined();
    expect(result.concept.logline).toBeDefined();
  });

  test('concept:generate respects guided mode options', () => {
    const result = runCli('concept:generate --mode guided --genre Drama --theme Identity');
    expect(result.success).toBe(true);
    expect(result.concept.genre).toBe('Drama');
    expect(result.concept.theme).toBe('Identity');
  });
});

describe('Generator Commands', () => {
  test('generate:title returns title options', () => {
    const result = runCli('generate:title');
    expect(result.success).toBe(true);
    expect(Array.isArray(result.titles)).toBe(true);
    expect(result.titles.length).toBeGreaterThan(0);
  });

  test('generate:character-traits returns trait suggestions', () => {
    const result = runCli('generate:character-traits');
    expect(result.success).toBe(true);
    expect(result.suggestions).toBeDefined();
    expect(result.suggestions.positive).toBeDefined();
    expect(result.suggestions.flaws).toBeDefined();
  });

  test('generate:plot-twist returns twist suggestions', () => {
    const result = runCli('generate:plot-twist');
    expect(result.success).toBe(true);
    expect(Array.isArray(result.suggestions)).toBe(true);
  });

  test('generate:dialogue-starter returns starters', () => {
    const result = runCli('generate:dialogue-starter');
    expect(result.success).toBe(true);
    expect(Array.isArray(result.suggestions)).toBe(true);
  });
});

describe('Decision Engine', () => {
  test('decide:story-direction returns guidance', () => {
    const result = runCli('decide:story-direction');
    expect(result.success).toBe(true);
    expect(result.guidance).toBeDefined();
    expect(result.guidance.decisionFramework).toBeDefined();
  });

  test('decide:character-behavior returns guidance', () => {
    const result = runCli('decide:character-behavior');
    expect(result.success).toBe(true);
    expect(result.guidance).toBeDefined();
  });

  test('decide:musical-moment returns guidance', () => {
    const result = runCli('decide:musical-moment');
    expect(result.success).toBe(true);
    expect(result.guidance).toBeDefined();
    expect(result.guidance.songFunctions).toBeDefined();
  });

  test('decide:resolve-block returns strategies', () => {
    const result = runCli('decide:resolve-block --type story');
    expect(result.success).toBe(true);
    expect(result.strategy).toBeDefined();
    expect(result.strategy.solutions).toBeDefined();
  });
});

describe('Error Handling', () => {
  test('returns JSON error for missing project', () => {
    const result = runCli('character:list nonexistent_project_xyz');
    expect(result.success).toBe(false);
  });

  test('handles malformed commands gracefully', () => {
    // This should not throw
    expect(() => runCli('invalid:command')).not.toThrow();
  });
});
