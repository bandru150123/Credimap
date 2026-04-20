import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight, RefreshCw } from 'lucide-react';

/**
 * Premium Signup Page
 * Clean, modern interface with smooth transitions and robust validation
 */
export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Error creating account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <Link to="/" className="text-center mb-10 space-y-2 block group">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl font-black tracking-tighter uppercase text-gradient group-hover:scale-105 transition-transform"
                    >
                        CrediTrack
                    </motion.h1>
                    <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Join the future of professional trust</p>
                </Link>

                <div className="glass-morphism p-8 rounded-[1.5rem] relative overflow-hidden group border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 ml-1">
                                    <User className="w-3 h-3 text-purple-500" />
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Legal Name</label>
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. John Doe"
                                    className="input-premium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 ml-1">
                                    <Mail className="w-3 h-3 text-purple-500" />
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Email Contact</label>
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="yourname@example.com"
                                    className="input-premium"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 ml-1">
                                        <Lock className="w-3 h-3 text-purple-500" />
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Access Key</label>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Min. 8 characters"
                                        className="input-premium"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 ml-1">
                                        <RefreshCw className="w-3 h-3 text-purple-500" />
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Verify</label>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Repeat Access Key"
                                        className="input-premium"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-300 shadow-[0_8px_20px_rgba(147,51,234,0.3)] hover:shadow-[0_12px_30px_rgba(147,51,234,0.4)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 blur-[80px] pointer-events-none"></div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8 text-gray-500 font-medium"
                >
                    Already have an account? {' '}
                    <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                        Sign In instead
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    );
}
