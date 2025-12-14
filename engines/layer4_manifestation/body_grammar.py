"""
THE BODY GRAMMAR ENGINE
========================

Layer 4a: Movement Truth

"The language we spoke before we had words. Recognition that theater
ignoring the body ignores 2 million years of evolution."

We are not minds piloting meat - we are bodies that think.
The body tells the story the mouth can't.
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


class MovementVocabulary(Enum):
    """Types of movement vocabulary"""
    EFFICIENT = "efficient"      # No wasted motion, no pleasure
    PERIPHERAL = "peripheral"    # Moving around, not through
    SPIRAL = "spiral"           # Moving FROM center
    GROUNDED = "grounded"       # Weight drops, feet claim
    CATLIKE = "catlike"         # Predator and prey
    CONTAINED = "contained"     # Small, controlled
    EXPANSIVE = "expansive"     # Large, claiming space
    FRAGMENTED = "fragmented"   # Broken, dissociated
    FLUID = "fluid"             # Continuous, connected
    STACCATO = "staccato"       # Sharp, sudden


class PosturalZone(Enum):
    """Body zones for postural analysis"""
    HEAD_NECK = "head_neck"
    SHOULDERS = "shoulders"
    SPINE = "spine"
    PELVIS = "pelvis"
    HANDS = "hands"
    FEET = "feet"
    BREATH = "breath"


@dataclass
class PosturalDNA:
    """The body's habitual holding patterns"""
    spine: str  # Description of spinal tension
    shoulders: str  # Shoulder holding pattern
    pelvis: str  # Pelvic tension/freedom
    hands: str  # What hands do habitually
    breath: str  # Breathing pattern
    center_of_gravity: str  # Where they hold their weight
    trauma_holding: Optional[str] = None  # Where trauma lives in body


@dataclass
class KineticSignature:
    """How a character moves through space"""
    entry_pattern: str  # How they enter a room
    sitting_pattern: str  # How they sit
    standing_pattern: str  # How they stand
    waiting_pattern: str  # What they do while waiting
    under_pressure: str  # What happens to spine under pressure
    tension_location: str  # Where they hold tension
    body_memory: str  # What body remembers that mind forgot


@dataclass
class TouchLexicon:
    """The vocabulary of touch for a character/relationship"""
    touch_type: str  # palm, fingertip, grab, etc.
    body_location: str  # where the touch lands
    meaning: str  # what it communicates
    subtext: str  # what it really means
    power_dynamic: str  # who has power in this touch


@dataclass
class StillnessGrammar:
    """When and how a character freezes"""
    triggers: List[str]  # What causes stillness
    quality: str  # Type of stillness (frozen, held, suspended)
    meaning: str  # What the stillness communicates
    duration: str  # How long before movement returns
    recovery: str  # How they come out of stillness


@dataclass
class MovementArc:
    """Evolution of movement through a character's journey"""
    before: Dict[str, str]  # Movement vocabulary before transformation
    during: Dict[str, str]  # Movement during transformation
    after: Dict[str, str]  # Movement after transformation


@dataclass
class BodyProfile:
    """Complete body grammar profile for a character"""
    id: str
    character_name: str
    postural_dna: PosturalDNA
    kinetic_signature: KineticSignature
    movement_vocabulary: List[MovementVocabulary]
    touch_lexicon: List[TouchLexicon]
    stillness_grammar: StillnessGrammar
    movement_arc: MovementArc
    choreographic_notes: Dict[str, str]


# Movement vocabulary libraries

SPINE_PATTERNS = {
    "rigid": "Artificially erect, years of 'stand up straight', locked",
    "collapsed": "Caved in, defeated, protecting heart",
    "fluid": "Responsive, alive, breathing",
    "coiled": "Ready to spring, tension held",
    "curved": "Carrying invisible weight",
    "proud": "Open, lifted, claiming space"
}

SHOULDER_PATTERNS = {
    "protective": "Rolled forward, guarding heart",
    "squared": "Battle-ready, defending",
    "dropped": "Relaxed, surrendered, open",
    "raised": "Holding breath, anxious",
    "asymmetric": "One up, one down - inner conflict",
    "wide": "Taking up space, power stance"
}

PELVIS_PATTERNS = {
    "locked": "Frozen sexuality, tension held for years",
    "tucked": "Hiding, shame held in hips",
    "released": "Sexual freedom, grounded power",
    "disconnected": "Cut off from lower body",
    "tilted": "Ready to run or fight",
    "centered": "Power flows through"
}

HAND_PATTERNS = {
    "busy": "Always doing, never still",
    "hidden": "In pockets, behind back",
    "reaching": "Toward others, wanting connection",
    "clenched": "Holding anger, control",
    "open": "Receptive, vulnerable",
    "self-touching": "Self-soothing, anxiety",
    "precise": "Controlled, careful movements"
}

BREATH_PATTERNS = {
    "shallow": "Held high in chest, anxiety",
    "held": "Afraid to exhale, waiting",
    "deep": "Belly breathing, grounded",
    "sighing": "Release, resignation, grief",
    "ragged": "Emotion breaking through",
    "controlled": "Managed, performance breathing"
}

TOUCH_MEANINGS = {
    "palm_on_shoulder": {"meaning": "comfort or control", "subtext": "I'm here / I own you"},
    "fingertip_on_cheek": {"meaning": "tenderness or claiming", "subtext": "You're precious / You're mine"},
    "grabbed_wrist": {"meaning": "desperate or violent", "subtext": "Don't leave / You can't leave"},
    "back_of_hand_to_face": {"meaning": "testing if real", "subtext": "Are you here? / Am I dreaming?"},
    "hand_on_throat": {"meaning": "ownership, breath control", "subtext": "I control your life / I trust you with my life"},
    "fingers_interlaced": {"meaning": "intimacy, binding", "subtext": "We're connected / We're trapped together"},
    "push_away": {"meaning": "rejection, protection", "subtext": "I can't / I won't let you see"},
    "no_touch": {"meaning": "distance, safety, death", "subtext": "You're untouchable / I'm untouchable"}
}

STILLNESS_QUALITIES = {
    "frozen": "Emergency shutdown, trauma response",
    "held": "Deliberate pause, before action",
    "suspended": "Between breaths, between decisions",
    "dead": "Life drained out, giving up",
    "coiled": "Stillness before strike",
    "receptive": "Stillness of receiving"
}


@EngineRegistry.register
class BodyGrammar(CreativeEngine):
    """
    The Body Grammar Engine - movement truth.

    Creates the physical vocabulary for characters.
    The body tells stories the mouth cannot.
    """

    def __init__(self):
        super().__init__("BodyGrammar", EngineLayer.MANIFESTATION)
        self._body_profiles: Dict[str, BodyProfile] = {}
        self.depends_on("CharacterGenetics", "SynestheticTranslator")

    def process(self, artifact: CreativeArtifact) -> CreativeArtifact:
        """
        Process an artifact through body grammar.
        Add physical dimension to characters and scenes.
        """
        # Get upstream insights
        genetics = self.get_upstream_insights(artifact, "CharacterGenetics")
        synesthetic = self.get_upstream_insights(artifact, "SynestheticTranslator")

        # Generate postural analysis
        posture = self._analyze_posture(artifact, genetics)
        artifact.add_insight(self.name, "postural_analysis", posture)

        # Generate kinetic signature
        kinetics = self._generate_kinetic_signature(artifact, genetics)
        artifact.add_insight(self.name, "kinetic_signature", kinetics)

        # Generate touch vocabulary
        touch = self._generate_touch_vocabulary(artifact)
        artifact.add_insight(self.name, "touch_vocabulary", touch)

        # Generate stillness grammar
        stillness = self._generate_stillness_grammar(artifact)
        artifact.add_insight(self.name, "stillness_grammar", stillness)

        # Generate movement arc
        arc = self._generate_movement_arc(artifact)
        artifact.add_insight(self.name, "movement_arc", arc)

        return artifact

    def generate(self, seed: Optional[Dict[str, Any]] = None) -> List[CreativeArtifact]:
        """
        Generate body grammar profile.

        Seed parameters:
        - character_name: name of character
        - primary_emotion: dominant emotional state
        - shadow_emotion: suppressed emotional state
        - trauma_type: type of trauma held in body
        - arc_stage: 'before', 'during', or 'after' transformation
        """
        seed = seed or {}
        character_name = seed.get("character_name", "Character")
        primary_emotion = seed.get("primary_emotion", "control")
        shadow_emotion = seed.get("shadow_emotion", "fear")
        trauma_type = seed.get("trauma_type", "suppression")

        profile = self.create_body_profile(
            character_name, primary_emotion, shadow_emotion, trauma_type
        )
        return [self._profile_to_artifact(profile)]

    def create_body_profile(self, name: str, primary_emotion: str,
                           shadow_emotion: str, trauma_type: str) -> BodyProfile:
        """
        Create complete body grammar profile for a character.

        Example:
            profile = create_body_profile(
                "Claire Morrison",
                primary_emotion="control",
                shadow_emotion="hunger",
                trauma_type="sexual_suppression"
            )
        """
        # Generate postural DNA
        postural = self._create_postural_dna(primary_emotion, shadow_emotion, trauma_type)

        # Generate kinetic signature
        kinetic = self._create_kinetic_signature(name, primary_emotion, trauma_type)

        # Determine movement vocabulary
        vocabulary = self._determine_vocabulary(primary_emotion, shadow_emotion)

        # Create touch lexicon
        touch = self._create_touch_lexicon(primary_emotion, shadow_emotion)

        # Create stillness grammar
        stillness = self._create_stillness_grammar(trauma_type)

        # Create movement arc
        arc = self._create_movement_arc(primary_emotion, shadow_emotion)

        # Generate choreographic notes
        choreo_notes = self._generate_choreographic_notes(name, postural, kinetic)

        profile = BodyProfile(
            id=generate_artifact_id("body"),
            character_name=name,
            postural_dna=postural,
            kinetic_signature=kinetic,
            movement_vocabulary=vocabulary,
            touch_lexicon=touch,
            stillness_grammar=stillness,
            movement_arc=arc,
            choreographic_notes=choreo_notes
        )

        self._body_profiles[profile.id] = profile
        return profile

    def design_touch_moment(self, toucher: str, touched: str,
                           relationship: str, moment: str) -> Dict[str, Any]:
        """
        Design a specific touch moment between characters.

        Example:
            touch = design_touch_moment(
                "David", "Claire",
                relationship="dominant/submissive",
                moment="first command"
            )
        """
        # Select appropriate touch type
        touch_types = list(TOUCH_MEANINGS.keys())

        # Match to relationship dynamic
        if "dominant" in relationship.lower():
            preferred = ["hand_on_throat", "grabbed_wrist", "fingertip_on_cheek"]
        elif "tender" in relationship.lower():
            preferred = ["palm_on_shoulder", "fingertip_on_cheek", "fingers_interlaced"]
        elif "distant" in relationship.lower():
            preferred = ["no_touch", "back_of_hand_to_face"]
        else:
            preferred = touch_types

        touch_type = random.choice(preferred)
        touch_data = TOUCH_MEANINGS[touch_type]

        return {
            "moment": moment,
            "toucher": toucher,
            "touched": touched,
            "touch_type": touch_type.replace("_", " "),
            "meaning": touch_data["meaning"],
            "subtext": touch_data["subtext"],
            "choreographic_note": f"{toucher}'s hand moves with {relationship.split('/')[0] if '/' in relationship else 'deliberate'} energy",
            "response_note": f"{touched}'s body responds with initial resistance then {random.choice(['surrender', 'lean in', 'freeze', 'melt'])}",
            "evolution": f"This touch vocabulary will evolve as their relationship deepens"
        }

    def design_stillness_moment(self, character: str, trigger: str,
                               arc_position: str = "before") -> Dict[str, Any]:
        """
        Design a moment of character stillness.

        When does a character freeze?
        What triggers the body's emergency shutdown?
        How does stillness SCREAM?
        """
        qualities = list(STILLNESS_QUALITIES.items())

        if arc_position == "before":
            quality, description = random.choice([
                ("frozen", STILLNESS_QUALITIES["frozen"]),
                ("held", STILLNESS_QUALITIES["held"])
            ])
        elif arc_position == "during":
            quality, description = random.choice([
                ("suspended", STILLNESS_QUALITIES["suspended"]),
                ("coiled", STILLNESS_QUALITIES["coiled"])
            ])
        else:
            quality, description = random.choice([
                ("receptive", STILLNESS_QUALITIES["receptive"]),
                ("held", STILLNESS_QUALITIES["held"])
            ])

        return {
            "character": character,
            "trigger": trigger,
            "stillness_quality": quality,
            "description": description,
            "duration": random.choice(["3 beats", "5 beats", "one full breath", "until broken by other"]),
            "what_it_communicates": f"{character}'s body processes what words cannot",
            "how_to_break_it": random.choice([
                "External sound/touch breaks the spell",
                "Breath returns first, then movement",
                "Tears break before body moves",
                "Movement begins in extremities",
                "Voice breaks the stillness"
            ])
        }

    def choreograph_transformation(self, character: str,
                                  from_state: str,
                                  to_state: str) -> Dict[str, Any]:
        """
        Choreograph a character's physical transformation.

        The body's journey from one state to another.
        """
        before_vocab = self._state_to_vocabulary(from_state)
        after_vocab = self._state_to_vocabulary(to_state)

        transformation_moments = []
        stages = ["recognition", "resistance", "surrender", "integration"]

        for stage in stages:
            transformation_moments.append({
                "stage": stage,
                "movement_quality": self._stage_to_movement(stage, before_vocab, after_vocab),
                "breath": self._stage_to_breath(stage),
                "focus": self._stage_to_focus(stage)
            })

        return {
            "character": character,
            "from_state": from_state,
            "to_state": to_state,
            "before_vocabulary": before_vocab,
            "after_vocabulary": after_vocab,
            "transformation_journey": transformation_moments,
            "key_physical_moment": f"The moment {character}'s {random.choice(['spine', 'pelvis', 'breath', 'hands'])} releases"
        }

    def _create_postural_dna(self, primary: str, shadow: str, trauma: str) -> PosturalDNA:
        """Create postural DNA from emotional profile"""
        # Map emotions to body patterns
        spine = SPINE_PATTERNS.get(self._emotion_to_spine(primary), SPINE_PATTERNS["rigid"])
        shoulders = SHOULDER_PATTERNS.get(self._emotion_to_shoulders(primary), SHOULDER_PATTERNS["protective"])
        pelvis = PELVIS_PATTERNS.get(self._emotion_to_pelvis(primary, trauma), PELVIS_PATTERNS["locked"])
        hands = HAND_PATTERNS.get(self._emotion_to_hands(primary), HAND_PATTERNS["busy"])
        breath = BREATH_PATTERNS.get(self._emotion_to_breath(primary), BREATH_PATTERNS["shallow"])

        return PosturalDNA(
            spine=spine,
            shoulders=shoulders,
            pelvis=pelvis,
            hands=hands,
            breath=breath,
            center_of_gravity="high in chest" if primary in ["control", "anxiety"] else "grounded in pelvis",
            trauma_holding=f"Trauma held in {self._trauma_to_location(trauma)}"
        )

    def _create_kinetic_signature(self, name: str, primary: str, trauma: str) -> KineticSignature:
        """Create kinetic signature"""
        return KineticSignature(
            entry_pattern=self._emotion_to_entry(primary),
            sitting_pattern=self._emotion_to_sitting(primary),
            standing_pattern=self._emotion_to_standing(primary),
            waiting_pattern=self._emotion_to_waiting(primary),
            under_pressure=f"Spine {random.choice(['locks', 'collapses', 'coils', 'goes rigid'])}",
            tension_location=self._trauma_to_location(trauma),
            body_memory=f"Body remembers what mind forgot about {trauma}"
        )

    def _determine_vocabulary(self, primary: str, shadow: str) -> List[MovementVocabulary]:
        """Determine movement vocabulary from emotions"""
        vocab_map = {
            "control": [MovementVocabulary.EFFICIENT, MovementVocabulary.CONTAINED],
            "fear": [MovementVocabulary.PERIPHERAL, MovementVocabulary.CONTAINED],
            "rage": [MovementVocabulary.STACCATO, MovementVocabulary.EXPANSIVE],
            "longing": [MovementVocabulary.FLUID, MovementVocabulary.SPIRAL],
            "joy": [MovementVocabulary.EXPANSIVE, MovementVocabulary.FLUID],
            "shame": [MovementVocabulary.CONTAINED, MovementVocabulary.PERIPHERAL],
            "numbness": [MovementVocabulary.EFFICIENT, MovementVocabulary.FRAGMENTED]
        }
        return vocab_map.get(primary.lower(), [MovementVocabulary.EFFICIENT])

    def _create_touch_lexicon(self, primary: str, shadow: str) -> List[TouchLexicon]:
        """Create touch vocabulary"""
        lexicon = []

        # Add primary touch patterns
        if primary in ["control", "fear"]:
            lexicon.append(TouchLexicon(
                touch_type="no_touch",
                body_location="distance",
                meaning="safety",
                subtext="I can't be touched",
                power_dynamic="protective"
            ))
        elif primary in ["longing", "love"]:
            lexicon.append(TouchLexicon(
                touch_type="reaching",
                body_location="toward other",
                meaning="desire for connection",
                subtext="Please see me",
                power_dynamic="vulnerable"
            ))

        return lexicon

    def _create_stillness_grammar(self, trauma: str) -> StillnessGrammar:
        """Create stillness grammar"""
        trauma_triggers = {
            "sexual_suppression": ["intimacy", "desire", "touch"],
            "abandonment": ["departure", "silence", "distance"],
            "violence": ["sudden movement", "loud noise", "raised voice"],
            "control": ["chaos", "uncertainty", "loss of power"]
        }

        triggers = trauma_triggers.get(trauma.lower(),
                                       ["vulnerability", "exposure", "loss of control"])

        return StillnessGrammar(
            triggers=triggers,
            quality="frozen",
            meaning="The body's emergency shutdown when overwhelmed",
            duration="Until external stimulus breaks the freeze",
            recovery="Breath returns first, then peripheral movement"
        )

    def _create_movement_arc(self, primary: str, shadow: str) -> MovementArc:
        """Create movement arc through transformation"""
        return MovementArc(
            before={
                "vocabulary": self._vocabulary_to_string(self._determine_vocabulary(primary, shadow)),
                "quality": "contained, controlled, efficient",
                "breath": "shallow, held high",
                "space": "takes little space, apologetic"
            },
            during={
                "vocabulary": "fragmenting, discovering",
                "quality": "surprising pauses, unexpected movements",
                "breath": "catching, releasing, discovering depth",
                "space": "testing boundaries, reaching"
            },
            after={
                "vocabulary": "grounded, expansive, fluid",
                "quality": "breath-initiated, claiming",
                "breath": "deep, belly breathing",
                "space": "fills space unapologetically"
            }
        )

    def _generate_choreographic_notes(self, name: str, postural: PosturalDNA,
                                     kinetic: KineticSignature) -> Dict[str, str]:
        """Generate notes for choreographer/director"""
        return {
            "spine_note": f"{name}'s spine: {postural.spine}",
            "shoulders_note": f"{name}'s shoulders: {postural.shoulders}",
            "pelvis_note": f"{name}'s pelvis: {postural.pelvis} - THIS IS KEY",
            "hands_note": f"Watch {name}'s hands: {postural.hands}",
            "entry_note": f"When {name} enters: {kinetic.entry_pattern}",
            "pressure_note": f"Under pressure: {kinetic.under_pressure}",
            "key_unlock": f"The moment {name}'s body unlocks is the story"
        }

    def _emotion_to_spine(self, emotion: str) -> str:
        """Map emotion to spine pattern"""
        mapping = {
            "control": "rigid", "fear": "coiled", "joy": "fluid",
            "grief": "collapsed", "rage": "coiled", "shame": "curved"
        }
        return mapping.get(emotion.lower(), "rigid")

    def _emotion_to_shoulders(self, emotion: str) -> str:
        """Map emotion to shoulder pattern"""
        mapping = {
            "control": "squared", "fear": "raised", "joy": "dropped",
            "grief": "protective", "rage": "wide", "shame": "protective"
        }
        return mapping.get(emotion.lower(), "protective")

    def _emotion_to_pelvis(self, emotion: str, trauma: str) -> str:
        """Map emotion and trauma to pelvis pattern"""
        if trauma and "sexual" in trauma.lower():
            return "locked"
        mapping = {
            "control": "locked", "fear": "tucked", "joy": "released",
            "freedom": "released", "shame": "tucked"
        }
        return mapping.get(emotion.lower(), "locked")

    def _emotion_to_hands(self, emotion: str) -> str:
        """Map emotion to hand pattern"""
        mapping = {
            "control": "busy", "fear": "hidden", "joy": "open",
            "anxiety": "self-touching", "rage": "clenched"
        }
        return mapping.get(emotion.lower(), "busy")

    def _emotion_to_breath(self, emotion: str) -> str:
        """Map emotion to breath pattern"""
        mapping = {
            "control": "controlled", "fear": "shallow", "joy": "deep",
            "grief": "sighing", "anxiety": "held"
        }
        return mapping.get(emotion.lower(), "shallow")

    def _emotion_to_entry(self, emotion: str) -> str:
        """Map emotion to room entry pattern"""
        mapping = {
            "control": "Scans room first, then enters with purpose",
            "fear": "Enters peripherally, checking exits",
            "joy": "Enters fully, greeting the space",
            "shame": "Enters apologetically, taking little space"
        }
        return mapping.get(emotion.lower(), "Enters cautiously")

    def _emotion_to_sitting(self, emotion: str) -> str:
        """Map emotion to sitting pattern"""
        mapping = {
            "control": "Sits precisely, posture perfect",
            "fear": "Perches on edge, ready to flee",
            "comfort": "Settles fully, claims the seat",
            "anxiety": "Fidgets, adjusts, never settles"
        }
        return mapping.get(emotion.lower(), "Sits carefully")

    def _emotion_to_standing(self, emotion: str) -> str:
        """Map emotion to standing pattern"""
        mapping = {
            "control": "Stands erect, feet planted",
            "fear": "Weight shifts, ready to move",
            "power": "Wide stance, claims ground",
            "shame": "Makes self smaller"
        }
        return mapping.get(emotion.lower(), "Stands contained")

    def _emotion_to_waiting(self, emotion: str) -> str:
        """Map emotion to waiting pattern"""
        mapping = {
            "control": "Stillness with internal tension",
            "anxiety": "Hands busy, weight shifting",
            "patience": "Centered stillness",
            "impatience": "Contained movement, checking time"
        }
        return mapping.get(emotion.lower(), "Waits with contained tension")

    def _trauma_to_location(self, trauma: str) -> str:
        """Map trauma type to body location"""
        mapping = {
            "sexual_suppression": "pelvis and hips",
            "abandonment": "chest and heart",
            "violence": "shoulders and jaw",
            "control": "spine and neck",
            "shame": "stomach and lower back",
            "grief": "throat and chest"
        }
        return mapping.get(trauma.lower(), "core of body")

    def _state_to_vocabulary(self, state: str) -> str:
        """Convert state to movement vocabulary description"""
        mapping = {
            "controlled": "efficient, contained, no pleasure in movement",
            "awakening": "discovering, pausing, testing",
            "free": "expansive, grounded, breath-initiated",
            "suppressed": "peripheral, service-oriented, small",
            "released": "spiral, claiming, cat-like"
        }
        return mapping.get(state.lower(), "neutral, adaptive")

    def _stage_to_movement(self, stage: str, before: str, after: str) -> str:
        """Map transformation stage to movement quality"""
        mapping = {
            "recognition": "Stillness as something new is perceived",
            "resistance": "Tension increases, body fights the change",
            "surrender": "Release begins, breath deepens",
            "integration": "New vocabulary establishes, body remembers"
        }
        return mapping.get(stage, "Transition movement")

    def _stage_to_breath(self, stage: str) -> str:
        """Map transformation stage to breath"""
        mapping = {
            "recognition": "Breath catches, holds",
            "resistance": "Shallow, tight, controlled",
            "surrender": "Deep exhale, release",
            "integration": "Full, natural, embodied"
        }
        return mapping.get(stage, "Adaptive breathing")

    def _stage_to_focus(self, stage: str) -> str:
        """Map transformation stage to physical focus"""
        mapping = {
            "recognition": "Eyes, face - recognition dawns",
            "resistance": "Core, spine - holding tight",
            "surrender": "Chest, pelvis - releasing",
            "integration": "Whole body - unified"
        }
        return mapping.get(stage, "Full body")

    def _vocabulary_to_string(self, vocab: List[MovementVocabulary]) -> str:
        """Convert vocabulary list to string"""
        return ", ".join([v.value for v in vocab])

    def _analyze_posture(self, artifact: CreativeArtifact,
                        genetics: Dict[str, Any]) -> Dict[str, str]:
        """Analyze posture from artifact content"""
        return {
            "spine": "Analysis needed - check character's control patterns",
            "shoulders": "Protective or open based on vulnerability",
            "pelvis": "Check for suppression markers"
        }

    def _generate_kinetic_signature(self, artifact: CreativeArtifact,
                                   genetics: Dict[str, Any]) -> Dict[str, str]:
        """Generate kinetic signature"""
        return {
            "entry": "How they enter reveals their relationship to power",
            "waiting": "What they do while waiting reveals their anxiety"
        }

    def _generate_touch_vocabulary(self, artifact: CreativeArtifact) -> List[Dict[str, str]]:
        """Generate touch vocabulary"""
        return [
            {"touch": "no_touch", "meaning": "distance as safety"}
        ]

    def _generate_stillness_grammar(self, artifact: CreativeArtifact) -> Dict[str, str]:
        """Generate stillness grammar"""
        return {
            "triggers": "vulnerability, exposure, loss of control",
            "quality": "frozen",
            "recovery": "breath first, then extremities"
        }

    def _generate_movement_arc(self, artifact: CreativeArtifact) -> Dict[str, Any]:
        """Generate movement arc"""
        return {
            "before": "contained",
            "during": "discovering",
            "after": "expansive"
        }

    def _profile_to_artifact(self, profile: BodyProfile) -> CreativeArtifact:
        """Convert profile to artifact"""
        return CreativeArtifact(
            id=profile.id,
            artifact_type="body_profile",
            content={
                "character": profile.character_name,
                "postural_dna": {
                    "spine": profile.postural_dna.spine,
                    "shoulders": profile.postural_dna.shoulders,
                    "pelvis": profile.postural_dna.pelvis,
                    "hands": profile.postural_dna.hands,
                    "breath": profile.postural_dna.breath,
                    "trauma_holding": profile.postural_dna.trauma_holding
                },
                "kinetic_signature": {
                    "entry": profile.kinetic_signature.entry_pattern,
                    "sitting": profile.kinetic_signature.sitting_pattern,
                    "under_pressure": profile.kinetic_signature.under_pressure
                },
                "movement_vocabulary": [v.value for v in profile.movement_vocabulary],
                "stillness": {
                    "triggers": profile.stillness_grammar.triggers,
                    "quality": profile.stillness_grammar.quality
                },
                "arc": {
                    "before": profile.movement_arc.before,
                    "during": profile.movement_arc.during,
                    "after": profile.movement_arc.after
                },
                "choreographic_notes": profile.choreographic_notes
            },
            source_engine=self.name
        )


# Convenience function
def embody(character_name: str, primary_emotion: str = "control",
          shadow_emotion: str = "fear",
          trauma_type: str = "suppression") -> CreativeArtifact:
    """
    Create body grammar profile for a character.

    Example:
        claire_body = embody(
            "Claire Morrison",
            primary_emotion="control",
            shadow_emotion="hunger",
            trauma_type="sexual_suppression"
        )
    """
    from engines.core import EngineContext
    context = EngineContext("body_grammar", "musical")
    engine = BodyGrammar()
    engine.attach_context(context)

    return engine.generate({
        "character_name": character_name,
        "primary_emotion": primary_emotion,
        "shadow_emotion": shadow_emotion,
        "trauma_type": trauma_type
    })[0]
