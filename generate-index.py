#!/usr/bin/env python3
import json
import shutil
from pathlib import Path

projects_dir = Path('projects')
output_file = Path('docs/projects-index.json')
docs_projects_dir = Path('docs/projects')

# Copy project files into docs/ so GitHub Pages can serve them
if docs_projects_dir.exists():
    shutil.rmtree(docs_projects_dir)
shutil.copytree(projects_dir, docs_projects_dir)
print(f"Copied {projects_dir} -> {docs_projects_dir}")

projects_data = {}

for project_path in sorted(projects_dir.iterdir()):
    if not project_path.is_dir():
        continue

    project_name = project_path.name
    project_data = {
        'overview': [],
        'scenes': [],
        'scenes_revised': [],
        'songs': []
    }

    # Get overview files (root level .md files)
    for file in sorted(project_path.glob('*.md')):
        project_data['overview'].append(file.name)

    # Get scenes
    scenes_dir = project_path / 'scenes'
    if scenes_dir.exists():
        for file in sorted(scenes_dir.glob('*.md')):
            project_data['scenes'].append(f'scenes/{file.name}')

    # Get revised scenes
    revised_dir = project_path / 'scenes_revised'
    if revised_dir.exists():
        for file in sorted(revised_dir.glob('*.md')):
            project_data['scenes_revised'].append(f'scenes_revised/{file.name}')

    # Get songs
    songs_dir = project_path / 'songs'
    if songs_dir.exists():
        for file in sorted(songs_dir.glob('*.md')):
            project_data['songs'].append(f'songs/{file.name}')

    projects_data[project_name] = project_data

# Write output
output_data = {'projects': projects_data}
output_file.write_text(json.dumps(output_data, indent=2))

print(f"Generated {output_file}")
print(f"Total projects: {len(projects_data)}")
