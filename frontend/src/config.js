const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const API_BASE_URL = `http://${hostname}:5000`;
