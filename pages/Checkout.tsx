import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, CheckCircle, ArrowLeft, Loader2, ShieldCheck, MapPin, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { clearCart } from '@/store/slices/cartSlice';
import { createOrder } from '@/store/slices/ordersSlice';
import { useAuth } from '@/context/AuthContext';
import MomoPayment from '@/components/MomoPayment';
import CardPayment from '@/components/CardPayment';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    currency: string;
}

const Checkout: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartState = useSelector((state: RootState) => state.cart);
    const cart = cartState.items || [];
    const [loading, setLoading] = useState(false);

    // Price formatting utility
    const formatPrice = (price: number, currency: string = 'RWF') => {
        return `${currency} ${Number(price).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })}`;
    };

    // Calculate total
    const getTotal = () => {
        return cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    };

    // Cart loading is handled by Redux slice initialization

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showMomoPayment, setShowMomoPayment] = useState(false);
    const [showCardPayment, setShowCardPayment] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState<string | number>('');
    const [formData, setFormData] = useState({
        phone: user?.phone || '',
        street: '',
        sector: '',
        district: '',
    });

    // Monitor form data changes
    useEffect(() => {
        console.log('Form data updated:', formData);
    }, [formData]);

    const createPendingOrder = async () => {
        const orderData = {
            items: cart.map(item => ({
                product: item.id,
                quantity: 1,
                price_at_purchase: Number(item.price),
                product_name: item.name,
                subtotal: Number(item.price) // quantity is 1
            })),
            shipping_address: `${formData.street}, ${formData.sector}, ${formData.district}`,
            shipping_phone: String(formData.phone),
            shipping: {
                shipping_phone: String(formData.phone),
                district: formData.district,
                sector: formData.sector,
                street_address: formData.street
            },
            total_amount: getTotal(),
            shipping_fee: 0,
            customer_notes: `Payment via ${paymentMethod}`
        };

        try {
            const orderRes = await dispatch(createOrder(orderData) as any).unwrap();
            return orderRes;
        } catch (error: any) {
            const message = typeof error === 'string' ? error : (error?.message || 'Failed to create order');
            toast.error(message);
            throw error;
        }
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!paymentMethod) {
            toast.error('Please select a payment method');
            return;
        }

        try {
            setIsProcessing(true);
            let orderId = createdOrderId;

            if (!orderId) {
                const newOrder = await createPendingOrder();
                orderId = newOrder.id;
                setCreatedOrderId(orderId);
            }
            setIsProcessing(false);

            if (paymentMethod === 'momo') {
                setShowMomoPayment(true);
            } else if (paymentMethod === 'card') {
                setShowCardPayment(true);
            }
        } catch (error) {
            setIsProcessing(false);
            console.error('Order creation failed:', error);
        }
    };

    const finalizeOrderSuccess = (transactionId: string) => {
        setIsSuccess(true);
        handleClearCart();
        setTimeout(() => {
            navigate('/orders');
        }, 5000);
    };

    const handleMomoPaymentSuccess = async (transactionId: string) => {
        setIsProcessing(false);
        setShowMomoPayment(false);
        toast.success(`Payment successful! Order created. Transaction ID: ${transactionId}`);
        finalizeOrderSuccess(transactionId);
    };

    const handleCardPaymentSuccess = async (transactionId: string) => {
        setIsProcessing(false);
        setShowCardPayment(false);
        toast.success(`Card Payment successful! Order created. Transaction ID: ${transactionId}`);
        finalizeOrderSuccess(transactionId);
    };

    const handleMomoPaymentError = (error: string) => {
        setIsProcessing(false);
        setShowMomoPayment(false);
        toast.error(error);
    };

    const handleMomoPaymentCancel = () => {
        setIsProcessing(false);
        setShowMomoPayment(false);
    };

    const handleCardPaymentError = (error: string) => {
        setIsProcessing(false);
        // Don't close modal on error so user can retry
        toast.error(error);
    };

    const handleCardPaymentCancel = () => {
        setIsProcessing(false);
        setShowCardPayment(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center">
                <Loader2 className="animate-spin text-white" size={48} />
            </div>
        );
    }

    if (cart.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4">
                <h2 className="text-3xl font-display font-bold text-white mb-6">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/shop')}
                    className="px-8 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all"
                >
                    BACK TO SHOP
                </button>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-white/5 border border-white/10 p-12 rounded-[40px] text-center"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-4xl font-display font-bold text-white mb-4 uppercase tracking-tighter">Order Confirmed!</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">Thank you for your purchase. We've sent a confirmation email with your order details.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all"
                    >
                        RETURN TO HOME
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-brand-dark min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/shop')}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
                >
                    <ArrowLeft size={16} /> Back to Shop
                </button>

                <form onSubmit={handlePlaceOrder}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <div className="space-y-12">
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-8 h-8 bg-brand-primary text-black rounded-full flex items-center justify-center font-bold text-sm">1</span>
                                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Shipping Details</h2>
                                </div>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={18} />
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    style={{
                                                        backgroundColor: '#1a1a1a',
                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                        color: 'white',
                                                        padding: '16px 48px',
                                                        borderRadius: '16px',
                                                        outline: 'none',
                                                        width: '100%',
                                                        fontSize: '16px',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    placeholder="Phone Number (e.g. 078...)"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">District</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={18} />
                                                <input
                                                    type="text"
                                                    value={formData.district}
                                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-brand-primary transition-all"
                                                    placeholder="District"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Sector</label>
                                            <input
                                                type="text"
                                                value={formData.sector}
                                                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-brand-primary transition-all"
                                                placeholder="Sector"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Street Address</label>
                                            <input
                                                type="text"
                                                value={formData.street}
                                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-brand-primary transition-all"
                                                placeholder="Street, House No..."
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-8 h-8 bg-brand-primary text-black rounded-full flex items-center justify-center font-bold text-sm">2</span>
                                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Payment Method</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('momo')}
                                        className={`flex items-center gap-5 p-6 rounded-3xl border transition-all text-left ${paymentMethod === 'momo'
                                            ? 'bg-green-700/20 border-green-600'
                                            : 'bg-white/5 border-white/10 hover:border-green-600/50'
                                            }`}
                                    >
                                        <div className={`p-4 rounded-2xl ${paymentMethod === 'momo' ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400'}`}>
                                            <Smartphone size={24} />
                                        </div>
                                        <div>
                                            <p className={`font-bold ${paymentMethod === 'momo' ? 'text-white' : 'text-gray-400'}`}>Mobile Money</p>
                                            <p className="text-xs text-gray-500 font-medium">MTN/Airtel Rwanda</p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`flex items-center gap-5 p-6 rounded-3xl border transition-all text-left ${paymentMethod === 'card'
                                            ? 'bg-green-700/20 border-green-600'
                                            : 'bg-white/5 border-white/10 hover:border-green-600/50'
                                            }`}
                                    >
                                        <div className={`p-4 rounded-2xl ${paymentMethod === 'card' ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400'}`}>
                                            <CreditCard size={24} />
                                        </div>
                                        <div>
                                            <p className={`font-bold ${paymentMethod === 'card' ? 'text-white' : 'text-gray-400'}`}>Credit/Debit Card</p>
                                            <p className="text-xs text-gray-500 font-medium">Visa, Mastercard</p>
                                        </div>
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* Right Side: Order Summary */}
                        <div className="bg-[#111418] border border-white/5 rounded-[40px] p-10 lg:sticky lg:top-32 shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-10 uppercase tracking-tight">Order Summary</h3>

                            <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden border border-white/5">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">{item.name}</p>
                                                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">{item.category}</p>
                                            </div>
                                        </div>
                                        <p className="text-white font-bold">{formatPrice(item.price, item.currency)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-white/5 pt-8">
                                <div className="flex justify-between text-gray-500 font-bold uppercase tracking-widest text-xs">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(getTotal())}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-bold uppercase tracking-widest text-xs">
                                    <span>Shipping</span>
                                    <span className="text-brand-primary">FREE</span>
                                </div>
                                <div className="flex justify-between items-end pt-4 border-t border-white/5 mt-4">
                                    <span className="text-white font-bold uppercase tracking-tighter text-lg">Total</span>
                                    <span className="text-4xl font-display font-bold text-white tracking-tighter">
                                        {formatPrice(getTotal())}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <ShieldCheck size={18} className="text-brand-primary" />
                                    <p className="text-xs font-bold uppercase tracking-widest italic">Security Guaranteed</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-green-700 text-white py-6 rounded-3xl font-extrabold text-xl hover:bg-green-800 active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-green-700/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="animate-spin" size={24} />
                                            PROCESSING PAYMENT...
                                        </>
                                    ) : (
                                        <>PAY {formatPrice(getTotal())}</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* MTN Mobile Money Payment Modal */}
                <AnimatePresence>
                    {showMomoPayment && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                            onClick={() => setShowMomoPayment(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">MTN Mobile Money</h3>
                                    <button
                                        onClick={() => setShowMomoPayment(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ×
                                    </button>
                                </div>

                                <MomoPayment
                                    amount={getTotal()}
                                    orderId={createdOrderId}
                                    customerName={user?.name || 'Customer'}
                                    customerEmail={user?.email}
                                    onSuccess={handleMomoPaymentSuccess}
                                    onError={handleMomoPaymentError}
                                    onCancel={handleMomoPaymentCancel}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Card Payment Modal */}
                <AnimatePresence>
                    {showCardPayment && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                            onClick={() => setShowCardPayment(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Card Payment</h3>
                                    <button
                                        onClick={() => setShowCardPayment(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ×
                                    </button>
                                </div>

                                <CardPayment
                                    amount={getTotal()}
                                    orderId={createdOrderId}
                                    customerName={user?.name || 'Customer'}
                                    customerEmail={user?.email}
                                    onSuccess={handleCardPaymentSuccess}
                                    onError={handleCardPaymentError}
                                    onCancel={handleCardPaymentCancel}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Checkout;
