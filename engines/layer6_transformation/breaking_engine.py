"""
THE BREAKING ENGINE
===================

Layer 6: Destruction/Rebirth

"A systematic destroyer of your comfort zone. It doesn't just identify
problems - it GENERATES alternatives. It HUNTS mediocrity."

The Breaking Engine automates creative courage. Most writers know their
work is too safe but can't bring themselves to break it. The Engine removes the choice.
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


class MediocrityType(Enum):
    """Types of mediocrity the engine hunts"""
    GENERIC = "generic"
    CONVENIENT_VILLAIN = "convenient_villain"
    TRAUMA_SERVES_PLOT = "trauma_serves_plot"
    TOO_CONSISTENT = "too_consistent"
    TOO_SYMPATHETIC = "too_sympathetic"
    TOO_CLEAN = "too_clean"
    FALSE_STAKES = "false_stakes"
    EASY_RESOLUTION = "easy_resolution"


class BreakingIntensity(Enum):
    """How hard to break things"""
    GENTLE = "gentle"       # Suggestions and alternatives
    FIRM = "firm"           # Clear problems identified
    AGGRESSIVE = "aggressive"  # Everything questioned
    NUCLEAR = "nuclear"     # Scorched earth


@dataclass
class MediocrityDetection:
    """A detected instance of mediocrity"""
    mediocrity_type: MediocrityType
    location: str
    description: str
    evidence: str
    severity: float  # 0.0 - 1.0
    suggestion: str


@dataclass
class ChaosVector:
    """An alternative that could break the safe choice"""
    id: str
    target: str
    current_state: str
    chaos_injection: str
    why_it_works: str
    danger_level: float  # 0.0 - 1.0
    dramatic_potential: str


@dataclass
class BreakingReport:
    """Complete breaking analysis"""
    id: str
    target: str
    detections: List[MediocrityDetection]
    chaos_vectors: List[ChaosVector]
    overall_safety_score: float  # 0.0 = dangerously safe, 1.0 = appropriately risky
    recommended_breaks: List[str]
    warnings: List[str]


# Detection patterns - what the engine looks for
GENERIC_PATTERNS = [
    ("asian-american", "Be specific: Japanese-American from Gardena? Korean adoptee? Third-generation Chinese from San Francisco?"),
    ("immigrant", "Which generation? From where? What specific cultural markers?"),
    ("working class", "What job specifically? What union? What shift?"),
    ("trauma", "What specific trauma? Be uncomfortably precise."),
    ("abuse", "What kind? When? By whom? The specifics matter."),
    ("alcoholic", "Functional? Recovering? Relapsed? Hiding it? Proud of it?"),
    ("mental illness", "Which one? Diagnosed? Medicated? Managed? Raging?")
]

VILLAIN_PATTERNS = [
    "antagonist with no sympathetic motivation",
    "evil for evil's sake",
    "no backstory that explains (not excuses) their actions",
    "simply 'bad person'",
    "obstacle rather than character"
]

TRAUMA_AS_PLOT_PATTERNS = [
    "trauma only matters when advancing story",
    "abuse mentioned then never affecting character",
    "convenient tragic backstory",
    "trauma without ongoing cost",
    "past wound that only surfaces when needed"
]

# Chaos injection library
CHAOS_VECTORS_LIBRARY = {
    "scene_too_clean": [
        "Someone is lying and we don't know who",
        "Someone desperately needs to pee",
        "The power dynamic secretly reversed three scenes ago",
        "One character is thinking about suicide and hiding it",
        "The room contains an object that will destroy a relationship if discovered",
        "Someone has already betrayed everyone",
        "The person with the most power is the most afraid",
        "What looks like love is actually negotiation"
    ],
    "character_too_simple": [
        "Their stated motivation is a cover for something shameful",
        "They're performing who they think they should be",
        "They have a secret that would make us hate them",
        "They have a secret that would make us love them",
        "Their 'flaw' is actually their only real thing",
        "They know more than they're saying",
        "They're not the protagonist of their own life"
    ],
    "relationship_too_clear": [
        "There's a third person neither is mentioning",
        "One of them is already gone, just hasn't left yet",
        "The power dynamic is opposite of what it looks like",
        "They're both performing for an audience that isn't there",
        "What looks like conflict is actually intimacy",
        "What looks like intimacy is actually warfare"
    ],
    "ending_too_easy": [
        "The cost is higher than shown",
        "Someone loses who shouldn't have",
        "The victory is also a death",
        "The resolution opens a new wound",
        "What was gained comes with a price tag",
        "Someone knows the truth but will never tell"
    ]
}

# Alternative revelations for common tropes
ALTERNATIVE_REVELATIONS = {
    "villain_is_bad": [
        "The villain is cosplaying someone they lost",
        "The villain is right about something important",
        "The villain was the hero of a story we didn't see",
        "The villain and protagonist would be friends in different circumstances",
        "The villain is trying to prevent something worse"
    ],
    "hero_is_good": [
        "The hero has done something unforgivable",
        "The hero's motivation is partly selfish",
        "The hero is fleeing, not pursuing",
        "The hero is the villain of someone else's story",
        "The hero would do exactly what the villain did, given the same circumstances"
    ],
    "love_is_pure": [
        "The love is also transactional",
        "One person loves more than the other",
        "The love requires someone else's diminishment",
        "The love was built on a misunderstanding",
        "The love might be a trauma response"
    ],
    "family_is_everything": [
        "This family is a prison",
        "Family loyalty has crushed someone's truth",
        "The family secret everyone protects is destroying them",
        "The best thing for someone is to leave",
        "Family love and family damage are the same thing"
    ]
}


@EngineRegistry.register
class BreakingEngine(CreativeEngine):
    """
    The Breaking Engine - systematic destroyer of comfort zones.

    Hunts mediocrity and generates alternatives.
    Automates creative courage.
    """

    def __init__(self):
        super().__init__("BreakingEngine", EngineLayer.TRANSFORMATION)
        self._reports: Dict[str, BreakingReport] = {}
        self.depends_on("GhostCouncil")

    def process(self, artifact: CreativeArtifact) -> CreativeArtifact:
        """
        Process an artifact through the Breaking Engine.
        Hunt for mediocrity and generate alternatives.
        """
        # Scan for mediocrity
        detections = self._scan_for_mediocrity(artifact)
        artifact.add_insight(self.name, "mediocrity_detections", [
            {"type": d.mediocrity_type.value, "description": d.description}
            for d in detections
        ])

        # Generate chaos vectors
        vectors = self._generate_chaos_vectors(artifact, detections)
        artifact.add_insight(self.name, "chaos_vectors", [
            {"target": v.target, "injection": v.chaos_injection}
            for v in vectors
        ])

        # Calculate safety score
        safety_score = self._calculate_safety_score(detections)
        artifact.add_insight(self.name, "safety_score", {
            "score": safety_score,
            "interpretation": "dangerously safe" if safety_score < 0.3 else "appropriately risky"
        })

        # Generate recommendations
        recommendations = self._generate_recommendations(detections, vectors)
        artifact.add_insight(self.name, "breaking_recommendations", recommendations)

        return artifact

    def generate(self, seed: Optional[Dict[str, Any]] = None) -> List[CreativeArtifact]:
        """
        Generate a breaking report.

        Seed parameters:
        - target: what to analyze
        - intensity: BreakingIntensity level
        - focus: specific aspect to break ('character', 'scene', 'relationship', etc.)
        """
        seed = seed or {}
        target = seed.get("target", "The work")
        intensity = seed.get("intensity", BreakingIntensity.FIRM)
        focus = seed.get("focus", "general")

        report = self.analyze(target, intensity, focus)
        return [self._report_to_artifact(report)]

    def analyze(self, target: str, intensity: BreakingIntensity = BreakingIntensity.FIRM,
               focus: str = "general") -> BreakingReport:
        """
        Analyze a target for mediocrity and generate breaking alternatives.

        Example:
            report = analyze(
                "Claire's relationship with David",
                intensity=BreakingIntensity.AGGRESSIVE,
                focus="relationship"
            )
        """
        # Scan for mediocrity
        detections = self._perform_scan(target, intensity, focus)

        # Generate chaos vectors based on focus
        vectors = self._create_chaos_vectors(target, focus, len(detections))

        # Calculate safety score
        safety_score = self._calculate_safety_score(detections)

        # Generate recommendations
        recommendations = self._create_recommendations(detections, vectors, intensity)

        # Generate warnings
        warnings = self._generate_warnings(intensity, vectors)

        report = BreakingReport(
            id=generate_artifact_id("break"),
            target=target,
            detections=detections,
            chaos_vectors=vectors,
            overall_safety_score=safety_score,
            recommended_breaks=recommendations,
            warnings=warnings
        )

        self._reports[report.id] = report
        return report

    def inject_chaos(self, target: str, chaos_type: str = "scene_too_clean") -> List[ChaosVector]:
        """
        Inject chaos into a specific target.

        Returns multiple chaos alternatives.
        """
        options = CHAOS_VECTORS_LIBRARY.get(chaos_type, CHAOS_VECTORS_LIBRARY["scene_too_clean"])

        vectors = []
        for i, option in enumerate(random.sample(options, min(5, len(options)))):
            vector = ChaosVector(
                id=generate_artifact_id("chaos"),
                target=target,
                current_state="Too safe, too expected",
                chaos_injection=option,
                why_it_works=f"Subverts expectation while deepening truth",
                danger_level=random.uniform(0.5, 1.0),
                dramatic_potential="High - creates genuine conflict"
            )
            vectors.append(vector)

        return vectors

    def challenge_trope(self, trope: str) -> List[str]:
        """
        Challenge a common trope with alternatives.

        Example:
            alternatives = challenge_trope("villain_is_bad")
        """
        return ALTERNATIVE_REVELATIONS.get(trope.lower(), [
            "What if this trope is a lie the story tells itself?",
            "What would happen if we inverted this completely?",
            "What's the version of this that makes everyone uncomfortable?"
        ])

    def detect_generic(self, text: str) -> List[Dict[str, str]]:
        """
        Detect generic language and suggest specifics.

        Example:
            "You wrote 'Asian-American.' Did you mean third-generation
            Japanese-American from Gardena whose grandfather was in Manzanar?"
        """
        detections = []
        text_lower = text.lower()

        for pattern, suggestion in GENERIC_PATTERNS:
            if pattern in text_lower:
                detections.append({
                    "generic_term": pattern,
                    "question": f"You wrote '{pattern}.' {suggestion}",
                    "why_it_matters": "Specificity creates authenticity. Generic creates distance."
                })

        return detections

    def flip_protagonist_antagonist(self, situation: str) -> Dict[str, Any]:
        """
        What if the villain was right?

        Explores the antagonist's perspective as valid.
        """
        return {
            "original": situation,
            "flip": "What if the antagonist was RIGHT about the central issue?",
            "implications": [
                "The protagonist might be the real problem",
                "The antagonist's methods were wrong but motivation was correct",
                "What we thought was the story isn't the real story",
                "The audience has been rooting for the wrong person"
            ],
            "questions_to_answer": [
                "What world view makes the antagonist the hero?",
                "What has the protagonist done that we haven't examined?",
                "Who benefits from us seeing the antagonist as wrong?"
            ]
        }

    def add_uncontrollable_cost(self, positive_outcome: str) -> List[str]:
        """
        Add uncontrollable cost to a positive outcome.

        Freedom isn't free - someone else pays.
        """
        return [
            f"But achieving {positive_outcome} costs something you can't give back",
            f"Someone else loses what you gained from {positive_outcome}",
            f"The person who helped you achieve {positive_outcome} is destroyed by it",
            f"Your children will pay for {positive_outcome}",
            f"{positive_outcome} requires betraying someone who trusted you",
            f"You can only have {positive_outcome} by becoming what you hate"
        ]

    def _scan_for_mediocrity(self, artifact: CreativeArtifact) -> List[MediocrityDetection]:
        """Scan artifact for mediocrity patterns"""
        content = str(artifact.content).lower()
        detections = []

        # Check for generic patterns
        for pattern, _ in GENERIC_PATTERNS:
            if pattern in content:
                detections.append(MediocrityDetection(
                    mediocrity_type=MediocrityType.GENERIC,
                    location="content",
                    description=f"Generic term detected: '{pattern}'",
                    evidence=f"Found '{pattern}' without specificity",
                    severity=0.6,
                    suggestion="Be uncomfortably specific"
                ))

        # Check for villain patterns
        for pattern in VILLAIN_PATTERNS:
            if any(word in content for word in pattern.split()):
                detections.append(MediocrityDetection(
                    mediocrity_type=MediocrityType.CONVENIENT_VILLAIN,
                    location="character",
                    description="Possible convenient villain",
                    evidence=f"Pattern detected: {pattern}",
                    severity=0.7,
                    suggestion="Give antagonist sympathetic motivation"
                ))
                break

        return detections

    def _generate_chaos_vectors(self, artifact: CreativeArtifact,
                               detections: List[MediocrityDetection]) -> List[ChaosVector]:
        """Generate chaos vectors based on detections"""
        vectors = []

        for detection in detections:
            if detection.mediocrity_type == MediocrityType.GENERIC:
                vectors.append(ChaosVector(
                    id=generate_artifact_id("chaos"),
                    target=detection.location,
                    current_state=detection.description,
                    chaos_injection="Replace generic with uncomfortable specificity",
                    why_it_works="Specific details create authenticity",
                    danger_level=0.4,
                    dramatic_potential="Grounds the story in reality"
                ))

        # Always add some chaos options
        options = random.sample(CHAOS_VECTORS_LIBRARY["scene_too_clean"], 3)
        for option in options:
            vectors.append(ChaosVector(
                id=generate_artifact_id("chaos"),
                target="general",
                current_state="Current state",
                chaos_injection=option,
                why_it_works="Subverts comfort",
                danger_level=random.uniform(0.5, 0.9),
                dramatic_potential="High"
            ))

        return vectors

    def _calculate_safety_score(self, detections: List[MediocrityDetection]) -> float:
        """Calculate how 'safe' (mediocre) the work is"""
        if not detections:
            return 0.5  # Unknown safety

        total_severity = sum(d.severity for d in detections)
        avg_severity = total_severity / len(detections)

        # Higher severity = lower safety score (more mediocrity)
        # But we want to encourage risk, so low score = dangerously safe
        return 1.0 - avg_severity

    def _generate_recommendations(self, detections: List[MediocrityDetection],
                                 vectors: List[ChaosVector]) -> List[str]:
        """Generate recommendations based on analysis"""
        recommendations = []

        for detection in detections:
            recommendations.append(detection.suggestion)

        for vector in vectors[:3]:
            recommendations.append(f"Consider: {vector.chaos_injection}")

        return recommendations

    def _perform_scan(self, target: str, intensity: BreakingIntensity,
                     focus: str) -> List[MediocrityDetection]:
        """Perform mediocrity scan"""
        detections = []
        target_lower = target.lower()

        # Intensity affects how harsh the detections are
        severity_multiplier = {
            BreakingIntensity.GENTLE: 0.5,
            BreakingIntensity.FIRM: 1.0,
            BreakingIntensity.AGGRESSIVE: 1.3,
            BreakingIntensity.NUCLEAR: 1.5
        }.get(intensity, 1.0)

        # Check for generic patterns
        for pattern, suggestion in GENERIC_PATTERNS:
            if pattern in target_lower:
                detections.append(MediocrityDetection(
                    mediocrity_type=MediocrityType.GENERIC,
                    location=focus,
                    description=f"Generic term: '{pattern}'",
                    evidence=f"Found in target",
                    severity=min(1.0, 0.5 * severity_multiplier),
                    suggestion=suggestion
                ))

        # Add focus-specific detections
        focus_detections = {
            "character": [
                MediocrityDetection(
                    MediocrityType.TOO_CONSISTENT,
                    "character",
                    "Character may be too consistent",
                    "Real humans contradict themselves",
                    0.4 * severity_multiplier,
                    "Add contradiction between stated values and actions"
                )
            ],
            "relationship": [
                MediocrityDetection(
                    MediocrityType.TOO_CLEAN,
                    "relationship",
                    "Relationship may be too clear",
                    "Real relationships have hidden dynamics",
                    0.5 * severity_multiplier,
                    "Add a power dynamic that isn't what it looks like"
                )
            ],
            "scene": [
                MediocrityDetection(
                    MediocrityType.TOO_CLEAN,
                    "scene",
                    "Scene may be too clean",
                    "Real moments have mess",
                    0.4 * severity_multiplier,
                    "Someone is lying or hiding something"
                )
            ]
        }

        detections.extend(focus_detections.get(focus, []))
        return detections

    def _create_chaos_vectors(self, target: str, focus: str,
                             num_detections: int) -> List[ChaosVector]:
        """Create chaos vectors for target"""
        vectors = []

        # Select appropriate chaos library
        chaos_key = {
            "character": "character_too_simple",
            "relationship": "relationship_too_clear",
            "scene": "scene_too_clean",
            "ending": "ending_too_easy"
        }.get(focus, "scene_too_clean")

        options = CHAOS_VECTORS_LIBRARY.get(chaos_key, CHAOS_VECTORS_LIBRARY["scene_too_clean"])

        num_vectors = min(5, max(3, num_detections + 2))
        selected = random.sample(options, min(num_vectors, len(options)))

        for option in selected:
            vectors.append(ChaosVector(
                id=generate_artifact_id("chaos"),
                target=target,
                current_state="Current state is too comfortable",
                chaos_injection=option,
                why_it_works="Subverts expectation, deepens truth",
                danger_level=random.uniform(0.5, 1.0),
                dramatic_potential="Creates genuine conflict and surprise"
            ))

        return vectors

    def _create_recommendations(self, detections: List[MediocrityDetection],
                               vectors: List[ChaosVector],
                               intensity: BreakingIntensity) -> List[str]:
        """Create recommendations based on intensity"""
        recommendations = []

        # Add detection-based recommendations
        for d in detections:
            recommendations.append(d.suggestion)

        # Add chaos vector recommendations
        for v in vectors[:3]:
            if intensity == BreakingIntensity.GENTLE:
                recommendations.append(f"Consider exploring: {v.chaos_injection}")
            elif intensity == BreakingIntensity.FIRM:
                recommendations.append(f"You should: {v.chaos_injection}")
            elif intensity == BreakingIntensity.AGGRESSIVE:
                recommendations.append(f"Do this now: {v.chaos_injection}")
            else:  # NUCLEAR
                recommendations.append(f"MANDATORY: {v.chaos_injection}")

        return recommendations

    def _generate_warnings(self, intensity: BreakingIntensity,
                          vectors: List[ChaosVector]) -> List[str]:
        """Generate warnings about breaking"""
        warnings = []

        if intensity in [BreakingIntensity.AGGRESSIVE, BreakingIntensity.NUCLEAR]:
            warnings.append("High-intensity breaking may destroy structure. Have backup.")

        high_danger = [v for v in vectors if v.danger_level > 0.8]
        if high_danger:
            warnings.append(f"{len(high_danger)} chaos vectors have danger level > 0.8")

        warnings.append("Breaking creates discomfort. Discomfort creates art.")

        return warnings

    def _report_to_artifact(self, report: BreakingReport) -> CreativeArtifact:
        """Convert report to artifact"""
        return CreativeArtifact(
            id=report.id,
            artifact_type="breaking_report",
            content={
                "target": report.target,
                "safety_score": report.overall_safety_score,
                "safety_interpretation": "dangerously safe" if report.overall_safety_score < 0.3 else "appropriately risky",
                "detections": [
                    {
                        "type": d.mediocrity_type.value,
                        "description": d.description,
                        "severity": d.severity,
                        "suggestion": d.suggestion
                    } for d in report.detections
                ],
                "chaos_vectors": [
                    {
                        "target": v.target,
                        "injection": v.chaos_injection,
                        "danger_level": v.danger_level,
                        "dramatic_potential": v.dramatic_potential
                    } for v in report.chaos_vectors
                ],
                "recommended_breaks": report.recommended_breaks,
                "warnings": report.warnings
            },
            source_engine=self.name
        )


# Convenience functions
def break_analysis(target: str, intensity: str = "firm") -> CreativeArtifact:
    """
    Analyze and break mediocrity.

    Example:
        report = break_analysis(
            "David is the perfect villain who controls everything",
            intensity="aggressive"
        )
    """
    from engines.core import EngineContext
    context = EngineContext("breaking_engine", "musical")
    engine = BreakingEngine()
    engine.attach_context(context)

    intensity_enum = BreakingIntensity[intensity.upper()] if intensity.upper() in BreakingIntensity.__members__ else BreakingIntensity.FIRM

    return engine.generate({
        "target": target,
        "intensity": intensity_enum
    })[0]


def inject_chaos_into(target: str, chaos_type: str = "scene_too_clean") -> List[ChaosVector]:
    """
    Inject chaos alternatives into a target.

    Example:
        alternatives = inject_chaos_into("The final confrontation")
    """
    engine = BreakingEngine()
    return engine.inject_chaos(target, chaos_type)
