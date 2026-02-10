import api from '@/services/api';

export const userService = {
    async getUsers(page = 1, search = '') {
        return api.get('/user/', {
            params: { page, search }
        });
    },

    async createUser(userData: any) {
        return api.post('/user/', userData);
    },

    async updateUser(id: string | number, userData: any) {
        return api.patch(`/user/${id}/`, userData);
    },

    async deleteUser(id: string | number) {
        return api.delete(`/user/${id}/`);
    },

    async activateUser(id: string | number) {
        return api.post(`/user/${id}/activate/`, {});
    },

    async deactivateUser(id: string | number) {
        return api.post(`/user/${id}/deactivate/`, {});
    }
};
