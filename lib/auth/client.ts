import { createAuthClient } from "better-auth/react";

/**
 * Browser auth client. baseURL is omitted so it targets the current origin
 * (each instance serves one tenant from its own domain).
 */
export const authClient = createAuthClient();

export const { signIn, signOut, useSession } = authClient;
