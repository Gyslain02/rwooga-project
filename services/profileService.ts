import api from '@/services/api';

export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    phone_number: number;
    user_type: 'STAFF' | 'ADMIN' | 'CUSTOMER';
    is_active: boolean;
    is_admin: string;
    is_staff: boolean;
    date_joined: string;
    updated_at: string;
}

export interface UpdateProfileData {
    full_name?: string;
    phone_number?: number;
}

export interface ChangePasswordData {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
}

export interface EmailChangeRequestData {
    new_email: string;
    password: string;
}

export interface EmailChangeConfirmData {
    new_email: string;
    code: string;
}

export const profileService = {
    async getProfile() {
        const response = await api.get<UserProfile>('/profile/me/');
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async updateProfile(data: UpdateProfileData) {
        const response = await api.patch('/profile/update_profile/', data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async changePassword(data: ChangePasswordData) {
        const response = await api.post('/profile/change_password/', data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async emailChangeRequest(data: EmailChangeRequestData) {
        const response = await api.post('/profile/email_change_request/', data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async emailChangeConfirm(data: EmailChangeConfirmData) {
        const response = await api.post('/profile/email_change_confirm/', data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async resendEmailChangeCode(data: { new_email: string; password: string }) {
        const response = await api.post('/profile/resend_email_change_code/', data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async deleteAccount(id: string) {
        const response = await api.delete(`/user/${id}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    }
};
