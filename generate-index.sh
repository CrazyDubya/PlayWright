#!/bin/bash
# Generate project file index for static GitHub Pages

OUTPUT_FILE="docs/projects-index.json"

echo "{" > "$OUTPUT_FILE"
echo '  "projects": {' >> "$OUTPUT_FILE"

first_project=true

for project_dir in projects/*/; do
    project_name=$(basename "$project_dir")
    
    if [ "$first_project" = false ]; then
        echo "," >> "$OUTPUT_FILE"
    fi
    first_project=false
    
    echo "    \"$project_name\": {" >> "$OUTPUT_FILE"
    
    # List overview files
    echo '      "overview": [' >> "$OUTPUT_FILE"
    first_file=true
    for file in "$project_dir"*.md; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            if [ "$first_file" = false ]; then
                echo "," >> "$OUTPUT_FILE"
            fi
            first_file=false
            echo "        \"$filename\"" >> "$OUTPUT_FILE"
        fi
    done
    echo "      ]," >> "$OUTPUT_FILE"
    
    # List scenes
    echo '      "scenes": [' >> "$OUTPUT_FILE"
    if [ -d "${project_dir}scenes" ]; then
        first_file=true
        for file in "${project_dir}scenes/"*.md; do
            if [ -f "$file" ]; then
                filename=$(basename "$file")
                if [ "$first_file" = false ]; then
                    echo "," >> "$OUTPUT_FILE"
                fi
                first_file=false
                echo "        \"scenes/$filename\"" >> "$OUTPUT_FILE"
            fi
        done
    fi
    echo "      ]," >> "$OUTPUT_FILE"
    
    # List revised scenes
    echo '      "scenes_revised": [' >> "$OUTPUT_FILE"
    if [ -d "${project_dir}scenes_revised" ]; then
        first_file=true
        for file in "${project_dir}scenes_revised/"*.md; do
            if [ -f "$file" ]; then
                filename=$(basename "$file")
                if [ "$first_file" = false ]; then
                    echo "," >> "$OUTPUT_FILE"
                fi
                first_file=false
                echo "        \"scenes_revised/$filename\"" >> "$OUTPUT_FILE"
            fi
        done
    fi
    echo "      ]," >> "$OUTPUT_FILE"
    
    # List songs
    echo '      "songs": [' >> "$OUTPUT_FILE"
    if [ -d "${project_dir}songs" ]; then
        first_file=true
        for file in "${project_dir}songs/"*.md; do
            if [ -f "$file" ]; then
                filename=$(basename "$file")
                if [ "$first_file" = false ]; then
                    echo "," >> "$OUTPUT_FILE"
                fi
                first_file=false
                echo "        \"songs/$filename\"" >> "$OUTPUT_FILE"
            fi
        done
    fi
    echo "      ]" >> "$OUTPUT_FILE"
    
    echo "    }" >> "$OUTPUT_FILE"
done

echo "  }" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

echo "Generated $OUTPUT_FILE"
cat "$OUTPUT_FILE" | head -50
