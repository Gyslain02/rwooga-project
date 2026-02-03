import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match');
            return;
        }

        const users = JSON.parse(localStorage.getItem('rwooga_users') || '[]');
        if (users.find((u: any) => u.email === formData.email)) {
            setError('Email already exists');
            toast.error('Email already exists');
            return;
        }

        const newUser = {
            id: Date.now(),
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            password: formData.password
        };

        users.push(newUser);
        localStorage.setItem('rwooga_users', JSON.stringify(users));

        setSuccess(true);
        toast.success('Account created successfully!');
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    return (
        <div className="bg-brand-dark min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full bg-[#111418] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl relative z-10 transition-all duration-300">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-display font-bold text-white mb-3">Create Account</h2>
                    <p className="text-gray-400">Join our studio to start your journey</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center space-x-3 text-sm font-bold">
                        <span>{error}</span>
                    </div>
                )}

                {success ? (
                    <div className="text-center py-10 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Account Created</h3>
                        <p className="text-gray-400">Redirecting to login...</p>
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
                                placeholder="+250..."
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
                            <input
                                required
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 ml-1">Confirm Password</label>
                            <input
                                required
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-brand-primary text-black font-bold text-lg py-4 rounded-2xl hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-brand-primary/20 mt-4"
                        >
                            Create Account
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
