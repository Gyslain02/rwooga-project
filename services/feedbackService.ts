import api from '@/services/api';

export const feedbackService = {
    /**
     * Get all feedback (optionally filtered by product or status)
     */
    async getFeedbacks(params?: {
        product?: string | number;
        status?: 'PENDING' | 'APPROVED' | 'REJECTED';
        limit?: number;
        offset?: number;
    }) {
        const response = await api.get('/api/v1/products/feedback/', { params });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Submit new feedback
     */
    async createFeedback(data: {
        product: number;
        rating: number;
        comment: string;
        client_name?: string;
    }) {
        const response = await api.post('/api/v1/products/feedback/', data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Get feedback by ID
     */
    async getFeedback(id: string | number) {
        const response = await api.get(`/api/v1/products/feedback/${id}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Update feedback (Full update)
     */
    async updateFeedback(id: string | number, data: any) {
        const response = await api.put(`/api/v1/products/feedback/${id}/`, data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Update feedback (Partial update)
     */
    async patchFeedback(id: string | number, data: any) {
        const response = await api.patch(`/api/v1/products/feedback/${id}/`, data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Delete feedback
     */
    async deleteFeedback(id: string | number) {
        const response = await api.delete(`/api/v1/products/feedback/${id}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Moderate feedback (Approve/Reject)
     */
    async moderateFeedback(id: string | number, moderationData: {
        status: 'APPROVED' | 'REJECTED';
        moderation_comment?: string;
    }) {
        const response = await api.post(`/api/v1/products/feedback/${id}/moderate/`, moderationData);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    }
};
