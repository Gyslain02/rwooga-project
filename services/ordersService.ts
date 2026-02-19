import api from '@/services/api';

export const ordersService = {
    /**
     * Get user's orders
     */
    async getOrders(params?: {
        status?: string;
        limit?: number;
        offset?: number;
    }) {
        const response = await api.get('/api/v1/orders/orders/', { params });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Get order details by ID
     */
    async getOrder(orderId: string | number) {
        const response = await api.get(`/api/v1/orders/orders/${orderId}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Create a new order
     */
    async createOrder(orderData: {
        items: Array<{
            product: string | number;
            quantity: number;
            price_at_purchase: number;
            product_name: string;
        }>;
        shipping_address: string;
        shipping_phone: number;
        customer_notes?: string;
        total_amount: number;
        shipping_fee?: number;
    }) {
        const response = await api.post('/api/v1/orders/orders/', orderData);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Request a return for an order
     */
    async createReturn(orderId: string | number, returnData: {
        reason: string;
        detailed_reason: string;
        requested_refund_amount: number;
    }) {
        const response = await api.post('/api/v1/orders/returns/', {
            order: orderId,
            ...returnData
        });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

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
     * Cancel an order
     */
    async cancelOrder(orderId: string | number) {
        const response = await api.post(`/api/v1/orders/orders/${orderId}/cancel/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    }
};
