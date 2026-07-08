import axios from 'axios';

const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';

export const api = axios.create({
  baseURL: `${apiURL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
  },
  timeout: 10000, // 10 seconds timeout
});

// Response interceptor to extract the standard .data payload from API success envelopes
api.interceptors.response.use(
  (response) => {
    // If the response follows the { success: true, data: ... } structure, return the inner data
    if (response.data && typeof response.data === 'object' && !(response.data instanceof Blob) && 'success' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // Pass along the backend validation details or base message if available
    const errorData = error.response?.data;
    if (errorData?.error) {
      return Promise.reject(errorData.error);
    }
    return Promise.reject({
      code: 'NETWORK_ERROR',
      message: error.message || 'An unexpected networking error occurred',
    });
  }
);
