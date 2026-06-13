export type Location = {
  id: string;
  city: string;
  area: string;
};

export const locations: Location[] = [
  { id: "jkt-pusat", city: "Jakarta", area: "Sudirman" },
  { id: "jkt-bandara", city: "Jakarta", area: "Bandara Soekarno-Hatta" },
  { id: "bdg", city: "Bandung", area: "Dago" },
  { id: "bdg-bandara", city: "Bandung", area: "Bandara Husein" },
  { id: "bali", city: "Bali", area: "Kuta" },
  { id: "bali-bandara", city: "Bali", area: "Bandara Ngurah Rai" },
];
