"use client";

import React, { useEffect, useState } from "react";
import { Upload, Save, Trash2, FileText } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { updateApplicantProfileAction, uploadApplicantFileAction } from "@/src/lib/actions/applicantProfileActions";
import { applicantProfileSchema, ApplicantProfileInput } from "@/src/lib/validations/applicantValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";

const ApplicantProfile = ({ user, applicant }: { user: any; applicant: any }) => {
    const [isEditing, setIsEditing] = useState(false);

    const [profileFile, setProfileFile] = useState<File | null>(null);
    const [profilePreview, setProfilePreview] = useState<string | null>(
        applicant?.profileImageUrl ?? null
    );

    const [biography, setBiography] = useState(applicant?.biography ?? "");
    const [experienceText, setExperienceText] = useState(applicant?.experience ?? "");

    const {
        register,
        control,
        handleSubmit: handleProfileSubmit,
        formState: { errors, isSubmitting, isDirty },
        setValue,
        watch,
    } = useForm<ApplicantProfileInput>({
        resolver: zodResolver(applicantProfileSchema),
        defaultValues: {
            profileImageUrl: applicant?.profileImageUrl ?? "",
            biography: applicant?.biography ?? "",
            dateOfBirth: applicant?.dateOfBirth ?? "",
            nationality: applicant?.nationality ?? "",
            gender: applicant?.gender ?? "",
            maritalStatus: applicant?.maritalStatus ?? "",
            education: applicant?.education ?? "",
            experience: applicant?.experience ?? "",
            websiteUrl: applicant?.websiteUrl ?? "",
            location: applicant?.location ?? "",
            resumes: applicant?.resumes ?? [],
        },
    });

    const { fields: resumeFields, append: appendResume, remove: removeResume } = useFieldArray({
        control,
        name: "resumes",
    });

    useEffect(() => {
        setValue("biography", biography, { shouldDirty: true });
    }, [biography, setValue]);

    useEffect(() => {
        setValue("experience", experienceText, { shouldDirty: true });
    }, [experienceText, setValue]);

    const bioEditor = useEditor({
        extensions: [StarterKit],
        content: applicant?.biography ?? "",
        editable: false,
        onUpdate: ({ editor }) => {
            setBiography(editor.getHTML());
        },
    });

    const expEditor = useEditor({
        extensions: [StarterKit],
        content: applicant?.experience ?? "",
        editable: false,
        onUpdate: ({ editor }) => {
            setExperienceText(editor.getHTML());
        },
    });

    useEffect(() => {
        bioEditor?.setEditable(isEditing);
        expEditor?.setEditable(isEditing);
    }, [bioEditor, expEditor, isEditing]);

    const onProfileSubmit = async (data: ApplicantProfileInput) => {
        let profileImageUrl = data.profileImageUrl;

        if (profileFile) {
            profileImageUrl = await uploadApplicantFileAction(profileFile, "applicant-profiles");
        }

        const result = await updateApplicantProfileAction({
            ...data,
            profileImageUrl,
            biography: bioEditor?.getHTML() ?? biography,
            experience: expEditor?.getHTML() ?? experienceText,
        });

        if (result.success) {
            toast.success(result.message);
            setIsEditing(false);
            setProfileFile(null); // Clear file to prevent re-uploading
        } else {
            toast.error(result.message);
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (resumeFields.length >= 5) {
            toast.error("You can upload a maximum of 5 resumes.");
            return;
        }

        const toastId = toast.loading("Uploading resume...");
        try {
            const url = await uploadApplicantFileAction(file, "applicant-resumes");
            appendResume({ name: file.name, url });
            toast.success("Resume uploaded successfully!", { id: toastId });
        } catch (error) {
            toast.error("Failed to upload resume.", { id: toastId });
        }
    };

    return (
        <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
            className="flex flex-col w-full bg-white min-h-screen p-4"
        >
            <input type="hidden" value={biography} {...register("biography")} />
            <input type="hidden" value={experienceText} {...register("experience")} />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Applicant Settings</h1>
                    <p className="text-sm text-gray-600">
                        Manage your profile, personal details, and resumes.
                    </p>
                </div>

                <div className="flex gap-2">
                    {!isEditing ? (
                        <Button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="border border-gray-300 px-4 py-2 rounded-md text-sm cursor-pointer text-white"
                            variant={"blue"}
                        >
                            Edit
                        </Button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="border border-gray-300 px-4 py-2 rounded-md text-sm cursor-pointer"
                            >
                                Cancel
                            </button>

                            <Button
                                type="submit"
                                disabled={isSubmitting || (!isDirty && !profileFile)}
                                variant={"blue"}
                                className="flex items-center space-x-2 text-white text-sm font-medium px-4 h-10 rounded-md hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                            >
                                <Save size={16} />
                                <span>{isSubmitting ? "Saving..." : "Save changes"}</span>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Basic Information */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h2>

                {/* Profile Photo */}
                <div className="mb-6">
                    <label className="text-xs font-medium text-gray-600 block mb-2">
                        Profile Photo
                    </label>

                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-full border overflow-hidden bg-gray-50 flex-shrink-0">
                            {profilePreview ? (
                                <img
                                    src={profilePreview}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                    Photo
                                </div>
                            )}
                        </div>

                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                id="profile-upload"
                                disabled={!isEditing}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    setProfileFile(file);
                                    setProfilePreview(URL.createObjectURL(file));
                                    setValue("profileImageUrl", URL.createObjectURL(file), { shouldDirty: true }); // trigger dirty state
                                }}
                            />

                            {isEditing && (
                                <label
                                    htmlFor="profile-upload"
                                    className="inline-flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer"
                                >
                                    <Upload size={16} />
                                    {profilePreview ? "Replace photo" : "Upload photo"}
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-medium text-gray-600">Location</label>
                        <input
                            type="text"
                            placeholder="San Francisco, CA"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                            disabled={!isEditing}
                            {...register("location")}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600">Website URL</label>
                        <input
                            type="text"
                            placeholder="https://yourwebsite.com"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                            disabled={!isEditing}
                            {...register("websiteUrl")}
                        />
                        {errors.websiteUrl && <p className="text-red-500 text-xs mt-1">{errors.websiteUrl.message}</p>}
                    </div>
                </div>

                {/* Biography */}
                <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Biography</label>
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                        {isEditing && (
                            <div className="flex gap-2 p-2 border-b bg-gray-50">
                                <button type="button" onClick={() => bioEditor?.chain().focus().toggleBold().run()} className={`px-2 py-1 text-sm rounded ${bioEditor?.isActive("bold") ? "bg-gray-200" : ""}`}>Bold</button>
                                <button type="button" onClick={() => bioEditor?.chain().focus().toggleItalic().run()} className={`px-2 py-1 text-sm rounded ${bioEditor?.isActive("italic") ? "bg-gray-200" : ""}`}>Italic</button>
                                <button type="button" onClick={() => bioEditor?.chain().focus().toggleBulletList().run()} className={`px-2 py-1 text-sm rounded ${bioEditor?.isActive("bulletList") ? "bg-gray-200" : ""}`}>List</button>
                            </div>
                        )}
                        <EditorContent editor={bioEditor} className="min-h-[150px] p-4 prose max-w-none" />
                    </div>
                </div>
            </section>

            {/* Personal Details */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Personal Details</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-600">Date of Birth</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                            disabled={!isEditing}
                            {...register("dateOfBirth")}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600">Nationality</label>
                        <input
                            type="text"
                            placeholder="e.g. American"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                            disabled={!isEditing}
                            {...register("nationality")}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600">Gender</label>
                        <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                            disabled={!isEditing}
                            {...register("gender")}
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600">Marital Status</label>
                        <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                            disabled={!isEditing}
                            {...register("maritalStatus")}
                        >
                            <option value="">Select</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Professional Background */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Professional Background</h2>

                <div className="mb-4">
                    <label className="text-xs font-medium text-gray-600 block">Education Level</label>
                    <select
                        className="w-full md:w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                        disabled={!isEditing}
                        {...register("education")}
                    >
                        <option value="">Select</option>
                        <option value="none">None</option>
                        <option value="high school">High School</option>
                        <option value="undergraduate">Undergraduate</option>
                        <option value="masters">Masters</option>
                        <option value="phd">PhD</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Experience</label>
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                        {isEditing && (
                            <div className="flex gap-2 p-2 border-b bg-gray-50">
                                <button type="button" onClick={() => expEditor?.chain().focus().toggleBold().run()} className={`px-2 py-1 text-sm rounded ${expEditor?.isActive("bold") ? "bg-gray-200" : ""}`}>Bold</button>
                                <button type="button" onClick={() => expEditor?.chain().focus().toggleItalic().run()} className={`px-2 py-1 text-sm rounded ${expEditor?.isActive("italic") ? "bg-gray-200" : ""}`}>Italic</button>
                                <button type="button" onClick={() => expEditor?.chain().focus().toggleBulletList().run()} className={`px-2 py-1 text-sm rounded ${expEditor?.isActive("bulletList") ? "bg-gray-200" : ""}`}>List</button>
                            </div>
                        )}
                        <EditorContent editor={expEditor} className="min-h-[150px] p-4 prose max-w-none" />
                    </div>
                </div>
            </section>

            {/* Resumes */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Resumes</h2>
                
                <p className="text-xs text-gray-500 mb-4">Upload up to 5 resumes for different roles. These can be selected when applying for jobs.</p>

                {resumeFields.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {resumeFields.map((field, index) => (
                            <div key={field.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <FileText size={18} className="text-blue-500 flex-shrink-0" />
                                    <a href={field.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 truncate hover:underline">
                                        {field.name}
                                    </a>
                                </div>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => removeResume(index)}
                                        className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                                        title="Delete resume"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                
                {errors.resumes && <p className="text-red-500 text-xs mb-4">{errors.resumes.message}</p>}

                {isEditing && resumeFields.length < 5 && (
                    <div>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            hidden
                            id="resume-upload"
                            onChange={handleResumeUpload}
                        />
                        <label
                            htmlFor="resume-upload"
                            className="inline-flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer"
                        >
                            <Upload size={16} />
                            Upload Resume ({resumeFields.length}/5)
                        </label>
                    </div>
                )}
            </section>
        </form>
    );
};

export default ApplicantProfile;
