"""
THE SYNESTHETIC TRANSLATOR
===========================

Layer 3: Sensory Skin

"Recognition that all art is ONE art, wearing different masks.
Music IS color. Color IS texture. Texture IS emotion."

Art is not about ideas - it's about sensations that SUGGEST ideas.
The Translator makes feelings designable.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional, Tuple
from enum import Enum
import random

import sys
sys.path.insert(0, '/home/user/PlayWright')
from engines.core import (
    CreativeEngine,
    EngineLayer,
    CreativeArtifact,
    EngineRegistry,
    generate_artifact_id
)


class SensoryMode(Enum):
    """Modes of sensory experience"""
    VISUAL = "visual"      # Color, light, shape
    AUDITORY = "auditory"  # Sound, music, silence
    TACTILE = "tactile"    # Texture, temperature, pressure
    OLFACTORY = "olfactory"  # Scent, smell
    GUSTATORY = "gustatory"  # Taste
    KINESTHETIC = "kinesthetic"  # Movement, body sensation


@dataclass
class ColorSignature:
    """Color profile for an element"""
    surface_color: str
    shadow_color: str
    accent_color: str
    temperature: str  # warm, cool, neutral
    saturation: str   # vibrant, muted, desaturated
    description: str


@dataclass
class MusicalKey:
    """Musical key signature for an element"""
    primary_key: str
    shadow_key: str
    transition_interval: str
    emotional_quality: str
    tempo_tendency: str
    description: str


@dataclass
class TextureSignature:
    """Tactile texture for an element"""
    surface_texture: str
    shadow_texture: str
    temperature: str
    weight: str
    description: str


@dataclass
class ScentSignature:
    """Olfactory profile for an element"""
    surface_scent: str
    shadow_scent: str
    memory_scent: str  # What it reminds them of
    description: str


@dataclass
class TasteSignature:
    """Gustatory profile for an element"""
    surface_taste: str
    shadow_taste: str
    aftertaste: str
    description: str


@dataclass
class SynestheticProfile:
    """Complete synesthetic profile for an element"""
    id: str
    element_name: str
    element_type: str  # character, scene, relationship, moment
    color: ColorSignature
    music: MusicalKey
    texture: TextureSignature
    scent: ScentSignature
    taste: TasteSignature
    design_notes: Dict[str, str]


# Translation matrices - how elements map across senses

EMOTION_TO_COLOR = {
    "guilt": {"surface": "burgundy", "shadow": "ash gray", "accent": "black"},
    "shame": {"surface": "beige", "shadow": "arterial crimson", "accent": "raw umber"},
    "joy": {"surface": "golden yellow", "shadow": "deep amber", "accent": "white"},
    "grief": {"surface": "slate blue", "shadow": "black", "accent": "silver"},
    "rage": {"surface": "crimson", "shadow": "blood red", "accent": "orange flame"},
    "longing": {"surface": "indigo", "shadow": "midnight blue", "accent": "pale gold"},
    "fear": {"surface": "pale green", "shadow": "sickly yellow", "accent": "white"},
    "ecstasy": {"surface": "magenta", "shadow": "deep purple", "accent": "electric blue"},
    "despair": {"surface": "charcoal", "shadow": "void black", "accent": "none"},
    "hope": {"surface": "dawn pink", "shadow": "rose", "accent": "golden light"},
    "love": {"surface": "rose gold", "shadow": "deep red", "accent": "cream"},
    "disgust": {"surface": "bile green", "shadow": "brown", "accent": "yellow"},
    "numbness": {"surface": "gray", "shadow": "darker gray", "accent": "none"}
}

EMOTION_TO_KEY = {
    "guilt": {"primary": "E minor", "shadow": "C minor", "interval": "minor third"},
    "shame": {"primary": "C major", "shadow": "F# minor", "interval": "tritone (devil's interval)"},
    "joy": {"primary": "D major", "shadow": "B minor", "interval": "major sixth"},
    "grief": {"primary": "G minor", "shadow": "E-flat minor", "interval": "minor second"},
    "rage": {"primary": "B-flat minor", "shadow": "F minor", "interval": "perfect fifth"},
    "longing": {"primary": "A minor", "shadow": "D minor", "interval": "perfect fourth"},
    "fear": {"primary": "F minor", "shadow": "B diminished", "interval": "tritone"},
    "ecstasy": {"primary": "A major", "shadow": "F# major", "interval": "major third"},
    "despair": {"primary": "C minor", "shadow": "F minor", "interval": "perfect fourth down"},
    "hope": {"primary": "G major", "shadow": "E minor", "interval": "relative minor"},
    "love": {"primary": "F major", "shadow": "D minor", "interval": "relative minor"},
    "numbness": {"primary": "no key", "shadow": "atonal", "interval": "none"}
}

EMOTION_TO_TEXTURE = {
    "guilt": {"surface": "heavy wool", "shadow": "sandpaper"},
    "shame": {"surface": "Egyptian cotton", "shadow": "raw silk snagging"},
    "joy": {"surface": "silk", "shadow": "velvet"},
    "grief": {"surface": "wet wool", "shadow": "rough stone"},
    "rage": {"surface": "broken glass", "shadow": "fire"},
    "longing": {"surface": "empty hands", "shadow": "phantom touch"},
    "fear": {"surface": "cold metal", "shadow": "spider web"},
    "ecstasy": {"surface": "warm skin", "shadow": "electricity"},
    "despair": {"surface": "mud", "shadow": "nothing"},
    "hope": {"surface": "morning dew", "shadow": "new growth"},
    "love": {"surface": "warm hands", "shadow": "heartbeat"},
    "numbness": {"surface": "nothing", "shadow": "absence"}
}

EMOTION_TO_SCENT = {
    "guilt": {"surface": "iron (blood)", "shadow": "old flowers"},
    "shame": {"surface": "artificial freshness", "shadow": "sweat"},
    "joy": {"surface": "fresh bread", "shadow": "celebration"},
    "grief": {"surface": "rain on stone", "shadow": "empty room"},
    "rage": {"surface": "smoke", "shadow": "burning"},
    "longing": {"surface": "familiar perfume", "shadow": "empty pillow"},
    "fear": {"surface": "cold sweat", "shadow": "copper"},
    "ecstasy": {"surface": "jasmine", "shadow": "musk"},
    "despair": {"surface": "nothing", "shadow": "decay"},
    "hope": {"surface": "spring morning", "shadow": "possibility"},
    "love": {"surface": "their skin", "shadow": "home"},
    "numbness": {"surface": "nothing", "shadow": "absence of scent"}
}

EMOTION_TO_TASTE = {
    "guilt": {"surface": "bitter", "shadow": "blood"},
    "shame": {"surface": "bile", "shadow": "ash"},
    "joy": {"surface": "honey", "shadow": "champagne"},
    "grief": {"surface": "salt (tears)", "shadow": "nothing"},
    "rage": {"surface": "metal", "shadow": "fire"},
    "longing": {"surface": "remembered sweetness", "shadow": "hunger"},
    "fear": {"surface": "copper", "shadow": "acid"},
    "ecstasy": {"surface": "intoxication", "shadow": "sweetness"},
    "despair": {"surface": "nothing", "shadow": "dust"},
    "hope": {"surface": "fresh water", "shadow": "possibility"},
    "love": {"surface": "their lips", "shadow": "salt and sweet"},
    "numbness": {"surface": "nothing", "shadow": "absence"}
}

# Scene atmosphere translations
SCENE_ATMOSPHERES = {
    "interrogation": {
        "color": "harsh fluorescent blue, dirty yellow",
        "texture": "cold metal chair, sweating skin",
        "scent": "cold coffee and flop sweat",
        "taste": "stale water, fear",
        "sound": "buzzing lights, silence, sudden voices"
    },
    "love_scene": {
        "color": "warm amber, rose, intimate shadows",
        "texture": "skin on skin, sheets, breath",
        "scent": "jasmine and copper (perfume and blood)",
        "taste": "salt and sweetness",
        "sound": "breathing, whispers, fabric"
    },
    "revelation": {
        "color": "sudden white light into darkness",
        "texture": "ground giving way",
        "scent": "ozone (lightning)",
        "taste": "salt on a wound, followed by honey",
        "sound": "silence before, roaring after"
    },
    "domestic_prison": {
        "color": "beige, gray, artificial brightness",
        "texture": "Egyptian cotton suffocation, polished surfaces",
        "scent": "Glade PlugIns, artificial lemon",
        "taste": "Pinot Grigio (acceptable, forgettable)",
        "sound": "appliances humming, distant TV"
    },
    "awakening": {
        "color": "crimson bleeding through beige",
        "texture": "raw silk, rope burn, willing surrender",
        "scent": "leather and sweat, own skin finally",
        "taste": "whiskey neat, then salt",
        "sound": "heartbeat, command, breath"
    }
}

# Relationship texture translations
RELATIONSHIP_TEXTURES = {
    "romance_early": "raw silk snagging on splinters",
    "romance_deep": "worn leather, knowing hands",
    "betrayal": "broken glass underfoot",
    "longing": "empty arms, phantom warmth",
    "power_exchange": "rope and silk, pressure and release",
    "resentment": "grinding sand",
    "obligation": "heavy chains, worn smooth",
    "passion": "fire and skin",
    "numbness": "nothing touching nothing"
}


@EngineRegistry.register
class SynestheticTranslator(CreativeEngine):
    """
    The Synesthetic Translator Engine - sensory skin on everything.

    Translates between sensory modes to make feelings designable.
    All art is ONE art wearing different masks.
    """

    def __init__(self):
        super().__init__("SynestheticTranslator", EngineLayer.TRANSLATION)
        self._profiles: Dict[str, SynestheticProfile] = {}
        self.depends_on("CharacterGenetics", "DreamProtocol", "TemporalSpiral")

    def process(self, artifact: CreativeArtifact) -> CreativeArtifact:
        """
        Process an artifact through synesthetic translation.
        Add sensory layers to abstract content.
        """
        # Get upstream insights
        genetics_insights = self.get_upstream_insights(artifact, "CharacterGenetics")
        dream_insights = self.get_upstream_insights(artifact, "DreamProtocol")

        # Generate color palette
        colors = self._generate_color_palette(artifact, genetics_insights)
        artifact.add_insight(self.name, "color_palette", colors)

        # Generate musical key
        music = self._generate_musical_key(artifact, genetics_insights)
        artifact.add_insight(self.name, "musical_key", music)

        # Generate texture profile
        texture = self._generate_texture_profile(artifact, genetics_insights)
        artifact.add_insight(self.name, "texture_profile", texture)

        # Generate scent signature
        scent = self._generate_scent_signature(artifact, dream_insights)
        artifact.add_insight(self.name, "scent_signature", scent)

        # Generate scene design export
        design = self._generate_design_export(artifact)
        artifact.add_insight(self.name, "design_export", design)

        return artifact

    def generate(self, seed: Optional[Dict[str, Any]] = None) -> List[CreativeArtifact]:
        """
        Generate synesthetic profile.

        Seed parameters:
        - element_name: name of character/scene/relationship
        - element_type: 'character', 'scene', 'relationship', 'moment'
        - primary_emotion: dominant emotional quality
        - shadow_emotion: hidden emotional quality
        """
        seed = seed or {}
        element_name = seed.get("element_name", "Unknown Element")
        element_type = seed.get("element_type", "character")
        primary_emotion = seed.get("primary_emotion", "longing")
        shadow_emotion = seed.get("shadow_emotion", "shame")

        profile = self.create_profile(element_name, element_type, primary_emotion, shadow_emotion)
        return [self._profile_to_artifact(profile)]

    def create_profile(self, name: str, element_type: str,
                      primary_emotion: str, shadow_emotion: str) -> SynestheticProfile:
        """
        Create complete synesthetic profile for an element.

        Example:
            profile = create_profile(
                "Claire Morrison", "character",
                primary_emotion="numbness",
                shadow_emotion="hunger"
            )
        """
        # Translate to color
        primary_colors = EMOTION_TO_COLOR.get(primary_emotion, EMOTION_TO_COLOR["longing"])
        shadow_colors = EMOTION_TO_COLOR.get(shadow_emotion, EMOTION_TO_COLOR["shame"])

        color_sig = ColorSignature(
            surface_color=primary_colors["surface"],
            shadow_color=shadow_colors["shadow"],
            accent_color=shadow_colors["accent"],
            temperature=self._determine_temperature(primary_emotion),
            saturation=self._determine_saturation(primary_emotion),
            description=f"{name}'s color world: {primary_colors['surface']} surface hiding {shadow_colors['shadow']}"
        )

        # Translate to music
        primary_keys = EMOTION_TO_KEY.get(primary_emotion, EMOTION_TO_KEY["longing"])
        shadow_keys = EMOTION_TO_KEY.get(shadow_emotion, EMOTION_TO_KEY["shame"])

        music_sig = MusicalKey(
            primary_key=primary_keys["primary"],
            shadow_key=shadow_keys["shadow"],
            transition_interval=shadow_keys["interval"],
            emotional_quality=f"{primary_emotion} surface, {shadow_emotion} depths",
            tempo_tendency=self._emotion_to_tempo(primary_emotion),
            description=f"{name} IS {primary_keys['primary']} trying to modulate to {shadow_keys['shadow']}"
        )

        # Translate to texture
        primary_textures = EMOTION_TO_TEXTURE.get(primary_emotion, EMOTION_TO_TEXTURE["longing"])
        shadow_textures = EMOTION_TO_TEXTURE.get(shadow_emotion, EMOTION_TO_TEXTURE["shame"])

        texture_sig = TextureSignature(
            surface_texture=primary_textures["surface"],
            shadow_texture=shadow_textures["shadow"],
            temperature=self._determine_temperature(primary_emotion),
            weight=self._emotion_to_weight(primary_emotion),
            description=f"{name}'s touch: {primary_textures['surface']} that dreams of {shadow_textures['shadow']}"
        )

        # Translate to scent
        primary_scents = EMOTION_TO_SCENT.get(primary_emotion, EMOTION_TO_SCENT["longing"])
        shadow_scents = EMOTION_TO_SCENT.get(shadow_emotion, EMOTION_TO_SCENT["shame"])

        scent_sig = ScentSignature(
            surface_scent=primary_scents["surface"],
            shadow_scent=shadow_scents["shadow"],
            memory_scent=f"What {name} remembers",
            description=f"{name}'s scent world: {primary_scents['surface']} masking {shadow_scents['shadow']}"
        )

        # Translate to taste
        primary_tastes = EMOTION_TO_TASTE.get(primary_emotion, EMOTION_TO_TASTE["longing"])
        shadow_tastes = EMOTION_TO_TASTE.get(shadow_emotion, EMOTION_TO_TASTE["shame"])

        taste_sig = TasteSignature(
            surface_taste=primary_tastes["surface"],
            shadow_taste=shadow_tastes["shadow"],
            aftertaste=f"leaves {shadow_tastes['shadow']} on the tongue",
            description=f"{name} tastes like {primary_tastes['surface']} until the {shadow_tastes['shadow']} emerges"
        )

        # Generate design notes
        design_notes = self._generate_design_notes(name, element_type, color_sig, music_sig)

        profile = SynestheticProfile(
            id=generate_artifact_id("synth"),
            element_name=name,
            element_type=element_type,
            color=color_sig,
            music=music_sig,
            texture=texture_sig,
            scent=scent_sig,
            taste=taste_sig,
            design_notes=design_notes
        )

        self._profiles[profile.id] = profile
        return profile

    def translate_emotion_to_color(self, emotion: str) -> Dict[str, str]:
        """Translate an emotion to color palette"""
        return EMOTION_TO_COLOR.get(emotion.lower(), EMOTION_TO_COLOR["longing"])

    def translate_emotion_to_key(self, emotion: str) -> Dict[str, str]:
        """Translate an emotion to musical key"""
        return EMOTION_TO_KEY.get(emotion.lower(), EMOTION_TO_KEY["longing"])

    def translate_character_to_key(self, character_name: str,
                                  primary_trait: str,
                                  shadow_trait: str) -> str:
        """
        Generate musical key description for character.

        Example:
            key = translate_character_to_key(
                "Mickey", "charm", "guilt"
            )
            # Returns: "Mickey IS E minor - every song pulls toward it"
        """
        primary_keys = EMOTION_TO_KEY.get(primary_trait.lower(), EMOTION_TO_KEY["longing"])
        shadow_keys = EMOTION_TO_KEY.get(shadow_trait.lower(), EMOTION_TO_KEY["shame"])

        return f"{character_name} IS {primary_keys['primary']} - every song pulls toward it. " \
               f"But the shadow of {shadow_keys['shadow']} creates a {shadow_keys['interval']} tension."

    def translate_relationship_to_texture(self, relationship_type: str) -> str:
        """Translate relationship type to texture"""
        return RELATIONSHIP_TEXTURES.get(relationship_type.lower(),
                                        "unknown texture - describe this relationship first")

    def translate_scene_to_atmosphere(self, scene_type: str) -> Dict[str, str]:
        """Get full atmospheric design for scene type"""
        return SCENE_ATMOSPHERES.get(scene_type.lower(), {
            "color": "neutral tones",
            "texture": "ordinary surfaces",
            "scent": "ambient",
            "taste": "nothing notable",
            "sound": "ambient noise"
        })

    def design_transition(self, from_emotion: str, to_emotion: str) -> Dict[str, Any]:
        """
        Design the sensory transition between emotional states.

        Example: The moment Claire's numbness cracks open into hunger
        """
        from_colors = EMOTION_TO_COLOR.get(from_emotion.lower(), EMOTION_TO_COLOR["numbness"])
        to_colors = EMOTION_TO_COLOR.get(to_emotion.lower(), EMOTION_TO_COLOR["longing"])

        from_keys = EMOTION_TO_KEY.get(from_emotion.lower(), EMOTION_TO_KEY["numbness"])
        to_keys = EMOTION_TO_KEY.get(to_emotion.lower(), EMOTION_TO_KEY["longing"])

        from_textures = EMOTION_TO_TEXTURE.get(from_emotion.lower(), EMOTION_TO_TEXTURE["numbness"])
        to_textures = EMOTION_TO_TEXTURE.get(to_emotion.lower(), EMOTION_TO_TEXTURE["longing"])

        return {
            "transition_name": f"{from_emotion} → {to_emotion}",
            "color_shift": f"{from_colors['surface']} dissolving into {to_colors['surface']}",
            "musical_modulation": f"{from_keys['primary']} to {to_keys['primary']} via {to_keys['interval']}",
            "texture_change": f"{from_textures['surface']} gives way to {to_textures['surface']}",
            "lighting_note": f"Begin in {self._determine_temperature(from_emotion)} light, " \
                           f"shift to {self._determine_temperature(to_emotion)}",
            "costume_note": f"Fabrics should feel like {from_textures['surface']} becoming {to_textures['surface']}"
        }

    def export_design_package(self, profile: SynestheticProfile) -> Dict[str, Any]:
        """
        Export a complete design package for production.
        """
        return {
            "element": profile.element_name,
            "type": profile.element_type,
            "for_lighting_designer": {
                "primary_color": profile.color.surface_color,
                "shadow_color": profile.color.shadow_color,
                "accent": profile.color.accent_color,
                "temperature": profile.color.temperature,
                "saturation": profile.color.saturation
            },
            "for_music_director": {
                "primary_key": profile.music.primary_key,
                "shadow_key": profile.music.shadow_key,
                "transition_interval": profile.music.transition_interval,
                "tempo": profile.music.tempo_tendency,
                "emotional_journey": profile.music.emotional_quality
            },
            "for_costume_designer": {
                "surface_texture": profile.texture.surface_texture,
                "hidden_texture": profile.texture.shadow_texture,
                "color_palette": f"{profile.color.surface_color}, {profile.color.shadow_color}",
                "temperature": profile.texture.temperature,
                "weight": profile.texture.weight
            },
            "for_sound_designer": {
                "ambient_scent_to_evoke": profile.scent.surface_scent,
                "shadow_scent": profile.scent.shadow_scent,
                "key_signature": profile.music.primary_key
            },
            "for_director": {
                "overall_feel": profile.color.description,
                "musical_character": profile.music.description,
                "physical_quality": profile.texture.description
            }
        }

    def _generate_color_palette(self, artifact: CreativeArtifact,
                               genetics_insights: Dict[str, Any]) -> Dict[str, str]:
        """Generate color palette from artifact"""
        # Try to extract emotion from content
        content_str = str(artifact.content).lower()
        primary_emotion = "longing"  # default

        for emotion in EMOTION_TO_COLOR.keys():
            if emotion in content_str:
                primary_emotion = emotion
                break

        colors = EMOTION_TO_COLOR[primary_emotion]
        return {
            "primary": colors["surface"],
            "shadow": colors["shadow"],
            "accent": colors["accent"],
            "derived_from": primary_emotion
        }

    def _generate_musical_key(self, artifact: CreativeArtifact,
                            genetics_insights: Dict[str, Any]) -> Dict[str, str]:
        """Generate musical key from artifact"""
        content_str = str(artifact.content).lower()
        primary_emotion = "longing"

        for emotion in EMOTION_TO_KEY.keys():
            if emotion in content_str:
                primary_emotion = emotion
                break

        keys = EMOTION_TO_KEY[primary_emotion]
        return {
            "primary_key": keys["primary"],
            "shadow_key": keys["shadow"],
            "interval": keys["interval"],
            "derived_from": primary_emotion
        }

    def _generate_texture_profile(self, artifact: CreativeArtifact,
                                 genetics_insights: Dict[str, Any]) -> Dict[str, str]:
        """Generate texture profile from artifact"""
        content_str = str(artifact.content).lower()
        primary_emotion = "longing"

        for emotion in EMOTION_TO_TEXTURE.keys():
            if emotion in content_str:
                primary_emotion = emotion
                break

        textures = EMOTION_TO_TEXTURE[primary_emotion]
        return {
            "surface": textures["surface"],
            "shadow": textures["shadow"],
            "derived_from": primary_emotion
        }

    def _generate_scent_signature(self, artifact: CreativeArtifact,
                                 dream_insights: Dict[str, Any]) -> Dict[str, str]:
        """Generate scent signature from artifact"""
        content_str = str(artifact.content).lower()
        primary_emotion = "longing"

        for emotion in EMOTION_TO_SCENT.keys():
            if emotion in content_str:
                primary_emotion = emotion
                break

        scents = EMOTION_TO_SCENT[primary_emotion]
        return {
            "surface": scents["surface"],
            "shadow": scents["shadow"],
            "derived_from": primary_emotion
        }

    def _generate_design_export(self, artifact: CreativeArtifact) -> Dict[str, str]:
        """Generate production design export"""
        return {
            "lighting_note": "Use color temperature to reflect emotional state",
            "costume_note": "Texture should be visible/touchable to audience",
            "sound_note": "Underscore should reflect key signature",
            "set_note": "Physical environment echoes internal landscape"
        }

    def _generate_design_notes(self, name: str, element_type: str,
                              color: ColorSignature, music: MusicalKey) -> Dict[str, str]:
        """Generate production design notes"""
        return {
            "lighting": f"For {name}: Start in {color.surface_color}, " \
                       f"reveal {color.shadow_color} in key moments",
            "costume": f"{name}'s costumes in {color.temperature} tones, " \
                      f"textures that suggest containment/release",
            "sound": f"{name}'s underscoring in {music.primary_key}, " \
                    f"modulating to {music.shadow_key} during transformation",
            "overall": f"{name} is {color.surface_color} trying to become {color.shadow_color}"
        }

    def _determine_temperature(self, emotion: str) -> str:
        """Determine color temperature from emotion"""
        warm_emotions = ["joy", "rage", "love", "passion", "ecstasy"]
        cool_emotions = ["grief", "fear", "despair", "numbness", "longing"]

        if emotion.lower() in warm_emotions:
            return "warm"
        elif emotion.lower() in cool_emotions:
            return "cool"
        else:
            return "neutral"

    def _determine_saturation(self, emotion: str) -> str:
        """Determine saturation from emotion"""
        vibrant_emotions = ["joy", "rage", "ecstasy", "love"]
        muted_emotions = ["grief", "despair", "numbness", "resignation"]

        if emotion.lower() in vibrant_emotions:
            return "vibrant"
        elif emotion.lower() in muted_emotions:
            return "desaturated"
        else:
            return "moderate"

    def _emotion_to_tempo(self, emotion: str) -> str:
        """Map emotion to tempo tendency"""
        tempo_map = {
            "joy": "allegro, dancing",
            "grief": "largo, heavy",
            "rage": "presto, driving",
            "fear": "irregular, anxious",
            "longing": "andante, searching",
            "ecstasy": "accelerando, building",
            "despair": "ritardando, slowing to stop",
            "numbness": "static, unchanging",
            "hope": "crescendo, brightening",
            "love": "rubato, flexible"
        }
        return tempo_map.get(emotion.lower(), "moderate")

    def _emotion_to_weight(self, emotion: str) -> str:
        """Map emotion to physical weight sensation"""
        weight_map = {
            "joy": "light, floating",
            "grief": "heavy, sinking",
            "rage": "explosive, pressurized",
            "fear": "paralyzed, frozen",
            "longing": "reaching, ungrounded",
            "ecstasy": "weightless, transcendent",
            "despair": "crushing, suffocating",
            "numbness": "nothing, absent",
            "hope": "lifting, rising",
            "love": "grounded, warm"
        }
        return weight_map.get(emotion.lower(), "neutral")

    def _profile_to_artifact(self, profile: SynestheticProfile) -> CreativeArtifact:
        """Convert profile to artifact"""
        return CreativeArtifact(
            id=profile.id,
            artifact_type="synesthetic_profile",
            content={
                "element": profile.element_name,
                "type": profile.element_type,
                "color": {
                    "surface": profile.color.surface_color,
                    "shadow": profile.color.shadow_color,
                    "accent": profile.color.accent_color,
                    "temperature": profile.color.temperature,
                    "description": profile.color.description
                },
                "music": {
                    "primary_key": profile.music.primary_key,
                    "shadow_key": profile.music.shadow_key,
                    "interval": profile.music.transition_interval,
                    "tempo": profile.music.tempo_tendency,
                    "description": profile.music.description
                },
                "texture": {
                    "surface": profile.texture.surface_texture,
                    "shadow": profile.texture.shadow_texture,
                    "description": profile.texture.description
                },
                "scent": {
                    "surface": profile.scent.surface_scent,
                    "shadow": profile.scent.shadow_scent,
                    "description": profile.scent.description
                },
                "taste": {
                    "surface": profile.taste.surface_taste,
                    "shadow": profile.taste.shadow_taste,
                    "description": profile.taste.description
                },
                "design_notes": profile.design_notes
            },
            source_engine=self.name
        )


# Convenience functions
def translate(element_name: str, primary_emotion: str,
             shadow_emotion: str = None) -> CreativeArtifact:
    """
    Create synesthetic translation for an element.

    Example:
        claire_profile = translate(
            "Claire Morrison",
            primary_emotion="numbness",
            shadow_emotion="hunger"
        )
    """
    from engines.core import EngineContext
    context = EngineContext("synesthetic_translation", "musical")
    engine = SynestheticTranslator()
    engine.attach_context(context)

    return engine.generate({
        "element_name": element_name,
        "element_type": "character",
        "primary_emotion": primary_emotion,
        "shadow_emotion": shadow_emotion or primary_emotion
    })[0]
