import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Book, Plus, Trash2, Calendar, MapPin, Loader2, Save, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

/**
 * Premium Education Management Section
 * Features timeline visualization, animated entry forms, and real-time syncing
 */
export default function EducationSection() {
    const { user, updateUser } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        grade: ''
    });

    const education = user?.education || [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/user/education', formData);
            updateUser({ education: res.data });
            setIsAdding(false);
            setFormData({ institution: '', degree: '', field: '', startDate: '', endDate: '', grade: '' });
        } catch (err) {
            console.error('Failed to add education:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`/api/user/education/${id}`);
            updateUser({ education: res.data });
        } catch (err) {
            console.error('Failed to delete education:', err);
        }
    };

    const inputClasses = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500/50 outline-none transition-all";

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <GraduationCap className="text-indigo-500" /> Academic History
                    </h2>
                    <p className="text-gray-400">Highlight your educational background and certifications.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-widest"
                >
                    <Plus className={`w-4 h-4 transition-transform ${isAdding ? 'rotate-45' : ''}`} />
                    {isAdding ? 'Cancel' : 'Add Education'}
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-morphism p-5 rounded-xl border-indigo-500/30"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Institution</label>
                                    <input required className={inputClasses} placeholder="E.g. Stanford University" value={formData.institution} onChange={e => setFormData({ ...formData, institution: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Degree</label>
                                    <input required className={inputClasses} placeholder="E.g. Bachelor of Science" value={formData.degree} onChange={e => setFormData({ ...formData, degree: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Field of Study</label>
                                    <input required className={inputClasses} placeholder="E.g. Computer Science" value={formData.field} onChange={e => setFormData({ ...formData, field: e.target.value })} />
                                </div>
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
                                        <input required type="date" className={inputClasses} value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500">Grade / GPA (Optional)</label>
                                <input className={inputClasses} placeholder="E.g. 3.9/4.0 or First Class" value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })} />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {loading ? 'Adding...' : 'Save Education'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-blue-500/50 before:to-transparent">
                {education.length > 0 ? education.map((edu, i) => (
                    <motion.div
                        key={edu._id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="relative pl-16 group"
                    >
                        <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10 group-hover:scale-125 transition-transform" />
                        <div className="glass-morphism p-4 rounded-xl hover:border-indigo-500/30 transition-all">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">{edu.degree} in {edu.field}</h3>
                                    <p className="text-indigo-400 font-bold flex items-center gap-2">
                                        {edu.institution}
                                        <span className="text-gray-600">|</span>
                                        <span className="text-gray-400 text-sm font-normal flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                                        </span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(edu._id)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            {edu.grade && (
                                <p className="text-sm font-bold text-emerald-400 mt-2 flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">Grade: {edu.grade}</span>
                                </p>
                            )}
                        </div>
                    </motion.div>
                )) : (
                    <div className="col-span-full py-20 text-center glass-morphism rounded-3xl ml-16">
                        <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No education history added</h3>
                        <p className="text-gray-500 mt-2 text-sm italic">Showcase your academic foundations.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
