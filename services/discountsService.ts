import api from '@/services/api';

export const discountsService = {
    /**
     * Get all discounts
     */
    async getDiscounts(params?: {
        limit?: number;
        offset?: number;
    }) {
        const response = await api.get('/api/v1/products/product-discounts/', { params });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Create a new discount
     */
    async createDiscount(data: any) {
        const response = await api.post('/api/v1/products/product-discounts/', data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Get discount by ID
     */
    async getDiscount(id: string | number) {
        const response = await api.get(`/api/v1/products/product-discounts/${id}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Update discount (Full update)
     */
    async updateDiscount(id: string | number, data: any) {
        const response = await api.put(`/api/v1/products/product-discounts/${id}/`, data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Update discount (Partial update)
     */
    async patchDiscount(id: string | number, data: any) {
        const response = await api.patch(`/api/v1/products/product-discounts/${id}/`, data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Delete discount
     */
    async deleteDiscount(id: string | number) {
        const response = await api.delete(`/api/v1/products/product-discounts/${id}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    }
};
