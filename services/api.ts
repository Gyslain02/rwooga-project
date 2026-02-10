import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the access token in all requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for easier error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Standardize error message extraction
        const message = error.response?.data?.message ||
            error.response?.data?.detail ||
            error.message ||
            'An unexpected error occurred';

        // You can also handle 401 Unauthorized globally here if needed
        // e.g., redirect to login or refresh token

        return Promise.reject(new Error(message));
    }
);

export default api;
