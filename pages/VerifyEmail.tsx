import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Mail, Key, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '@/components/GlassCard';
import GlassButton from '@/components/GlassButton';

const VerifyEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyEmail } = useAuth();

    // Initialize email from location state if available
    const [email, setEmail] = useState<string>('');
    const [code, setCode] = useState<string>('');

    const [status, setStatus] = useState<'pending' | 'verifying' | 'success' | 'error'>('pending');
    const [errorMessage, setErrorMessage] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !code) {
            toast.error('Please provide both email and verification code');
            return;
        }

        setStatus('verifying');
        setErrorMessage('');

        try {
            await verifyEmail(email, code);
            setStatus('success');
            toast.success('Email verified successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            setStatus('error');
            const msg = err.message || 'Verification failed. Please check your code and try again.';
            setErrorMessage(msg);
            toast.error(msg);
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error('Please enter your email address first');
            return;
        }

        try {
            await authService.resendVerification(email);
            toast.success('Verification code resent! Please check your inbox.');
            setResendCooldown(60); // 60 seconds cooldown
        } catch (err: any) {
            toast.error(err.message || 'Failed to resend verification code');
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

            <GlassCard className="max-w-md w-full p-8 rounded-[32px] text-center relative z-10" variant="strong">
                {status === 'success' ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-6 py-4"
                    >
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-display font-bold text-white">Verified!</h2>
                            <p className="text-gray-400">Your email has been successfully verified.</p>
                        </div>
                        <p className="text-sm text-brand-primary animate-pulse">Redirecting to login...</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <h2 className="text-3xl font-display font-bold text-white">Verify Email</h2>
                            <p className="text-gray-400">Enter the 6-digit code sent to your email</p>
                        </div>

                        {status === 'error' && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm text-left">
                                <XCircle className="w-5 h-5 shrink-0" />
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleVerify} className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2 text-left">
                                    <label className="text-sm font-bold text-gray-300 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="glass-input w-full pl-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 text-left">
                                    <label className="text-sm font-bold text-gray-300 ml-1">Verification Code</label>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            placeholder="Enter 6-digit code"
                                            className="glass-input w-full pl-12 tracking-widest text-lg"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <GlassButton
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full mt-6"
                                loading={status === 'verifying'}
                                disabled={status === 'verifying'}
                            >
                                {status === 'verifying' ? 'Verifying...' : 'Verify Account'}
                            </GlassButton>
                        </form>

                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <div className="text-sm text-gray-500">
                                Didn't receive the code?{' '}
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendCooldown > 0 || !email}
                                    className="text-brand-primary font-bold hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                    </motion.div>
                )}
            </GlassCard>
        </div>
    );
};

export default VerifyEmail;