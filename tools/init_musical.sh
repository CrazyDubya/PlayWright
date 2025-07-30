#!/bin/bash

# PlayWright Musical Project Initialization Script
# Creates complete project structure for new musical development

echo "🎭 PlayWright Musical Project Initializer"
echo "=========================================="
echo ""

# Get project name
read -p "Enter your musical project name (e.g., 'midnight_at_the_majestic'): " PROJECT_NAME

if [ -z "$PROJECT_NAME" ]; then
    echo "Error: Project name cannot be empty."
    exit 1
fi

# Clean project name (remove spaces, make lowercase, use underscores)
CLEAN_NAME=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '_' | sed 's/[^a-z0-9_]//g')

# Create main project directory
PROJECT_DIR="projects/${CLEAN_NAME}_musical"

if [ -d "$PROJECT_DIR" ]; then
    read -p "Project directory already exists. Continue anyway? (y/n): " CONTINUE
    if [[ ! $CONTINUE =~ ^[Yy]$ ]]; then
        echo "Initialization cancelled."
        exit 1
    fi
fi

echo ""
echo "Creating project structure for: $CLEAN_NAME"
echo "Project directory: $PROJECT_DIR"
echo ""

# Create directory structure
mkdir -p "$PROJECT_DIR"
mkdir -p "$PROJECT_DIR/characters"
mkdir -p "$PROJECT_DIR/scenes"
mkdir -p "$PROJECT_DIR/songs"
mkdir -p "$PROJECT_DIR/research"
mkdir -p "$PROJECT_DIR/drafts"
mkdir -p "$PROJECT_DIR/technical"

echo "✅ Directory structure created"

# Create main project file
cat > "$PROJECT_DIR/PROJECT_OVERVIEW.md" << EOF
# $PROJECT_NAME Musical Project

**Status:** In Development  
**Created:** $(date +"%Y-%m-%d")

## Quick Reference
- [Character Profiles](characters/)
- [Scene Scripts](scenes/)
- [Musical Numbers](songs/)
- [Research Notes](research/)
- [Technical Requirements](technical/)

## Project Checklist
- [ ] Core concept defined
- [ ] Main characters developed
- [ ] Three-act structure planned
- [ ] Cultural research completed
- [ ] Song placement mapped
- [ ] Act I scenes written
- [ ] Act I songs composed
- [ ] Act II scenes written  
- [ ] Act II songs composed
- [ ] Technical requirements documented
- [ ] First complete draft finished
- [ ] Cultural authenticity verified
- [ ] Professional formatting applied
- [ ] Production readiness achieved

## Core Concept
**Genre:** _______________  
**Setting:** _______________  
**Time Period:** _______________  
**Target Audience:** _______________

**Logline:** When _________________________, 
_________________________ must _________________________
or else _________________________.

**Cultural Focus:** _________________________

**Universal Theme:** _________________________

## Main Characters
1. **Protagonist:** _________________________
2. **Antagonist:** _________________________  
3. **Supporting:** _________________________
4. **Ensemble:** _________________________

## Song List (Planned)
1. Opening Number: _________________________
2. "I Want" Song: _________________________
3. Act I Finale: _________________________
4. "11 o'Clock Number": _________________________
5. Finale: _________________________

## Development Notes
$(date +"%Y-%m-%d"): Project initialized

EOF

echo "✅ Project overview created"

# Copy character template
cp "templates/character_development_template.md" "$PROJECT_DIR/characters/character_template.md"
echo "✅ Character template copied"

# Copy scene template  
cp "templates/scene_template.md" "$PROJECT_DIR/scenes/scene_template.md"
echo "✅ Scene template copied"

# Copy song template
cp "templates/song_lyric_template.md" "$PROJECT_DIR/songs/song_template.md"
echo "✅ Song template copied"

# Create research template
cat > "$PROJECT_DIR/research/CULTURAL_RESEARCH.md" << EOF
# Cultural Research for $PROJECT_NAME

## Community Background
**Specific Community:** _________________________  
**Geographic Location:** _________________________  
**Time Period Focus:** _________________________

## Research Checklist
- [ ] Primary source interviews conducted
- [ ] Economic realities understood
- [ ] Language patterns documented
- [ ] Family dynamics mapped
- [ ] Cultural celebrations identified
- [ ] Modern challenges catalogued
- [ ] Community validation sought

## Language and Speech Patterns
**Primary Language:** _________________________  
**Code-switching Examples:** _________________________  
**Generational Differences:** _________________________  
**Regional Dialects:** _________________________

## Cultural Traditions
**Key Celebrations:** _________________________  
**Food Traditions:** _________________________  
**Music/Dance:** _________________________  
**Religious/Spiritual:** _________________________

## Modern Challenges
**Economic Pressures:** _________________________  
**Discrimination Faced:** _________________________  
**Gentrification Issues:** _________________________  
**Generational Conflicts:** _________________________

## Authenticity Validation
**Community Contacts:** _________________________  
**Cultural Consultants:** _________________________  
**Sensitivity Readers:** _________________________

## Research Sources
- Books: _________________________
- Documentaries: _________________________
- Interviews: _________________________
- Cultural Centers: _________________________
EOF

echo "✅ Cultural research template created"

# Create technical requirements template
cat > "$PROJECT_DIR/technical/TECHNICAL_REQUIREMENTS.md" << EOF
# Technical Requirements for $PROJECT_NAME

## Performance Specifications
**Runtime:** _____ minutes (with _____ minute intermission)  
**Act I Runtime:** _____ minutes  
**Act II Runtime:** _____ minutes

**Cast Size:**
- Principal Roles: _____
- Supporting Roles: _____
- Ensemble: _____
- Total Cast: _____

**Crew Requirements:**
- Director: 1
- Musical Director: 1
- Choreographer: 1
- Stage Manager: 1
- Technical Director: 1
- Design Team: _____ (set, lighting, costume, sound)

## Musical Requirements
**Orchestra Size:** _____ pieces  
**Key Instruments Required:** _________________________  
**Vocal Ranges:**
- Soprano: _____
- Alto: _____
- Tenor: _____
- Bass: _____

## Production Elements
**Set Requirements:**
- Complexity Level: Basic/Moderate/Complex
- Scene Changes: _____
- Special Effects: _________________________

**Costume Requirements:**
- Period: _________________________
- Complexity: Basic/Moderate/Complex
- Quick Changes: _____

**Lighting Requirements:**
- Special Effects: _________________________
- Atmosphere Needs: _________________________

**Sound Requirements:**
- Microphones: _____ wireless, _____ stationary
- Sound Effects: _________________________
- Playback Needs: _________________________

## Budget Considerations
**Production Scale:**
- [ ] Community Theater ($10,000-$25,000)
- [ ] Regional Theater ($25,000-$100,000)  
- [ ] Professional Theater ($100,000+)

**Rights and Licensing:**
- Original work: Yes/No
- Adaptation: Yes/No (source: _______)
- Music rights: _________________________

## Venue Requirements
**Minimum Stage Size:** _____ x _____  
**Seating Capacity:** _____ - _____  
**Accessibility Needs:** _________________________  
**Load-in Requirements:** _________________________
EOF

echo "✅ Technical requirements template created"

# Create development workflow guide
cat > "$PROJECT_DIR/DEVELOPMENT_WORKFLOW.md" << EOF
# Development Workflow for $PROJECT_NAME

## Phase 1: Foundation (Week 1)
### Day 1-2: Concept Refinement
- [ ] Complete concept worksheet
- [ ] Conduct initial cultural research
- [ ] Define target audience
- [ ] Create project timeline

### Day 3-4: Character Development
- [ ] Develop protagonist profile
- [ ] Create antagonist with understandable motivations
- [ ] Design supporting characters
- [ ] Map relationship dynamics

### Day 5-7: Structure Planning
- [ ] Outline three-act structure
- [ ] Plan musical numbers placement
- [ ] Create scene-by-scene breakdown
- [ ] Identify key dramatic moments

## Phase 2: Act I Creation (Week 2)
### Day 8-10: Act I Scenes
- [ ] Write opening scene
- [ ] Develop character introduction scenes
- [ ] Build to inciting incident
- [ ] Create Act I climax

### Day 11-14: Act I Songs
- [ ] Compose opening number
- [ ] Write protagonist's "I Want" song
- [ ] Create character introduction songs
- [ ] Compose Act I finale

## Phase 3: Act II Creation (Week 3-4)
### Week 3: Act II-A
- [ ] Develop rising action scenes
- [ ] Create conflict escalation
- [ ] Build to midpoint reversal
- [ ] Write complication songs

### Week 4: Act II-B  
- [ ] Write crisis/dark moment
- [ ] Create climactic scenes
- [ ] Compose "11 o'clock number"
- [ ] Write resolution and finale

## Phase 4: Integration and Polish (Week 5)
### Day 29-31: First Draft Complete
- [ ] Assemble complete script
- [ ] Ensure smooth scene transitions
- [ ] Verify character consistency
- [ ] Check cultural authenticity

### Day 32-35: Professional Formatting
- [ ] Apply industry-standard formatting
- [ ] Create character breakdown
- [ ] Document technical requirements
- [ ] Prepare submission materials

## Daily Writing Goals
- **Scenes:** 1-2 scenes per day (3-5 pages each)
- **Songs:** 1 song every 2-3 days
- **Research:** 30 minutes daily
- **Revision:** 30 minutes daily review

## Quality Checkpoints
### After Each Scene:
- Does it advance plot or develop character?
- Is there clear conflict/tension?
- Does dialogue sound authentic to each character?
- Are cultural details accurate and specific?

### After Each Song:
- Does it serve a dramatic function?
- Is the emotional journey clear?
- Does it sound like the character singing?
- Does it integrate smoothly with dialogue?

### Weekly Reviews:
- Overall story coherence
- Character arc development
- Cultural authenticity check
- Professional standard compliance

## Troubleshooting
**If stuck on plot:** Return to character motivations and raise stakes  
**If dialogue feels flat:** Add subtext and conflicting objectives  
**If songs don't work:** Check emotional purpose and character voice  
**If authenticity concerns:** Consult cultural research and community feedback

## Success Metrics
- [ ] Professional industry format
- [ ] Culturally authentic representation
- [ ] Complex, contradictory characters
- [ ] Emotional resonance through specificity
- [ ] Commercial viability demonstrated
- [ ] Community validation received
EOF

echo "✅ Development workflow created"

# Create .gitignore for the project
cat > "$PROJECT_DIR/.gitignore" << EOF
# PlayWright Musical Project
# Ignore temporary and personal files

# Drafts and notes
drafts/personal_notes.md
drafts/scratch_*
*.tmp

# Audio recordings (use external storage)
*.mp3
*.wav
*.m4a

# Large files
*.pdf
*.doc
*.docx

# Personal research notes
research/personal_interviews/
research/sensitive_information/

# Backup files
*_backup.*
*.bak
*~
EOF

echo "✅ Project .gitignore created"

echo ""
echo "🎉 Project initialization complete!"
echo ""
echo "📁 Your project structure:"
echo "├── $PROJECT_DIR/"
echo "│   ├── PROJECT_OVERVIEW.md      # Main project file - START HERE"
echo "│   ├── DEVELOPMENT_WORKFLOW.md  # Step-by-step guide"
echo "│   ├── characters/              # Character development"
echo "│   ├── scenes/                  # Scene scripts"
echo "│   ├── songs/                   # Musical numbers"
echo "│   ├── research/                # Cultural research"
echo "│   ├── technical/               # Production requirements"
echo "│   └── drafts/                  # Working files"
echo ""
echo "🚀 Next Steps:"
echo "1. cd $PROJECT_DIR"
echo "2. Open PROJECT_OVERVIEW.md and complete the concept section"
echo "3. Follow DEVELOPMENT_WORKFLOW.md for systematic creation"
echo "4. Use templates in each folder for structured development"
echo ""
echo "💡 Quick Commands:"
echo "• Generate concept: ../../tools/generate_concept.sh"
echo "• View methodology: ../../CREATIVE_METHODOLOGY.md"
echo "• Quick start guide: ../../QUICK_START.md"
echo ""
echo "Happy creating! Your musical awaits. 🎭"