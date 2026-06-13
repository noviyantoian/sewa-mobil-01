export type Driver = {
  id: string;
  name: string;
  experienceYears: number;
  rating: number;
  city: string;
  status: "idle" | "assigned" | "off";
};

export const drivers: Driver[] = [
  { id: "DR-001", name: "Bambang R.", experienceYears: 8, rating: 4.9, city: "Jakarta", status: "idle" },
  { id: "DR-002", name: "Hadi M.", experienceYears: 5, rating: 4.8, city: "Jakarta", status: "assigned" },
  { id: "DR-003", name: "Wayan G.", experienceYears: 7, rating: 4.95, city: "Bali", status: "assigned" },
  { id: "DR-004", name: "Asep S.", experienceYears: 4, rating: 4.7, city: "Bandung", status: "idle" },
];
