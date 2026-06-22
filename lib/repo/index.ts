/**
 * Repository layer — tenant-scoped data access over `withTenant` (RLS enforced).
 * Drop-in replacement for `lib/mock/*`; every function takes the resolved
 * `tenantId` (from `lib/tenant/current.ts`) as its first argument.
 */
export * from "./fleet"; // listCars, getCarBySlug, listLocations, listDrivers
export * from "./units"; // listUnitViews, listUnitsByCar, createUnit, updateUnit, deleteUnit
export * from "./bookings"; // listBookings, getBookingByCode, createBooking, assignUnit, DoubleBookingError
export * from "./tenant"; // updateTenantSettings
export * from "./members"; // listMembers, getSeatInfo, createMember, updateMemberRole, deleteMember, SeatLimitError
