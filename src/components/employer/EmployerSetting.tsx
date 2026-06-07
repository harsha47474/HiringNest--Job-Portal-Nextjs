"use client"
import React, { useState } from "react";
import { Upload, Save } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const SettingsPage = () => {
    const [description, setDescription] = useState(
        "Acme Corp builds the operating system for modern hiring teams."
    );

    const editor = useEditor({
        extensions: [StarterKit],
        content: description,
        onUpdate: ({ editor }) => {
            setDescription(editor.getHTML());
        },
    });

    return (
        <div className="flex flex-col w-full bg-white min-h-screen p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                    <p className="text-sm text-gray-600">
                        Manage your company profile and account preferences.
                    </p>
                </div>
                <button className="flex items-center space-x-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700">
                    <Save size={16} />
                    <span>Save changes</span>
                </button>
            </div>

            {/* Brand Identity */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Brand identity</h2>

                {/* Banner */}
                <div className="border border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center mb-4">
                    <div className="text-center text-gray-500 text-sm">
                        Recommended 1600 × 400px
                    </div>
                </div>
                <button className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
                    <Upload size={16} />
                    <span>Upload</span>
                </button>

                {/* Profile Picture */}
                <div className="flex items-center space-x-4 mt-6">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                        AC
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Profile picture</p>
                        <button className="border border-gray-300 rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
                            Upload photo
                        </button>
                        <p className="text-xs text-gray-400 mt-1">PNG or JPG, up to 2MB.</p>
                    </div>
                </div>
            </section>

            {/* Company Details */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Company details</h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-medium text-gray-600">Company name</label>
                        <input
                            type="text"
                            defaultValue="Acme Corp"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-600">Website URL</label>
                        <input
                            type="text"
                            defaultValue="https://acme.com"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-600">Organization type</label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 focus:ring-1 focus:ring-blue-500">
                            <option>Private Company</option>
                            <option>Public Company</option>
                            <option>Startup</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-600">Team size</label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 focus:ring-1 focus:ring-blue-500">
                            <option>1 - 50</option>
                            <option>51 - 200</option>
                            <option>201 - 500</option>
                            <option>500+</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-600">Year of establishment</label>
                        <input
                            type="text"
                            defaultValue="2014"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-600">Location</label>
                        <input
                            type="text"
                            defaultValue="San Francisco, CA"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Description with text editor */}
                <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Description</label>
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                        <div className="flex gap-2 p-2 border-b bg-gray-50">
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                className={`px-2 py-1 text-sm rounded ${editor?.isActive("bold") ? "bg-gray-200" : ""
                                    }`}
                            >
                                Bold
                            </button>

                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                className={`px-2 py-1 text-sm rounded ${editor?.isActive("italic") ? "bg-gray-200" : ""
                                    }`}
                            >
                                Italic
                            </button>

                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                className={`px-2 py-1 text-sm rounded ${editor?.isActive("bulletList") ? "bg-gray-200" : ""
                                    }`}
                            >
                                List
                            </button>
                        </div>

                        <EditorContent
                            editor={editor}
                            className="min-h-[200px] p-4 prose max-w-none focus:outline-none"
                        />
                    </div>
                </div>
            </section>

            {/* Account Section */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Account</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-600">Full name</label>
                        <input
                            type="text"
                            defaultValue="Alex Carter"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            defaultValue="alex@acme.com"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-600">Current password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-600">New password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="border border-red-200 bg-red-50 rounded-lg p-6">
                <h2 className="text-sm font-semibold text-red-700 mb-2">Danger zone</h2>
                <p className="text-xs text-red-600 mb-4">
                    Delete company account — permanently remove your employer profile and all associated data.
                </p>
                <button className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-700">
                    Delete account
                </button>
            </section>
        </div>
    );
};

export default SettingsPage;
