import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
    baseURL: Bun.env.NEXT_PUBLIC_URL,

})
