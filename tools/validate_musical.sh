#!/bin/bash

# PlayWright Musical Project Validator
# Checks project completeness and quality standards

echo "🔍 PlayWright Musical Project Validator"
echo "======================================="
echo ""

# Check if we're in a valid project directory
if [[ ! -f "PROJECT_OVERVIEW.md" ]]; then
    echo "❌ Error: Not in a valid PlayWright musical project directory."
    echo "   Make sure you're in a project folder with PROJECT_OVERVIEW.md"
    exit 1
fi

PROJECT_NAME=$(basename "$(pwd)" | sed 's/_musical$//')
echo "📋 Validating Project: $PROJECT_NAME"
echo ""

# Initialize counters
PASSED=0
FAILED=0
WARNINGS=0

# Function to check file exists and has content
check_file() {
    local file=$1
    local description=$2
    local required=${3:-true}
    
    if [[ -f "$file" ]]; then
        local size=$(wc -c < "$file")
        if [[ $size -gt 100 ]]; then
            echo "✅ $description"
            ((PASSED++))
            return 0
        else
            echo "⚠️  $description (file exists but appears empty)"
            ((WARNINGS++))
            return 1
        fi
    else
        if [[ "$required" == "true" ]]; then
            echo "❌ $description (missing)"
            ((FAILED++))
            return 1
        else
            echo "⚠️  $description (optional, not found)"
            ((WARNINGS++))
            return 1
        fi
    fi
}

# Function to count files in directory
count_files() {
    local dir=$1
    local pattern=${2:-"*.md"}
    
    if [[ -d "$dir" ]]; then
        find "$dir" -name "$pattern" | wc -l
    else
        echo "0"
    fi
}

echo "🏗️ PROJECT STRUCTURE VALIDATION"
echo "================================"

# Check directory structure
check_file "PROJECT_OVERVIEW.md" "Project Overview"
check_file "DEVELOPMENT_WORKFLOW.md" "Development Workflow"

# Check subdirectories exist
for dir in characters scenes songs research technical; do
    if [[ -d "$dir" ]]; then
        echo "✅ $dir/ directory exists"
        ((PASSED++))
    else
        echo "❌ $dir/ directory missing"
        ((FAILED++))
    fi
done

echo ""
echo "📝 CONTENT VALIDATION"
echo "====================="

# Check character development
char_count=$(count_files "characters" "*.md")
if [[ $char_count -ge 3 ]]; then
    echo "✅ Character development ($char_count character files)"
    ((PASSED++))
elif [[ $char_count -ge 1 ]]; then
    echo "⚠️  Character development ($char_count character files - need at least 3)"
    ((WARNINGS++))
else
    echo "❌ Character development (no character files found)"
    ((FAILED++))
fi

# Check scene development
scene_count=$(count_files "scenes" "*.md")
if [[ $scene_count -ge 8 ]]; then
    echo "✅ Scene development ($scene_count scene files)"
    ((PASSED++))
elif [[ $scene_count -ge 3 ]]; then
    echo "⚠️  Scene development ($scene_count scene files - typical musical needs 8-12)"
    ((WARNINGS++))
else
    echo "❌ Scene development (insufficient scenes - need at least 3)"
    ((FAILED++))
fi

# Check song development
song_count=$(count_files "songs" "*.md")
if [[ $song_count -ge 5 ]]; then
    echo "✅ Song development ($song_count song files)"
    ((PASSED++))
elif [[ $song_count -ge 2 ]]; then
    echo "⚠️  Song development ($song_count song files - typical musical needs 5-8)"
    ((WARNINGS++))
else
    echo "❌ Song development (insufficient songs - need at least 2)"
    ((FAILED++))
fi

# Check research
check_file "research/CULTURAL_RESEARCH.md" "Cultural Research" false

# Check technical requirements
check_file "technical/TECHNICAL_REQUIREMENTS.md" "Technical Requirements" false

echo ""
echo "🎯 QUALITY STANDARDS CHECK"
echo "=========================="

# Check PROJECT_OVERVIEW.md for completeness
if [[ -f "PROJECT_OVERVIEW.md" ]]; then
    # Check for filled-out concept
    if grep -q "Logline: When ___" "PROJECT_OVERVIEW.md"; then
        echo "⚠️  Project concept not filled out"
        ((WARNINGS++))
    else
        echo "✅ Project concept defined"
        ((PASSED++))
    fi
    
    # Check for character list
    if grep -q "Protagonist: ___" "PROJECT_OVERVIEW.md"; then
        echo "⚠️  Main characters not defined"
        ((WARNINGS++))
    else
        echo "✅ Main characters defined"
        ((PASSED++))
    fi
    
    # Check for song list
    if grep -q "Opening Number: ___" "PROJECT_OVERVIEW.md"; then
        echo "⚠️  Song list not planned"
        ((WARNINGS++))
    else
        echo "✅ Song list planned"
        ((PASSED++))
    fi
fi

echo ""
echo "🌍 CULTURAL AUTHENTICITY CHECK"
echo "=============================="

# Look for cultural specificity indicators
cultural_indicators=0

if [[ -f "research/CULTURAL_RESEARCH.md" ]]; then
    if grep -q "Specific Community: ___" "research/CULTURAL_RESEARCH.md"; then
        echo "⚠️  Cultural community not specified"
        ((WARNINGS++))
    else
        echo "✅ Cultural community specified"
        ((PASSED++))
        ((cultural_indicators++))
    fi
    
    if grep -q "Primary source interviews conducted" "research/CULTURAL_RESEARCH.md"; then
        echo "✅ Primary source research planned"
        ((PASSED++))
        ((cultural_indicators++))
    fi
fi

# Check character files for cultural details
if [[ -d "characters" ]]; then
    if find characters -name "*.md" -exec grep -l "Cultural Background\|Language\|Family" {} \; | head -1 > /dev/null; then
        echo "✅ Character files include cultural details"
        ((PASSED++))
        ((cultural_indicators++))
    else
        echo "⚠️  Character files missing cultural details"
        ((WARNINGS++))
    fi
fi

if [[ $cultural_indicators -eq 0 ]]; then
    echo "❌ No cultural authenticity indicators found"
    ((FAILED++))
fi

echo ""
echo "🎭 PROFESSIONAL STANDARDS CHECK"
echo "==============================="

# Check for proper formatting indicators
formatting_score=0

# Look for professional script formatting
if find scenes -name "*.md" -exec grep -l "ACT\|SCENE\|CHARACTER:" {} \; | head -1 > /dev/null 2>/dev/null; then
    echo "✅ Scenes use professional formatting"
    ((PASSED++))
    ((formatting_score++))
fi

# Look for song structure
if find songs -name "*.md" -exec grep -l "Verse\|Chorus\|Bridge" {} \; | head -1 > /dev/null 2>/dev/null; then
    echo "✅ Songs include structural elements"
    ((PASSED++))
    ((formatting_score++))
fi

# Check technical requirements
if [[ -f "technical/TECHNICAL_REQUIREMENTS.md" ]]; then
    if grep -q "Runtime:" "technical/TECHNICAL_REQUIREMENTS.md" && grep -q "Cast Size:" "technical/TECHNICAL_REQUIREMENTS.md"; then
        echo "✅ Technical specifications documented"
        ((PASSED++))
        ((formatting_score++))
    fi
fi

if [[ $formatting_score -eq 0 ]]; then
    echo "⚠️  Professional formatting elements not detected"
    ((WARNINGS++))
fi

echo ""
echo "📊 VALIDATION SUMMARY"
echo "===================="
echo "✅ Passed Checks: $PASSED"
echo "⚠️  Warnings: $WARNINGS"
echo "❌ Failed Checks: $FAILED"
echo ""

# Calculate overall status
TOTAL_CHECKS=$((PASSED + WARNINGS + FAILED))
PASS_RATE=$((PASSED * 100 / TOTAL_CHECKS))

if [[ $FAILED -eq 0 && $PASS_RATE -ge 80 ]]; then
    echo "🎉 PROJECT STATUS: EXCELLENT"
    echo "Your musical project meets professional standards!"
elif [[ $FAILED -le 2 && $PASS_RATE -ge 60 ]]; then
    echo "👍 PROJECT STATUS: GOOD"
    echo "Your musical project is on track. Address warnings to improve."
elif [[ $FAILED -le 5 && $PASS_RATE -ge 40 ]]; then
    echo "⚠️  PROJECT STATUS: NEEDS WORK"
    echo "Your musical project needs significant development."
else
    echo "❌ PROJECT STATUS: INCOMPLETE"
    echo "Your musical project requires major work before completion."
fi

echo ""
echo "🎯 NEXT STEPS RECOMMENDATIONS"
echo "============================"

if [[ $FAILED -gt 0 ]]; then
    echo "🔴 CRITICAL ACTIONS NEEDED:"
    echo "• Complete missing required files"
    echo "• Fill out project overview concept section"
    echo "• Develop minimum character and content requirements"
fi

if [[ $WARNINGS -gt 3 ]]; then
    echo "🟡 IMPROVEMENTS RECOMMENDED:"
    echo "• Complete cultural research documentation"
    echo "• Develop additional scenes and songs"
    echo "• Enhance professional formatting"
    echo "• Add technical specifications"
fi

if [[ $cultural_indicators -lt 2 ]]; then
    echo "🌍 CULTURAL AUTHENTICITY FOCUS:"
    echo "• Research specific cultural community"
    echo "• Conduct primary source interviews"
    echo "• Document language patterns and traditions"
    echo "• Seek community validation"
fi

echo ""
echo "📚 HELPFUL RESOURCES"
echo "==================="
echo "• Character Development: ../../tutorials/character_basics.md"
echo "• Creative Methodology: ../../CREATIVE_METHODOLOGY.md"
echo "• Cultural Research Guide: ../../research/cultural_authenticity.md"
echo "• Professional Standards: ../../templates/"
echo ""

# Exit with appropriate code
if [[ $FAILED -eq 0 ]]; then
    exit 0
else
    exit 1
fi