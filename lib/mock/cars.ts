export type CarCategory = "mpv" | "suv" | "citycar" | "premium" | "ev";
export type CarTransmission = "auto" | "manual";

export type Car = {
  slug: string;
  name: string;
  brand: string;
  category: CarCategory;
  color: string;
  capacity: number;
  transmission: CarTransmission;
  fuel: string;
  year: number;
  rateSelfDrive: number;
  rateWithDriver: number;
  deposit: number;
  available: boolean;
  exterior: string;
  side: string;
  interior: string;
};

export const cars: Car[] = [
  {
    slug: "avanza-silver",
    name: "Avanza Smart",
    brand: "Toyota",
    category: "mpv",
    color: "Silver",
    capacity: 7,
    transmission: "auto",
    fuel: "Bensin",
    year: 2024,
    rateSelfDrive: 350_000,
    rateWithDriver: 600_000,
    deposit: 1_500_000,
    available: true,
    exterior: "/images/mobil-01-exterior.webp",
    side: "/images/mobil-01-side.webp",
    interior: "/images/mobil-01-interior.webp",
  },
  {
    slug: "innova-zenix",
    name: "Innova Zenix",
    brand: "Toyota",
    category: "mpv",
    color: "Black",
    capacity: 7,
    transmission: "auto",
    fuel: "Hybrid",
    year: 2025,
    rateSelfDrive: 650_000,
    rateWithDriver: 950_000,
    deposit: 2_500_000,
    available: true,
    exterior: "/images/mobil-02-exterior.webp",
    side: "/images/mobil-02-side.webp",
    interior: "/images/mobil-02-interior.webp",
  },
  {
    slug: "pajero-sport",
    name: "Pajero Sport Adventure",
    brand: "Mitsubishi",
    category: "suv",
    color: "Black",
    capacity: 7,
    transmission: "auto",
    fuel: "Diesel",
    year: 2024,
    rateSelfDrive: 850_000,
    rateWithDriver: 1_200_000,
    deposit: 3_000_000,
    available: true,
    exterior: "/images/mobil-03-exterior.webp",
    side: "/images/mobil-03-side.webp",
    interior: "/images/mobil-03-interior.webp",
  },
  {
    slug: "fortuner-vrz",
    name: "Fortuner VRZ",
    brand: "Toyota",
    category: "suv",
    color: "White",
    capacity: 7,
    transmission: "auto",
    fuel: "Diesel",
    year: 2025,
    rateSelfDrive: 900_000,
    rateWithDriver: 1_250_000,
    deposit: 3_000_000,
    available: true,
    exterior: "/images/mobil-04-exterior.webp",
    side: "/images/mobil-04-side.webp",
    interior: "/images/mobil-04-interior.webp",
  },
  {
    slug: "brio-rs",
    name: "Brio RS Urbanite",
    brand: "Honda",
    category: "citycar",
    color: "Red",
    capacity: 5,
    transmission: "manual",
    fuel: "Bensin",
    year: 2024,
    rateSelfDrive: 280_000,
    rateWithDriver: 520_000,
    deposit: 1_000_000,
    available: true,
    exterior: "/images/mobil-05-exterior.webp",
    side: "/images/mobil-05-side.webp",
    interior: "/images/mobil-05-interior.webp",
  },
  {
    slug: "ayla-ax",
    name: "Ayla AX",
    brand: "Daihatsu",
    category: "citycar",
    color: "Silver",
    capacity: 5,
    transmission: "auto",
    fuel: "Bensin",
    year: 2024,
    rateSelfDrive: 250_000,
    rateWithDriver: 500_000,
    deposit: 800_000,
    available: false,
    exterior: "/images/mobil-06-exterior.webp",
    side: "/images/mobil-06-side.webp",
    interior: "/images/mobil-06-interior.webp",
  },
  {
    slug: "camry-executive",
    name: "Camry Executive",
    brand: "Toyota",
    category: "premium",
    color: "Navy",
    capacity: 5,
    transmission: "auto",
    fuel: "Hybrid",
    year: 2025,
    rateSelfDrive: 1_200_000,
    rateWithDriver: 1_800_000,
    deposit: 4_000_000,
    available: true,
    exterior: "/images/mobil-07-exterior.webp",
    side: "/images/mobil-07-side.webp",
    interior: "/images/mobil-07-interior.webp",
  },
  {
    slug: "e-class-executive",
    name: "E-Class 300",
    brand: "Mercedes-Benz",
    category: "premium",
    color: "Black",
    capacity: 5,
    transmission: "auto",
    fuel: "Bensin",
    year: 2025,
    rateSelfDrive: 2_400_000,
    rateWithDriver: 3_100_000,
    deposit: 6_500_000,
    available: true,
    exterior: "/images/mobil-08-exterior.webp",
    side: "/images/mobil-08-side.webp",
    interior: "/images/mobil-08-interior.webp",
  },
  {
    slug: "atto-3",
    name: "Atto 3 Premium",
    brand: "BYD",
    category: "ev",
    color: "White",
    capacity: 5,
    transmission: "auto",
    fuel: "Listrik",
    year: 2025,
    rateSelfDrive: 750_000,
    rateWithDriver: 1_100_000,
    deposit: 2_000_000,
    available: true,
    exterior: "/images/mobil-09-exterior.webp",
    side: "/images/mobil-09-side.webp",
    interior: "/images/mobil-09-interior.webp",
  },
  {
    slug: "ioniq-5",
    name: "Ioniq 5 Long Range",
    brand: "Hyundai",
    category: "ev",
    color: "Blue",
    capacity: 5,
    transmission: "auto",
    fuel: "Listrik",
    year: 2025,
    rateSelfDrive: 980_000,
    rateWithDriver: 1_400_000,
    deposit: 2_500_000,
    available: true,
    exterior: "/images/mobil-10-exterior.webp",
    side: "/images/mobil-10-side.webp",
    interior: "/images/mobil-10-interior.webp",
  },
];

export function getCarBySlug(slug: string): Car | undefined {
  return cars.find((c) => c.slug === slug);
}

export function filterCars(opts: {
  category?: CarCategory | "all";
  transmission?: CarTransmission | "all";
  capacityMin?: number;
  priceMin?: number;
  priceMax?: number;
  mode?: "selfDrive" | "withDriver";
}): Car[] {
  return cars.filter((c) => {
    if (opts.category && opts.category !== "all" && c.category !== opts.category) return false;
    if (opts.transmission && opts.transmission !== "all" && c.transmission !== opts.transmission) return false;
    if (opts.capacityMin && c.capacity < opts.capacityMin) return false;
    if (opts.priceMin || opts.priceMax) {
      const rate = opts.mode === "withDriver" ? c.rateWithDriver : c.rateSelfDrive;
      if (opts.priceMin && rate < opts.priceMin) return false;
      if (opts.priceMax && rate > opts.priceMax) return false;
    }
    return true;
  });
}
