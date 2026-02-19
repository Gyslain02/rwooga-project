import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RefreshCw, ArrowLeft, Calendar, AlertCircle, CheckCircle,
    XCircle, Clock, Package, DollarSign, FileText, Plus,
    Filter, Search, Eye, Download, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { returnsService } from '@/services/returnsService';
import { ordersService } from '@/services/ordersService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchRefunds, deleteRefund } from '@/store/slices/refundsSlice';
import { fetchReturns, cancelReturnRequest, Return } from '@/store/slices/returnsSlice';

interface Refund {
    id: string;
    refund_number: string;
    order: {
        order_number: string;
    };
    amount: number;
    status: string;
    reason: string;
    transaction_id?: string;
    created_at: string;
    completed_at?: string;
}

const Returns: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: refunds, loading: refundsLoading, error: refundsError } = useSelector((state: RootState) => state.refunds);
    const { items: returns, loading: returnsLoading, error: returnsError } = useSelector((state: RootState) => state.returns);
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'returns' | 'refunds'>('returns');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [expandedReturn, setExpandedReturn] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoadingOrders(true);
            dispatch(fetchReturns() as any);
            dispatch(fetchRefunds() as any);

            const ordersRes = await ordersService.getOrders();
            if (ordersRes.ok) setOrders(ordersRes.data.results || ordersRes.data);
        } catch (error) {
            toast.error('Failed to load data');
            console.error('Error fetching data:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'REQUESTED':
                return 'text-yellow-500 bg-yellow-500/10';
            case 'APPROVED':
                return 'text-green-500 bg-green-500/10';
            case 'REJECTED':
                return 'text-red-500 bg-red-500/10';
            case 'COMPLETED':
                return 'text-blue-500 bg-blue-500/10';
            case 'CANCELLED':
                return 'text-gray-500 bg-gray-500/10';
            case 'PENDING':
                return 'text-orange-500 bg-orange-500/10';
            case 'FAILED':
                return 'text-red-500 bg-red-500/10';
            default:
                return 'text-gray-500 bg-gray-500/10';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'REQUESTED':
            case 'PENDING':
                return <Clock size={16} />;
            case 'APPROVED':
            case 'COMPLETED':
                return <CheckCircle size={16} />;
            case 'REJECTED':
            case 'FAILED':
                return <XCircle size={16} />;
            case 'CANCELLED':
                return <AlertCircle size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    const filteredReturns = selectedStatus === 'all'
        ? returns
        : returns.filter(return_item => return_item.status === selectedStatus);

    const statusCounts = returns.reduce((acc, return_item) => {
        acc[return_item.status] = (acc[return_item.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (returnsLoading || refundsLoading || loadingOrders) {
        return (
            <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
                    <p>Loading returns and refunds...</p>
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
                            <h1 className="text-4xl font-bold mb-2">Returns & Refunds</h1>
                            <p className="text-gray-400">Manage your return requests and refunds</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors"
                    >
                        <Plus size={16} />
                        Request Return
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-8 bg-white/5 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('returns')}
                        className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${activeTab === 'returns'
                            ? 'bg-green-700 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Returns ({returns.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('refunds')}
                        className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${activeTab === 'refunds'
                            ? 'bg-green-700 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Refunds ({refunds.length})
                    </button>
                </div>

                {/* Returns Tab */}
                {activeTab === 'returns' && (
                    <>
                        {/* Status Filter */}
                        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                            <button
                                onClick={() => setSelectedStatus('all')}
                                className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${selectedStatus === 'all'
                                    ? 'bg-green-700 text-white'
                                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                    }`}
                            >
                                All ({returns.length})
                            </button>
                            {Object.entries(statusCounts).map(([status, count]) => (
                                <button
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${selectedStatus === status
                                        ? 'bg-green-700 text-white'
                                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                        }`}
                                >
                                    {getStatusIcon(status)}
                                    {status.charAt(0) + status.slice(1).toLowerCase()} ({count})
                                </button>
                            ))}
                        </div>

                        {/* Returns List */}
                        {filteredReturns.length === 0 ? (
                            <div className="text-center py-16">
                                <RefreshCw size={64} className="mx-auto mb-4 text-gray-400" />
                                <h3 className="text-xl font-semibold mb-2">No returns found</h3>
                                <p className="text-gray-400 mb-6">
                                    {selectedStatus === 'all'
                                        ? "You haven't made any return requests yet"
                                        : `No returns with status "${selectedStatus}"`
                                    }
                                </p>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors"
                                >
                                    Request a Return
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <AnimatePresence>
                                    {filteredReturns.map((return_item) => (
                                        <motion.div
                                            key={return_item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="bg-[#1c1c1e] rounded-2xl border border-white/10 overflow-hidden"
                                        >
                                            {/* Return Header */}
                                            <div
                                                className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                                                onClick={() => setExpandedReturn(expandedReturn === return_item.id ? null : return_item.id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-semibold">{return_item.return_number}</h3>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(return_item.status)}`}>
                                                                {getStatusIcon(return_item.status)}
                                                                {return_item.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-400 text-sm">
                                                            Order: {return_item.order.order_number} • {new Date(return_item.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-green-400">
                                                            {return_item.approved_refund_amount || return_item.requested_refund_amount} RWF
                                                        </p>
                                                        <p className="text-gray-400 text-sm">
                                                            {return_item.status === 'APPROVED' ? 'Approved' : 'Requested'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Return Details */}
                                            <AnimatePresence>
                                                {expandedReturn === return_item.id && (
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: 'auto' }}
                                                        exit={{ height: 0 }}
                                                        className="overflow-hidden border-t border-white/10"
                                                    >
                                                        <div className="p-6 space-y-6">
                                                            {/* Order Items */}
                                                            <div>
                                                                <h4 className="font-semibold mb-4">Order Items</h4>
                                                                <div className="space-y-2">
                                                                    {return_item.order.items.map((item, idx) => (
                                                                        <div key={idx} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                                                                            <div>
                                                                                <p className="font-medium">{item.product_name}</p>
                                                                                <p className="text-gray-400 text-sm">
                                                                                    Qty: {item.quantity} × {item.price_at_purchase.toLocaleString()} RWF
                                                                                </p>
                                                                            </div>
                                                                            <p className="font-semibold">
                                                                                {(item.quantity * item.price_at_purchase).toLocaleString()} RWF
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Return Reason */}
                                                            <div>
                                                                <h4 className="font-semibold mb-4">Return Reason</h4>
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <span className="text-xs text-gray-400 uppercase tracking-wider">Reason</span>
                                                                        <p className="font-medium">{return_item.reason}</p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-xs text-gray-400 uppercase tracking-wider">Detailed Explanation</span>
                                                                        <p className="text-gray-300">{return_item.detailed_reason}</p>
                                                                    </div>
                                                                    {return_item.rejection_reason && (
                                                                        <div>
                                                                            <span className="text-xs text-red-400 uppercase tracking-wider">Rejection Reason</span>
                                                                            <p className="text-red-400">{return_item.rejection_reason}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Timeline */}
                                                            <div>
                                                                <h4 className="font-semibold mb-4">Timeline</h4>
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <Calendar size={16} className="text-gray-400" />
                                                                        <span className="text-sm">
                                                                            Requested: {new Date(return_item.created_at).toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                    {return_item.approved_at && (
                                                                        <div className="flex items-center gap-3">
                                                                            <CheckCircle size={16} className="text-green-500" />
                                                                            <span className="text-sm">
                                                                                Approved: {new Date(return_item.approved_at).toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex gap-3">
                                                                <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                                                                    View Order Details
                                                                </button>
                                                                {return_item.status === 'REQUESTED' && (
                                                                    <button
                                                                        onClick={async () => {
                                                                            if (window.confirm('Cancel this return request?')) {
                                                                                await dispatch(cancelReturnRequest(return_item.id) as any);
                                                                                toast.success('Return request cancelled');
                                                                            }
                                                                        }}
                                                                        className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors"
                                                                    >
                                                                        Cancel Return
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
                    </>
                )}

                {/* Refunds Tab */}
                {activeTab === 'refunds' && (
                    <div className="space-y-6">
                        {refunds.length === 0 ? (
                            <div className="text-center py-16">
                                <DollarSign size={64} className="mx-auto mb-4 text-gray-400" />
                                <h3 className="text-xl font-semibold mb-2">No refunds found</h3>
                                <p className="text-gray-400 mb-6">You don't have any refund transactions yet</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {refunds.map((refund) => (
                                    <motion.div
                                        key={refund.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-[#1c1c1e] rounded-2xl border border-white/10 p-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold">{refund.refund_number}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(refund.status)}`}>
                                                        {getStatusIcon(refund.status)}
                                                        {refund.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    Order: {refund.order.order_number} • {new Date(refund.created_at).toLocaleDateString()}
                                                </p>
                                                <p className="text-gray-300 text-sm mt-2">{refund.reason}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-green-400">
                                                    {refund.amount.toLocaleString()} RWF
                                                </p>
                                                {refund.transaction_id && (
                                                    <p className="text-gray-400 text-xs mt-1">
                                                        ID: {refund.transaction_id}
                                                    </p>
                                                )}
                                                {refund.status === 'PENDING' && (
                                                    <button
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm('Cancel this refund request?')) {
                                                                await dispatch(deleteRefund(refund.id) as any);
                                                                toast.success('Refund request cancelled');
                                                            }
                                                        }}
                                                        className="mt-3 px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-xs font-bold transition-all"
                                                    >
                                                        Cancel Request
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                )}

                {/* Create Return Modal */}
                <AnimatePresence>
                    {showCreateModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                            onClick={() => setShowCreateModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-[#1c1c1e] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">Request Return</h2>
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>

                                <div className="text-center py-8">
                                    <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                                    <p className="text-gray-400">Select an order from your order history to request a return</p>
                                    <button
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            navigate('/orders');
                                        }}
                                        className="mt-4 px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors"
                                    >
                                        View Orders
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Returns;
