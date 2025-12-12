# Virtual Singing Voice Synthesis Guide

This guide covers how to add AI-generated singing voices to the PlayWright musical compositions, transforming MIDI output from ABC notation into full vocal performances.

## Overview

The workflow is:
```
ABC Notation → MIDI → Voice Synthesis Software → Mixed Audio
```

## Voice Synthesis Options

### 1. Synthesizer V Studio (Dreamtonics)
**Best for: Professional quality, natural expression**

- **Website**: https://dreamtonics.com/synthesizerv/
- **Platform**: Windows, macOS, Linux
- **Price**: Basic (free), Pro ($89), Voice databases ($79-99 each)
- **Quality**: Industry-leading natural vocal synthesis
- **Languages**: English, Japanese, Chinese, Spanish

**Recommended Voice Banks for Musicals:**
- **Solaria** (English) - Clear, versatile female voice
- **ANRI** (English) - Powerful female belt voice
- **Kevin** (English) - Natural male voice
- **Asterian** (English) - Expressive male voice
- **Eleanor Forte** (English) - Free AI voice included

**Key Features:**
- AI retakes for natural variation
- Vocal modes (Belt, Soft, etc.)
- Breath and vibrato control
- Real-time pitch editing
- VST/AU plugin support

### 2. ACE Studio (Beijing Timedomain)
**Best for: Ease of use, quick results**

- **Website**: https://ace-studio.timedomain.cn/
- **Platform**: Windows, macOS (Web beta available)
- **Price**: Subscription-based ($9.99/month)
- **Quality**: Very good AI-driven synthesis
- **Languages**: English, Chinese, Japanese

**Key Features:**
- Cloud-based processing
- Simple piano roll interface
- AI-powered expression
- Multiple singer voices included

### 3. VOCALOID 6 (Yamaha)
**Best for: Classic vocal synth sound, large voice library**

- **Website**: https://www.vocaloid.com/
- **Platform**: Windows, macOS
- **Price**: Standard ($225), Premium ($350)
- **Quality**: Good, more synthetic character
- **Languages**: English, Japanese, Chinese, Korean, Spanish

**Key Features:**
- AI vocal expression
- Extensive voice library
- Mature ecosystem
- VST/AU plugin

### 4. CeVIO AI
**Best for: Japanese content, character voices**

- **Website**: https://cevio.jp/
- **Platform**: Windows
- **Price**: ~$80-150 per voice
- **Quality**: Very natural for supported languages
- **Languages**: Japanese, English

## Workflow: ABC to Singing Voice

### Step 1: Convert ABC to MIDI
```bash
# Using abc2midi
abc2midi compositions/abc/picket_fence_prison/01_picket_fence_prison.abc -o output.mid

# Or use the batch conversion script
./tools/convert_abc.sh
```

### Step 2: Import MIDI into Voice Synthesis Software

#### For Synthesizer V:
1. Open Synthesizer V Studio
2. File → Import → MIDI File
3. Select the vocal track(s)
4. Choose target voice database
5. Click "Import"

#### For ACE Studio:
1. Create new project
2. Import MIDI file
3. Assign tracks to singers
4. Let AI process the import

### Step 3: Add Lyrics

The ABC files include `w:` (lyrics) fields. You'll need to manually enter these into the synthesis software.

**Tip for Synthesizer V:**
- Use the lyrics editor panel
- Type lyrics with hyphens for syllables: `Hel-lo world`
- Use `+` for held syllables
- Use `-` for melisma (multiple notes per syllable)

**Phoneme Editing:**
For better pronunciation, you can edit phonemes directly:
- Synthesizer V uses X-SAMPA phonetic notation
- Common fixes: `th` → `T` or `D`, word endings

### Step 4: Expression and Tuning

**Essential Parameters:**
- **Pitch Deviation**: Add natural pitch movement
- **Vibrato**: Depth, rate, and timing
- **Loudness/Dynamics**: Match the emotional intensity
- **Breathiness**: Add air for intimate moments
- **Gender**: Subtle adjustments to voice character
- **Tension**: Vocal cord tension for power/softness

**Per-Song Style Recommendations:**

| Song | Style | Voice Character |
|------|-------|-----------------|
| Picket Fence Prison | Bitter, building to desperate | Tense, slightly breathy |
| Marionette | Ethereal, vulnerable | Soft, floaty, clear |
| Premium Content | Defiant, building to raw | Strong chest, belty |
| No Panties Tomorrow | Seductive, intimate | Breathy, controlled |
| The Reckoning | Powerful, accusatory | Full belt, minimal vibrato |
| This Is Where I Belong | Peaceful, accepting | Warm, natural, gentle |

### Step 5: Export and Mix

**Export Settings:**
- Format: WAV (24-bit, 48kHz recommended)
- Export each voice separately for mixing flexibility

**Mixing with Instrumental:**
1. Import vocal WAV into DAW (Logic, Ableton, Reaper, etc.)
2. Import MIDI instrumental (rendered with good SoundFonts)
3. Apply vocal processing:
   - EQ: Cut mud (200-400Hz), boost presence (2-5kHz)
   - Compression: 3-6dB gain reduction
   - Reverb: Plate or hall for musical theater
   - De-esser if needed

## Complete Production Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    ABC NOTATION FILES                        │
│         (compositions/abc/picket_fence_prison/*.abc)        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    abc2midi conversion                       │
│              ./tools/convert_abc.sh                         │
└────────────────────────┬────────────────────────────────────┘
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
┌───────────────────────┐   ┌───────────────────────┐
│   VOCAL MIDI TRACKS   │   │ INSTRUMENTAL TRACKS   │
└───────────┬───────────┘   └───────────┬───────────┘
            │                           │
            ▼                           ▼
┌───────────────────────┐   ┌───────────────────────┐
│   Voice Synthesis     │   │   Virtual Instruments │
│   (Synthesizer V)     │   │   (SoundFonts/VSTs)   │
│   + Lyrics input      │   │                       │
│   + Expression tuning │   │                       │
└───────────┬───────────┘   └───────────┬───────────┘
            │                           │
            ▼                           ▼
┌───────────────────────┐   ┌───────────────────────┐
│     VOCAL WAV         │   │   INSTRUMENTAL WAV    │
└───────────┬───────────┘   └───────────┬───────────┘
            │                           │
            └────────────┬──────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    DAW MIXING SESSION                        │
│   (Reaper, Logic Pro, Ableton, Audacity)                    │
│   - Vocal processing (EQ, compression, reverb)              │
│   - Instrumental balance                                     │
│   - Master bus processing                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FINAL MIXED AUDIO                         │
│                 (MP3/WAV/FLAC export)                        │
└─────────────────────────────────────────────────────────────┘
```

## Recommended Setup for PlayWright

### Budget Option (~$100)
- **Voice**: Synthesizer V Basic (free) + Eleanor Forte (free)
- **DAW**: Reaper ($60) or Audacity (free)
- **SoundFonts**: FluidR3 GM (free)
- **Total**: $0-60

### Intermediate Option (~$300)
- **Voice**: Synthesizer V Pro ($89) + Solaria ($89) + Kevin ($89)
- **DAW**: Reaper ($60)
- **SoundFonts**: SGM-V2.01 (free) + Orchestral library
- **Total**: ~$330

### Professional Option (~$600+)
- **Voice**: Synthesizer V Pro + multiple voice banks
- **DAW**: Logic Pro ($200) or Ableton ($449)
- **Virtual Instruments**: NI Komplete, Spitfire Audio
- **Mastering plugins**: iZotope Ozone
- **Total**: $600-2000+

## Character Voice Casting Suggestions

For Picket Fence Prison, recommended voice assignments:

| Character | Voice Bank | Notes |
|-----------|------------|-------|
| Claire Morrison | Solaria | Mature, versatile, can belt |
| Jessica Hartwell | ANRI | Powerful, can do vulnerable & raw |
| David Sterling | Kevin or Asterian | Controlled, commanding |
| Michael Morrison | Kevin | Ordinary, then breaking |
| Rosa Santos | Solaria (darker mode) | Powerful alto range |
| Ensemble | Mix of above | Harmonies |

## Tips for Musical Theater Style

1. **Diction**: Musical theater requires clear consonants
   - Extend final consonants
   - Add slight aspiration to plosives

2. **Belt Technique**:
   - Increase tension parameter
   - Reduce breathiness
   - Add chest resonance

3. **Legit/Classical**:
   - More vibrato
   - Less tension
   - Cleaner tone

4. **Emotional Moments**:
   - Use pitch deviation for "cry" effect
   - Add breathiness for vulnerability
   - Reduce vibrato for intensity

5. **Duets/Ensemble**:
   - Pan voices slightly for separation
   - Match vibrato rates
   - Stagger breath points

## Troubleshooting

**Problem**: Robotic/unnatural sound
- Add pitch deviation curves
- Vary note velocities
- Use AI retakes feature
- Add subtle timing variations

**Problem**: Lyrics don't fit
- Adjust note lengths
- Split long syllables across notes
- Use melisma notation

**Problem**: Voice doesn't match character
- Try different vocal modes
- Adjust gender/tension parameters
- Layer multiple takes

**Problem**: Mixing vocals with MIDI sounds hollow
- Use better SoundFonts or VST instruments
- Apply reverb to both vocals and instruments
- Match the "room" ambiance

## Resources

- **Synthesizer V Manual**: https://dreamtonics.com/synthesizerv/manual/
- **Synthesizer V Forums**: https://forum.synthesizerv.com/
- **r/SynthesizerV**: Reddit community
- **VOCALOID Wiki**: https://vocaloid.fandom.com/
- **ABC Notation Reference**: https://abcnotation.com/

## Future Considerations

As AI voice synthesis continues to improve, consider:

1. **Voice Cloning**: Services like ElevenLabs may offer custom singing voices
2. **Real-time Synthesis**: Lower latency for live performance
3. **Expression Learning**: AI that learns from human performances
4. **Multi-language**: Automated translation with preserved melody

---

*This guide is part of the PlayWright AI Musical Theater project.*
*Last updated: December 2024*
