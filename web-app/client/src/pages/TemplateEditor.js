import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import ReactMarkdown from 'react-markdown';

const templates = [
  {
    name: 'Character Development',
    icon: <PersonIcon />,
    description: 'Create detailed character profiles',
    template: `# Character Profile

## Basic Information
- **Name**:
- **Age**:
- **Occupation**:

## Personality
- Core traits:
- Flaws:
- Strengths:

## Backstory
(Write character's background here)

## Arc
- Starting point:
- Growth:
- End point:`,
  },
  {
    name: 'Scene Template',
    icon: <TheaterComedyIcon />,
    description: 'Structure your scenes effectively',
    template: `# Scene Template

## Scene Information
- **Scene Number**:
- **Location**:
- **Time**:

## Purpose
(What does this scene accomplish?)

## Characters Present
-

## Action
(What happens in this scene)

## Dialogue Notes
(Key conversations or moments)`,
  },
  {
    name: 'Song Lyric',
    icon: <MusicNoteIcon />,
    description: 'Write compelling song lyrics',
    template: `# Song Title

## Song Information
- **Character(s)**:
- **Moment in Story**:
- **Musical Style**:

## Verse 1
(Lyrics here)

## Chorus
(Lyrics here)

## Verse 2
(Lyrics here)

## Bridge
(Lyrics here)

## Final Chorus
(Lyrics here)`,
  },
];

export default function TemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [content, setContent] = useState(templates[0].template);
  const [previewMode, setPreviewMode] = useState(false);

  const handleTemplateChange = (index) => {
    setSelectedTemplate(index);
    setContent(templates[index].template);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
          <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 36 }} />
          Template Editor
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Use professional templates to structure your musical content
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Template Selection */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Select Template
          </Typography>
          <Grid container spacing={2}>
            {templates.map((template, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedTemplate === index ? '2px solid #667eea' : '1px solid #e5e7eb',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 2,
                    },
                  }}
                  onClick={() => handleTemplateChange(index)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ color: '#667eea', mr: 1 }}>
                        {template.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                        {template.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Editor/Preview */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', minHeight: 600 }}>
            <Tabs value={previewMode ? 1 : 0} onChange={(e, v) => setPreviewMode(v === 1)}>
              <Tab label="Edit" />
              <Tab label="Preview" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {!previewMode ? (
                <TextField
                  fullWidth
                  multiline
                  rows={20}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  variant="outlined"
                  placeholder="Start writing..."
                  sx={{
                    '& .MuiInputBase-root': {
                      fontFamily: 'monospace',
                      fontSize: '14px',
                    },
                  }}
                />
              ) : (
                <Box
                  sx={{
                    minHeight: 500,
                    p: 2,
                    backgroundColor: '#f8fafc',
                    borderRadius: 1,
                    '& h1': { fontSize: '2rem', fontWeight: 700, mb: 2 },
                    '& h2': { fontSize: '1.5rem', fontWeight: 600, mb: 1.5, mt: 3 },
                    '& h3': { fontSize: '1.25rem', fontWeight: 600, mb: 1, mt: 2 },
                    '& p': { mb: 1 },
                    '& ul': { ml: 3 },
                  }}
                >
                  <ReactMarkdown>{content}</ReactMarkdown>
                </Box>
              )}
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 2 }}>
              <Button variant="contained" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                Save Template
              </Button>
              <Button variant="outlined">Export</Button>
              <Button variant="outlined" onClick={() => setContent(templates[selectedTemplate].template)}>
                Reset
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
