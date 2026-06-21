import type { UiCar } from "@/lib/repo";
import type { BookingStatus } from "@/lib/db/schema";

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
  carUnitId: string | null; // assigned physical unit (plate), null until set
  carUnitPlate: string | null; // resolved plate for display
}

/** A physical fleet unit with live runtime status, for dashboard + armada. */
export interface AdminUnit {
  id: string;
  carId: string;
  carName: string;
  plate: string;
  label: string | null;
  status: "available" | "maintenance";
  running: boolean; // out on an active/confirmed booking right now
  booking: {
    code: string;
    customerName: string | null;
    driverName: string | null;
    toAt: string;
  } | null;
  events: {
    id: string;
    fromStatus: string | null;
    toStatus: string;
    note: string | null;
    actor: string | null;
    createdAt: string; // ISO
  }[];
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
  carUnitId: string | null; // assigned physical unit (plate)
  units: { id: string; plate: string; label: string | null; running: boolean }[]; // assignable units of this car
  pickup: string | null; // "City — Area"
  ret: string | null;
  pickupAddress: string | null; // customer delivery address
  returnAddress: string | null;
  documents: {
    id: string;
    type: string;
    url: string;
    verifyStatus: string;
    verifiedBy: string | null;
    verifiedAt: string | null;
  }[];
  drivers: { id: string; name: string }[]; // assignable
}
