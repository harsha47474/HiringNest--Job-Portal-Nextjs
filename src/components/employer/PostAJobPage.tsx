"use client";

import { postAJobAction } from "@/src/lib/actions/jobActions";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TiptapEditor from "../ui/tiptap-editor";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { getCurrentLocation } from "@/src/helper/getCurrentLocation";
import { jobSchema } from "@/src/lib/validations/jobFormValidations";
import { JobSchemaType } from "@/src/lib/validations/jobFormValidations";
import { zodResolver } from "@hookform/resolvers/zod";

const PostJobPage = () => {
    const [isFeatured, setIsFeatured] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");

    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 30);
    const defaultExpiryString = defaultExpiry.toISOString().split("T")[0];

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
        control,
    } = useForm<JobSchemaType>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title: "",
            description: "",
            tags: [],
            minSalary: 0,
            maxSalary: 0,
            salaryCurrency: "INR",
            salaryPeriod: "monthly",
            jobType: "full_time",
            location: "",
            latitude: undefined,
            longitude: undefined,
            workType: "onsite",
            jobLevel: "entry",
            experience: "",
            minEducation: "bachelors",
            isFeatured: false,
            status: "draft",
            expiresAt: defaultExpiryString,
        },
    });

    const tags = watch("tags");

    const onSubmit = async (data: JobSchemaType) => {
        setIsLoading(true);
        const result = await postAJobAction(data, data.status as "draft" | "published" | "expired" | "closed");
        if (result.success) {
            toast.success(result.message);
            // Optionally redirect after success
        } else {
            toast.error(result.message);
        }
        setIsLoading(false);
        if (result.success) reset();
    }


    const addTag = () => {
        const value = input.trim()

        if (!value) return

        if (!tags.includes(value)) {
            setValue("tags", [...tags, value])
        }

        setInput("");
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        }
    }

    const removeTag = (tag: string) => {
        setValue(
            "tags",
            tags.filter((t) => t !== tag)
        )
    }

    // get current location of user from the browser
    const getLocation = async () => {
        try {
            const response = await getCurrentLocation();

            if (response.status === "Success") {
                setValue("location", response.formattedLocation!);
                setValue("latitude", response.latitude!);
                setValue("longitude", response.longitude!);

                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch {
            toast.error("Failed to fetch location");
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen p-4">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-gray-900">Post a Job</h1>
                <p className="text-sm text-gray-600">
                    Create a new job listing. It takes about 3 minutes.
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                    {/* Left: Job Details */}
                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Job details</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Job title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Senior Product Designer"
                                    {...register("title")}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.title && (
                                    <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <p className="text-xs text-gray-500 mb-2 mt-1">Description should follow the structure of About, Responsibility, and Requirements sections.</p>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <TiptapEditor value={field.value} onChange={field.onChange} />
                                    )}
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Tags</label>
                                <div className="border border-gray-300 rounded-md p-2 flex flex-wrap gap-2 mt-1">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                className="cursor-pointer font-bold text-xs"
                                                onClick={() => { removeTag(tag) }}
                                            > x </button>
                                        </span>
                                    ))}
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Add a skill..."
                                        className="outline-none flex-1 min-w-[120px]"
                                    />
                                </div>
                                {errors.tags && (
                                    <p className="text-xs text-red-500 mt-1">{errors.tags.message}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Press Enter or comma to add.
                                </p>
                            </div>
                        </div>
                    </section >

                    {/* Right: Publishing */}
                    < section className="bg-white border border-gray-200 rounded-lg p-6" >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Expires on</label>
                                <input
                                    type="date"
                                    {...register("expiresAt")}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.expiresAt && (
                                    <p className="text-xs text-red-500 mt-1">{errors.expiresAt.message}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Featured listing</p>
                                    <p className="text-xs text-gray-500">Pin to the top of results.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    {...register("isFeatured")}
                                    onChange={() => setIsFeatured(!isFeatured)}
                                    className="toggle toggle-sm accent-blue-600"
                                />
                            </div>

                            <div className="border border-gray-200 rounded-md p-3 text-xs text-gray-600">
                                Tip: Jobs with a clear salary range get{" "}
                                <span className="font-semibold text-gray-900">2.3× more qualified applicants.</span>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="submit"
                                onClick={() => setValue("status", "draft", { shouldValidate: true })}
                                disabled={isLoading}
                                className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                            >
                                Save draft
                            </button>
                            <button
                                type="submit"
                                onClick={() => setValue("status", "published", { shouldValidate: true })}
                                disabled={isLoading}
                                className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                            >
                                {isLoading ? "Processing..." : "Publish job"}
                            </button>
                        </div>
                    </section >
                </div >

                {/* Classification & Compensation */}
                < div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6" >
                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Classification</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Job Type */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Job Type</label>
                                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                    {...register("jobType")}>
                                    <option value="full_time">Full Time</option>
                                    <option value="part_time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                    <option value="freelance">Freelance</option>
                                </select>
                                {errors.jobType && (
                                    <p className="text-xs text-red-500 mt-1">{errors.jobType.message}</p>
                                )}
                            </div>

                            {/* Work Type */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Work Type</label>
                                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                    {...register("workType")} >
                                    <option value="remote">Remote</option>
                                    <option value="hybrid">Hybrid</option>
                                    <option value="onsite">Onsite</option>
                                </select>
                                {errors.workType && (
                                    <p className="text-xs text-red-500 mt-1">{errors.workType.message}</p>
                                )}
                            </div>

                            {/* Job Level */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Job Level</label>
                                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                    {...register("jobLevel")} >
                                    <option value="entry">Entry Level</option>
                                    <option value="mid">Mid Level</option>
                                    <option value="senior">Senior Level</option>
                                    <option value="lead">Lead</option>
                                    <option value="manager">Manager</option>
                                </select>
                                {errors.jobLevel && (
                                    <p className="text-xs text-red-500 mt-1">{errors.jobLevel.message}</p>
                                )}
                            </div>

                            {/* Minimum Education */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Minimum Education</label>
                                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                    {...register("minEducation")} >
                                    <option value="high_school">High School</option>
                                    <option value="diploma">Diploma</option>
                                    <option value="bachelors">Bachelor's Degree</option>
                                    <option value="masters">Master's Degree</option>
                                    <option value="phd">PhD</option>
                                </select>
                                {errors.minEducation && (
                                    <p className="text-xs text-red-500 mt-1">{errors.minEducation.message}</p>
                                )}
                            </div>

                            {/* Location */}
                            <div className="flex flex-col gap-1 col-span-2">
                                <label className="text-sm font-medium text-gray-700">Location</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="San Francisco, CA"
                                        className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-grow"
                                        {...register("location")}
                                    />
                                    <Button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => {
                                            setIsLoading(true)
                                            getLocation()
                                        }}
                                        variant="blue"
                                        className="text-white shrink-0 cursor-pointer"
                                    >
                                        📍 {isLoading ? "Detecting..." : "Use Current"}
                                    </Button>
                                </div>
                                {errors.location && (
                                    <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>
                                )}
                                {errors.latitude && (
                                    <p className="text-xs text-red-500 mt-1">{errors.latitude.message}</p>
                                )}
                                {errors.longitude && (
                                    <p className="text-xs text-red-500 mt-1">{errors.longitude.message}</p>
                                )}
                            </div>

                            {/* Experience */}
                            <div className="flex flex-col gap-1 col-span-2">
                                <label className="text-sm font-medium text-gray-700">Experience</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 3+ years in product design"
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                    {...register("experience")}
                                />
                                {errors.experience && (
                                    <p className="text-xs text-red-500 mt-1">{errors.experience.message}</p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compensation</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Minimum Salary</label>
                                <input
                                    type="number"
                                    placeholder="Minimum salary"
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                    {...register("minSalary", { valueAsNumber: true })}
                                />
                                {errors.minSalary && (
                                    <p className="text-xs text-red-500 mt-1">{errors.minSalary.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Maximum Salary</label>
                                <input
                                    type="number"
                                    placeholder="Maximum salary"
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                    {...register("maxSalary", { valueAsNumber: true })}
                                />
                                {errors.maxSalary && (
                                    <p className="text-xs text-red-500 mt-1">{errors.maxSalary.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Currency</label>
                                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                    {...register("salaryCurrency")}
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="INR">INR (₹)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                                {errors.salaryCurrency && (
                                    <p className="text-xs text-red-500 mt-1">{errors.salaryCurrency.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Salary Period</label>
                                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                    {...register("salaryPeriod")} >
                                    <option value="yearly">Per Year</option>
                                    <option value="monthly">Per Month</option>
                                    <option value="hourly">Per Hour</option>
                                </select>
                                {errors.salaryPeriod && (
                                    <p className="text-xs text-red-500 mt-1">{errors.salaryPeriod.message}</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div >
            </form >
        </div >
    );
};

export default PostJobPage;
