# Free Voice Synthesis Workflow

A completely free pipeline for producing sung vocals from PlayWright ABC compositions.

## Quick Start Summary

| Option | Quality | Difficulty | Platform |
|--------|---------|------------|----------|
| Synthesizer V Basic + Eleanor Forte | Excellent | Easy | Win/Mac/Linux |
| OpenUtau + Free Voicebanks | Good | Medium | Win/Mac/Linux |
| eCantorix + eSpeak-NG | Robotic | Advanced | Linux |

**Recommended**: Start with Synthesizer V Basic - best quality, easiest to use.

---

## Option 1: Synthesizer V Basic (Recommended)

### What You Get Free
- Synthesizer V Studio Basic Edition (full editor, 3 track limit)
- Eleanor Forte AI Lite (free AI voice database)

### Installation

#### Step 1: Download Synthesizer V Basic
1. Go to [Dreamtonics Download Page](https://dreamtonics.com/en/synthesizerv/)
2. Scroll down to "Synthesizer V Studio Basic"
3. Download for your platform (Windows/macOS/Linux)
4. Install the application

#### Step 2: Get Eleanor Forte Lite
1. Visit [Dreamtonics Resource Page](https://resource.dreamtonics.com/download/)
2. Navigate to: English → Voice Databases → Lite Voice Databases → Eleanor Forte
3. Download the installer
4. Run installer or drag into SynthV to install

#### Step 3: Convert ABC to MIDI
```bash
# Install abc2midi (if not already)
# macOS:
brew install abcmidi

# Linux (Debian/Ubuntu):
sudo apt-get install abcmidi

# Convert a song
abc2midi compositions/abc/picket_fence_prison/01_picket_fence_prison.abc -o song.mid
```

#### Step 4: Import and Add Lyrics
1. Open Synthesizer V Studio
2. File → Import → MIDI File
3. Select your MIDI file
4. Choose Eleanor Forte as the voice
5. Click in the lyrics field and type lyrics with hyphens:
   ```
   Pic-ket fence pri-son per-fect lawn per-fect life
   ```

#### Step 5: Export
1. File → Render → Render to File
2. Choose WAV format
3. Export

### Limitations of Free Version
- 3 tracks maximum (enough for most solo/duet songs)
- 2 CPU cores for rendering (slower but works)
- No VST/AU plugin mode
- No some advanced features

---

## Option 2: OpenUtau + Free Voicebanks

[OpenUtau](https://www.openutau.com/) is a free, open-source singing synthesizer.

### Installation

#### Step 1: Download OpenUtau
```bash
# Go to https://www.openutau.com/
# Download for your platform
# Or use package manager:

# macOS (Homebrew):
brew install --cask openutau

# Linux: Download AppImage from releases
```

#### Step 2: Download Free English Voicebanks

**Recommended Free Voicebanks:**

| Voicebank | Type | Quality | Download |
|-----------|------|---------|----------|
| KASAI OG01 | ARPAsing English | Good | [Studio OGIEN](https://studio-ogien.com/kasai-og01/) |
| Kikyuune Aiko English | CVVC English | Good | [UTAU Wiki](http://utau.wikidot.com/utauloid:kikyuune-aiko) |
| Creme | ARPAsing English | Good | Search UTAU databases |
| VCCV English Voicebanks | VCCV | Various | [UTAU-VCCV](https://utau-vccv.fandom.com/) |

#### Step 3: Install Voicebank
1. Download voicebank ZIP
2. Open OpenUtau
3. Tools → Install Singer
4. Select the ZIP file

#### Step 4: Create Project from MIDI
1. File → Import MIDI
2. Assign tracks to your voicebank
3. Edit phonemes as needed
4. Add lyrics in the note editor

#### Step 5: Render
1. File → Render to File
2. Choose output format

---

## Option 3: eCantorix (Fully Open Source)

For Linux users wanting a completely open-source solution.

### Installation (Linux)

```bash
# Install dependencies
sudo apt-get install abcmidi cpanminus espeak-ng sox timidity

# Clone eCantorix
git clone https://github.com/divVerent/ecantorix.git
cd ecantorix

# Install Perl dependencies
cpanm MIDI
```

### Usage

```bash
# Convert ABC to MIDI with lyrics
abc2midi input.abc -o input.mid

# Convert to karaoke format (KAR)
# eCantorix needs KAR format with embedded lyrics

# Run eCantorix
./ecantorix.pl input.kar output.wav
```

### Note on Quality
eCantorix produces robotic-sounding vocals using eSpeak. It's more of a proof-of-concept but is 100% free and open source.

---

## Free Instrumental Production

### SoundFonts (Free)

```bash
# Install FluidSynth
# macOS:
brew install fluidsynth

# Linux:
sudo apt-get install fluidsynth

# Download free SoundFonts:
# FluidR3_GM.sf2 - General MIDI (good quality)
# SGM-V2.01.sf2 - Better instruments
# TimGM6mb.sf2 - Lightweight option
```

**Download Links:**
- [FluidR3 GM](https://member.keymusician.com/Member/FluidR3_GM/index.html)
- [SGM Soundfont](https://www.polyphone-soundfonts.com/en/files/27-instrument-sets/256-sgm-v2-01)

### Convert ABC to Audio

```bash
# ABC to MIDI
abc2midi song.abc -o song.mid

# MIDI to WAV using FluidSynth
fluidsynth -ni /path/to/FluidR3_GM.sf2 song.mid -F song.wav -r 44100
```

---

## Free DAW/Mixing Software

### Audacity (Recommended for Beginners)
- **Download**: https://www.audacityteam.org/
- **Platforms**: Windows, macOS, Linux
- **Use for**: Mixing vocals with instrumentals, basic effects

### LMMS (Full DAW)
- **Download**: https://lmms.io/
- **Platforms**: Windows, macOS, Linux
- **Use for**: Full music production, MIDI editing, mixing

### Ardour (Professional)
- **Download**: https://ardour.org/
- **Platforms**: Windows, macOS, Linux
- **Use for**: Professional-level mixing and mastering

---

## Complete Free Workflow Script

Save this as `tools/free_vocal_workflow.sh`:

```bash
#!/bin/bash
# Free Vocal Production Workflow
# Converts ABC to MIDI and renders instrumental

set -e

# Configuration
SOUNDFONT="${SOUNDFONT:-/usr/share/sounds/sf2/FluidR3_GM.sf2}"
OUTPUT_DIR="${OUTPUT_DIR:-output}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

usage() {
    echo "Usage: $0 <abc_file>"
    echo ""
    echo "Converts ABC notation to:"
    echo "  - MIDI file (for voice synthesis import)"
    echo "  - WAV instrumental track (using SoundFonts)"
    echo ""
    echo "Environment variables:"
    echo "  SOUNDFONT - Path to .sf2 file (default: FluidR3_GM.sf2)"
    echo "  OUTPUT_DIR - Output directory (default: output)"
    exit 1
}

check_dependencies() {
    local missing=""
    for cmd in abc2midi fluidsynth; do
        if ! command -v $cmd &> /dev/null; then
            missing="$missing $cmd"
        fi
    done

    if [ -n "$missing" ]; then
        echo -e "${YELLOW}Missing dependencies:$missing${NC}"
        echo ""
        echo "Install with:"
        echo "  macOS: brew install abcmidi fluidsynth"
        echo "  Linux: sudo apt-get install abcmidi fluidsynth"
        exit 1
    fi
}

main() {
    if [ -z "$1" ]; then
        usage
    fi

    check_dependencies

    ABC_FILE="$1"
    BASENAME=$(basename "$ABC_FILE" .abc)

    mkdir -p "$OUTPUT_DIR"

    echo -e "${GREEN}Processing: $ABC_FILE${NC}"

    # Convert ABC to MIDI
    echo "  Converting to MIDI..."
    abc2midi "$ABC_FILE" -o "$OUTPUT_DIR/${BASENAME}.mid"

    # Check for SoundFont
    if [ -f "$SOUNDFONT" ]; then
        echo "  Rendering instrumental WAV..."
        fluidsynth -ni "$SOUNDFONT" "$OUTPUT_DIR/${BASENAME}.mid" \
            -F "$OUTPUT_DIR/${BASENAME}_instrumental.wav" \
            -r 44100
        echo -e "${GREEN}Created: $OUTPUT_DIR/${BASENAME}_instrumental.wav${NC}"
    else
        echo -e "${YELLOW}SoundFont not found at: $SOUNDFONT${NC}"
        echo "  Set SOUNDFONT environment variable to render audio"
    fi

    echo ""
    echo -e "${GREEN}Output files:${NC}"
    echo "  MIDI: $OUTPUT_DIR/${BASENAME}.mid"
    echo "        → Import this into Synthesizer V or OpenUtau"
    echo ""
    echo -e "${GREEN}Next steps:${NC}"
    echo "  1. Open Synthesizer V Basic"
    echo "  2. File → Import → MIDI File"
    echo "  3. Select: $OUTPUT_DIR/${BASENAME}.mid"
    echo "  4. Choose Eleanor Forte voice"
    echo "  5. Add lyrics in the editor"
    echo "  6. Render to WAV"
    echo "  7. Mix vocal + instrumental in Audacity"
}

main "$@"
```

---

## Batch Processing Script

Save as `tools/batch_free_workflow.sh`:

```bash
#!/bin/bash
# Batch process all Picket Fence Prison songs

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ABC_DIR="$PROJECT_DIR/compositions/abc/picket_fence_prison"
OUTPUT_DIR="$PROJECT_DIR/output/picket_fence_prison"

mkdir -p "$OUTPUT_DIR"

echo "Processing all Picket Fence Prison songs..."
echo ""

for abc_file in "$ABC_DIR"/*.abc; do
    if [ -f "$abc_file" ]; then
        basename=$(basename "$abc_file" .abc)
        echo "Converting: $basename"

        # Convert to MIDI
        abc2midi "$abc_file" -o "$OUTPUT_DIR/${basename}.mid" 2>/dev/null

        if [ $? -eq 0 ]; then
            echo "  ✓ Created: $OUTPUT_DIR/${basename}.mid"
        else
            echo "  ✗ Failed: $basename"
        fi
    fi
done

echo ""
echo "All MIDI files ready in: $OUTPUT_DIR/"
echo ""
echo "Import these into Synthesizer V Basic to add vocals!"
```

---

## Lyrics Reference for Voice Synthesis

When entering lyrics in Synthesizer V, use this format:

### Song 1: Picket Fence Prison
```
Pic-ket fence pri-son walls so white and clean
Per-fect lawn per-fect life per-fect lies be-tween
Ev-ery smile is mea-sured ev-ery word is weighed
In this beau-ti-ful pri-son where I slow-ly fade
```

### Song 5: I Choose
```
I choose to stay I choose to go
I choose the things that on-ly I can know
You can judge me you can walk a-way
But I choose how to live my life to-day
```

### Song 18: The Reckoning (Rosa)
```
You're not vic-tims you're not he-roes
You're just peo-ple with first-world pro-blems and e-gos
You had ev-ery-thing and you chose to des-troy it
For dra-ma for plea-sure for what-ev-er you call it
```

---

## Mixing Guide (Audacity)

### Import Tracks
1. File → Import → Audio (instrumental WAV)
2. File → Import → Audio (vocal WAV from SynthV)

### Basic Vocal Processing
1. Select vocal track
2. Effect → Equalization/Filter Curve
   - Cut below 80Hz (remove rumble)
   - Boost 2-4kHz slightly (presence)
3. Effect → Compressor
   - Threshold: -12dB
   - Ratio: 4:1
4. Effect → Reverb
   - Room Size: 50%
   - Pre-delay: 20ms

### Export
1. File → Export → Export as WAV
2. Or: File → Export → Export as MP3

---

## Troubleshooting

### "Eleanor Forte not showing in SynthV"
- Ensure you downloaded the correct version (Lite/AI Lite)
- Try dragging the .svpk file directly into SynthV window
- Check My Dreamtonics account if you have one

### "abc2midi not found"
```bash
# macOS
brew install abcmidi

# Linux
sudo apt-get install abcmidi

# Manual install
# Download from: https://ifdo.ca/~seymour/runabc/top.html
```

### "FluidSynth has no audio"
- Download a SoundFont file (.sf2)
- Specify the full path to the SoundFont

### "OpenUtau voicebank errors"
- Ensure voicebank is unzipped
- Check phonemizer settings match voicebank type
- ARPAsing banks need ARPAsing phonemizer

---

## Cost Summary

| Component | Cost |
|-----------|------|
| Synthesizer V Basic | Free |
| Eleanor Forte Lite | Free |
| OpenUtau | Free |
| Free voicebanks (KASAI, etc.) | Free |
| abc2midi | Free |
| FluidSynth | Free |
| SoundFonts (FluidR3, SGM) | Free |
| Audacity | Free |
| LMMS | Free |
| **Total** | **$0** |

---

## Resources

- [Synthesizer V Download](https://dreamtonics.com/en/synthesizerv/)
- [OpenUtau](https://www.openutau.com/)
- [UTAU Voicebank Database](http://utau.wikidot.com/)
- [eCantorix (Open Source)](https://github.com/divVerent/ecantorix)
- [Audacity](https://www.audacityteam.org/)
- [FluidSynth](https://www.fluidsynth.org/)

---

*This guide is part of the PlayWright AI Musical Theater project.*
