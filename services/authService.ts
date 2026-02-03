
import { API_BASE_URL } from '../constants';

const handleResponse = async (response: Response) => {
    let data;
    const contentType = response.headers.get("content-type");

    try {
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            data = { message: text || `Server responded with ${response.status}` };
        }
    } catch (e) {
        data = { message: "Could not parse response" };
    }

    if (!response.ok) {
        console.error(`API Error [${response.status}]:`, data);

        // Extract better error messages from potentially nested objects
        let errorMessage = "Something went wrong";
        if (typeof data === 'object') {
            // Check common Django/Django-Rest-Framework error structures
            const firstKey = Object.keys(data)[0];
            const firstValue = data[firstKey];

            if (data.message) errorMessage = data.message;
            else if (data.detail) errorMessage = data.detail;
            else if (data.error) errorMessage = data.error;
            else if (Array.isArray(firstValue)) errorMessage = `${firstValue[0]}`;
            else if (typeof firstValue === 'string') errorMessage = firstValue;
        }

        throw new Error(errorMessage);
    }
    return data;
};

export const authService = {
    async login(credentials: any) {
        const response = await fetch(`${API_BASE_URL}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return handleResponse(response);
    },

    async register(userData: any) {
        const response = await fetch(`${API_BASE_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },

    async logout(refreshToken: string) {
        const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });
        return handleResponse(response);
    },

    async refreshToken(refresh: string) {
        const response = await fetch(`${API_BASE_URL}/auth/refresh_token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh }),
        });
        return handleResponse(response);
    },

    async requestPasswordReset(email: string) {
        const response = await fetch(`${API_BASE_URL}/auth/password_reset_request/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return handleResponse(response);
    },

    async confirmPasswordReset(data: any) {
        const response = await fetch(`${API_BASE_URL}/auth/password_reset_confirm/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    async verifyEmail(email: string, token: string) {
        const response = await fetch(`${API_BASE_URL}/auth/verify_email/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token }),
        });
        return handleResponse(response);
    }
};
