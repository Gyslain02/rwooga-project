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
    },

    /**
     * Create a new refund
     */
    async createRefund(refundData: {
        order: string | number;
        amount: number;
        reason: string;
        transaction_id?: string;
    }) {
        const response = await api.post('/api/v1/orders/refunds/', refundData);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Update a refund request
     */
    async updateRefund(refundId: string | number, refundData: Partial<{
        amount: number;
        reason: string;
        status: string;
    }>) {
        const response = await api.patch(`/api/v1/orders/refunds/${refundId}/`, refundData);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Delete a refund request
     */
    async deleteRefund(refundId: string | number) {
        const response = await api.delete(`/api/v1/orders/refunds/${refundId}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Mark a refund as completed
     */
    async completeRefund(refundId: string | number) {
        const response = await api.post(`/api/v1/orders/refunds/${refundId}/complete/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Mark a refund as failed
     */
    async failRefund(refundId: string | number) {
        const response = await api.post(`/api/v1/orders/refunds/${refundId}/fail/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Approve a return request
     */
    async approveReturn(returnId: string | number) {
        const response = await api.post(`/api/v1/orders/returns/${returnId}/approve/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Reject a return request
     */
    async rejectReturn(returnId: string | number, rejection_reason?: string) {
        const response = await api.post(`/api/v1/orders/returns/${returnId}/reject/`, { rejection_reason });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Mark a return as completed
     */
    async completeReturn(returnId: string | number) {
        const response = await api.post(`/api/v1/orders/returns/${returnId}/complete/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Cancel a return request (admin/system)
     */
    async cancelReturnRequest(returnId: string | number) {
        const response = await api.post(`/api/v1/orders/returns/${returnId}/cancel_return/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    }
};
