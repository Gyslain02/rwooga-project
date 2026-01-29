import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, ShieldAlert, ShieldCheck } from 'lucide-react';

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
            navigate('/');
        } else {
            setError('Invalid email or password');
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
            setStep(2);
        } else {
            setError('This email address is not registered.');
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
            setTimeout(() => {
                setStep(0);
                setSuccess('');
                setPassword('');
            }, 2000);
        } else if (email === 'admin@rwooga.com') {
            setSuccess('Admin password would be updated in a real system. Redirecting to login...');
            setTimeout(() => {
                setStep(0);
                setSuccess('');
            }, 2000);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full glass p-8 rounded-3xl border border-gray-100 shadow-xl transition-all duration-300">
                {step === 0 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-brand-dark rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                                <LogIn size={32} />
                            </div>
                            <h2 className="text-3xl font-display font-bold text-brand-dark">Welcome Back</h2>
                            <p className="text-gray-500 mt-2">Login to your Rwooga account</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center space-x-3 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                <ShieldAlert size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-700">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-xs text-brand-cyan font-bold hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
                            >
                                Log In
                            </button>
                        </form>

                        <div className="mt-8 text-center text-gray-500">
                            <p>Don't have an account? <Link to="/signup" className="text-brand-cyan font-bold hover:underline">Sign Up</Link></p>
                        </div>
                    </>
                )}

                {step === 1 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-brand-cyan rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                                <ShieldAlert size={32} />
                            </div>
                            <h2 className="text-3xl font-display font-bold text-brand-dark">Request Reset</h2>
                            <p className="text-gray-500 mt-2">Enter your email to receive a reset code</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center space-x-3 text-sm font-medium">
                                <ShieldAlert size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleRequestReset} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
                            >
                                Send Reset Code
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(0)}
                                className="w-full text-gray-500 font-medium hover:text-brand-dark transition-colors"
                            >
                                Back to Login
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                                <ShieldCheck size={32} />
                            </div>
                            <h2 className="text-3xl font-display font-bold text-brand-dark">Set New Password</h2>
                            <p className="text-gray-500 mt-2">Enter the code and your new password</p>
                        </div>

                        {success && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center space-x-3 text-sm font-medium">
                                <ShieldCheck size={18} />
                                <span>{success}</span>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center space-x-3 text-sm font-medium">
                                <ShieldAlert size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        {!success.includes('Updated') && (
                            <form onSubmit={handleResetPassword} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Verification Code</label>
                                    <input
                                        type="text"
                                        value={resetCode}
                                        onChange={(e) => setResetCode(e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                                        placeholder="123456"
                                        required
                                    />
                                    <p className="text-xs text-brand-cyan mt-2">Tip: Use 123456 for demo</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
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
