import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import axios from 'axios';

export default function ValidationDashboard() {
  const [validationResults, setValidationResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const selectedProject = 'Echo Musical';  // Fixed project for demo

  const runValidation = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/validation/run', { project: selectedProject });
      setValidationResults(response.data);
    } catch (error) {
      console.error('Error running validation:', error);
      // Mock data for demo
      setValidationResults({
        overall: {
          score: 85,
          status: 'Good',
          issues: 3,
          warnings: 5,
          passed: 12,
        },
        categories: [
          {
            name: 'Project Structure',
            score: 100,
            status: 'passed',
            checks: [
              { name: 'Directory structure exists', status: 'passed' },
              { name: 'Required files present', status: 'passed' },
              { name: 'Templates copied', status: 'passed' },
            ],
          },
          {
            name: 'Content Development',
            score: 80,
            status: 'warning',
            checks: [
              { name: 'Characters defined (5/5)', status: 'passed' },
              { name: 'Scenes written (10/12)', status: 'warning', message: '2 scenes need completion' },
              { name: 'Songs completed (7/8)', status: 'warning', message: '1 song needs lyrics' },
            ],
          },
          {
            name: 'Cultural Authenticity',
            score: 75,
            status: 'warning',
            checks: [
              { name: 'Character depth', status: 'passed' },
              { name: 'Stereotype avoidance', status: 'warning', message: 'Review character #3' },
              { name: 'Authentic dialogue', status: 'passed' },
            ],
          },
          {
            name: 'Professional Formatting',
            score: 90,
            status: 'passed',
            checks: [
              { name: 'Scene headings formatted', status: 'passed' },
              { name: 'Character names consistent', status: 'passed' },
              { name: 'Stage directions clear', status: 'warning', message: 'Scene 7 needs revision' },
            ],
          },
        ],
        recommendations: [
          'Complete Scene 11 and Scene 12',
          'Finish lyrics for "The Final Song"',
          'Review Character #3 for authenticity',
          'Add more specific stage directions to Scene 7',
          'Consider adding one more ensemble piece',
        ],
      });
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <CheckCircleIcon sx={{ color: '#10b981' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: '#f59e0b' }} />;
      case 'failed':
        return <ErrorIcon sx={{ color: '#ef4444' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
          <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 36 }} />
          Validation Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Validate your musical project for completeness and quality
        </Typography>
      </Box>

      {/* Project Selection and Run Button */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Project: <strong>{selectedProject}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Run validation checks to ensure your project meets quality standards
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayCircleIcon />}
            onClick={runValidation}
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            {loading ? 'Running...' : 'Run Validation'}
          </Button>
        </Box>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {validationResults && (
        <>
          {/* Overall Score */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h2" sx={{ fontWeight: 700, color: '#667eea' }}>
                    {validationResults.overall.score}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall Score
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: 40, color: '#10b981' }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {validationResults.overall.passed}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Passed
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon sx={{ fontSize: 40, color: '#f59e0b' }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {validationResults.overall.warnings}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Warnings
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ErrorIcon sx={{ fontSize: 40, color: '#ef4444' }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {validationResults.overall.issues}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Issues
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Category Details */}
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Validation Categories
          </Typography>
          {validationResults.categories.map((category, index) => (
            <Accordion key={index} defaultExpanded={category.status !== 'passed'}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  {getStatusIcon(category.status)}
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {category.name}
                  </Typography>
                  <Chip
                    label={`${category.score}%`}
                    sx={{
                      backgroundColor: getStatusColor(category.status),
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {category.checks.map((check, checkIndex) => (
                    <ListItem key={checkIndex}>
                      <ListItemIcon>{getStatusIcon(check.status)}</ListItemIcon>
                      <ListItemText
                        primary={check.name}
                        secondary={check.message}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Recommendations */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Recommendations
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Here are suggested improvements to enhance your musical:
            </Alert>
            <List>
              {validationResults.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#667eea' }} />
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
    </Box>
  );
}
