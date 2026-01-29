import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ShieldCheck } from 'lucide-react';

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
            return;
        }

        const users = JSON.parse(localStorage.getItem('rwooga_users') || '[]');
        if (users.find((u: any) => u.email === formData.email)) {
            setError('Email already exists');
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
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full glass p-8 rounded-3xl border border-gray-100 shadow-xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand-cyan rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-brand-dark">Join Rwooga</h2>
                    <p className="text-gray-500 mt-2">Start your 3D journey today</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="text-center py-8 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-brand-dark mb-2">Account Created!</h3>
                        <p className="text-gray-500">Redirecting to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                                placeholder="+250..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm Password</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-brand-cyan text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg active:scale-[0.98] mt-4"
                        >
                            Create Account
                        </button>
                    </form>
                )}

                {!success && (
                    <div className="mt-8 text-center text-gray-500">
                        <p>Already have an account? <Link to="/login" className="text-brand-dark font-bold hover:underline">Log In</Link></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signup;
