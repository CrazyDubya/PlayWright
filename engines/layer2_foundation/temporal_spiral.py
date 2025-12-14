"""
THE TEMPORAL SPIRAL
===================

Layer 2c: Time Bending

"Recognition that time is trauma's medium. Linear time is a convenience -
not how we experience memory, grief, or love."

Theater already bends time. The Spiral asks: what else will the audience accept?
What if NOW was the flashback, and THEN was the reality?
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


class TemporalShape(Enum):
    """Different shapes time can take in narrative"""
    ECHO_SCENE = "echo_scene"           # Same moment, different times, simultaneous
    MEMORY_BLEED = "memory_bleed"        # Present bleeding into past
    PROPHECY_LOOP = "prophecy_loop"      # End shown first, understood after
    TRAUMA_STUTTER = "trauma_stutter"    # Scene that keeps almost-happening
    GENERATION_COLLAPSE = "generation_collapse"  # Multiple generations as one


class TimeSignature(Enum):
    """Musical time signatures as temporal meaning"""
    WALTZ_3_4 = "3/4"      # Memory, nostalgia, the past
    MARCH_4_4 = "4/4"      # Present, reality, forward motion
    UNCERTAIN_7_8 = "7/8"  # Future, uncertainty, off-balance
    SUSPENDED_5_4 = "5/4"  # Liminal, between, neither here nor there
    FRACTURED_11_8 = "11/8"  # Trauma, broken time, impossible rhythm


@dataclass
class TemporalMoment:
    """A moment in the temporal structure"""
    id: str
    time_period: str  # "1989", "now", "future", etc.
    content: str
    emotional_resonance: str
    time_signature: TimeSignature
    perspective: str  # Whose perception shapes this moment


@dataclass
class EchoScene:
    """
    Moments from different times performed SIMULTANEOUSLY.
    The same words meaning different things.
    """
    id: str
    shared_text: str  # The text that echoes across times
    moments: List[TemporalMoment]
    harmonic_meaning: str  # What emerges when all are heard together
    staging_notes: str


@dataclass
class MemoryBleed:
    """
    A character in the present begins speaking their mother's words
    from 30 years ago, without realizing.
    """
    id: str
    present_character: str
    present_situation: str
    past_character: str
    past_situation: str
    bleed_trigger: str  # What causes the bleed
    shared_words: str
    recognition_moment: str  # When character realizes what's happening


@dataclass
class ProphecyLoop:
    """
    The ending shown first, understood only after living through the middle.
    """
    id: str
    prophetic_image: str  # What we see first
    initial_interpretation: str  # What audience thinks it means
    true_meaning: str  # What it actually means
    revelation_moment: str  # When understanding arrives


@dataclass
class TraumaStutter:
    """
    A scene that keeps almost-happening, rewound, tried again
    from different angles.
    """
    id: str
    core_event: str
    attempts: List[Dict[str, str]]  # Different attempts to complete/avoid
    why_it_stutters: str
    resolution: Optional[str]


@dataclass
class GenerationCollapse:
    """
    Grandmother/mother/daughter played by same actress -
    because they ARE the same, repeating.
    """
    id: str
    shared_role: str
    generations: List[Dict[str, Any]]  # Each generation's specifics
    pattern_repeated: str
    pattern_broken_by: Optional[str]


# Time-bending templates
ECHO_TEMPLATES = [
    {
        "pattern": "three_generations_one_cage",
        "shared_text": "These walls feel like they're closing in",
        "time_periods": ["grandmother_1960", "mother_1989", "daughter_now"],
        "meanings": ["resignation", "awakening", "determination"]
    },
    {
        "pattern": "love_across_time",
        "shared_text": "I never meant to leave you",
        "time_periods": ["first_love_youth", "marriage_middle", "death_bed"],
        "meanings": ["passion", "regret", "release"]
    },
    {
        "pattern": "the_same_mistake",
        "shared_text": "Just this once won't hurt",
        "time_periods": ["first_drink", "relapse", "child_inheriting"],
        "meanings": ["escape", "failure", "curse"]
    }
]

MEMORY_BLEED_TRIGGERS = [
    "the same perfume",
    "a familiar song",
    "the angle of light",
    "a child's cry",
    "the kitchen at 3am",
    "anniversary of loss",
    "returning to childhood home",
    "smell of specific food",
    "hearing the old nickname"
]

TIME_SIGNATURE_MEANINGS = {
    TimeSignature.WALTZ_3_4: {
        "tempo": "nostalgic, swaying",
        "use": "memories, the past calling",
        "example": "Songs of what was"
    },
    TimeSignature.MARCH_4_4: {
        "tempo": "driving, present",
        "use": "reality, forward motion, denial",
        "example": "Songs of daily life"
    },
    TimeSignature.UNCERTAIN_7_8: {
        "tempo": "stumbling, searching",
        "use": "future, anxiety, possibility",
        "example": "Songs of what might be"
    },
    TimeSignature.SUSPENDED_5_4: {
        "tempo": "floating, liminal",
        "use": "transitions, between states",
        "example": "Songs of transformation"
    },
    TimeSignature.FRACTURED_11_8: {
        "tempo": "broken, impossible",
        "use": "trauma, dissociation, fractured self",
        "example": "Songs that can't find resolution"
    }
}


@EngineRegistry.register
class TemporalSpiral(CreativeEngine):
    """
    The Temporal Spiral Engine - bending time in narrative.

    Time is trauma's medium. The Spiral allows non-linear storytelling
    that reflects how we actually experience memory, grief, and love.
    """

    def __init__(self):
        super().__init__("TemporalSpiral", EngineLayer.FOUNDATION)
        self._temporal_structures: Dict[str, Any] = {}

    def process(self, artifact: CreativeArtifact) -> CreativeArtifact:
        """
        Process an artifact through temporal analysis.
        Find the non-linear truth hidden in linear content.
        """
        # Identify potential echo scenes
        echoes = self._identify_echo_potential(artifact)
        artifact.add_insight(self.name, "echo_potential", echoes)

        # Detect memory bleed opportunities
        bleeds = self._detect_memory_bleeds(artifact)
        artifact.add_insight(self.name, "memory_bleed_opportunities", bleeds)

        # Suggest time signature
        signature = self._suggest_time_signature(artifact)
        artifact.add_insight(self.name, "time_signature", signature)

        # Identify generational patterns
        patterns = self._identify_generational_patterns(artifact)
        artifact.add_insight(self.name, "generational_patterns", patterns)

        return artifact

    def generate(self, seed: Optional[Dict[str, Any]] = None) -> List[CreativeArtifact]:
        """
        Generate temporal structure.

        Seed parameters:
        - shape: TemporalShape
        - characters: list of character names
        - theme: thematic content
        - time_periods: list of time periods
        """
        seed = seed or {}
        shape = seed.get("shape", TemporalShape.ECHO_SCENE)
        if isinstance(shape, str):
            shape = TemporalShape[shape.upper()]

        if shape == TemporalShape.ECHO_SCENE:
            return [self._create_echo_scene(seed)]
        elif shape == TemporalShape.MEMORY_BLEED:
            return [self._create_memory_bleed(seed)]
        elif shape == TemporalShape.PROPHECY_LOOP:
            return [self._create_prophecy_loop(seed)]
        elif shape == TemporalShape.TRAUMA_STUTTER:
            return [self._create_trauma_stutter(seed)]
        elif shape == TemporalShape.GENERATION_COLLAPSE:
            return [self._create_generation_collapse(seed)]
        else:
            return [self._create_echo_scene(seed)]

    def create_echo_scene(self, shared_text: str, moments: List[Dict[str, str]]) -> EchoScene:
        """
        Create an echo scene - same text across different times.

        Arguments:
            shared_text: The text that will be spoken simultaneously
            moments: List of dicts with 'time_period', 'character', 'meaning'

        Example:
            "These picket fences feel like bars"
            - Mother (1989): resignation, accepts the cage
            - Claire (now): awakening, seeing the cage
            - Daughter: determination, never building the cage
        """
        temporal_moments = []
        for i, moment in enumerate(moments):
            tm = TemporalMoment(
                id=generate_artifact_id("moment"),
                time_period=moment.get("time_period", f"time_{i}"),
                content=f"{moment.get('character', 'Character')}: {shared_text}",
                emotional_resonance=moment.get("meaning", "unknown"),
                time_signature=self._period_to_signature(moment.get("time_period", "")),
                perspective=moment.get("character", "Character")
            )
            temporal_moments.append(tm)

        harmonic = self._calculate_harmonic_meaning(temporal_moments)

        echo = EchoScene(
            id=generate_artifact_id("echo"),
            shared_text=shared_text,
            moments=temporal_moments,
            harmonic_meaning=harmonic,
            staging_notes=self._generate_staging_notes(temporal_moments)
        )

        self._temporal_structures[echo.id] = echo
        return echo

    def create_memory_bleed(self, present_char: str, past_char: str,
                           trigger: str, shared_words: str) -> MemoryBleed:
        """
        Create a memory bleed - present character speaks past's words.

        Example: Claire at 16, discovering mother's affair - frozen in doorway
                 Same position as Claire now, bound and surrendering
        """
        bleed = MemoryBleed(
            id=generate_artifact_id("bleed"),
            present_character=present_char,
            present_situation=f"{present_char} in current dramatic moment",
            past_character=past_char,
            past_situation=f"{past_char} in original moment",
            bleed_trigger=trigger,
            shared_words=shared_words,
            recognition_moment=f"{present_char} realizes they've become {past_char}"
        )

        self._temporal_structures[bleed.id] = bleed
        return bleed

    def create_trauma_stutter(self, core_event: str, character: str,
                             num_attempts: int = 3) -> TraumaStutter:
        """
        Create a trauma stutter - scene keeps almost-happening.

        The same moment tried again from different angles,
        never quite completing.
        """
        attempts = []
        attempt_types = [
            "approached directly, then pulled away",
            "approached from behind, interrupted",
            "approached in memory, distorted",
            "approached in dream, nightmare",
            "finally approached, but different"
        ]

        for i in range(min(num_attempts, len(attempt_types))):
            attempts.append({
                "attempt_number": i + 1,
                "approach": attempt_types[i],
                "what_stops_it": random.choice([
                    "fear of the truth",
                    "protective dissociation",
                    "interruption from outside",
                    "body refuses",
                    "not ready yet"
                ]),
                "stage_direction": f"{character} moves toward but cannot reach"
            })

        stutter = TraumaStutter(
            id=generate_artifact_id("stutter"),
            core_event=core_event,
            attempts=attempts,
            why_it_stutters=f"{character} cannot process this directly",
            resolution=f"Finally, on attempt {num_attempts + 1}, the event completes"
        )

        self._temporal_structures[stutter.id] = stutter
        return stutter

    def create_generation_collapse(self, characters: List[Dict[str, str]],
                                  repeated_pattern: str) -> GenerationCollapse:
        """
        Create a generation collapse - multiple generations as one person.

        Same actor plays grandmother/mother/daughter
        because they ARE the same pattern, repeating.
        """
        generations = []
        for i, char in enumerate(characters):
            generations.append({
                "generation": i,
                "character": char.get("name", f"Generation {i}"),
                "era": char.get("era", f"Era {i}"),
                "how_pattern_manifests": char.get("manifestation", repeated_pattern),
                "what_differs": char.get("difference", "context only")
            })

        collapse = GenerationCollapse(
            id=generate_artifact_id("collapse"),
            shared_role="The Woman Who Repeats",
            generations=generations,
            pattern_repeated=repeated_pattern,
            pattern_broken_by=None  # Can be set later
        )

        self._temporal_structures[collapse.id] = collapse
        return collapse

    def assign_time_signature(self, scene_description: str,
                            emotional_state: str) -> Dict[str, Any]:
        """
        Assign a time signature to a scene/song.

        3/4 = waltz = memory
        4/4 = march = present
        7/8 = future = uncertain ground
        """
        # Determine appropriate signature
        if any(word in emotional_state.lower() for word in ["memory", "past", "nostalgia", "loss"]):
            sig = TimeSignature.WALTZ_3_4
        elif any(word in emotional_state.lower() for word in ["present", "now", "routine", "daily"]):
            sig = TimeSignature.MARCH_4_4
        elif any(word in emotional_state.lower() for word in ["future", "hope", "fear", "uncertain"]):
            sig = TimeSignature.UNCERTAIN_7_8
        elif any(word in emotional_state.lower() for word in ["change", "transform", "between"]):
            sig = TimeSignature.SUSPENDED_5_4
        elif any(word in emotional_state.lower() for word in ["trauma", "broken", "shatter", "fracture"]):
            sig = TimeSignature.FRACTURED_11_8
        else:
            sig = TimeSignature.MARCH_4_4

        meaning = TIME_SIGNATURE_MEANINGS[sig]

        return {
            "signature": sig.value,
            "name": sig.name,
            "tempo": meaning["tempo"],
            "dramatic_use": meaning["use"],
            "example_application": meaning["example"],
            "scene": scene_description,
            "emotion": emotional_state
        }

    def suggest_temporal_structure(self, story_summary: str) -> Dict[str, Any]:
        """
        Analyze a story and suggest temporal structures.
        """
        suggestions = []

        # Check for generational content
        if any(word in story_summary.lower() for word in ["mother", "daughter", "grandmother", "generation", "inherit"]):
            suggestions.append({
                "structure": "GENERATION_COLLAPSE",
                "reason": "Multiple generations suggest collapsible time",
                "example": "Same actress plays all three generations"
            })

        # Check for trauma content
        if any(word in story_summary.lower() for word in ["trauma", "abuse", "violence", "wound", "scar"]):
            suggestions.append({
                "structure": "TRAUMA_STUTTER",
                "reason": "Trauma resists direct approach",
                "example": "Scene keeps rewinding before the moment of impact"
            })

        # Check for prophecy/mystery content
        if any(word in story_summary.lower() for word in ["secret", "reveal", "discover", "mystery", "truth"]):
            suggestions.append({
                "structure": "PROPHECY_LOOP",
                "reason": "Revelation gains power from foreshadowing",
                "example": "Show the ending image first, incomprehensible until earned"
            })

        # Check for memory/past content
        if any(word in story_summary.lower() for word in ["memory", "past", "remember", "childhood", "history"]):
            suggestions.append({
                "structure": "MEMORY_BLEED",
                "reason": "Past bleeds into present for those who haven't processed it",
                "example": "Character begins speaking their parent's words without realizing"
            })

        # Always suggest echo scene as option
        suggestions.append({
            "structure": "ECHO_SCENE",
            "reason": "Same words can mean different things across time",
            "example": "Three generations speak the same line simultaneously"
        })

        return {
            "story_summary": story_summary,
            "suggested_structures": suggestions,
            "primary_recommendation": suggestions[0] if suggestions else None
        }

    def _create_echo_scene(self, seed: Dict[str, Any]) -> CreativeArtifact:
        """Create echo scene artifact"""
        shared_text = seed.get("shared_text", "The walls are closing in")
        time_periods = seed.get("time_periods", ["past", "present", "future"])
        characters = seed.get("characters", ["Character"] * len(time_periods))

        moments = []
        meanings = ["resignation", "awakening", "determination"]
        for i, (period, char) in enumerate(zip(time_periods, characters)):
            moments.append({
                "time_period": period,
                "character": char,
                "meaning": meanings[i % len(meanings)]
            })

        echo = self.create_echo_scene(shared_text, moments)

        return CreativeArtifact(
            id=echo.id,
            artifact_type="temporal_structure",
            content={
                "shape": "ECHO_SCENE",
                "shared_text": echo.shared_text,
                "moments": [
                    {
                        "time": m.time_period,
                        "perspective": m.perspective,
                        "meaning": m.emotional_resonance,
                        "signature": m.time_signature.value
                    } for m in echo.moments
                ],
                "harmonic_meaning": echo.harmonic_meaning,
                "staging_notes": echo.staging_notes
            },
            source_engine=self.name
        )

    def _create_memory_bleed(self, seed: Dict[str, Any]) -> CreativeArtifact:
        """Create memory bleed artifact"""
        present = seed.get("present_character", "Child (Now)")
        past = seed.get("past_character", "Parent (Then)")
        trigger = seed.get("trigger", random.choice(MEMORY_BLEED_TRIGGERS))
        words = seed.get("shared_words", "I never asked for this")

        bleed = self.create_memory_bleed(present, past, trigger, words)

        return CreativeArtifact(
            id=bleed.id,
            artifact_type="temporal_structure",
            content={
                "shape": "MEMORY_BLEED",
                "present": {
                    "character": bleed.present_character,
                    "situation": bleed.present_situation
                },
                "past": {
                    "character": bleed.past_character,
                    "situation": bleed.past_situation
                },
                "trigger": bleed.bleed_trigger,
                "shared_words": bleed.shared_words,
                "recognition": bleed.recognition_moment
            },
            source_engine=self.name
        )

    def _create_prophecy_loop(self, seed: Dict[str, Any]) -> CreativeArtifact:
        """Create prophecy loop artifact"""
        image = seed.get("prophetic_image", "A figure falls from a great height")
        initial = seed.get("initial_meaning", "Death, tragedy, ending")
        true = seed.get("true_meaning", "Surrender, release, transformation")

        loop = ProphecyLoop(
            id=generate_artifact_id("prophecy"),
            prophetic_image=image,
            initial_interpretation=initial,
            true_meaning=true,
            revelation_moment="The fall is not death but birth into new self"
        )

        return CreativeArtifact(
            id=loop.id,
            artifact_type="temporal_structure",
            content={
                "shape": "PROPHECY_LOOP",
                "prophetic_image": loop.prophetic_image,
                "initial_interpretation": loop.initial_interpretation,
                "true_meaning": loop.true_meaning,
                "revelation": loop.revelation_moment
            },
            source_engine=self.name
        )

    def _create_trauma_stutter(self, seed: Dict[str, Any]) -> CreativeArtifact:
        """Create trauma stutter artifact"""
        event = seed.get("core_event", "The moment everything changed")
        character = seed.get("character", "Protagonist")

        stutter = self.create_trauma_stutter(event, character)

        return CreativeArtifact(
            id=stutter.id,
            artifact_type="temporal_structure",
            content={
                "shape": "TRAUMA_STUTTER",
                "core_event": stutter.core_event,
                "attempts": stutter.attempts,
                "why": stutter.why_it_stutters,
                "resolution": stutter.resolution
            },
            source_engine=self.name
        )

    def _create_generation_collapse(self, seed: Dict[str, Any]) -> CreativeArtifact:
        """Create generation collapse artifact"""
        characters = seed.get("characters", [
            {"name": "Grandmother", "era": "1960s", "manifestation": "silent endurance"},
            {"name": "Mother", "era": "1989", "manifestation": "suppressed rebellion"},
            {"name": "Daughter", "era": "now", "manifestation": "conscious breaking"}
        ])
        pattern = seed.get("pattern", "women who sacrifice themselves for family")

        collapse = self.create_generation_collapse(characters, pattern)

        return CreativeArtifact(
            id=collapse.id,
            artifact_type="temporal_structure",
            content={
                "shape": "GENERATION_COLLAPSE",
                "shared_role": collapse.shared_role,
                "generations": collapse.generations,
                "pattern": collapse.pattern_repeated,
                "broken_by": collapse.pattern_broken_by
            },
            source_engine=self.name
        )

    def _identify_echo_potential(self, artifact: CreativeArtifact) -> List[Dict[str, str]]:
        """Find potential echo scenes in artifact"""
        echoes = []
        content_str = str(artifact.content).lower()

        # Look for generational keywords
        if "generation" in content_str or "mother" in content_str or "daughter" in content_str:
            echoes.append({
                "type": "generational_echo",
                "suggestion": "Same lines spoken across three generations"
            })

        # Look for repetition keywords
        if "again" in content_str or "repeat" in content_str or "pattern" in content_str:
            echoes.append({
                "type": "pattern_echo",
                "suggestion": "Show the repetition simultaneously rather than sequentially"
            })

        return echoes

    def _detect_memory_bleeds(self, artifact: CreativeArtifact) -> List[Dict[str, str]]:
        """Detect opportunities for memory bleeds"""
        bleeds = []
        content_str = str(artifact.content).lower()

        for trigger in MEMORY_BLEED_TRIGGERS[:5]:
            if any(word in content_str for word in trigger.split()):
                bleeds.append({
                    "trigger": trigger,
                    "suggestion": f"When {trigger} occurs, past voice emerges"
                })

        return bleeds

    def _suggest_time_signature(self, artifact: CreativeArtifact) -> Dict[str, Any]:
        """Suggest time signature for artifact"""
        content_str = str(artifact.content).lower()

        # Default analysis
        if "memory" in content_str or "past" in content_str:
            return {"signature": "3/4", "reason": "Memory content suggests waltz time"}
        elif "trauma" in content_str or "broken" in content_str:
            return {"signature": "11/8", "reason": "Trauma content suggests fractured time"}
        elif "future" in content_str or "hope" in content_str:
            return {"signature": "7/8", "reason": "Future orientation suggests uncertain time"}
        else:
            return {"signature": "4/4", "reason": "Present-focused content suggests march time"}

    def _identify_generational_patterns(self, artifact: CreativeArtifact) -> List[str]:
        """Identify generational pattern opportunities"""
        patterns = []

        # Look for family dynamics
        content_str = str(artifact.content).lower()
        family_words = ["mother", "father", "daughter", "son", "grandmother", "grandfather"]

        found_family = [word for word in family_words if word in content_str]
        if len(found_family) >= 2:
            patterns.append(f"Multi-generational story: consider collapse of {', '.join(found_family)}")

        return patterns

    def _period_to_signature(self, period: str) -> TimeSignature:
        """Convert time period description to time signature"""
        period_lower = period.lower()
        if any(word in period_lower for word in ["past", "memory", "before", "19"]):
            return TimeSignature.WALTZ_3_4
        elif any(word in period_lower for word in ["future", "will", "might"]):
            return TimeSignature.UNCERTAIN_7_8
        else:
            return TimeSignature.MARCH_4_4

    def _calculate_harmonic_meaning(self, moments: List[TemporalMoment]) -> str:
        """Calculate the meaning that emerges from all moments together"""
        emotions = [m.emotional_resonance for m in moments]
        perspectives = [m.perspective for m in moments]

        return f"When {', '.join(perspectives)} speak together, {' meets '.join(emotions)} - " \
               f"revealing that time is circular, not linear"

    def _generate_staging_notes(self, moments: List[TemporalMoment]) -> str:
        """Generate staging notes for echo scene"""
        notes = []
        positions = ["stage left (past)", "center stage (present)", "stage right (future)"]

        for i, moment in enumerate(moments):
            pos = positions[i % len(positions)]
            notes.append(f"{moment.perspective}: {pos}, {moment.time_signature.value} time")

        return " | ".join(notes)


# Convenience functions
def create_echo(shared_text: str, moments: List[Dict[str, str]]) -> CreativeArtifact:
    """
    Create an echo scene.

    Example:
        echo = create_echo(
            "These picket fences feel like bars",
            [
                {"time_period": "1960s", "character": "Grandmother", "meaning": "resignation"},
                {"time_period": "1989", "character": "Mother", "meaning": "awakening"},
                {"time_period": "now", "character": "Daughter", "meaning": "determination"}
            ]
        )
    """
    from engines.core import EngineContext
    context = EngineContext("temporal_creation", "musical")
    engine = TemporalSpiral()
    engine.attach_context(context)

    return engine.generate({
        "shape": "echo_scene",
        "shared_text": shared_text,
        "time_periods": [m["time_period"] for m in moments],
        "characters": [m["character"] for m in moments]
    })[0]
