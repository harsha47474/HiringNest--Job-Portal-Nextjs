"use client";

import { postAJobAction } from "@/src/lib/actions/jobActions";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { getCurrentLocation } from "@/src/helper/getCurrentLocation";

type JobForm = {
    title: string;
    description: string;
    tags: string[];

    jobType: "full_time" | "part_time" | "contract" | "internship" | "freelance";
    workType: "remote" | "hybrid" | "onsite";
    jobLevel: "entry" | "mid" | "senior" | "lead" | "manager";
    minEducation: "high_school" | "diploma" | "bachelors" | "masters" | "phd";

    location: string;
    latitude?: number;
    longitude?: number;
    experience: string;

    minSalary: number;
    maxSalary: number;

    salaryCurrency: "USD" | "INR" | "EUR" | "GBP";
    salaryPeriod: "yearly" | "monthly" | "hourly";

    expiresAt: string;
    isFeatured: boolean;
};

const PostJobPage = () => {
    const [isFeatured, setIsFeatured] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");

    const { register, handleSubmit, formState: { errors }, setValue, watch, } = useForm<JobForm>({
        defaultValues: {
            tags: [],
        }
    });

    const tags = watch("tags");

    const onSubmit = async (data: JobForm) => {
        const result = await postAJobAction(data, "published")
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
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
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    required
                                    placeholder="Describe the role, responsibilities, and what success looks like..."
                                    rows={5}
                                    {...register("description")}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Tags</label>
                                <div className="border rounded-md p-2 flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                className="cursor-pointer"
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
                            <button className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                Save draft
                            </button>
                            <button className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700">
                                Publish job
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
                            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                {...register("jobType")}>
                                <option value="full_time">Full Time</option>
                                <option value="part_time">Part Time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                                <option value="freelance">Freelance</option>
                            </select>

                            {/* Work Type */}
                            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                {...register("workType")} >
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="onsite">Onsite</option>
                            </select>

                            {/* Job Level */}
                            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                {...register("jobLevel")} >
                                <option value="entry">Entry Level</option>
                                <option value="mid">Mid Level</option>
                                <option value="senior">Senior Level</option>
                                <option value="lead">Lead</option>
                                <option value="manager">Manager</option>
                            </select>

                            {/* Minimum Education */}
                            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                {...register("minEducation")} >
                                <option value="high_school">High School</option>
                                <option value="diploma">Diploma</option>
                                <option value="bachelors">Bachelor's Degree</option>
                                <option value="masters">Master's Degree</option>
                                <option value="phd">PhD</option>
                            </select>

                            {/* Location */}
                            <input
                                type="text"
                                placeholder="San Francisco, CA"
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
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
                                className="text-white"
                            >
                                📍 {isLoading ? "Detecting..." : "Use Current"}
                            </Button>

                            {/* Experience */}
                            <input
                                type="text"
                                placeholder="e.g. 3+ years in product design"
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                {...register("experience")}

                            />
                        </div>
                    </section>

                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compensation</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                placeholder="Minimum salary"
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                {...register("minSalary")}

                            />
                            <input
                                type="number"
                                placeholder="Maximum salary"
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                {...register("maxSalary")}

                            />
                            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                {...register("salaryCurrency")}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="INR">INR (₹)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                            </select>

                            {/* Salary Period */}
                            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                {...register("salaryPeriod")} >
                                <option value="yearly">Per Year</option>
                                <option value="monthly">Per Month</option>
                                <option value="hourly">Per Hour</option>
                            </select>
                        </div>
                    </section>
                </div >
            </form >
        </div >
    );
};

export default PostJobPage;
