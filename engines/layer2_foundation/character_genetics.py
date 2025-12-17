"""
THE CHARACTER GENETICS ENGINE
==============================

Layer 2a: DNA Foundation

"Recognition that no character is born from nothing. They carry narrative DNA -
inherited traits, trauma, patterns."

Characters exist in LINEAGES. Ruby is not just Ruby - she's her mother's grief,
her father's ambition, her grandmother's secret, all combined into one woman
who thinks she's free.
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


class TraitCategory(Enum):
    """Categories of character traits"""
    VISIBLE = "visible"    # What they show to the world
    SHADOW = "shadow"      # What they suppress
    INHERITED = "inherited"
    TRAUMA = "trauma"
    CULTURAL = "cultural"


@dataclass
class CharacterTrait:
    """A single trait with visibility and source"""
    name: str
    category: TraitCategory
    dominance: float  # 0.0 = deeply recessive, 1.0 = always expressing
    source: Optional[str] = None  # Who they inherited it from
    triggered_by: Optional[str] = None  # What activates recessive traits
    suppresses: Optional[str] = None  # What other trait this hides


@dataclass
class TraumaMarker:
    """A traumatic event that shapes the character"""
    description: str
    age_occurred: int
    compensation_behavior: str  # How they adapted
    activation_triggers: List[str]  # What brings it back
    generation: int = 0  # 0 = personal, 1 = parent, 2 = grandparent, etc.


@dataclass
class CharacterHelix:
    """
    The double helix of character DNA.
    Visible strand: What they show
    Shadow strand: What they suppress
    """
    visible_strand: List[CharacterTrait]
    shadow_strand: List[CharacterTrait]

    def get_visible_traits(self) -> List[str]:
        """Get currently expressing visible traits"""
        return [t.name for t in self.visible_strand if t.dominance > 0.5]

    def get_shadow_traits(self) -> List[str]:
        """Get suppressed shadow traits"""
        return [t.name for t in self.shadow_strand]

    def get_conflict_points(self) -> List[Tuple[str, str]]:
        """Find traits in tension with each other"""
        conflicts = []
        for visible in self.visible_strand:
            if visible.suppresses:
                for shadow in self.shadow_strand:
                    if shadow.name.lower() == visible.suppresses.lower():
                        conflicts.append((visible.name, shadow.name))
        return conflicts


@dataclass
class FamilyMember:
    """A family member in the character's lineage"""
    role: str  # mother, father, grandmother, etc.
    name: Optional[str]
    traits_contributed: List[CharacterTrait]
    traumas_contributed: List[TraumaMarker]
    secret: Optional[str] = None  # Hidden truth that affects inheritance


@dataclass
class CharacterDNA:
    """
    Complete genetic profile of a character.
    Includes inherited traits, trauma markers, and family tree.
    """
    helix: CharacterHelix
    trauma_markers: List[TraumaMarker]
    family_tree: List[FamilyMember]
    cultural_chromosomes: Dict[str, str]  # Specific cultural details, not generic
    recessive_genes: List[CharacterTrait]  # Traits that skip generations then erupt

    def get_genetic_summary(self) -> Dict[str, Any]:
        """Get a summary of the genetic profile"""
        return {
            "visible_traits": self.helix.get_visible_traits(),
            "shadow_traits": self.helix.get_shadow_traits(),
            "conflicts": self.helix.get_conflict_points(),
            "inherited_traumas": [t for t in self.trauma_markers if t.generation > 0],
            "personal_traumas": [t for t in self.trauma_markers if t.generation == 0],
            "recessive_genes": [g.name for g in self.recessive_genes],
            "cultural_specifics": self.cultural_chromosomes
        }


# Common trait libraries
VISIBLE_TRAIT_LIBRARY = [
    "perfectionism", "caretaking", "performance", "control", "charm",
    "competence", "stoicism", "humor", "ambition", "nurturing",
    "independence", "compliance", "righteousness", "helpfulness"
]

SHADOW_TRAIT_LIBRARY = [
    "shame", "hunger", "submission", "wildness", "rage", "grief",
    "terror", "envy", "lust", "selfishness", "cruelty", "despair",
    "neediness", "violence", "addiction"
]

COMPENSATION_BEHAVIORS = [
    "hyper-achievement", "people-pleasing", "emotional shutdown",
    "control of environment", "perfectionism in appearance",
    "caretaking others", "substance use", "workaholism",
    "serial relationships", "isolation", "performance of normalcy"
]

# Archetypal family patterns
FAMILY_PATTERNS = {
    "the_martyr_mother": {
        "traits": ["caretaking", "self-sacrifice", "suppressed_rage"],
        "secret": "She had dreams she abandoned for family",
        "inherited_trauma": "Her own mother was unavailable"
    },
    "the_absent_father": {
        "traits": ["emotional_distance", "provider_focus", "unexpressed_love"],
        "secret": "He was raised to never show weakness",
        "inherited_trauma": "His father left at age 10"
    },
    "the_wild_grandmother": {
        "traits": ["suppressed_sexuality", "social_rebellion", "artistic_yearning"],
        "secret": "She ran off with someone inappropriate",
        "inherited_trauma": "Forced marriage at young age"
    },
    "the_stoic_grandfather": {
        "traits": ["emotional_suppression", "duty", "silent_suffering"],
        "secret": "Saw things in war he never spoke of",
        "inherited_trauma": "Loss of siblings in childhood"
    },
    "the_golden_sibling": {
        "traits": ["achievement", "approval_seeking", "hidden_fragility"],
        "secret": "The pressure to perform is crushing",
        "inherited_trauma": "Parental disappointment projected onto them"
    },
    "the_black_sheep": {
        "traits": ["rebellion", "truth_telling", "scapegoating"],
        "secret": "They see what the family refuses to see",
        "inherited_trauma": "Designated carrier of family shadow"
    }
}


@dataclass
class Character:
    """A character with full genetic profile"""
    id: str
    name: str
    age: int
    dna: CharacterDNA
    current_arc_position: str = "before_awakening"  # before, during, after
    primary_wound: Optional[str] = None
    core_desire: Optional[str] = None
    core_fear: Optional[str] = None

    def to_artifact(self) -> CreativeArtifact:
        """Convert to CreativeArtifact for pipeline"""
        return CreativeArtifact(
            id=self.id,
            artifact_type="character",
            content={
                "name": self.name,
                "age": self.age,
                "genetic_summary": self.dna.get_genetic_summary(),
                "arc_position": self.current_arc_position,
                "primary_wound": self.primary_wound,
                "core_desire": self.core_desire,
                "core_fear": self.core_fear
            },
            source_engine="CharacterGenetics"
        )


@EngineRegistry.register
class CharacterGenetics(CreativeEngine):
    """
    The Character Genetics Engine - DNA foundation for characters.

    Creates characters with inherited traits, trauma patterns, and family lineages.
    Characters are not born from nothing - they carry narrative DNA.
    """

    def __init__(self):
        super().__init__("CharacterGenetics", EngineLayer.FOUNDATION)
        self._character_pool: Dict[str, Character] = {}

    def process(self, artifact: CreativeArtifact) -> CreativeArtifact:
        """
        Process a character artifact - analyze and deepen their genetics.
        """
        if artifact.artifact_type != "character":
            return artifact

        # Analyze visible/shadow conflict
        conflicts = self._analyze_conflicts(artifact)
        artifact.add_insight(self.name, "internal_conflicts", conflicts)

        # Identify recessive genes ready to erupt
        eruptions = self._identify_eruptions(artifact)
        artifact.add_insight(self.name, "pending_eruptions", eruptions)

        # Trace trauma inheritance
        trauma_map = self._trace_trauma_inheritance(artifact)
        artifact.add_insight(self.name, "trauma_inheritance", trauma_map)

        # Suggest character evolution
        evolution = self._suggest_evolution(artifact)
        artifact.add_insight(self.name, "evolution_potential", evolution)

        return artifact

    def generate(self, seed: Optional[Dict[str, Any]] = None) -> List[CreativeArtifact]:
        """
        Generate a new character with genetic profile.

        Seed parameters:
        - name: character name
        - age: character age
        - family_patterns: list of patterns from FAMILY_PATTERNS
        - visible_traits: list of visible trait names
        - shadow_traits: list of shadow trait names
        - cultural_background: dict of specific cultural details
        """
        seed = seed or {}

        character = self._generate_character(
            name=seed.get("name", self._generate_name()),
            age=seed.get("age", random.randint(25, 55)),
            family_patterns=seed.get("family_patterns", []),
            visible_traits=seed.get("visible_traits", []),
            shadow_traits=seed.get("shadow_traits", []),
            cultural_background=seed.get("cultural_background", {})
        )

        self._character_pool[character.id] = character
        return [character.to_artifact()]

    def breed(self, char_a: Character, char_b: Character) -> Character:
        """
        Breed two characters to create offspring character.

        The offspring inherits traits from both, with some dominant,
        some recessive, and potential for mutation.
        """
        offspring_helix = self._breed_helixes(char_a.dna.helix, char_b.dna.helix)

        # Inherit traumas (some skip generations)
        inherited_traumas = []
        for trauma in char_a.dna.trauma_markers + char_b.dna.trauma_markers:
            if random.random() < 0.5:  # 50% inheritance chance
                new_trauma = TraumaMarker(
                    description=f"Inherited: {trauma.description}",
                    age_occurred=0,  # Present from birth
                    compensation_behavior=trauma.compensation_behavior,
                    activation_triggers=trauma.activation_triggers,
                    generation=trauma.generation + 1
                )
                inherited_traumas.append(new_trauma)

        # Combine family trees
        combined_family = char_a.dna.family_tree + char_b.dna.family_tree

        # Merge cultural chromosomes
        merged_culture = {**char_a.dna.cultural_chromosomes, **char_b.dna.cultural_chromosomes}

        # Identify recessive genes
        recessive = []
        for trait in char_a.dna.recessive_genes + char_b.dna.recessive_genes:
            if random.random() < 0.3:  # 30% chance recessive survives to next gen
                recessive.append(trait)

        offspring_dna = CharacterDNA(
            helix=offspring_helix,
            trauma_markers=inherited_traumas,
            family_tree=combined_family,
            cultural_chromosomes=merged_culture,
            recessive_genes=recessive
        )

        offspring = Character(
            id=generate_artifact_id("char"),
            name=f"Offspring of {char_a.name} × {char_b.name}",
            age=0,
            dna=offspring_dna
        )

        self._character_pool[offspring.id] = offspring
        return offspring

    def breed_with_archetype(self, character: Character, archetype: str) -> Character:
        """
        Breed character with an archetype.

        "Mickey × The Trickster" = character who manipulates through humor
        """
        archetype_traits = self._get_archetype_traits(archetype)

        # Add archetypal traits to shadow or visible
        new_helix = CharacterHelix(
            visible_strand=character.dna.helix.visible_strand.copy(),
            shadow_strand=character.dna.helix.shadow_strand.copy()
        )

        for trait_name in archetype_traits:
            new_trait = CharacterTrait(
                name=trait_name,
                category=TraitCategory.SHADOW,
                dominance=random.uniform(0.3, 0.7),
                source=f"Archetype: {archetype}"
            )
            new_helix.shadow_strand.append(new_trait)

        new_dna = CharacterDNA(
            helix=new_helix,
            trauma_markers=character.dna.trauma_markers.copy(),
            family_tree=character.dna.family_tree.copy(),
            cultural_chromosomes=character.dna.cultural_chromosomes.copy(),
            recessive_genes=character.dna.recessive_genes.copy()
        )

        hybrid = Character(
            id=generate_artifact_id("char"),
            name=f"{character.name} × {archetype}",
            age=character.age,
            dna=new_dna
        )

        self._character_pool[hybrid.id] = hybrid
        return hybrid

    def trigger_eruption(self, character: Character, trigger: str) -> Dict[str, Any]:
        """
        Trigger a recessive gene to erupt.

        "Claire's grandmother's gene is erupting in Claire"
        """
        eruption_report = {
            "triggered_trait": None,
            "source": None,
            "behavioral_change": None,
            "dramatic_potential": []
        }

        for recessive in character.dna.recessive_genes:
            if recessive.triggered_by and trigger.lower() in recessive.triggered_by.lower():
                eruption_report["triggered_trait"] = recessive.name
                eruption_report["source"] = recessive.source
                eruption_report["behavioral_change"] = f"{character.name}'s {recessive.name} surfaces"
                eruption_report["dramatic_potential"] = [
                    f"{character.name} begins acting like {recessive.source}",
                    f"Family members notice the change with horror/recognition",
                    f"The character doesn't understand where these impulses come from",
                    f"What was suppressed for generations finally expresses"
                ]
                break

        return eruption_report

    def _generate_character(self, name: str, age: int, family_patterns: List[str],
                          visible_traits: List[str], shadow_traits: List[str],
                          cultural_background: Dict[str, str]) -> Character:
        """Generate a complete character from parameters"""

        # Build visible strand
        visible_strand = []
        traits_to_use = visible_traits if visible_traits else random.sample(VISIBLE_TRAIT_LIBRARY, 3)
        for trait_name in traits_to_use:
            visible_strand.append(CharacterTrait(
                name=trait_name,
                category=TraitCategory.VISIBLE,
                dominance=random.uniform(0.6, 1.0)
            ))

        # Build shadow strand
        shadow_strand = []
        shadow_to_use = shadow_traits if shadow_traits else random.sample(SHADOW_TRAIT_LIBRARY, 3)
        for trait_name in shadow_to_use:
            shadow_strand.append(CharacterTrait(
                name=trait_name,
                category=TraitCategory.SHADOW,
                dominance=random.uniform(0.1, 0.5)
            ))

        helix = CharacterHelix(visible_strand=visible_strand, shadow_strand=shadow_strand)

        # Build family tree from patterns
        family_tree = []
        for pattern_key in family_patterns:
            if pattern_key in FAMILY_PATTERNS:
                pattern = FAMILY_PATTERNS[pattern_key]
                role = pattern_key.replace("the_", "").replace("_", " ")
                traits = [CharacterTrait(
                    name=t,
                    category=TraitCategory.INHERITED,
                    dominance=random.uniform(0.3, 0.7),
                    source=role
                ) for t in pattern["traits"]]

                traumas = [TraumaMarker(
                    description=pattern["inherited_trauma"],
                    age_occurred=random.randint(5, 20),
                    compensation_behavior=random.choice(COMPENSATION_BEHAVIORS),
                    activation_triggers=[pattern["secret"]],
                    generation=1
                )]

                family_tree.append(FamilyMember(
                    role=role,
                    name=None,
                    traits_contributed=traits,
                    traumas_contributed=traumas,
                    secret=pattern["secret"]
                ))

        # Generate trauma markers
        trauma_markers = []
        for member in family_tree:
            trauma_markers.extend(member.traumas_contributed)

        # Add personal trauma
        trauma_markers.append(TraumaMarker(
            description="Defining moment of loss or violation",
            age_occurred=random.randint(8, 18),
            compensation_behavior=random.choice(COMPENSATION_BEHAVIORS),
            activation_triggers=["intimacy", "vulnerability", "loss of control"],
            generation=0
        ))

        # Identify recessive genes
        recessive_genes = []
        for member in family_tree:
            for trait in member.traits_contributed:
                if random.random() < 0.3:  # 30% become recessive
                    recessive_trait = CharacterTrait(
                        name=trait.name,
                        category=TraitCategory.SHADOW,
                        dominance=0.1,
                        source=member.role,
                        triggered_by="empty nest, crisis, trauma anniversary"
                    )
                    recessive_genes.append(recessive_trait)

        dna = CharacterDNA(
            helix=helix,
            trauma_markers=trauma_markers,
            family_tree=family_tree,
            cultural_chromosomes=cultural_background,
            recessive_genes=recessive_genes
        )

        # Determine wound, desire, fear
        wound = f"Early experience of {shadow_strand[0].name if shadow_strand else 'loss'}"
        desire = f"To be seen as {visible_strand[0].name if visible_strand else 'worthy'}"
        fear = f"Being exposed as {shadow_strand[0].name if shadow_strand else 'broken'}"

        return Character(
            id=generate_artifact_id("char"),
            name=name,
            age=age,
            dna=dna,
            primary_wound=wound,
            core_desire=desire,
            core_fear=fear
        )

    def _generate_name(self) -> str:
        """Generate a placeholder name"""
        first_names = ["Claire", "David", "Jessica", "Michael", "Ruby", "Marcus", "Elena", "James"]
        last_names = ["Morrison", "Sterling", "Chen", "O'Brien", "Williams", "Park", "Santos"]
        return f"{random.choice(first_names)} {random.choice(last_names)}"

    def _breed_helixes(self, helix_a: CharacterHelix, helix_b: CharacterHelix) -> CharacterHelix:
        """Combine two helixes"""
        combined_visible = []
        combined_shadow = []

        # Mix visible traits
        all_visible = helix_a.visible_strand + helix_b.visible_strand
        for trait in all_visible:
            if random.random() < trait.dominance:
                combined_visible.append(CharacterTrait(
                    name=trait.name,
                    category=TraitCategory.VISIBLE,
                    dominance=trait.dominance * random.uniform(0.8, 1.2),
                    source=trait.source
                ))

        # Mix shadow traits
        all_shadow = helix_a.shadow_strand + helix_b.shadow_strand
        for trait in all_shadow:
            combined_shadow.append(CharacterTrait(
                name=trait.name,
                category=TraitCategory.SHADOW,
                dominance=trait.dominance * random.uniform(0.8, 1.2),
                source=trait.source
            ))

        return CharacterHelix(visible_strand=combined_visible, shadow_strand=combined_shadow)

    def _get_archetype_traits(self, archetype: str) -> List[str]:
        """Get traits associated with an archetype"""
        archetypes = {
            "trickster": ["manipulation", "humor", "boundary_crossing", "truth_through_lies"],
            "mother": ["nurturing", "sacrifice", "control", "unconditional_love"],
            "father": ["authority", "protection", "judgment", "provision"],
            "shadow": ["repression", "darkness", "forbidden_desire", "power"],
            "anima": ["feeling", "intuition", "connection", "eros"],
            "animus": ["reason", "action", "logos", "spirit"],
            "wise_elder": ["wisdom", "guidance", "secrets", "mortality"],
            "child": ["innocence", "wonder", "vulnerability", "new_beginning"],
            "hero": ["courage", "sacrifice", "transformation", "boon"],
            "villain": ["opposition", "shadow_projection", "necessary_evil", "mirror"]
        }
        return archetypes.get(archetype.lower(), ["unknown_archetype"])

    def _analyze_conflicts(self, artifact: CreativeArtifact) -> List[Dict[str, str]]:
        """Analyze internal conflicts from visible/shadow tension"""
        summary = artifact.content.get("genetic_summary", {})
        visible = summary.get("visible_traits", [])
        shadow = summary.get("shadow_traits", [])

        conflicts = []
        conflict_pairs = [
            ("perfectionism", "shame"),
            ("caretaking", "selfishness"),
            ("control", "submission"),
            ("performance", "authenticity"),
            ("stoicism", "grief")
        ]

        for v_trait in visible:
            for s_trait in shadow:
                for v_match, s_match in conflict_pairs:
                    if v_match in v_trait.lower() and s_match in s_trait.lower():
                        conflicts.append({
                            "visible": v_trait,
                            "shadow": s_trait,
                            "tension": f"Shows {v_trait} to hide {s_trait}"
                        })

        return conflicts

    def _identify_eruptions(self, artifact: CreativeArtifact) -> List[Dict[str, str]]:
        """Identify recessive genes ready to erupt"""
        summary = artifact.content.get("genetic_summary", {})
        recessive = summary.get("recessive_genes", [])

        eruptions = []
        for gene in recessive:
            eruptions.append({
                "gene": gene,
                "trigger": "Life transition, crisis, or trauma anniversary",
                "potential": f"The character may suddenly exhibit {gene} behavior"
            })

        return eruptions

    def _trace_trauma_inheritance(self, artifact: CreativeArtifact) -> Dict[str, Any]:
        """Map trauma inheritance patterns"""
        summary = artifact.content.get("genetic_summary", {})
        inherited = summary.get("inherited_traumas", [])
        personal = summary.get("personal_traumas", [])

        return {
            "generational_patterns": [t.description if hasattr(t, 'description') else str(t) for t in inherited],
            "personal_wounds": [t.description if hasattr(t, 'description') else str(t) for t in personal],
            "insight": "Trauma doesn't just happen to us - it travels through us"
        }

    def _suggest_evolution(self, artifact: CreativeArtifact) -> List[str]:
        """Suggest character evolution paths"""
        return [
            "Breed with archetype to add mythic dimension",
            "Trigger recessive gene eruption for dramatic arc",
            "Explore shadow strand as primary motivation",
            "Create offspring character to show trait inheritance",
            "Add specific cultural chromosome for authenticity"
        ]


# Convenience functions
def create_character(name: str, family_patterns: List[str] = None,
                    visible_traits: List[str] = None,
                    shadow_traits: List[str] = None) -> CreativeArtifact:
    """
    Create a character with genetic profile.

    Example:
        claire = create_character(
            name="Claire Morrison",
            family_patterns=["the_martyr_mother", "the_wild_grandmother"],
            visible_traits=["perfectionism", "caretaking", "performance"],
            shadow_traits=["shame", "hunger", "submission"]
        )
    """
    from engines.core import EngineContext
    context = EngineContext("character_creation", "musical")
    engine = CharacterGenetics()
    engine.attach_context(context)

    return engine.generate({
        "name": name,
        "family_patterns": family_patterns or [],
        "visible_traits": visible_traits or [],
        "shadow_traits": shadow_traits or []
    })[0]
