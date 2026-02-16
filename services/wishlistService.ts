import api from '@/services/api';

export const wishlistService = {
    /**
     * Get user's wishlist items
     */
    async getWishlist() {
        const response = await api.get('/api/v1/products/wishlists/');
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Add product to wishlist
     */
    async addToWishlist(productId: string | number) {
        const response = await api.post('/api/v1/products/wishlists/toggle/', {
            product: productId
        });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Remove product from wishlist
     */
    async removeFromWishlist(productId: string | number) {
        // The toggle endpoint will remove if it exists
        const response = await api.post('/api/v1/products/wishlists/toggle/', {
            product: productId
        });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Clear all wishlist items
     */
    async clearWishlist() {
        const response = await api.delete('/api/v1/products/wishlists/clear/');
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Check if product is in wishlist
     */
    async isInWishlist(productId: string | number) {
        const response = await api.get('/api/v1/products/wishlists/', {
            params: { product: productId }
        });
        return {
            ok: true,
            status: response.status,
            data: response.data.length > 0
        };
    }
};
