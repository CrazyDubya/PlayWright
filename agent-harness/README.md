# PlayWright Agent Harness

A comprehensive CLI tool that exposes the musical creation workflow as commands for an agentic LLM to drive autonomously.

## Installation

```bash
npm install
```

## Usage

The CLI can be run directly or installed globally:

```bash
# Run directly
node playwright-agent.js <command>

# Or install globally
npm install -g
playwright-agent <command>
```

## Quick Start Examples

### Project Management

```bash
# List all projects
playwright-agent project:list

# Create a new project
playwright-agent project:create "My Musical"

# Get project status
playwright-agent project:status my_musical

# Set active project
playwright-agent project:set-active my_musical
```

### Concept Generation

```bash
# Generate a random concept
playwright-agent concept:generate

# Generate with guided mode and specific genre
playwright-agent concept:generate --mode guided --genre Drama --theme Identity

# Save concept to project
playwright-agent concept:save my_musical --json '{"title":"My Story","genre":"Drama",...}'

# Get saved concept
playwright-agent concept:get my_musical
```

### Character Creation

```bash
# Create a character with JSON data
playwright-agent character:create my_musical "John Doe" --json '{
  "layers": {
    "surface": {"occupation": "Teacher", "publicPersona": "Strict", "reputation": "Demanding"},
    "behavior": {"actions": ["Grades papers late at night"], "habits": ["Drinks coffee"], "underPressure": "Becomes overly critical"},
    "psychology": {"motivations": ["Help students succeed"], "fears": ["Failure"], "contradictions": ["Wants to help but pushes too hard"]},
    "soul": {"coreValues": ["Education", "Excellence"], "deepestDreams": ["Every student reaches potential"], "wouldDieFor": "A student"}
  }
}'

# List all characters
playwright-agent character:list my_musical

# Get character details
playwright-agent character:get my_musical john_doe

# Update character
playwright-agent character:update my_musical john_doe --json '{"layers":{"soul":{"coreValues":["Education","Excellence","Compassion"]}}}'

# Evaluate character quality
playwright-agent character:evaluate my_musical john_doe
```

### Scene Creation

```bash
# Create a scene
playwright-agent scene:create my_musical 1 1 --json '{
  "title": "The First Day",
  "location": "High School Classroom",
  "time": "Morning",
  "charactersPresent": ["John Doe", "Students"],
  "objectives": {
    "john_doe": "Establish authority and expectations"
  },
  "obstacles": ["Students are uncooperative"],
  "conflict": "Power struggle between teacher and students",
  "emotionalBeats": ["Tension", "Challenge", "Determination"]
}'

# List scenes
playwright-agent scene:list my_musical

# Get scene
playwright-agent scene:get my_musical 1 1

# Update scene
playwright-agent scene:update my_musical 1 1 --json '{"conflict":"Escalating power struggle"}'

# Evaluate scene
playwright-agent scene:evaluate my_musical 1 1
```

### Song Creation

```bash
# Create a song
playwright-agent song:create my_musical "Opening Number" --json '{
  "placement": "Act 1, Scene 1",
  "dramaticFunction": "Establish world and character",
  "emotionalJourney": "Optimism to determination",
  "musicalStyle": "Upbeat ensemble piece",
  "lyrics": "...",
  "vocalists": ["John Doe", "Ensemble"]
}'

# List songs
playwright-agent song:list my_musical

# Get song
playwright-agent song:get my_musical opening_number

# Update song
playwright-agent song:update my_musical opening_number --json '{"musicalStyle":"Power ballad"}'

# Evaluate song
playwright-agent song:evaluate my_musical opening_number
```

### Decision Engine

```bash
# Get story direction guidance
playwright-agent decide:story-direction --context '{"currentAct":1,"recentEvents":["Teacher introduced"]}'

# Get character behavior guidance
playwright-agent decide:character-behavior --context '{"character":"john_doe","situation":"Student challenges him"}'

# Decide if moment needs a song
playwright-agent decide:musical-moment --context '{"sceneContext":"Climactic confrontation","emotionalIntensity":"high"}'
```

### Validation

```bash
# Validate entire project
playwright-agent validate:project my_musical

# Validate individual scene
playwright-agent validate:scene my_musical 1 1

# Validate song
playwright-agent validate:song my_musical opening_number

# Check transcendence criteria
playwright-agent validate:transcendence my_musical
```

### Workflow Orchestration

```bash
# Get workflow status
playwright-agent workflow:status my_musical

# Get next recommended task
playwright-agent workflow:next-task my_musical

# Complete a task
playwright-agent workflow:complete-task my_musical concept
```

### Creative Generators

```bash
# Generate title options
playwright-agent generate:title --genre Drama --theme Identity

# Get character trait suggestions
playwright-agent generate:character-traits

# Get plot twist ideas
playwright-agent generate:plot-twist

# Get dialogue starters
playwright-agent generate:dialogue-starter --type conflict
```

## Output Format

All commands output JSON for easy parsing by LLM agents:

```json
{
  "success": true,
  "data": { ... }
}
```

Or on error:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Security

- All project names are sanitized to prevent path traversal attacks
- JSON input is validated with proper error handling
- Numeric inputs (act/scene numbers) are validated
- Paths are verified to stay within the projects directory

## Documentation

See `AGENT_LOOP.md` for detailed information about the autonomous workflow loop and how to orchestrate the creation process.

## License

MIT
