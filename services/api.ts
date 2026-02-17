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

        // If the data is FormData, remove Content-Type header to let browser set it automatically
        // (browser will set multipart/form-data with correct boundary)
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
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
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized (Invalid Token)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear invalid token
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            // Remove Authorization header and retry
            delete originalRequest.headers['Authorization'];
            return api(originalRequest);
        }

        // Standardize error message extraction
        const data = error.response?.data;
        let message = 'An unexpected error occurred';

        if (data) {
            if (typeof data === 'string') {
                message = data;
            } else if (data.message) {
                message = data.message;
            } else if (data.detail) {
                message = data.detail;
            } else if (typeof data === 'object') {
                // Handle Django REST framework field-level errors: {"field": ["error msg"]}
                const fieldErrors = Object.entries(data)
                    .map(([key, value]) => {
                        const msgs = Array.isArray(value) ? value.join(', ') : String(value);
                        return `${key}: ${msgs}`;
                    })
                    .join('; ');
                if (fieldErrors) message = fieldErrors;
            }
        } else if (error.message) {
            message = error.message;
        }

        return Promise.reject(new Error(message));
    }
);

export default api;
