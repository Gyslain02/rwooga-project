import api from '@/services/api';

export const authService = {
    async login(credentials: any) {
        const response = await api.post('/auth/login/', credentials);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async register(userData: any) {
        const response = await api.post('/auth/register/', userData);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async logout(refreshToken: string) {
        const response = await api.post('/auth/logout/', { refresh: refreshToken });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async refreshToken(refresh: string) {
        const response = await api.post('/auth/refresh_token/', { refresh });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async requestPasswordReset(email: string) {
        const response = await api.post('/auth/password_reset_request/', { email });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async confirmPasswordReset(data: any) {
        const response = await api.post('/auth/password_reset_confirm/', data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async verifyEmail(email: string, code: string) {
        const response = await api.post('/auth/verify_email/', { email, code });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async checkEmailExists(email: string) {
        const response = await api.post('/auth/check-email/', { email });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async resendVerification(email: string) {
        const response = await api.post('/auth/resend_verification/', { email });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    }
};
