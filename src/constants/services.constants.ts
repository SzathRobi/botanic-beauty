import { ServiceGroup } from "@/types/serviceGroup.type";
import { Service } from "@prisma/client";

const STYLING_SERVICES: Service[] = [
  {
    id: "1",
    category: "Szárítás - Styling",
    name: "Mosás + Szárítás (rövid, váll feletti hossz)",
    price: 4500,
    duration: 30,
  },
  {
    id: "2",
    category: "Szárítás - Styling",
    name: "Mosás + Szárítás (hosszú, váll alatti hossz)",
    price: 6000,
    duration: 45,
  },
  {
    id: "3",
    category: "Szárítás - Styling",
    name: "Mosás + Szárítás + Göndörítés / hajvasalás",
    price: 7000,
    duration: 60,
  },
  {
    id: "4",
    category: "Szárítás - Styling",
    name: "Göndörítés / hajvasalás (mosás nélkül)",
    price: 6500,
    duration: 45,
  },
];

const CUTTING_SERVICES: Service[] = [
  {
    id: "5",
    category: "Hajvágás",
    name: "Női hajvágás + szárítás  (rövid, váll feletti  hossz)",
    price: 8200,
    duration: 90,
  },
  {
    id: "6",
    category: "Hajvágás",
    name: "Női hajvágás + szárítás (hosszú, váll alatti hossz)",
    price: 9000,
    duration: 90,
  },
  {
    id: "7",
    category: "Hajvágás",
    name: "Fru-fru vágás / igazítás",
    price: 1800,
    duration: 30,
  },
  {
    id: "8",
    category: "Hajvágás",
    name: "Férfi hajvágás mosással (géppel és ollóval)",
    price: 5500,
    duration: 60,
  },
  {
    id: "9",
    category: "Hajvágás",
    name: "Férfi hajvágás mosás nélkül",
    price: 5000,
    duration: 45,
  },
  {
    id: "10",
    category: "Hajvágás",
    name: "Férfi gépi hajvágás, 1 mérettel",
    price: 3500,
    duration: 30,
  },
  {
    id: "11",
    category: "Hajvágás",
    name: "Férfi gépi hajvágás, átmenettel",
    price: 4500,
    duration: 45,
  },
  {
    id: "12",
    category: "Hajvágás",
    name: "Szakáll igazítás (géppel)",
    price: 2100,
    duration: 30,
  },
];

const COLORING_SERVICES: Service[] = [
  {
    id: "13",
    category: "Festések",
    name: "Tőfestés",
    price: 15000,
    duration: 90,
  },
  {
    id: "14",
    category: "Festések",
    name: "Tőszőkítés (árnyalással)",
    price: 18000,
    duration: 90,
  },
  {
    id: "15",
    category: "Festések",
    name: "Teljes hajhossz festés",
    price: 19000,
    duration: 180,
  },
  {
    id: "16",
    category: "Festések",
    name: "Színfelfrissítés, árnyalás, tonizálás",
    price: 13000,
    duration: 60,
  },
  {
    id: "17",
    category: "Festések",
    name: "Balayage, ombre, babylights, (természetes hatású, átmenetes melírok, fóliával vagy szabad levegőn)",
    price: 25000,
    duration: 240,
  },
  {
    id: "18",
    category: "Festések",
    name: "Balayage / melír + tőfestés",
    price: 29000,
    duration: 240,
  },
  {
    id: "19",
    category: "Festések",
    name: "Fóliás Melír (részlegesen melírozva)",
    price: 22000,
    duration: 180,
  },
  {
    id: "20",
    category: "Festések",
    name: "Színkorrekció (elrontott haj javítása, színeltávolítása világosítással)",
    price: 25000,
    duration: 120,
  },
];

export const SERVICES: Service[] = [
  ...STYLING_SERVICES,
  ...CUTTING_SERVICES,
  ...COLORING_SERVICES,
];

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    name: "Szárítás - Styling",
    services: STYLING_SERVICES,
  },
  {
    name: "Hajvágás",
    services: CUTTING_SERVICES,
  },
  {
    name: "Festések",
    services: COLORING_SERVICES,
    pricePostfix: "(+anyag)",
  },
];
