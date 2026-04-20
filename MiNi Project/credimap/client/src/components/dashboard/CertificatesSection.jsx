import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, FileText, Trash2, Loader2, Sparkles, CheckCircle, AlertCircle, Eye, Award } from 'lucide-react';

const CertificatesSection = () => {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');

    useEffect(() => {
        fetchCerts();
    }, []);

    const fetchCerts = async () => {
        try {
            const res = await axios.get('/api/certificates');
            setCerts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (selectedFile) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setUploadError('');
        setUploadSuccess('');

        // Auto-fill name if empty
        if (!fileName) {
            const cleanName = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
            setFileName(cleanName);
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !fileName) return;
        setUploading(true);
        setUploadError('');
        setUploadSuccess('');

        const formData = new FormData();
        formData.append('certificate', file);
        formData.append('name', fileName);

        try {
            // CRITICAL: Do NOT set Content-Type manually for FormData.
            // The browser must set it automatically so the multipart boundary is included.
            // Long timeout because Gemini Vision / Tesseract OCR can take 30-60s.
            const token = localStorage.getItem('token');
            await axios.post('/api/certificates/upload', formData, {
                timeout: 120000,
                headers: { 'x-auth-token': token },
            });
            setFileName('');
            setFile(null);
            setUploadSuccess('Certificate scanned & saved!');
            setTimeout(() => setUploadSuccess(''), 5000);
            fetchCerts();
        } catch (err) {
            console.error('Upload error:', err);
            const msg = err.response?.data?.msg || err.response?.data || err.message || 'Upload failed. Please try again.';
            setUploadError(String(msg));
        } finally {
            setUploading(false);
        }
    };

    const deleteCert = async (id) => {
        try {
            await axios.delete(`/api/certificates/${id}`);
            fetchCerts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-black text-white">Certificates</h2>
                    <p className="text-gray-400 text-sm italic">AI-powered credential verification and skill extraction.</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Assets</p>
                        <p className="text-xl font-black text-blue-400">{certs.length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Form & Info Cards */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-morphism p-5 border border-white/5 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Upload className="w-5 h-5 text-blue-400" />
                                Add New
                            </h3>
                            {file && (
                                <button
                                    onClick={() => { setFile(null); setFileName(''); }}
                                    className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase tracking-tighter"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleUpload} className="space-y-5">
                            <div
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                className={`relative group transition-all duration-500 overflow-hidden ${
                                    isDragging 
                                    ? 'scale-[1.05] bg-blue-500/10 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
                                    : 'bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-blue-500/40 hover:scale-[1.02]'
                                } border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer`}
                                onClick={() => document.getElementById('file-upload').click()}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-700 pointer-events-none"></div>
                                
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileChange(e.target.files[0])}
                                />

                                {file ? (
                                    <div className="space-y-4 animate-in fade-in zoom-in duration-500 relative z-10">
                                        {file.type.startsWith('image/') ? (
                                            <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                                                <img 
                                                    src={URL.createObjectURL(file)} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/30">
                                                <FileText className="w-8 h-8 text-blue-400" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-black text-white truncate max-w-[200px] mx-auto tracking-tight">{file.name}</p>
                                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-2">Ready for AI Analysis</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 relative z-10">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10 group-hover:scale-110 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-500 shadow-lg">
                                            <Upload className="w-6 h-6 text-gray-500 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-300 tracking-tight">Drop certificate here</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">or click to browse local files</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Label</label>
                                <input
                                    type="text"
                                    placeholder="e.g. AWS Certified Architect"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={uploading || !file || !fileName}
                                className="w-full bg-white text-black hover:bg-blue-600 hover:text-white py-3 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black group overflow-hidden relative shadow-xl active:scale-95"
                            >
                                {uploading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                        <span>Analyzing...</span>
                                    </div>
                                ) : (
                                    <>
                                        <Sparkles className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
                                        <span>Scan with AI</span>
                                    </>
                                )}
                            </button>

                            {/* Success Banner */}
                            {uploadSuccess && (
                                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <p className="text-xs font-bold text-emerald-400">{uploadSuccess}</p>
                                </div>
                            )}

                            {/* Error Banner */}
                            {uploadError && (
                                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                    <p className="text-xs font-bold text-red-400">{uploadError}</p>
                                </div>
                            )}

                            {/* Processing hint */}
                            {uploading && (
                                <p className="text-[10px] text-gray-500 text-center font-bold uppercase tracking-widest animate-pulse">
                                    AI is reading your certificate... this may take up to 30s
                                </p>
                            )}
                        </form>
                    </div>

                </div>

                {/* List of Certificates */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-300">Your Achievements</h3>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : certs.length === 0 ? (
                        <div className="glass-morphism p-12 text-center space-y-8 animate-in fade-in zoom-in duration-700 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10 mb-6 group hover:scale-110 transition-transform duration-500">
                                    <Award className="w-10 h-10 text-gray-500 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/10 blur-[60px] pointer-events-none"></div>
                                
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-white italic tracking-tighter">📜 No certificates yet</h3>
                                    <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full"></div>
                                </div>

                                <div className="max-w-xs mx-auto space-y-6 mt-8">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Upload your certificates to:</p>
                                    <div className="space-y-3 text-left bg-white/5 p-6 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3 text-sm text-gray-300">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[8px] font-black italic">✔</div>
                                            <span className="font-bold tracking-tight">Extract skills automatically</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-300">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[8px] font-black italic">✔</div>
                                            <span className="font-bold tracking-tight">Boost your trust score</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-300">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[8px] font-black italic">✔</div>
                                            <span className="font-bold tracking-tight">Build your portfolio faster</span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => document.getElementById('file-upload').click()}
                                    className="mt-8 px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-2 mx-auto"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    Upload Certificate
                                </button>
                            </div>
                        </div>
                    ) : (
                        certs.map((cert) => (
                            <div key={cert._id} className="glass-morphism p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/5 hover:border-blue-500/30 transition-all rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-lg">
                                        <CheckCircle className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{cert.name}</h4>
                                        <p className="text-xs text-emerald-400 flex items-center gap-1 uppercase font-mono">
                                            <Sparkles className="w-3 h-3" /> AI Analysis Complete
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 px-4">
                                    <div className="flex flex-wrap gap-2">
                                        {cert.demoSkillData.skills.map((skill, idx) => (
                                            <span key={idx} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full border border-white/10 text-gray-400">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <a
                                        href={`/${cert.filePath}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                                        title="View Certificate"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => deleteCert(cert._id)}
                                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CertificatesSection;
