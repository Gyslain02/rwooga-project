import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Package, ArrowLeft, Calendar, MapPin, Phone, 
    Truck, CheckCircle, Clock, XCircle, AlertCircle,
    RefreshCw, Eye, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersService } from '@/services/ordersService';

interface Order {
    id: string;
    order_number: string;
    status: string;
    total_amount: number;
    shipping_fee: number;
    final_amount: number;
    shipping_address: string;
    shipping_phone: string;
    tracking_number?: string;
    customer_notes: string;
    created_at: string;
    paid_at?: string;
    shipped_at?: string;
    delivered_at?: string;
    items: Array<{
        id: string;
        product_name: string;
        quantity: number;
        price_at_purchase: number;
        subtotal: number;
        product: {
            id: string;
            name: string;
            image?: string;
            thumbnail?: string;
        };
    }>;
}

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    
    // Return Modal State
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<Order | null>(null);
    const [returnReason, setReturnReason] = useState('');
    const [detailedReason, setDetailedReason] = useState('');
    const [refundAmount, setRefundAmount] = useState(0);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await ordersService.getOrders();
            if (response.ok) {
                setOrders(response.data.results || response.data);
            }
        } catch (error) {
            toast.error('Failed to load orders');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReturnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrderForReturn) return;

        try {
            setLoading(true);
            const response = await ordersService.createReturn(selectedOrderForReturn.id, {
                reason: returnReason,
                detailed_reason: detailedReason,
                requested_refund_amount: refundAmount || selectedOrderForReturn.final_amount
            });

            if (response.ok) {
                toast.success('Return request submitted successfully');
                setShowReturnModal(false);
                setReturnReason('');
                setDetailedReason('');
                setSelectedOrderForReturn(null);
            } else {
                toast.error('Failed to submit return request');
            }
        } catch (error) {
            console.error('Error submitting return:', error);
            toast.error('Failed to submit return request');
        } finally {
            setLoading(false);
        }
    };

    const openReturnModal = (order: Order) => {
        setSelectedOrderForReturn(order);
        setRefundAmount(order.final_amount);
        setShowReturnModal(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'text-yellow-500 bg-yellow-500/10';
            case 'PAID':
                return 'text-blue-500 bg-blue-500/10';
            case 'PROCESSING':
                return 'text-purple-500 bg-purple-500/10';
            case 'SHIPPED':
                return 'text-indigo-500 bg-indigo-500/10';
            case 'DELIVERED':
                return 'text-green-500 bg-green-500/10';
            case 'CANCELLED':
                return 'text-red-500 bg-red-500/10';
            case 'REFUNDED':
                return 'text-orange-500 bg-orange-500/10';
            default:
                return 'text-gray-500 bg-gray-500/10';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock size={16} />;
            case 'PAID':
                return <CheckCircle size={16} />;
            case 'PROCESSING':
                return <RefreshCw size={16} />;
            case 'SHIPPED':
                return <Truck size={16} />;
            case 'DELIVERED':
                return <CheckCircle size={16} />;
            case 'CANCELLED':
                return <XCircle size={16} />;
            case 'REFUNDED':
                return <RefreshCw size={16} />;
            default:
                return <AlertCircle size={16} />;
        }
    };

    const filteredOrders = selectedStatus === 'all' 
        ? orders 
        : orders.filter(order => order.status === selectedStatus);

    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (loading && !showReturnModal) {
        return (
            <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#000000] min-h-screen text-white pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold mb-2">My Orders</h1>
                            <p className="text-gray-400">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
                        </div>
                    </div>
                </div>

                {/* Status Filter */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setSelectedStatus('all')}
                        className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                            selectedStatus === 'all'
                                ? 'bg-green-700 text-white'
                                : 'bg-white/10 text-gray-400 hover:bg-white/20'
                        }`}
                    >
                        All ({orders.length})
                    </button>
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                                selectedStatus === status
                                    ? 'bg-green-700 text-white'
                                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                        >
                            {getStatusIcon(status)}
                            {status.charAt(0) + status.slice(1).toLowerCase()} ({count})
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-16">
                        <Package size={64} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                        <p className="text-gray-400 mb-6">
                            {selectedStatus === 'all' 
                                ? "You haven't placed any orders yet" 
                                : `No orders with status "${selectedStatus}"`
                            }
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {filteredOrders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-[#1c1c1e] rounded-2xl border border-white/10 overflow-hidden"
                                >
                                    {/* Order Header */}
                                    <div 
                                        className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold">{order.order_number}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    {new Date(order.created_at).toLocaleDateString()} • {order.items.length} items
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-green-400">
                                                    {order.final_amount.toLocaleString()} RWF
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    {order.shipping_fee > 0 ? `+ ${order.shipping_fee.toLocaleString()} RWF shipping` : 'Free shipping'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <AnimatePresence>
                                        {expandedOrder === order.id && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden border-t border-white/10"
                                            >
                                                <div className="p-6 space-y-6">
                                                    {/* Items */}
                                                    <div>
                                                        <h4 className="font-semibold mb-4">Order Items</h4>
                                                        <div className="space-y-3">
                                                            {order.items.map((item) => (
                                                                <div key={item.id} className="flex items-center gap-4">
                                                                    <div className="w-16 h-16 rounded-xl bg-black/50 overflow-hidden">
                                                                        <img
                                                                            src={item.product?.image || item.product?.thumbnail || '/placeholder-product.jpg'}
                                                                            alt={item.product_name}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="font-medium">{item.product_name}</p>
                                                                        <p className="text-gray-400 text-sm">
                                                                            Qty: {item.quantity} × {item.price_at_purchase.toLocaleString()} RWF
                                                                        </p>
                                                                    </div>
                                                                    <p className="font-semibold">
                                                                        {item.subtotal.toLocaleString()} RWF
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Shipping Info */}
                                                    <div>
                                                        <h4 className="font-semibold mb-4">Shipping Information</h4>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex items-center gap-2 text-gray-400">
                                                                <MapPin size={16} />
                                                                <span>{order.shipping_address}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-400">
                                                                <Phone size={16} />
                                                                <span>{order.shipping_phone}</span>
                                                            </div>
                                                            {order.tracking_number && (
                                                                <div className="flex items-center gap-2 text-gray-400">
                                                                    <Package size={16} />
                                                                    <span>Tracking: {order.tracking_number}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Timeline */}
                                                    <div>
                                                        <h4 className="font-semibold mb-4">Order Timeline</h4>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <Calendar size={16} className="text-gray-400" />
                                                                <span className="text-sm">
                                                                    Ordered: {new Date(order.created_at).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            {order.paid_at && (
                                                                <div className="flex items-center gap-3">
                                                                    <CheckCircle size={16} className="text-green-500" />
                                                                    <span className="text-sm">
                                                                        Paid: {new Date(order.paid_at).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {order.shipped_at && (
                                                                <div className="flex items-center gap-3">
                                                                    <Truck size={16} className="text-blue-500" />
                                                                    <span className="text-sm">
                                                                        Shipped: {new Date(order.shipped_at).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {order.delivered_at && (
                                                                <div className="flex items-center gap-3">
                                                                    <CheckCircle size={16} className="text-green-500" />
                                                                    <span className="text-sm">
                                                                        Delivered: {new Date(order.delivered_at).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/product/${order.items[0]?.product?.id}`);
                                                            }}
                                                            className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                                                        >
                                                            View Product
                                                        </button>
                                                        {order.status === 'PENDING' && (
                                                            <button 
                                                                className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toast.error('Cancel functionality not implemented yet');
                                                                }}
                                                            >
                                                                Cancel Order
                                                            </button>
                                                        )}
                                                        {order.status === 'DELIVERED' && (
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openReturnModal(order);
                                                                }}
                                                                className="px-4 py-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 rounded-xl transition-colors"
                                                            >
                                                                Return Items
                                                            </button>
                                                        )}
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setShowReturnModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1c1c1e] rounded-2xl p-8 max-w-lg w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Request Return</h2>
                                <button
                                    onClick={() => setShowReturnModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleReturnSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Reason for Return</label>
                                    <select
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                        required
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-green-500"
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
                                    <label className="block text-sm text-gray-400 mb-1">Detailed Explanation</label>
                                    <textarea
                                        value={detailedReason}
                                        onChange={(e) => setDetailedReason(e.target.value)}
                                        required
                                        rows={4}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-green-500"
                                        placeholder="Please provide more details..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Refund Amount (RWF)</label>
                                    <input
                                        type="number"
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(Number(e.target.value))}
                                        required
                                        max={selectedOrderForReturn.final_amount}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-green-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Max: {selectedOrderForReturn.final_amount.toLocaleString()} RWF
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition-colors mt-4 disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;
