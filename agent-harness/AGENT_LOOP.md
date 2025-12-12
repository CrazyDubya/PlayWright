# PlayWright Agent Loop - LLM Integration Guide

This document defines exactly how an agentic LLM should use the PlayWright harness to autonomously create musicals.

## The Master Loop

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AGENT MASTER LOOP                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  WHILE project not complete:                                             │
│                                                                          │
│    1. GET NEXT TASK                                                      │
│       $ node playwright-agent.js workflow:next-task <project>            │
│       → Returns: { nextTask, projectStatus }                             │
│                                                                          │
│    2. EXECUTE TASK based on nextTask.task:                               │
│       │                                                                  │
│       ├─ "generate_concept"  → Run Concept Generation Loop               │
│       ├─ "create_characters" → Run Character Creation Loop               │
│       ├─ "create_act*_scenes" → Run Scene Creation Loop                  │
│       ├─ "create_act*_songs" → Run Song Creation Loop                    │
│       └─ "transcendence"     → Run Breaking Protocol Loop                │
│                                                                          │
│    3. VALIDATE RESULT                                                    │
│       $ node playwright-agent.js validate:project <project>              │
│       → If failed: return to step 1 with revised approach                │
│       → If passed: mark task complete                                    │
│                                                                          │
│    4. MARK COMPLETE                                                      │
│       $ node playwright-agent.js workflow:complete-task <project> <id>   │
│                                                                          │
│  END WHILE                                                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Sub-Loops

### 1. Concept Generation Loop

```
CONCEPT GENERATION LOOP:
========================

1. GENERATE initial concept:
   $ node playwright-agent.js concept:generate --mode random

   OR for guided generation:
   $ node playwright-agent.js concept:generate --mode guided \
       --genre "Drama" \
       --theme "Identity" \
       --setting "Urban" \
       --conflict "Internal Struggle" \
       --cultural "Second-generation Korean-American family" \
       --stakes "Finding authentic identity"

2. EVALUATE the concept (LLM reviews JSON output):
   - Is the cultural perspective specific enough?
   - Does the conflict create dramatic tension?
   - Is the theme universal but grounded in specificity?

3. IF concept needs refinement:
   - Re-run with different parameters
   - Regenerate until satisfactory

4. SAVE concept to project:
   $ node playwright-agent.js concept:save <project> --json '<concept_json>'

5. VERIFY saved:
   $ node playwright-agent.js concept:get <project>
```

### 2. Character Creation Loop

```
CHARACTER CREATION LOOP:
========================

FOR each required character (minimum 3-5):

  1. GET trait suggestions:
     $ node playwright-agent.js generate:character-traits

  2. GET concept for context:
     $ node playwright-agent.js concept:get <project>

  3. CREATE character with full structure:
     $ node playwright-agent.js character:create <project> "<name>" --json '{
       "role": "protagonist|antagonist|supporting",
       "culturalBackground": "Specific cultural identity (not generic)",
       "economicReality": "Their financial situation and pressures",
       "personalTrauma": "Pain that reveals character, not just serves plot",
       "layers": {
         "surface": {
           "occupation": "...",
           "publicPersona": "How they present to world",
           "reputation": "What others think"
         },
         "behavior": {
           "actions": ["typical actions"],
           "habits": ["patterns"],
           "underPressure": "How they react under stress"
         },
         "psychology": {
           "motivations": ["what drives them"],
           "fears": ["what terrifies them"],
           "contradictions": ["internal conflicts - CRITICAL"]
         },
         "soul": {
           "coreValues": ["what they truly believe"],
           "deepestDreams": ["secret hopes"],
           "wouldDieFor": "ultimate value"
         }
       },
       "arc": {
         "beginning": {
           "patterns": "established behaviors",
           "worldview": "how they see world",
           "blindSpots": ["what they cant see"]
         },
         "catalyst": {
           "externalPressure": "what forces change",
           "internalCrisis": "inner awakening",
           "challengingRelationship": "person who challenges them"
         },
         "resistance": {
           "oldPatterns": "how they fight change",
           "fearOfGrowth": "why growth is scary",
           "externalObstacles": ["barriers to growth"]
         },
         "breakthrough": {
           "forcedChoice": "the impossible decision",
           "crisis": "moment of truth",
           "authenticSelf": "who they really are"
         },
         "integration": {
           "newPatterns": "changed behaviors",
           "expandedCapacity": "new abilities",
           "changed": "who they become"
         }
       }
     }'

  4. EVALUATE character:
     $ node playwright-agent.js character:evaluate <project> "<name>"

  5. IF evaluation.passed == false:
     - Review suggestions
     - UPDATE character with improvements:
       $ node playwright-agent.js character:update <project> "<name>" --json '<updates>'
     - Re-evaluate until passed

END FOR
```

### 3. Scene Creation Loop

```
SCENE CREATION LOOP:
====================

FOR each scene in current act:

  1. GET story direction guidance:
     $ node playwright-agent.js decide:story-direction --context '{
       "currentAct": 1,
       "sceneNumber": 1,
       "previousScenes": [...],
       "stuck": false
     }'

  2. GET existing characters:
     $ node playwright-agent.js character:list <project>

  3. CREATE scene:
     $ node playwright-agent.js scene:create <project> <act> <num> --json '{
       "title": "Scene title",
       "location": "Where it takes place",
       "time": "When it happens",
       "charactersPresent": ["Character1", "Character2"],
       "objectives": {
         "Character1": "What they want in this scene",
         "Character2": "What they want in this scene"
       },
       "obstacles": [
         "What prevents easy achievement"
       ],
       "conflict": {
         "type": "internal|external|interpersonal",
         "description": "The core tension"
       },
       "change": "What is different by scene end",
       "themeConnection": "How this connects to central theme",
       "dialogue": [
         {"character": "Name", "line": "Dialogue", "direction": "stage direction"},
         ...
       ],
       "stageDirections": [
         "Opening stage direction",
         ...
       ],
       "transitionTo": "Setup for next scene"
     }'

  4. EVALUATE scene:
     $ node playwright-agent.js scene:evaluate <project> <act> <num>

  5. IF evaluation.passed == false:
     - Review suggestions
     - Get block resolution if stuck:
       $ node playwright-agent.js decide:resolve-block --type story
     - UPDATE scene:
       $ node playwright-agent.js scene:update <project> <act> <num> --json '<updates>'
     - Re-evaluate until passed

  6. DECIDE if scene needs a song:
     $ node playwright-agent.js decide:musical-moment --context '{
       "sceneJustWritten": true,
       "emotionalIntensity": "high|medium|low",
       "isEmotionalPeak": true|false,
       "currentSongCount": N
     }'

  7. IF song needed → Enter Song Creation Loop for this moment

END FOR
```

### 4. Song Creation Loop

```
SONG CREATION LOOP:
===================

1. GET musical moment guidance:
   $ node playwright-agent.js decide:musical-moment --context '{
     "scene": {"act": 1, "num": 3},
     "emotion": "longing",
     "character": "Maya"
   }'

2. CREATE song:
   $ node playwright-agent.js song:create <project> "<song_name>" --json '{
     "title": "Song Title",
     "function": "plot-advancing|character-revealing|relationship|world-building",
     "character": "Who sings this",
     "placement": {"act": 1, "afterScene": 3},
     "storyMoment": "What is happening when song begins",
     "emotionalJourney": {
       "start": "Emotional state at beginning",
       "middle": "How emotion transforms",
       "end": "Where they arrive emotionally"
     },
     "musicalStyle": "Jazz ballad|Rock anthem|Folk song|etc",
     "lyrics": {
       "verse1": "First verse lyrics...",
       "chorus": "Chorus lyrics...",
       "verse2": "Second verse lyrics...",
       "bridge": "Bridge lyrics...",
       "finalChorus": "Final chorus with variation..."
     },
     "dramaticPurpose": "Why this song exists",
     "plotAdvancement": "What story info is conveyed",
     "characterRevelation": "What we learn about character"
   }'

3. EVALUATE song:
   $ node playwright-agent.js song:evaluate <project> "<song_name>"

4. IF evaluation.passed == false:
   - Review suggestions
   - UPDATE song:
     $ node playwright-agent.js song:update <project> "<song_name>" --json '<updates>'
   - Re-evaluate until passed
```

### 5. Breaking Protocol Loop (Phase 3)

```
BREAKING PROTOCOL LOOP:
=======================

This transforms "competent art" into "transcendent art".

1. GET transcendence criteria:
   $ node playwright-agent.js validate:transcendence <project>

2. FOR EACH character:
   a. GET character:
      $ node playwright-agent.js character:get <project> "<name>"

   b. INJECT cultural specificity:
      - Replace generic → specific
      - "Latino" → "Third-generation Cuban-American from Little Havana"

   c. ADD personal trauma (not plot-serving):
      - Family addiction affecting behavior
      - Immigration trauma creating trust issues
      - Religious crisis affecting worldview

   d. CREATE contradictions:
      - Confident performer with social anxiety
      - Health-conscious person with self-destructive habits

   e. UPDATE character:
      $ node playwright-agent.js character:update <project> "<name>" --json '<enhanced>'

3. FOR EACH scene:
   a. GET scene:
      $ node playwright-agent.js scene:get <project> <act> <num>

   b. REVIEW for:
      - Generic cultural references → Make specific
      - Clear moral lines → Add complexity
      - Perfect character behavior → Add human messiness

   c. UPDATE scene if needed:
      $ node playwright-agent.js scene:update <project> <act> <num> --json '<enhanced>'

4. FOR EACH antagonist:
   - Ensure they have understandable motivations
   - Add sympathetic elements
   - Remove pure villain qualities

5. VALIDATE transcendence:
   $ node playwright-agent.js validate:transcendence <project>

   Manual verification of:
   - [ ] Characters feel like real people
   - [ ] Culture feels lived-in, not researched
   - [ ] No clear villains
   - [ ] Complex, contradictory emotions
   - [ ] Structure feels organic, not formulaic
```

## Complete Example Session

```bash
# 1. Create project
$ node playwright-agent.js project:create "midnight_diner"
# → {"success":true,"project":"midnight_diner",...}

# 2. Generate concept
$ node playwright-agent.js concept:generate --mode guided \
    --genre "Drama" \
    --cultural "Korean-American family running 24-hour diner" \
    --theme "Identity" \
    --stakes "Saving family business from gentrification"
# → {"success":true,"concept":{...}}

# 3. Save concept
$ node playwright-agent.js concept:save midnight_diner --json '{"title":"Midnight at the Diner",...}'

# 4. Get next task
$ node playwright-agent.js workflow:next-task midnight_diner
# → {"nextTask":{"task":"create_characters",...}}

# 5. Create characters
$ node playwright-agent.js character:create midnight_diner "Ji-Yeon Park" --json '{...}'
$ node playwright-agent.js character:evaluate midnight_diner "Ji-Yeon Park"
# If needed: update and re-evaluate

# 6. Continue loop...
$ node playwright-agent.js workflow:next-task midnight_diner
# → {"nextTask":{"task":"create_act1_scenes",...}}

# 7. Create scenes
$ node playwright-agent.js scene:create midnight_diner 1 1 --json '{...}'
$ node playwright-agent.js scene:evaluate midnight_diner 1 1

# 8. Check if song needed
$ node playwright-agent.js decide:musical-moment --context '{...}'

# 9. Validate project periodically
$ node playwright-agent.js validate:project midnight_diner

# 10. Final transcendence check
$ node playwright-agent.js validate:transcendence midnight_diner
```

## Error Handling

```
ON ERROR from any command:
  1. Parse error message from JSON output
  2. Determine if:
     - Missing required data → Gather missing data first
     - Invalid state → Check project:status and reset
     - Quality failure → Use decide:resolve-block for guidance
  3. Retry with corrected approach
  4. If stuck 3+ times → Ask for human input
```

## Quality Gates

Before moving between phases, validate:

```
PHASE 1 → PHASE 2 (Foundation → Systematic Creation):
  - Concept saved: concept:get returns data
  - 3+ characters created with score >= 70
  - Characters have arcs and contradictions

PHASE 2 → PHASE 3 (Systematic → Breaking Protocol):
  - 10+ scenes with score >= 70 each
  - 8+ songs with score >= 70 each
  - All acts complete (I, II-A, II-B)

PHASE 3 → COMPLETE (Breaking Protocol → Done):
  - All transcendence criteria addressed
  - Overall project validation >= 80
  - No generic cultural references remain
  - All antagonists have sympathetic elements
```

## Output Format

All commands return JSON to stdout:

```json
{
  "success": true|false,
  "error": "Error message if success=false",
  "data": { ... }
}
```

Parse with: `JSON.parse(stdout)`
