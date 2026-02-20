import React, { useState } from 'react';
import { CreditCard, Loader2, AlertCircle, Calendar, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentsService } from '@/services/paymentsService';
import { momoService } from '@/services/momoService';

interface CardPaymentProps {
  amount: number;
  orderId: string | number;
  customerName: string;
  customerEmail?: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const CardPayment: React.FC<CardPaymentProps> = ({
  amount,
  orderId,
  customerName,
  customerEmail,
  onSuccess,
  onError,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: customerName || ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Basic formatting
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').substring(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2);
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Use the generic payment endpoint but with card method
      // Note: We're reusing momoService.initiatePayment but passing extra data
      // In a real app we might want a separate service or update the type definition
      const response = await paymentsService.initiateCardPayment({
        amount,
        currency: 'RWF',
        phone_number: '',
        reference: momoService.generateReference(),
        order: orderId,
        customerName: formData.cardName,
        customerEmail,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryDate: formData.expiryDate,
        cvv: formData.cvv
      });

      if (response.ok && response.data) {
        // Simulate card 3D secure or immediate success
        // For now, we'll assume immediate success or pending status
        if (response.data.status === 'successful') {
          onSuccess(response.data.transactionId);
        } else {
          // If pending, we might poll, but for card usually it's faster. 
          // Let's reuse the polling logic or just wait a bit.
          // For this simulation, let's assume we need to poll like MoMo
          pollStatus(response.data.transactionId);
        }
      } else {
        throw new Error('Payment failed');
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
      setIsProcessing(false);
    }
  };

  const pollStatus = async (transactionId: string) => {
    // Simple polling for demo
    let attempts = 0;
    const maxAttempts = 10;

    const check = async () => {
      try {
        const res = await paymentsService.getPaymentStatus(transactionId);
        if (res.ok && res.data?.status === 'successful') {
          onSuccess(transactionId);
        } else if (res.ok && res.data?.status === 'failed') {
          setError('Payment failed');
          setIsProcessing(false);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(check, 2000);
        } else {
          setError('Payment timed out');
          setIsProcessing(false);
        }
      } catch (e) {
        setError('Connection error');
        setIsProcessing(false);
      }
    };

    check();
  };

  return (
    <div className="bg-white rounded-2xl p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Card Payment</h3>
        <p className="text-gray-600">Secure payment via Debit/Credit Card</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
        <p className="text-sm text-gray-600">Amount to Pay</p>
        <p className="text-3xl font-bold text-gray-900">RWF {amount.toLocaleString()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="0000 0000 0000 0000"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
          <input
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardPayment;
