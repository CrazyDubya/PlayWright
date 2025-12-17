"""
THE DREAM PROTOCOL
==================

Layer 2b: Unconscious Access

"Access to the parts of creativity that logic cannot touch.
A side door past the conscious mind's bouncer."

The best art comes from places we don't fully understand.
The Protocol creates a bridge between conscious structure and unconscious truth.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional, Callable
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


class DreamLogicMode(Enum):
    """Different modes of dream logic operation"""
    AUTOMATIC_WRITING = "automatic_writing"
    DREAM_SCENE = "dream_scene"
    SYMBOLIC_SUBSTITUTION = "symbolic_substitution"
    NIGHTMARE_LENS = "nightmare_lens"
    COLLECTIVE_UNCONSCIOUS = "collective_unconscious"


@dataclass
class SymbolicAssociation:
    """A symbolic association chain"""
    seed_word: str
    associations: List[str]
    final_meaning: str
    unconscious_truth: str


@dataclass
class DreamImage:
    """A single image from the dream realm"""
    description: str
    archetypal_meaning: str
    emotional_resonance: str
    transformation_potential: str


@dataclass
class DreamSequence:
    """A complete dream sequence"""
    id: str
    images: List[DreamImage]
    narrative_thread: str
    unconscious_truth: str
    conscious_translation: str
    dramatic_application: str


# Archetypal image library - collective unconscious access
ARCHETYPAL_IMAGES = {
    "threshold": {
        "manifestations": ["door", "gate", "bridge", "window", "mirror"],
        "meaning": "Transition between states of being",
        "dramatic_use": "Character crosses point of no return"
    },
    "descent": {
        "manifestations": ["stairs going down", "cave", "basement", "underwater", "grave"],
        "meaning": "Journey into the unconscious / confronting shadow",
        "dramatic_use": "Character must face what they've buried"
    },
    "ascent": {
        "manifestations": ["stairs going up", "mountain", "tower", "flight", "ladder"],
        "meaning": "Spiritual growth / transcendence",
        "dramatic_use": "Character achieves breakthrough or escape"
    },
    "container": {
        "manifestations": ["house", "womb", "box", "room", "body"],
        "meaning": "The self / the psyche / the situation",
        "dramatic_use": "Shows character's internal state"
    },
    "shadow": {
        "manifestations": ["dark figure", "pursuer", "twin", "monster", "reflection"],
        "meaning": "Repressed aspects of self",
        "dramatic_use": "Character confronts what they deny"
    },
    "anima_animus": {
        "manifestations": ["mysterious lover", "guide", "wise figure", "muse"],
        "meaning": "Contrasexual unconscious / soul guide",
        "dramatic_use": "Character integrates opposite energies"
    },
    "child": {
        "manifestations": ["lost child", "inner child", "orphan", "infant self"],
        "meaning": "Vulnerability / potential / wounds",
        "dramatic_use": "Character reconnects with original self"
    },
    "death_rebirth": {
        "manifestations": ["corpse", "birth", "chrysalis", "sunrise after darkness"],
        "meaning": "Transformation / ego death / new beginning",
        "dramatic_use": "Character's old self dies, new self emerges"
    },
    "maze": {
        "manifestations": ["labyrinth", "endless corridor", "repeating rooms", "no exit"],
        "meaning": "Confusion / being lost / searching",
        "dramatic_use": "Character is trapped in pattern"
    },
    "water": {
        "manifestations": ["ocean", "flood", "rain", "drowning", "swimming"],
        "meaning": "Emotions / unconscious / maternal",
        "dramatic_use": "Character overwhelmed by or surrenders to feeling"
    }
}

# Symbolic substitution library
SYMBOLIC_SUBSTITUTIONS = {
    "gun": ["letter", "word", "key", "finger", "secret"],
    "kiss": ["wound", "contract", "death", "breath", "theft"],
    "door": ["mouth", "wound", "choice", "eye", "birth"],
    "child": ["song", "secret", "wound", "hope", "fear"],
    "mother": ["house", "earth", "cage", "ocean", "mirror"],
    "father": ["sky", "law", "voice", "absence", "clock"],
    "death": ["sleep", "orgasm", "marriage", "birth", "forgetting"],
    "sex": ["eating", "drowning", "flying", "fighting", "singing"],
    "house": ["body", "psyche", "family", "trap", "self"],
    "mirror": ["twin", "truth", "judgment", "portal", "death"]
}

# Dream logic connectors - how things relate in dreams
DREAM_CONNECTORS = [
    "becomes", "opens into", "reveals", "transforms into",
    "contains", "reflects", "devours", "gives birth to",
    "is secretly", "was always", "dreams of being"
]

# Nightmare distortions
NIGHTMARE_DISTORTIONS = [
    "but slightly wrong",
    "but everyone knows your secret",
    "but the room is smaller than possible",
    "but your body won't move",
    "but no sound comes out",
    "but they all have the same face",
    "but time moves wrong",
    "but you've forgotten something crucial",
    "but you're naked",
    "but you're the only one who sees"
]

# Collective unconscious patterns
COLLECTIVE_PATTERNS = {
    "the_mother_who_waits": {
        "archetype": "Great Mother",
        "universal_truth": "Someone always waits for us to return",
        "variations": ["Penelope", "Demeter", "the empty chair"]
    },
    "the_betrayed_king": {
        "archetype": "Wounded Masculine",
        "universal_truth": "Power corrupts, and corruption wounds",
        "variations": ["Oedipus", "Lear", "the fallen father"]
    },
    "the_forbidden_beloved": {
        "archetype": "Anima/Animus",
        "universal_truth": "We always desire what we cannot have",
        "variations": ["Tristan/Isolde", "Romeo/Juliet", "the locked room"]
    },
    "the_return_home": {
        "archetype": "Nostos",
        "universal_truth": "Home is never what we left",
        "variations": ["Odysseus", "the prodigal", "the revenant"]
    },
    "the_descent": {
        "archetype": "Katabasis",
        "universal_truth": "We must go down to go up",
        "variations": ["Orpheus", "Inanna", "the hero's death"]
    }
}


@EngineRegistry.register
class DreamProtocol(CreativeEngine):
    """
    The Dream Protocol Engine - access to the unconscious.

    Creates bridges between conscious structure and unconscious truth.
    Events connect by emotional resonance, not plot logic.
    """

    def __init__(self):
        super().__init__("DreamProtocol", EngineLayer.FOUNDATION)
        self._dream_cache: Dict[str, DreamSequence] = {}

    def process(self, artifact: CreativeArtifact) -> CreativeArtifact:
        """
        Process an artifact through dream logic.
        Add unconscious layer to conscious content.
        """
        # Generate symbolic associations
        associations = self._generate_associations(artifact)
        artifact.add_insight(self.name, "symbolic_associations", associations)

        # Identify archetypal resonances
        archetypes = self._identify_archetypes(artifact)
        artifact.add_insight(self.name, "archetypal_resonances", archetypes)

        # Generate dream version of the artifact
        dream_version = self._dreamify(artifact)
        artifact.add_insight(self.name, "dream_version", dream_version)

        # Find collective unconscious patterns
        patterns = self._find_collective_patterns(artifact)
        artifact.add_insight(self.name, "collective_patterns", patterns)

        return artifact

    def generate(self, seed: Optional[Dict[str, Any]] = None) -> List[CreativeArtifact]:
        """
        Generate dream content.

        Seed parameters:
        - mode: DreamLogicMode (or string name)
        - seed_images: list of images to start from
        - character: character name to dream for
        - theme: thematic seed
        """
        seed = seed or {}
        mode = seed.get("mode", DreamLogicMode.DREAM_SCENE)
        if isinstance(mode, str):
            mode = DreamLogicMode[mode.upper()]

        if mode == DreamLogicMode.AUTOMATIC_WRITING:
            return [self._automatic_writing(seed)]
        elif mode == DreamLogicMode.DREAM_SCENE:
            return [self._generate_dream_scene(seed)]
        elif mode == DreamLogicMode.SYMBOLIC_SUBSTITUTION:
            return [self._symbolic_substitution(seed)]
        elif mode == DreamLogicMode.NIGHTMARE_LENS:
            return [self._nightmare_lens(seed)]
        elif mode == DreamLogicMode.COLLECTIVE_UNCONSCIOUS:
            return [self._collective_unconscious(seed)]
        else:
            return [self._generate_dream_scene(seed)]

    def automatic_write(self, prompts: List[str], duration: int = 5) -> str:
        """
        Automatic writing mode - write without thinking.

        Prompts with disconnected images.
        Connections emerge from beneath.
        """
        output_lines = []

        for prompt in prompts:
            # Free association chain
            current = prompt
            chain = [current]

            for _ in range(duration):
                # Find unexpected connection
                if current in SYMBOLIC_SUBSTITUTIONS:
                    next_word = random.choice(SYMBOLIC_SUBSTITUTIONS[current])
                else:
                    # Generate association
                    associations = self._free_associate(current)
                    next_word = random.choice(associations) if associations else current

                connector = random.choice(DREAM_CONNECTORS)
                chain.append(f"{connector} {next_word}")
                current = next_word

            output_lines.append(" ".join(chain))

        return "\n\n".join(output_lines)

    def construct_dream_scene(self, character_name: str, emotional_state: str,
                             setting_seed: str = None) -> DreamSequence:
        """
        Construct a dream scene for a character.

        Events connect by emotional resonance, not plot logic.
        She opens the door and it's her childhood bedroom.
        Time is feeling, not sequence.
        """
        images = []

        # Starting image based on emotional state
        starting_archetype = self._emotion_to_archetype(emotional_state)
        archetype_data = ARCHETYPAL_IMAGES.get(starting_archetype, ARCHETYPAL_IMAGES["threshold"])

        starting_image = DreamImage(
            description=f"{character_name} {random.choice(['finds', 'sees', 'becomes', 'enters'])} "
                       f"{random.choice(archetype_data['manifestations'])}",
            archetypal_meaning=archetype_data["meaning"],
            emotional_resonance=emotional_state,
            transformation_potential=archetype_data["dramatic_use"]
        )
        images.append(starting_image)

        # Generate dream logic sequence (3-5 images)
        for _ in range(random.randint(2, 4)):
            next_archetype = random.choice(list(ARCHETYPAL_IMAGES.keys()))
            next_data = ARCHETYPAL_IMAGES[next_archetype]

            # Dream logic transformation
            transformation = random.choice(DREAM_CONNECTORS)
            manifestation = random.choice(next_data["manifestations"])

            # Apply potential nightmare distortion
            distortion = ""
            if random.random() < 0.4:
                distortion = f" {random.choice(NIGHTMARE_DISTORTIONS)}"

            image = DreamImage(
                description=f"This {transformation} {manifestation}{distortion}",
                archetypal_meaning=next_data["meaning"],
                emotional_resonance=self._drift_emotion(emotional_state),
                transformation_potential=next_data["dramatic_use"]
            )
            images.append(image)

        # Construct narrative thread
        narrative = self._weave_narrative(images)

        # Find unconscious truth
        unconscious_truth = self._extract_unconscious_truth(images, character_name)

        # Translate to conscious dramatic use
        conscious_translation = self._translate_to_drama(images, character_name)

        sequence = DreamSequence(
            id=generate_artifact_id("dream"),
            images=images,
            narrative_thread=narrative,
            unconscious_truth=unconscious_truth,
            conscious_translation=conscious_translation,
            dramatic_application=f"Insert as pivotal scene for {character_name}'s arc"
        )

        self._dream_cache[sequence.id] = sequence
        return sequence

    def apply_nightmare_lens(self, scene_description: str) -> str:
        """
        Apply nightmare distortion to a scene.

        What if everyone was slightly wrong?
        What if the room was smaller than possible?
        """
        distortions = random.sample(NIGHTMARE_DISTORTIONS, 3)
        nightmare_version = f"{scene_description}\n\n"
        nightmare_version += "THROUGH THE NIGHTMARE LENS:\n"
        for distortion in distortions:
            nightmare_version += f"- {scene_description.split('.')[0]} {distortion}\n"

        return nightmare_version

    def mine_collective_unconscious(self, theme: str) -> Dict[str, Any]:
        """
        Access archetypal patterns beneath individual stories.

        This isn't just Ruby - it's THE MOTHER WHO WAITS.
        """
        result = {
            "theme": theme,
            "collective_patterns": [],
            "archetypal_elevation": None,
            "universal_truth": None
        }

        # Find matching collective patterns
        theme_lower = theme.lower()
        for pattern_name, pattern_data in COLLECTIVE_PATTERNS.items():
            pattern_words = pattern_name.replace("_", " ").lower()
            if any(word in theme_lower for word in pattern_words.split()):
                result["collective_patterns"].append({
                    "pattern": pattern_name,
                    "archetype": pattern_data["archetype"],
                    "truth": pattern_data["universal_truth"],
                    "variations": pattern_data["variations"]
                })

        if result["collective_patterns"]:
            main_pattern = result["collective_patterns"][0]
            result["archetypal_elevation"] = f"This story is secretly about {main_pattern['archetype']}"
            result["universal_truth"] = main_pattern["truth"]
        else:
            # Generate new pattern
            result["archetypal_elevation"] = f"This story touches the archetype of transformation"
            result["universal_truth"] = "What we resist, persists. What we embrace, transforms."

        return result

    def symbolic_substitute(self, original: str, depth: int = 3) -> List[Dict[str, str]]:
        """
        Apply symbolic substitution to transform meaning.

        The gun becomes a letter.
        The kiss becomes a wound.
        The child becomes a song.
        """
        substitutions = []
        current = original.lower()

        for i in range(depth):
            if current in SYMBOLIC_SUBSTITUTIONS:
                options = SYMBOLIC_SUBSTITUTIONS[current]
                substitute = random.choice(options)
                substitutions.append({
                    "from": current,
                    "to": substitute,
                    "layer": i + 1,
                    "interpretation": f"The {current} is secretly a {substitute}"
                })
                current = substitute
            else:
                # Generate new substitution
                free_assoc = self._free_associate(current)
                if free_assoc:
                    substitute = random.choice(free_assoc)
                    substitutions.append({
                        "from": current,
                        "to": substitute,
                        "layer": i + 1,
                        "interpretation": f"The {current} dreams of being {substitute}"
                    })
                    current = substitute

        return substitutions

    def _automatic_writing(self, seed: Dict[str, Any]) -> CreativeArtifact:
        """Generate automatic writing artifact"""
        prompts = seed.get("seed_images", ["door", "mother", "mirror"])
        duration = seed.get("duration", 5)

        text = self.automatic_write(prompts, duration)

        return CreativeArtifact(
            id=generate_artifact_id("dream"),
            artifact_type="dream_text",
            content={
                "mode": "automatic_writing",
                "prompts": prompts,
                "text": text
            },
            source_engine=self.name
        )

    def _generate_dream_scene(self, seed: Dict[str, Any]) -> CreativeArtifact:
        """Generate dream scene artifact"""
        character = seed.get("character", "The Dreamer")
        emotion = seed.get("emotion", "longing")

        sequence = self.construct_dream_scene(character, emotion)

        return CreativeArtifact(
            id=sequence.id,
            artifact_type="dream_sequence",
            content={
                "mode": "dream_scene",
                "character": character,
                "images": [
                    {
                        "description": img.description,
                        "meaning": img.archetypal_meaning,
                        "emotion": img.emotional_resonance
                    } for img in sequence.images
                ],
                "narrative": sequence.narrative_thread,
                "unconscious_truth": sequence.unconscious_truth,
                "dramatic_application": sequence.dramatic_application
            },
            source_engine=self.name
        )

    def _symbolic_substitution(self, seed: Dict[str, Any]) -> CreativeArtifact:
        """Generate symbolic substitution artifact"""
        original = seed.get("symbol", "door")
        depth = seed.get("depth", 3)

        substitutions = self.symbolic_substitute(original, depth)

        return CreativeArtifact(
            id=generate_artifact_id("dream"),
            artifact_type="symbolic_chain",
            content={
                "mode": "symbolic_substitution",
                "original": original,
                "substitutions": substitutions,
                "final_symbol": substitutions[-1]["to"] if substitutions else original
            },
            source_engine=self.name
        )

    def _nightmare_lens(self, seed: Dict[str, Any]) -> CreativeArtifact:
        """Apply nightmare lens to scene"""
        scene = seed.get("scene", "A family dinner")

        nightmare = self.apply_nightmare_lens(scene)

        return CreativeArtifact(
            id=generate_artifact_id("dream"),
            artifact_type="nightmare",
            content={
                "mode": "nightmare_lens",
                "original_scene": scene,
                "nightmare_version": nightmare
            },
            source_engine=self.name
        )

    def _collective_unconscious(self, seed: Dict[str, Any]) -> CreativeArtifact:
        """Mine collective unconscious"""
        theme = seed.get("theme", "waiting")

        patterns = self.mine_collective_unconscious(theme)

        return CreativeArtifact(
            id=generate_artifact_id("dream"),
            artifact_type="collective_pattern",
            content={
                "mode": "collective_unconscious",
                "theme": theme,
                "patterns": patterns
            },
            source_engine=self.name
        )

    def _generate_associations(self, artifact: CreativeArtifact) -> List[SymbolicAssociation]:
        """Generate symbolic associations for artifact content"""
        associations = []

        # Extract key words from content
        content_str = str(artifact.content)
        key_words = [word for word in content_str.split() if word.lower() in SYMBOLIC_SUBSTITUTIONS]

        for word in key_words[:3]:  # Limit to 3
            chain = self._build_association_chain(word.lower())
            associations.append(chain)

        return associations

    def _build_association_chain(self, word: str) -> SymbolicAssociation:
        """Build an association chain from a word"""
        associations = []
        current = word

        for _ in range(4):
            if current in SYMBOLIC_SUBSTITUTIONS:
                next_word = random.choice(SYMBOLIC_SUBSTITUTIONS[current])
                associations.append(f"{current} → {next_word}")
                current = next_word
            else:
                break

        return SymbolicAssociation(
            seed_word=word,
            associations=associations,
            final_meaning=current,
            unconscious_truth=f"The {word} was always secretly about {current}"
        )

    def _identify_archetypes(self, artifact: CreativeArtifact) -> List[Dict[str, str]]:
        """Identify archetypal resonances in artifact"""
        archetypes = []
        content_str = str(artifact.content).lower()

        for archetype_name, archetype_data in ARCHETYPAL_IMAGES.items():
            for manifestation in archetype_data["manifestations"]:
                if manifestation in content_str:
                    archetypes.append({
                        "archetype": archetype_name,
                        "found_as": manifestation,
                        "meaning": archetype_data["meaning"],
                        "dramatic_use": archetype_data["dramatic_use"]
                    })
                    break

        return archetypes

    def _dreamify(self, artifact: CreativeArtifact) -> Dict[str, str]:
        """Create dream version of artifact"""
        content_str = str(artifact.content)

        # Apply dream logic
        dream_version = content_str
        for original, substitutes in list(SYMBOLIC_SUBSTITUTIONS.items())[:3]:
            if original in dream_version.lower():
                substitute = random.choice(substitutes)
                dream_version = dream_version.replace(original, substitute)

        # Add nightmare element
        nightmare_element = random.choice(NIGHTMARE_DISTORTIONS)

        return {
            "conscious_version": content_str[:200] + "...",
            "dream_version": dream_version[:200] + f"... {nightmare_element}",
            "insight": "In dreams, meaning flows through symbol, not logic"
        }

    def _find_collective_patterns(self, artifact: CreativeArtifact) -> List[Dict[str, Any]]:
        """Find collective unconscious patterns"""
        patterns = []
        content_str = str(artifact.content).lower()

        for pattern_name, pattern_data in COLLECTIVE_PATTERNS.items():
            keywords = pattern_name.split("_")
            if any(kw in content_str for kw in keywords):
                patterns.append({
                    "pattern": pattern_name,
                    "archetype": pattern_data["archetype"],
                    "truth": pattern_data["universal_truth"]
                })

        return patterns

    def _free_associate(self, word: str) -> List[str]:
        """Free association from a word"""
        # Simple phonetic/semantic associations
        associations = {
            "door": ["floor", "more", "war", "or", "pour"],
            "mother": ["other", "brother", "smother", "bother"],
            "water": ["daughter", "slaughter", "quarter"],
            "fire": ["desire", "liar", "wire", "higher"],
            "love": ["above", "shove", "dove", "glove"],
            "death": ["breath", "beth", "beneath"],
            "house": ["mouse", "spouse", "louse"],
            "night": ["light", "fight", "sight", "right"]
        }
        return associations.get(word, ["unknown", "shadow", "echo"])

    def _emotion_to_archetype(self, emotion: str) -> str:
        """Map emotion to starting archetype"""
        emotion_map = {
            "fear": "shadow",
            "longing": "threshold",
            "grief": "descent",
            "hope": "ascent",
            "shame": "maze",
            "rage": "shadow",
            "love": "anima_animus",
            "guilt": "descent",
            "ecstasy": "death_rebirth"
        }
        return emotion_map.get(emotion.lower(), "threshold")

    def _drift_emotion(self, original_emotion: str) -> str:
        """Let emotion drift in dream logic"""
        drifts = {
            "fear": ["terror", "awe", "longing"],
            "longing": ["grief", "hope", "desire"],
            "grief": ["rage", "acceptance", "numbness"],
            "hope": ["fear", "joy", "despair"],
            "shame": ["rage", "hiding", "exposure"]
        }
        options = drifts.get(original_emotion.lower(), [original_emotion])
        return random.choice(options)

    def _weave_narrative(self, images: List[DreamImage]) -> str:
        """Weave images into dream narrative"""
        narrative_parts = [img.description for img in images]
        return " Then, " .join(narrative_parts) + "."

    def _extract_unconscious_truth(self, images: List[DreamImage], character: str) -> str:
        """Extract the unconscious truth from dream images"""
        if not images:
            return "The truth hides in what we refuse to see."

        # Find the deepest archetype
        deepest = images[-1]
        return f"{character}'s dream reveals: {deepest.archetypal_meaning}. This is what the conscious mind protects us from knowing."

    def _translate_to_drama(self, images: List[DreamImage], character: str) -> str:
        """Translate dream to dramatic application"""
        applications = [img.transformation_potential for img in images]
        return f"For {character}'s arc: " + " → ".join(applications)


# Convenience functions
def dream_for(character: str, emotion: str = "longing") -> CreativeArtifact:
    """
    Generate a dream sequence for a character.

    Example:
        claire_dream = dream_for("Claire", emotion="shame")
    """
    from engines.core import EngineContext
    context = EngineContext("dream_generation", "musical")
    engine = DreamProtocol()
    engine.attach_context(context)

    return engine.generate({
        "mode": "dream_scene",
        "character": character,
        "emotion": emotion
    })[0]


def automatic_writing(prompts: List[str]) -> str:
    """
    Perform automatic writing from prompts.

    Example:
        text = automatic_writing(["door", "mother", "secret"])
    """
    engine = DreamProtocol()
    return engine.automatic_write(prompts)
