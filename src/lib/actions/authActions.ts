"use server"

import { users } from "@/src/drizzle/schema";
import { db } from "@/config/db";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";


// Registration action

type RegistrationData = {
    name: string;
    userName: string;
    email: string;
    password: string;
    role: "applicant" | "employee";
}

export const registrationAction = async (data: RegistrationData) => {
    try {
        const { name, userName, email, password, role } = data;

        const [existingUser] = await db.select().from(users).where(or(eq(users.email, email), eq(users.userName, userName)));

        if (existingUser) {
            if (existingUser.email === email) {
                return { success: false, message: "Email already in use" };
            } else {
                return { success: false, message: "Username already exists" };
            }
        }


        console.log("Received form data:", { name, userName, email, password, role }); //logs (have to remove it later)
        const hashedPassword = await argon2.hash(password);
        await db.insert(users).values({ name, userName, email, password: hashedPassword, role });

        return { success: true, message: "Registration successful" };
    } catch (error) {
        console.error("Error during registration:", error);
        return { success: false, message: "Registration failed" };
    }
}


// Login action

type LoginData = {
    email: string;
    password: string;
}

export const loginAction = async (data: LoginData) => {
    try {
        const { email, password } = data;

        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user) {
            return { success: false, message: "Invalid email or password" };
        }

        const isValidPassword = await argon2.verify(user.password, password);
        if (!isValidPassword) {
            return { success: false, message: "Invalid email or password" };
        }

        return { success: true, message: "Login successful" };

    } catch (error) {
        console.error("Error during login:", error);
        return { success: false, message: "Login failed" };
    }
}