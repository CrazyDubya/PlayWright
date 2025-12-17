"""
THE GHOST COUNCIL ENGINE
=========================

Layer 5: Critical Parliament

"A parliament of the dead and the imagined, arguing about your art.
Cognitive diversity as creative fuel. The inner dialogue made external and systematic."

The Council is about the death of the singular author - acknowledging that
all creation is collaboration with the dead, the imagined, the cultural, the unconscious.
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


class Vote(Enum):
    """Possible votes from a ghost"""
    APPROVE = "approve"
    REVISE = "revise"
    REJECT = "reject"
    ABSTAIN = "abstain"


@dataclass
class GhostPersona:
    """A ghost's distinct critical perspective"""
    name: str
    philosophy: str
    focus_areas: List[str]
    typical_questions: List[str]
    praise_style: str
    critique_style: str
    signature_phrase: str


@dataclass
class GhostCritique:
    """A critique from a single ghost"""
    ghost_name: str
    vote: Vote
    praise: Optional[str]
    criticism: Optional[str]
    questions: List[str]
    specific_suggestions: List[str]
    signature_close: str


@dataclass
class CouncilVerdict:
    """The collective verdict of the Ghost Council"""
    id: str
    target: str  # What was being critiqued
    critiques: List[GhostCritique]
    overall_vote: Vote
    key_concerns: List[str]
    key_strengths: List[str]
    recommended_actions: List[str]
    debate_summary: str


# The Ghost Council Members
GHOST_PERSONAS = {
    "sondheim": GhostPersona(
        name="The Sondheim Ghost",
        philosophy="Lyrical precision, subtext, the weight of every word",
        focus_areas=["lyrics", "rhyme", "internal logic", "character voice", "subtext"],
        typical_questions=[
            "Is every word earning its place?",
            "What's the subtext beneath the text?",
            "Does the rhyme surprise or feel inevitable?",
            "Is this character's voice distinct from every other?"
        ],
        praise_style="Precisely identifies what works and why",
        critique_style="Demands specificity, hates lazy rhymes and clichés",
        signature_phrase="The word is everything. Make it precise."
    ),

    "fosse": GhostPersona(
        name="The Fosse Ghost",
        philosophy="Embodied eroticism, isolation, jazz hands as psychology",
        focus_areas=["movement", "physicality", "sexuality", "isolation", "style"],
        typical_questions=[
            "Where is the body in this scene?",
            "What's erotic about this moment?",
            "How does isolation read on stage?",
            "Are they performing or being?"
        ],
        praise_style="Acknowledges when the body tells the story",
        critique_style="Points out when words do what movement should",
        signature_phrase="The body doesn't lie. Let it speak."
    ),

    "brecht": GhostPersona(
        name="The Brecht Ghost",
        philosophy="Who profits? Where's the critique? Show the system.",
        focus_areas=["politics", "economics", "systems", "alienation", "critique"],
        typical_questions=[
            "Who profits from this story?",
            "Where is the systemic critique?",
            "Who's invisible? Who does the labor?",
            "Are we questioning or reinforcing?"
        ],
        praise_style="Approves when power structures are made visible",
        critique_style="Demands examination of privilege and complicity",
        signature_phrase="Theater that comforts is theater that serves power."
    ),

    "kushner": GhostPersona(
        name="The Kushner Ghost",
        philosophy="Specific prayers, cultural weight, the angel in the room",
        focus_areas=["spirituality", "cultural specificity", "history", "hope", "grandeur"],
        typical_questions=[
            "Where is the specific prayer?",
            "What cultural weight does this carry?",
            "Is there room for the divine?",
            "Does this story know it's part of history?"
        ],
        praise_style="Celebrates cultural depth and spiritual ambition",
        critique_style="Pushes for more specificity and historical awareness",
        signature_phrase="More. Always more. The angels demand it."
    ),

    "dionysian": GhostPersona(
        name="The Dionysian Ghost",
        philosophy="Where is the ecstasy? The danger? The god inside?",
        focus_areas=["ecstasy", "danger", "transformation", "ritual", "excess"],
        typical_questions=[
            "Where is the dangerous moment?",
            "Is there genuine transformation?",
            "Can this induce ecstasy?",
            "Are we touching the divine or just describing it?"
        ],
        praise_style="Celebrates moments of genuine transcendence",
        critique_style="Pushes past safety into dangerous territory",
        signature_phrase="Safety is death. Break something."
    ),

    "apollonian": GhostPersona(
        name="The Apollonian Ghost",
        philosophy="Where is the form? The light? The shape?",
        focus_areas=["structure", "clarity", "balance", "form", "light"],
        typical_questions=[
            "What is the shape of this piece?",
            "Is the structure supporting or constraining?",
            "Where is the balance point?",
            "Does the form serve the content?"
        ],
        praise_style="Appreciates structural elegance and clarity",
        critique_style="Points out when chaos isn't serving anything",
        signature_phrase="Form is meaning. Find the shape."
    ),

    "wounded_child": GhostPersona(
        name="The Wounded Child Ghost",
        philosophy="Why should I care? Show me the hurt.",
        focus_areas=["vulnerability", "emotional truth", "personal stakes", "hurt"],
        typical_questions=[
            "Why should I care?",
            "Where is the real wound?",
            "Is this emotion earned?",
            "What's at stake for the heart?"
        ],
        praise_style="Responds to genuine emotional truth",
        critique_style="Calls out performed emotion vs. real feeling",
        signature_phrase="I need to feel it. Make me feel it."
    ),

    "cynic": GhostPersona(
        name="The Cynic Ghost",
        philosophy="Who pays for these tears? What's the transaction?",
        focus_areas=["economics", "manipulation", "sentimentality", "transactions"],
        typical_questions=[
            "Who profits from this emotion?",
            "Is this sentiment or sentimentality?",
            "What's being sold here?",
            "Are we being manipulated or moved?"
        ],
        praise_style="Acknowledges when hard truths are faced",
        critique_style="Exposes manipulation and false comfort",
        signature_phrase="Tears are cheap. Truth costs."
    ),

    "ancestor": GhostPersona(
        name="The Ancestor Ghost",
        philosophy="What would your grandmother recognize as true?",
        focus_areas=["tradition", "recognition", "family truth", "ancestral wisdom"],
        typical_questions=[
            "Would your grandmother recognize this truth?",
            "What ancestral pattern is playing out?",
            "Is this story honoring or betraying lineage?",
            "What do the old stories say about this?"
        ],
        praise_style="Honors work that connects to deep patterns",
        critique_style="Questions trendy over timeless",
        signature_phrase="The old ones knew. Listen."
    ),

    "character": GhostPersona(
        name="The Character Ghost",
        philosophy="The characters themselves, arguing with their creator",
        focus_areas=["authenticity", "agency", "voice", "truth to character"],
        typical_questions=[
            "Is this what I would really say?",
            "Am I being used or discovered?",
            "Does my creator understand me?",
            "Is my complexity being honored?"
        ],
        praise_style="Acknowledges when characters feel autonomous",
        critique_style="Resists being reduced to function",
        signature_phrase="I am more than you know. Listen to me."
    )
}


@EngineRegistry.register
class GhostCouncil(CreativeEngine):
    """
    The Ghost Council Engine - a parliament of critical voices.

    Convenes multiple perspectives to critique creative work.
    The death of the singular author, the birth of collaborative creation.
    """

    def __init__(self):
        super().__init__("GhostCouncil", EngineLayer.CRITIQUE)
        self._verdicts: Dict[str, CouncilVerdict] = {}
        self.depends_on("BodyGrammar", "LivingCanvas", "SynestheticTranslator")

    def process(self, artifact: CreativeArtifact) -> CreativeArtifact:
        """
        Process an artifact through the Ghost Council.
        Get critiques from all relevant ghosts.
        """
        # Convene relevant ghosts
        relevant_ghosts = self._select_relevant_ghosts(artifact)
        artifact.add_insight(self.name, "convened_ghosts", [g.name for g in relevant_ghosts])

        # Get individual critiques
        critiques = []
        for ghost in relevant_ghosts:
            critique = self._generate_critique(ghost, artifact)
            critiques.append(critique)

        artifact.add_insight(self.name, "individual_critiques", [
            {
                "ghost": c.ghost_name,
                "vote": c.vote.value,
                "key_point": c.criticism or c.praise
            } for c in critiques
        ])

        # Generate verdict
        verdict = self._synthesize_verdict(artifact, critiques)
        artifact.add_insight(self.name, "council_verdict", {
            "overall_vote": verdict.overall_vote.value,
            "key_concerns": verdict.key_concerns,
            "recommended_actions": verdict.recommended_actions
        })

        return artifact

    def generate(self, seed: Optional[Dict[str, Any]] = None) -> List[CreativeArtifact]:
        """
        Generate a council session on specific content.

        Seed parameters:
        - target: what to critique (text, scene description, etc.)
        - target_type: 'lyrics', 'scene', 'character', 'concept', etc.
        - ghosts: optional list of specific ghosts to convene
        """
        seed = seed or {}
        target = seed.get("target", "The work in question")
        target_type = seed.get("target_type", "general")
        specific_ghosts = seed.get("ghosts", None)

        verdict = self.convene(target, target_type, specific_ghosts)
        return [self._verdict_to_artifact(verdict)]

    def convene(self, target: str, target_type: str = "general",
               specific_ghosts: List[str] = None) -> CouncilVerdict:
        """
        Convene the Ghost Council on a specific target.

        Example:
            verdict = convene(
                target="Claire's opening number lyrics",
                target_type="lyrics",
                specific_ghosts=["sondheim", "wounded_child"]
            )
        """
        # Select ghosts
        if specific_ghosts:
            ghosts = [GHOST_PERSONAS[g] for g in specific_ghosts if g in GHOST_PERSONAS]
        else:
            ghosts = self._select_ghosts_for_type(target_type)

        # Generate critiques
        critiques = []
        for ghost in ghosts:
            critique = self._create_critique(ghost, target, target_type)
            critiques.append(critique)

        # Synthesize verdict
        verdict = self._create_verdict(target, critiques)
        self._verdicts[verdict.id] = verdict

        return verdict

    def summon(self, ghost_name: str, target: str, target_type: str = "general") -> GhostCritique:
        """
        Summon a single ghost for their perspective.

        Example:
            sondheim_view = summon("sondheim", "These picket fences feel like bars", "lyrics")
        """
        ghost_name = ghost_name.lower()
        if ghost_name not in GHOST_PERSONAS:
            raise ValueError(f"Unknown ghost: {ghost_name}. Available: {list(GHOST_PERSONAS.keys())}")

        ghost = GHOST_PERSONAS[ghost_name]
        return self._create_critique(ghost, target, target_type)

    def debate(self, topic: str, ghosts: List[str]) -> Dict[str, Any]:
        """
        Have specific ghosts debate a topic.

        Example:
            debate_result = debate(
                "Should Claire be sympathetic or insufferable?",
                ["wounded_child", "brecht", "cynic"]
            )
        """
        positions = []
        for ghost_name in ghosts:
            if ghost_name.lower() in GHOST_PERSONAS:
                ghost = GHOST_PERSONAS[ghost_name.lower()]
                position = self._generate_debate_position(ghost, topic)
                positions.append(position)

        # Synthesize debate
        synthesis = self._synthesize_debate(topic, positions)

        return {
            "topic": topic,
            "positions": positions,
            "synthesis": synthesis,
            "productive_tension": self._identify_productive_tensions(positions)
        }

    def summon_character_ghost(self, character_name: str, question: str) -> GhostCritique:
        """
        Let the character themselves speak.

        Example:
            claire_speaks = summon_character_ghost(
                "Claire Morrison",
                "How do you feel about how you're being written?"
            )
        """
        character_ghost = GhostPersona(
            name=f"{character_name}'s Ghost",
            philosophy=f"I am {character_name}, arguing with my creator",
            focus_areas=["my truth", "my complexity", "my agency"],
            typical_questions=[
                "Is this what I would really do?",
                "Am I being understood or used?",
                "Where is my voice?"
            ],
            praise_style="Acknowledges when I'm written with truth",
            critique_style="Resists reduction to plot function",
            signature_phrase=f"Stop writing me. Start listening to me."
        )

        return self._create_critique(character_ghost, question, "character_voice")

    def _select_relevant_ghosts(self, artifact: CreativeArtifact) -> List[GhostPersona]:
        """Select ghosts relevant to artifact type"""
        artifact_type = artifact.artifact_type

        type_to_ghosts = {
            "concept": ["sondheim", "brecht", "kushner"],
            "character": ["wounded_child", "character", "fosse"],
            "scene": ["dionysian", "apollonian", "fosse"],
            "lyrics": ["sondheim", "wounded_child", "ancestor"],
            "dream_sequence": ["dionysian", "dream", "kushner"],
            "default": ["sondheim", "wounded_child", "cynic"]
        }

        ghost_names = type_to_ghosts.get(artifact_type, type_to_ghosts["default"])
        return [GHOST_PERSONAS[name] for name in ghost_names if name in GHOST_PERSONAS]

    def _select_ghosts_for_type(self, target_type: str) -> List[GhostPersona]:
        """Select appropriate ghosts for critique type"""
        type_to_ghosts = {
            "lyrics": ["sondheim", "wounded_child", "cynic"],
            "scene": ["fosse", "dionysian", "apollonian"],
            "character": ["wounded_child", "character", "brecht"],
            "concept": ["kushner", "brecht", "ancestor"],
            "structure": ["apollonian", "sondheim"],
            "general": ["sondheim", "wounded_child", "dionysian", "cynic"]
        }

        ghost_names = type_to_ghosts.get(target_type.lower(), type_to_ghosts["general"])
        return [GHOST_PERSONAS[name] for name in ghost_names if name in GHOST_PERSONAS]

    def _generate_critique(self, ghost: GhostPersona, artifact: CreativeArtifact) -> GhostCritique:
        """Generate critique from a ghost based on artifact"""
        content = str(artifact.content)
        return self._create_critique(ghost, content, artifact.artifact_type)

    def _create_critique(self, ghost: GhostPersona, target: str, target_type: str) -> GhostCritique:
        """Create a detailed critique from a ghost's perspective"""
        # Determine vote based on ghost's philosophy
        vote = self._determine_vote(ghost, target, target_type)

        # Generate praise if appropriate
        praise = None
        if vote in [Vote.APPROVE, Vote.REVISE]:
            praise = self._generate_praise(ghost, target)

        # Generate criticism if appropriate
        criticism = None
        if vote in [Vote.REVISE, Vote.REJECT]:
            criticism = self._generate_criticism(ghost, target, target_type)

        # Generate questions
        questions = self._generate_questions(ghost, target)

        # Generate specific suggestions
        suggestions = self._generate_suggestions(ghost, target, target_type)

        return GhostCritique(
            ghost_name=ghost.name,
            vote=vote,
            praise=praise,
            criticism=criticism,
            questions=questions,
            specific_suggestions=suggestions,
            signature_close=ghost.signature_phrase
        )

    def _determine_vote(self, ghost: GhostPersona, target: str, target_type: str) -> Vote:
        """Determine how a ghost would vote"""
        # Simplified logic - in practice would analyze content more deeply
        target_lower = target.lower()

        # Each ghost has things they look for
        positive_signals = {
            "sondheim": ["specific", "precise", "subtext", "surprising rhyme"],
            "fosse": ["body", "movement", "erotic", "isolation"],
            "brecht": ["system", "power", "critique", "invisible labor"],
            "kushner": ["prayer", "history", "divine", "specific culture"],
            "dionysian": ["danger", "ecstasy", "transform", "break"],
            "apollonian": ["structure", "form", "balance", "shape"],
            "wounded_child": ["hurt", "wound", "feel", "care"],
            "cynic": ["honest", "hard truth", "cost", "real"],
            "ancestor": ["grandmother", "pattern", "lineage", "old"],
            "character": ["would I", "authentic", "complex", "voice"]
        }

        ghost_key = ghost.name.lower().replace("the ", "").replace(" ghost", "").strip()
        signals = positive_signals.get(ghost_key, [])

        positive_count = sum(1 for signal in signals if signal in target_lower)

        if positive_count >= 2:
            return Vote.APPROVE
        elif positive_count >= 1:
            return Vote.REVISE
        else:
            return random.choice([Vote.REVISE, Vote.REJECT])

    def _generate_praise(self, ghost: GhostPersona, target: str) -> str:
        """Generate praise in the ghost's voice"""
        praises = {
            "The Sondheim Ghost": [
                "The internal rhyme in that phrase does the work of a whole verse.",
                "That word choice surprises while feeling inevitable.",
                "The subtext here is doing more work than the text."
            ],
            "The Fosse Ghost": [
                "The body is present here. I can see the movement.",
                "There's something erotic in this isolation.",
                "The jazz hands aren't just style - they're psychology."
            ],
            "The Brecht Ghost": [
                "You've made the system visible.",
                "This questions rather than comforts.",
                "The invisible labor is finally seen."
            ],
            "The Kushner Ghost": [
                "The cultural specificity grounds the universal.",
                "There's room for angels here.",
                "This knows it's part of history."
            ],
            "The Dionysian Ghost": [
                "This touches something dangerous.",
                "There's real transformation possible here.",
                "This could induce genuine ecstasy."
            ],
            "The Apollonian Ghost": [
                "The structure supports the content beautifully.",
                "The form is meaning here.",
                "There's elegant balance in this chaos."
            ],
            "The Wounded Child Ghost": [
                "I felt that. It's real.",
                "The wound is visible without being exploitative.",
                "This makes me care."
            ],
            "The Cynic Ghost": [
                "This doesn't flinch from the hard truth.",
                "No false comfort here.",
                "The cost is honestly rendered."
            ],
            "The Ancestor Ghost": [
                "My grandmother would recognize this truth.",
                "The old patterns are honored here.",
                "This connects to deep time."
            ],
            "The Character Ghost": [
                "Yes. This is what I would say.",
                "I feel seen, not used.",
                "My complexity is being honored."
            ]
        }

        options = praises.get(ghost.name, ["This has merit."])
        return random.choice(options)

    def _generate_criticism(self, ghost: GhostPersona, target: str, target_type: str) -> str:
        """Generate criticism in the ghost's voice"""
        criticisms = {
            "The Sondheim Ghost": [
                "That rhyme is lazy. 'Love' and 'above'? We can do better.",
                "This character wouldn't use that word. Find their voice.",
                "There's no subtext - it's all surface."
            ],
            "The Fosse Ghost": [
                "Where's the body? This is all in the head.",
                "The eroticism is described but not embodied.",
                "The movement needs to tell what words can't."
            ],
            "The Brecht Ghost": [
                "You're making us sympathize without making us think.",
                "Who profits from this sympathy? Who's invisible?",
                "This comforts when it should disturb."
            ],
            "The Kushner Ghost": [
                "Too generic. What specific prayer? What specific heritage?",
                "This could be anywhere. Make it somewhere.",
                "Where's the room for the impossible?"
            ],
            "The Dionysian Ghost": [
                "This is too safe. Break something.",
                "Where's the danger? Where's the ecstasy?",
                "This describes transformation but doesn't enact it."
            ],
            "The Apollonian Ghost": [
                "The chaos isn't serving anything.",
                "The structure is fighting the content.",
                "Find the shape. There's meaning in form."
            ],
            "The Wounded Child Ghost": [
                "I don't believe this emotion. It's performed.",
                "You're telling me to feel instead of making me feel.",
                "Where's the real wound? Not the decorative one."
            ],
            "The Cynic Ghost": [
                "This is sentimentality, not sentiment.",
                "Cheap tears. What's the transaction?",
                "You're selling comfort, not truth."
            ],
            "The Ancestor Ghost": [
                "This is trendy, not timeless.",
                "Your grandmother wouldn't recognize this.",
                "You've forgotten what the old stories taught."
            ],
            "The Character Ghost": [
                "I wouldn't say this. You're using me for plot.",
                "I'm more complicated than this.",
                "Stop writing me and start listening."
            ]
        }

        options = criticisms.get(ghost.name, ["This needs work."])
        return random.choice(options)

    def _generate_questions(self, ghost: GhostPersona, target: str) -> List[str]:
        """Generate questions from ghost's perspective"""
        return random.sample(ghost.typical_questions, min(2, len(ghost.typical_questions)))

    def _generate_suggestions(self, ghost: GhostPersona, target: str, target_type: str) -> List[str]:
        """Generate specific suggestions"""
        suggestions = {
            "The Sondheim Ghost": [
                "Find a rhyme that surprises while feeling inevitable",
                "Give each character a word only they would use",
                "Hide the real meaning in the subtext"
            ],
            "The Fosse Ghost": [
                "Let the body tell this part of the story",
                "Find the isolation in togetherness",
                "The hands are always performing something"
            ],
            "The Brecht Ghost": [
                "Show who does the invisible labor",
                "Make the system visible, not just the individuals",
                "Who pays for this happiness?"
            ],
            "The Kushner Ghost": [
                "Get specific about heritage and prayer",
                "Find room for something impossible",
                "This should feel like part of history"
            ],
            "The Dionysian Ghost": [
                "Push past safety into danger",
                "Find the genuine transformation moment",
                "Let something be destroyed"
            ],
            "The Apollonian Ghost": [
                "Find the shape that holds this content",
                "Balance the chaos with structure",
                "Let form carry meaning"
            ],
            "The Wounded Child Ghost": [
                "Show the wound, don't describe it",
                "Make the stakes personal",
                "Earn the emotion before asking for it"
            ],
            "The Cynic Ghost": [
                "Face the hard truth without flinching",
                "Show the cost alongside the beauty",
                "Resist the false comfort"
            ],
            "The Ancestor Ghost": [
                "Connect to timeless patterns",
                "Honor what your grandmother would recognize",
                "Root the contemporary in the ancient"
            ],
            "The Character Ghost": [
                "Listen to what the character wants to say",
                "Let complexity survive the narrative",
                "Characters are discovered, not constructed"
            ]
        }

        options = suggestions.get(ghost.name, ["Revise with intention."])
        return random.sample(options, min(2, len(options)))

    def _synthesize_verdict(self, artifact: CreativeArtifact,
                           critiques: List[GhostCritique]) -> CouncilVerdict:
        """Synthesize individual critiques into verdict"""
        return self._create_verdict(artifact.artifact_type, critiques)

    def _create_verdict(self, target: str, critiques: List[GhostCritique]) -> CouncilVerdict:
        """Create council verdict from critiques"""
        # Count votes
        votes = [c.vote for c in critiques]
        approve_count = votes.count(Vote.APPROVE)
        revise_count = votes.count(Vote.REVISE)
        reject_count = votes.count(Vote.REJECT)

        if approve_count > len(votes) / 2:
            overall = Vote.APPROVE
        elif reject_count > len(votes) / 2:
            overall = Vote.REJECT
        else:
            overall = Vote.REVISE

        # Collect concerns and strengths
        concerns = [c.criticism for c in critiques if c.criticism]
        strengths = [c.praise for c in critiques if c.praise]
        actions = []
        for c in critiques:
            actions.extend(c.specific_suggestions)

        # Generate debate summary
        debate = self._summarize_debate(critiques)

        return CouncilVerdict(
            id=generate_artifact_id("verdict"),
            target=target,
            critiques=critiques,
            overall_vote=overall,
            key_concerns=concerns[:5],
            key_strengths=strengths[:3],
            recommended_actions=actions[:5],
            debate_summary=debate
        )

    def _summarize_debate(self, critiques: List[GhostCritique]) -> str:
        """Summarize the debate among ghosts"""
        positions = []
        for c in critiques:
            position = f"{c.ghost_name} votes {c.vote.value.upper()}"
            if c.criticism:
                position += f": \"{c.criticism[:50]}...\""
            positions.append(position)

        return " | ".join(positions)

    def _generate_debate_position(self, ghost: GhostPersona, topic: str) -> Dict[str, str]:
        """Generate a ghost's position on a debate topic"""
        return {
            "ghost": ghost.name,
            "position": f"From my perspective on {ghost.focus_areas[0]}, {topic} demands...",
            "argument": random.choice(ghost.typical_questions),
            "signature": ghost.signature_phrase
        }

    def _synthesize_debate(self, topic: str, positions: List[Dict[str, str]]) -> str:
        """Synthesize debate positions into insight"""
        return f"The council's debate on '{topic}' revealed productive tensions between " + \
               " and ".join([p["ghost"].replace("The ", "").replace(" Ghost", "") for p in positions])

    def _identify_productive_tensions(self, positions: List[Dict[str, str]]) -> List[str]:
        """Identify productive tensions between positions"""
        tensions = [
            "Form vs. Ecstasy (Apollonian vs. Dionysian)",
            "System vs. Individual (Brecht vs. Wounded Child)",
            "Precision vs. Danger (Sondheim vs. Dionysian)",
            "Truth vs. Comfort (Cynic vs. Wounded Child)"
        ]
        return random.sample(tensions, min(2, len(tensions)))

    def _verdict_to_artifact(self, verdict: CouncilVerdict) -> CreativeArtifact:
        """Convert verdict to artifact"""
        return CreativeArtifact(
            id=verdict.id,
            artifact_type="council_verdict",
            content={
                "target": verdict.target,
                "overall_vote": verdict.overall_vote.value,
                "critiques": [
                    {
                        "ghost": c.ghost_name,
                        "vote": c.vote.value,
                        "praise": c.praise,
                        "criticism": c.criticism,
                        "questions": c.questions,
                        "suggestions": c.specific_suggestions,
                        "signature": c.signature_close
                    } for c in verdict.critiques
                ],
                "key_concerns": verdict.key_concerns,
                "key_strengths": verdict.key_strengths,
                "recommended_actions": verdict.recommended_actions,
                "debate_summary": verdict.debate_summary
            },
            source_engine=self.name
        )


# Convenience functions
def convene_council(target: str, target_type: str = "general",
                   ghosts: List[str] = None) -> CreativeArtifact:
    """
    Convene the Ghost Council.

    Example:
        verdict = convene_council(
            target="Claire's opening monologue",
            target_type="scene",
            ghosts=["sondheim", "fosse", "wounded_child"]
        )
    """
    from engines.core import EngineContext
    context = EngineContext("ghost_council", "musical")
    engine = GhostCouncil()
    engine.attach_context(context)

    return engine.generate({
        "target": target,
        "target_type": target_type,
        "ghosts": ghosts
    })[0]


def summon_ghost(ghost_name: str, target: str) -> GhostCritique:
    """
    Summon a single ghost for perspective.

    Example:
        sondheim_says = summon_ghost("sondheim", "These picket fences feel like bars")
    """
    engine = GhostCouncil()
    return engine.summon(ghost_name, target)
