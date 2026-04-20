import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

/**
 * Premium Login Page
 * Features entry animations, glassmorphism, and seamless auth integration
 */
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid credentials');
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
                    <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Empowering Talent with AI</p>
                </Link>

                <div className="glass-morphism p-8 rounded-[1.5rem] relative overflow-hidden group border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

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

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 ml-1">
                                    <Mail className="w-3 h-3 text-blue-500" />
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Email Workspace</label>
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="yourname@example.com"
                                    className="input-premium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 ml-1">
                                    <Lock className="w-3 h-3 text-blue-500" />
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Access Key</label>
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="Enter secure password"
                                    className="input-premium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-300 shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_30px_rgba(37,99,235,0.4)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Decorative glow in background */}
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/10 blur-[80px] pointer-events-none"></div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8 text-gray-500 font-medium"
                >
                    Don't have an account? {' '}
                    <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Create one for free
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    );
}
