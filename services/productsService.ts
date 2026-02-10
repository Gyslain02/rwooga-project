import api from '@/services/api';

export const productsService = {
    async getProducts(params?: {
        category?: string;
        published?: boolean;
        min_price?: number;
        max_price?: number;
        search?: string;
        ordering?: string;
    }) {
        const response = await api.get('/products/products/', { params });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async getProduct(id: string | number) {
        const response = await api.get(`/products/products/${id}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async getCategories() {
        const response = await api.get('/products/categories/');
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async getProductMedia(productId: string | number) {
        const response = await api.get('/products/media/', {
            params: { product: productId }
        });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async getProductFeedback(productId: string | number) {
        const response = await api.get('/products/feedback/', {
            params: { product: productId }
        });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    async createFeedback(data: {
        product: number;
        rating: number;
        comment: string;
    }, token: string) {
        // The token is now automatically handled by the interceptor in api.ts
        // but we can still pass it explicitly if needed, or rely on the interceptor.
        const response = await api.post('/products/feedback/', data);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    }
};
