"""
THE THOUSAND MINDS AWAKENED
============================

Layer 1: Concept Seeds

"A garden of seeds that dream of being forests. An ECOSYSTEM of concepts
that compete, evolve, cross-pollinate."

Every story that could exist already exists as potential.
This engine makes that potential tangible, combinable, evolvable.
"""

import random
from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional, Tuple
from enum import Enum

import sys
sys.path.insert(0, '/home/user/PlayWright')
from engines.core import (
    CreativeEngine,
    EngineLayer,
    CreativeArtifact,
    EngineRegistry,
    generate_artifact_id
)


class GeneticTrait(Enum):
    """Traits that concepts can carry and pass on"""
    # Genre genes
    TRAGEDY = "tragedy"
    COMEDY = "comedy"
    DARK_COMEDY = "dark_comedy"
    ROMANCE = "romance"
    THRILLER = "thriller"
    HORROR = "horror"
    FANTASY = "fantasy"
    HISTORICAL = "historical"
    CONTEMPORARY = "contemporary"
    SURREAL = "surreal"

    # Emotional core genes
    GRIEF = "grief"
    JOY = "joy"
    RAGE = "rage"
    LONGING = "longing"
    FEAR = "fear"
    SHAME = "shame"
    HOPE = "hope"
    DESPAIR = "despair"
    ECSTASY = "ecstasy"
    MELANCHOLY = "melancholy"

    # Structural genes
    LINEAR = "linear"
    NONLINEAR = "nonlinear"
    FRAGMENTED = "fragmented"
    CIRCULAR = "circular"
    SPIRAL = "spiral"

    # Cultural lens genes
    AMERICAN = "american"
    EUROPEAN = "european"
    ASIAN = "asian"
    AFRICAN = "african"
    LATIN = "latin"
    INDIGENOUS = "indigenous"
    DIASPORA = "diaspora"
    WORKING_CLASS = "working_class"
    BOURGEOIS = "bourgeois"
    QUEER = "queer"


@dataclass
class ConceptGene:
    """A single genetic trait with dominance level"""
    trait: GeneticTrait
    dominance: float  # 0.0 = recessive, 1.0 = dominant
    mutation_rate: float = 0.1

    def can_express(self) -> bool:
        """Check if this gene expresses based on dominance"""
        return random.random() < self.dominance


@dataclass
class ConceptDNA:
    """The full genetic code of a concept"""
    genre_genes: List[ConceptGene]
    emotion_genes: List[ConceptGene]
    structure_genes: List[ConceptGene]
    cultural_genes: List[ConceptGene]
    metaphor_genes: List[str] = field(default_factory=list)  # Central metaphors
    thematic_obsessions: List[str] = field(default_factory=list)

    def get_expressed_traits(self) -> Dict[str, List[str]]:
        """Get all traits that are currently expressing"""
        return {
            'genre': [g.trait.value for g in self.genre_genes if g.can_express()],
            'emotion': [e.trait.value for e in self.emotion_genes if e.can_express()],
            'structure': [s.trait.value for s in self.structure_genes if s.can_express()],
            'cultural': [c.trait.value for c in self.cultural_genes if c.can_express()],
            'metaphors': self.metaphor_genes,
            'obsessions': self.thematic_obsessions
        }

    def mutate(self) -> 'ConceptDNA':
        """Create a mutated copy of this DNA"""
        new_dna = ConceptDNA(
            genre_genes=[self._mutate_gene(g) for g in self.genre_genes],
            emotion_genes=[self._mutate_gene(g) for g in self.emotion_genes],
            structure_genes=[self._mutate_gene(g) for g in self.structure_genes],
            cultural_genes=[self._mutate_gene(g) for g in self.cultural_genes],
            metaphor_genes=self.metaphor_genes.copy(),
            thematic_obsessions=self.thematic_obsessions.copy()
        )

        # Chance of metaphor mutation
        if random.random() < 0.2 and new_dna.metaphor_genes:
            new_dna.metaphor_genes[random.randint(0, len(new_dna.metaphor_genes)-1)] = \
                random.choice(WILD_METAPHORS)

        return new_dna

    def _mutate_gene(self, gene: ConceptGene) -> ConceptGene:
        """Possibly mutate a single gene"""
        if random.random() < gene.mutation_rate:
            # Shift dominance
            new_dominance = max(0.0, min(1.0, gene.dominance + random.uniform(-0.3, 0.3)))
            return ConceptGene(gene.trait, new_dominance, gene.mutation_rate)
        return gene


# Wild genetic material for mutation
WILD_METAPHORS = [
    "prison", "garden", "machine", "mirror", "storm", "fire", "ocean",
    "labyrinth", "clock", "mask", "wound", "bridge", "threshold",
    "hunger", "sleep", "dance", "game", "web", "ghost", "seed"
]

ARCHETYPAL_ANCESTORS = {
    "suburban_darkness": {
        "examples": ["Desperate Housewives", "American Beauty", "Revolutionary Road"],
        "genes": [GeneticTrait.CONTEMPORARY, GeneticTrait.DARK_COMEDY, GeneticTrait.SHAME]
    },
    "power_exchange": {
        "examples": ["Venus in Fur", "Secretary", "Story of O"],
        "genes": [GeneticTrait.THRILLER, GeneticTrait.ECSTASY, GeneticTrait.FEAR]
    },
    "marriage_interrogation": {
        "examples": ["Company", "Who's Afraid of Virginia Woolf", "Scenes from a Marriage"],
        "genes": [GeneticTrait.TRAGEDY, GeneticTrait.MELANCHOLY, GeneticTrait.DESPAIR]
    },
    "digital_voyeurism": {
        "examples": ["Black Mirror", "The Circle", "Cam"],
        "genes": [GeneticTrait.HORROR, GeneticTrait.FEAR, GeneticTrait.CONTEMPORARY]
    },
    "generational_trauma": {
        "examples": ["Hereditary", "August: Osage County", "The Humans"],
        "genes": [GeneticTrait.TRAGEDY, GeneticTrait.GRIEF, GeneticTrait.SPIRAL]
    },
    "queer_awakening": {
        "examples": ["Fun Home", "The Prom", "La Cage aux Folles"],
        "genes": [GeneticTrait.ROMANCE, GeneticTrait.HOPE, GeneticTrait.QUEER]
    },
    "immigrant_journey": {
        "examples": ["In the Heights", "The Band's Visit", "Miss Saigon"],
        "genes": [GeneticTrait.LONGING, GeneticTrait.HOPE, GeneticTrait.DIASPORA]
    },
    "class_warfare": {
        "examples": ["Sweeney Todd", "Les Misérables", "Hadestown"],
        "genes": [GeneticTrait.RAGE, GeneticTrait.WORKING_CLASS, GeneticTrait.TRAGEDY]
    }
}


@dataclass
class MusicalConcept:
    """A living concept that can evolve and breed"""
    id: str
    title: str
    logline: str
    dna: ConceptDNA
    ancestry: List[str] = field(default_factory=list)  # IDs of parent concepts
    generation: int = 0
    fitness: float = 0.5  # Natural selection score

    def to_artifact(self) -> CreativeArtifact:
        """Convert to a CreativeArtifact for the engine pipeline"""
        return CreativeArtifact(
            id=self.id,
            artifact_type="concept",
            content={
                "title": self.title,
                "logline": self.logline,
                "expressed_traits": self.dna.get_expressed_traits(),
                "ancestry": self.ancestry,
                "generation": self.generation,
                "fitness": self.fitness
            },
            source_engine="ThousandMindsAwakened"
        )

    @classmethod
    def from_artifact(cls, artifact: CreativeArtifact) -> 'MusicalConcept':
        """Reconstruct from a CreativeArtifact"""
        content = artifact.content
        # Simplified reconstruction - in practice would deserialize full DNA
        return cls(
            id=artifact.id,
            title=content["title"],
            logline=content["logline"],
            dna=ConceptDNA([], [], [], []),  # Placeholder
            ancestry=content.get("ancestry", []),
            generation=content.get("generation", 0),
            fitness=content.get("fitness", 0.5)
        )


@EngineRegistry.register
class ThousandMindsAwakened(CreativeEngine):
    """
    The first engine: a concept ecosystem that generates, evolves, and breeds ideas.

    Every story that could exist already exists as potential.
    This engine makes that potential tangible, combinable, evolvable.
    """

    def __init__(self):
        super().__init__("ThousandMindsAwakened", EngineLayer.SEEDS)
        self._concept_pool: Dict[str, MusicalConcept] = {}

    def process(self, artifact: CreativeArtifact) -> CreativeArtifact:
        """
        Process an existing concept artifact - analyze its genetic makeup.
        """
        if artifact.artifact_type != "concept":
            return artifact

        # Analyze ancestry
        ancestry_analysis = self._analyze_ancestry(artifact)
        artifact.add_insight(self.name, "ancestry_analysis", ancestry_analysis)

        # Suggest cross-pollination partners
        partners = self._suggest_partners(artifact)
        artifact.add_insight(self.name, "breeding_partners", partners)

        # Identify evolutionary potential
        evolution_paths = self._identify_evolution_paths(artifact)
        artifact.add_insight(self.name, "evolution_paths", evolution_paths)

        return artifact

    def generate(self, seed: Optional[Dict[str, Any]] = None) -> List[CreativeArtifact]:
        """
        Generate new concept seeds.

        Seed parameters:
        - ancestry: list of archetypal ancestors (e.g., ["suburban_darkness", "power_exchange"])
        - metaphor: central metaphor
        - emotion: primary emotional core
        - count: number of concepts to generate
        """
        seed = seed or {}
        count = seed.get("count", 3)
        concepts = []

        for _ in range(count):
            concept = self._generate_concept(
                ancestry=seed.get("ancestry", []),
                metaphor=seed.get("metaphor"),
                emotion=seed.get("emotion")
            )
            self._concept_pool[concept.id] = concept
            concepts.append(concept.to_artifact())

        return concepts

    def cross_pollinate(self, concept_a: MusicalConcept, concept_b: MusicalConcept) -> MusicalConcept:
        """
        Breed two concepts to create offspring.

        "The Last Bee" + "Mars Colony Blues" = "Colony Collapse"
        """
        # Combine DNA
        offspring_dna = self._combine_dna(concept_a.dna, concept_b.dna)

        # Generate hybrid title and logline
        title = self._generate_hybrid_title(concept_a, concept_b)
        logline = self._generate_hybrid_logline(concept_a, concept_b, offspring_dna)

        offspring = MusicalConcept(
            id=generate_artifact_id("concept"),
            title=title,
            logline=logline,
            dna=offspring_dna,
            ancestry=[concept_a.id, concept_b.id],
            generation=max(concept_a.generation, concept_b.generation) + 1
        )

        self._concept_pool[offspring.id] = offspring
        return offspring

    def mutate(self, concept: MusicalConcept) -> MusicalConcept:
        """
        Apply random mutation to a concept.

        "The Last Bee" but bees are sentient and can't communicate
        """
        mutated_dna = concept.dna.mutate()

        # Inject wild element
        wild_element = random.choice(WILD_METAPHORS)
        mutation_description = f"but {wild_element} is the central metaphor"

        mutant = MusicalConcept(
            id=generate_artifact_id("concept"),
            title=f"{concept.title} (Mutant)",
            logline=f"{concept.logline}, {mutation_description}",
            dna=mutated_dna,
            ancestry=[concept.id],
            generation=concept.generation + 1
        )

        self._concept_pool[mutant.id] = mutant
        return mutant

    def speciate(self, concept: MusicalConcept, cultural_lenses: List[str]) -> List[MusicalConcept]:
        """
        Split one concept into cultural variations.

        One concept → variations based on cultural lens
        """
        species = []
        for lens in cultural_lenses:
            variant = self._create_cultural_variant(concept, lens)
            self._concept_pool[variant.id] = variant
            species.append(variant)
        return species

    def natural_selection(self, fitness_scores: Dict[str, float]) -> List[MusicalConcept]:
        """
        Apply selection pressure - concepts compete for creator attention.

        The strongest survive.
        """
        for concept_id, score in fitness_scores.items():
            if concept_id in self._concept_pool:
                self._concept_pool[concept_id].fitness = score

        # Sort by fitness, keep top survivors
        survivors = sorted(
            self._concept_pool.values(),
            key=lambda c: c.fitness,
            reverse=True
        )

        # Survival threshold
        threshold = len(survivors) // 2
        survivors = survivors[:max(threshold, 5)]

        return survivors

    def _generate_concept(self, ancestry: List[str], metaphor: Optional[str], emotion: Optional[str]) -> MusicalConcept:
        """Generate a single concept from parameters"""
        # Build DNA from ancestry
        genre_genes = []
        emotion_genes = []
        structure_genes = []
        cultural_genes = []

        for ancestor_key in ancestry:
            if ancestor_key in ARCHETYPAL_ANCESTORS:
                ancestor = ARCHETYPAL_ANCESTORS[ancestor_key]
                for trait in ancestor["genes"]:
                    gene = ConceptGene(trait, random.uniform(0.5, 1.0))
                    if "GENRE" in str(trait) or trait in [GeneticTrait.TRAGEDY, GeneticTrait.COMEDY,
                                                          GeneticTrait.DARK_COMEDY, GeneticTrait.ROMANCE,
                                                          GeneticTrait.THRILLER, GeneticTrait.HORROR]:
                        genre_genes.append(gene)
                    elif trait in [GeneticTrait.LINEAR, GeneticTrait.NONLINEAR, GeneticTrait.FRAGMENTED,
                                   GeneticTrait.CIRCULAR, GeneticTrait.SPIRAL]:
                        structure_genes.append(gene)
                    elif trait in [GeneticTrait.AMERICAN, GeneticTrait.EUROPEAN, GeneticTrait.ASIAN,
                                   GeneticTrait.QUEER, GeneticTrait.WORKING_CLASS, GeneticTrait.DIASPORA]:
                        cultural_genes.append(gene)
                    else:
                        emotion_genes.append(gene)

        # Add random elements if sparse
        if not genre_genes:
            genre_genes.append(ConceptGene(random.choice([GeneticTrait.TRAGEDY, GeneticTrait.DARK_COMEDY]), 0.7))
        if not emotion_genes:
            emotion_genes.append(ConceptGene(random.choice([GeneticTrait.LONGING, GeneticTrait.GRIEF]), 0.7))
        if not structure_genes:
            structure_genes.append(ConceptGene(GeneticTrait.SPIRAL, 0.6))

        metaphor_genes = [metaphor] if metaphor else [random.choice(WILD_METAPHORS)]

        dna = ConceptDNA(
            genre_genes=genre_genes,
            emotion_genes=emotion_genes,
            structure_genes=structure_genes,
            cultural_genes=cultural_genes,
            metaphor_genes=metaphor_genes,
            thematic_obsessions=[]
        )

        # Generate title and logline
        title = self._generate_title(dna, ancestry)
        logline = self._generate_logline(dna, ancestry)

        return MusicalConcept(
            id=generate_artifact_id("concept"),
            title=title,
            logline=logline,
            dna=dna,
            ancestry=ancestry,
            generation=0
        )

    def _generate_title(self, dna: ConceptDNA, ancestry: List[str]) -> str:
        """Generate evocative title from DNA"""
        metaphor = dna.metaphor_genes[0] if dna.metaphor_genes else "song"
        traits = dna.get_expressed_traits()

        templates = [
            f"The {metaphor.title()} Inside",
            f"{metaphor.title()} Songs",
            f"When the {metaphor.title()} Breaks",
            f"The {metaphor.title()} Keepers",
            f"{metaphor.title()} and Honey"
        ]
        return random.choice(templates)

    def _generate_logline(self, dna: ConceptDNA, ancestry: List[str]) -> str:
        """Generate compelling logline from DNA"""
        traits = dna.get_expressed_traits()
        emotions = traits.get('emotion', ['longing'])
        metaphor = dna.metaphor_genes[0] if dna.metaphor_genes else "truth"

        templates = [
            f"A musical about {emotions[0] if emotions else 'longing'}, where {metaphor} becomes the only way to speak the unspeakable.",
            f"In a world where {metaphor} defines everything, one person discovers that {emotions[0] if emotions else 'love'} requires breaking every rule.",
            f"Three generations of {metaphor}, one chance at {emotions[0] if emotions else 'freedom'}.",
        ]
        return random.choice(templates)

    def _combine_dna(self, dna_a: ConceptDNA, dna_b: ConceptDNA) -> ConceptDNA:
        """Combine DNA from two concepts"""
        def mix_genes(genes_a: List[ConceptGene], genes_b: List[ConceptGene]) -> List[ConceptGene]:
            combined = []
            all_genes = genes_a + genes_b
            seen_traits = set()
            for gene in all_genes:
                if gene.trait not in seen_traits:
                    seen_traits.add(gene.trait)
                    combined.append(ConceptGene(gene.trait, gene.dominance * random.uniform(0.7, 1.0)))
            return combined

        return ConceptDNA(
            genre_genes=mix_genes(dna_a.genre_genes, dna_b.genre_genes),
            emotion_genes=mix_genes(dna_a.emotion_genes, dna_b.emotion_genes),
            structure_genes=mix_genes(dna_a.structure_genes, dna_b.structure_genes),
            cultural_genes=mix_genes(dna_a.cultural_genes, dna_b.cultural_genes),
            metaphor_genes=list(set(dna_a.metaphor_genes + dna_b.metaphor_genes)),
            thematic_obsessions=list(set(dna_a.thematic_obsessions + dna_b.thematic_obsessions))
        )

    def _generate_hybrid_title(self, a: MusicalConcept, b: MusicalConcept) -> str:
        """Generate title for offspring concept"""
        words_a = a.title.split()
        words_b = b.title.split()
        # Simple hybrid: take interesting words from each
        return f"{words_a[-1]} {words_b[-1]}"

    def _generate_hybrid_logline(self, a: MusicalConcept, b: MusicalConcept, dna: ConceptDNA) -> str:
        """Generate logline for offspring concept"""
        return f"Born from '{a.title}' and '{b.title}': {a.logline.split(',')[0]}, {b.logline.split(',')[-1]}"

    def _create_cultural_variant(self, concept: MusicalConcept, cultural_lens: str) -> MusicalConcept:
        """Create cultural variation of concept"""
        new_dna = ConceptDNA(
            genre_genes=concept.dna.genre_genes.copy(),
            emotion_genes=concept.dna.emotion_genes.copy(),
            structure_genes=concept.dna.structure_genes.copy(),
            cultural_genes=[ConceptGene(GeneticTrait[cultural_lens.upper()], 0.9)]
                if cultural_lens.upper() in GeneticTrait.__members__ else [],
            metaphor_genes=concept.dna.metaphor_genes.copy(),
            thematic_obsessions=concept.dna.thematic_obsessions.copy()
        )

        return MusicalConcept(
            id=generate_artifact_id("concept"),
            title=f"{concept.title} ({cultural_lens.title()})",
            logline=f"{concept.logline} — through the lens of {cultural_lens} experience",
            dna=new_dna,
            ancestry=[concept.id],
            generation=concept.generation + 1
        )

    def _analyze_ancestry(self, artifact: CreativeArtifact) -> Dict[str, Any]:
        """Analyze the genetic ancestry of a concept"""
        ancestry = artifact.content.get("ancestry", [])
        analysis = {
            "detected_ancestors": [],
            "dominant_genes": [],
            "recessive_potential": []
        }

        for ancestor in ancestry:
            if ancestor in ARCHETYPAL_ANCESTORS:
                analysis["detected_ancestors"].append({
                    "type": ancestor,
                    "examples": ARCHETYPAL_ANCESTORS[ancestor]["examples"],
                    "contributed_genes": [g.value for g in ARCHETYPAL_ANCESTORS[ancestor]["genes"]]
                })

        return analysis

    def _suggest_partners(self, artifact: CreativeArtifact) -> List[Dict[str, str]]:
        """Suggest breeding partners for cross-pollination"""
        current_ancestry = set(artifact.content.get("ancestry", []))
        suggestions = []

        for key, ancestor in ARCHETYPAL_ANCESTORS.items():
            if key not in current_ancestry:
                suggestions.append({
                    "lineage": key,
                    "why": f"Could introduce {ancestor['genes'][0].value} energy",
                    "examples": ancestor["examples"]
                })

        return suggestions[:3]  # Top 3 suggestions

    def _identify_evolution_paths(self, artifact: CreativeArtifact) -> List[str]:
        """Identify potential evolution paths"""
        return [
            "mutation: inject random wild element",
            "speciation: split across cultural lenses",
            "cross-pollination: breed with complementary concept",
            "natural selection: compete against alternatives"
        ]


# Convenience function for direct usage
def awaken_minds(ancestry: List[str] = None, count: int = 3) -> List[CreativeArtifact]:
    """
    Awaken the Thousand Minds - generate concept seeds.

    Example:
        concepts = awaken_minds(
            ancestry=["suburban_darkness", "power_exchange"],
            count=5
        )
    """
    from engines.core import EngineContext
    context = EngineContext("concept_generation", "musical")
    engine = ThousandMindsAwakened()
    engine.attach_context(context)

    return engine.generate({
        "ancestry": ancestry or [],
        "count": count
    })
