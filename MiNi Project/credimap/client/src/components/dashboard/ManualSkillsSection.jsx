import { useState, useRef, useEffect } from 'react';
import {
    X, Plus, Tag, ChevronDown, Check, Zap,
    Sparkles, TrendingUp, Loader2, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const SKILL_CATEGORIES = [
    'Frontend', 'Backend', 'DevOps', 'Database', 'Mobile',
    'Design', 'Testing', 'AI/ML', 'Cloud', 'General'
];

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

/**
 * Custom Dropdown for Glassmorphism UI
 */
const CustomSelect = ({ value, onChange, options, label, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative flex-1" ref={dropdownRef}>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 ml-1 block">
                {label}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white hover:bg-white/10 transition-all outline-none"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-3 h-3 text-blue-400" />}
                    <span>{value}</span>
                </div>
                <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[100] w-full mt-2 bg-[#0a1120] theme-dropdown-bg border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        {options.map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-xs hover:bg-blue-600/20 flex items-center justify-between group transition-colors"
                            >
                                <span className={value === opt ? 'text-blue-400 font-bold' : 'text-gray-400 group-hover:text-white'}>
                                    {opt}
                                </span>
                                {value === opt && <Check className="w-3 h-3 text-blue-400" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function ManualSkillsSection() {
    const { user, updateUser } = useAuth();
    const [skills, setSkills] = useState(user?.manualSkills || []);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState('');
    const [category, setCategory] = useState('General');
    const [proficiency, setProficiency] = useState('Intermediate');
    const [showToast, setShowToast] = useState(false);

    // Sync state with user context
    useEffect(() => {
        if (user?.manualSkills) {
            setSkills(user.manualSkills);
        }
    }, [user]);

    const addSkill = async () => {
        if (!input.trim()) return;
        setLoading(true);

        try {
            const res = await axios.post('/api/user/skills', {
                name: input.trim(),
                category,
                proficiency
            });
            updateUser({ ...user, manualSkills: res.data });
            setInput('');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (err) {
            console.error('Failed to add skill:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteSkill = async (skillId) => {
        try {
            const res = await axios.delete(`/api/user/skills/${skillId}`);
            updateUser({ ...user, manualSkills: res.data });
        } catch (err) {
            console.error('Failed to delete skill:', err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    const groupedSkills = (skills || []).reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {});

    return (
        <div className="animate-in fade-in duration-700 space-y-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div>
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                        <Tag className="w-7 h-7 text-blue-500" />
                        Skills Registry
                    </h3>
                    <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-[0.3em] font-bold">Industry competency mapping</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Expertise</p>
                    <p className="text-2xl font-black text-blue-400 leading-none">{skills.length}</p>
                </div>
            </div>

            {/* Input Dashboard */}
            <div className="glass-morphism p-8 rounded-[2.5rem] border border-white/5 relative z-20 group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10">
                    <div className="lg:col-span-5 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Expertise Name</label>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="e.g. React Native, PostgreSQL, Docker..."
                            className="input-premium py-3"
                        />
                    </div>

                    <div className="lg:col-span-3">
                        <CustomSelect
                            label="Domain"
                            value={category}
                            onChange={setCategory}
                            options={SKILL_CATEGORIES}
                            icon={Zap}
                        />
                    </div>

                    <div className="lg:col-span-3">
                        <CustomSelect
                            label="Maturity"
                            value={proficiency}
                            onChange={setProficiency}
                            options={PROFICIENCY_LEVELS}
                            icon={TrendingUp}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <button
                            onClick={addSkill}
                            disabled={loading || !input.trim()}
                            className="w-full h-10 bg-white text-black hover:bg-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-30 shadow-2xl active:scale-95 group/btn"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Skill Matrix */}
            <div className="space-y-12">
                {Object.keys(groupedSkills).length === 0 ? (
                    <div className="text-center py-24 glass-morphism rounded-[3rem] border border-white/5 bg-white/[0.01] space-y-8 animate-in fade-in zoom-in duration-700">
                        <div className="relative">
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner group hover:scale-110 transition-transform duration-500">
                                <Sparkles className="w-10 h-10 text-gray-700 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/10 blur-[60px] pointer-events-none"></div>
                        </div>
                        
                        <div className="space-y-2 px-4">
                            <h4 className="text-3xl font-black text-white italic tracking-tighter">🚀 No skills added yet</h4>
                            <p className="text-gray-500 text-xs font-medium max-w-xs mx-auto">
                                Add your skills or upload certificates to auto-detect them using AI
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6 mt-8">
                            <button 
                                onClick={() => document.querySelector('input[placeholder*="React"]').focus()}
                                className="w-full sm:w-auto px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Skill
                            </button>
                        </div>
                    </div>
                ) : (
                    Object.entries(groupedSkills).map(([cat, catSkills]) => (
                        <div key={cat} className="space-y-6">
                            <div className="flex items-center gap-4 px-2">
                                <span className="text-xs font-black text-white/40 uppercase tracking-[0.5em]">{cat}</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                                <span className="text-[10px] font-bold text-blue-500/50 uppercase tracking-widest">{catSkills.length} Units</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                <AnimatePresence mode="popLayout">
                                    {catSkills.map((skill) => (
                                        <motion.div
                                            key={skill._id}
                                            layout
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            className="group glass-morphism p-4 rounded-2xl border border-white/5 hover:border-blue-500/40 hover:bg-white/[0.05] transition-all duration-500 flex items-center gap-4 relative overflow-hidden"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                                <img
                                                    src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill.name.toLowerCase()}/${skill.name.toLowerCase()}-original.svg`}
                                                    alt=""
                                                    className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all duration-700"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                                <Tag className={`w-5 h-5 text-gray-600 ${skill.name.toLowerCase().includes('react') ? '' : ''}`}
                                                    style={{ display: 'none' }} // Placeholder if icon fails
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-white truncate leading-tight">{skill.name}</h4>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className={`w-1 h-1 rounded-full ${skill.proficiency === 'Expert' ? 'bg-purple-500' :
                                                        skill.proficiency === 'Advanced' ? 'bg-blue-500' :
                                                            skill.proficiency === 'Intermediate' ? 'bg-emerald-500' : 'bg-gray-500'
                                                        }`} />
                                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">
                                                        {skill.proficiency}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => deleteSkill(skill._id)}
                                                className="p-2 text-gray-700 hover:text-red-400 group-hover:translate-x-0 translate-x-12 transition-all duration-300"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showToast && (
                    <div className="fixed bottom-10 right-10 z-[100] pointer-events-none translate-x-0">
                        <motion.div
                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.8 }}
                            className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 pointer-events-auto"
                        >
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-xs uppercase tracking-widest">Skill Added</span>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

