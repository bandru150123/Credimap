import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, FileCheck, Briefcase, Zap, TrendingUp, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from 'recharts';

/**
 * Premium Overview Section
 * Displays analytics cards and skills distribution with high-fidelity charts
 */
export default function OverviewSection() {
    const { user } = useAuth();

    const skillsCount = user?.manualSkills?.length || 0;
    const certsCount = user?.certificates?.length || 0;
    const projectsCount = user?.projects?.length || 0;

    // Process manual skills for the bar chart
    const skillData = user?.manualSkills?.slice(0, 6).map(s => {
        const levels = { 'Expert': 100, 'Advanced': 80, 'Intermediate': 60, 'Beginner': 40 };
        return {
            name: s.name,
            level: levels[s.proficiency] || 50,
            color: s.proficiency === 'Expert' ? '#3b82f6' : s.proficiency === 'Advanced' ? '#8b5cf6' : '#6366f1'
        };
    }) || [];

    // Aggregated Skill Domains Distribution
    const manualCategories = user?.manualSkills?.map(s => s.category) || [];
    const certDomains = user?.certificates?.flatMap(c => {
        if (c.demoSkillData.domains) return c.demoSkillData.domains;
        const d = [];
        if (c.demoSkillData.domain) d.push(c.demoSkillData.domain);
        if (c.demoSkillData.subdomain) d.push(c.demoSkillData.subdomain);
        return d;
    }) || [];

    const combinedDomains = [...manualCategories, ...certDomains];
    const skillDistribution = combinedDomains.reduce((acc, domain) => {
        acc[domain] = (acc[domain] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.entries(skillDistribution)
        .sort((a, b) => b[1] - a[1]) // Sort by count
        .slice(0, 5) // Top 5 domains
        .map(([name, value]) => ({ name, value }));

    const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#6366f1', '#ec4899', '#f59e0b'];

    // Dynamic Trust Score Calculation
    const trustScore = Math.min(100, Math.round(((certsCount * 15 + skillsCount * 5 + projectsCount * 10) / 100) * 100)) || 0;

    const stats = [
        { label: 'Validated Skills', value: skillsCount, icon: Award, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Featured Projects', value: projectsCount, icon: Briefcase, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'Growth Index', value: '+12%', icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Trust Score', value: `${trustScore}%`, icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-bold text-white mb-2"
                >
                    Welcome back, <span className="text-gradient">{user?.name}</span>
                </motion.h2>
                <p className="text-gray-400">Your professional portfolio is performing at peak efficiency.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-morphism p-8 rounded-[2rem] hover:scale-105 transition-transform cursor-default"
                    >
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                        <p className="text-gray-500 font-medium text-sm border-t border-white/5 mt-4 pt-4 uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Skills Distribution */}
                <div className="lg:col-span-2 glass-morphism p-10 rounded-[2.5rem] relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                            <TrendingUp className="text-blue-500" /> Skill Proficiency
                        </h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Expert
                            </div>
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        {skillData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={skillData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: '#ffffff05' }}
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                                    />
                                    <Bar dataKey="level" radius={[10, 10, 10, 10]} barSize={40}>
                                        {skillData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                <Star className="w-8 h-8 mb-3 opacity-20" />
                                <p className="text-sm italic">Add skills to visualize your data</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skill Radar Chart */}
                <div className="glass-morphism p-10 rounded-[2.5rem] flex flex-col items-center justify-between text-center relative overflow-hidden">
                    <div className="w-full text-left mb-2">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                            <Sparkles className="text-purple-500" /> Expertise Map
                        </h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Cross-domain proficiency</p>
                    </div>
                    
                    <div className="h-72 w-full mt-4">
                        {pieData.length >= 3 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={pieData}>
                                    <PolarGrid stroke="#ffffff10" />
                                    <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 9, fontWeight: 700 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} hide />
                                    <Radar
                                        name="Skills"
                                        dataKey="value"
                                        stroke="#8b5cf6"
                                        fill="#8b5cf6"
                                        fillOpacity={0.4}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6">
                                <FileCheck className="w-10 h-10 mb-4 opacity-10" />
                                <p className="text-[10px] uppercase font-black tracking-[0.2em] leading-relaxed">
                                    Add at least 3 categories<br/>to generate your<br/>Expertise Map
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4 mt-8 border-t border-white/5 pt-6">
                        <div className="text-left">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Top Domain</p>
                            <p className="text-sm font-bold text-white truncate">{pieData[0]?.name || '---'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Diversification</p>
                            <p className="text-sm font-bold text-blue-400">{(pieData.length * 20).toString()}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
