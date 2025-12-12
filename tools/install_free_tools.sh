#!/bin/bash
# Install Free Tools for PlayWright Voice Synthesis
#
# This script helps install all the free tools needed for
# the voice synthesis workflow on macOS or Linux.

set -e

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
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[→]${NC} $1"
}

detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v apt-get &> /dev/null; then
            echo "debian"
        elif command -v dnf &> /dev/null; then
            echo "fedora"
        elif command -v pacman &> /dev/null; then
            echo "arch"
        else
            echo "linux"
        fi
    else
        echo "unknown"
    fi
}

check_homebrew() {
    if ! command -v brew &> /dev/null; then
        log_warn "Homebrew not found"
        echo ""
        echo "Install Homebrew first:"
        echo '  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
        echo ""
        return 1
    fi
    return 0
}

install_macos() {
    log_header "Installing Tools for macOS"

    if ! check_homebrew; then
        exit 1
    fi

    log_step "Installing abc2midi (ABC notation tools)..."
    brew install abcmidi 2>/dev/null || log_info "abcmidi already installed"

    log_step "Installing FluidSynth (MIDI to audio)..."
    brew install fluidsynth 2>/dev/null || log_info "fluidsynth already installed"

    log_step "Installing timidity (alternative MIDI player)..."
    brew install timidity 2>/dev/null || log_info "timidity already installed"

    log_step "Installing sox (audio processing)..."
    brew install sox 2>/dev/null || log_info "sox already installed"

    log_info "Command-line tools installed!"
}

install_debian() {
    log_header "Installing Tools for Debian/Ubuntu"

    log_step "Updating package list..."
    sudo apt-get update

    log_step "Installing abc2midi..."
    sudo apt-get install -y abcmidi

    log_step "Installing FluidSynth..."
    sudo apt-get install -y fluidsynth

    log_step "Installing TiMidity++..."
    sudo apt-get install -y timidity

    log_step "Installing SoX..."
    sudo apt-get install -y sox

    log_step "Installing fluid-soundfont-gm (General MIDI SoundFont)..."
    sudo apt-get install -y fluid-soundfont-gm

    log_info "All tools installed!"
}

install_fedora() {
    log_header "Installing Tools for Fedora"

    log_step "Installing abc2midi..."
    sudo dnf install -y abcMIDI

    log_step "Installing FluidSynth..."
    sudo dnf install -y fluidsynth

    log_step "Installing TiMidity++..."
    sudo dnf install -y timidity++

    log_step "Installing SoX..."
    sudo dnf install -y sox

    log_step "Installing SoundFont..."
    sudo dnf install -y fluid-soundfont-gm

    log_info "All tools installed!"
}

install_arch() {
    log_header "Installing Tools for Arch Linux"

    log_step "Installing tools..."
    sudo pacman -S --needed abcmidi fluidsynth timidity++ sox soundfont-fluid

    log_info "All tools installed!"
}

download_soundfont() {
    log_header "SoundFont Setup"

    local sf_dir="$HOME/soundfonts"
    mkdir -p "$sf_dir"

    # Check if we already have a soundfont
    if [ -f "$sf_dir/FluidR3_GM.sf2" ]; then
        log_info "FluidR3_GM.sf2 already exists in $sf_dir"
        return
    fi

    # Check system locations
    local system_sf=""
    for path in /usr/share/sounds/sf2/FluidR3_GM.sf2 /usr/share/soundfonts/FluidR3_GM.sf2; do
        if [ -f "$path" ]; then
            system_sf="$path"
            break
        fi
    done

    if [ -n "$system_sf" ]; then
        log_info "System SoundFont found: $system_sf"
        echo ""
        echo "To use this SoundFont, set:"
        echo "  export SOUNDFONT=\"$system_sf\""
        return
    fi

    log_warn "No SoundFont found. You'll need to download one manually."
    echo ""
    echo "Recommended free SoundFonts:"
    echo ""
    echo "1. FluidR3 GM (141 MB) - Best quality"
    echo "   https://member.keymusician.com/Member/FluidR3_GM/index.html"
    echo ""
    echo "2. SGM-V2.01 (235 MB) - Excellent instruments"
    echo "   https://www.polyphone-soundfonts.com/en/files/27-instrument-sets/256-sgm-v2-01"
    echo ""
    echo "3. TimGM6mb (6 MB) - Lightweight option"
    echo "   https://sourceforge.net/projects/mscore/files/soundfont/"
    echo ""
    echo "After downloading, place the .sf2 file in: $sf_dir/"
    echo "Then set: export SOUNDFONT=\"$sf_dir/FluidR3_GM.sf2\""
}

print_manual_downloads() {
    log_header "Manual Downloads Required"

    cat << 'EOF'
The following software must be downloaded manually:

1. SYNTHESIZER V BASIC (Free) - Voice Synthesis
   https://dreamtonics.com/en/synthesizerv/
   - Download "Synthesizer V Studio Basic"
   - Available for Windows, macOS, Linux

2. ELEANOR FORTE LITE (Free) - AI Voice Database
   https://resource.dreamtonics.com/download/
   - Navigate to: English → Voice Databases → Lite
   - Download Eleanor Forte installer
   - Install into Synthesizer V

3. AUDACITY (Free) - Audio Editing/Mixing
   https://www.audacityteam.org/download/
   - Available for Windows, macOS, Linux

4. OPTIONAL: OpenUtau (Free, Open Source)
   https://www.openutau.com/
   - Alternative to Synthesizer V
   - Works with UTAU voicebanks

EOF
}

verify_installation() {
    log_header "Verifying Installation"

    local all_good=true

    if command -v abc2midi &> /dev/null; then
        log_info "abc2midi: $(abc2midi -h 2>&1 | head -1 || echo 'installed')"
    else
        log_error "abc2midi: NOT FOUND"
        all_good=false
    fi

    if command -v fluidsynth &> /dev/null; then
        log_info "fluidsynth: $(fluidsynth --version 2>&1 | head -1)"
    else
        log_warn "fluidsynth: NOT FOUND (optional)"
    fi

    if command -v timidity &> /dev/null; then
        log_info "timidity: installed"
    else
        log_warn "timidity: NOT FOUND (optional)"
    fi

    if command -v sox &> /dev/null; then
        log_info "sox: $(sox --version 2>&1 | head -1)"
    else
        log_warn "sox: NOT FOUND (optional)"
    fi

    echo ""
    if [ "$all_good" = true ]; then
        log_info "All required tools are installed!"
    else
        log_error "Some required tools are missing"
    fi
}

main() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║   PlayWright - Free Tools Installer        ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"

    local os=$(detect_os)
    log_info "Detected OS: $os"

    case $os in
        macos)
            install_macos
            ;;
        debian)
            install_debian
            ;;
        fedora)
            install_fedora
            ;;
        arch)
            install_arch
            ;;
        *)
            log_error "Unsupported OS: $os"
            echo "Please install manually:"
            echo "  - abcmidi (or abcMIDI)"
            echo "  - fluidsynth"
            echo "  - sox"
            exit 1
            ;;
    esac

    download_soundfont
    print_manual_downloads
    verify_installation

    log_header "Setup Complete!"

    cat << 'EOF'
Quick Start:
  1. Run: ./tools/batch_free_workflow.sh picket_fence_prison
  2. Open Synthesizer V Basic
  3. Import the generated MIDI files
  4. Add lyrics and render!

For detailed instructions, see:
  tools/FREE_WORKFLOW.md

EOF
}

main "$@"
