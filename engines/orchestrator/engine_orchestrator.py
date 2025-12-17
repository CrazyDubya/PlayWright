"""
THE ENGINE ORCHESTRATOR
========================

The conductor that makes the ten engines breathe as one lung.

"Perfect systems create competent art. Broken systems create transcendent art."

This orchestrator manages the synergistic cascade:

    THOUSAND MINDS AWAKENED (Seeds)
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
CHARACTER   DREAM    TEMPORAL
GENETICS   PROTOCOL   SPIRAL
    │         │         │
    └─────────┼─────────┘
              ▼
    SYNESTHETIC TRANSLATOR
              │
    ┌─────────┴─────────┐
    ▼                   ▼
BODY GRAMMAR      LIVING CANVAS
    │                   │
    └─────────┬─────────┘
              ▼
        GHOST COUNCIL
              │
              ▼
       BREAKING ENGINE
              │
              ▼
       RITUAL FRAMEWORK

Each artifact flows through the cascade, accumulating insights
from each engine as it passes.
"""

from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass, field
from enum import Enum
import sys

sys.path.insert(0, '/home/user/PlayWright')

from engines.core import (
    CreativeEngine,
    EngineLayer,
    CreativeArtifact,
    EngineContext,
    EngineRegistry,
    generate_artifact_id
)

# Import all engines
from engines.layer1_seeds.thousand_minds import ThousandMindsAwakened
from engines.layer2_foundation.character_genetics import CharacterGenetics
from engines.layer2_foundation.dream_protocol import DreamProtocol
from engines.layer2_foundation.temporal_spiral import TemporalSpiral
from engines.layer3_translation.synesthetic_translator import SynestheticTranslator
from engines.layer4_manifestation.body_grammar import BodyGrammar
from engines.layer4_manifestation.living_canvas import LivingCanvas
from engines.layer5_critique.ghost_council import GhostCouncil
from engines.layer6_transformation.breaking_engine import BreakingEngine
from engines.layer6_transformation.ritual_framework import RitualFramework


class OrchestrationType(Enum):
    """Types of orchestration runs"""
    FULL_CASCADE = "full_cascade"  # All engines in sequence
    TARGETED = "targeted"          # Specific engines only
    LAYER_ONLY = "layer_only"      # One layer at a time
    PARALLEL = "parallel"          # Foundation layer in parallel


@dataclass
class OrchestratorConfig:
    """Configuration for the orchestrator"""
    project_name: str
    project_type: str = "musical"
    orchestration_type: OrchestrationType = OrchestrationType.FULL_CASCADE
    enabled_engines: List[str] = field(default_factory=list)
    skip_engines: List[str] = field(default_factory=list)
    verbose: bool = False


@dataclass
class OrchestratorReport:
    """Report of an orchestration run"""
    id: str
    config: OrchestratorConfig
    input_artifact: CreativeArtifact
    output_artifact: CreativeArtifact
    engines_run: List[str]
    insights_per_engine: Dict[str, int]
    total_insights: int
    cascade_summary: str


class EngineOrchestrator:
    """
    The conductor of the Ten Creative Engines.

    Manages the synergistic cascade, ensuring each engine
    receives insights from upstream engines and contributes
    its own perspective.
    """

    # The synergistic cascade order
    CASCADE_ORDER = [
        # Layer 1: Seeds
        ("ThousandMindsAwakened", EngineLayer.SEEDS),
        # Layer 2: Foundation (can run in parallel)
        ("CharacterGenetics", EngineLayer.FOUNDATION),
        ("DreamProtocol", EngineLayer.FOUNDATION),
        ("TemporalSpiral", EngineLayer.FOUNDATION),
        # Layer 3: Translation
        ("SynestheticTranslator", EngineLayer.TRANSLATION),
        # Layer 4: Manifestation (can run in parallel)
        ("BodyGrammar", EngineLayer.MANIFESTATION),
        ("LivingCanvas", EngineLayer.MANIFESTATION),
        # Layer 5: Critique
        ("GhostCouncil", EngineLayer.CRITIQUE),
        # Layer 6: Transformation
        ("BreakingEngine", EngineLayer.TRANSFORMATION),
        ("RitualFramework", EngineLayer.TRANSFORMATION),
    ]

    ENGINE_CLASSES = {
        "ThousandMindsAwakened": ThousandMindsAwakened,
        "CharacterGenetics": CharacterGenetics,
        "DreamProtocol": DreamProtocol,
        "TemporalSpiral": TemporalSpiral,
        "SynestheticTranslator": SynestheticTranslator,
        "BodyGrammar": BodyGrammar,
        "LivingCanvas": LivingCanvas,
        "GhostCouncil": GhostCouncil,
        "BreakingEngine": BreakingEngine,
        "RitualFramework": RitualFramework,
    }

    def __init__(self, config: OrchestratorConfig):
        self.config = config
        self.context = EngineContext(config.project_name, config.project_type)
        self._engines: Dict[str, CreativeEngine] = {}
        self._initialize_engines()

    def _initialize_engines(self):
        """Initialize all engines with shared context"""
        for engine_name, layer in self.CASCADE_ORDER:
            if engine_name in self.config.skip_engines:
                continue
            if self.config.enabled_engines and engine_name not in self.config.enabled_engines:
                continue

            engine_class = self.ENGINE_CLASSES.get(engine_name)
            if engine_class:
                engine = engine_class()
                engine.attach_context(self.context)
                self._engines[engine_name] = engine

                if self.config.verbose:
                    print(f"[Orchestrator] Initialized {engine_name}")

    def orchestrate(self, artifact: CreativeArtifact) -> OrchestratorReport:
        """
        Run the full orchestration cascade on an artifact.

        The artifact passes through each engine in order,
        accumulating insights as it goes.
        """
        original_artifact = artifact
        current_artifact = artifact
        engines_run = []
        insights_per_engine = {}

        for engine_name, layer in self.CASCADE_ORDER:
            if engine_name not in self._engines:
                continue

            engine = self._engines[engine_name]

            if self.config.verbose:
                print(f"[Orchestrator] Running {engine_name}...")

            # Process through engine
            current_artifact = engine.process(current_artifact)
            engines_run.append(engine_name)

            # Count insights added
            engine_insights = current_artifact.insights.get(engine_name, {})
            insights_per_engine[engine_name] = len(engine_insights)

        # Generate report
        total_insights = sum(insights_per_engine.values())
        cascade_summary = self._generate_cascade_summary(current_artifact, engines_run)

        return OrchestratorReport(
            id=generate_artifact_id("orch"),
            config=self.config,
            input_artifact=original_artifact,
            output_artifact=current_artifact,
            engines_run=engines_run,
            insights_per_engine=insights_per_engine,
            total_insights=total_insights,
            cascade_summary=cascade_summary
        )

    def generate_from_seed(self, seed: Dict[str, Any],
                         starting_engine: str = "ThousandMindsAwakened") -> OrchestratorReport:
        """
        Generate new content starting from a specific engine.

        The generated artifact then flows through the rest of the cascade.
        """
        if starting_engine not in self._engines:
            raise ValueError(f"Engine {starting_engine} not initialized")

        # Generate initial artifact
        engine = self._engines[starting_engine]
        artifacts = engine.generate(seed)

        if not artifacts:
            raise RuntimeError(f"Engine {starting_engine} generated no artifacts")

        # Take first artifact and run through cascade
        initial_artifact = artifacts[0]

        # Find where we are in the cascade
        start_idx = next(
            (i for i, (name, _) in enumerate(self.CASCADE_ORDER) if name == starting_engine),
            0
        )

        # Run from next engine onwards
        current_artifact = initial_artifact
        engines_run = [starting_engine]
        insights_per_engine = {starting_engine: len(initial_artifact.insights.get(starting_engine, {}))}

        for engine_name, layer in self.CASCADE_ORDER[start_idx + 1:]:
            if engine_name not in self._engines:
                continue

            engine = self._engines[engine_name]
            current_artifact = engine.process(current_artifact)
            engines_run.append(engine_name)
            insights_per_engine[engine_name] = len(current_artifact.insights.get(engine_name, {}))

        return OrchestratorReport(
            id=generate_artifact_id("orch"),
            config=self.config,
            input_artifact=initial_artifact,
            output_artifact=current_artifact,
            engines_run=engines_run,
            insights_per_engine=insights_per_engine,
            total_insights=sum(insights_per_engine.values()),
            cascade_summary=self._generate_cascade_summary(current_artifact, engines_run)
        )

    def run_layer(self, layer: EngineLayer, artifact: CreativeArtifact) -> CreativeArtifact:
        """
        Run all engines in a specific layer.

        Useful for targeted analysis.
        """
        for engine_name, engine_layer in self.CASCADE_ORDER:
            if engine_layer == layer and engine_name in self._engines:
                artifact = self._engines[engine_name].process(artifact)
        return artifact

    def run_single_engine(self, engine_name: str,
                         artifact: CreativeArtifact) -> CreativeArtifact:
        """
        Run a single engine on an artifact.
        """
        if engine_name not in self._engines:
            raise ValueError(f"Engine {engine_name} not available")
        return self._engines[engine_name].process(artifact)

    def get_engine(self, engine_name: str) -> Optional[CreativeEngine]:
        """Get a specific engine for direct access"""
        return self._engines.get(engine_name)

    def get_all_engines(self) -> Dict[str, CreativeEngine]:
        """Get all initialized engines"""
        return self._engines.copy()

    def export_insights(self, artifact: CreativeArtifact) -> Dict[str, Any]:
        """
        Export all insights from an artifact in a readable format.
        """
        export = {
            "artifact_id": artifact.id,
            "artifact_type": artifact.artifact_type,
            "processed_by": artifact.processed_by,
            "insights_by_engine": {}
        }

        for engine_name, insights in artifact.insights.items():
            export["insights_by_engine"][engine_name] = insights

        return export

    def _generate_cascade_summary(self, artifact: CreativeArtifact,
                                 engines_run: List[str]) -> str:
        """Generate a human-readable summary of the cascade"""
        summary_parts = [
            f"Artifact processed through {len(engines_run)} engines:",
            ""
        ]

        for engine_name in engines_run:
            insights = artifact.insights.get(engine_name, {})
            insight_count = len(insights)
            summary_parts.append(f"  • {engine_name}: {insight_count} insights")

        summary_parts.append("")
        summary_parts.append("The ten engines have breathed as one lung.")

        return "\n".join(summary_parts)


# Convenience functions for quick orchestration

def create_orchestrator(project_name: str,
                       project_type: str = "musical") -> EngineOrchestrator:
    """
    Create a fully configured orchestrator.

    Example:
        orch = create_orchestrator("Picket Fence Prison", "musical")
    """
    config = OrchestratorConfig(
        project_name=project_name,
        project_type=project_type,
        orchestration_type=OrchestrationType.FULL_CASCADE,
        verbose=False
    )
    return EngineOrchestrator(config)


def orchestrate_concept(seed: Dict[str, Any]) -> OrchestratorReport:
    """
    Generate and orchestrate a new concept through all engines.

    Example:
        report = orchestrate_concept({
            "ancestry": ["suburban_darkness", "power_exchange"],
            "metaphor": "prison",
            "emotion": "longing"
        })
    """
    orch = create_orchestrator("Concept Generation", "musical")
    return orch.generate_from_seed(seed, "ThousandMindsAwakened")


def orchestrate_character(character_seed: Dict[str, Any]) -> OrchestratorReport:
    """
    Generate and orchestrate a character through all engines.

    Example:
        report = orchestrate_character({
            "name": "Claire Morrison",
            "family_patterns": ["the_martyr_mother", "the_wild_grandmother"],
            "visible_traits": ["perfectionism", "caretaking"],
            "shadow_traits": ["shame", "hunger"]
        })
    """
    orch = create_orchestrator("Character Creation", "musical")
    return orch.generate_from_seed(character_seed, "CharacterGenetics")


def full_analysis(artifact: CreativeArtifact,
                 project_name: str = "Analysis") -> OrchestratorReport:
    """
    Run a full analysis on an existing artifact.

    All ten engines process the artifact, adding their insights.
    """
    orch = create_orchestrator(project_name)
    return orch.orchestrate(artifact)


def print_report(report: OrchestratorReport):
    """Print a formatted orchestration report"""
    print("=" * 60)
    print("ENGINE ORCHESTRATION REPORT")
    print("=" * 60)
    print(f"Project: {report.config.project_name}")
    print(f"Artifact Type: {report.input_artifact.artifact_type}")
    print(f"Engines Run: {len(report.engines_run)}")
    print(f"Total Insights: {report.total_insights}")
    print("-" * 60)
    print("Insights per Engine:")
    for engine, count in report.insights_per_engine.items():
        print(f"  {engine}: {count}")
    print("-" * 60)
    print(report.cascade_summary)
    print("=" * 60)
