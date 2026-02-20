import api from '@/services/api';

export interface ShippingPayload {
    order: number;
    shipping_fee?: number | string;
    shipping_phone?: string;
    district?: string;
    sector?: string;
    street_address?: string;
}

export const shippingService = {
    /**
     * GET /api/v1/orders/shipping/ — List all shipping records
     */
    async getShippingRecords(params?: { limit?: number; offset?: number }) {
        const response = await api.get('/api/v1/orders/shipping/', { params });
        return { ok: true, status: response.status, data: response.data };
    },

    /**
     * POST /api/v1/orders/shipping/ — Create a new shipping record
     */
    async createShippingRecord(data: ShippingPayload) {
        const response = await api.post('/api/v1/orders/shipping/', data);
        return { ok: true, status: response.status, data: response.data };
    },

    /**
     * GET /api/v1/orders/shipping/{id}/ — Get shipping record by ID
     */
    async getShippingRecord(id: string | number) {
        const response = await api.get(`/api/v1/orders/shipping/${id}/`);
        return { ok: true, status: response.status, data: response.data };
    },

    /**
     * PUT /api/v1/orders/shipping/{id}/ — Full update
     */
    async updateShippingRecord(id: string | number, data: ShippingPayload) {
        const response = await api.put(`/api/v1/orders/shipping/${id}/`, data);
        return { ok: true, status: response.status, data: response.data };
    },

    /**
     * PATCH /api/v1/orders/shipping/{id}/ — Partial update
     */
    async patchShippingRecord(id: string | number, data: Partial<ShippingPayload>) {
        const response = await api.patch(`/api/v1/orders/shipping/${id}/`, data);
        return { ok: true, status: response.status, data: response.data };
    },

    /**
     * DELETE /api/v1/orders/shipping/{id}/ — Delete shipping record
     */
    async deleteShippingRecord(id: string | number) {
        const response = await api.delete(`/api/v1/orders/shipping/${id}/`);
        return { ok: true, status: response.status, data: response.data };
    },
};
