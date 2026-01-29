import axios from 'axios';

/**
 * API Client that works in both development (with backend) and production (static files)
 * 
 * In development: Uses axios to call the Express backend
 * In production (GitHub Pages): Reads from static JSON files
 */

// Determine if we're in static mode (GitHub Pages) or API mode (local development)
const isStaticMode = () => {
  // Check if we're on GitHub Pages or if the API endpoint is not available
  return process.env.REACT_APP_STATIC_MODE === 'true' || 
         window.location.hostname.includes('github.io');
};

// Fetch with fallback to static files
const fetchWithFallback = async (apiPath, staticPath) => {
  if (isStaticMode()) {
    // Fetch from static JSON files
    const response = await fetch(staticPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${staticPath}`);
    }
    return await response.json();
  } else {
    // Use axios to call the backend API
    const response = await axios.get(apiPath);
    return response.data;
  }
};

// API Client object
const apiClient = {
  // Get all projects
  getProjects: async () => {
    return fetchWithFallback('/api/projects', '/api/projects.json');
  },

  // Get project details
  getProjectDetails: async (projectId) => {
    return fetchWithFallback(
      `/api/projects/${projectId}/details`,
      `/api/projects/${projectId}-details.json`
    );
  },

  // Get project script
  getProjectScript: async (projectId) => {
    return fetchWithFallback(
      `/api/projects/${projectId}/script`,
      `/api/projects/${projectId}-script.json`
    );
  },

  // Get project scenes
  getProjectScenes: async (projectId) => {
    return fetchWithFallback(
      `/api/projects/${projectId}/scenes`,
      `/api/projects/${projectId}-scenes.json`
    );
  },

  // Get project songs
  getProjectSongs: async (projectId) => {
    return fetchWithFallback(
      `/api/projects/${projectId}/songs`,
      `/api/projects/${projectId}-songs.json`
    );
  },

  // Get project characters
  getProjectCharacters: async (projectId) => {
    return fetchWithFallback(
      `/api/projects/${projectId}/characters`,
      `/api/projects/${projectId}-characters.json`
    );
  },

  // Create project (only works in API mode)
  createProject: async (name) => {
    if (isStaticMode()) {
      throw new Error('Creating projects is not available in static mode. Please run the app locally.');
    }
    return await axios.post('/api/projects/create', { name });
  },
};

export default apiClient;
