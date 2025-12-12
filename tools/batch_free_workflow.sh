#!/bin/bash
# Batch Free Vocal Production Workflow
# Processes all ABC files in a show directory
#
# Usage: ./batch_free_workflow.sh [show_name]
#        ./batch_free_workflow.sh picket_fence_prison
#        ./batch_free_workflow.sh silly_magic_academy
#        ./batch_free_workflow.sh  # processes all shows

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ABC_BASE_DIR="$PROJECT_DIR/compositions/abc"
OUTPUT_BASE_DIR="$PROJECT_DIR/output"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_header() {
    echo ""
    echo -e "${CYAN}============================================${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}============================================${NC}"
    echo ""
}

log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

check_dependencies() {
    if ! command -v abc2midi &> /dev/null; then
        log_error "abc2midi not found!"
        echo ""
        echo "Install with:"
        echo "  macOS:  brew install abcmidi"
        echo "  Ubuntu: sudo apt-get install abcmidi"
        exit 1
    fi
}

process_show() {
    local show_name="$1"
    local abc_dir="$ABC_BASE_DIR/$show_name"
    local output_dir="$OUTPUT_BASE_DIR/$show_name"

    if [ ! -d "$abc_dir" ]; then
        log_warn "Show directory not found: $abc_dir"
        return
    fi

    local abc_count=$(find "$abc_dir" -name "*.abc" 2>/dev/null | wc -l)
    if [ "$abc_count" -eq 0 ]; then
        log_warn "No ABC files found in: $abc_dir"
        return
    fi

    log_header "Processing: $show_name ($abc_count songs)"

    mkdir -p "$output_dir"

    local success=0
    local failed=0

    for abc_file in "$abc_dir"/*.abc; do
        if [ -f "$abc_file" ]; then
            local basename=$(basename "$abc_file" .abc)

            # Convert to MIDI
            if abc2midi "$abc_file" -o "$output_dir/${basename}.mid" 2>/dev/null; then
                log_info "$basename.mid"
                ((success++))

                # Extract lyrics
                if grep -q "^w:" "$abc_file"; then
                    grep "^w:" "$abc_file" | sed 's/^w://' > "$output_dir/${basename}_lyrics.txt"
                fi
            else
                log_error "$basename (conversion failed)"
                ((failed++))
            fi
        fi
    done

    echo ""
    echo "Summary: $success succeeded, $failed failed"
    echo "Output:  $output_dir/"
}

list_shows() {
    echo "Available shows:"
    for dir in "$ABC_BASE_DIR"/*/; do
        if [ -d "$dir" ]; then
            local name=$(basename "$dir")
            local count=$(find "$dir" -name "*.abc" 2>/dev/null | wc -l)
            echo "  - $name ($count songs)"
        fi
    done
}

create_lyrics_master() {
    local output_dir="$1"
    local master_file="$output_dir/ALL_LYRICS.txt"

    log_header "Creating Master Lyrics File"

    echo "# PlayWright - Lyrics for Voice Synthesis" > "$master_file"
    echo "# Format lyrics with hyphens for syllables in Synthesizer V" >> "$master_file"
    echo "" >> "$master_file"

    for lyrics_file in "$output_dir"/*_lyrics.txt; do
        if [ -f "$lyrics_file" ]; then
            local song_name=$(basename "$lyrics_file" _lyrics.txt)
            echo "## $song_name" >> "$master_file"
            echo "" >> "$master_file"
            cat "$lyrics_file" >> "$master_file"
            echo "" >> "$master_file"
            echo "---" >> "$master_file"
            echo "" >> "$master_file"
        fi
    done

    log_info "Created: $master_file"
}

print_next_steps() {
    log_header "Next Steps (Free Tools)"

    cat << 'EOF'
1. DOWNLOAD FREE SOFTWARE
   - Synthesizer V Basic: https://dreamtonics.com/en/synthesizerv/
   - Eleanor Forte Lite:  https://resource.dreamtonics.com/download/
   - Audacity (mixing):   https://www.audacityteam.org/

2. IMPORT MIDI INTO SYNTHESIZER V
   - Open Synthesizer V Basic
   - File → Import → MIDI File
   - Select a .mid file from the output directory

3. ADD VOICE AND LYRICS
   - Select Eleanor Forte as the voice database
   - Click on notes to add lyrics
   - Use hyphens for syllables: "Hel-lo world"
   - See *_lyrics.txt files for reference

4. RENDER VOCALS
   - File → Render → Render to File
   - Choose WAV format, 44100 Hz

5. MIX IN AUDACITY
   - Import instrumental track (if you have one)
   - Import vocal WAV from Synthesizer V
   - Apply EQ, compression, reverb as needed
   - Export final mix

TIPS FOR SYNTHESIZER V:
   - Use Ctrl+L to open lyrics editor for bulk entry
   - Double-click notes to edit individual phonemes
   - Use the AI Retakes feature for natural variation
   - Adjust Tension parameter for belt vs soft singing

EOF
}

main() {
    check_dependencies

    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║   PlayWright - Free Vocal Workflow         ║${NC}"
    echo -e "${CYAN}║   Batch ABC to MIDI Converter              ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"

    if [ "$1" = "--list" ] || [ "$1" = "-l" ]; then
        list_shows
        exit 0
    fi

    if [ -n "$1" ]; then
        # Process specific show
        process_show "$1"
        create_lyrics_master "$OUTPUT_BASE_DIR/$1"
    else
        # Process all shows
        for dir in "$ABC_BASE_DIR"/*/; do
            if [ -d "$dir" ]; then
                local name=$(basename "$dir")
                process_show "$name"
                create_lyrics_master "$OUTPUT_BASE_DIR/$name"
            fi
        done
    fi

    print_next_steps
}

main "$@"
