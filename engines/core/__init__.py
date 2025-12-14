"""
Core Engine Infrastructure
===========================

The foundational abstractions for PlayWright's Ten Creative Engines.
"""

from .base_engine import (
    EngineLayer,
    CreativeArtifact,
    EngineContext,
    CreativeEngine,
    EngineRegistry,
    generate_artifact_id
)

__all__ = [
    'EngineLayer',
    'CreativeArtifact',
    'EngineContext',
    'CreativeEngine',
    'EngineRegistry',
    'generate_artifact_id'
]
