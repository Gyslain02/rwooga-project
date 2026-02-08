import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';

const Login: React.FC = () => {
    const { login, loading, error: authError, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        clearError();

        try {
            await login({ email, password });

            toast.success(`Welcome back!`);
            navigate('/');
        } catch (err: any) {
            const errorMessage = err.message || 'Invalid email or password';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };



    return (
        <div className="bg-brand-dark min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden relative">

            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <GlassCard className="max-w-md w-full p-8 md:p-12 rounded-[32px] shadow-2xl relative z-10" variant="strong">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-display font-bold text-white mb-3">Welcome Back</h2>
                    <p className="text-gray-400">Enter your details to access your account</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center space-x-3 text-sm font-bold">
                        <ShieldAlert size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="glass-input w-full"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="glass-input w-full pr-12"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-bold text-brand-primary hover:text-white transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <GlassButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={loading}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </GlassButton>
                </form>

                <div className="mt-8 text-center text-gray-500 text-sm font-medium">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-brand-primary font-bold hover:text-white transition-colors">Sign Up</Link>
                </div>
            </GlassCard>
        </div>
    );
};

export default Login;
