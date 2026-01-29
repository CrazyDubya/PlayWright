import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  ButtonGroup,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import PersonIcon from '@mui/icons-material/Person';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

export default function CanvasWorkspace() {
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [toolsPanelOpen] = useState(true);
  const [selectedTool, setSelectedTool] = useState('select');
  const [elements, setElements] = useState([]);
  const [zoom, setZoom] = useState(1);

  const drawGrid = useCallback((ctx, width, height) => {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    const gridSize = 20 * zoom;

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [zoom]);

  const drawCharacter = useCallback((ctx, element) => {
    // Draw circle for character
    ctx.fillStyle = element.color || '#667eea';
    ctx.beginPath();
    ctx.arc(element.x, element.y, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(element.label || 'Character', element.x, element.y);
  }, []);

  const drawScene = useCallback((ctx, element) => {
    // Draw rectangle for scene
    ctx.fillStyle = element.color || '#764ba2';
    ctx.fillRect(element.x - 40, element.y - 25, 80, 50);
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(element.label || 'Scene', element.x, element.y);
  }, []);

  const drawRelationship = useCallback((ctx, element) => {
    // Draw line for relationship
    ctx.strokeStyle = element.color || '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(element.x1, element.y1);
    ctx.lineTo(element.x2, element.y2);
    ctx.stroke();
  }, []);

  const drawArc = useCallback((ctx, element) => {
    // Draw arc for story progression
    ctx.strokeStyle = element.color || '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(element.x, element.y, element.radius || 50, 0, Math.PI * 2);
    ctx.stroke();
  }, []);

  const drawElement = useCallback((ctx, element) => {
    ctx.save();
    ctx.scale(zoom, zoom);

    switch (element.type) {
      case 'character':
        drawCharacter(ctx, element);
        break;
      case 'scene':
        drawScene(ctx, element);
        break;
      case 'relationship':
        drawRelationship(ctx, element);
        break;
      case 'arc':
        drawArc(ctx, element);
        break;
      default:
        break;
    }

    ctx.restore();
  }, [zoom, drawCharacter, drawScene, drawRelationship, drawArc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up grid
    drawGrid(ctx, canvas.width, canvas.height);

    // Draw elements
    elements.forEach(element => {
      drawElement(ctx, element);
    });
  }, [elements, zoom, drawGrid, drawElement]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (selectedTool === 'character') {
      addElement({
        type: 'character',
        x,
        y,
        label: `Character ${elements.length + 1}`,
        color: '#667eea',
      });
    } else if (selectedTool === 'scene') {
      addElement({
        type: 'scene',
        x,
        y,
        label: `Scene ${elements.length + 1}`,
        color: '#ec4899',
      });
    }
  };

  const addElement = (element) => {
    setElements([...elements, { ...element, id: Date.now() }]);
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.5));

  const canvasTabs = [
    { label: 'Character Map', icon: <PersonIcon /> },
    { label: 'Story Timeline', icon: <TimelineIcon /> },
    { label: 'Relationship Web', icon: <AccountTreeIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
      {/* Tools Panel */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={toolsPanelOpen}
        sx={{
          width: 280,
          '& .MuiDrawer-paper': {
            width: 280,
            position: 'relative',
            borderRight: '1px solid #e5e7eb',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Tools
          </Typography>

          <ButtonGroup orientation="vertical" fullWidth sx={{ mb: 2 }}>
            <Button
              variant={selectedTool === 'select' ? 'contained' : 'outlined'}
              onClick={() => setSelectedTool('select')}
            >
              Select
            </Button>
            <Button
              variant={selectedTool === 'character' ? 'contained' : 'outlined'}
              onClick={() => setSelectedTool('character')}
              startIcon={<PersonIcon />}
            >
              Add Character
            </Button>
            <Button
              variant={selectedTool === 'scene' ? 'contained' : 'outlined'}
              onClick={() => setSelectedTool('scene')}
            >
              Add Scene
            </Button>
            <Button
              variant={selectedTool === 'relationship' ? 'contained' : 'outlined'}
              onClick={() => setSelectedTool('relationship')}
            >
              Add Connection
            </Button>
          </ButtonGroup>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Elements ({elements.length})
          </Typography>

          <List dense>
            {elements.map((element, index) => (
              <ListItem
                key={element.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => setElements(elements.filter(e => e.id !== element.id))}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  {element.type === 'character' && <PersonIcon />}
                  {element.type === 'scene' && <TimelineIcon />}
                </ListItemIcon>
                <ListItemText primary={element.label} secondary={element.type} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Canvas Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Paper sx={{ p: 2, mb: 1, borderRadius: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              <BrushIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Canvas Workspace
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={handleZoomOut}><ZoomOutIcon /></IconButton>
              <Chip label={`${Math.round(zoom * 100)}%`} />
              <IconButton onClick={handleZoomIn}><ZoomInIcon /></IconButton>
              <IconButton><UndoIcon /></IconButton>
              <IconButton><RedoIcon /></IconButton>
              <Button variant="contained" startIcon={<SaveIcon />}>
                Save
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Tabs */}
        <Paper sx={{ borderRadius: 0 }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
            {canvasTabs.map((tab, index) => (
              <Tab key={index} icon={tab.icon} label={tab.label} iconPosition="start" />
            ))}
          </Tabs>
        </Paper>

        {/* Canvas */}
        <Box
          sx={{
            flexGrow: 1,
            position: 'relative',
            overflow: 'auto',
            backgroundColor: '#f8fafc',
          }}
        >
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{
              width: '100%',
              height: '100%',
              cursor: selectedTool === 'select' ? 'default' : 'crosshair',
            }}
          />

          {/* Help Overlay */}
          {elements.length === 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <BrushIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Click on the canvas to add elements
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use the tools panel on the left to select what to add
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
