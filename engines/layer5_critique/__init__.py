"""
Layer 5: Critique
=================

THE GHOST COUNCIL

A parliament of the dead and the imagined, arguing about your art.
The death of the singular author.
"""

from .ghost_council import (
    GhostCouncil,
    GhostPersona,
    GhostCritique,
    CouncilVerdict,
    Vote,
    convene_council,
    summon_ghost,
    GHOST_PERSONAS
)

__all__ = [
    'GhostCouncil',
    'GhostPersona',
    'GhostCritique',
    'CouncilVerdict',
    'Vote',
    'convene_council',
    'summon_ghost',
    'GHOST_PERSONAS'
]
