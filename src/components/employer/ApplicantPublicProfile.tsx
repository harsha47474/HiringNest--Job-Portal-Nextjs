"use client";
import React from "react";
import { ArrowLeft, User, MapPin, Mail, Phone, Calendar, Globe, GraduationCap, Briefcase, FileText, Download } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ApplicantPublicProfile({ profile }: { profile: any }) {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors"
            >
                <ArrowLeft size={16} /> Back to Applications
            </button>

            {/* Header section */}
            <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                
                <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-end pt-12">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                        {profile.profileImageUrl ? (
                            <img src={profile.profileImageUrl} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={48} className="text-gray-400" />
                        )}
                    </div>
                    
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                            {profile.email && (
                                <div className="flex items-center gap-1.5">
                                    <Mail size={16} className="text-gray-400" />
                                    <span>{profile.email}</span>
                                </div>
                            )}
                            {profile.phoneNumber && (
                                <div className="flex items-center gap-1.5">
                                    <Phone size={16} className="text-gray-400" />
                                    <span>{profile.phoneNumber}</span>
                                </div>
                            )}
                            {profile.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span>{profile.location}</span>
                                </div>
                            )}
                            {profile.websiteUrl && (
                                <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                                    <Globe size={16} />
                                    <span>Portfolio/Website</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="md:col-span-2 space-y-6">
                    {/* Biography */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User size={20} className="text-blue-600" /> About
                        </h2>
                        {profile.biography ? (
                            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                                {profile.biography}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No biography provided.</p>
                        )}
                    </div>

                    {/* Experience */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Briefcase size={20} className="text-blue-600" /> Experience
                        </h2>
                        {profile.experience ? (
                            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                                {profile.experience}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No experience details provided.</p>
                        )}
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    {/* Personal Info */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h2>
                        <ul className="space-y-4">
                            <li>
                                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Education Level</div>
                                <div className="flex items-center gap-2 text-gray-900 font-medium">
                                    <GraduationCap size={18} className="text-gray-400" />
                                    <span className="capitalize">{profile.education || "Not specified"}</span>
                                </div>
                            </li>
                            {profile.dateOfBirth && (
                                <li>
                                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Date of Birth</div>
                                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                                        <Calendar size={18} className="text-gray-400" />
                                        <span>{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                                    </div>
                                </li>
                            )}
                            {profile.nationality && (
                                <li>
                                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Nationality</div>
                                    <div className="text-gray-900 font-medium">{profile.nationality}</div>
                                </li>
                            )}
                            {profile.gender && (
                                <li>
                                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Gender</div>
                                    <div className="text-gray-900 font-medium capitalize">{profile.gender}</div>
                                </li>
                            )}
                            {profile.maritalStatus && (
                                <li>
                                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Marital Status</div>
                                    <div className="text-gray-900 font-medium capitalize">{profile.maritalStatus}</div>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Resumes */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumes</h2>
                        {profile.resumes && profile.resumes.length > 0 ? (
                            <div className="space-y-3">
                                {profile.resumes.map((resume: any) => (
                                    <div key={resume.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                                                <FileText size={18} />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-medium text-gray-900 truncate" title={resume.name}>{resume.name}</p>
                                                {resume.isPrimary && (
                                                    <span className="text-[10px] uppercase font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">Primary</span>
                                                )}
                                            </div>
                                        </div>
                                        <a href={resume.url} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-blue-600 bg-white rounded-md shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Download size={16} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic text-sm">No resumes uploaded.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
