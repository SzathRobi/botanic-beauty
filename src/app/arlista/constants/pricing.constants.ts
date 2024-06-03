type PricingGroupItem = {
  name: string;
  price: number;
};

type PricingGroup = {
  name: string;
  items: PricingGroupItem[];
  pricePostfix?: string;
};

export const PRICING_GROUPS: PricingGroup[] = [
  {
    name: "Szárítás - Styling",
    items: [
      {
        name: "Mosás+Szárítás (rövid, váll feletti hossz)",
        price: 4500,
      },
      {
        name: "Mosás+Szárítás (hosszú , váll alatti  hossz)",
        price: 6000,
      },
      {
        name: "Mosás+Szárítás +Göndörítés/ hajvasalás",
        price: 7000,
      },
      {
        name: "Göndörítés / hajvasalás (mosás nélkül)",
        price: 6500,
      },
    ],
  },
  {
    name: "Hajvágás",
    items: [
      {
        name: "Női hajvágás + szárítás  (rövid, váll feletti  hossz)",
        price: 8200,
      },
      {
        name: "Női hajvágás + szárítás (hosszú, váll alatti  hossz)",
        price: 9000,
      },
      {
        name: "Fru-fru vágás / igazítás",
        price: 1800,
      },
      {
        name: "Férfi hajvágás mosással (géppel és ollóval)",
        price: 5500,
      },
      {
        name: "Férfi hajvágás mosás nélkül",
        price: 5000,
      },
      {
        name: "Férfi gépi hajvágás, 1 mérettel",
        price: 3500,
      },
      {
        name: "Férfi gépi hajvágás, átmenettel",
        price: 4500,
      },
      {
        name: "Szakáll igazítás  (géppel)",
        price: 2100,
      },
    ],
  },
  {
    name: "Festések",
    items: [
      {
        name: "Tőfestés",
        price: 15000,
      },
      {
        name: "Tőszőkítés (árnyalással)",
        price: 18000,
      },
      {
        name: "Teljes hajhossz festés",
        price: 19000,
      },
      {
        name: "Színfelfrissítés, árnyalás, tonizálás",
        price: 13000,
      },
      {
        name: "Balayage, ombre, babylights, (természetes hatású, átmenetes melírok, fóliával vagy szabad levegőn)",
        price: 25000,
      },
      {
        name: "Balayage / melír + tőfestés",
        price: 29000,
      },
      {
        name: "Fóliás Melír (részlegesen melírozva)",
        price: 22000,
      },
      {
        name: "Színkorrekció (elrontott haj javitása, színeltávolítása világosítással)",
        price: 25000,
      },
    ],
    pricePostfix: "(+anyag)",
  },
];
