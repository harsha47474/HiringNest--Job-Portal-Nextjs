import { z } from "zod";


// TODO : Enum operator for organization type and teamSize for more safety
  
export const employerProfileSchema = z.object({ 
  name: z.string().min(4).max(255),
  description: z.string().min(20).max(255),
  bannerImageUrl: z.string().url().optional(),
  organizationType: z.string().max(100),
  teamSize: z.string().max(50),
  yearOfEstablishment: z.number().min(1900).optional(),
  websiteUrl: z.string().url().optional(),
  location: z.string().min(2).max(255),
});

export type EmployerProfileInput = z.infer<typeof employerProfileSchema>;