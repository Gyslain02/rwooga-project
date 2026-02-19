import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, ArrowLeft, Calendar, MapPin, Phone,
    Truck, CheckCircle, Clock, XCircle, AlertCircle,
    RefreshCw, ShoppingBag, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { fetchOrders, cancelOrder, Order } from '@/store/slices/ordersSlice';
import { ordersService } from '@/services/ordersService';

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: orders, loading, error } = useSelector((state: RootState) => state.orders);

    const [filterStatus, setFilterStatus] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    // Return Modal State
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedOrderForReturnId, setSelectedOrderForReturnId] = useState<string | null>(null);
    const [returnReason, setReturnReason] = useState('');
    const [detailedReason, setDetailedReason] = useState('');
    const [refundAmount, setRefundAmount] = useState(0);
    const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

    useEffect(() => {
        dispatch(fetchOrders() as any);
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleCancelOrder = async (orderId: string) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            await dispatch(cancelOrder(orderId) as any).unwrap();
            toast.success('Order cancelled successfully');
        } catch (error: any) {
            const message = typeof error === 'string' ? error : (error?.message || 'Failed to cancel order');
            toast.error(message);
        }
    };

    const handleReturnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrderForReturnId) return;

        const orderToReturn = orders.find(order => order.id === selectedOrderForReturnId);
        if (!orderToReturn) {
            toast.error('Order not found for return');
            return;
        }

        try {
            setIsSubmittingReturn(true);
            const response = await ordersService.createReturn(selectedOrderForReturnId, {
                reason: returnReason,
                detailed_reason: detailedReason,
                requested_refund_amount: refundAmount || orderToReturn.final_amount
            });

            if (response.ok) {
                toast.success('Return request submitted successfully');
                setShowReturnModal(false);
                setReturnReason('');
                setDetailedReason('');
                setSelectedOrderForReturnId(null);
            } else {
                toast.error('Failed to submit return request');
            }
        } catch (error) {
            console.error('Error submitting return:', error);
            toast.error('Failed to submit return request');
        } finally {
            setIsSubmittingReturn(false);
        }
    };

    const openReturnModal = (order: Order) => {
        setSelectedOrderForReturnId(order.id);
        setRefundAmount(order.final_amount);
        setShowReturnModal(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'text-yellow-500 bg-yellow-500/10';
            case 'PAID': return 'text-blue-500 bg-blue-500/10';
            case 'PROCESSING': return 'text-purple-500 bg-purple-500/10';
            case 'SHIPPED': return 'text-indigo-500 bg-indigo-500/10';
            case 'DELIVERED': return 'text-green-500 bg-green-500/10';
            case 'CANCELLED': return 'text-red-500 bg-red-500/10';
            case 'REFUNDED': return 'text-orange-500 bg-orange-500/10';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock size={16} />;
            case 'PAID': return <CheckCircle size={16} />;
            case 'PROCESSING': return <RefreshCw size={16} />;
            case 'SHIPPED': return <Truck size={16} />;
            case 'DELIVERED': return <CheckCircle size={16} />;
            case 'CANCELLED': return <XCircle size={16} />;
            default: return <AlertCircle size={16} />;
        }
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading your orders...</p>
                </div>
            </div>
        );
    }

    const selectedOrderForReturn = orders.find(o => o.id === selectedOrderForReturnId);

    return (
        <div className="bg-brand-dark min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-display font-bold text-white uppercase tracking-tighter">My Orders</h1>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Track and manage your purchases</p>
                        </div>
                    </div>
                </div>

                {/* Status Filter */}
                <div className="flex gap-3 mb-12 overflow-x-auto pb-4 custom-scrollbar">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all border ${filterStatus === 'all'
                            ? 'bg-brand-primary text-black border-brand-primary shadow-lg shadow-brand-primary/20'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                            }`}
                    >
                        All ({orders.length})
                    </button>
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all border flex items-center gap-2 ${filterStatus === status
                                ? 'bg-brand-primary text-black border-brand-primary shadow-lg shadow-brand-primary/20'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                                }`}
                        >
                            {status} ({count})
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-[40px] p-20 text-center group">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                            <ShoppingBag className="text-gray-500" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">No orders found</h3>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                            {filterStatus === 'all'
                                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                                : `You don't have any orders with status "${filterStatus}".`
                            }
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-8 py-4 bg-brand-primary text-black font-bold rounded-2xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-sm"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-[#111418] border border-white/5 rounded-[32px] overflow-hidden hover:border-white/10 transition-all"
                                >
                                    {/* Order Header */}
                                    <div
                                        className="p-8 cursor-pointer group"
                                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary border border-white/5 group-hover:bg-brand-primary group-hover:text-black transition-all">
                                                    <Package size={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-xl font-bold text-white tracking-tight">{order.order_number}</h3>
                                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                                        {new Date(order.created_at).toLocaleDateString()} • {order.items.length} items
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-display font-bold text-white tracking-tighter">
                                                    {order.final_amount.toLocaleString()} <span className="text-xs text-gray-500 ml-1">RWF</span>
                                                </p>
                                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                                                    Total Amount Paid
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <AnimatePresence>
                                        {expandedOrder === order.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden bg-white/[0.02] border-t border-white/5"
                                            >
                                                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                    {/* Items Column */}
                                                    <div className="space-y-8">
                                                        <div>
                                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                                <ShoppingBag size={14} /> Order Items
                                                            </h4>
                                                            <div className="space-y-4">
                                                                {order.items.map((item) => (
                                                                    <div key={item.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                                                        <div className="w-16 h-16 rounded-xl bg-black/50 overflow-hidden border border-white/5">
                                                                            <img
                                                                                src={item.product?.image || item.product?.thumbnail || '/placeholder-product.jpg'}
                                                                                alt={item.product_name}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p className="text-white font-bold text-sm mb-1">{item.product_name}</p>
                                                                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                                                                Qty: {item.quantity} × {item.price_at_purchase.toLocaleString()} RWF
                                                                            </p>
                                                                        </div>
                                                                        <p className="text-white font-bold">
                                                                            {item.subtotal.toLocaleString()} <span className="text-[10px] text-gray-500 ml-1">RWF</span>
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                                                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                                                                <span>Subtotal</span>
                                                                <span className="text-white">{order.total_amount.toLocaleString()} RWF</span>
                                                            </div>
                                                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                                                                <span>Shipping</span>
                                                                <span className={order.shipping_fee > 0 ? 'text-white' : 'text-brand-primary'}>
                                                                    {order.shipping_fee > 0 ? `${order.shipping_fee.toLocaleString()} RWF` : 'FREE'}
                                                                </span>
                                                            </div>
                                                            <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                                                                <span className="text-sm font-bold text-white uppercase tracking-tighter">Total</span>
                                                                <span className="text-2xl font-display font-bold text-brand-primary tracking-tighter">
                                                                    {order.final_amount.toLocaleString()} RWF
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Info Column */}
                                                    <div className="space-y-8">
                                                        <div>
                                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                                <MapPin size={14} /> Shipping & Delivery
                                                            </h4>
                                                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                                                                <div className="flex gap-4">
                                                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
                                                                        <MapPin size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Address</p>
                                                                        <p className="text-white text-sm font-medium leading-relaxed">{order.shipping_address}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-4">
                                                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
                                                                        <Phone size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Contact</p>
                                                                        <p className="text-white text-sm font-medium">{order.shipping_phone}</p>
                                                                    </div>
                                                                </div>
                                                                {order.tracking_number && (
                                                                    <div className="flex gap-4">
                                                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
                                                                            <Truck size={18} />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Tracking Number</p>
                                                                            <p className="text-brand-primary text-sm font-bold tracking-widest">{order.tracking_number}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                                <Clock size={14} /> Order Timeline
                                                            </h4>
                                                            <div className="space-y-4 px-2">
                                                                {[
                                                                    { label: 'Ordered', date: order.created_at, icon: Clock, color: 'text-gray-400', active: true },
                                                                    { label: 'Paid', date: order.paid_at, icon: CheckCircle, color: 'text-green-500', active: !!order.paid_at },
                                                                    { label: 'Shipped', date: order.shipped_at, icon: Truck, color: 'text-blue-500', active: !!order.shipped_at },
                                                                    { label: 'Delivered', date: order.delivered_at, icon: CheckCircle, color: 'text-brand-primary', active: !!order.delivered_at },
                                                                ].filter(t => t.active).map((step, idx) => (
                                                                    <div key={idx} className="flex items-center gap-4">
                                                                        <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center ${step.color}`}>
                                                                            <step.icon size={14} />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-white text-xs font-bold uppercase tracking-widest">{step.label}</p>
                                                                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                                                                                {new Date(step.date!).toLocaleString()}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Actions Area */}
                                                        <div className="flex gap-4 pt-4">
                                                            {order.status === 'PENDING' && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleCancelOrder(order.id); }}
                                                                    className="flex-1 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                                                >
                                                                    <XCircle size={14} /> Cancel Order
                                                                </button>
                                                            )}
                                                            {order.status === 'DELIVERED' && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); openReturnModal(order); }}
                                                                    className="flex-1 py-4 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-yellow-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                                                >
                                                                    <RefreshCw size={14} /> Return Items
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); navigate(`/product/${order.items[0]?.product?.id}`); }}
                                                                className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <Eye size={14} /> Buy Again
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Return Modal */}
            <AnimatePresence>
                {showReturnModal && selectedOrderForReturn && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                            onClick={() => setShowReturnModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative w-full max-w-xl bg-[#111418] border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button
                                    onClick={() => setShowReturnModal(false)}
                                    className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 hover:text-white transition-all"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <div className="mb-10">
                                <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tighter mb-2">Request Return</h2>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Order: {selectedOrderForReturn.order_number}</p>
                            </div>

                            <form onSubmit={handleReturnSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Reason for Return</label>
                                    <select
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                        required
                                        className="w-full bg-[#0a0d10] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-brand-primary transition-all appearance-none uppercase font-bold text-xs tracking-widest"
                                    >
                                        <option value="">Select a reason</option>
                                        <option value="Damaged">Item Damaged</option>
                                        <option value="Wrong Item">Wrong Item Received</option>
                                        <option value="Not as Described">Not as Described</option>
                                        <option value="Changed Mind">Changed Mind</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Detailed Explanation</label>
                                    <textarea
                                        value={detailedReason}
                                        onChange={(e) => setDetailedReason(e.target.value)}
                                        required
                                        rows={4}
                                        className="w-full bg-[#0a0d10] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-brand-primary transition-all resize-none font-medium"
                                        placeholder="Please provide more details about the issue..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Requested Refund Amount (RWF)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={refundAmount}
                                            onChange={(e) => setRefundAmount(Number(e.target.value))}
                                            required
                                            max={selectedOrderForReturn.final_amount}
                                            className="w-full bg-[#0a0d10] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-brand-primary transition-all font-bold"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-gray-600 uppercase">
                                            MAX: {selectedOrderForReturn.final_amount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmittingReturn}
                                    className="w-full py-6 bg-brand-primary text-black font-extrabold rounded-3xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/10 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm mt-4"
                                >
                                    {isSubmittingReturn ? (
                                        <>
                                            <RefreshCw className="animate-spin" size={20} />
                                            Submitting Request...
                                        </>
                                    ) : (
                                        <>Submit Return Request</>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;
