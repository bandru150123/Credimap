import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BackgroundCanvas from '../components/3d/BackgroundCanvas';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ExternalLink, Award, Book, Briefcase, User, Sparkles, CheckCircle } from 'lucide-react';

/**
 * Premium Portfolio Page
 * Dynamically rendered based on backend user data and theme
 * Features: 3D background, animated sections, glassmorphism, recruiter-grade layout
 */
export default function PortfolioPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/public/${id}`);
                setData(res.data);
            } catch (err) {
                console.error('Failed to fetch portfolio data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const { user, projects, certificates } = data || {};

    return (
        <div className="relative min-h-screen text-white overflow-x-hidden">
            {/* Background renders immediately with default theme if data is still loading */}
            <BackgroundCanvas
                key={user?.selectedTheme || 'loading'}
                theme={user?.selectedTheme || 'default'}
            />

            {loading ? (
                <div className="min-h-screen flex items-center justify-center relative z-20">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                </div>
            ) : !data ? (
                <div className="min-h-screen flex items-center justify-center text-white relative z-20">
                    <h1 className="text-2xl font-bold glass-morphism p-8 rounded-[2rem]">Portfolio Not Found</h1>
                </div>
            ) : (
                <>
                    {/* Main Content Scroll Container */}
                    <main className="relative z-10 max-w-6xl mx-auto px-6 space-y-32">

                        {/* HERO SECTION */}
                        <section className="min-h-screen flex flex-col justify-center items-center text-center space-y-12 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-xs font-black uppercase tracking-[0.4em] text-blue-500"
                                    >
                                        Professional Portfolio
                                    </motion.span>
                                    <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20">
                                        {user.name.split(' ')[0]}
                                    </h1>
                                </div>
                                <p className="text-2xl md:text-4xl text-gray-400 font-light tracking-[0.2em] uppercase max-w-3xl mx-auto">
                                    {user.profileDetails?.title || user.profileDetails?.headline || 'Creative Developer'}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 1 }}
                                className="flex gap-10 items-center justify-center p-4 glass-morphism rounded-full px-8"
                            >
                                {user.profileDetails?.socialLinks?.github && (
                                    <a href={user.profileDetails.socialLinks.github} target="_blank" className="hover:text-blue-400 transition-all hover:scale-110">
                                        <Github className="w-6 h-6" />
                                    </a>
                                )}
                                {user.profileDetails?.socialLinks?.linkedin && (
                                    <a href={user.profileDetails.socialLinks.linkedin} target="_blank" className="hover:text-blue-400 transition-all hover:scale-110">
                                        <Linkedin className="w-6 h-6" />
                                    </a>
                                )}
                                <a href={`mailto:${user.email}`} className="hover:text-blue-400 transition-all hover:scale-110">
                                    <Mail className="w-6 h-6" />
                                </a>
                            </motion.div>

                            {/* Scroll Indicator */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                            >
                                <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Scroll to explore</span>
                                <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent"></div>
                            </motion.div>
                        </section>

                        {/* ABOUT SECTION */}
                        <section className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                whileInView={{ opacity: 1, x: 0 }}
                                initial={{ opacity: 0, x: -50 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4">
                                        <div className="w-12 h-1 bg-blue-500"></div>
                                        Behind the Code
                                    </h2>
                                </div>
                                <p className="text-2xl text-gray-400 leading-relaxed font-light">
                                    {user.profileDetails?.bio || 'Professional journey focused on delivering excellence through code and design.'}
                                </p>
                            </motion.div>

                            <motion.div
                                whileInView={{ opacity: 1, scale: 1 }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                viewport={{ once: true }}
                                className="glass-morphism p-12 rounded-[3rem] border border-white/5 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[80px] group-hover:bg-blue-500/20 transition-all duration-700"></div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-8 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" /> Core Expertise
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {(user.manualSkills || []).map((skill, i) => (
                                        <motion.span
                                            key={skill._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold tracking-widest uppercase hover:border-blue-500/50 hover:bg-blue-500/10 transition-all cursor-default"
                                        >
                                            {skill.name}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        </section>

                        {/* CERTIFICATIONS SECTION */}
                        {(certificates && certificates.length > 0) && (
                            <section className="space-y-16 py-20">
                                <div className="text-center space-y-4">
                                    <motion.h2
                                        whileInView={{ opacity: 1, y: 0 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        className="text-6xl font-black uppercase tracking-tighter text-blue-500"
                                    >
                                        Verified Assets
                                    </motion.h2>
                                    <p className="text-gray-500 uppercase tracking-widest text-xs font-bold italic">AI-Validated Professional Credentials</p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {certificates.map((cert, i) => (
                                        <motion.div
                                            key={cert._id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="glass-morphism-dark p-8 rounded-[2rem] border border-blue-500/10 hover:border-blue-500/40 hover:scale-[1.02] transition-all group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                                                <Award className="w-16 h-16 text-blue-500" />
                                            </div>

                                            <div className="space-y-6 relative z-10">
                                                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                                                    <CheckCircle className="w-6 h-6 text-blue-400" />
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">{cert.name}</h3>
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Skill Validation Complete</p>
                                                </div>

                                                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                                    {cert.demoSkillData.skills.slice(0, 3).map(skill => (
                                                        <span key={skill} className="text-[9px] font-black px-2 py-1 bg-white/5 rounded-full border border-white/10 uppercase tracking-widest text-blue-400">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* PROJECTS SECTION */}
                        <section className="space-y-16 py-20">
                            <div className="text-center space-y-4">
                                <motion.h2
                                    whileInView={{ opacity: 1, y: 0 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    className="text-6xl font-black uppercase tracking-tighter"
                                >
                                    Featured Creations
                                </motion.h2>
                                <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">A selection of my most impactful work</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                {projects.map((project, i) => (
                                    <motion.div
                                        key={project._id}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.2, duration: 0.8 }}
                                        className="glass-morphism-dark group overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all duration-500"
                                    >
                                        <div className="p-10 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <h3 className="text-3xl font-black group-hover:text-blue-400 transition-colors uppercase tracking-widest">{project.name}</h3>
                                                    <div className="w-8 h-1 bg-blue-500/50 group-hover:w-16 transition-all duration-500"></div>
                                                </div>
                                                <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/5">
                                                    {project.githubLink && <a href={project.githubLink} className="p-2 hover:bg-blue-500/20 rounded-xl transition-all"><Github className="w-5 h-5" /></a>}
                                                    {project.deployedLink && <a href={project.deployedLink} className="p-2 hover:bg-blue-500/20 rounded-xl transition-all"><ExternalLink className="w-5 h-5" /></a>}
                                                </div>
                                            </div>
                                            <p className="text-gray-400 leading-relaxed text-lg font-light">{project.description}</p>
                                            <div className="flex flex-wrap gap-3 pt-4">
                                                {project.techStack.map(tech => (
                                                    <span key={tech} className="text-[10px] font-black px-3 py-1.5 bg-white/5 text-gray-400 rounded-full border border-white/10 uppercase tracking-widest group-hover:border-blue-500/20">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* EXPERIENCE & EDUCATION */}
                        <div className="grid md:grid-cols-2 gap-20">
                            {/* Experience */}
                            <section className="space-y-12">
                                <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                                    <div className="w-8 h-1 bg-blue-500"></div>
                                    Experience
                                </h2>
                                <div className="space-y-12 pl-8 border-l border-white/5 relative">
                                    {(user.experience || []).length > 0 ? user.experience.map((exp, i) => (
                                        <motion.div
                                            key={exp._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="relative group"
                                        >
                                            <div className="absolute -left-[37px] top-2 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] group-hover:scale-150 transition-transform duration-500"></div>
                                            <div className="space-y-2">
                                                <h4 className="text-2xl font-black uppercase tracking-widest text-white">{exp.position}</h4>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">{exp.company}</p>
                                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                                        {new Date(exp.startDate).getFullYear()} — {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}
                                                    </p>
                                                </div>
                                                <p className="text-gray-400 leading-relaxed font-light text-sm pt-2">{exp.description}</p>
                                            </div>
                                        </motion.div>
                                    )) : <p className="text-gray-500 italic">No experience added yet.</p>}
                                </div>
                            </section>

                            {/* Education */}
                            <section className="space-y-12">
                                <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                                    <div className="w-8 h-1 bg-indigo-500"></div>
                                    Education
                                </h2>
                                <div className="space-y-12 pl-8 border-l border-white/5 relative">
                                    {(user.education || []).length > 0 ? user.education.map((edu, i) => (
                                        <motion.div
                                            key={edu._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="relative group"
                                        >
                                            <div className="absolute -left-[37px] top-2 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] group-hover:scale-150 transition-transform duration-500"></div>
                                            <div className="space-y-2">
                                                <h4 className="text-2xl font-black uppercase tracking-widest text-white">{edu.degree}</h4>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">{edu.institution}</p>
                                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                                        {new Date(edu.startDate).getFullYear()} — {new Date(edu.endDate).getFullYear()}
                                                    </p>
                                                </div>
                                                <p className="text-gray-400 leading-relaxed font-light text-sm pt-2">{edu.field}</p>
                                            </div>
                                        </motion.div>
                                    )) : <p className="text-gray-500 italic">No education added yet.</p>}
                                </div>
                            </section>
                        </div>

                        {/* FOOTER / CONTACT */}
                        <footer className="pt-32 pb-20 border-t border-white/10 text-center space-y-6">
                            <p className="text-gray-500">© {new Date().getFullYear()} {user.name}. Generated by CrediTrack.</p>
                            <div className="flex justify-center gap-8 text-sm font-bold tracking-widest uppercase text-gray-400">
                                <a href={`mailto:${user.email}`} className="hover:text-blue-400 transition-colors">Email</a>
                                {user.profileDetails?.socialLinks?.linkedin && <a href={user.profileDetails.socialLinks.linkedin} className="hover:text-blue-400 transition-colors">LinkedIn</a>}
                                {user.profileDetails?.socialLinks?.github && <a href={user.profileDetails.socialLinks.github} className="hover:text-blue-400 transition-colors">GitHub</a>}
                            </div>
                        </footer>
                    </main>
                </>
            )}
        </div>
    );
}
