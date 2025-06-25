import axios from 'axios';

// Use environment variable for API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      // Redirect to login if needed
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  // Update user activity (points, streak, last_activity_date)
  updateActivity: async (points) => {
    const response = await api.post('/api/auth/update-activity', { points });
    return response.data;
  },

  // Get completed tasks
  getCompletedTasks: async () => {
    const response = await api.get('/api/auth/completed-tasks');
    return response.data;
  },

  // Update completed tasks
  updateCompletedTasks: async (completedTasks) => {
    const response = await api.post('/api/auth/completed-tasks', { completed_tasks: completedTasks });
    return response.data;
  },

  // Add mood entry
  addMoodEntry: async (mood, note) => {
    const response = await api.post('/api/auth/mood', { mood, note });
    return response.data;
  },

  // Get mood history
  getMoodHistory: async (limit = 30) => {
    const response = await api.get(`/api/auth/mood?limit=${limit}`);
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async () => {
    const response = await api.get('/api/auth/leaderboard');
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api; 