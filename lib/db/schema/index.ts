/**
 * Drizzle schema barrel — single import surface for the multi-tenant model.
 * 13 tables across 4 domains. See docs/SAAS-PLAN.md §6 for the ER diagram.
 */
export * from "./tenancy"; // plans, tenants, subscriptions, domains
export * from "./auth"; // users, memberships
export * from "./fleet"; // cars, car_images, locations, drivers
export * from "./booking"; // bookings, documents, payments
export * from "./betterauth"; // auth_user, auth_session, auth_account, auth_verification (admin login)
