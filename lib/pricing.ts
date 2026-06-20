import { differenceInCalendarDays } from "date-fns";
import type { BookingMode } from "@/lib/db/schema";

/**
 * Rental pricing — pure functions, no DB. Deposit is shown separately from the
 * rental subtotal (refundable, held), per PRD §6.4 / §7.1 trust-first pricing.
 */

export interface PricingCar {
  rateSelfDrive: number;
  rateWithDriver: number;
  deposit: number;
}

export interface PriceBreakdown {
  days: number;
  dailyRate: number;
  subtotal: number; // rental only (days × dailyRate)
  deposit: number; // refundable, held separately
  grandTotal: number; // subtotal + deposit, due at checkout
}

const MIN_RENTAL_DAYS = 1;

/** Calendar-day span, minimum 1 (a same-day rental still bills one day). */
export function rentalDays(from: Date, to: Date): number {
  return Math.max(MIN_RENTAL_DAYS, differenceInCalendarDays(to, from));
}

export function dailyRate(car: PricingCar, mode: BookingMode): number {
  return mode === "withDriver" ? car.rateWithDriver : car.rateSelfDrive;
}

export function calcPrice(
  car: PricingCar,
  mode: BookingMode,
  from: Date,
  to: Date,
): PriceBreakdown {
  const days = rentalDays(from, to);
  const rate = dailyRate(car, mode);
  const subtotal = days * rate;
  return {
    days,
    dailyRate: rate,
    subtotal,
    deposit: car.deposit,
    grandTotal: subtotal + car.deposit,
  };
}
