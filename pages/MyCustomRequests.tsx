
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequests, removeRequest, updateExistingRequest } from '@/store/slices/requestsSlice';
import { RootState } from '@/store';
import {
    ClipboardList,
    Trash2,
    Edit2,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Download,
    Plus,
    ArrowRight,
    Save,
    X,
    RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { productsService } from '@/services/productsService';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

const MyCustomRequests: React.FC = () => {
    const dispatch = useDispatch();
    const { items: requests, loading, error } = useSelector((state: RootState) => state.requests);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        budget: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<any>(null);

    useEffect(() => {
        dispatch(fetchRequests({}) as any);
    }, [dispatch]);

    const handleDelete = (request: any) => {
        setRequestToDelete(request);
    };

    const handleConfirmDelete = async () => {
        if (!requestToDelete) return;

        try {
            await dispatch(removeRequest(requestToDelete.id) as any).unwrap();
            toast.success('Request deleted');
        } catch (err: any) {
            toast.error(err || 'Failed to delete');
        } finally {
            setRequestToDelete(null);
        }
    };

    const startEditing = (request: any) => {
        if (request.status !== 'PENDING') {
            toast.error('Only pending requests can be edited.');
            return;
        }
        setEditingId(request.id);
        setEditForm({
            title: request.title,
            description: request.description,
            budget: request.budget || ''
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId) return;

        try {
            setIsSaving(true);
            await dispatch(updateExistingRequest({
                id: editingId,
                data: {
                    title: editForm.title,
                    description: editForm.description,
                    budget: editForm.budget
                }
            }) as any).unwrap();

            toast.success('Request updated');
            setEditingId(null);
        } catch (err: any) {
            toast.error(err || 'Failed to update');
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING': return <Clock className="text-amber-500" size={18} />;
            case 'IN_PROGRESS': return <Clock className="text-blue-500" size={18} />;
            case 'COMPLETED': return <CheckCircle2 className="text-emerald-500" size={18} />;
            case 'CANCELLED': return <XCircle className="text-red-500" size={18} />;
            default: return <AlertCircle className="text-slate-400" size={18} />;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="bg-brand-dark min-h-screen pt-40 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <span className="text-brand-primary font-bold tracking-[0.4em] uppercase text-xs mb-4 block">Client Portal</span>
                        <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter">
                            My Custom <span className="text-gray-500">Requests</span>
                        </h1>
                    </div>
                    <Link
                        to="/custom-request"
                        className="flex items-center gap-2 bg-brand-primary text-black px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all uppercase tracking-widest text-xs"
                    >
                        <Plus size={16} />
                        New Request
                    </Link>
                </header>

                {loading && requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading requests...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-32 bg-red-500/5 border border-red-500/10 rounded-[40px] backdrop-blur-sm">
                        <AlertCircle className="mx-auto text-red-500 mb-6" size={64} />
                        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Fetch Failed</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">{error}</p>
                        <button
                            onClick={() => dispatch(fetchRequests({}) as any)}
                            className="text-brand-primary font-bold hover:underline uppercase tracking-widest text-xs flex items-center justify-center mx-auto gap-2"
                        >
                            <RefreshCw size={14} />
                            Try Again
                        </button>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-32 bg-white/5 border border-white/5 rounded-[40px] backdrop-blur-sm">
                        <ClipboardList className="mx-auto text-gray-700 mb-6" size={64} />
                        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">No requests found</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't submitted any custom printing or design requests yet or they are not linked to your account.</p>
                        <Link
                            to="/custom-request"
                            className="text-brand-primary font-bold hover:underline uppercase tracking-widest text-xs"
                        >
                            Submit your first request
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence mode="popLayout">
                            {requests.map((request: any) => (
                                <motion.div
                                    key={request.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-[#111418] border border-white/5 rounded-[32px] overflow-hidden group hover:border-white/10 transition-all"
                                >
                                    {editingId === request.id ? (
                                        <form onSubmit={handleUpdate} className="p-8">
                                            <div className="flex justify-between items-center mb-8">
                                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Edit Request</h3>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingId(null)}
                                                        className="p-2 text-gray-500 hover:text-white transition-colors"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Title</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.title}
                                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Budget (RWF)</label>
                                                    <input
                                                        type="number"
                                                        value={editForm.budget}
                                                        onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Description</label>
                                                    <textarea
                                                        rows={4}
                                                        value={editForm.description}
                                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all resize-none"
                                                        required
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isSaving}
                                                    className="w-full bg-brand-primary text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
                                                >
                                                    {isSaving ? (
                                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <>
                                                            <Save size={18} />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="p-8">
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary">
                                                        <ClipboardList size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white leading-tight mb-1">{request.title}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(request.status)}`}>
                                                                {getStatusIcon(request.status)}
                                                                {request.status}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                                {new Date(request.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 ml-auto md:ml-0">
                                                    {request.status === 'PENDING' && (
                                                        <button
                                                            onClick={() => startEditing(request)}
                                                            className="p-3 bg-white/5 text-gray-400 hover:text-brand-primary hover:bg-white/10 rounded-xl transition-all"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(request)}
                                                        className="p-3 bg-white/5 text-gray-400 hover:text-red-500 hover:bg-white/10 rounded-xl transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                                <DetailItem label="Category" value={request.service_category_name || 'General Inquiry'} />
                                                <DetailItem label="Budget" value={request.budget ? `${Number(request.budget).toLocaleString()} RWF` : 'N/A'} />
                                                <DetailItem label="Reference" value={request.reference_file ? 'Attached' : 'None'} />
                                                {request.reference_file && (
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Files</p>
                                                        <a
                                                            href={request.reference_file}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-brand-primary text-xs font-bold hover:underline"
                                                        >
                                                            <Download size={14} />
                                                            View Attachment
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Description</p>
                                                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{request.description}</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <DeleteConfirmModal
                isOpen={!!requestToDelete}
                onClose={() => setRequestToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Request"
                message={`Are you sure you want to delete your request "${requestToDelete?.title}"? This action cannot be undone.`}
            />
        </div>
    );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-300">{value}</p>
    </div>
);

export default MyCustomRequests;
