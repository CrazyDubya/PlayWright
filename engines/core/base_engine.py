"""
THE TEN CREATIVE ENGINES - Base Architecture
=============================================

"Perfect systems create competent art. Broken systems create transcendent art."

This module defines the foundational abstractions for all ten creative engines.
Each engine is a different way of seeing, creating, and breaking.

The engines don't compete - they compound.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional, Callable
from enum import Enum
import json
from datetime import datetime


class EngineLayer(Enum):
    """The synergistic cascade of engine layers"""
    SEEDS = 1          # Thousand Minds Awakened
    FOUNDATION = 2     # Character Genetics, Dream Protocol, Temporal Spiral
    TRANSLATION = 3    # Synesthetic Translator
    MANIFESTATION = 4  # Body Grammar, Living Canvas
    CRITIQUE = 5       # Ghost Council
    TRANSFORMATION = 6 # Breaking Engine, Ritual Framework


@dataclass
class CreativeArtifact:
    """
    A unit of creative output that flows between engines.
    Artifacts accumulate insights as they pass through the cascade.
    """
    id: str
    artifact_type: str  # concept, character, scene, song, etc.
    content: Dict[str, Any]
    insights: Dict[str, Any] = field(default_factory=dict)
    source_engine: Optional[str] = None
    processed_by: List[str] = field(default_factory=list)
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())

    def add_insight(self, engine_name: str, insight_key: str, insight_value: Any):
        """Add an insight from an engine's processing"""
        if engine_name not in self.insights:
            self.insights[engine_name] = {}
        self.insights[engine_name][insight_key] = insight_value
        if engine_name not in self.processed_by:
            self.processed_by.append(engine_name)

    def get_insight(self, engine_name: str, insight_key: str) -> Any:
        """Retrieve a specific insight"""
        return self.insights.get(engine_name, {}).get(insight_key)

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'artifact_type': self.artifact_type,
            'content': self.content,
            'insights': self.insights,
            'source_engine': self.source_engine,
            'processed_by': self.processed_by,
            'created_at': self.created_at
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'CreativeArtifact':
        return cls(
            id=data['id'],
            artifact_type=data['artifact_type'],
            content=data['content'],
            insights=data.get('insights', {}),
            source_engine=data.get('source_engine'),
            processed_by=data.get('processed_by', []),
            created_at=data.get('created_at', datetime.now().isoformat())
        )


@dataclass
class EngineContext:
    """
    Shared context that flows through all engines.
    Contains the project state and accumulated wisdom.
    """
    project_name: str
    project_type: str  # musical, play, screenplay, etc.
    artifacts: Dict[str, CreativeArtifact] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)
    engine_states: Dict[str, Dict[str, Any]] = field(default_factory=dict)

    def add_artifact(self, artifact: CreativeArtifact):
        self.artifacts[artifact.id] = artifact

    def get_artifacts_by_type(self, artifact_type: str) -> List[CreativeArtifact]:
        return [a for a in self.artifacts.values() if a.artifact_type == artifact_type]

    def set_engine_state(self, engine_name: str, key: str, value: Any):
        if engine_name not in self.engine_states:
            self.engine_states[engine_name] = {}
        self.engine_states[engine_name][key] = value

    def get_engine_state(self, engine_name: str, key: str) -> Any:
        return self.engine_states.get(engine_name, {}).get(key)


class CreativeEngine(ABC):
    """
    Abstract base class for all creative engines.

    Each engine:
    - Has a specific layer in the cascade
    - Can process artifacts and add insights
    - Can generate new artifacts
    - Can query insights from engines in lower layers
    """

    def __init__(self, name: str, layer: EngineLayer):
        self.name = name
        self.layer = layer
        self._context: Optional[EngineContext] = None
        self._dependencies: List[str] = []

    @property
    def context(self) -> EngineContext:
        if self._context is None:
            raise RuntimeError(f"Engine {self.name} has no context attached")
        return self._context

    def attach_context(self, context: EngineContext):
        """Attach a shared context to this engine"""
        self._context = context

    def depends_on(self, *engine_names: str):
        """Declare dependencies on other engines"""
        self._dependencies.extend(engine_names)

    @abstractmethod
    def process(self, artifact: CreativeArtifact) -> CreativeArtifact:
        """
        Process an artifact through this engine.
        Returns the artifact with added insights.
        """
        pass

    @abstractmethod
    def generate(self, seed: Optional[Dict[str, Any]] = None) -> List[CreativeArtifact]:
        """
        Generate new artifacts from this engine.
        Optionally seeded with input parameters.
        """
        pass

    def get_upstream_insights(self, artifact: CreativeArtifact, engine_name: str) -> Dict[str, Any]:
        """Get insights from an upstream engine that has processed this artifact"""
        return artifact.insights.get(engine_name, {})

    def _log(self, message: str):
        """Internal logging"""
        print(f"[{self.name}] {message}")


class EngineRegistry:
    """
    Registry of all creative engines.
    Manages engine instantiation and dependency resolution.
    """

    _engines: Dict[str, CreativeEngine] = {}
    _engine_classes: Dict[str, type] = {}

    @classmethod
    def register(cls, engine_class: type):
        """Decorator to register an engine class"""
        cls._engine_classes[engine_class.__name__] = engine_class
        return engine_class

    @classmethod
    def instantiate(cls, engine_name: str, context: EngineContext) -> CreativeEngine:
        """Create an instance of a registered engine"""
        if engine_name not in cls._engine_classes:
            raise ValueError(f"Unknown engine: {engine_name}")

        if engine_name not in cls._engines:
            engine = cls._engine_classes[engine_name]()
            engine.attach_context(context)
            cls._engines[engine_name] = engine

        return cls._engines[engine_name]

    @classmethod
    def get_engine(cls, engine_name: str) -> Optional[CreativeEngine]:
        """Get an instantiated engine by name"""
        return cls._engines.get(engine_name)

    @classmethod
    def get_engines_by_layer(cls, layer: EngineLayer) -> List[CreativeEngine]:
        """Get all engines in a specific layer"""
        return [e for e in cls._engines.values() if e.layer == layer]

    @classmethod
    def clear(cls):
        """Clear all instantiated engines"""
        cls._engines.clear()


# Utility functions for generating unique IDs
def generate_artifact_id(prefix: str = "art") -> str:
    """Generate a unique artifact ID"""
    import uuid
    return f"{prefix}_{uuid.uuid4().hex[:8]}"


# Export core components
__all__ = [
    'EngineLayer',
    'CreativeArtifact',
    'EngineContext',
    'CreativeEngine',
    'EngineRegistry',
    'generate_artifact_id'
]
