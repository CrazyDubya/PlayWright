# PlayWright Codebase Presentation
## A 5-10 Minute Technical Overview

---

# Slide 1: What is PlayWright?

## AI-Powered Musical Theater Creation Framework

**Mission**: Enable non-professionals to create production-ready Broadway musicals in weeks instead of months/years.

**Core Philosophy**:
> "Perfect systems create competent art. Broken systems create transcendent art."

### Stats at a Glance:
| Component | Count |
|-----------|-------|
| Python Engines | 11 files (~8,000 lines) |
| CLI Commands | 80+ agent commands |
| Documentation | 277 Markdown files |
| Sample Musicals | 9 complete/in-progress |

---

# Slide 2: The 10-Engine Architecture

```
                    THOUSAND MINDS AWAKENED (Seeds)
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
          CHARACTER       DREAM          TEMPORAL
          GENETICS       PROTOCOL         SPIRAL
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                  SYNESTHETIC TRANSLATOR
                              │
                  ┌───────────┴───────────┐
                  ▼                       ▼
              BODY GRAMMAR         LIVING CANVAS
                  │                       │
                  └───────────┬───────────┘
                              ▼
                        GHOST COUNCIL
                              │
                              ▼
                       BREAKING ENGINE
                              │
                              ▼
                       RITUAL FRAMEWORK
```

**Key Insight**: Engines don't compete - they compound. Each adds insights as artifacts flow through.

---

# Slide 3: The Creative Artifact Flow

**File**: `engines/core/base_engine.py:31-78`

```python
@dataclass
class CreativeArtifact:
    """A unit of creative output that flows between engines."""
    id: str
    artifact_type: str  # concept, character, scene, song
    content: Dict[str, Any]
    insights: Dict[str, Any] = field(default_factory=dict)
    processed_by: List[str] = field(default_factory=list)

    def add_insight(self, engine_name: str, insight_key: str, insight_value: Any):
        """Add an insight from an engine's processing"""
        if engine_name not in self.insights:
            self.insights[engine_name] = {}
        self.insights[engine_name][insight_key] = insight_value
```

**Pattern**: Artifacts accumulate wisdom as they traverse the cascade. Each engine adds its perspective.

---

# Slide 4: The Ghost Council - Multi-Perspective Critique

**File**: `engines/layer5_critique/ghost_council.py:76-226`

**10 Critical Voices**:
| Ghost | Focus | Signature Phrase |
|-------|-------|------------------|
| Sondheim | Lyrics, precision | "The word is everything. Make it precise." |
| Fosse | Body, movement | "The body doesn't lie. Let it speak." |
| Brecht | Politics, systems | "Theater that comforts serves power." |
| Kushner | Spirituality, culture | "More. Always more. The angels demand it." |
| Dionysian | Ecstasy, danger | "Safety is death. Break something." |
| Wounded Child | Vulnerability | "I need to feel it. Make me feel it." |
| Cynic | Transactions | "Tears are cheap. Truth costs." |
| Ancestor | Tradition | "The old ones knew. Listen." |

**Each ghost votes**: APPROVE, REVISE, REJECT, or ABSTAIN

---

# Slide 5: The Breaking Engine - Hunting Mediocrity

**File**: `engines/layer6_transformation/breaking_engine.py:30-48`

```python
class MediocrityType(Enum):
    """Types of mediocrity the engine hunts"""
    GENERIC = "generic"
    CONVENIENT_VILLAIN = "convenient_villain"
    TRAUMA_SERVES_PLOT = "trauma_serves_plot"
    TOO_CONSISTENT = "too_consistent"
    TOO_SYMPATHETIC = "too_sympathetic"
    FALSE_STAKES = "false_stakes"
    EASY_RESOLUTION = "easy_resolution"

class BreakingIntensity(Enum):
    GENTLE = "gentle"       # Suggestions and alternatives
    FIRM = "firm"           # Clear problems identified
    AGGRESSIVE = "aggressive"  # Everything questioned
    NUCLEAR = "nuclear"     # Scorched earth
```

**Key Function**: `detect_generic()` - Replaces "Asian-American" with "Third-generation Japanese-American from Gardena whose grandfather was in Manzanar"

---

# Slide 6: The Master Agent Loop

**File**: `agent-harness/AGENT_LOOP.md:7-36`

```
┌─────────────────────────────────────────────────────────────┐
│                     AGENT MASTER LOOP                        │
├─────────────────────────────────────────────────────────────┤
│  WHILE project not complete:                                 │
│                                                              │
│    1. GET NEXT TASK                                          │
│       $ node playwright-agent.js workflow:next-task <proj>   │
│                                                              │
│    2. EXECUTE TASK based on nextTask.task:                   │
│       ├─ "generate_concept"  → Concept Generation Loop       │
│       ├─ "create_characters" → Character Creation Loop       │
│       ├─ "create_act*_scenes" → Scene Creation Loop          │
│       └─ "transcendence"     → Breaking Protocol Loop        │
│                                                              │
│    3. VALIDATE RESULT                                        │
│       $ node playwright-agent.js validate:project <proj>     │
│                                                              │
│    4. MARK COMPLETE                                          │
│       $ node playwright-agent.js workflow:complete-task      │
│                                                              │
│  END WHILE                                                   │
└─────────────────────────────────────────────────────────────┘
```

**Key Insight**: LLM receives JSON, parses it, makes decisions, calls next command. Fully autonomous.

---

# Slide 7: Sub-Loops - Character Creation

**Pattern**: Generate → Evaluate → Improve → Re-evaluate

```
CHARACTER CREATION LOOP:
========================
FOR each required character (minimum 3-5):

  1. GET trait suggestions
  2. CREATE character with 4-layer depth:
     - Surface (occupation, persona, reputation)
     - Behavior (actions, habits, under pressure)
     - Psychology (motivations, fears, contradictions)
     - Soul (core values, deepest dreams, would die for)

  3. EVALUATE character (score 0-100)
     - Cultural specificity: 15 pts
     - Internal contradictions: 15 pts
     - Personal trauma: 15 pts
     - Complete arc: 20 pts
     - Four layers defined: 20 pts

  4. IF score < 70: UPDATE and re-evaluate
END FOR
```

**Quality Gate**: Must score >= 70 to pass

---

# Slide 8: The Orchestrator - Cascade Conductor

**File**: `engines/orchestrator/engine_orchestrator.py:101-208`

```python
class EngineOrchestrator:
    """The conductor of the Ten Creative Engines."""

    CASCADE_ORDER = [
        ("ThousandMindsAwakened", EngineLayer.SEEDS),
        ("CharacterGenetics", EngineLayer.FOUNDATION),
        ("DreamProtocol", EngineLayer.FOUNDATION),
        ("TemporalSpiral", EngineLayer.FOUNDATION),
        ("SynestheticTranslator", EngineLayer.TRANSLATION),
        ("BodyGrammar", EngineLayer.MANIFESTATION),
        ("LivingCanvas", EngineLayer.MANIFESTATION),
        ("GhostCouncil", EngineLayer.CRITIQUE),
        ("BreakingEngine", EngineLayer.TRANSFORMATION),
        ("RitualFramework", EngineLayer.TRANSFORMATION),
    ]

    def orchestrate(self, artifact: CreativeArtifact) -> OrchestratorReport:
        """Run the full orchestration cascade on an artifact."""
        for engine_name, layer in self.CASCADE_ORDER:
            current_artifact = engine.process(current_artifact)
            # Insights accumulate as artifact flows through
```

**Result**: Each artifact exits with insights from all 10 engines.

---

# Slide 9: Quality Gates Between Phases

```
PHASE 1 → PHASE 2 (Foundation → Systematic Creation):
  ✓ Concept saved
  ✓ 3+ characters with score >= 70
  ✓ Characters have arcs and contradictions

PHASE 2 → PHASE 3 (Systematic → Breaking Protocol):
  ✓ 10+ scenes with score >= 70 each
  ✓ 8+ songs with score >= 70 each
  ✓ All acts complete (I, II-A, II-B)

PHASE 3 → COMPLETE (Breaking Protocol → Done):
  ✓ All transcendence criteria addressed
  ✓ Overall project validation >= 80
  ✓ No generic cultural references remain
  ✓ All antagonists have sympathetic elements
```

**Enforced by**: `validate:project` and `validate:transcendence` commands

---

# Slide 10: SLOP & ERRORS IDENTIFIED

## Issue 1: Hardcoded Absolute Paths (11 files)

```python
# Found in EVERY engine file:
import sys
sys.path.insert(0, '/home/user/PlayWright')  # BAD!
```

**Files affected**: All 11 Python engine files
**Problem**: Breaks portability, fails on any other machine
**Fix**: Use proper package structure with `__init__.py` and relative imports

---

## Issue 2: Non-Deterministic Outputs (66 occurrences)

```python
# From ghost_council.py:485
return random.choice([Vote.REVISE, Vote.REJECT])

# From breaking_engine.py:296
options = random.sample(options, min(5, len(options)))
```

**Problem**: Same input produces different outputs. Makes testing/debugging hard.
**Fix**: Add optional seed parameter for reproducibility:
```python
def process(self, artifact, seed=None):
    if seed:
        random.seed(seed)
```

---

## Issue 3: Engine Voting Logic is Naive

```python
# From ghost_council.py:456-485
def _determine_vote(self, ghost: GhostPersona, target: str) -> Vote:
    target_lower = target.lower()
    # Just checks if keywords exist in text!
    positive_count = sum(1 for signal in signals if signal in target_lower)

    if positive_count >= 2:
        return Vote.APPROVE
    elif positive_count >= 1:
        return Vote.REVISE
    else:
        return random.choice([Vote.REVISE, Vote.REJECT])  # Random fallback!
```

**Problem**: Ghost Council critique is keyword-based, not semantic
**Fix**: Integrate actual LLM calls for nuanced critique

---

## Issue 4: No Tests for Engine Logic

```bash
$ find engines -name "*test*"
# (empty)
```

**Problem**: ~8,000 lines of Python with zero unit tests
**Fix**: Add pytest suite with coverage for:
- Artifact flow through engines
- Mediocrity detection accuracy
- Orchestrator cascade ordering

---

## Issue 5: Duplicate Code in Engines

Pattern seen in multiple engines:
```python
def _generate_praise(self, ghost, target):
    praises = {
        "The Sondheim Ghost": [...],
        "The Fosse Ghost": [...],
        # 200+ lines of similar dictionaries
    }
```

**Problem**: Each engine has large inline dictionaries
**Fix**: Extract to shared YAML/JSON config files

---

# Slide 11: Architecture Strengths

## What's Done Well:

1. **Clean Abstraction Layer** - `CreativeEngine` base class is well-designed
2. **Artifact Accumulation Pattern** - Elegant way to build up insights
3. **JSON API for Agents** - Every command returns parseable JSON
4. **Quality Gates** - Enforced validation prevents bad progression
5. **Extensive Documentation** - 277 markdown files covering methodology
6. **Modular Engine Design** - Each engine is self-contained
7. **The Breaking Engine Concept** - Novel approach to avoiding mediocrity

---

# Slide 12: Summary & Recommendations

## What This Codebase Does:
- Provides a complete framework for LLM-driven musical creation
- 10 specialized engines process creative artifacts in cascade
- Quality gates ensure consistent output quality
- Designed for full autonomy with human override capability

## Priority Fixes:
| Priority | Issue | Effort |
|----------|-------|--------|
| P0 | Remove hardcoded paths | 1 hour |
| P1 | Add reproducibility seeds | 2 hours |
| P2 | Add unit test foundation | 4 hours |
| P3 | Extract config to YAML | 4 hours |
| P4 | Semantic critique integration | 8 hours |

## Key Takeaway:
> A novel architecture for creative AI assistance with solid bones but needs testing infrastructure and production hardening.

---

# Appendix: File Structure Reference

```
PlayWright/
├── engines/
│   ├── core/base_engine.py          # Foundation abstractions
│   ├── orchestrator/                 # Cascade conductor
│   ├── layer1_seeds/                 # Concept generation
│   ├── layer2_foundation/            # Character, Dream, Temporal
│   ├── layer3_translation/           # Synesthetic translation
│   ├── layer4_manifestation/         # Body, Canvas
│   ├── layer5_critique/              # Ghost Council
│   └── layer6_transformation/        # Breaking, Ritual
├── agent-harness/
│   ├── playwright-agent.js           # 80+ CLI commands
│   └── AGENT_LOOP.md                 # Agent integration guide
├── projects/                         # 9 sample musicals
├── templates/                        # 6 creation templates
└── web-app/                          # React + Express UI
```

---

*Presentation generated from codebase analysis on 2026-01-28*
