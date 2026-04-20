import React, { useState } from 'react';
import { THEMES, THEME_CATEGORIES } from '../../config/themes.config';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Sparkles, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

/**
 * Premium Theme Browser Section
 * Categorized 3D background selection with real-time preview
 */
export default function ThemesSection() {
    const { user, updateUser } = useAuth();
    const [activeCategory, setActiveCategory] = useState("All");
    const [loadingTheme, setLoadingTheme] = useState(null);

    const currentThemeId = user?.selectedTheme || 'default';

    const handleSelectTheme = async (themeId) => {
        try {
            setLoadingTheme(themeId);
            const res = await axios.put('/api/user/theme', { themeId });
            updateUser(res.data); // Synchronize full user state
        } catch (err) {
            console.error('Failed to update theme:', err);
        } finally {
            setLoadingTheme(null);
        }
    };

    const filteredThemes = Object.entries(THEMES).filter(([id, config]) =>
        activeCategory === "All" || config.category === activeCategory
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Palette className="text-blue-500" /> Visual Themes
                    </h2>
                    <p className="text-gray-400">Personalize your portfolio with immersive 3D environments.</p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                    {THEME_CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === cat
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredThemes.map(([id, config]) => (
                    <motion.div
                        key={id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${currentThemeId === id
                            ? 'border-blue-500 bg-blue-500/5 ring-4 ring-blue-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/30'
                            }`}
                    >
                        {/* Visual Preview Placeholder */}
                        <div
                            className="h-40 w-full relative overflow-hidden bg-cover bg-center"
                            style={{ backgroundColor: config.colors[2] }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                            {/* Simulated 3D Elements Preview */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex gap-2">
                                    {config.colors.slice(0, 2).map((c, i) => (
                                        <div
                                            key={i}
                                            className="w-4 h-4 rounded-full blur-sm animate-pulse"
                                            style={{ backgroundColor: c, animationDelay: `${i * 0.5}s` }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {currentThemeId === id && (
                                <div className="absolute top-4 right-4 bg-blue-500 text-white p-1.5 rounded-full">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        <div className="p-3 space-y-2">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white uppercase tracking-wider">{config.name}</h3>
                                <span className="text-[10px] font-bold px-2 py-1 bg-white/10 text-gray-400 rounded-full uppercase tracking-tighter">
                                    {config.category}
                                </span>
                            </div>

                            <button
                                onClick={() => handleSelectTheme(id)}
                                disabled={currentThemeId === id || loadingTheme === id}
                                className={`w-full py-1 rounded-md font-black uppercase tracking-[0.1em] text-[9px] transition-all duration-300 ${currentThemeId === id
                                    ? 'bg-blue-500/20 text-blue-400 cursor-default border border-blue-500/30'
                                    : 'bg-white text-black hover:bg-blue-600 hover:text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'
                                    }`}
                            >
                                {loadingTheme === id ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        <span>Designing...</span>
                                    </div>
                                ) : currentThemeId === id ? 'Active Experience' : 'Deploy Theme'}
                            </button>
                        </div>

                        {id === 'galaxy' && (
                            <div className="absolute top-0 left-0 p-2">
                                <Sparkles className="w-4 h-4 text-pink-400" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
