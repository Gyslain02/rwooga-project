
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store';
import { clearCart } from '@/store/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, CheckCircle, ArrowLeft, Loader2, ShieldCheck, MapPin, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '@/context/AuthContext';

const Checkout: React.FC = () => {
    const { items: cart, total } = useSelector((state: RootState) => state.cart);
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: '',
        city: 'Kigali',
    });

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentMethod) {
            toast.error('Please select a payment method');
            return;
        }

        setIsProcessing(true);


        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            dispatch(clearCart());
            toast.success('Payment successful! Your order is being processed.');


            setTimeout(() => {
                navigate('/');
            }, 5000);
        }, 3000);
    };

    if (cart.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4">
                <h2 className="text-3xl font-display font-bold text-white mb-6">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/shop')}
                    className="px-8 py-4 bg-brand-primary text-black font-bold rounded-full hover:scale-105 transition-all"
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
                        className="w-full py-4 bg-brand-primary text-black font-bold rounded-2xl hover:brightness-110 transition-all"
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    <div className="space-y-12">
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <span className="w-8 h-8 bg-brand-primary text-black rounded-full flex items-center justify-center font-bold text-sm">1</span>
                                <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Shipping Details</h2>
                            </div>

                            <form className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-brand-primary transition-all"
                                                placeholder="Recipient Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-brand-primary transition-all"
                                                placeholder="07..."
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Delivery Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-brand-primary transition-all"
                                            placeholder="Street, District, Plot..."
                                        />
                                    </div>
                                </div>
                            </form>
                        </section>

                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <span className="w-8 h-8 bg-brand-primary text-black rounded-full flex items-center justify-center font-bold text-sm">2</span>
                                <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <button
                                    onClick={() => setPaymentMethod('momo')}
                                    className={`flex items-center gap-5 p-6 rounded-3xl border transition-all text-left ${paymentMethod === 'momo'
                                        ? 'bg-brand-primary/10 border-brand-primary'
                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className={`p-4 rounded-2xl ${paymentMethod === 'momo' ? 'bg-brand-primary text-black' : 'bg-white/5 text-gray-400'}`}>
                                        <Smartphone size={24} />
                                    </div>
                                    <div>
                                        <p className={`font-bold ${paymentMethod === 'momo' ? 'text-white' : 'text-gray-400'}`}>Mobile Money</p>
                                        <p className="text-xs text-gray-500 font-medium">MTN/Airtel Rwanda</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex items-center gap-5 p-6 rounded-3xl border transition-all text-left ${paymentMethod === 'card'
                                        ? 'bg-brand-primary/10 border-brand-primary'
                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className={`p-4 rounded-2xl ${paymentMethod === 'card' ? 'bg-brand-primary text-black' : 'bg-white/5 text-gray-400'}`}>
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
                                    <p className="text-white font-bold">{item.price.toLocaleString()} RWF</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 border-t border-white/5 pt-8">
                            <div className="flex justify-between text-gray-500 font-bold uppercase tracking-widest text-xs">
                                <span>Subtotal</span>
                                <span>{total.toLocaleString()} RWF</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-bold uppercase tracking-widest text-xs">
                                <span>Shipping</span>
                                <span className="text-brand-primary">FREE</span>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-white/5 mt-4">
                                <span className="text-white font-bold uppercase tracking-tighter text-lg">Total</span>
                                <span className="text-4xl font-display font-bold text-white tracking-tighter">
                                    {total.toLocaleString()} <span className="text-lg">RWF</span>
                                </span>
                            </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
                            <div className="flex items-center gap-3 text-gray-500">
                                <ShieldCheck size={18} className="text-brand-primary" />
                                <p className="text-xs font-bold uppercase tracking-widest italic">Security Guaranteed</p>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                                className="w-full bg-brand-primary text-black py-6 rounded-3xl font-extrabold text-xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        PROCESSING PAYMENT...
                                    </>
                                ) : (
                                    <>PAY {total.toLocaleString()} RWF</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
