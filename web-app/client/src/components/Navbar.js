import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

export default function Navbar({ toggleSidebar }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <TheaterComedyIcon sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
          PlayWright
        </Typography>
        <Chip
          label="GUI v1.0"
          size="small"
          sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 600,
          }}
        />
      </Toolbar>
    </AppBar>
  );
}
