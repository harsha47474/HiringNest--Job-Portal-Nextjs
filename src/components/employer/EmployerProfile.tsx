"use client";

import React, { useEffect, useState } from "react";
import { Upload, Save } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import { updateEmployerProfileAction } from "@/src/lib/actions/employerProfileActions";
import { employerProfileSchema } from "@/src/lib/validations/employerValidations";
import { EmployerProfileInput } from "@/src/lib/validations/employerValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadBannerAction } from "@/src/lib/actions/employerProfileActions";
import { Button } from "../ui/button";

const EmployerProfile = ({ user, employer }: { user: any; employer: any }) => {

    // TODO: Create a Enhanced Text editor for the Company description using TipTap
    const [isEditing, setIsEditing] = useState(false);

    const [bannerFile, setBannerFile] =
        useState<File | null>(null);

    const [bannerPreview, setBannerPreview] =
        useState<string | null>(
            employer?.bannerImageUrl ?? null
        );

    const [logoFile, setLogoFile] = useState<File | null>(null);

    const [logoPreview, setLogoPreview] = useState<string | null>(
        employer?.logoUrl ?? null
    );

    const [description, setDescription] = useState(
        employer?.description ?? ""
    );

    const {
        register,
        handleSubmit: handleProfileSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<EmployerProfileInput>({
        resolver: zodResolver(employerProfileSchema),
        defaultValues: {
            name: employer?.name ?? "",
            websiteUrl: employer?.websiteUrl ?? "",
            organizationType: employer?.organizationType ?? "",
            teamSize: employer?.teamSize ?? "",
            yearOfEstablishment: employer?.yearOfEstablishment ?? undefined,
            location: employer?.location ?? "",
            description: employer?.description ?? "",
        },
    });

    useEffect(() => {
        setValue("description", description);
    }, [description, setValue]);

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

    const onProfileSubmit = async (data: EmployerProfileInput) => {
        let bannerImageUrl = employer?.bannerImageUrl ?? null;
        let logoUrl = employer?.logoUrl ?? null;

        if (bannerFile) {
            bannerImageUrl = await uploadBannerAction(bannerFile);
        }

        if (logoFile) {
            logoUrl = await uploadBannerAction(logoFile);
        }

        const result = await updateEmployerProfileAction({
            ...data,
            bannerImageUrl,
            logoUrl,
            description: editor?.getHTML() ?? description,
        });

        if (result.success) {
            toast.success(result.message);
            setIsEditing(false);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <>
            <form
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="flex flex-col w-full bg-white min-h-screen p-4"
            >
                <input type="hidden" value={description} {...register("description")} />
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
                                    disabled={isSubmitting}
                                    variant={"blue"}
                                    className="flex items-center space-x-2 text-white text-sm font-medium px-4 h-10 rounded-md hover:bg-blue-700 cursor-pointer"
                                >
                                    <Save size={16} />
                                    <span>{isSubmitting ? "Saving..." : "Save changes"}</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Brand Identity */}
                <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">
                        Brand identity
                    </h2>

                    {/* Banner */}
                    <div className="mb-6">
                        <label className="text-xs font-medium text-gray-600 block mb-2">
                            Company Banner
                        </label>

                        <div className="border border-dashed border-gray-300 rounded-lg h-48 overflow-hidden">
                            {bannerPreview ? (
                                <img
                                    src={bannerPreview}
                                    alt="Company banner"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                                    Recommended 1600 × 400px
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            id="banner-upload"
                            disabled={!isEditing}
                            onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (!file) return;

                                setBannerFile(file);
                                setBannerPreview(URL.createObjectURL(file));
                            }}
                        />

                        {isEditing && (
                            <label
                                htmlFor="banner-upload"
                                className="mt-3 inline-flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer"
                            >
                                <Upload size={16} />
                                {bannerPreview ? "Replace banner" : "Upload banner"}
                            </label>
                        )}
                    </div>

                    {/* Logo */}
                    <div>
                        <label className="text-xs font-medium text-gray-600 block mb-2">
                            Company Logo
                        </label>

                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-xl border overflow-hidden bg-gray-50">
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Company logo"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                        Logo
                                    </div>
                                )}
                            </div>

                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    id="logo-upload"
                                    disabled={!isEditing}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];

                                        if (!file) return;

                                        setLogoFile(file);
                                        setLogoPreview(URL.createObjectURL(file));
                                    }}
                                />

                                {isEditing && (
                                    <label
                                        htmlFor="logo-upload"
                                        className="inline-flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer"
                                    >
                                        <Upload size={16} />
                                        {logoPreview ? "Replace logo" : "Upload logo"}
                                    </label>
                                )}

                                <p className="text-xs text-gray-500 mt-2">
                                    Recommended 512 × 512px PNG
                                </p>
                            </div>
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
                                {...register("organizationType")}
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
                                    setValueAs: (value) =>
                                        value === "" ? undefined : Number(value),
                                })}
                                disabled={!isEditing}
                            />

                            {errors.yearOfEstablishment && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.yearOfEstablishment.message}
                                </p>
                            )}
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
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-2">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                </section>
            </form>
        </>
    );
};

export default EmployerProfile;