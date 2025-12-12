# Music Notation Tools Setup Guide
## Mac & Linux Environment for LLM-Assisted Composition

---

## QUICK START (5 minutes)

### Mac (Homebrew)
```bash
# Install all tools at once
brew install musescore lilypond abcmidi timidity

# Verify installations
musescore4 --version
lilypond --version
abc2midi -h
```

### Linux (Debian/Ubuntu)
```bash
# Install all tools
sudo apt update
sudo apt install -y musescore3 lilypond abcmidi abcm2ps timidity fluid-soundfont-gm

# For latest MuseScore 4 (AppImage)
wget https://cdn.jsdelivr.net/musescore/v4.2.1/MuseScore-4.2.1.240230938-x86_64.AppImage
chmod +x MuseScore-4.2.1*.AppImage
./MuseScore-4.2.1*.AppImage
```

### Linux (Fedora/RHEL)
```bash
sudo dnf install musescore lilypond abcmidi timidity++
```

---

## TOOL OVERVIEW

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| **MuseScore** | Full notation editor | MusicXML, MIDI | PDF, Audio, MusicXML |
| **LilyPond** | Engraving engine | .ly files | PDF, MIDI, PNG |
| **abcmidi** | ABC to MIDI converter | .abc files | MIDI |
| **abcm2ps** | ABC to sheet music | .abc files | PostScript/PDF |
| **TiMidity++** | MIDI playback | MIDI | WAV/Audio |
| **FluidSynth** | Better MIDI sounds | MIDI + SoundFonts | WAV/Audio |

---

## WORKFLOW 1: ABC Notation → Audio Demo

### Step 1: Create ABC file
```bash
cat > welcome_to_academy.abc << 'EOF'
X:1
T:Welcome to the Academy
C:Claude/PlayWright
M:4/4
L:1/8
Q:1/4=132
K:C
|:"C"c2c2 e2g2|"G"g4 f2e2|"Am"a2g2 f2e2|"G"d4 d2d2:|
|:"C"e2e2 e2d2|c4 "G"d2e2|"F"f2f2 f2e2|"C"e4 z4:|
EOF
```

### Step 2: Convert to MIDI
```bash
abc2midi welcome_to_academy.abc -o welcome_to_academy.mid
```

### Step 3: Play or convert to WAV
```bash
# Play directly
timidity welcome_to_academy.mid

# Convert to WAV (for sharing)
timidity welcome_to_academy.mid -Ow -o welcome_to_academy.wav

# Better quality with FluidSynth + SoundFont
fluidsynth -ni /usr/share/sounds/sf2/FluidR3_GM.sf2 welcome_to_academy.mid -F welcome_to_academy.wav -r 44100
```

### Step 4: Generate sheet music
```bash
# To PostScript then PDF
abcm2ps welcome_to_academy.abc -O welcome_to_academy.ps
ps2pdf welcome_to_academy.ps welcome_to_academy.pdf

# Or use abc2svg for web
npm install -g abc2svg
abc2svg welcome_to_academy.abc > welcome_to_academy.svg
```

---

## WORKFLOW 2: ABC → MuseScore (Best Quality)

### Step 1: Convert ABC to MusicXML
```bash
# abc2xml is a Python tool
pip install music21

# Create converter script
cat > abc_to_musicxml.py << 'EOF'
#!/usr/bin/env python3
import sys
from music21 import converter, musicxml

def convert_abc_to_musicxml(abc_file, output_file):
    score = converter.parse(abc_file)
    score.write('musicxml', fp=output_file)
    print(f"Converted {abc_file} -> {output_file}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python abc_to_musicxml.py input.abc output.musicxml")
        sys.exit(1)
    convert_abc_to_musicxml(sys.argv[1], sys.argv[2])
EOF
chmod +x abc_to_musicxml.py
```

### Step 2: Convert and open
```bash
python3 abc_to_musicxml.py welcome_to_academy.abc welcome_to_academy.musicxml
musescore4 welcome_to_academy.musicxml
```

---

## WORKFLOW 3: LilyPond (Publication Quality)

### Step 1: Create LilyPond file
```bash
cat > picket_fence_prison.ly << 'EOF'
\version "2.24.0"
\header {
  title = "Picket Fence Prison"
  subtitle = "Opening Number"
  composer = "Claude/PlayWright"
}

\score {
  \relative c' {
    \clef treble
    \key g \major
    \time 4/4
    \tempo "Andante" 4 = 72

    % Verse 1
    g4 g a b | g2 a4 b | c4 c b a | g2 r2 |

    % Pre-chorus
    a4 a b c | d2 c4 b | a4 g fis e | d2 r2 |

    % Chorus - "These picket fences"
    \tempo "Moderato" 4 = 84
    b'4. b8 a4 g | g4. g8 fis4 e | d4. d8 d4 e | e2 r2 |
  }
  \layout { }
  \midi { }
}
EOF
```

### Step 2: Generate PDF and MIDI
```bash
lilypond picket_fence_prison.ly
# Creates: picket_fence_prison.pdf and picket_fence_prison.midi
```

---

## WORKFLOW 4: Batch Processing All Songs

### Master conversion script
```bash
cat > convert_all_songs.sh << 'EOF'
#!/bin/bash
# Convert all ABC files in a directory to MIDI, WAV, and PDF

ABC_DIR="${1:-.}"
OUTPUT_DIR="${2:-./output}"

mkdir -p "$OUTPUT_DIR"/{midi,wav,pdf}

for abc_file in "$ABC_DIR"/*.abc; do
    if [ -f "$abc_file" ]; then
        basename=$(basename "$abc_file" .abc)
        echo "Processing: $basename"

        # ABC to MIDI
        abc2midi "$abc_file" -o "$OUTPUT_DIR/midi/${basename}.mid" 2>/dev/null

        # MIDI to WAV (if timidity available)
        if command -v timidity &> /dev/null; then
            timidity "$OUTPUT_DIR/midi/${basename}.mid" -Ow -o "$OUTPUT_DIR/wav/${basename}.wav" 2>/dev/null
        fi

        # ABC to PDF
        if command -v abcm2ps &> /dev/null; then
            abcm2ps "$abc_file" -O "$OUTPUT_DIR/pdf/${basename}.ps" 2>/dev/null
            ps2pdf "$OUTPUT_DIR/pdf/${basename}.ps" "$OUTPUT_DIR/pdf/${basename}.pdf" 2>/dev/null
            rm -f "$OUTPUT_DIR/pdf/${basename}.ps"
        fi

        echo "  -> Created: MIDI, WAV, PDF"
    fi
done

echo "Done! Output in $OUTPUT_DIR"
EOF
chmod +x convert_all_songs.sh
```

### Usage
```bash
./convert_all_songs.sh ./abc_files ./rendered_output
```

---

## SOUNDFONTS (Better Audio Quality)

### Mac
```bash
# Download high-quality SoundFont
curl -L -o ~/FluidR3_GM.sf2 "https://keymusician01.s3.amazonaws.com/FluidR3_GM.sf2"

# Use with FluidSynth
fluidsynth -ni ~/FluidR3_GM.sf2 song.mid -F song.wav -r 44100
```

### Linux
```bash
# Install GM SoundFont
sudo apt install fluid-soundfont-gm
# Located at: /usr/share/sounds/sf2/FluidR3_GM.sf2

# Or download better orchestral SoundFont
wget https://musical-artifacts.com/artifacts/1176/GeneralUser_GS_v1.471.sf2
```

### Recommended SoundFonts for Musical Theater
| SoundFont | Size | Quality | Best For |
|-----------|------|---------|----------|
| FluidR3_GM | 141MB | ★★★☆☆ | General use |
| GeneralUser GS | 31MB | ★★★★☆ | Balanced |
| Timbres of Heaven | 365MB | ★★★★★ | Orchestral |
| Sonatina Symphonic | 400MB+ | ★★★★★ | Full orchestra |

---

## LLM INTEGRATION TIPS

### 1. Prompt Template for ABC Generation
```
Generate ABC notation for [SONG NAME] with these specifications:
- Key: [KEY]
- Time: [TIME SIGNATURE]
- Tempo: [BPM]
- Style: [STYLE DESCRIPTION]
- Include chord symbols above melody
- Use standard ABC header format (X, T, C, M, L, Q, K)

Lyrics to set:
[PASTE LYRICS HERE]
```

### 2. Iterative Refinement
```bash
# 1. Generate ABC from LLM
# 2. Convert to MIDI
abc2midi song.abc -o song.mid

# 3. Listen
timidity song.mid

# 4. If wrong, describe the problem to LLM:
"The melody in bar 5-8 feels too static. It needs more movement.
Current: |e2e2 e2d2|c4 d2e2|
Suggestion: Add passing tones and vary rhythm"

# 5. Get revised ABC, repeat
```

### 3. Validation Script
```bash
cat > validate_abc.sh << 'EOF'
#!/bin/bash
# Validate ABC file syntax

abc_file="$1"
if [ -z "$abc_file" ]; then
    echo "Usage: validate_abc.sh file.abc"
    exit 1
fi

# Check required headers
for header in "X:" "T:" "M:" "L:" "K:"; do
    if ! grep -q "^$header" "$abc_file"; then
        echo "WARNING: Missing header $header"
    fi
done

# Try to parse
if abc2midi "$abc_file" -o /tmp/test.mid 2>&1 | grep -i error; then
    echo "ERRORS found in ABC file"
    exit 1
else
    echo "ABC file is valid"
    rm -f /tmp/test.mid
fi
EOF
chmod +x validate_abc.sh
```

---

## DIRECTORY STRUCTURE (Recommended)

```
PlayWright/
├── compositions/
│   ├── abc/                    # ABC notation files
│   │   ├── silly_magic_academy/
│   │   ├── picket_fence_prison/
│   │   └── ...
│   ├── lilypond/               # LilyPond files (.ly)
│   ├── musicxml/               # MusicXML exports
│   ├── midi/                   # Generated MIDI
│   ├── audio/                  # WAV/MP3 renders
│   └── scores/                 # PDF sheet music
├── tools/
│   ├── convert_all_songs.sh
│   ├── abc_to_musicxml.py
│   └── validate_abc.sh
└── soundfonts/
    └── FluidR3_GM.sf2
```

---

## TROUBLESHOOTING

### "abc2midi: command not found"
```bash
# Mac
brew install abcmidi

# Linux
sudo apt install abcmidi
```

### "No sound from timidity"
```bash
# Check audio output
timidity -Os song.mid  # ALSA
timidity -Ow song.mid -o song.wav  # Write to file instead
```

### "MuseScore won't open MusicXML"
```bash
# Validate XML first
xmllint --noout file.musicxml

# Try music21 conversion with explicit format
python3 -c "
from music21 import converter
s = converter.parse('file.abc')
s.write('musicxml', 'file.mxl')  # .mxl is compressed MusicXML
"
```

### "LilyPond syntax errors"
```bash
# Get detailed errors
lilypond --loglevel=DEBUG file.ly

# Common issues:
# - Missing \version at top
# - Wrong octave markers (c' vs c'' vs c)
# - Unmatched braces
```

---

## NEXT STEPS

1. **Install the tools** using commands above
2. **Run the ABC files** I'm about to create
3. **Iterate** - listen, describe problems, get revisions
4. **Export to MuseScore** for professional notation
5. **Render with good SoundFonts** for demos

Ready to create the ABC files now!
