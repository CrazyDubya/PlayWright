#!/bin/bash
# Free Vocal Production Workflow
# Converts ABC to MIDI and renders instrumental
#
# Usage: ./free_vocal_workflow.sh <abc_file>
#
# This script converts ABC notation files to:
#   - MIDI file (for import into Synthesizer V or OpenUtau)
#   - WAV instrumental track (using SoundFonts)

set -e

# Configuration - customize these paths as needed
SOUNDFONT="${SOUNDFONT:-}"
OUTPUT_DIR="${OUTPUT_DIR:-output}"

# Common SoundFont locations to search
SOUNDFONT_PATHS=(
    "/usr/share/sounds/sf2/FluidR3_GM.sf2"
    "/usr/share/soundfonts/FluidR3_GM.sf2"
    "/usr/local/share/soundfonts/FluidR3_GM.sf2"
    "$HOME/soundfonts/FluidR3_GM.sf2"
    "$HOME/.local/share/soundfonts/FluidR3_GM.sf2"
    "/opt/homebrew/share/soundfonts/default.sf2"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

usage() {
    cat << EOF
Free Vocal Production Workflow
==============================

Usage: $0 [options] <abc_file>

Converts ABC notation to MIDI and optional instrumental audio.

Options:
    -h, --help      Show this help message
    -o, --output    Output directory (default: output)
    -s, --soundfont Path to SoundFont file (.sf2)
    --midi-only     Only create MIDI, skip audio rendering

Examples:
    $0 compositions/abc/picket_fence_prison/01_picket_fence_prison.abc
    $0 -o my_output -s ~/soundfonts/FluidR3_GM.sf2 song.abc

Environment Variables:
    SOUNDFONT   Path to .sf2 SoundFont file
    OUTPUT_DIR  Output directory for generated files

After running this script:
    1. Open Synthesizer V Basic (free)
    2. File → Import → MIDI File
    3. Select the generated .mid file
    4. Choose Eleanor Forte as the voice
    5. Add lyrics in the editor
    6. Render to WAV
    7. Mix vocals with instrumental in Audacity (free)

EOF
    exit 0
}

find_soundfont() {
    # Check if SOUNDFONT is already set and valid
    if [ -n "$SOUNDFONT" ] && [ -f "$SOUNDFONT" ]; then
        return 0
    fi

    # Search common locations
    for sf in "${SOUNDFONT_PATHS[@]}"; do
        if [ -f "$sf" ]; then
            SOUNDFONT="$sf"
            return 0
        fi
    done

    return 1
}

check_dependencies() {
    local missing=""

    if ! command -v abc2midi &> /dev/null; then
        missing="$missing abc2midi"
    fi

    if [ -n "$missing" ]; then
        log_error "Missing required dependencies:$missing"
        echo ""
        echo "Install with:"
        echo "  macOS:  brew install abcmidi"
        echo "  Ubuntu: sudo apt-get install abcmidi"
        echo "  Fedora: sudo dnf install abcMIDI"
        exit 1
    fi

    # FluidSynth is optional
    if ! command -v fluidsynth &> /dev/null; then
        log_warn "FluidSynth not found - will skip audio rendering"
        log_warn "Install with: brew install fluidsynth (macOS) or apt-get install fluidsynth (Linux)"
        return 1
    fi

    return 0
}

render_audio() {
    local midi_file="$1"
    local output_file="$2"

    if ! command -v fluidsynth &> /dev/null; then
        return 1
    fi

    if ! find_soundfont; then
        log_warn "No SoundFont found. Skipping audio rendering."
        log_warn "Download FluidR3_GM.sf2 and set SOUNDFONT environment variable"
        return 1
    fi

    log_step "Rendering instrumental audio..."
    fluidsynth -ni "$SOUNDFONT" "$midi_file" -F "$output_file" -r 44100 2>/dev/null

    if [ $? -eq 0 ]; then
        log_info "Created: $output_file"
        return 0
    else
        log_error "Audio rendering failed"
        return 1
    fi
}

extract_lyrics() {
    local abc_file="$1"
    local output_file="$2"

    log_step "Extracting lyrics for voice synthesis..."

    # Extract w: lines from ABC file
    grep "^w:" "$abc_file" | sed 's/^w://' | tr '-' ' ' > "$output_file"

    if [ -s "$output_file" ]; then
        log_info "Lyrics extracted to: $output_file"
    else
        log_warn "No lyrics found in ABC file"
        rm -f "$output_file"
    fi
}

main() {
    local midi_only=false

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                usage
                ;;
            -o|--output)
                OUTPUT_DIR="$2"
                shift 2
                ;;
            -s|--soundfont)
                SOUNDFONT="$2"
                shift 2
                ;;
            --midi-only)
                midi_only=true
                shift
                ;;
            -*)
                log_error "Unknown option: $1"
                usage
                ;;
            *)
                ABC_FILE="$1"
                shift
                ;;
        esac
    done

    if [ -z "$ABC_FILE" ]; then
        log_error "No ABC file specified"
        usage
    fi

    if [ ! -f "$ABC_FILE" ]; then
        log_error "File not found: $ABC_FILE"
        exit 1
    fi

    # Check dependencies
    check_dependencies
    local has_fluidsynth=$?

    # Setup
    BASENAME=$(basename "$ABC_FILE" .abc)
    mkdir -p "$OUTPUT_DIR"

    echo ""
    echo "============================================"
    echo "  Free Vocal Production Workflow"
    echo "============================================"
    echo ""
    log_info "Processing: $ABC_FILE"
    echo ""

    # Step 1: Convert ABC to MIDI
    log_step "Converting ABC to MIDI..."
    abc2midi "$ABC_FILE" -o "$OUTPUT_DIR/${BASENAME}.mid" 2>/dev/null

    if [ $? -eq 0 ]; then
        log_info "Created: $OUTPUT_DIR/${BASENAME}.mid"
    else
        log_error "MIDI conversion failed"
        exit 1
    fi

    # Step 2: Extract lyrics
    extract_lyrics "$ABC_FILE" "$OUTPUT_DIR/${BASENAME}_lyrics.txt"

    # Step 3: Render audio (if not midi-only and fluidsynth available)
    if [ "$midi_only" = false ] && [ $has_fluidsynth -eq 0 ]; then
        render_audio "$OUTPUT_DIR/${BASENAME}.mid" "$OUTPUT_DIR/${BASENAME}_instrumental.wav"
    fi

    # Summary
    echo ""
    echo "============================================"
    echo "  Output Files"
    echo "============================================"
    echo ""
    echo "  MIDI:   $OUTPUT_DIR/${BASENAME}.mid"
    if [ -f "$OUTPUT_DIR/${BASENAME}_lyrics.txt" ]; then
        echo "  Lyrics: $OUTPUT_DIR/${BASENAME}_lyrics.txt"
    fi
    if [ -f "$OUTPUT_DIR/${BASENAME}_instrumental.wav" ]; then
        echo "  Audio:  $OUTPUT_DIR/${BASENAME}_instrumental.wav"
    fi
    echo ""
    echo "============================================"
    echo "  Next Steps (Free Tools)"
    echo "============================================"
    echo ""
    echo "  1. Download Synthesizer V Basic (free)"
    echo "     https://dreamtonics.com/en/synthesizerv/"
    echo ""
    echo "  2. Download Eleanor Forte Lite (free voice)"
    echo "     https://resource.dreamtonics.com/download/"
    echo ""
    echo "  3. Open Synthesizer V Basic"
    echo "     File → Import → MIDI File"
    echo "     Select: $OUTPUT_DIR/${BASENAME}.mid"
    echo ""
    echo "  4. Choose Eleanor Forte as the voice"
    echo ""
    echo "  5. Add lyrics in the note editor"
    if [ -f "$OUTPUT_DIR/${BASENAME}_lyrics.txt" ]; then
        echo "     (See: $OUTPUT_DIR/${BASENAME}_lyrics.txt)"
    fi
    echo ""
    echo "  6. Render vocals to WAV"
    echo ""
    echo "  7. Mix in Audacity (free)"
    echo "     https://www.audacityteam.org/"
    echo ""
}

main "$@"
