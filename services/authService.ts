
import { API_BASE_URL } from '../constants';

const handleResponse = async (response: Response): Promise<{ ok: boolean, status: number, data: any }> => {

    return {
        ok: response.ok,
        status: response.status,
        data: await response.json()
    };
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
        const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
            method: 'POST', // Or POST, but usually GET for direct links. Keeping it flexible.
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token }), // Some APIs expect data in the body even for verification links
        });
        return handleResponse(response);
    },

    async checkEmailExists(email: string) {
        const response = await fetch(`${API_BASE_URL}/auth/check-email/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return handleResponse(response);
    }
};
