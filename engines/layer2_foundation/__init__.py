"""
Layer 2: Foundation
===================

The DNA layer - where characters, dreams, and time take form.

- CHARACTER GENETICS: DNA foundation for characters
- DREAM PROTOCOL: Unconscious access
- TEMPORAL SPIRAL: Time bending
"""

from .character_genetics import (
    CharacterGenetics,
    Character,
    CharacterDNA,
    CharacterHelix,
    CharacterTrait,
    TraumaMarker,
    FamilyMember,
    TraitCategory,
    create_character,
    FAMILY_PATTERNS,
    VISIBLE_TRAIT_LIBRARY,
    SHADOW_TRAIT_LIBRARY
)

from .dream_protocol import (
    DreamProtocol,
    DreamSequence,
    DreamImage,
    SymbolicAssociation,
    DreamLogicMode,
    dream_for,
    automatic_writing,
    ARCHETYPAL_IMAGES,
    SYMBOLIC_SUBSTITUTIONS,
    COLLECTIVE_PATTERNS
)

from .temporal_spiral import (
    TemporalSpiral,
    TemporalShape,
    TimeSignature,
    EchoScene,
    MemoryBleed,
    ProphecyLoop,
    TraumaStutter,
    GenerationCollapse,
    create_echo,
    TIME_SIGNATURE_MEANINGS
)

__all__ = [
    # Character Genetics
    'CharacterGenetics',
    'Character',
    'CharacterDNA',
    'CharacterHelix',
    'CharacterTrait',
    'TraumaMarker',
    'FamilyMember',
    'TraitCategory',
    'create_character',
    'FAMILY_PATTERNS',
    'VISIBLE_TRAIT_LIBRARY',
    'SHADOW_TRAIT_LIBRARY',

    # Dream Protocol
    'DreamProtocol',
    'DreamSequence',
    'DreamImage',
    'SymbolicAssociation',
    'DreamLogicMode',
    'dream_for',
    'automatic_writing',
    'ARCHETYPAL_IMAGES',
    'SYMBOLIC_SUBSTITUTIONS',
    'COLLECTIVE_PATTERNS',

    # Temporal Spiral
    'TemporalSpiral',
    'TemporalShape',
    'TimeSignature',
    'EchoScene',
    'MemoryBleed',
    'ProphecyLoop',
    'TraumaStutter',
    'GenerationCollapse',
    'create_echo',
    'TIME_SIGNATURE_MEANINGS'
]
