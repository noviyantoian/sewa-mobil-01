/**
 * Repository layer — tenant-scoped data access over `withTenant` (RLS enforced).
 * Drop-in replacement for `lib/mock/*`; every function takes the resolved
 * `tenantId` (from `lib/tenant/current.ts`) as its first argument.
 */
export * from "./fleet"; // listCars, getCarBySlug, listLocations, listDrivers
export * from "./bookings"; // listBookings, getBookingByCode, createBooking, DoubleBookingError
