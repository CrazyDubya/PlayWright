import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
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
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Alert,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import apiClient from '../utils/apiClient';

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
      const data = await apiClient.getProjects();
      setProjects(data);
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
      await apiClient.createProject(newProjectName);
      setOpenDialog(false);
      setNewProjectName('');
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      alert(error.message || 'Failed to create project');
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
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [script, setScript] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [songs, setSongs] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [selectedScene, setSelectedScene] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch project details
        const detailsData = await apiClient.getProjectDetails(id);
        setProjectData(detailsData);

        // Fetch script
        try {
          const scriptData = await apiClient.getProjectScript(id);
          setScript(scriptData);
        } catch (err) {
          console.log('No script available');
        }

        // Fetch scenes
        try {
          const scenesData = await apiClient.getProjectScenes(id);
          setScenes(scenesData.scenes || []);
        } catch (err) {
          console.log('No scenes available');
        }

        // Fetch songs
        try {
          const songsData = await apiClient.getProjectSongs(id);
          setSongs(songsData.songs || []);
        } catch (err) {
          console.log('No songs available');
        }

        // Fetch characters
        try {
          const charactersData = await apiClient.getProjectCharacters(id);
          setCharacters(charactersData.characters || []);
        } catch (err) {
          console.log('No characters available');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setError('Failed to load project. Please try again.');
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Reset selections when changing tabs
    setSelectedScene(null);
    setSelectedSong(null);
    setSelectedCharacter(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/projects')}
          sx={{ mb: 2 }}
        >
          Back to Projects
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
          <TheaterComedyIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 36 }} />
          {projectData?.name || id}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Chip icon={<DescriptionIcon />} label={`${scenes.length} Scenes`} />
          <Chip icon={<MusicNoteIcon />} label={`${songs.length} Songs`} />
          <Chip icon={<PersonIcon />} label={`${characters.length} Characters`} />
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Overview" />
          {script && script.found && <Tab label="Complete Script" />}
          {scenes.length > 0 && <Tab label={`Scenes (${scenes.length})`} />}
          {songs.length > 0 && <Tab label={`Songs (${songs.length})`} />}
          {characters.length > 0 && <Tab label={`Characters (${characters.length})`} />}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Paper sx={{ p: 3 }}>
        {/* Overview Tab */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>Project Overview</Typography>
            <Divider sx={{ my: 2 }} />
            {projectData?.['COMPLETE_MUSICAL_SUMMARY.md'] && (
              <Box sx={{ '& h1, & h2, & h3': { mt: 3, mb: 2 }, '& p': { mb: 1 } }}>
                <ReactMarkdown>{projectData['COMPLETE_MUSICAL_SUMMARY.md']}</ReactMarkdown>
              </Box>
            )}
            {projectData?.['README.md'] && !projectData?.['COMPLETE_MUSICAL_SUMMARY.md'] && (
              <Box sx={{ '& h1, & h2, & h3': { mt: 3, mb: 2 }, '& p': { mb: 1 } }}>
                <ReactMarkdown>{projectData['README.md']}</ReactMarkdown>
              </Box>
            )}
            {projectData?.['concept.md'] && (
              <Box sx={{ mt: 3, '& h1, & h2, & h3': { mt: 3, mb: 2 }, '& p': { mb: 1 } }}>
                <ReactMarkdown>{projectData['concept.md']}</ReactMarkdown>
              </Box>
            )}
            {!projectData?.['COMPLETE_MUSICAL_SUMMARY.md'] && !projectData?.['README.md'] && !projectData?.['concept.md'] && (
              <Typography color="text.secondary">No overview content available for this project.</Typography>
            )}
          </Box>
        )}

        {/* Complete Script Tab */}
        {script && script.found && activeTab === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Complete Musical Script
              {script.compiled && <Chip label="Compiled from Scenes" size="small" sx={{ ml: 2 }} />}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ 
              '& h1': { fontSize: '2rem', fontWeight: 700, mt: 4, mb: 2 },
              '& h2': { fontSize: '1.5rem', fontWeight: 600, mt: 3, mb: 2 },
              '& h3': { fontSize: '1.25rem', fontWeight: 600, mt: 2, mb: 1 },
              '& p': { mb: 1, lineHeight: 1.7 },
              '& ul, & ol': { ml: 3, mb: 2 },
              '& blockquote': { borderLeft: '4px solid #ddd', pl: 2, ml: 0, fontStyle: 'italic' },
              '& hr': { my: 3 },
              '& pre': { bgcolor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' },
            }}>
              <ReactMarkdown>{script.content}</ReactMarkdown>
            </Box>
          </Box>
        )}

        {/* Scenes Tab */}
        {scenes.length > 0 && activeTab === (script && script.found ? 2 : 1) && (
          <Box>
            {!selectedScene ? (
              <Box>
                <Typography variant="h5" gutterBottom>Individual Scenes</Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                  {scenes.map((scene, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton onClick={() => setSelectedScene(scene)}>
                        <ListItemText 
                          primary={scene.name}
                          secondary={`From ${scene.directory}/`}
                        />
                        <VisibilityIcon />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <Box>
                <Button 
                  startIcon={<ArrowBackIcon />} 
                  onClick={() => setSelectedScene(null)}
                  sx={{ mb: 2 }}
                >
                  Back to Scenes List
                </Button>
                <Typography variant="h5" gutterBottom>{selectedScene.name}</Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ 
                  '& h1, & h2, & h3': { mt: 3, mb: 2 },
                  '& p': { mb: 1, lineHeight: 1.7 },
                  '& ul, & ol': { ml: 3, mb: 2 },
                  '& blockquote': { borderLeft: '4px solid #ddd', pl: 2, ml: 0, fontStyle: 'italic' },
                  '& hr': { my: 3 },
                }}>
                  <ReactMarkdown>{selectedScene.content}</ReactMarkdown>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Songs Tab */}
        {songs.length > 0 && activeTab === (script && script.found ? (scenes.length > 0 ? 3 : 2) : (scenes.length > 0 ? 2 : 1)) && (
          <Box>
            {!selectedSong ? (
              <Box>
                <Typography variant="h5" gutterBottom>Musical Numbers</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Click on any song to view complete lyrics and staging notes
                </Typography>
                <List>
                  {songs.map((song, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton onClick={() => setSelectedSong(song)}>
                        <MusicNoteIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <ListItemText 
                          primary={song.name}
                          secondary={`From ${song.directory}/`}
                        />
                        <VisibilityIcon />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <Box>
                <Button 
                  startIcon={<ArrowBackIcon />} 
                  onClick={() => setSelectedSong(null)}
                  sx={{ mb: 2 }}
                >
                  Back to Songs List
                </Button>
                <Typography variant="h5" gutterBottom>
                  <MusicNoteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {selectedSong.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ 
                  '& h1, & h2, & h3': { mt: 3, mb: 2, color: 'primary.main' },
                  '& p': { mb: 1, lineHeight: 1.7 },
                  '& ul, & ol': { ml: 3, mb: 2 },
                  '& blockquote': { borderLeft: '4px solid #667eea', pl: 2, ml: 0, fontStyle: 'italic' },
                  '& hr': { my: 3 },
                  '& em': { fontStyle: 'italic', color: 'text.secondary' },
                }}>
                  <ReactMarkdown>{selectedSong.content}</ReactMarkdown>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Characters Tab */}
        {characters.length > 0 && activeTab === (
          script && script.found 
            ? (scenes.length > 0 
              ? (songs.length > 0 ? 4 : 3) 
              : (songs.length > 0 ? 3 : 2))
            : (scenes.length > 0 
              ? (songs.length > 0 ? 3 : 2) 
              : (songs.length > 0 ? 2 : 1))
        ) && (
          <Box>
            {!selectedCharacter ? (
              <Box>
                <Typography variant="h5" gutterBottom>Characters</Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                  {characters.map((character, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton onClick={() => setSelectedCharacter(character)}>
                        <PersonIcon sx={{ mr: 2, color: 'secondary.main' }} />
                        <ListItemText 
                          primary={character.name}
                          secondary={character.isCollection ? 'Character Collection' : 'Individual Character Profile'}
                        />
                        <VisibilityIcon />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <Box>
                <Button 
                  startIcon={<ArrowBackIcon />} 
                  onClick={() => setSelectedCharacter(null)}
                  sx={{ mb: 2 }}
                >
                  Back to Characters List
                </Button>
                <Typography variant="h5" gutterBottom>
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {selectedCharacter.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ 
                  '& h1, & h2, & h3': { mt: 3, mb: 2 },
                  '& p': { mb: 1, lineHeight: 1.7 },
                  '& ul, & ol': { ml: 3, mb: 2 },
                  '& blockquote': { borderLeft: '4px solid #ddd', pl: 2, ml: 0, fontStyle: 'italic' },
                  '& hr': { my: 3 },
                }}>
                  <ReactMarkdown>{selectedCharacter.content}</ReactMarkdown>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Paper>
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
