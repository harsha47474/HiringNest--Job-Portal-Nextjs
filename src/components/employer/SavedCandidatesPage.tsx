"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Mail, ExternalLink, BookmarkMinus, GraduationCap, Briefcase } from "lucide-react";
import { toggleSaveCandidateAction } from "@/src/lib/actions/savedCandidatesActions";
import { toast } from "sonner";

export default function SavedCandidatesPage({ initialCandidates }: { initialCandidates: any[] }) {
    const [candidates, setCandidates] = useState(initialCandidates);
    const [search, setSearch] = useState("");

    const handleUnsave = async (applicantId: number) => {
        const result = await toggleSaveCandidateAction(applicantId);
        if (result.success) {
            toast.success(result.message);
            setCandidates(prev => prev.filter(c => c.applicantId !== applicantId));
        } else {
            toast.error(result.message);
        }
    };

    const filteredCandidates = candidates.filter(c => 
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.location?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">Saved Candidates</h1>
                    <p className="text-gray-500 text-sm">You have {candidates.length} saved candidates</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name or location..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm shadow-sm"
                    />
                </div>
            </div>

            {filteredCandidates.length === 0 ? (
                <div className="text-center py-20 border rounded-xl border-dashed bg-gray-50">
                    <BookmarkMinus size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No saved candidates found.</p>
                    <p className="text-sm text-gray-400 mt-1">Candidates you save from applications will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCandidates.map(candidate => (
                        <div key={candidate.id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative group">
                            
                            <button 
                                onClick={() => handleUnsave(candidate.applicantId)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1.5 shadow-sm border"
                                title="Remove from saved"
                            >
                                <BookmarkMinus size={16} />
                            </button>

                            <div className="flex flex-col items-center text-center mb-4 pt-2">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl mb-3 overflow-hidden shadow-sm">
                                    {candidate.profileImageUrl ? (
                                        <img src={candidate.profileImageUrl} alt={candidate.name} className="w-full h-full object-cover" />
                                    ) : (
                                        candidate.name ? candidate.name.charAt(0).toUpperCase() : "C"
                                    )}
                                </div>
                                <h3 className="font-semibold text-gray-900 text-lg">{candidate.name}</h3>
                                <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
                                    <MapPin size={12} /> {candidate.location || "Location not specified"}
                                </p>
                            </div>

                            <div className="space-y-3 mb-6 flex-1 text-sm text-gray-600 border-t pt-4">
                                <div className="flex items-start gap-2">
                                    <Mail size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                    <span className="truncate">{candidate.email}</span>
                                </div>
                                {candidate.education && candidate.education !== "none" && (
                                    <div className="flex items-start gap-2">
                                        <GraduationCap size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="capitalize">{candidate.education}</span>
                                    </div>
                                )}
                                {candidate.experience && (
                                    <div className="flex items-start gap-2">
                                        <Briefcase size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="line-clamp-2" title={candidate.experience}>{candidate.experience}</span>
                                    </div>
                                )}
                            </div>

                            <Link href={`/employer/applicants/${candidate.applicantId}`} className="w-full">
                                <button className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg border transition-colors flex items-center justify-center gap-2 text-sm">
                                    View Profile <ExternalLink size={14} />
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
