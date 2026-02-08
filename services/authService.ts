
import { API_BASE_URL } from '../constants';

const handleResponse = async (response: Response) => {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        // Extract error message from various possible API error formats
        const error = (data && (data.message || data.detail || (typeof data === 'string' ? data : JSON.stringify(data)))) || response.statusText;
        throw new Error(error);
    }

    return {
        ok: true,
        status: response.status,
        data: data
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

    async verifyEmail(token: string) {
        const response = await fetch(`${API_BASE_URL}/auth/verify_email/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
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
    },

    async resendVerification(email: string) {
        const response = await fetch(`${API_BASE_URL}/auth/resend_verification/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return handleResponse(response);
    }
};
