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

        if (config.data instanceof FormData) {
            // Remove Content-Type to let the browser set it with the boundary
            if (config.headers?.set) {
                config.headers.set('Content-Type', undefined);
                // Also common to delete it to be sure
                try { delete (config.headers as any)['Content-Type']; } catch (e) { }
            } else if (config.headers) {
                delete config.headers['Content-Type'];
                delete config.headers['content-type'];
            }
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

            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    // Try to refresh the token
                    // Create a new axios instance for refresh to avoid infinite loops
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh_token/`, {
                        refresh: refreshToken
                    });

                    if (response.status === 200) {
                        const { access } = response.data;
                        localStorage.setItem('access_token', access);

                        // Update the original request header
                        originalRequest.headers['Authorization'] = `Bearer ${access}`;

                        // Update the global instance defaults
                        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                }
            }

            // If no refresh token or refresh failed, clear tokens and reject
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');

            // Redirect to login page
            window.location.href = '/login';

            return Promise.reject(error);
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
