import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { getIPAddress } from "@/src/helper/generateIP";
import { sessions, users } from "@/src/drizzle/schema";
import { db } from "@/config/db";
import { SESSION_LIFETIME, SESSION_REFRESH_TIME } from "@/config/constant";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { generateSessionToken } from "@/src/helper/generateToken";

type CreateSessionData = {
    userAgent: string;
    ip: string;
    userId: number;
    token: string;
};

const createUserSession = async ({
    token,
    userId,
    userAgent,
    ip,
}: CreateSessionData) => {
    const hashedToken = crypto.createHash("sha-256").update(token).digest("hex");

    const [session] = await db.insert(sessions).values({
        id: hashedToken,
        userId,
        expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
        ipAddress: ip,
        userAgent,
    });

    return session;
};


export const createUserSessionAndSetCookie = async (userId: number) => {
    const userAgent = (await headers()).get("user-agent") || "Unknown";
    const ip = await getIPAddress();
    const token = generateSessionToken();

    await createUserSession({ token, userId, userAgent, ip });

    const cookieStore = await cookies();

    cookieStore.set("session", token, {
        secure: true,
        httpOnly: true,
        maxAge: SESSION_LIFETIME,
    });
};



export const getUserBySessionToken = async (token: string) => {
    const hashedToken = crypto.createHash("sha-256").update(token).digest("hex");

    const [user] = await db.select({
        id: users.id,
        session: {
            id: sessions.id,
            expiresAt: sessions.expiresAt,
            userAgent: sessions.userAgent,
            ipAddress: sessions.ipAddress,
        },
        name: users.name,
        userName: users.userName,
        role: users.role,
        email: users.email,
        createdAt: users.created_at,
        updatedAt: users.updatedAt,
    }).from(sessions).where(eq(sessions.id, hashedToken)).innerJoin(users, eq(sessions.userId, users.id));

    if (!user) {
        return null;
    }

    if(user.session.expiresAt < new Date()) {
        await db.delete(sessions).where(eq(sessions.id, user.session.id));
        return null;
    }

    return user;
}

