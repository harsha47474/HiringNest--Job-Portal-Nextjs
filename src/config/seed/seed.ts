import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());


import { db } from "../db";
import { jobs } from "@/src/drizzle/schema";
import "dotenv/config";

async function seed() {
  await db.insert(jobs).values([
    {
      title: "Frontend Developer",
      description: "Build modern React applications",
      tags: "React,TypeScript,Next.js",
      minSalary: 600000,
      maxSalary: 1200000,
      salaryCurrency: "INR",
      salaryPeriod: "yearly",
      jobType: "full_time",
      location: "Bangalore, India",
      workType: "hybrid",
      jobLevel: "mid",
      experience: "2-4 years",
      minEducation: "bachelors",
      isFeatured: true,
      status: "published",
      employerId: 1,
      expiresAt: new Date("2026-12-31"),
    },
  ]);

  console.log("Seed completed");
  process.exit(0);
}

seed().catch(console.error);