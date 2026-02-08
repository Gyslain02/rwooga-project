import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';

const VerifyEmail: React.FC = () => {
    const { token: tokenParam } = useParams<{ token?: string }>();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || tokenParam;

    const navigate = useNavigate();
    const { verifyEmail, loading, error } = useAuth();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [userEmail, setUserEmail] = useState<string>('');

    useEffect(() => {
        if (token) {
            verifyEmail(token)
                .then(() => {
                    setStatus('success');
                    toast.success('Email verified successfully! Redirecting to login...');
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                })
                .catch((err) => {
                    setStatus('error');
                    toast.error(err.message || 'Verification failed');
                });
        } else {
            setStatus('error');
        }
    }, [token, verifyEmail, navigate]);

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
            <GlassCard className="max-w-md w-full p-8 rounded-[32px] text-center" variant="strong">
                {status === 'verifying' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        <Loader2 className="w-16 h-16 text-brand-primary animate-spin mx-auto" />
                        <h2 className="text-2xl font-brand font-bold text-white">Verifying your email...</h2>
                        <p className="text-gray-400 text-sm">Please wait while we confirm your account.</p>
                    </motion.div>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-4"
                    >
                        <CheckCircle className="w-16 h-16 text-brand-primary mx-auto" />
                        <h2 className="text-2xl font-brand font-bold text-white">Verification Successful!</h2>
                        <p className="text-gray-400 text-sm">Your email has been verified. You can now log in with your credentials.</p>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-4"
                    >
                        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <h2 className="text-2xl font-brand font-bold text-white">Verification Failed</h2>
                        <p className="text-gray-400 text-sm">{error || 'The verification link might be invalid or expired.'}</p>
                        <div className="flex flex-col gap-3 mt-6">
                            <input
                                type="email"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                placeholder="Enter your email to resend"
                                className="glass-input w-full"
                            />
                            <GlassButton
                                variant="primary"
                                size="lg"
                                onClick={async () => {
                                    if (userEmail) {
                                        try {
                                            await authService.resendVerification(userEmail);
                                            toast.success('Verification email resent! Please check your inbox.');
                                        } catch (err: any) {
                                            toast.error(err.message || 'Failed to resend verification email');
                                        }
                                    } else {
                                        toast.error('Please enter your email address');
                                    }
                                }}
                                className="w-full"
                            >
                                Resend Verification Email
                            </GlassButton>
                            <GlassButton
                                variant="outline"
                                onClick={() => navigate('/login')}
                                className="w-full"
                            >
                                Go to Login
                            </GlassButton>
                        </div>
                    </motion.div>
                )}
            </GlassCard>
        </div>
    );
};

export default VerifyEmail;