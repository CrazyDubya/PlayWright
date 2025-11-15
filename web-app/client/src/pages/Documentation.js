import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Breadcrumbs,
  Link,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ReactMarkdown from 'react-markdown';

const docs = [
  {
    id: 'quick-start',
    title: 'Quick Start Guide',
    category: 'Getting Started',
    content: `# Quick Start Guide

Welcome to PlayWright! This guide will help you create your first musical concept in 30 minutes.

## Step 1: Generate a Concept

1. Navigate to the **Concept Generator**
2. Choose your generation mode:
   - **Random**: Let AI create a unique concept
   - **Guided**: Select specific elements
   - **Custom**: Input your own ideas

## Step 2: Create a Project

1. Go to **Project Manager**
2. Click "New Project"
3. Name your project
4. Start building your musical!

## Step 3: Use Templates

Access professional templates for:
- Character development
- Scene structure
- Song lyrics
- Dance numbers
- Technical requirements

## Step 4: Validate Your Work

Run the validation dashboard to check:
- Project completeness
- Content quality
- Cultural authenticity
- Professional formatting

Ready to begin? Start with the Concept Generator!`,
  },
  {
    id: 'creative-methodology',
    title: 'Creative Methodology',
    category: 'Methodology',
    content: `# Creative Methodology

## The PlayWright Philosophy

"Perfect systems create competent art. Broken systems create transcendent art."

## Five-Phase Development Workflow

### Phase 1: Concept Development
- Generate initial idea
- Define core themes
- Establish target audience

### Phase 2: Character Creation
- Develop complex, authentic characters
- Build character relationships
- Define character arcs

### Phase 3: Story Structure
- Outline acts and scenes
- Plan musical numbers
- Structure dramatic arcs

### Phase 4: Content Creation
- Write scenes
- Compose songs
- Choreograph dances

### Phase 5: Refinement
- Validate content
- Polish dialogue
- Finalize production specs

## Transcendence Technology

Combine systematic scaffolding with authentic human messiness:
- Use templates as structure
- Embrace character flaws
- Allow authentic voices
- Trust creative instincts`,
  },
  {
    id: 'canvas-workspace',
    title: 'Canvas Workspace',
    category: 'Features',
    content: `# Canvas Workspace Guide

## Overview

The Canvas Workspace allows you to visualize your musical's structure using an interactive canvas.

## Features

### Character Mapping
- Add character nodes
- Draw relationships
- Visualize character networks

### Story Timeline
- Plot scenes chronologically
- Track character arcs
- Visualize story progression

### Relationship Web
- Map character connections
- Define relationship types
- Show relationship evolution

## How to Use

1. Select a tool from the left panel
2. Click on the canvas to add elements
3. Drag elements to reposition
4. Connect elements to show relationships
5. Save your workspace

## Tips

- Use colors to categorize elements
- Keep the canvas organized
- Save frequently
- Export for presentations`,
  },
  {
    id: 'templates',
    title: 'Template Guide',
    category: 'Templates',
    content: `# Template Guide

## Available Templates

### Character Development Template
Use this to create detailed character profiles including:
- Basic information
- Personality traits
- Backstory
- Character arc

### Scene Template
Structure your scenes with:
- Scene information (number, location, time)
- Purpose and objectives
- Character interactions
- Action and dialogue notes

### Song Lyric Template
Write compelling songs with:
- Song information
- Verse/chorus structure
- Bridge and final chorus
- Musical style notes

### Dance Number Template
Plan choreography with:
- Dance style and mood
- Character involvement
- Movement descriptions
- Music integration

### Technical Requirements Template
Document production needs:
- Set design
- Lighting design
- Sound requirements
- Costume notes
- Props list

## Best Practices

1. Start with templates as scaffolding
2. Customize to fit your vision
3. Save customized templates
4. Share with collaborators`,
  },
];

export default function Documentation() {
  const [selectedDoc, setSelectedDoc] = useState(docs[0]);

  const categories = [...new Set(docs.map(doc => doc.category))];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
          <MenuBookIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 36 }} />
          Documentation
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Learn how to use PlayWright effectively
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar Navigation */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              {categories.map((category) => (
                <Box key={category} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#667eea' }}>
                    {category}
                  </Typography>
                  <List dense>
                    {docs
                      .filter(doc => doc.category === category)
                      .map((doc) => (
                        <ListItemButton
                          key={doc.id}
                          selected={selectedDoc.id === doc.id}
                          onClick={() => setSelectedDoc(doc)}
                          sx={{
                            borderRadius: 1,
                            '&.Mui-selected': {
                              backgroundColor: '#667eea',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#5568d3',
                              },
                            },
                          }}
                        >
                          <ListItemText primary={doc.title} />
                        </ListItemButton>
                      ))}
                  </List>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Content Area */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 4 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
              <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }}>
                Documentation
              </Link>
              <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }}>
                {selectedDoc.category}
              </Link>
              <Typography color="text.primary">{selectedDoc.title}</Typography>
            </Breadcrumbs>

            <Box
              sx={{
                '& h1': { fontSize: '2.5rem', fontWeight: 700, mb: 3 },
                '& h2': { fontSize: '1.75rem', fontWeight: 600, mb: 2, mt: 4, color: '#667eea' },
                '& h3': { fontSize: '1.25rem', fontWeight: 600, mb: 1.5, mt: 3 },
                '& p': { mb: 2, lineHeight: 1.7 },
                '& ul': { ml: 3, mb: 2 },
                '& li': { mb: 1 },
                '& code': {
                  backgroundColor: '#f3f4f6',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                },
              }}
            >
              <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
