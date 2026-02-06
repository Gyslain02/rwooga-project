import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyEmail: React.FC = () => {
    const { email: emailParam, token: tokenParam } = useParams<{ email?: string; token?: string }>();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || emailParam;
    const token = searchParams.get('token') || tokenParam;

    const navigate = useNavigate();
    const { verifyEmail, loading, error } = useAuth();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

    useEffect(() => {
        if (email && token) {
            verifyEmail(email, token)
                .then(() => {
                    setStatus('success');
                    toast.success('Email verified successfully! You can now log in.');
                    setTimeout(() => {
                        navigate('/login');
                    }, 4000);
                })
                .catch((err) => {
                    setStatus('error');
                    toast.error(err.message || 'Verification failed');
                });
        } else {
            setStatus('error');
        }
    }, [email, token, verifyEmail, navigate]);

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center">
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
                        <p className="text-gray-400 text-sm">Your email has been verified. You will be redirected to the login page in a few seconds to sign in to your account.</p>
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
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-6 px-8 py-3 bg-brand-primary text-black font-bold rounded-full hover:scale-105 transition-all text-sm"
                        >
                            Go to Login
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;