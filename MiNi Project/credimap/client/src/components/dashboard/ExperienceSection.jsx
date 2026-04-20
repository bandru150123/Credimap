import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Plus, Trash2, Calendar, MapPin, Loader2, Save, ExternalLink, Github, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { locationData } from '../../config/LocationData';

/**
 * Premium Experience Management Section
 * Features timeline visualization, animated entry forms, and real-time syncing
 */
export default function ExperienceSection() {
    const { user, updateUser } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    // Dependent Dropdown State
    const states = Object.keys(locationData);
    const [selectedState, setSelectedState] = useState('');
    const citiesList = useMemo(() => {
        return selectedState ? locationData[selectedState] : [];
    }, [selectedState]);

    const [formData, setFormData] = useState({
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        projectLink: '',
        githubLink: ''
    });

    const experiences = user?.experience || [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/user/experience', formData);
            updateUser({ experience: res.data });
            setIsAdding(false);
            setFormData({ company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '', projectLink: '', githubLink: '' });
            setSelectedState('');
        } catch (err) {
            console.error('Failed to add experience:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`/api/user/experience/${id}`);
            updateUser({ experience: res.data });
        } catch (err) {
            console.error('Failed to delete experience:', err);
        }
    };

    const inputClasses = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500/50 outline-none transition-all";

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Briefcase className="text-blue-500" /> Work History
                    </h2>
                    <p className="text-gray-400">Document your professional journey and key achievements.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs transition-all shadow-lg shadow-blue-600/20 uppercase tracking-widest"
                >
                    <Plus className={`w-4 h-4 transition-transform ${isAdding ? 'rotate-45' : ''}`} />
                    {isAdding ? 'Cancel' : 'Add Experience'}
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-morphism p-5 rounded-xl border-blue-500/30"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Job Title</label>
                                    <input required className={inputClasses} placeholder="E.g. Senior Software Engineer" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Company</label>
                                    <input required className={inputClasses} placeholder="E.g. Google" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">State</label>
                                    <select
                                        className={inputClasses}
                                        style={{ colorScheme: 'dark' }}
                                        value={selectedState}
                                        onChange={e => setSelectedState(e.target.value)}
                                        required
                                    >
                                        <option value="" className="bg-[#0f172a]">Select State</option>
                                        {states.map(state => (
                                            <option key={state} value={state} className="bg-[#0f172a]">{state}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">City</label>
                                    <select
                                        className={inputClasses}
                                        style={{ colorScheme: 'dark' }}
                                        value={formData.location.split(',')[0].trim()}
                                        onChange={e => setFormData({ ...formData, location: `${e.target.value}${selectedState ? ', ' + selectedState : ''}` })}
                                        disabled={!selectedState}
                                        required
                                    >
                                        <option value="" className="bg-[#0f172a]">Select City</option>
                                        {citiesList.map(city => (
                                            <option key={city} value={city} className="bg-[#0f172a]">{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Start Date</label>
                                    <div className="date-input-wrapper">
                                        <Calendar />
                                        <input required type="date" className={inputClasses} value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">End Date</label>
                                    <div className="date-input-wrapper">
                                        <Calendar />
                                        <input disabled={formData.current} required={!formData.current} type="date" className={inputClasses} value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="current" className="w-5 h-5 rounded-lg accent-blue-500" checked={formData.current} onChange={e => setFormData({ ...formData, current: e.target.checked })} />
                                <label htmlFor="current" className="text-gray-400 font-medium cursor-pointer">I am currently working here</label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                        <ExternalLink className="w-3.5 h-3.5" /> Project / Live Link (Optional)
                                    </label>
                                    <input className={inputClasses} placeholder="https://projects.com/my-work" value={formData.projectLink} onChange={e => setFormData({ ...formData, projectLink: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                        <Github className="w-3.5 h-3.5" /> GitHub Repository (Optional)
                                    </label>
                                    <input className={inputClasses} placeholder="https://github.com/repo" value={formData.githubLink} onChange={e => setFormData({ ...formData, githubLink: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500">Description</label>
                                <textarea required rows={4} className={inputClasses} placeholder="Describe your roles and key accomplishments..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {loading ? 'Adding...' : 'Save Experience'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-gradient-to-b before:from-blue-500/50 before:via-purple-500/50 before:to-transparent">
                {experiences.length > 0 ? experiences.map((exp, i) => (
                    <motion.div
                        key={exp._id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="relative pl-16 group"
                    >
                        <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10 group-hover:scale-125 transition-transform" />
                        <div className="glass-morphism p-4 rounded-xl hover:border-blue-500/30 transition-all">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">{exp.position}</h3>
                                    <p className="text-blue-400 font-bold flex items-center gap-2">
                                        {exp.company}
                                        <span className="text-gray-600">|</span>
                                        <span className="text-gray-400 text-sm font-normal flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}
                                        </span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(exp._id)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            {exp.location && (
                                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {exp.location}
                                </p>
                            )}
                            <p className="text-gray-400 mt-4 leading-relaxed whitespace-pre-wrap">{exp.description}</p>

                            {(exp.projectLink || exp.githubLink) && (
                                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/5">
                                    {exp.projectLink && (
                                        <a href={exp.projectLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/5 px-2.5 py-1.5 rounded-lg border border-blue-500/10">
                                            <ExternalLink className="w-3.5 h-3.5" /> LIVE DEMO
                                        </a>
                                    )}
                                    {exp.githubLink && (
                                        <a href={exp.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/5 px-2.5 py-1.5 rounded-lg border border-purple-500/10">
                                            <Github className="w-3.5 h-3.5" /> VIEW SOURCE
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )) : (
                    <div className="col-span-full py-20 text-center glass-morphism rounded-3xl ml-16">
                        <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No professional history yet</h3>
                        <p className="text-gray-500 mt-2 text-sm italic">Add your work experience to boost your portfolio visibility.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
