import api from './api';

export const customRequestService = {
    async createCustomRequest(data: FormData) {
        // Since we are sending files, we use FormData and the interceptor handles the rest
        const response = await api.post('/api/v1/products/custom-requests/', data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async getCustomRequests(params?: {
        ordering?: string;
        page?: number;
        search?: string;
    }) {
        const response = await api.get('/api/v1/products/custom-requests/', { params });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async getCustomRequest(id: string | number) {
        const response = await api.get(`/api/v1/products/custom-requests/${id}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async updateCustomStatus(id: string | number, status: string) {
        const response = await api.patch(`/api/v1/products/custom-requests/${id}/`, { status });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async updateCustomRequest(id: string | number, data: any) {
        const response = await api.patch(`/api/v1/products/custom-requests/${id}/`, data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async deleteCustomRequest(id: string | number) {
        const response = await api.delete(`/api/v1/products/custom-requests/${id}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    }
};
