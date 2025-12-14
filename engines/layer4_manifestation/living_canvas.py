"""
THE LIVING CANVAS ENGINE
=========================

Layer 4b: Visual Truth

"A map of the story's soul made visible. Not WHERE things are,
but HOW THINGS FEEL ABOUT EACH OTHER. A theatrical EKG."

The Living Canvas is externalized intuition. A scene that "feels flat"
would LOOK flat. A character who "feels disconnected" would drift to the margins.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional, Tuple
from enum import Enum
import random
import math

import sys
sys.path.insert(0, '/home/user/PlayWright')
from engines.core import (
    CreativeEngine,
    EngineLayer,
    CreativeArtifact,
    EngineRegistry,
    generate_artifact_id
)


class GravitationalForce(Enum):
    """Types of gravitational force between elements"""
    ATTRACTION = "attraction"
    REPULSION = "repulsion"
    ORBIT = "orbit"
    COLLISION = "collision"
    VOID = "void"


class VisualElement(Enum):
    """Types of visual elements on the canvas"""
    CHARACTER = "character"
    RELATIONSHIP = "relationship"
    SECRET = "secret"
    SCENE = "scene"
    OBJECT = "object"
    GHOST = "ghost"  # Past relationships/presences
    SHADOW = "shadow"  # Future foreshadowing


@dataclass
class GravitationalNode:
    """A node with gravitational weight on the canvas"""
    id: str
    name: str
    element_type: VisualElement
    dramatic_weight: float  # 0.0 - 1.0, affects gravitational pull
    color: str
    position: Tuple[float, float]  # x, y coordinates
    pulse_rate: float  # Emotional intensity causes pulsing
    visibility: float  # 0.0 = hidden, 1.0 = fully visible


@dataclass
class RelationshipBend:
    """How a relationship bends narrative space"""
    id: str
    from_node: str
    to_node: str
    force_type: GravitationalForce
    intensity: float  # 0.0 - 1.0
    color: str
    line_style: str  # solid, dotted (lies), ghosted (past)
    label: Optional[str] = None


@dataclass
class SecretMass:
    """Secrets as dark matter - invisible but warping everything"""
    id: str
    secret_content: str
    holder: str  # Who holds the secret
    affects: List[str]  # Who it affects
    warp_radius: float  # How far its influence extends
    revelation_potential: float  # 0.0 - 1.0, likelihood of emergence


@dataclass
class EmotionalWeather:
    """The emotional atmosphere of a scene/moment"""
    temperature: float  # Cold = tension, hot = passion
    pressure: str  # Low, building, high, explosive
    visibility: str  # Clear, foggy, dark
    precipitation: str  # None, tears, blood, sweat


@dataclass
class CanvasState:
    """Complete state of the Living Canvas at a moment"""
    id: str
    moment_name: str
    nodes: List[GravitationalNode]
    relationships: List[RelationshipBend]
    secrets: List[SecretMass]
    weather: EmotionalWeather
    breathing: str  # expanding, contracting, held
    center_of_gravity: str  # Which node pulls everything


# Visual vocabulary
COLOR_MEANINGS = {
    "crimson": "passion, blood, danger",
    "gold": "performance, value, desire",
    "gray": "fading, absence, numbness",
    "indigo": "secrets, depth, mystery",
    "amber": "warmth, nostalgia, trapped light",
    "black": "void, death, the hidden",
    "white": "revelation, innocence, exposure",
    "beige": "suffocation, domesticity, erasure"
}

PULSE_MEANINGS = {
    0.0: "dead, no emotional pulse",
    0.3: "subdued, controlled",
    0.5: "normal, healthy",
    0.7: "elevated, anxiety or excitement",
    1.0: "crisis, overwhelming emotion"
}

LINE_STYLES = {
    "solid": "acknowledged, real connection",
    "dotted": "lies, false belief about connection",
    "dashed": "uncertain, potential connection",
    "ghosted": "past connection, memory",
    "thick": "dominant relationship",
    "thin": "weak or fading connection",
    "pulsing": "active tension"
}

CANVAS_BREATHING = {
    "expanding": "Tension building, space opening",
    "contracting": "Pressure mounting, walls closing",
    "held": "Suspended moment, before the break",
    "ragged": "Unstable, unpredictable",
    "steady": "Equilibrium, but for how long?"
}


@EngineRegistry.register
class LivingCanvas(CreativeEngine):
    """
    The Living Canvas Engine - visual truth of story dynamics.

    Creates spatial maps of dramatic relationships and tensions.
    Externalizes intuition into visible, designable form.
    """

    def __init__(self):
        super().__init__("LivingCanvas", EngineLayer.MANIFESTATION)
        self._canvas_states: Dict[str, CanvasState] = {}
        self.depends_on("CharacterGenetics", "SynestheticTranslator")

    def process(self, artifact: CreativeArtifact) -> CreativeArtifact:
        """
        Process an artifact through the Living Canvas.
        Add visual/spatial dimensions to content.
        """
        # Get upstream insights
        genetics = self.get_upstream_insights(artifact, "CharacterGenetics")
        synesthetic = self.get_upstream_insights(artifact, "SynestheticTranslator")

        # Generate gravitational map
        gravity_map = self._generate_gravity_map(artifact, genetics)
        artifact.add_insight(self.name, "gravitational_map", gravity_map)

        # Identify dark matter (secrets)
        dark_matter = self._identify_dark_matter(artifact)
        artifact.add_insight(self.name, "dark_matter", dark_matter)

        # Calculate emotional weather
        weather = self._calculate_weather(artifact, synesthetic)
        artifact.add_insight(self.name, "emotional_weather", weather)

        # Determine canvas breathing
        breathing = self._determine_breathing(artifact)
        artifact.add_insight(self.name, "canvas_breathing", breathing)

        # Generate visual design notes
        design = self._generate_visual_design(artifact)
        artifact.add_insight(self.name, "visual_design", design)

        return artifact

    def generate(self, seed: Optional[Dict[str, Any]] = None) -> List[CreativeArtifact]:
        """
        Generate a Living Canvas visualization.

        Seed parameters:
        - characters: list of character dicts with name, weight, color
        - relationships: list of relationship dicts
        - secrets: list of secret strings
        - scene_name: name of the scene/moment
        """
        seed = seed or {}
        characters = seed.get("characters", [])
        relationships = seed.get("relationships", [])
        secrets = seed.get("secrets", [])
        scene_name = seed.get("scene_name", "Untitled Scene")

        canvas = self.create_canvas(scene_name, characters, relationships, secrets)
        return [self._canvas_to_artifact(canvas)]

    def create_canvas(self, scene_name: str, characters: List[Dict[str, Any]],
                     relationships: List[Dict[str, Any]],
                     secrets: List[str]) -> CanvasState:
        """
        Create a complete Living Canvas visualization.

        Example:
            canvas = create_canvas(
                "Act II Opening",
                characters=[
                    {"name": "Claire", "weight": 0.7, "color": "crimson"},
                    {"name": "David", "weight": 0.9, "color": "black"}
                ],
                relationships=[
                    {"from": "David", "to": "Claire", "force": "attraction", "intensity": 0.8}
                ],
                secrets=["David is cosplaying his dead wife"]
            )
        """
        # Create character nodes
        nodes = []
        for i, char in enumerate(characters):
            # Calculate position in circular arrangement
            angle = (2 * math.pi * i) / max(len(characters), 1)
            x = 0.5 + 0.3 * math.cos(angle)
            y = 0.5 + 0.3 * math.sin(angle)

            node = GravitationalNode(
                id=generate_artifact_id("node"),
                name=char.get("name", f"Character {i}"),
                element_type=VisualElement.CHARACTER,
                dramatic_weight=char.get("weight", 0.5),
                color=char.get("color", "gray"),
                position=(x, y),
                pulse_rate=char.get("pulse", 0.5),
                visibility=1.0
            )
            nodes.append(node)

        # Create relationship bends
        rel_bends = []
        for rel in relationships:
            from_node = rel.get("from", "")
            to_node = rel.get("to", "")
            force = rel.get("force", "attraction")
            if isinstance(force, str):
                force = GravitationalForce[force.upper()] if force.upper() in GravitationalForce.__members__ else GravitationalForce.ATTRACTION

            bend = RelationshipBend(
                id=generate_artifact_id("rel"),
                from_node=from_node,
                to_node=to_node,
                force_type=force if isinstance(force, GravitationalForce) else GravitationalForce.ATTRACTION,
                intensity=rel.get("intensity", 0.5),
                color=rel.get("color", "white"),
                line_style=rel.get("style", "solid"),
                label=rel.get("label")
            )
            rel_bends.append(bend)

        # Create secret masses
        secret_masses = []
        for i, secret in enumerate(secrets):
            mass = SecretMass(
                id=generate_artifact_id("secret"),
                secret_content=secret,
                holder=characters[i % len(characters)]["name"] if characters else "Unknown",
                affects=[c["name"] for c in characters],
                warp_radius=0.3,
                revelation_potential=random.uniform(0.3, 0.8)
            )
            secret_masses.append(mass)

        # Calculate emotional weather
        avg_intensity = sum(r.intensity for r in rel_bends) / max(len(rel_bends), 1) if rel_bends else 0.5
        weather = EmotionalWeather(
            temperature=avg_intensity * 100,
            pressure="building" if avg_intensity > 0.6 else "low",
            visibility="foggy" if secrets else "clear",
            precipitation="sweat" if avg_intensity > 0.7 else "none"
        )

        # Determine center of gravity
        if nodes:
            heaviest = max(nodes, key=lambda n: n.dramatic_weight)
            center = heaviest.name
        else:
            center = "void"

        canvas = CanvasState(
            id=generate_artifact_id("canvas"),
            moment_name=scene_name,
            nodes=nodes,
            relationships=rel_bends,
            secrets=secret_masses,
            weather=weather,
            breathing="held" if secrets else "steady",
            center_of_gravity=center
        )

        self._canvas_states[canvas.id] = canvas
        return canvas

    def add_ghost_connection(self, canvas_id: str, ghost_name: str,
                            connected_to: str, nature: str) -> RelationshipBend:
        """
        Add a ghost connection - a relationship from before the play.

        Ghost connections: relationships that existed before the story begins
        but still warp the present space.
        """
        ghost = RelationshipBend(
            id=generate_artifact_id("ghost"),
            from_node=ghost_name,
            to_node=connected_to,
            force_type=GravitationalForce.ORBIT,
            intensity=0.4,
            color="silver",
            line_style="ghosted",
            label=f"Ghost: {nature}"
        )

        if canvas_id in self._canvas_states:
            self._canvas_states[canvas_id].relationships.append(ghost)

        return ghost

    def add_future_shadow(self, canvas_id: str, shadow_name: str,
                         foreshadows: str, connected_to: List[str]) -> GravitationalNode:
        """
        Add a future shadow - foreshadowing made geometric.

        Future shadows are dimly visible shapes of what's coming,
        casting their influence backward into the present.
        """
        shadow = GravitationalNode(
            id=generate_artifact_id("shadow"),
            name=shadow_name,
            element_type=VisualElement.SHADOW,
            dramatic_weight=0.3,
            color="dim_gold",
            position=(0.9, 0.9),  # Corner of canvas
            pulse_rate=0.2,
            visibility=0.3  # Barely visible
        )

        if canvas_id in self._canvas_states:
            self._canvas_states[canvas_id].nodes.append(shadow)
            # Add faint connections
            for char in connected_to:
                faint_rel = RelationshipBend(
                    id=generate_artifact_id("foreshadow"),
                    from_node=shadow_name,
                    to_node=char,
                    force_type=GravitationalForce.ATTRACTION,
                    intensity=0.2,
                    color="dim_gold",
                    line_style="dashed",
                    label=foreshadows
                )
                self._canvas_states[canvas_id].relationships.append(faint_rel)

        return shadow

    def mark_silent_scream(self, canvas_id: str, character: str,
                          what_they_cant_say: str) -> Dict[str, Any]:
        """
        Mark a silent scream - a character who wants to speak but can't.

        The canvas shows this as a contained explosion,
        visible pressure with no release.
        """
        silent_scream = {
            "character": character,
            "suppressed_truth": what_they_cant_say,
            "visual_representation": "Contained explosion, pulsing boundary",
            "color_shift": "Internal crimson glow behind surface color",
            "effect_on_space": "Creates localized pressure distortion"
        }

        if canvas_id in self._canvas_states:
            # Increase that character's pulse rate
            for node in self._canvas_states[canvas_id].nodes:
                if node.name == character:
                    node.pulse_rate = min(1.0, node.pulse_rate + 0.3)

        return silent_scream

    def add_ticking_clock(self, canvas_id: str, deadline_name: str,
                         affected_characters: List[str],
                         urgency: float) -> Dict[str, Any]:
        """
        Add a ticking clock - deadline as expanding circle consuming space.

        Clocks create pressure by visually shrinking the available space.
        """
        clock = {
            "deadline": deadline_name,
            "urgency": urgency,
            "visual": "Expanding circle from edge, consuming canvas",
            "current_radius": urgency,  # 0.0 = just started, 1.0 = deadline
            "affected": affected_characters,
            "effect": "Characters are being pushed toward each other or toward edges"
        }

        if canvas_id in self._canvas_states:
            self._canvas_states[canvas_id].breathing = "contracting"

        return clock

    def visualize_power_shift(self, canvas_id: str, from_char: str,
                             to_char: str, shift_type: str) -> Dict[str, Any]:
        """
        Visualize a power shift between characters.

        Power shifts change the gravitational center of the canvas.
        """
        if canvas_id not in self._canvas_states:
            return {}

        canvas = self._canvas_states[canvas_id]

        # Find the characters
        from_node = next((n for n in canvas.nodes if n.name == from_char), None)
        to_node = next((n for n in canvas.nodes if n.name == to_char), None)

        if not from_node or not to_node:
            return {}

        # Visualize the shift
        shift = {
            "type": shift_type,
            "from": from_char,
            "to": to_char,
            "before": {
                f"{from_char}_weight": from_node.dramatic_weight,
                f"{to_char}_weight": to_node.dramatic_weight,
                "center": canvas.center_of_gravity
            },
            "after": {
                f"{from_char}_weight": from_node.dramatic_weight * 0.7,
                f"{to_char}_weight": min(1.0, to_node.dramatic_weight * 1.3),
                "center": to_char
            },
            "visual_description": f"Gravitational center shifts from {from_char} to {to_char}. "
                                 f"Other elements reorient around new center."
        }

        # Apply the shift
        from_node.dramatic_weight *= 0.7
        to_node.dramatic_weight = min(1.0, to_node.dramatic_weight * 1.3)
        canvas.center_of_gravity = to_char

        return shift

    def render_to_ascii(self, canvas_id: str) -> str:
        """
        Render canvas to ASCII art for visualization.
        Simple representation of spatial relationships.
        """
        if canvas_id not in self._canvas_states:
            return "Canvas not found"

        canvas = self._canvas_states[canvas_id]

        # Simple ASCII representation
        width = 60
        height = 20

        grid = [[' ' for _ in range(width)] for _ in range(height)]

        # Place characters
        for node in canvas.nodes:
            if node.element_type == VisualElement.CHARACTER:
                x = int(node.position[0] * (width - 2)) + 1
                y = int(node.position[1] * (height - 2)) + 1
                char = node.name[0] if node.name else '?'

                # Size based on weight
                if node.dramatic_weight > 0.7:
                    grid[y][x] = char.upper()
                    if x > 0:
                        grid[y][x-1] = '('
                    if x < width - 1:
                        grid[y][x+1] = ')'
                else:
                    grid[y][x] = char.lower()

        # Draw relationships as lines
        for rel in canvas.relationships:
            if rel.line_style == "ghosted":
                line_char = '.'
            elif rel.line_style == "dotted":
                line_char = ':'
            else:
                line_char = '-'

            # Find nodes
            from_node = next((n for n in canvas.nodes if n.name == rel.from_node), None)
            to_node = next((n for n in canvas.nodes if n.name == rel.to_node), None)

            if from_node and to_node:
                x1 = int(from_node.position[0] * (width - 2)) + 1
                y1 = int(from_node.position[1] * (height - 2)) + 1
                x2 = int(to_node.position[0] * (width - 2)) + 1
                y2 = int(to_node.position[1] * (height - 2)) + 1

                # Draw simple line
                mid_x = (x1 + x2) // 2
                mid_y = (y1 + y2) // 2
                if 0 < mid_x < width and 0 < mid_y < height and grid[mid_y][mid_x] == ' ':
                    grid[mid_y][mid_x] = line_char

        # Add border
        result = f"╔{'═' * width}╗\n"
        result += f"║ {canvas.moment_name.center(width - 2)} ║\n"
        result += f"╠{'═' * width}╣\n"
        for row in grid:
            result += f"║{''.join(row)}║\n"
        result += f"╠{'═' * width}╣\n"
        result += f"║ Center: {canvas.center_of_gravity.ljust(width - 10)} ║\n"
        result += f"║ Breathing: {canvas.breathing.ljust(width - 13)} ║\n"
        result += f"╚{'═' * width}╝\n"

        return result

    def export_design_document(self, canvas_id: str) -> Dict[str, Any]:
        """
        Export canvas as production design document.
        """
        if canvas_id not in self._canvas_states:
            return {}

        canvas = self._canvas_states[canvas_id]

        return {
            "scene": canvas.moment_name,
            "for_set_designer": {
                "spatial_concept": f"Center around {canvas.center_of_gravity}",
                "breathing": CANVAS_BREATHING.get(canvas.breathing, ""),
                "visual_weight_distribution": [
                    {"character": n.name, "weight": n.dramatic_weight, "suggested_position": n.position}
                    for n in canvas.nodes if n.element_type == VisualElement.CHARACTER
                ]
            },
            "for_lighting_designer": {
                "focus": canvas.center_of_gravity,
                "weather": {
                    "temperature": canvas.weather.temperature,
                    "visibility": canvas.weather.visibility
                },
                "character_colors": [
                    {"character": n.name, "color": n.color, "pulse": n.pulse_rate}
                    for n in canvas.nodes
                ]
            },
            "for_director": {
                "gravitational_center": canvas.center_of_gravity,
                "power_dynamics": [
                    {"from": r.from_node, "to": r.to_node, "force": r.force_type.value, "intensity": r.intensity}
                    for r in canvas.relationships
                ],
                "secrets_warping_space": [
                    {"secret": s.secret_content, "holder": s.holder, "warp_radius": s.warp_radius}
                    for s in canvas.secrets
                ],
                "overall_breathing": canvas.breathing
            }
        }

    def _generate_gravity_map(self, artifact: CreativeArtifact,
                             genetics: Dict[str, Any]) -> Dict[str, Any]:
        """Generate gravitational map from artifact"""
        return {
            "description": "Map of dramatic weights and forces",
            "needs_input": "Character list with dramatic weights"
        }

    def _identify_dark_matter(self, artifact: CreativeArtifact) -> List[Dict[str, str]]:
        """Identify secrets (dark matter) in artifact"""
        content_str = str(artifact.content).lower()
        dark_matter = []

        secret_words = ["secret", "hidden", "lies", "truth", "knows"]
        for word in secret_words:
            if word in content_str:
                dark_matter.append({
                    "type": "detected_secret_reference",
                    "indicator": word,
                    "note": "Secrets warp narrative space like dark matter"
                })

        return dark_matter

    def _calculate_weather(self, artifact: CreativeArtifact,
                          synesthetic: Dict[str, Any]) -> Dict[str, str]:
        """Calculate emotional weather"""
        return {
            "temperature": "building",
            "pressure": "mounting",
            "visibility": "decreasing",
            "derived_from": "synesthetic analysis"
        }

    def _determine_breathing(self, artifact: CreativeArtifact) -> str:
        """Determine how the canvas is breathing"""
        content_str = str(artifact.content).lower()

        if "tension" in content_str or "pressure" in content_str:
            return "contracting"
        elif "release" in content_str or "freedom" in content_str:
            return "expanding"
        elif "moment" in content_str or "pause" in content_str:
            return "held"
        else:
            return "steady"

    def _generate_visual_design(self, artifact: CreativeArtifact) -> Dict[str, str]:
        """Generate visual design notes"""
        return {
            "spatial_note": "Arrange elements by dramatic weight",
            "color_note": "Character colors should reflect emotional state",
            "movement_note": "Blocking should follow gravitational pulls"
        }

    def _canvas_to_artifact(self, canvas: CanvasState) -> CreativeArtifact:
        """Convert canvas to artifact"""
        return CreativeArtifact(
            id=canvas.id,
            artifact_type="living_canvas",
            content={
                "scene": canvas.moment_name,
                "center_of_gravity": canvas.center_of_gravity,
                "breathing": canvas.breathing,
                "nodes": [
                    {
                        "name": n.name,
                        "type": n.element_type.value,
                        "weight": n.dramatic_weight,
                        "color": n.color,
                        "pulse": n.pulse_rate
                    } for n in canvas.nodes
                ],
                "relationships": [
                    {
                        "from": r.from_node,
                        "to": r.to_node,
                        "force": r.force_type.value,
                        "intensity": r.intensity,
                        "style": r.line_style
                    } for r in canvas.relationships
                ],
                "secrets": [
                    {
                        "content": s.secret_content,
                        "holder": s.holder,
                        "warp_radius": s.warp_radius
                    } for s in canvas.secrets
                ],
                "weather": {
                    "temperature": canvas.weather.temperature,
                    "pressure": canvas.weather.pressure,
                    "visibility": canvas.weather.visibility
                }
            },
            source_engine=self.name
        )


# Convenience function
def visualize(scene_name: str, characters: List[Dict[str, Any]],
             relationships: List[Dict[str, Any]] = None,
             secrets: List[str] = None) -> CreativeArtifact:
    """
    Create a Living Canvas visualization.

    Example:
        canvas = visualize(
            "The Confrontation",
            characters=[
                {"name": "David", "weight": 0.9, "color": "black"},
                {"name": "Claire", "weight": 0.7, "color": "crimson"},
                {"name": "Michael", "weight": 0.3, "color": "gray"}
            ],
            relationships=[
                {"from": "David", "to": "Claire", "force": "attraction", "intensity": 0.8},
                {"from": "Claire", "to": "Michael", "force": "repulsion", "intensity": 0.5}
            ],
            secrets=["David is cosplaying his dead wife"]
        )
    """
    from engines.core import EngineContext
    context = EngineContext("living_canvas", "musical")
    engine = LivingCanvas()
    engine.attach_context(context)

    return engine.generate({
        "scene_name": scene_name,
        "characters": characters,
        "relationships": relationships or [],
        "secrets": secrets or []
    })[0]
