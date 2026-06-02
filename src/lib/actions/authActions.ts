"use server"

import { users } from "@/src/drizzle/schema";
import { db } from "@/src/config/db";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";
import { baseRegisterSchema, BaseRegisterSchemaType, loginSchema, LoginSchemaType } from "@/src/lib/validations/authValidations";
import { createUserSessionAndSetCookie } from "@/src/lib/actions/sessionAction";

// Registration action
export const registrationAction = async (data: BaseRegisterSchemaType) => {
    try {
        const { data: validatedData, error } = baseRegisterSchema.safeParse(data);
        if (error) {
            return { success: false, message: "Invalid input data" };
        }

        const { name, userName, email, password, role } = validatedData;

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
        const [result] = await db.insert(users).values({ name, userName, email, password: hashedPassword, role });

        await createUserSessionAndSetCookie(result.insertId);

        return { success: true, message: "Registration successful" };
    } catch (error) {
        console.error("Error during registration:", error);
        return { success: false, message: "Registration failed" };
    }
}


// Login action
export const loginAction = async (data: LoginSchemaType) => {
    try {
        const { data: validatedData, error } = loginSchema.safeParse(data);
        if (error) {
            return { success: false, message: "Invalid input data" };
        }

        const { email, password } = validatedData;

        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user) {
            return { success: false, message: "Invalid email or password" };
        }

        const isValidPassword = await argon2.verify(user.password, password);
        if (!isValidPassword) {
            return { success: false, message: "Invalid email or password" };
        }

        await createUserSessionAndSetCookie(user.id);

        return { success: true, message: "Login successful", role: user.role };

    } catch (error) {
        console.error("Error during login:", error);
        return { success: false, message: "Login failed" };
    }
}