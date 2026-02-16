import api from '@/services/api';

export const returnsService = {
    /**
     * Get user's returns
     */
    async getReturns() {
        const response = await api.get('/api/v1/orders/returns/');
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Create a new return request
     */
    async createReturn(returnData: {
        order: string | number;
        reason: string;
        detailed_reason: string;
        requested_refund_amount: number;
    }) {
        const response = await api.post('/api/v1/orders/returns/', returnData);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Get return details by ID
     */
    async getReturn(returnId: string | number) {
        const response = await api.get(`/api/v1/orders/returns/${returnId}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Cancel a return request
     */
    async cancelReturn(returnId: string | number) {
        const response = await api.patch(`/api/v1/orders/returns/${returnId}/`, {
            status: 'CANCELLED'
        });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Get user's refunds
     */
    async getRefunds() {
        const response = await api.get('/api/v1/orders/refunds/');
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Get refund details by ID
     */
    async getRefund(refundId: string | number) {
        const response = await api.get(`/api/v1/orders/refunds/${refundId}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    }
};
