"use client";
import React, { useEffect, useState, useRef } from "react";
import { getApplicantProfileAction, uploadApplicantFileAction, uploadResumeAction, deleteResumeAction, setPrimaryResumeAction } from "@/src/lib/actions/applicantProfileActions";
import { toast } from "sonner";
import { FileText, MoreHorizontal, Star, Trash2, Download, Plus } from "lucide-react";

export default function MyResumesPage() {
    const [resumes, setResumes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [showMenuId, setShowMenuId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Modal state
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [resumeName, setResumeName] = useState("");

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        setIsLoading(true);
        const profile: any = await getApplicantProfileAction();
        if (profile && !profile.success && profile.success !== false) { // it returns the profile object if successful
            setResumes(profile.resumes || []);
        } else if (profile?.resumes) {
            setResumes(profile.resumes);
        }
        setIsLoading(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should not exceed 5MB");
            return;
        }

        const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (!validTypes.includes(file.type)) {
            toast.error("Only PDF and Word documents are allowed");
            return;
        }

        setUploadFile(file);
        setResumeName(file.name.replace(/\.[^/.]+$/, "")); // Default name without extension
        setShowUploadModal(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleUploadSubmit = async () => {
        if (!uploadFile || !resumeName.trim()) {
            toast.error("Please provide a name and select a file");
            return;
        }

        setIsUploading(true);
        try {
            // Upload to cloudinary
            const fileUrl = await uploadApplicantFileAction(uploadFile, "resumes");
            
            // Save to DB
            const result = await uploadResumeAction(fileUrl, resumeName, uploadFile.size);
            if (result.success) {
                toast.success(result.message);
                setShowUploadModal(false);
                setUploadFile(null);
                setResumeName("");
                fetchResumes();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload file");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this resume?")) return;
        
        const result = await deleteResumeAction(id);
        if (result.success) {
            toast.success(result.message);
            fetchResumes();
        } else {
            toast.error(result.message);
        }
        setShowMenuId(null);
    };

    const handleSetPrimary = async (id: number) => {
        const result = await setPrimaryResumeAction(id);
        if (result.success) {
            toast.success(result.message);
            fetchResumes();
        } else {
            toast.error(result.message);
        }
        setShowMenuId(null);
    };

    const formatSize = (bytes: number) => {
        if (!bytes) return "Unknown size";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h1>
                    <p className="text-gray-500">Upload tailored resumes for different job categories.</p>
                </div>
                {resumes.length < 5 && (
                    <div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileSelect} 
                            accept=".pdf,.doc,.docx" 
                            className="hidden" 
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Upload Resume
                        </button>
                    </div>
                )}
            </div>

            {resumes.length >= 5 && (
                <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                    You have reached the maximum limit of 5 resumes. Delete an existing one to upload a new resume.
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-20 text-gray-500">Loading resumes...</div>
            ) : resumes.length === 0 ? (
                <div className="text-center py-20 border-2 rounded-xl border-dashed">
                    <p className="text-gray-500 mb-4">You haven't uploaded any resumes yet.</p>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Upload your first resume
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resumes.map((resume) => (
                        <div key={resume.id} className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 flex-shrink-0 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowMenuId(showMenuId === resume.id ? null : resume.id)}
                                        className="text-gray-400 hover:text-gray-600 p-1"
                                    >
                                        <MoreHorizontal className="w-6 h-6" />
                                    </button>
                                    
                                    {showMenuId === resume.id && (
                                        <div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10 py-1">
                                            <a 
                                                href={resume.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                            >
                                                <Download className="w-4 h-4" /> Download
                                            </a>
                                            {!resume.isPrimary && (
                                                <button 
                                                    onClick={() => handleSetPrimary(resume.id)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                                >
                                                    <Star className="w-4 h-4" /> Set as Primary
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(resume.id)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg text-gray-900 truncate">{resume.name}</h3>
                                    {resume.isPrimary && (
                                        <span className="flex items-center gap-1 bg-blue-600 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                                            <Star className="w-3 h-3 fill-current" /> Primary
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-500 text-sm truncate mb-4">{resume.name}.pdf</p>
                            </div>

                            <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-50">
                                <span>Updated {formatDate(resume.updatedAt)}</span>
                                <span>{formatSize(resume.size)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Resume Name</label>
                            <input 
                                type="text"
                                value={resumeName}
                                onChange={(e) => setResumeName(e.target.value)}
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="e.g. Frontend Specialist"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                File: {uploadFile?.name} ({formatSize(uploadFile?.size || 0)})
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => { setShowUploadModal(false); setUploadFile(null); }}
                                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleUploadSubmit}
                                disabled={isUploading || !resumeName.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isUploading ? "Uploading..." : "Save Resume"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
