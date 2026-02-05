import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Signup: React.FC = () => {
    const { register, loading, error: authError, clearError } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match');
            return;
        }

        // Keep frontend password validation as a first line of defense
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError('Password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol');
            toast.error('Password is too weak');
            return;
        }

        try {
            // Clean phone number: remove non-digits and take last 10
            const cleanedPhone = formData.phone.replace(/\D/g, '').slice(-10);

            if (cleanedPhone.length < 10) {
                setError('Please enter a valid 10-digit phone number');
                return;
            }

            // Check if email already exists
            try {
                await authService.checkEmailExists(formData.email);
                // If we get here without error, email exists
                setError('This email is already registered. Please use a different email or try logging in.');
                toast.error('Email already registered');
                return;
            } catch (err: any) {
                // If error is "not found" or "does not exist", that's good - we can proceed
                if (err.message && err.message.includes('does not exist')) {
                    // Email is available, proceed
                } else if (err.message && err.message.includes('not found')) {
                    // Email is available, proceed
                } else {
                    // Some other error occurred
                    console.log('Email check result:', err.message);
                }
            }

            clearError();
            const res = await register({
                full_name: formData.name,
                email: formData.email,
                phone_number: cleanedPhone,
                password: formData.password,
                password_confirm: formData.confirmPassword
            });
 
            if (res.ok) {

                toast.success('Account created! Please check your email for verification.');
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } else {
                toast.error(res.message || 'Registration failed');
            }
        } catch (err: any) {
            console.error('Signup Error:', err);
            setError(err || 'Registration failed');
            toast.error(err || 'Registration failed');
        }
    };

    return (
        <div className="bg-brand-dark min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full bg-[#111418] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl relative z-10 transition-all duration-300">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-display font-bold text-white mb-3">Create Account</h2>
                    <p className="text-gray-400">Join our studio to start your journey</p>
                </div>

                {(error || authError) && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center space-x-3 text-sm font-bold">
                        <span>{error || authError}</span>
                    </div>
                )}

                {success ? (
                    <div className="text-center py-10 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Account Created</h3>
                        <p className="text-gray-400">Please check your email to verify your account. Redirecting to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 ml-1">Full Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 ml-1">Phone Number</label>
                            <input
                                required
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                placeholder="07..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 ml-1">Email Address</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div className="px-1 py-2 space-y-1">
                                <p className="text-[10px] text-gray-500 font-medium leading-tight">
                                    • Must be at least 8 characters<br />
                                    • Mix of uppercase, lowercase, numbers & symbols
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 ml-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    required
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                    placeholder="••••••••"
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-primary text-black font-bold text-lg py-4 rounded-2xl hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-brand-primary/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                                    Creating Account...
                                </>
                            ) : 'Create Account'}
                        </button>
                    </form>
                )}

                {!success && (
                    <div className="mt-8 text-center text-gray-500 text-sm font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-primary font-bold hover:text-white transition-colors">Log In</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signup;
