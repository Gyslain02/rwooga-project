import api from '@/services/api';

export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    phone_number: string;
    is_admin: boolean;
    is_staff: boolean;
    date_joined: string;
    updated_at: string;
}

export interface UpdateProfileData {
    full_name?: string;
    phone_number?: string;
}

export interface ChangePasswordData {
    old_password: string;
    new_password: string;
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
    }
};
