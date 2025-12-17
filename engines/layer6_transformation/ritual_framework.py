"""
THE RITUAL FRAMEWORK
====================

Layer 7 (Apex): Transformation

"A return to theater's oldest purpose: transformation. The Greeks didn't go
to tragedies to enjoy themselves - they went to be purified."

Theater that doesn't transform is just expensive television.
The Framework makes transformation intentional, designable, achievable.
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


class RitualStage(Enum):
    """Stages of the ritual journey"""
    THRESHOLD = "threshold"      # Leaving ordinary world
    PREPARATION = "preparation"  # What must be shed
    ORDEAL = "ordeal"           # The suffering
    TRANSFORMATION = "transformation"  # The change
    RETURN = "return"           # Going back changed


class AudienceRole(Enum):
    """Roles the audience can play in the ritual"""
    WITNESSES = "witnesses"        # Observing, bearing witness
    JUDGES = "judges"              # Evaluating, deciding
    PARTICIPANTS = "participants"  # Active involvement
    GHOSTS = "ghosts"             # Present but invisible
    COMPLICIT = "complicit"        # Made responsible


@dataclass
class ThresholdDesign:
    """How the audience leaves the ordinary world"""
    crossing_marker: str  # What marks the boundary
    physical_element: str  # Bells, darkness, demand, etc.
    psychological_shift: str  # What must they let go of
    statement_of_contract: str  # What they agree to by entering


@dataclass
class PreparationDesign:
    """What the audience must shed before receiving the story"""
    what_to_shed: List[str]
    how_to_shed_it: str
    what_to_accept: List[str]
    how_to_accept_it: str


@dataclass
class OrdealDesign:
    """The play as ordeal for characters AND audience"""
    character_suffering: str
    audience_parallel: str
    shared_experience: str
    cannot_look_away: str


@dataclass
class TransformationDesign:
    """What changes in the audience, not just the characters"""
    audience_before: str
    audience_after: str
    mechanism_of_change: str
    cannot_be_unchanged: str


@dataclass
class ReturnDesign:
    """The crossing back to ordinary life"""
    release_ritual: str
    blessing: str
    what_they_take: str
    what_they_leave: str


@dataclass
class RitualStructure:
    """Complete ritual structure for a piece"""
    id: str
    piece_name: str
    transformation_objective: str  # What should be different after
    threshold: ThresholdDesign
    preparation: PreparationDesign
    ordeal: OrdealDesign
    transformation: TransformationDesign
    return_: ReturnDesign
    audience_role: AudienceRole
    role_mechanics: str


# Ritual element libraries

THRESHOLD_ELEMENTS = {
    "darkness": {
        "crossing_marker": "Complete darkness before light",
        "physical": "Lights extinguish, audience sits in dark",
        "psychological": "Loss of visual safety",
        "contract": "You agree to not see everything"
    },
    "bells": {
        "crossing_marker": "Sound marks the boundary",
        "physical": "Bells toll, calling to ritual",
        "psychological": "Announcement of sacred time",
        "contract": "You agree this time is different"
    },
    "demand": {
        "crossing_marker": "Active request required",
        "physical": "Sign something, speak something, give something",
        "psychological": "Commitment required to enter",
        "contract": "You have agreed to participate"
    },
    "spatial_crossing": {
        "crossing_marker": "Physical threshold to cross",
        "physical": "Walk through, step over, pass through curtain",
        "psychological": "Body marks the transition",
        "contract": "You chose to enter"
    },
    "confession": {
        "crossing_marker": "Must reveal something to enter",
        "physical": "Write a secret, whisper a truth",
        "psychological": "Vulnerability as entry price",
        "contract": "You have shown yourself"
    }
}

PREPARATION_REQUIREMENTS = {
    "cynicism": {
        "shed": "The protective distance of irony",
        "accept": "Genuine emotional vulnerability"
    },
    "certainty": {
        "shed": "Knowing how this ends",
        "accept": "Not knowing what will happen"
    },
    "innocence": {
        "shed": "The belief you are separate from this",
        "accept": "Complicity in what unfolds"
    },
    "judgment": {
        "shed": "The position of moral superiority",
        "accept": "You would do the same thing"
    },
    "safety": {
        "shed": "The belief you are protected here",
        "accept": "Something could reach you"
    }
}

ORDEAL_TYPES = {
    "witness_the_unbearable": {
        "character": "Character faces what cannot be faced",
        "audience": "Audience must watch without rescue",
        "shared": "Both are changed by the seeing"
    },
    "implicated_in_wrong": {
        "character": "Character commits the transgression",
        "audience": "Audience is made complicit",
        "shared": "Neither is innocent afterward"
    },
    "loss_without_redemption": {
        "character": "Character loses irreversibly",
        "audience": "Audience cannot provide comfort",
        "shared": "The loss is real"
    },
    "truth_cannot_be_unheard": {
        "character": "Character speaks the unspeakable",
        "audience": "Audience hears what cannot be unheard",
        "shared": "Both know something now"
    }
}

TRANSFORMATION_TYPES = {
    "cannot_unsee": "Once you've seen this, you cannot pretend not to know",
    "expanded_capacity": "You now have room for something you didn't before",
    "broken_certainty": "Something you were sure of is now questionable",
    "felt_connection": "You experienced someone else's inner life",
    "confronted_shadow": "You met a part of yourself you usually avoid",
    "glimpsed_sacred": "You touched something beyond the everyday"
}

RETURN_BLESSINGS = [
    "Go in peace, carrying what you must",
    "Return to the world, changed",
    "Take this with you, give it away",
    "You have seen. Now live differently.",
    "The ritual ends. The transformation continues.",
    "What happened here stays with you always"
]


@EngineRegistry.register
class RitualFramework(CreativeEngine):
    """
    The Ritual Framework Engine - transformation apex.

    Designs theater as sacred ceremony.
    Makes transformation intentional, designable, achievable.
    """

    def __init__(self):
        super().__init__("RitualFramework", EngineLayer.TRANSFORMATION)
        self._rituals: Dict[str, RitualStructure] = {}
        self.depends_on("BreakingEngine", "GhostCouncil")

    def process(self, artifact: CreativeArtifact) -> CreativeArtifact:
        """
        Process an artifact through the Ritual Framework.
        Design transformation architecture.
        """
        # Identify transformation objective
        objective = self._identify_transformation_objective(artifact)
        artifact.add_insight(self.name, "transformation_objective", objective)

        # Design threshold
        threshold = self._design_threshold(artifact)
        artifact.add_insight(self.name, "threshold_design", threshold)

        # Design audience role
        role = self._design_audience_role(artifact)
        artifact.add_insight(self.name, "audience_role", role)

        # Identify ordeal type
        ordeal = self._identify_ordeal(artifact)
        artifact.add_insight(self.name, "ordeal_type", ordeal)

        # Design transformation mechanism
        mechanism = self._design_transformation(artifact)
        artifact.add_insight(self.name, "transformation_mechanism", mechanism)

        return artifact

    def generate(self, seed: Optional[Dict[str, Any]] = None) -> List[CreativeArtifact]:
        """
        Generate a ritual structure.

        Seed parameters:
        - piece_name: name of the theatrical piece
        - transformation_objective: what should be different after
        - audience_role: desired role for audience
        - threshold_type: type of threshold crossing
        """
        seed = seed or {}
        piece_name = seed.get("piece_name", "Untitled Ritual")
        objective = seed.get("transformation_objective", "The audience will leave unable to see the world the same way")
        audience_role = seed.get("audience_role", AudienceRole.WITNESSES)
        threshold_type = seed.get("threshold_type", "darkness")

        ritual = self.design_ritual(piece_name, objective, audience_role, threshold_type)
        return [self._ritual_to_artifact(ritual)]

    def design_ritual(self, piece_name: str, transformation_objective: str,
                     audience_role: AudienceRole = AudienceRole.WITNESSES,
                     threshold_type: str = "darkness") -> RitualStructure:
        """
        Design a complete ritual structure.

        Example:
            ritual = design_ritual(
                "Picket Fence Prison",
                "Audience cannot see suburban houses the same way",
                AudienceRole.COMPLICIT,
                "demand"
            )
        """
        # Design threshold
        threshold_data = THRESHOLD_ELEMENTS.get(threshold_type, THRESHOLD_ELEMENTS["darkness"])
        threshold = ThresholdDesign(
            crossing_marker=threshold_data["crossing_marker"],
            physical_element=threshold_data["physical"],
            psychological_shift=threshold_data["psychological"],
            statement_of_contract=threshold_data["contract"]
        )

        # Design preparation
        prep_type = random.choice(list(PREPARATION_REQUIREMENTS.keys()))
        prep_data = PREPARATION_REQUIREMENTS[prep_type]
        preparation = PreparationDesign(
            what_to_shed=[prep_data["shed"]],
            how_to_shed_it=f"The threshold experience strips this away",
            what_to_accept=[prep_data["accept"]],
            how_to_accept_it=f"By entering, they agree to {prep_data['accept'].lower()}"
        )

        # Design ordeal
        ordeal_type = random.choice(list(ORDEAL_TYPES.keys()))
        ordeal_data = ORDEAL_TYPES[ordeal_type]
        ordeal = OrdealDesign(
            character_suffering=ordeal_data["character"],
            audience_parallel=ordeal_data["audience"],
            shared_experience=ordeal_data["shared"],
            cannot_look_away="The staging makes escape impossible"
        )

        # Design transformation
        transform_type = random.choice(list(TRANSFORMATION_TYPES.keys()))
        transformation = TransformationDesign(
            audience_before="Untouched by this truth",
            audience_after=TRANSFORMATION_TYPES[transform_type],
            mechanism_of_change=f"Through the ordeal of {ordeal_type.replace('_', ' ')}",
            cannot_be_unchanged="The experience leaves permanent marks"
        )

        # Design return
        return_design = ReturnDesign(
            release_ritual="Gradual return of ordinary light and sound",
            blessing=random.choice(RETURN_BLESSINGS),
            what_they_take="The transformation; the knowledge; the feeling",
            what_they_leave="The pretense that they didn't know"
        )

        # Design role mechanics
        role_mechanics = self._design_role_mechanics(audience_role, piece_name)

        ritual = RitualStructure(
            id=generate_artifact_id("ritual"),
            piece_name=piece_name,
            transformation_objective=transformation_objective,
            threshold=threshold,
            preparation=preparation,
            ordeal=ordeal,
            transformation=transformation,
            return_=return_design,
            audience_role=audience_role,
            role_mechanics=role_mechanics
        )

        self._rituals[ritual.id] = ritual
        return ritual

    def design_threshold(self, threshold_type: str, piece_name: str) -> ThresholdDesign:
        """
        Design a specific threshold crossing.

        Example:
            threshold = design_threshold("demand", "Picket Fence Prison")
        """
        data = THRESHOLD_ELEMENTS.get(threshold_type, THRESHOLD_ELEMENTS["darkness"])
        return ThresholdDesign(
            crossing_marker=data["crossing_marker"],
            physical_element=data["physical"],
            psychological_shift=data["psychological"],
            statement_of_contract=data["contract"]
        )

    def design_audience_involvement(self, role: AudienceRole, moments: List[str]) -> Dict[str, Any]:
        """
        Design specific audience involvement moments.

        Example:
            involvement = design_audience_involvement(
                AudienceRole.COMPLICIT,
                ["opening", "intermission", "finale"]
            )
        """
        involvement = {
            "role": role.value,
            "moments": {}
        }

        for moment in moments:
            involvement["moments"][moment] = self._design_involvement_moment(role, moment)

        return involvement

    def design_ordeal(self, ordeal_type: str, specific_content: str) -> OrdealDesign:
        """
        Design a specific ordeal experience.
        """
        data = ORDEAL_TYPES.get(ordeal_type, ORDEAL_TYPES["witness_the_unbearable"])
        return OrdealDesign(
            character_suffering=f"{data['character']}: {specific_content}",
            audience_parallel=data["audience"],
            shared_experience=data["shared"],
            cannot_look_away="No exit, no comfort, no rescue"
        )

    def design_transformation(self, transformation_type: str,
                            before: str, after: str) -> TransformationDesign:
        """
        Design the transformation mechanism.
        """
        return TransformationDesign(
            audience_before=before,
            audience_after=after,
            mechanism_of_change=TRANSFORMATION_TYPES.get(transformation_type,
                                                         TRANSFORMATION_TYPES["cannot_unsee"]),
            cannot_be_unchanged="The experience marks them permanently"
        )

    def create_immersive_experience(self, piece_name: str,
                                   transformation_objective: str) -> Dict[str, Any]:
        """
        Create a fully immersive ritual experience design.

        For pieces that transform the audience through total environmental immersion.
        """
        ritual = self.design_ritual(
            piece_name, transformation_objective,
            AudienceRole.PARTICIPANTS, "spatial_crossing"
        )

        return {
            "ritual_structure": ritual,
            "pre_show": {
                "environment": f"Audience enters through recreated setting of {piece_name}",
                "actors_as_guides": "Performers guide audience in character",
                "sensory_elements": "Smell, touch, temperature designed",
                "complicity_moment": "Audience signs/speaks/gives something"
            },
            "during_show": {
                "mobility": "Audience may move or be moved",
                "proximity": "Performers can address audience directly",
                "integration": "Audience becomes part of the world",
                "no_fourth_wall": "The divide never exists"
            },
            "post_show": {
                "decompression": "Gradual return to ordinary",
                "ritual_object": "Audience takes something physical",
                "integration_space": "Place to process before leaving",
                "no_clean_exit": "The transition is marked but not complete"
            }
        }

    def _identify_transformation_objective(self, artifact: CreativeArtifact) -> str:
        """Identify what transformation the piece should create"""
        content = str(artifact.content).lower()

        if "suburban" in content or "home" in content:
            return "Audience cannot see suburban safety the same way"
        elif "family" in content:
            return "Audience will question their own family dynamics"
        elif "love" in content or "relationship" in content:
            return "Audience will examine what they call love"
        else:
            return "Audience will leave changed in ways they can't fully name"

    def _design_threshold(self, artifact: CreativeArtifact) -> Dict[str, str]:
        """Design threshold based on artifact"""
        return {
            "type": "darkness",
            "physical": "Complete darkness before first light",
            "psychological": "Loss of visual control",
            "contract": "By staying in darkness, you agree to see"
        }

    def _design_audience_role(self, artifact: CreativeArtifact) -> Dict[str, str]:
        """Design audience role"""
        return {
            "role": "witnesses",
            "mechanics": "Cannot intervene, must watch, will be marked by watching"
        }

    def _identify_ordeal(self, artifact: CreativeArtifact) -> Dict[str, str]:
        """Identify ordeal type"""
        return {
            "type": "witness_the_unbearable",
            "character_suffering": "Character faces what cannot be faced",
            "audience_parallel": "Audience must watch without rescue"
        }

    def _design_transformation(self, artifact: CreativeArtifact) -> Dict[str, str]:
        """Design transformation mechanism"""
        return {
            "type": "cannot_unsee",
            "mechanism": "Through direct witness of truth",
            "permanence": "The knowledge cannot be forgotten"
        }

    def _design_role_mechanics(self, role: AudienceRole, piece_name: str) -> str:
        """Design specific mechanics for audience role"""
        mechanics = {
            AudienceRole.WITNESSES: f"Audience observes {piece_name}, cannot intervene, bears witness",
            AudienceRole.JUDGES: f"Audience is asked to evaluate characters in {piece_name}",
            AudienceRole.PARTICIPANTS: f"Audience is woven into the world of {piece_name}",
            AudienceRole.GHOSTS: f"Audience is invisible presence in {piece_name}",
            AudienceRole.COMPLICIT: f"Audience is made responsible for events in {piece_name}"
        }
        return mechanics.get(role, "Audience role not specified")

    def _design_involvement_moment(self, role: AudienceRole, moment: str) -> Dict[str, str]:
        """Design specific involvement for a moment"""
        if role == AudienceRole.COMPLICIT:
            return {
                "moment": moment,
                "action": "Audience is made responsible",
                "mechanism": "Sign, vote, or witness with consequence"
            }
        elif role == AudienceRole.PARTICIPANTS:
            return {
                "moment": moment,
                "action": "Audience becomes part of action",
                "mechanism": "Movement, speech, or presence required"
            }
        else:
            return {
                "moment": moment,
                "action": "Audience observes",
                "mechanism": "Witness without intervention"
            }

    def _ritual_to_artifact(self, ritual: RitualStructure) -> CreativeArtifact:
        """Convert ritual to artifact"""
        return CreativeArtifact(
            id=ritual.id,
            artifact_type="ritual_structure",
            content={
                "piece_name": ritual.piece_name,
                "transformation_objective": ritual.transformation_objective,
                "threshold": {
                    "crossing_marker": ritual.threshold.crossing_marker,
                    "physical_element": ritual.threshold.physical_element,
                    "psychological_shift": ritual.threshold.psychological_shift,
                    "contract": ritual.threshold.statement_of_contract
                },
                "preparation": {
                    "what_to_shed": ritual.preparation.what_to_shed,
                    "how_to_shed": ritual.preparation.how_to_shed_it,
                    "what_to_accept": ritual.preparation.what_to_accept,
                    "how_to_accept": ritual.preparation.how_to_accept_it
                },
                "ordeal": {
                    "character_suffering": ritual.ordeal.character_suffering,
                    "audience_parallel": ritual.ordeal.audience_parallel,
                    "shared_experience": ritual.ordeal.shared_experience
                },
                "transformation": {
                    "before": ritual.transformation.audience_before,
                    "after": ritual.transformation.audience_after,
                    "mechanism": ritual.transformation.mechanism_of_change
                },
                "return": {
                    "release_ritual": ritual.return_.release_ritual,
                    "blessing": ritual.return_.blessing,
                    "what_they_take": ritual.return_.what_they_take,
                    "what_they_leave": ritual.return_.what_they_leave
                },
                "audience_role": ritual.audience_role.value,
                "role_mechanics": ritual.role_mechanics
            },
            source_engine=self.name
        )


# Convenience functions
def design_ritual_for(piece_name: str, transformation: str,
                     audience_role: str = "witnesses") -> CreativeArtifact:
    """
    Design a ritual structure for a piece.

    Example:
        ritual = design_ritual_for(
            "Picket Fence Prison",
            "Audience cannot see suburban houses the same way",
            audience_role="complicit"
        )
    """
    from engines.core import EngineContext
    context = EngineContext("ritual_framework", "musical")
    engine = RitualFramework()
    engine.attach_context(context)

    role = AudienceRole[audience_role.upper()] if audience_role.upper() in AudienceRole.__members__ else AudienceRole.WITNESSES

    return engine.generate({
        "piece_name": piece_name,
        "transformation_objective": transformation,
        "audience_role": role
    })[0]
