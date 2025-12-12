#!/bin/bash
# PlayWright ABC Notation Converter
# Converts ABC files to MIDI, WAV, and PDF
# Usage: ./convert_abc.sh [input_dir] [output_dir]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
ABC_DIR="${1:-$REPO_ROOT/compositions/abc}"
OUTPUT_DIR="${2:-$REPO_ROOT/compositions/output}"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}       PlayWright ABC Notation Converter${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Input:  ${YELLOW}$ABC_DIR${NC}"
echo -e "Output: ${YELLOW}$OUTPUT_DIR${NC}"
echo ""

# Check for required tools
check_tool() {
    if command -v "$1" &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} $1 found"
        return 0
    else
        echo -e "  ${RED}✗${NC} $1 not found"
        return 1
    fi
}

echo -e "${BLUE}Checking required tools...${NC}"
TOOLS_OK=true
check_tool "abc2midi" || TOOLS_OK=false
check_tool "abcm2ps" || echo -e "  ${YELLOW}!${NC} abcm2ps missing (PDF generation disabled)"
check_tool "timidity" || echo -e "  ${YELLOW}!${NC} timidity missing (WAV generation disabled)"
check_tool "ps2pdf" || echo -e "  ${YELLOW}!${NC} ps2pdf missing (PDF generation disabled)"

if [ "$TOOLS_OK" = false ]; then
    echo ""
    echo -e "${RED}Error: abc2midi is required. Install with:${NC}"
    echo "  Mac:   brew install abcmidi"
    echo "  Linux: sudo apt install abcmidi"
    exit 1
fi

echo ""

# Create output directories
mkdir -p "$OUTPUT_DIR"/{midi,wav,pdf,logs}

# Counter variables
TOTAL=0
SUCCESS=0
FAILED=0

# Find all ABC files
ABC_FILES=$(find "$ABC_DIR" -name "*.abc" -type f 2>/dev/null | sort)

if [ -z "$ABC_FILES" ]; then
    echo -e "${RED}No ABC files found in $ABC_DIR${NC}"
    exit 1
fi

echo -e "${BLUE}Processing ABC files...${NC}"
echo ""

# Process each file
while IFS= read -r abc_file; do
    TOTAL=$((TOTAL + 1))

    # Get relative path and create meaningful filename
    rel_path="${abc_file#$ABC_DIR/}"
    dir_name=$(dirname "$rel_path")
    base_name=$(basename "$abc_file" .abc)

    # Create show-specific prefix
    if [ "$dir_name" != "." ]; then
        output_name="${dir_name}__${base_name}"
    else
        output_name="$base_name"
    fi

    # Replace slashes with underscores
    output_name=$(echo "$output_name" | tr '/' '_')

    echo -e "  Processing: ${YELLOW}$rel_path${NC}"

    # ABC to MIDI
    midi_file="$OUTPUT_DIR/midi/${output_name}.mid"
    if abc2midi "$abc_file" -o "$midi_file" 2>"$OUTPUT_DIR/logs/${output_name}_midi.log"; then
        echo -e "    ${GREEN}✓${NC} MIDI created"

        # MIDI to WAV (if timidity available)
        if command -v timidity &> /dev/null; then
            wav_file="$OUTPUT_DIR/wav/${output_name}.wav"
            if timidity "$midi_file" -Ow -o "$wav_file" 2>"$OUTPUT_DIR/logs/${output_name}_wav.log"; then
                echo -e "    ${GREEN}✓${NC} WAV created"
            else
                echo -e "    ${RED}✗${NC} WAV failed (see logs)"
            fi
        fi

        SUCCESS=$((SUCCESS + 1))
    else
        echo -e "    ${RED}✗${NC} MIDI failed (see logs)"
        FAILED=$((FAILED + 1))
    fi

    # ABC to PDF (if tools available)
    if command -v abcm2ps &> /dev/null && command -v ps2pdf &> /dev/null; then
        ps_file="$OUTPUT_DIR/pdf/${output_name}.ps"
        pdf_file="$OUTPUT_DIR/pdf/${output_name}.pdf"
        if abcm2ps "$abc_file" -O "$ps_file" 2>"$OUTPUT_DIR/logs/${output_name}_ps.log"; then
            if ps2pdf "$ps_file" "$pdf_file" 2>/dev/null; then
                rm -f "$ps_file"
                echo -e "    ${GREEN}✓${NC} PDF created"
            fi
        fi
    fi

    echo ""

done <<< "$ABC_FILES"

# Summary
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                      Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  Total files:  ${YELLOW}$TOTAL${NC}"
echo -e "  Successful:   ${GREEN}$SUCCESS${NC}"
echo -e "  Failed:       ${RED}$FAILED${NC}"
echo ""
echo -e "  Output directory: ${YELLOW}$OUTPUT_DIR${NC}"
echo ""

# List output
if [ -d "$OUTPUT_DIR/midi" ]; then
    midi_count=$(find "$OUTPUT_DIR/midi" -name "*.mid" | wc -l)
    echo -e "  MIDI files: ${GREEN}$midi_count${NC}"
fi
if [ -d "$OUTPUT_DIR/wav" ]; then
    wav_count=$(find "$OUTPUT_DIR/wav" -name "*.wav" | wc -l)
    echo -e "  WAV files:  ${GREEN}$wav_count${NC}"
fi
if [ -d "$OUTPUT_DIR/pdf" ]; then
    pdf_count=$(find "$OUTPUT_DIR/pdf" -name "*.pdf" | wc -l)
    echo -e "  PDF files:  ${GREEN}$pdf_count${NC}"
fi

echo ""
echo -e "${GREEN}Done!${NC}"
