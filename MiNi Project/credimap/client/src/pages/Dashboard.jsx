import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    User,
    Palette,
    Briefcase,
    GraduationCap,
    Award,
    LogOut,
    Menu,
    X,
    ExternalLink,
    ChevronRight,
    FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundCanvas from '../components/3d/BackgroundCanvas';

// Section Components
import OverviewSection from '../components/dashboard/OverviewSection';
import ProfileSection from '../components/dashboard/ProfileSection';
import ManualSkillsSection from '../components/dashboard/ManualSkillsSection';
import ThemesSection from '../components/dashboard/ThemesSection';
import ProjectsSection from '../components/dashboard/ProjectsSection';
import ExperienceSection from '../components/dashboard/ExperienceSection';
import EducationSection from '../components/dashboard/EducationSection';
import CertificatesSection from '../components/dashboard/CertificatesSection';

/**
 * High-Fidelity Dashboard
 * Unified management interface with smooth transitions and premium aesthetics
 */
export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { id: 'overview', name: 'Overview', icon: LayoutDashboard, color: 'text-blue-500' },
        { id: 'profile', name: 'Profile', icon: User, color: 'text-purple-500' },
        { id: 'certificates', name: 'Certificates', icon: FileCheck, color: 'text-rose-500' },
        { id: 'skills', name: 'Skills & AI', icon: Award, color: 'text-emerald-500' },
        { id: 'projects', name: 'Projects', icon: Briefcase, color: 'text-orange-500' },
        { id: 'experience', name: 'Experience', icon: Briefcase, color: 'text-pink-500' },
        { id: 'education', name: 'Education', icon: GraduationCap, color: 'text-indigo-500' },
        { id: 'themes', name: 'Visual Themes', icon: Palette, color: 'text-cyan-500' },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'overview': return <OverviewSection />;
            case 'profile': return <ProfileSection />;
            case 'certificates': return <CertificatesSection />;
            case 'skills': return <ManualSkillsSection />;
            case 'projects': return <ProjectsSection />;
            case 'experience': return <ExperienceSection />;
            case 'education': return <EducationSection />;
            case 'themes': return <ThemesSection />;
            default: return <OverviewSection />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative selection:bg-blue-500/30 bg-transparent">
            {/* Top Navigation Toolbar */}
            <header className="sticky top-0 z-50 w-full glass-morphism dark:bg-black/40 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-3 flex items-center justify-between transition-all duration-300">
                {/* Brand / Logo */}
                <div
                    onClick={() => setActiveSection('overview')}
                    className="flex items-center gap-3 cursor-pointer group"
                    title="Go to Overview"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-110">
                        {user?.name?.charAt(0) || 'C'}
                    </div>
                    <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 hidden sm:block transition-all duration-300 group-hover:from-blue-300 group-hover:to-indigo-300">
                        CrediTrack
                    </h1>
                </div>

                {/* Desktop Menu */}
                <nav className="hidden lg:flex items-center justify-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                    {menuItems.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                title={item.name}
                                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${isActive
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white/10 rounded-xl border border-white/10 shadow-sm"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className={`w-4 h-4 relative z-10 ${isActive ? item.color : ''}`} />
                                <span className="font-bold uppercase tracking-widest text-[9px] relative z-10 hidden xl:block mt-0.5">
                                    {item.name}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    <a
                        href={`/portfolio/${user?._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/20 transition-all font-bold text-[10px] uppercase tracking-widest group"
                    >
                        <div className="relative">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute inset-0"></div>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full relative"></div>
                        </div>
                        <span>Live Portfolio</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover:rotate-12 group-hover:scale-110 transition-transform" />
                    </a>

                    <button
                        onClick={logout}
                        title="Sign Out"
                        className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl border border-white/5"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden glass-morphism border-b border-white/5 overflow-hidden absolute top-[64px] left-0 w-full z-40 bg-[#0a0a0f]/95 backdrop-blur-xl"
                    >
                        <nav className="flex flex-col p-4 gap-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveSection(item.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={`flex items-center justify-between p-3.5 rounded-xl transition-all ${activeSection === item.id
                                        ? 'bg-white/10 text-white border border-white/5'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={`w-4 h-4 ${activeSection === item.id ? item.color : ''}`} />
                                        <span className="font-bold uppercase tracking-widest text-xs">{item.name}</span>
                                    </div>
                                    {activeSection === item.id && <ChevronRight className="w-4 h-4 text-gray-500" />}
                                </button>
                            ))}

                            <div className="h-px bg-white/5 my-2" />

                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <a
                                    href={`/portfolio/${user?._id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 p-3 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-500/20 font-bold text-[10px] uppercase tracking-widest"
                                >
                                    <span>Portfolio</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>

                                <button
                                    onClick={() => {
                                        setSidebarOpen(false);
                                        logout();
                                    }}
                                    className="flex items-center justify-center gap-2 p-3 text-red-400 bg-red-500/10 rounded-xl font-bold text-[10px] uppercase tracking-widest"
                                >
                                    <span>Sign Out</span>
                                    <LogOut className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 lg:p-10 relative z-0">
                <div className="max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
