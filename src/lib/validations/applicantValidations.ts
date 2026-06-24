import { z } from "zod";

export const applicantProfileSchema = z.object({
  profileImageUrl: z.string().optional(),
  biography: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional().or(z.literal("")),
  maritalStatus: z.enum(["single", "married", "divorced"]).optional().or(z.literal("")),
  education: z.enum(["none", "high school", "undergraduate", "masters", "phd"]).optional().or(z.literal("")),
  experience: z.string().optional(),
  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  location: z.string().optional(),
  resumes: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ).max(5, "You can upload a maximum of 5 resumes"),
});

export type ApplicantProfileInput = z.infer<typeof applicantProfileSchema>;
