import type { UiCar } from "@/lib/repo";
import type { BookingStatus } from "@/lib/mock/bookings";

/**
 * Admin view models — DB rows pre-resolved into the shapes the admin client
 * components expect (car attached, dates as ISO strings, driver rating as a
 * number). Type-only module, safe to import from client components.
 */
export interface AdminBooking {
  id: string; // human booking code (e.g. FK-26-0001) — for display
  bookingId: string; // DB uuid — for mutations (status, driver assign)
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

export interface BookingDetailVM {
  code: string; // human code (FK-26-0001)
  bookingId: string; // DB uuid
  status: BookingStatus;
  mode: "selfDrive" | "withDriver";
  channel: string;
  customerName: string;
  customerPhone: string;
  fromAt: string; // ISO
  toAt: string; // ISO
  createdAt: string; // ISO
  total: number;
  deposit: number;
  car: { id: string; slug: string; name: string; brand: string } | null;
  driverId: string | null;
  pickup: string | null; // "City — Area"
  ret: string | null;
  documents: { id: string; type: string; url: string; verifyStatus: string }[];
  drivers: { id: string; name: string }[]; // assignable
}
