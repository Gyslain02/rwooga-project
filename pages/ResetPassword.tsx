import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setError('Invalid or missing reset token');
        }
    }, [token]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            toast.error('Password must be at least 8 characters');
            return;
        }

        setStatus('loading');

        try {
            await authService.confirmPasswordReset({
                token: token!,
                new_password: newPassword,
                new_password_confirm: confirmPassword
            });

            setStatus('success');
            toast.success('Password reset successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            setStatus('error');
            const errorMessage = err.message || 'Password reset failed';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
            <GlassCard className="max-w-md w-full p-8 rounded-[32px]" variant="strong">
                {!token ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-4"
                    >
                        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
                        <h2 className="text-2xl font-brand font-bold text-white">Invalid Reset Link</h2>
                        <p className="text-gray-400 text-sm">This password reset link is invalid or has expired.</p>
                        <GlassButton
                            variant="primary"
                            onClick={() => navigate('/login')}
                        >
                            Go to Login
                        </GlassButton>
                    </motion.div>
                ) : status === 'success' ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center space-y-4"
                    >
                        <ShieldCheck className="w-16 h-16 text-brand-primary mx-auto" />
                        <h2 className="text-2xl font-brand font-bold text-white">Password Reset Successful!</h2>
                        <p className="text-gray-400 text-sm">Your password has been updated. Redirecting to login...</p>
                    </motion.div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-brand font-bold text-white mb-2">Reset Your Password</h2>
                            <p className="text-gray-400 text-sm">Enter your new password below</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center space-x-3 text-sm font-bold">
                                <ShieldAlert size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 ml-1">New Password</label>
                                <div className="relative">
                                    <input
                                        required
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="glass-input w-full pr-12"
                                        placeholder="New Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 ml-1">
                                    • Must be at least 8 characters<br />
                                    • Mix of uppercase, lowercase, numbers & symbols
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 ml-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        required
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="glass-input w-full pr-12"
                                        placeholder="Confirm Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <GlassButton
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={status === 'loading'}
                                disabled={status === 'loading'}
                                className="w-full"
                            >
                                {status === 'loading' ? 'Resetting Password...' : 'Reset Password'}
                            </GlassButton>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm text-gray-500 hover:text-white transition-colors font-medium"
                            >
                                Back to Login
                            </button>
                        </div>
                    </>
                )}
            </GlassCard>
        </div>
    );
};

export default ResetPassword;
