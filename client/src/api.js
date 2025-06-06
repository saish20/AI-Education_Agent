import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/chat';

// Get all personas
export const getPersonas = () => {
  return axios.get(`${API_BASE}/personas`);
};

// Create a new chat session
export const createSession = (persona_id) => {
  return axios.post(`${API_BASE}/session`, { persona_id });
};

// Send a message and get the agent's response
export const sendMessage = (session_id, user_input) => {
  return axios.post(`${API_BASE}`, { session_id, user_input });
};

// Get message history for a specific session
export const getHistory = (session_id) => {
  return axios.get(`${API_BASE}/${session_id}/history`);
};

// Get metadata for a single session (e.g. to find persona_id)
export const getSessionMetadata = (id) => {
  return axios.get(`${API_BASE}/session/${id}`);
};

// Get all sessions (to display sidebar chat history)
export const getSessions = () => {
  return axios.get(`${API_BASE}/sessions`);
};
