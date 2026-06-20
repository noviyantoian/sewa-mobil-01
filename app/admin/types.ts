import type { UiCar } from "@/lib/repo";
import type { BookingStatus } from "@/lib/mock/bookings";

/**
 * Admin view models — DB rows pre-resolved into the shapes the admin client
 * components expect (car attached, dates as ISO strings, driver rating as a
 * number). Type-only module, safe to import from client components.
 */
export interface AdminBooking {
  id: string; // human booking code (e.g. FK-26-0001)
  carSlug: string;
  car: UiCar | null;
  customerName: string;
  customerPhone: string;
  pickupAt: string; // yyyy-mm-dd
  returnAt: string; // yyyy-mm-dd
  mode: "selfDrive" | "withDriver";
  total: number;
  deposit: number;
  status: BookingStatus;
  createdAt: string; // ISO
  driverId: string | null;
}

export interface AdminDriver {
  id: string;
  name: string;
  status: "idle" | "assigned" | "off";
  rating: number;
  city: string;
  experienceYears: number;
}
