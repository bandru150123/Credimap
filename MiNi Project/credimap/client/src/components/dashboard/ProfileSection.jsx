import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, MapPin, Briefcase, Globe, Github, Linkedin, Twitter, Save, Loader2, Camera, CheckCircle2, X, Sparkles, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ImageCropModal from './ImageCropModal';
import { locationData } from '../../config/LocationData';

/**
 * Premium Profile Management Section
 * Features organized grid layout, glassmorphism inputs, and real-time persistence
 */
export default function ProfileSection() {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        headline: user?.profileDetails?.headline || '',
        bio: user?.profileDetails?.bio || '',
        location: user?.profileDetails?.location || '',
        github: user?.profileDetails?.socialLinks?.github || '',
        linkedin: user?.profileDetails?.socialLinks?.linkedin || '',
        twitter: user?.profileDetails?.socialLinks?.twitter || ''
    });

    const [isEnhancing, setIsEnhancing] = useState({ headline: false, bio: false });

    const enhanceField = (field) => {
        setIsEnhancing(prev => ({ ...prev, [field]: true }));
        
        // Simulate AI intelligence derived from user data
        setTimeout(() => {
            let result = '';
            if (field === 'headline') {
                const topExp = user?.experience?.[0];
                const topSkill = user?.manualSkills?.[0]?.name;
                result = topExp 
                    ? `${topExp.position} at ${topExp.company}${topSkill ? ` | ${topSkill} Specialist` : ''}`
                    : `Passionate ${topSkill || 'Professional'} | Building the future`;
            } else if (field === 'bio') {
                const skills = user?.manualSkills?.slice(0, 3).map(s => s.name).join(', ');
                result = `Experienced professional dedicated to delivering high-quality solutions${skills ? ` with expertise in ${skills}` : ''}. Passionate about innovation and continuous learning in the technology space.`;
            }
            
            setFormData(prev => ({ ...prev, [field]: result }));
            setIsEnhancing(prev => ({ ...prev, [field]: false }));
        }, 1200);
    };

    const [imagePreview, setImagePreview] = useState(user?.profileDetails?.avatar || null);
    const [rawImage, setRawImage] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    
    const fileInputRef = useRef(null);

    // Dependent Dropdown State
    const states = Object.keys(locationData);
    const [selectedState, setSelectedState] = useState('');
    const citiesList = useMemo(() => {
        return selectedState ? locationData[selectedState] : [];
    }, [selectedState]);

    useEffect(() => {
        // Try to pre-select state if location exists
        if (formData.location && !selectedState) {
            for (const state of states) {
                if (formData.location.includes(state) || locationData[state].some(city => formData.location.includes(city))) {
                    setSelectedState(state);
                    break;
                }
            }
        }
    }, [formData.location]);

    const completionStats = useMemo(() => {
        const fields = [
            formData.name,
            formData.headline,
            formData.bio,
            formData.location,
            formData.github,
            formData.linkedin,
            formData.twitter,
            imagePreview
        ];
        const filledFields = fields.filter(field => field && field.toString().trim() !== '').length;
        return Math.round((filledFields / fields.length) * 100);
    }, [formData, imagePreview]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setRawImage(reader.result);
                setIsCropping(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedImage) => {
        setImagePreview(croppedImage);
        setIsCropping(false);
        setRawImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            const res = await axios.put('/api/user/profile', {
                name: formData.name,
                profileDetails: {
                    headline: formData.headline,
                    bio: formData.bio,
                    location: formData.location,
                    avatar: imagePreview,
                    socialLinks: {
                        github: formData.github,
                        linkedin: formData.linkedin,
                        twitter: formData.twitter
                    }
                }
            });
            updateUser(res.data);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to update profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-blue-500/50 focus:bg-white/10 transition-all outline-none";

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="relative group">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center text-4xl font-black text-white overflow-hidden">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                formData.name.charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="absolute -bottom-2 -right-2 p-3 bg-white text-black rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all z-10"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-1">Public Profile</h2>
                            <p className="text-gray-400 text-sm">Manage how recruiters and peers see your professional identity.</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2 block">Profile Completion</span>
                            <div className="flex items-center gap-3">
                                <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${completionStats}%` }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                                    />
                                </div>
                                <span className="text-sm font-bold text-white whitespace-nowrap">{completionStats}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="glass-morphism p-5 rounded-xl space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-6 flex items-center gap-2">
                        <User className="w-4 h-4" /> Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500 ml-1">Full Name</label>
                            <input
                                className={inputClasses}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center mr-1">
                                <label className="text-sm font-medium text-gray-500 ml-1">Headline</label>
                                <button 
                                    type="button"
                                    onClick={() => enhanceField('headline')}
                                    className="text-[10px] font-bold text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors uppercase tracking-tight"
                                >
                                    {isEnhancing.headline ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                    AI Enhance
                                </button>
                            </div>
                            <input
                                className={inputClasses}
                                value={formData.headline}
                                onChange={e => setFormData({ ...formData, headline: e.target.value })}
                                placeholder="E.g. Full Stack Developer"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center mr-1">
                            <label className="text-sm font-medium text-gray-500 ml-1">Professional Bio</label>
                            <button 
                                type="button"
                                onClick={() => enhanceField('bio')}
                                className="text-[10px] font-bold text-purple-400 flex items-center gap-1 hover:text-purple-300 transition-colors uppercase tracking-tight"
                            >
                                {isEnhancing.bio ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                Smart Draft
                            </button>
                        </div>
                        <textarea
                            className={`${inputClasses} resize-none`}
                            rows={4}
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell your professional story..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500 ml-1">State</label>
                            <select
                                className={inputClasses}
                                style={{ colorScheme: 'dark' }}
                                value={selectedState}
                                onChange={e => setSelectedState(e.target.value)}
                            >
                                <option value="" className="bg-[#0f172a]">Select State</option>
                                {states.map(state => (
                                    <option key={state} value={state} className="bg-[#0f172a]">{state}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500 ml-1">City</label>
                            <select
                                className={inputClasses}
                                style={{ colorScheme: 'dark' }}
                                value={formData.location.split(',')[0].trim()}
                                onChange={e => setFormData({ ...formData, location: `${e.target.value}${selectedState ? ', ' + selectedState : ''}` })}
                                disabled={!selectedState}
                            >
                                <option value="" className="bg-[#0f172a]">Select City</option>
                                {citiesList.map(city => (
                                    <option key={city} value={city} className="bg-[#0f172a]">{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="glass-morphism p-5 rounded-xl space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-purple-400 mb-6 flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Social Presence
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative group">
                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                className={`${inputClasses} pl-12`}
                                value={formData.github}
                                onChange={e => setFormData({ ...formData, github: e.target.value })}
                                placeholder="GitHub Profile"
                            />
                        </div>
                        <div className="relative group">
                            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                className={`${inputClasses} pl-12`}
                                value={formData.linkedin}
                                onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                                placeholder="LinkedIn Profile"
                            />
                        </div>
                        <div className="relative group">
                            <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                className={`${inputClasses} pl-12`}
                                value={formData.twitter}
                                onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                                placeholder="Twitter Handle"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                    <p className={`text-sm font-medium transition-opacity ${success ? 'text-emerald-400 opacity-100' : 'opacity-0'}`}>
                        Profile updated successfully
                    </p>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* Image Crop Modal */}
            {isCropping && (
                <ImageCropModal
                    image={rawImage}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setIsCropping(false)}
                />
            )}

            {/* Success Popup */}
            <AnimatePresence>
                {showSuccessPopup && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto"
                        >
                            <CheckCircle2 className="w-6 h-6" />
                            <div className="flex-1">
                                <p className="font-bold">Profile Updated!</p>
                                <p className="text-sm opacity-90">Your changes have been saved successfully.</p>
                            </div>
                            <button 
                                onClick={() => setShowSuccessPopup(false)}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
