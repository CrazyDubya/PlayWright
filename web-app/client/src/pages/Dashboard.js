import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FolderIcon from '@mui/icons-material/Folder';
import BrushIcon from '@mui/icons-material/Brush';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProjects: 0,
    templatesAvailable: 6,
    recentActivity: [],
  });

  useEffect(() => {
    // Fetch dashboard stats
    axios.get('/api/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const quickActions = [
    {
      title: 'Generate New Concept',
      description: 'Create a new musical concept with AI-powered generation',
      icon: <AutoAwesomeIcon sx={{ fontSize: 48, color: '#667eea' }} />,
      action: () => navigate('/concept-generator'),
      color: '#667eea',
    },
    {
      title: 'Manage Projects',
      description: 'View and edit your musical theater projects',
      icon: <FolderIcon sx={{ fontSize: 48, color: '#ec4899' }} />,
      action: () => navigate('/projects'),
      color: '#ec4899',
    },
    {
      title: 'Canvas Workspace',
      description: 'Visualize your story structure and character relationships',
      icon: <BrushIcon sx={{ fontSize: 48, color: '#10b981' }} />,
      action: () => navigate('/canvas'),
      color: '#10b981',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
          Welcome to PlayWright
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your AI-powered musical theater creation framework
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {stats.totalProjects}
            </Typography>
            <Typography variant="body2">Active Projects</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {stats.templatesAvailable}
            </Typography>
            <Typography variant="body2">Templates Available</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 48 }} />
            <Typography variant="body2">Ready for Production</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>{action.icon}</Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  onClick={action.action}
                  sx={{
                    backgroundColor: action.color,
                    '&:hover': {
                      backgroundColor: action.color,
                      opacity: 0.9,
                    },
                  }}
                >
                  Get Started
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Recent Activity
        </Typography>
        <Paper sx={{ p: 2 }}>
          {stats.recentActivity.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              No recent activity. Start by creating a new musical concept!
            </Typography>
          ) : (
            stats.recentActivity.map((activity, index) => (
              <Box key={index} sx={{ py: 1 }}>
                <Typography variant="body2">{activity}</Typography>
              </Box>
            ))
          )}
        </Paper>
      </Box>
    </Box>
  );
}
