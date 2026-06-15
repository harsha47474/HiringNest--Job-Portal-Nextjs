"use client";

import { getJobById, updateJobAction, MyJobType } from "@/src/lib/actions/jobActions";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { getCurrentLocation } from "@/src/helper/getCurrentLocation";
import { jobSchema, JobSchemaType } from "@/src/lib/validations/jobFormValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

type EditJobPageProps = {
    jobId: number;
};

export default function EditJobPage({ jobId }: EditJobPageProps) {
    const [job, setJob] = useState<MyJobType | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [input, setInput] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
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
            expiresAt: "",
        },
    });

    const tags = watch("tags");

    useEffect(() => {
        const fetchJob = async () => {
            const res = await getJobById(jobId);
            if (res) {
                setJob(res);

                // Parse tags from JSON string to array
                const parsedTags = res.tags ? JSON.parse(res.tags as string) : [];

                // Convert coordinates from string to number
                const latitude = res.latitude ? parseFloat(res.latitude) : undefined;
                const longitude = res.longitude ? parseFloat(res.longitude) : undefined;

                // Convert expiresAt Date to string format for date input
                const expiresAt = res.expiresAt 
                    ? new Date(res.expiresAt).toISOString().split("T")[0] 
                    : "";

                setIsFeatured(res.isFeatured || false);

                reset({
                    title: res.title || "",
                    description: res.description || "",
                    tags: parsedTags,
                    minSalary: res.minSalary || 0,
                    maxSalary: res.maxSalary || 0,
                    salaryCurrency: res.salaryCurrency || "INR",
                    salaryPeriod: res.salaryPeriod || "monthly",
                    jobType: res.jobType || "full_time",
                    location: res.location || "",
                    latitude: latitude,
                    longitude: longitude,
                    workType: res.workType || "onsite",
                    jobLevel: res.jobLevel || "entry",
                    experience: res.experience || "",
                    minEducation: res.minEducation || "bachelors",
                    isFeatured: res.isFeatured || false,
                    status: res.status || "draft",
                    expiresAt: expiresAt,
                });
            } else {
                console.warn("No job found for id:", jobId);
                toast.error("Job not found");
            }
        };
        fetchJob();
    }, [jobId, reset]);

    const onSubmit = async (data: JobSchemaType) => {
        setIsSubmitting(true);
        try {
            const result = await updateJobAction(jobId, {
                title: data.title,
                description: data.description,
                tags: JSON.stringify(data.tags),
                minSalary: data.minSalary,
                maxSalary: data.maxSalary,
                salaryCurrency: data.salaryCurrency,
                salaryPeriod: data.salaryPeriod,
                jobType: data.jobType,
                location: data.location,
                latitude: data.latitude?.toString() || null,
                longitude: data.longitude?.toString() || null,
                workType: data.workType,
                jobLevel: data.jobLevel,
                experience: data.experience,
                minEducation: data.minEducation,
                isFeatured: data.isFeatured,
                status: data.status,
                expiresAt: new Date(data.expiresAt),
            });

            if (result.success) {
                toast.success(result.message);
                router.push("/employer/jobs");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Error updating job:", error);
            toast.error("Failed to update job");
        } finally {
            setIsSubmitting(false);
        }
    };

    const addTag = () => {
        const value = input.trim();
        if (!value) return;
        if (!tags.includes(value)) {
            setValue("tags", [...tags, value]);
        }
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        }
    };

    const removeTag = (tag: string) => {
        setValue(
            "tags",
            tags.filter((t) => t !== tag)
        );
    };

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
            setIsLoadingLocation(false);
        }
    };

    if (!job) return <p className="p-6">Loading...</p>;

    return (
        <div className="flex flex-col w-full min-h-screen p-4">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-gray-900">Edit Job</h1>
                <p className="text-sm text-gray-600">
                    Update the details of your job listing.
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
                                <textarea
                                    placeholder="Describe the role, responsibilities, and what success looks like..."
                                    rows={5}
                                    {...register("description")}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-1 focus:ring-blue-500"
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
                                                onClick={() => removeTag(tag)}
                                            >
                                                x
                                            </button>
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
                    </section>

                    {/* Right: Publishing */}
                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Status</label>
                                <select
                                    {...register("status")}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="closed">Closed</option>
                                </select>
                                {errors.status && (
                                    <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
                                )}
                            </div>

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
                                type="button"
                                onClick={() => router.push("/employer/jobs")}
                                className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </section>
                </div>

                {/* Classification & Compensation */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Classification</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Job Type */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Job Type</label>
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                    {...register("jobType")}
                                >
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
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                    {...register("workType")}
                                >
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
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                    {...register("jobLevel")}
                                >
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
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                    {...register("minEducation")}
                                >
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
                                        disabled={isLoadingLocation}
                                        onClick={() => {
                                            setIsLoadingLocation(true);
                                            getLocation();
                                        }}
                                        variant="blue"
                                        className="text-white shrink-0 cursor-pointer"
                                    >
                                        📍 {isLoadingLocation ? "Detecting..." : "Use Current"}
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
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
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
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                    {...register("salaryPeriod")}
                                >
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
                </div>
            </form>
        </div>
    );
}
