import api from './api';

export interface MomoPaymentRequest {
  amount: number;
  currency: string;
  phoneNumber: string;
  reference: string;
  customerName: string;
  customerEmail?: string;
  paymentMethod?: 'momo' | 'card';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface MomoPaymentResponse {
  transactionId: string;
  status: 'pending' | 'successful' | 'failed';
  message: string;
  paymentUrl?: string;
}

export const momoService = {
  /**
   * Initiate MTN Mobile Money payment
   */
  async initiatePayment(paymentData: MomoPaymentRequest): Promise<{ ok: boolean; data?: MomoPaymentResponse; error?: string }> {
    try {
      const response = await api.post('/api/v1/payments/momo/initiate/', {
        ...paymentData,
        provider: 'mtn_rwanda',
        callback_url: `${window.location.origin}/payment/callback`
      });

      return {
        ok: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('MTN Momo payment initiation error:', error);
      return {
        ok: false,
        error: error.response?.data?.message || error.message || 'Failed to initiate payment'
      };
    }
  },

  /**
   * Check payment status
   */
  async checkPaymentStatus(transactionId: string): Promise<{ ok: boolean; data?: any; error?: string }> {
    try {
      const response = await api.get(`/api/v1/payments/momo/status/${transactionId}/`);
      return {
        ok: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Payment status check error:', error);
      return {
        ok: false,
        error: error.response?.data?.message || error.message || 'Failed to check payment status'
      };
    }
  },

  /**
   * Validate phone number for MTN Rwanda
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // MTN Rwanda numbers: 0788xxxxxx, 0789xxxxxx
    const mtnRegex = /^(0788|0789)\d{6}$/;
    return mtnRegex.test(phoneNumber.replace(/\s/g, ''));
  },

  /**
   * Format phone number for MTN API
   */
  formatPhoneNumber(phoneNumber: string): string {
    // Remove spaces and ensure proper format
    const cleaned = phoneNumber.replace(/\s/g, '');
    // Paypack API seems to prefer 07... format as confirmed by test_payment.py
    return cleaned;
  },

  /**
   * Generate unique transaction reference
   */
  generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `MOMO_${timestamp}_${random}`;
  }
};
