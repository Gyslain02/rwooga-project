import api from '@/services/api';

export const mediaService = {
    /**
     * Get all media (optionally filtered by product)
     */
    async getMedia(params?: {
        product?: string | number;
        limit?: number;
        offset?: number;
    }) {
        const response = await api.get('/api/v1/products/media/', { params });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Upload new media
     */
    async createMedia(formData: FormData) {
        const response = await api.post('/api/v1/products/media/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Get media by ID
     */
    async getMediaById(id: string | number) {
        const response = await api.get(`/api/v1/products/media/${id}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Update media
     */
    async updateMedia(id: string | number, formData: FormData) {
        const response = await api.patch(`/api/v1/products/media/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Delete media
     */
    async deleteMedia(id: string | number) {
        const response = await api.delete(`/api/v1/products/media/${id}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    }
};
