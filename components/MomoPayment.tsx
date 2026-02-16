import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { momoService, MomoPaymentRequest, MomoPaymentResponse } from '@/services/momoService';

interface MomoPaymentProps {
  amount: number;
  customerName: string;
  customerEmail?: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const MomoPayment: React.FC<MomoPaymentProps> = ({
  amount,
  customerName,
  customerEmail,
  onSuccess,
  onError,
  onCancel
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [transactionId, setTransactionId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timeout
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (paymentStatus === 'pending' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && paymentStatus === 'pending') {
      handleTimeout();
    }

    return () => clearInterval(interval);
  }, [paymentStatus, timeLeft]);

  useEffect(() => {
    let statusCheckInterval: NodeJS.Timeout;
    if (paymentStatus === 'pending' && transactionId) {
      statusCheckInterval = setInterval(() => {
        checkPaymentStatus();
      }, 5000); // Check every 5 seconds
    }

    return () => clearInterval(statusCheckInterval);
  }, [paymentStatus, transactionId]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const validatePhone = (phone: string) => {
    if (!momoService.validatePhoneNumber(phone)) {
      setErrorMessage('Please enter a valid MTN Rwanda number (0788xxxxxx or 0789xxxxxx)');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handlePayment = async () => {
    if (!validatePhone(phoneNumber)) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('pending');

    const paymentData: MomoPaymentRequest = {
      amount,
      currency: 'RWF',
      phoneNumber: momoService.formatPhoneNumber(phoneNumber),
      reference: momoService.generateReference(),
      customerName,
      customerEmail
    };

    try {
      const response = await momoService.initiatePayment(paymentData);
      
      if (response.ok && response.data) {
        setTransactionId(response.data.transactionId);
        toast.success('Payment initiated! Please check your phone for MTN MoMo prompt.');
        
        // Reset timer for new payment
        setTimeLeft(300);
      } else {
        throw new Error(response.error || 'Failed to initiate payment');
      }
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      setPaymentStatus('error');
      setErrorMessage(error.message || 'Failed to initiate payment. Please try again.');
      onError(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!transactionId) return;

    try {
      console.log('Checking payment status for:', transactionId);
      const response = await momoService.checkPaymentStatus(transactionId);
      console.log('Payment status response:', response);
      
      if (response.ok && response.data) {
        const status = response.data.status;
        console.log('Payment status:', status);
        
        if (status === 'successful') {
          setPaymentStatus('success');
          onSuccess(transactionId);
          toast.success('Payment successful! 🎉');
        } else if (status === 'failed') {
          setPaymentStatus('error');
          setErrorMessage('Payment failed. Please try again.');
          onError('Payment failed');
        }
      }
    } catch (error) {
      console.error('Status check error:', error);
    }
  };

  const handleTimeout = () => {
    setPaymentStatus('error');
    setErrorMessage('Payment timed out. Please try again.');
    onError('Payment timed out');
  };

  const handleRetry = () => {
    setIsRetrying(true);
    setPaymentStatus('idle');
    setTransactionId('');
    setTimeLeft(300);
    setErrorMessage('');
    setIsRetrying(false);
  };

  const handleCancel = () => {
    if (paymentStatus === 'pending') {
      // You might want to cancel the payment here if your API supports it
    }
    onCancel();
  };

  if (paymentStatus === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">Transaction ID: {transactionId}</p>
        <p className="text-sm text-gray-500">Thank you for your purchase.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">MTN Mobile Money</h3>
        <p className="text-gray-600">Pay securely with your MTN MoMo account</p>
      </div>

      {/* Amount Display */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
          <p className="text-3xl font-bold text-gray-900">RWF {amount.toLocaleString()}</p>
        </div>
      </div>

      {/* Payment Form */}
      {paymentStatus === 'idle' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MTN Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0788xxxxxx or 0789xxxxxx"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900"
              disabled={isProcessing}
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={16} />
                {errorMessage}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong>
            </p>
            <ul className="text-xs text-blue-700 mt-2 space-y-1">
              <li>• Enter your MTN Rwanda phone number</li>
              <li>• Click "Pay with MTN MoMo"</li>
              <li>• Check your phone for payment prompt</li>
              <li>• Enter your MoMo PIN to confirm</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing || !phoneNumber}
              className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  <Smartphone size={20} />
                  Pay with MTN MoMo
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Pending Status */}
      {paymentStatus === 'pending' && (
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="animate-spin text-yellow-600" size={32} />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Payment Pending</h4>
            <p className="text-gray-600">Waiting for payment confirmation...</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800 mb-2">
              <strong>Transaction ID:</strong> {transactionId}
            </p>
            <p className="text-sm text-yellow-800 mb-2">
              <strong>Phone:</strong> {phoneNumber}
            </p>
            <p className="text-sm text-yellow-800 mb-2">
              <strong>Amount:</strong> RWF {amount.toLocaleString()}
            </p>
            <p className="text-sm text-yellow-800">
              <strong>Time remaining:</strong> {formatTime(timeLeft)}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Please check your phone for the MTN MoMo payment prompt and enter your PIN to complete the payment.
            </p>
            <button
              onClick={handleCancel}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      )}

      {/* Error Status */}
      {paymentStatus === 'error' && (
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h4 className="text-lg font-semibold text-red-600">Payment Failed</h4>
            <p className="text-gray-600">{errorMessage}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRetry}
              className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MomoPayment;
