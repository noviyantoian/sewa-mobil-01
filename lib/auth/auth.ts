import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import {
  authAccount,
  authSession,
  authUser,
  authVerification,
} from "@/lib/db/schema";

const isProduction = process.env.NODE_ENV === "production";
// `next build` imports this module to collect page data, but the per-instance
// secret/URL aren't present then — they're supplied at RUNTIME via the PM2
// --env-file (build-once, deploy-many). Relax the hard requirements during the
// build phase only; runtime still enforces them (fail-fast on a misconfigured
// instance).
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

const secret =
  process.env.BETTER_AUTH_SECRET ??
  (isBuildPhase ? "build-phase-placeholder-unused-at-runtime" : undefined);
if (!secret) {
  throw new Error(
    "BETTER_AUTH_SECRET is not set — generate one (openssl rand -base64 32) and add it to .env",
  );
}

// In production behind a reverse proxy (nginx terminates TLS, forwards HTTP to
// Node), the request protocol is http, so better-auth would otherwise drop the
// Secure cookie flag and could mis-resolve its origin. Require the public URL.
if (isProduction && !isBuildPhase && !process.env.BETTER_AUTH_URL) {
  throw new Error(
    "BETTER_AUTH_URL must be set in production (e.g. https://rental.klien.com)",
  );
}

/**
 * Admin auth (email + password) backed by native Postgres via the Drizzle
 * adapter. Replaces Supabase Auth. better-auth handles scrypt password hashing,
 * server-side sessions (auth_session), CSRF, and rate limiting.
 *
 * Public sign-up is disabled — admin accounts are provisioned out of band
 * (scripts/create-admin.mjs). A valid session is still NOT enough to reach
 * /admin: the email must be in ADMIN_EMAILS (lib/auth/guard.ts + middleware).
 */
export const auth = betterAuth({
  secret,
  // Resolved from the request when unset; set BETTER_AUTH_URL in production.
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: authUser,
      session: authSession,
      account: authAccount,
      verification: authVerification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  // Force the Secure cookie flag in production even when Node sees plain HTTP
  // from the proxy. httpOnly + sameSite=lax are set by better-auth already.
  advanced: {
    useSecureCookies: isProduction,
  },
  // Brute-force guard on the (single) admin login surface: 10 attempts / 15 min.
  rateLimit: {
    enabled: true,
    window: 900,
    max: 10,
  },
});
