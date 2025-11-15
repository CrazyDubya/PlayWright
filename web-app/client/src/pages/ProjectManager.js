import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Mock data for demo
      setProjects([
        {
          id: 1,
          name: 'Echo Musical',
          status: 'Complete',
          progress: 100,
          lastModified: '2025-01-15',
          charactersCount: 5,
          scenesCount: 12,
          songsCount: 8,
        },
        {
          id: 2,
          name: 'Silly Magic Academy',
          status: 'In Progress',
          progress: 70,
          lastModified: '2025-01-14',
          charactersCount: 8,
          scenesCount: 10,
          songsCount: 7,
        },
        {
          id: 3,
          name: 'Midnight at the Majestic',
          status: 'Planning',
          progress: 30,
          lastModified: '2025-01-10',
          charactersCount: 6,
          scenesCount: 4,
          songsCount: 2,
        },
      ]);
    }
  };

  const handleCreateProject = async () => {
    try {
      await axios.post('/api/projects/create', { name: newProjectName });
      setOpenDialog(false);
      setNewProjectName('');
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'success';
      case 'In Progress':
        return 'primary';
      case 'Planning':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return project.status === 'In Progress';
    if (activeTab === 2) return project.status === 'Complete';
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
            <FolderIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 36 }} />
            Project Manager
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your musical theater projects
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          New Project
        </Button>
      </Box>

      {/* Filter Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label={`All Projects (${projects.length})`} />
          <Tab label="In Progress" />
          <Tab label="Completed" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {project.name}
                  </Typography>
                  <Chip
                    label={project.status}
                    size="small"
                    color={getStatusColor(project.status)}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progress: {project.progress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={`${project.charactersCount} Characters`} size="small" variant="outlined" />
                  <Chip label={`${project.scenesCount} Scenes`} size="small" variant="outlined" />
                  <Chip label={`${project.songsCount} Songs`} size="small" variant="outlined" />
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Last modified: {project.lastModified}
                </Typography>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  View
                </Button>
                <Button size="small" startIcon={<EditIcon />}>
                  Edit
                </Button>
                <IconButton size="small" color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Project Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            variant="outlined"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateProject}
            variant="contained"
            disabled={!newProjectName}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function ProjectDetail() {
  return (
    <Box>
      <Typography variant="h4">Project Detail View</Typography>
      <Typography>Detailed project editor will go here</Typography>
    </Box>
  );
}

export default function ProjectManager() {
  return (
    <Routes>
      <Route path="/" element={<ProjectList />} />
      <Route path="/:id" element={<ProjectDetail />} />
    </Routes>
  );
}
