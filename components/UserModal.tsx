import React, { useState, useEffect } from 'react';
import { X, Save, User as UserIcon, UserCheck, Mail, Phone, Shield, Power, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassButton from '@/components/GlassButton';

interface User {
    id?: string;
    email: string;
    full_name: string;
    phone_number: string | number;
    user_type: 'ADMIN' | 'STAFF' | 'CUSTOMER';
    is_active: boolean;
    password?: string;
    password_confirm?: string;
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: any) => void;
    user?: User | null;
    loading: boolean;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit, user, loading }) => {
    const [formData, setFormData] = useState<User>({
        email: '',
        full_name: '',
        phone_number: '' as string | number,
        user_type: 'CUSTOMER',
        is_active: true,
        password: '',
        password_confirm: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                ...user,
                full_name: user.full_name || '',
                phone_number: user.phone_number || '',
                password: '',
                password_confirm: '',
            });
        } else {
            setFormData({
                email: '',
                full_name: '',
                phone_number: '' as string | number,
                user_type: 'CUSTOMER',
                is_active: true,
                password: '',
                password_confirm: '',
            });
        }
    }, [user, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-white dark:bg-[#1E293B] rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800"
                >
                    <div className="flex justify-between items-center p-8 border-b border-gray-100 dark:border-slate-800">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                            <UserIcon className="text-brand-primary" />
                            {user ? 'Edit User' : 'Create New User'}
                        </h3>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all dark:text-white"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all dark:text-white"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone_number}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            setFormData({ ...formData, phone_number: value === '' ? '' : Number(value) });
                                        }}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all dark:text-white"
                                        placeholder="07..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Password</label>
                                <div className="relative">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required={!user}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all dark:text-white"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">User Role</label>
                                <div className="relative">
                                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select
                                        value={formData.user_type}
                                        onChange={(e) => setFormData({ ...formData, user_type: e.target.value as 'ADMIN' | 'STAFF' | 'CUSTOMER' })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all dark:text-white appearance-none"
                                    >
                                        <option value="CUSTOMER">User / Client</option>
                                        <option value="STAFF">Staff Member</option>
                                        <option value="ADMIN">Administrator</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Confirm Password</label>
                                <div className="relative">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required={!user}
                                        value={formData.password_confirm}
                                        onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all dark:text-white"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>



                            <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 self-end">
                                <div className="flex-1">
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">Account Status</p>
                                    <p className="text-[10px] text-slate-500">Enable or disable user access</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                    className={`w-12 h-6 rounded-full relative transition-all ${formData.is_active ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.is_active ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-4 text-slate-500 font-bold hover:text-slate-700 transition-all"
                            >
                                Cancel
                            </button>
                            <GlassButton
                                type="submit"
                                loading={loading}
                                icon={<Save size={20} />}
                                className="px-10"
                            >
                                {user ? 'Update User' : 'Create User'}
                            </GlassButton>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UserModal;
