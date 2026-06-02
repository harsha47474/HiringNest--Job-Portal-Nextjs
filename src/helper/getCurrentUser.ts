import { cache } from "react";
import { cookies } from "next/headers";
import { getUserBySessionToken } from "../lib/actions/sessionAction";

export const getCurrentUser = cache(async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
        return null;
    }
    
    const user = await getUserBySessionToken(token);
    return user;
});