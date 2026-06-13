export type BookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";

export type Booking = {
  id: string;
  carSlug: string;
  customerName: string;
  customerPhone: string;
  pickupLocationId: string;
  returnLocationId: string;
  pickupAt: string;
  returnAt: string;
  mode: "selfDrive" | "withDriver";
  driverId?: string;
  total: number;
  deposit: number;
  status: BookingStatus;
  createdAt: string;
};

export const bookings: Booking[] = [
  {
    id: "FK-26-0001",
    carSlug: "innova-zenix",
    customerName: "Andi P.",
    customerPhone: "+62812-XXXX-1234",
    pickupLocationId: "jkt-pusat",
    returnLocationId: "jkt-pusat",
    pickupAt: "2026-06-14T08:00:00+07:00",
    returnAt: "2026-06-17T08:00:00+07:00",
    mode: "selfDrive",
    total: 1_950_000,
    deposit: 2_500_000,
    status: "active",
    createdAt: "2026-06-12T10:21:00+07:00",
  },
  {
    id: "FK-26-0002",
    carSlug: "atto-3",
    customerName: "Sari W.",
    customerPhone: "+62811-XXXX-5566",
    pickupLocationId: "jkt-bandara",
    returnLocationId: "jkt-bandara",
    pickupAt: "2026-06-15T14:00:00+07:00",
    returnAt: "2026-06-18T14:00:00+07:00",
    mode: "withDriver",
    driverId: "DR-002",
    total: 3_300_000,
    deposit: 2_000_000,
    status: "confirmed",
    createdAt: "2026-06-13T19:08:00+07:00",
  },
  {
    id: "FK-26-0003",
    carSlug: "fortuner-vrz",
    customerName: "Budi S.",
    customerPhone: "+62813-XXXX-2222",
    pickupLocationId: "bdg",
    returnLocationId: "bdg",
    pickupAt: "2026-06-20T09:00:00+07:00",
    returnAt: "2026-06-23T09:00:00+07:00",
    mode: "selfDrive",
    total: 2_700_000,
    deposit: 3_000_000,
    status: "pending",
    createdAt: "2026-06-13T21:00:00+07:00",
  },
  {
    id: "FK-26-0004",
    carSlug: "ioniq-5",
    customerName: "Rina H.",
    customerPhone: "+62815-XXXX-7788",
    pickupLocationId: "bali",
    returnLocationId: "bali-bandara",
    pickupAt: "2026-07-01T12:00:00+07:00",
    returnAt: "2026-07-04T12:00:00+07:00",
    mode: "withDriver",
    driverId: "DR-003",
    total: 4_200_000,
    deposit: 2_500_000,
    status: "confirmed",
    createdAt: "2026-06-10T16:32:00+07:00",
  },
  {
    id: "FK-26-0005",
    carSlug: "brio-rs",
    customerName: "Dani K.",
    customerPhone: "+62812-XXXX-9100",
    pickupLocationId: "jkt-pusat",
    returnLocationId: "jkt-pusat",
    pickupAt: "2026-05-30T07:00:00+07:00",
    returnAt: "2026-06-01T07:00:00+07:00",
    mode: "selfDrive",
    total: 560_000,
    deposit: 1_000_000,
    status: "completed",
    createdAt: "2026-05-28T12:00:00+07:00",
  },
];
