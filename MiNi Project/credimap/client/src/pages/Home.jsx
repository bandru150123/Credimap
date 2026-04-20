import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Zap, Globe, Github } from 'lucide-react';

/**
 * High-Fidelity Landing Page for CrediTrack
 * Features premium animations, value propositions, and clean navigation
 */
export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen text-white relative overflow-hidden">
            {/* Header / Navbar */}
            <header className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                        C
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-gradient">
                        CrediTrack
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate('/login')}
                        className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => navigate('/signup')}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        Join Now
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="pt-32 px-6 pb-20 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        <Sparkles className="w-3 h-3" /> Empowering the next generation of builders
                    </div>
                    
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4 italic">
                        BUILD YOUR <br/>
                        <span className="text-gradient">DIGITAL TRUST.</span>
                    </h2>
                    
                    <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
                        The AI-powered portfolio platform that extracts skills from your certificates, 
                        validates your expertise, and connects you to the world.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            Start Building Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 hover:border-white/20"
                        >
                            View Examples
                        </button>
                    </div>
                </motion.div>

                {/* Dashboard Preview Mockup */}
                <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="mt-24 w-full max-w-5xl glass-morphism rounded-[3rem] border-white/10 overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] p-2 bg-gradient-to-br from-white/5 to-transparent"
                >
                    <div className="rounded-[2.5rem] overflow-hidden bg-[#020617] border border-white/5 aspect-video relative">
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20">
                                    <Globe className="w-10 h-10 text-blue-400 animate-pulse" />
                                </div>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Interactive Dashboard Live Preview</p>
                            </div>
                         </div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
                    <div className="glass-morphism p-8 rounded-3xl space-y-4 border-white/5 hover:border-blue-500/30 transition-all group">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">AI Extraction</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                            Upload your certifications and let our neural networks extract and validate your skill set automatically.
                        </p>
                    </div>

                    <div className="glass-morphism p-8 rounded-3xl space-y-4 border-white/5 hover:border-purple-500/30 transition-all group">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Verified Trust</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                            Every project and claim is backed by the Trust Score system, helping profiles stand out to top-tier recruiters.
                        </p>
                    </div>

                    <div className="glass-morphism p-8 rounded-3xl space-y-4 border-white/5 hover:border-emerald-500/30 transition-all group">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Instant Hosting</h3>
                        <p className="text-2xl font-black tracking-tighter text-emerald-400">99.9% uptime</p>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                            Deploy your professional portfolio to a private link in seconds with our optimized Vercel-like pipeline.
                        </p>
                    </div>
                </section>

                {/* CTA Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full"></div>
            </main>

            {/* Footer */}
            <footer className="px-6 py-12 border-t border-white/5 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Github className="w-4 h-4 text-gray-500" />
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Built for the future of building</span>
                </div>
                <p className="text-gray-600 text-xs font-medium">© 2026 CrediTrack. All rights reserved.</p>
            </footer>
        </div>
    );
}
