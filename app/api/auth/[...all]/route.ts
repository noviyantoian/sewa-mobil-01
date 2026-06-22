import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/auth";

// All better-auth endpoints (sign-in, sign-out, session, …) under /api/auth/*.
export const { GET, POST } = toNextJsHandler(auth);
