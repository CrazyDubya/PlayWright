"""
THE TEN CREATIVE ENGINES
========================

"Perfect systems create competent art. Broken systems create transcendent art."

PlayWright's Ten Creative Engines transform the creative process from
tool-based to organism-based - each engine a different way of seeing,
creating, and breaking.

The Synergy Cascade:
-------------------

    Layer 1 (Seeds):        THOUSAND MINDS AWAKENED
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
    Layer 2:    CHARACTER       DREAM          TEMPORAL
                GENETICS       PROTOCOL         SPIRAL
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
    Layer 3:            SYNESTHETIC TRANSLATOR
                                    │
                        ┌───────────┴───────────┐
                        ▼                       ▼
    Layer 4:        BODY GRAMMAR         LIVING CANVAS
                        │                       │
                        └───────────┬───────────┘
                                    ▼
    Layer 5:               GHOST COUNCIL
                                    │
                                    ▼
    Layer 6:             BREAKING ENGINE
                                    │
                                    ▼
    Apex:               RITUAL FRAMEWORK

The ten engines breathing as one lung.
"""

__version__ = "1.0.0"
__author__ = "PlayWright Creative Systems"

# Core Infrastructure
from .core import (
    EngineLayer,
    CreativeArtifact,
    EngineContext,
    CreativeEngine,
    EngineRegistry,
    generate_artifact_id
)

# Layer 1: Seeds
from .layer1_seeds import (
    ThousandMindsAwakened,
    MusicalConcept,
    ConceptDNA,
    awaken_minds
)

# Layer 2: Foundation
from .layer2_foundation import (
    CharacterGenetics,
    Character,
    CharacterDNA,
    create_character,
    DreamProtocol,
    DreamSequence,
    dream_for,
    automatic_writing,
    TemporalSpiral,
    EchoScene,
    create_echo
)

# Layer 3: Translation
from .layer3_translation import (
    SynestheticTranslator,
    SynestheticProfile,
    translate
)

# Layer 4: Manifestation
from .layer4_manifestation import (
    BodyGrammar,
    BodyProfile,
    embody,
    LivingCanvas,
    CanvasState,
    visualize
)

# Layer 5: Critique
from .layer5_critique import (
    GhostCouncil,
    GhostCritique,
    CouncilVerdict,
    convene_council,
    summon_ghost,
    GHOST_PERSONAS
)

# Layer 6: Transformation
from .layer6_transformation import (
    BreakingEngine,
    BreakingReport,
    ChaosVector,
    break_analysis,
    inject_chaos_into,
    RitualFramework,
    RitualStructure,
    design_ritual_for
)

# Orchestrator
from .orchestrator import (
    EngineOrchestrator,
    OrchestratorConfig,
    OrchestratorReport,
    create_orchestrator,
    orchestrate_concept,
    orchestrate_character,
    full_analysis,
    print_report
)

__all__ = [
    # Core
    'EngineLayer',
    'CreativeArtifact',
    'EngineContext',
    'CreativeEngine',
    'EngineRegistry',
    'generate_artifact_id',

    # Layer 1: Seeds
    'ThousandMindsAwakened',
    'MusicalConcept',
    'ConceptDNA',
    'awaken_minds',

    # Layer 2: Foundation
    'CharacterGenetics',
    'Character',
    'CharacterDNA',
    'create_character',
    'DreamProtocol',
    'DreamSequence',
    'dream_for',
    'automatic_writing',
    'TemporalSpiral',
    'EchoScene',
    'create_echo',

    # Layer 3: Translation
    'SynestheticTranslator',
    'SynestheticProfile',
    'translate',

    # Layer 4: Manifestation
    'BodyGrammar',
    'BodyProfile',
    'embody',
    'LivingCanvas',
    'CanvasState',
    'visualize',

    # Layer 5: Critique
    'GhostCouncil',
    'GhostCritique',
    'CouncilVerdict',
    'convene_council',
    'summon_ghost',
    'GHOST_PERSONAS',

    # Layer 6: Transformation
    'BreakingEngine',
    'BreakingReport',
    'ChaosVector',
    'break_analysis',
    'inject_chaos_into',
    'RitualFramework',
    'RitualStructure',
    'design_ritual_for',

    # Orchestrator
    'EngineOrchestrator',
    'OrchestratorConfig',
    'OrchestratorReport',
    'create_orchestrator',
    'orchestrate_concept',
    'orchestrate_character',
    'full_analysis',
    'print_report',
]
