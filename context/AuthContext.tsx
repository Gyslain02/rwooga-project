
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (credentials: any) => Promise<void>;
    register: (userData: any) => Promise<any>;
    verifyEmail: (id: string, token: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (credentials: any) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('user', JSON.stringify(data.user));
        } catch (err: any) {
            setError(err.message || 'Login failed');
            throw err.message || 'Login failed';
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: any) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.register(userData);
            return data;
        } catch (err: any) {
            setError(err.message || 'Registration failed');
            throw err.message || 'Registration failed';
        } finally {
            setLoading(false);
        }
    };

    const verifyEmail = async (id: string, token: string) => {
        setLoading(true);
        setError(null);
        try {
            await authService.verifyEmail(id, token);
        } catch (err: any) {
            setError(err.message || 'Verification failed');
            throw err.message || 'Verification failed';
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        toast.success('Successfully logged out');
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, verifyEmail, logout, clearError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
