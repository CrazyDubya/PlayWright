import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ConceptGenerator from './pages/ConceptGenerator';
import ProjectManager from './pages/ProjectManager';
import TemplateEditor from './pages/TemplateEditor';
import ValidationDashboard from './pages/ValidationDashboard';
import CanvasWorkspace from './pages/CanvasWorkspace';
import Documentation from './pages/Documentation';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#ec4899',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const drawerWidth = 260;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar open={sidebarOpen} drawerWidth={drawerWidth} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            ml: sidebarOpen ? 0 : `-${drawerWidth}px`,
            transition: theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            width: '100%',
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/concept-generator" element={<ConceptGenerator />} />
            <Route path="/projects/*" element={<ProjectManager />} />
            <Route path="/templates/*" element={<TemplateEditor />} />
            <Route path="/validation" element={<ValidationDashboard />} />
            <Route path="/canvas" element={<CanvasWorkspace />} />
            <Route path="/documentation/*" element={<Documentation />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
