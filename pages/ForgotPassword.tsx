import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck, ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStatus('loading');

        try {
            await authService.requestPasswordReset(email);
            setStatus('success');
            toast.success('Password reset link sent to your email!');
        } catch (err: any) {
            setStatus('error');
            const errorMessage = err.message || 'Failed to send reset email';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 pt-20 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <GlassCard className="max-w-md w-full p-8 md:p-12 rounded-[32px] shadow-2xl relative z-10" variant="strong">
                {status === 'success' ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center space-y-6"
                    >
                        <ShieldCheck className="w-20 h-20 text-brand-primary mx-auto" />
                        <h2 className="text-3xl font-brand font-bold text-white">Check Your Email</h2>
                        <p className="text-gray-400 leading-relaxed">
                            We've sent a password reset link to <span className="text-brand-primary font-bold">{email}</span>
                        </p>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-gray-400 space-y-2">
                            <p className="font-bold text-white">What's next?</p>
                            <ol className="list-decimal list-inside space-y-1 text-left">
                                <li>Check your inbox (and spam folder)</li>
                                <li>Click the reset link in the email</li>
                                <li>Create your new password</li>
                            </ol>
                        </div>
                        <GlassButton
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/login')}
                            className="w-full"
                        >
                            Back to Login
                        </GlassButton>
                    </motion.div>
                ) : (
                    <>
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-display font-bold text-white mb-3">Forgot Password?</h2>
                            <p className="text-gray-400">Enter your email address and we'll send you a reset link</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center space-x-3 text-sm font-bold">
                                <ShieldAlert size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 ml-1">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="glass-input w-full pl-12"
                                        placeholder="you@example.com"
                                        required
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                </div>
                            </div>

                            <GlassButton
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={status === 'loading'}
                                disabled={status === 'loading'}
                                icon={<Mail className="w-5 h-5" />}
                                className="w-full"
                            >
                                {status === 'loading' ? 'Sending Reset Link...' : 'Send Reset Link'}
                            </GlassButton>
                        </form>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center justify-center">
                                <Link
                                    to="/login"
                                    className="text-sm font-bold text-gray-500 hover:text-white transition-colors flex items-center space-x-2"
                                >
                                    <ArrowLeft size={16} />
                                    <span>Back to Login</span>
                                </Link>
                            </div>

                            <div className="text-center text-gray-500 text-sm font-medium">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-brand-primary font-bold hover:text-white transition-colors">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </GlassCard>
        </div>
    );
};

export default ForgotPassword;
