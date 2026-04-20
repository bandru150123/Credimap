import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, ExternalLink, Github, Monitor, Loader2, X } from 'lucide-react';

const ProjectsSection = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        techStack: '',
        deployedLink: '',
        githubLink: ''
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await axios.get('/api/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                techStack: formData.techStack.split(',').map(s => s.trim())
            };
            await axios.post('/api/projects', payload);
            setShowModal(false);
            setFormData({ name: '', description: '', techStack: '', deployedLink: '', githubLink: '' });
            fetchProjects();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const deleteProject = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await axios.delete(`/api/projects/${id}`);
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Projects</h2>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-400">
                        Total Projects: <span className="text-blue-400">{projects.length}</span>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md font-bold text-xs transition-all shadow-lg shadow-blue-600/20"
                    >
                        <Plus className="w-4 h-4" /> Add Project
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : projects.length === 0 ? (
                <div className="glass-morphism p-12 text-center border border-dashed border-white/10 rounded-2xl">
                    <div className="mb-6 inline-flex p-4 rounded-full bg-blue-500/10 text-blue-400">
                        <Monitor className="w-10 h-10 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">🚀 Showcase your work</h3>
                    
                    <div className="space-y-3 mb-8 max-w-xs mx-auto text-left">
                        <p className="text-gray-400 text-sm font-medium mb-4">Add projects to:</p>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center text-[10px]">✔</div>
                            <span>Impress recruiters</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center text-[10px]">✔</div>
                            <span>Highlight your skills</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center text-[10px]">✔</div>
                            <span>Build your portfolio</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        Add Your First Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="glass-morphism p-4 flex flex-col group border border-white/5 hover:border-blue-500/50 transition-all duration-300 rounded-xl">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-wider">{project.name}</h3>
                                <button
                                    onClick={() => deleteProject(project._id)}
                                    className="text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.techStack.map((tech, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10 uppercase font-mono">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-4 border-t border-white/5 pt-4 mt-auto">
                                {project.deployedLink && (
                                    <a href={project.deployedLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                        <ExternalLink className="w-3.5 h-3.5" /> LIVE DEMO
                                    </a>
                                )}
                                {project.githubLink && (
                                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">
                                        <Github className="w-3.5 h-3.5" /> CODE BASE
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="glass-morphism p-8 w-full max-w-lg border border-white/10 shadow-2xl relative animate-in zoom-in duration-200">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h3 className="text-xl font-bold mb-4">Add New Project</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-400">Project Name</label>
                                <input
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-400">Description</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-400">Tech Stack (comma separated)</label>
                                <input
                                    placeholder="React, Node.js, Three.js"
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                    value={formData.techStack}
                                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-400">Live Link</label>
                                    <input
                                        type="url"
                                        className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                        value={formData.deployedLink}
                                        onChange={(e) => setFormData({ ...formData, deployedLink: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-400">GitHub Link</label>
                                    <input
                                        type="url"
                                        className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                        value={formData.githubLink}
                                        onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-bold mt-4 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Project'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsSection;
