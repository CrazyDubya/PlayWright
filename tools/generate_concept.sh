#!/bin/bash

# PlayWright Musical Concept Generator
# Interactive script for generating musical theater concepts

echo "🎭 Welcome to the PlayWright Musical Concept Generator!"
echo "=================================================="
echo ""

# Function to get random element from array
get_random() {
    local array=("$@")
    local random_index=$((RANDOM % ${#array[@]}))
    echo "${array[$random_index]}"
}

# Cultural Perspectives
cultural_perspectives=(
    "Second-generation Korean-American family"
    "Puerto Rican community in the Bronx"
    "Irish-Catholic working-class neighborhood"
    "Mexican-American border town family"
    "Italian-American restaurant dynasty"
    "Jewish Orthodox family in transition"
    "African-American church community"
    "Polish immigrant family in Chicago"
    "Chinese-American Chinatown residents"
    "Lebanese-American family business"
    "Indian-American tech professionals"
    "Filipino-American healthcare workers"
    "Vietnamese-American nail salon owners"
    "Salvadoran immigrant construction workers"
    "Brazilian-American dance community"
)

# Personal Stakes
personal_stakes=(
    "Saving family business from closure"
    "Protecting cultural traditions from disappearing"
    "Choosing between love and family duty"
    "Overcoming immigration trauma"
    "Healing broken family relationships"
    "Finding authentic identity"
    "Pursuing delayed dreams"
    "Standing up to neighborhood gentrification"
    "Preserving community gathering space"
    "Balancing tradition with modernity"
    "Supporting aging parents"
    "Breaking generational cycles"
    "Achieving first-generation success"
    "Maintaining cultural language"
    "Building bridges between communities"
)

# Universal Themes
universal_themes=(
    "Identity and belonging"
    "Love versus obligation"
    "Tradition versus progress"
    "Individual versus community"
    "Hope versus despair"
    "Truth versus comfort"
    "Growth versus safety"
    "Justice versus peace"
    "Dreams versus reality"
    "Family bonds and conflicts"
    "Finding your voice"
    "Second chances"
    "The power of community"
    "Overcoming prejudice"
    "Intergenerational wisdom"
)

# Settings
settings=(
    "Family restaurant"
    "Community theater"
    "Local barbershop/beauty salon"
    "Neighborhood church"
    "Wedding preparation"
    "Apartment building"
    "High school reunion"
    "Cultural festival"
    "Family grocery store"
    "Dance studio"
    "Music venue"
    "Senior center"
    "Community garden"
    "Local hospital"
    "School auditorium"
)

# Conflicts
conflicts=(
    "Business facing foreclosure"
    "Family secret revealed"
    "Unexpected inheritance"
    "Old love returns"
    "Community crisis"
    "Health diagnosis"
    "Career opportunity requiring sacrifice"
    "Legal challenge"
    "Generational conflict"
    "Cultural identity crisis"
    "Economic hardship"
    "Neighborhood change"
    "Political awakening"
    "Educational opportunity"
    "Religious questioning"
)

echo "Choose your generation method:"
echo "1) Random Generation (Quick)"
echo "2) Guided Selection (Recommended)" 
echo "3) Mix and Match"
echo ""
read -p "Enter your choice (1-3): " method

case $method in
    1)
        echo ""
        echo "🎲 Generating Random Musical Concept..."
        echo "====================================="
        
        cultural=$(get_random "${cultural_perspectives[@]}")
        stakes=$(get_random "${personal_stakes[@]}")
        theme=$(get_random "${universal_themes[@]}")
        setting=$(get_random "${settings[@]}")
        conflict=$(get_random "${conflicts[@]}")
        
        echo ""
        echo "🌍 CULTURAL PERSPECTIVE: $cultural"
        echo "💔 PERSONAL STAKES: $stakes"
        echo "🎯 UNIVERSAL THEME: $theme"
        echo "🏢 SETTING: $setting"
        echo "⚡ CENTRAL CONFLICT: $conflict"
        echo ""
        
        echo "📝 YOUR MUSICAL CONCEPT:"
        echo "========================"
        echo "When a $conflict threatens a $setting, a $cultural"
        echo "must overcome $stakes to explore themes of $theme."
        ;;
        
    2)
        echo ""
        echo "📋 Guided Musical Concept Creation"
        echo "=================================="
        echo ""
        
        echo "Step 1: Choose Cultural Perspective"
        echo "===================================="
        for i in "${!cultural_perspectives[@]}"; do
            echo "$((i+1))) ${cultural_perspectives[$i]}"
        done
        echo ""
        read -p "Enter number (1-${#cultural_perspectives[@]}): " cult_choice
        cultural="${cultural_perspectives[$((cult_choice-1))]}"
        
        echo ""
        echo "Step 2: Choose Personal Stakes"
        echo "=============================="
        for i in "${!personal_stakes[@]}"; do
            echo "$((i+1))) ${personal_stakes[$i]}"
        done
        echo ""
        read -p "Enter number (1-${#personal_stakes[@]}): " stakes_choice
        stakes="${personal_stakes[$((stakes_choice-1))]}"
        
        echo ""
        echo "Step 3: Choose Universal Theme"
        echo "=============================="
        for i in "${!universal_themes[@]}"; do
            echo "$((i+1))) ${universal_themes[$i]}"
        done
        echo ""
        read -p "Enter number (1-${#universal_themes[@]}): " theme_choice
        theme="${universal_themes[$((theme_choice-1))]}"
        
        echo ""
        echo "Step 4: Choose Setting"
        echo "======================"
        for i in "${!settings[@]}"; do
            echo "$((i+1))) ${settings[$i]}"
        done
        echo ""
        read -p "Enter number (1-${#settings[@]}): " setting_choice
        setting="${settings[$((setting_choice-1))]}"
        
        echo ""
        echo "Step 5: Choose Central Conflict"
        echo "==============================="
        for i in "${!conflicts[@]}"; do
            echo "$((i+1))) ${conflicts[$i]}"
        done
        echo ""
        read -p "Enter number (1-${#conflicts[@]}): " conflict_choice
        conflict="${conflicts[$((conflict_choice-1))]}"
        
        echo ""
        echo "🎭 YOUR CUSTOM MUSICAL CONCEPT:"
        echo "==============================="
        echo "🌍 Cultural Perspective: $cultural"
        echo "💔 Personal Stakes: $stakes"
        echo "🎯 Universal Theme: $theme"
        echo "🏢 Setting: $setting"
        echo "⚡ Central Conflict: $conflict"
        ;;
        
    3)
        echo ""
        echo "🎨 Mix and Match Creation"
        echo "========================="
        echo ""
        
        echo "I'll give you 3 random options for each category."
        echo "Pick your favorite from each set!"
        echo ""
        
        echo "Cultural Perspectives (pick 1-3):"
        for i in {1..3}; do
            cultural=$(get_random "${cultural_perspectives[@]}")
            echo "$i) $cultural"
        done
        read -p "Choose (1-3): " cult_pick
        
        echo ""
        echo "Personal Stakes (pick 1-3):"
        for i in {1..3}; do
            stakes=$(get_random "${personal_stakes[@]}")
            echo "$i) $stakes"
        done
        read -p "Choose (1-3): " stakes_pick
        
        echo ""
        echo "Universal Themes (pick 1-3):"
        for i in {1..3}; do
            theme=$(get_random "${universal_themes[@]}")
            echo "$i) $theme"
        done
        read -p "Choose (1-3): " theme_pick
        
        echo ""
        echo "🎭 YOUR MIX & MATCH CONCEPT:"
        echo "============================"
        echo "Coming together to create your unique musical concept..."
        ;;
        
    *)
        echo "Invalid choice. Using random generation..."
        cultural=$(get_random "${cultural_perspectives[@]}")
        stakes=$(get_random "${personal_stakes[@]}")
        theme=$(get_random "${universal_themes[@]}")
        ;;
esac

echo ""
echo "📋 CONCEPT DEVELOPMENT WORKSHEET"
echo "================================="
echo ""
echo "Working Title: _______________________________"
echo ""
echo "Logline: When ________________ [conflict],"
echo "a ________________ [cultural community] must"
echo "________________ [goal] or else ________________"
echo "[consequences] in this story about ________________"
echo "[theme]."
echo ""
echo "🎭 NEXT STEPS:"
echo "=============="
echo "1. Research the cultural community authentically"
echo "2. Develop 3-5 main characters with contradictions"
echo "3. Plan your three-act structure" 
echo "4. Identify 5-8 musical moments"
echo "5. Add human messiness to break systematic perfection"
echo ""
echo "📚 RECOMMENDED READING:"
echo "======================="
echo "• CREATIVE_METHODOLOGY.md - Complete development guide"
echo "• QUICK_START.md - 30-minute concept expansion"
echo "• templates/ - Character and scene templates"
echo ""

read -p "Would you like to generate another concept? (y/n): " again

if [[ $again =~ ^[Yy]$ ]]; then
    echo ""
    exec "$0"
fi

echo ""
echo "🎭 Happy creating! Your musical is waiting to be born."
echo "Remember: Start systematic, then break the system with human authenticity."