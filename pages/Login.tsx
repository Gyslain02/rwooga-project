import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [step, setStep] = useState(0); // 0: Login, 1: Request Reset, 2: Verify & New Password
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (email === 'admin@rwooga.com' && password === 'admin123') {
            localStorage.setItem('rwooga_user', JSON.stringify({ email, role: 'admin', name: 'Admin' }));
            navigate('/admin');
            return;
        }

        const users = JSON.parse(localStorage.getItem('rwooga_users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('rwooga_user', JSON.stringify({ ...user, role: 'user' }));
            toast.success(`Welcome back, ${user.name}!`);
            navigate('/');
        } else {
            setError('Invalid email or password');
            toast.error('Invalid email or password');
        }
    };

    const handleRequestReset = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const users = JSON.parse(localStorage.getItem('rwooga_users') || '[]');
        const userExists = users.find((u: any) => u.email === email) || email === 'admin@rwooga.com';

        if (userExists) {
            setSuccess('Reset code sent to your email.');
            toast.success('Reset code sent to your email.');
            setStep(2);
        } else {
            setError('This email address is not registered.');
            toast.error('This email address is not registered.');
        }
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (resetCode !== '123456') { // Mock code for demo
            setError('Invalid reset code');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match');
            return;
        }

        const users = JSON.parse(localStorage.getItem('rwooga_users') || '[]');
        const userIndex = users.findIndex((u: any) => u.email === email);

        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('rwooga_users', JSON.stringify(users));
            setSuccess('Password updated successfully! Redirecting to login...');
            toast.success('Password updated successfully!');
            setTimeout(() => {
                setStep(0);
                setSuccess('');
                setPassword('');
            }, 2000);
        } else if (email === 'admin@rwooga.com') {
            setSuccess('Admin password would be updated in a real system. Redirecting to login...');
            toast.success('Admin password update requested.');
            setTimeout(() => {
                setStep(0);
                setSuccess('');
            }, 2000);
        }
    };

    return (
        <div className="bg-brand-dark min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden relative">
            {/* Minimalist Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full bg-[#111418] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl relative z-10 transition-all duration-300">
                {step === 0 && (
                    <>
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
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 ml-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-sm font-bold text-brand-primary hover:text-white transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand-primary text-black font-bold text-lg py-4 rounded-2xl hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-brand-primary/20"
                            >
                                Log In
                            </button>
                        </form>

                        <div className="mt-8 text-center text-gray-500 text-sm font-medium">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-brand-primary font-bold hover:text-white transition-colors">Sign Up</Link>
                        </div>
                    </>
                )}

                {step === 1 && (
                    <>
                        <button
                            onClick={() => setStep(0)}
                            className="text-gray-500 hover:text-white transition-colors text-sm font-bold mb-8 flex items-center"
                        >
                            ← Back to Login
                        </button>
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-display font-bold text-white mb-3">Reset Password</h2>
                            <p className="text-gray-400">Enter your email to receive a code</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center space-x-3 text-sm font-bold">
                                <ShieldAlert size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleRequestReset} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand-primary text-black font-bold text-lg py-4 rounded-2xl hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-brand-primary/20"
                            >
                                Send Reset Code
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-display font-bold text-white mb-3">Create New Password</h2>
                            <p className="text-gray-400">Enter your code and new password</p>
                        </div>

                        {success && (
                            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center space-x-3 text-sm font-bold">
                                <ShieldCheck size={18} />
                                <span>{success}</span>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center space-x-3 text-sm font-bold">
                                <ShieldAlert size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        {!success.includes('Updated') && (
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-300 ml-1">Verification Code</label>
                                    <input
                                        type="text"
                                        value={resetCode}
                                        onChange={(e) => setResetCode(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                        placeholder="123456"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 ml-1">Use 123456 for demo</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-300 ml-1">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                        placeholder="New Password"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-300 ml-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                                        placeholder="Confirm Password"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-brand-primary text-black font-bold text-lg py-4 rounded-2xl hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-brand-primary/20"
                                >
                                    Update Password
                                </button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
