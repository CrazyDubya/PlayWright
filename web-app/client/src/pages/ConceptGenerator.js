import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Paper,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

const GENRES = ['Drama', 'Comedy', 'Romance', 'Mystery', 'Fantasy', 'Sci-Fi', 'Historical', 'Musical Comedy'];
const SETTINGS = ['Urban', 'Rural', 'Historical', 'Contemporary', 'Fantasy World', 'Dystopian', 'Small Town', 'Big City'];
const THEMES = ['Identity', 'Love', 'Justice', 'Family', 'Redemption', 'Coming of Age', 'Social Change', 'Cultural Heritage'];
const CONFLICTS = ['Internal Struggle', 'Society vs Individual', 'Tradition vs Change', 'Good vs Evil', 'Rich vs Poor', 'Old vs Young'];

export default function ConceptGenerator() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatedConcept, setGeneratedConcept] = useState(null);

  const [formData, setFormData] = useState({
    mode: 'random',
    genre: '',
    setting: '',
    theme: '',
    conflict: '',
    customInput: '',
  });

  const steps = ['Choose Mode', 'Select Elements', 'Generate Concept', 'Review & Save'];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setFormData({ ...formData, mode: newValue === 0 ? 'random' : newValue === 1 ? 'guided' : 'custom' });
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/concepts/generate', formData);
      setGeneratedConcept(response.data);
      setActiveStep(2);
    } catch (error) {
      console.error('Error generating concept:', error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      await axios.post('/api/concepts/save', generatedConcept);
      alert('Concept saved successfully!');
    } catch (error) {
      console.error('Error saving concept:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
          <AutoAwesomeIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 36 }} />
          Concept Generator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create unique musical theater concepts with AI-powered generation
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Mode Selection Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Random Generation" />
          <Tab label="Guided Selection" />
          <Tab label="Custom Input" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Panel - Input */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Configure Your Concept
              </Typography>

              {activeTab === 0 && (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <AutoAwesomeIcon sx={{ fontSize: 80, color: '#667eea', mb: 2 }} />
                  <Typography variant="body1" paragraph>
                    Let the AI randomly generate a unique musical concept for you!
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleGenerate}
                    disabled={loading}
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Generate Random Concept'}
                  </Button>
                </Box>
              )}

              {activeTab === 1 && (
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Genre</InputLabel>
                    <Select
                      value={formData.genre}
                      label="Genre"
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    >
                      {GENRES.map((genre) => (
                        <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Setting</InputLabel>
                    <Select
                      value={formData.setting}
                      label="Setting"
                      onChange={(e) => setFormData({ ...formData, setting: e.target.value })}
                    >
                      {SETTINGS.map((setting) => (
                        <MenuItem key={setting} value={setting}>{setting}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={formData.theme}
                      label="Theme"
                      onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    >
                      {THEMES.map((theme) => (
                        <MenuItem key={theme} value={theme}>{theme}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Conflict</InputLabel>
                    <Select
                      value={formData.conflict}
                      label="Conflict"
                      onChange={(e) => setFormData({ ...formData, conflict: e.target.value })}
                    >
                      {CONFLICTS.map((conflict) => (
                        <MenuItem key={conflict} value={conflict}>{conflict}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleGenerate}
                    disabled={loading || !formData.genre || !formData.setting}
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Generate Concept'}
                  </Button>
                </Box>
              )}

              {activeTab === 2 && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="Describe your musical concept"
                    placeholder="Enter your ideas, themes, characters, or story elements..."
                    value={formData.customInput}
                    onChange={(e) => setFormData({ ...formData, customInput: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleGenerate}
                    disabled={loading || !formData.customInput}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Generate from Description'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Output */}
        <Grid item xs={12} md={6}>
          <Card sx={{ minHeight: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Generated Concept
              </Typography>

              {!generatedConcept ? (
                <Box sx={{ py: 8, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Your generated concept will appear here
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#667eea' }}>
                    {generatedConcept.title}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip label={generatedConcept.genre} sx={{ mr: 1, mb: 1 }} />
                    <Chip label={generatedConcept.setting} sx={{ mr: 1, mb: 1 }} color="primary" />
                    <Chip label={generatedConcept.theme} sx={{ mr: 1, mb: 1 }} color="secondary" />
                  </Box>

                  <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                    <strong>Logline:</strong> {generatedConcept.logline}
                  </Typography>

                  <Typography variant="body1" paragraph>
                    <strong>Central Conflict:</strong> {generatedConcept.conflict}
                  </Typography>

                  <Typography variant="body1" paragraph>
                    <strong>Target Audience:</strong> {generatedConcept.targetAudience}
                  </Typography>

                  <Alert severity="success" sx={{ mt: 2 }}>
                    Concept generated successfully! Ready to save or regenerate.
                  </Alert>

                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      }}
                    >
                      Save Concept
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={handleGenerate}
                    >
                      Regenerate
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
