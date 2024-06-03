import { Service } from "@prisma/client";

export const services: Service[] = [
  {
    id: "1",
    name: "Hajvágás",
    duration: 45,
    category: "Hajvagás",
    price: 5000,
  },
  {
    id: "2",
    name: "Hajfestés",
    duration: 240,
    category: "Festések",
    price: 30000,
  },
];
