import api from '@/services/api';

export const shippingService = {
    /**
     * Get all shipping records
     */
    async getShippingRecords(params?: {
        limit?: number;
        offset?: number;
    }) {
        const response = await api.get('/api/v1/orders/shipping/', { params });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Create a new shipping record
     */
    async createShippingRecord(data: any) {
        const response = await api.post('/api/v1/orders/shipping/', data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Get shipping record by ID
     */
    async getShippingRecord(id: string | number) {
        const response = await api.get(`/api/v1/orders/shipping/${id}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Update shipping record (Full update)
     */
    async updateShippingRecord(id: string | number, data: any) {
        const response = await api.put(`/api/v1/orders/shipping/${id}/`, data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Update shipping record (Partial update)
     */
    async patchShippingRecord(id: string | number, data: any) {
        const response = await api.patch(`/api/v1/orders/shipping/${id}/`, data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Delete shipping record
     */
    async deleteShippingRecord(id: string | number) {
        const response = await api.delete(`/api/v1/orders/shipping/${id}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    }
};
