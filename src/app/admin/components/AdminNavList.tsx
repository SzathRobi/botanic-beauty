"use client";

import { Album, CalendarDays, ImageUp, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navElements = [
  {
    title: "Beosztás",
    href: "/admin/beosztas",
    icon: <CalendarDays className="mx-auto mb-1" />,
  },
  {
    title: "Foglalások",
    href: "/admin/foglalasok",
    icon: <Album className="mx-auto mb-1" />,
  },
  {
    title: "Ügyfelek",
    href: "/admin/ugyfelek",
    icon: <Users className="mx-auto mb-1" />,
  },
  {
    title: "Képfeltöltés",
    href: "/admin/kepfeltoltes",
    icon: <ImageUp className="mx-auto mb-1" />,
  },
];

const AdminNavList = () => {
  const pathName = usePathname();

  return (
    <ul className="flex md:flex-col items-start md:pt-24 gap-2 md:gap-4 px-2 h-full bg-emerald-800">
      {navElements.map((element) => (
        <li
          key={element.title}
          className={`${
            pathName === element.href && "bg-emerald-900"
          } md:w-full flex-1 md:flex-none flex items-center rounded-md justify-center`}
        >
          <Link
            href={element.href}
            className="text-center md:w-full px-1 sm:px-4 py-2 hover:bg-green-500/20 text-xs md:text-base"
          >
            {element.icon}
            {element.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default AdminNavList;
