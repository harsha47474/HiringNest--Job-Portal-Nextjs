import { z } from "zod"

export const jobSchema = z
    .object({
        title: z
            .string()
            .min(5, "Job title must be at least 5 characters")
            .max(255, "Job title is too long"),

        description: z
            .string()
            .min(50, "Description should be at least 100 characters")
            .max(500),

        tags: z
            .array(z.string())
            .min(1, "Add at least one tag")
            .max(10, "Maximum 10 tags allowed"),

        minSalary: z
            .number({
                message: "Minimum salary is required",
            })
            .nonnegative(),

        maxSalary: z
            .number({
                message: "Maximum salary is required",
            })
            .nonnegative(),

        salaryCurrency: z.enum([
            "INR",
            "USD",
            "EUR",
            "GBP",
        ]),

        salaryPeriod: z.enum([
            "hourly",
            "monthly",
            "yearly",
        ]),

        jobType: z.enum([
            "full_time",
            "part_time",
            "contract",
            "internship",
            "freelance",
        ]),

        location: z
            .string()
            .min(2, "Location is required")
            .max(255),

        latitude: z
            .number()
            .min(-90)
            .max(90)
            .nullable()
            .optional(),

        longitude: z
            .number()
            .min(-180)
            .max(180)
            .nullable()
            .optional(),

        workType: z.enum([
            "remote",
            "hybrid",
            "onsite",
        ]),

        jobLevel: z.enum([
            "entry",
            "mid",
            "senior",
            "lead",
            "manager",
        ]),

        experience: z
            .string()
            .min(2, "Experience is required"),

        minEducation: z.enum([
            "high_school",
            "diploma",
            "bachelors",
            "masters",
            "phd",
        ]),

        isFeatured: z.boolean(),

        status: z.enum([
            "draft",
            "published",
            "expired",
            "closed",
        ]),

        expiresAt: z.string().min(1, "Expiry date is required"),
    })

    .refine(
        (data) => data.minSalary <= data.maxSalary,
        {
            path: ["maxSalary"],
            message:
                "Maximum salary must be greater than minimum salary",
        }
    )

    .refine(
        (data) => new Date(data.expiresAt) > new Date(),
        {
            path: ["expiresAt"],
            message:
                "Expiry date must be in the future",
        }
    )

    .refine(
        (data) => {
            const hasLat = data.latitude !== undefined && data.latitude !== null;
            const hasLng = data.longitude !== undefined && data.longitude !== null;
            return !(hasLat && !hasLng);
        },
        {
            path: ["longitude"],
            message:
                "Longitude is required when latitude is provided",
        }
    )

    .refine(
        (data) => {
            const hasLat = data.latitude !== undefined && data.latitude !== null;
            const hasLng = data.longitude !== undefined && data.longitude !== null;
            return !(hasLng && !hasLat);
        },
        {
            path: ["latitude"],
            message:
                "Latitude is required when longitude is provided",
        }
    );

export type JobSchemaType = z.infer<typeof jobSchema>;