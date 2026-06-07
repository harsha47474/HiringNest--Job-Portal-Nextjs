"use client";

import React, { useEffect, useState } from "react";
import { Upload, Save } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import { updateEmployerProfileAction } from "@/src/lib/actions/settingsAction";

type EmployerSettingsForm = {
    name: string;
    websiteUrl: string;
    organisationType: string;
    teamSize: string;
    yearOfEstablishment: number;
    location: string;
    username: string;
    email: string;
};

const SettingsPage = ({ user, employer }: { user: any; employer: any }) => {
    const [isEditing, setIsEditing] = useState(false);

    const [description, setDescription] = useState(
        employer?.description ?? ""
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EmployerSettingsForm>({
        defaultValues: {
            name: employer?.name ?? "",
            websiteUrl: employer?.websiteUrl ?? "",
            organisationType: employer?.organizationType ?? "",
            teamSize: employer?.teamSize ?? "",
            yearOfEstablishment: employer?.yearOfEstablishment ?? undefined,
            location: employer?.location ?? "",
            username: user?.name ?? "",
            email: user?.email ?? "",
        },
    });

    const editor = useEditor({
        extensions: [StarterKit],
        content: employer?.description ?? "",
        editable: false,
        onUpdate: ({ editor }) => {
            setDescription(editor.getHTML());
        },
    });

    useEffect(() => {
        editor?.setEditable(isEditing);
    }, [editor, isEditing]);

    const onSubmit = async (data: EmployerSettingsForm) => {
        const result = await updateEmployerProfileAction({
            ...data,
            description,
        });
        if (result.success) {
            toast.success(result.message);
            setIsEditing(false);
        } else {
            toast.error(result.message);
        }

    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full bg-white min-h-screen p-6"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                    <p className="text-sm text-gray-600">
                        Manage your company profile and account preferences.
                    </p>
                </div>

                <div className="flex gap-2">
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="border border-gray-300 px-4 py-2 rounded-md text-sm"
                        >
                            Edit
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="border border-gray-300 px-4 py-2 rounded-md text-sm"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center space-x-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                <Save size={16} />
                                <span>{isSubmitting ? "Saving..." : "Save changes"}</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Brand Identity */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    Brand identity
                </h2>

                <div className="border border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center mb-4">
                    <div className="text-center text-gray-500 text-sm">
                        Recommended 1600 × 400px
                    </div>
                </div>

                <button
                    type="button"
                    className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                    <Upload size={16} />
                    <span>Upload</span>
                </button>

                <div className="flex items-center space-x-4 mt-6">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "AC"}
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-1">Profile picture</p>

                        <button
                            type="button"
                            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm hover:bg-gray-50"
                        >
                            Upload photo
                        </button>

                        <p className="text-xs text-gray-400 mt-1">
                            PNG or JPG, up to 2MB.
                        </p>
                    </div>
                </div>
            </section>

            {/* Company Details */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    Company details
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-medium text-gray-600">
                            Company name
                        </label>

                        <input
                            type="text"
                            placeholder="Acme Corp"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                            disabled={!isEditing}
                            {...register("name", {
                                required: "Company name is required",
                            })}
                        />

                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600">
                            Website URL
                        </label>

                        <input
                            type="text"
                            placeholder="https://acme.com"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                            disabled={!isEditing}
                            {...register("websiteUrl")}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600">
                            Organization type
                        </label>

                        <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                            disabled={!isEditing}
                            {...register("organisationType")}
                        >
                            <option value="">Select</option>
                            <option value="Private Company">Private Company</option>
                            <option value="Public Company">Public Company</option>
                            <option value="Startup">Startup</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600">
                            Team size
                        </label>

                        <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                            {...register("teamSize")}
                            disabled={!isEditing}
                        >
                            <option value="">Select</option>
                            <option value="1 - 50">1 - 50</option>
                            <option value="51 - 200">51 - 200</option>
                            <option value="201 - 500">201 - 500</option>
                            <option value="500+">500+</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600">
                            Year of establishment
                        </label>

                        <input
                            type="number"
                            placeholder="2014"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                            {...register("yearOfEstablishment", {
                                valueAsNumber: true,
                            })}
                            disabled={!isEditing}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600">
                            Location
                        </label>

                        <input
                            type="text"
                            placeholder="San Francisco, CA"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                            {...register("location")}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">
                        Description
                    </label>

                    <div className="border border-gray-300 rounded-md overflow-hidden">
                        {isEditing && (
                            <div className="flex gap-2 p-2 border-b bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() =>
                                        editor?.chain().focus().toggleBold().run()
                                    }
                                    className={`px-2 py-1 text-sm rounded ${editor?.isActive("bold") ? "bg-gray-200" : ""
                                        }`}
                                >
                                    Bold
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        editor?.chain().focus().toggleItalic().run()
                                    }
                                    className={`px-2 py-1 text-sm rounded ${editor?.isActive("italic") ? "bg-gray-200" : ""
                                        }`}
                                >
                                    Italic
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        editor?.chain().focus().toggleBulletList().run()
                                    }
                                    className={`px-2 py-1 text-sm rounded ${editor?.isActive("bulletList") ? "bg-gray-200" : ""
                                        }`}
                                >
                                    List
                                </button>
                            </div>
                        )}

                        <EditorContent
                            editor={editor}
                            className="min-h-[200px] p-4 prose max-w-none"
                        />
                    </div>
                </div>
            </section>

            {/* Account */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    Account
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-600">
                            Full name
                        </label>

                        <input
                            type="text"
                            disabled
                            defaultValue={user?.name ?? ""}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                            {...register("username")}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600">
                            Email
                        </label>

                        <input
                            type="email"
                            disabled
                            defaultValue={user?.email ?? ""}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 disabled:bg-gray-50 disabled:text-gray-500"
                            {...register("email")}
                        />
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="border border-red-200 bg-red-50 rounded-lg p-6">
                <h2 className="text-sm font-semibold text-red-700 mb-2">
                    Danger zone
                </h2>

                <p className="text-xs text-red-600 mb-4">
                    Delete company account — permanently remove your employer profile and
                    all associated data.
                </p>

                <button
                    type="button"
                    className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-700"
                >
                    Delete account
                </button>
            </section>
        </form>
    );
};

export default SettingsPage;