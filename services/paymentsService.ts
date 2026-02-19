import api from '@/services/api';

export const paymentsService = {
    /**
     * Get all payment records
     */
    async getPayments(params?: {
        limit?: number;
        offset?: number;
    }) {
        const response = await api.get('/api/v1/payments/payments/', { params });
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Get payment details by ID
     */
    async getPayment(id: string | number) {
        const response = await api.get(`/api/v1/payments/payments/${id}/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Cancel a payment
     */
    async cancelPayment(id: string | number) {
        const response = await api.post(`/api/v1/payments/payments/${id}/cancel/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Get payment status
     */
    async getPaymentStatus(id: string | number) {
        const response = await api.get(`/api/v1/payments/payments/${id}/status/`);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Initiate Card Payment
     */
    async initiateCardPayment(paymentData: {
        amount: number;
        currency: string;
        phoneNumber: string;
        reference: string;
        customerName: string;
        customerEmail?: string;
        cardNumber: string;
        expiryDate: string;
        cvv: string;
    }) {
        const response = await api.post('/api/v1/payments/payments/initiate-card/', paymentData);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    },

    /**
     * Initiate Momo Payment
     */
    async initiateMomoPayment(paymentData: {
        amount: number;
        currency: string;
        phoneNumber: string;
        reference: string;
        customerName: string;
        customerEmail?: string;
    }) {
        const response = await api.post('/api/v1/payments/payments/initiate-momo/', paymentData);
        return {
            ok: true,
            status: response.status,
            data: response.data
        };
    }
};
