"""
Layer 3: Translation
====================

THE SYNESTHETIC TRANSLATOR

All art is ONE art wearing different masks.
Music IS color. Color IS texture. Texture IS emotion.
"""

from .synesthetic_translator import (
    SynestheticTranslator,
    SynestheticProfile,
    ColorSignature,
    MusicalKey,
    TextureSignature,
    ScentSignature,
    TasteSignature,
    SensoryMode,
    translate,
    EMOTION_TO_COLOR,
    EMOTION_TO_KEY,
    EMOTION_TO_TEXTURE,
    EMOTION_TO_SCENT,
    EMOTION_TO_TASTE,
    SCENE_ATMOSPHERES,
    RELATIONSHIP_TEXTURES
)

__all__ = [
    'SynestheticTranslator',
    'SynestheticProfile',
    'ColorSignature',
    'MusicalKey',
    'TextureSignature',
    'ScentSignature',
    'TasteSignature',
    'SensoryMode',
    'translate',
    'EMOTION_TO_COLOR',
    'EMOTION_TO_KEY',
    'EMOTION_TO_TEXTURE',
    'EMOTION_TO_SCENT',
    'EMOTION_TO_TASTE',
    'SCENE_ATMOSPHERES',
    'RELATIONSHIP_TEXTURES'
]
