"use client";

import {
  HOME_ROUTE,
  BOOKING_ROUTE,
  OUR_WORKS_ROUTE,
  PRICES_ROUTE,
} from "@/constants/routes.constants";
import Link from "next/link";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";

const HamburgerMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="block sm:hidden">
      <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <IoMenu size={24} />
      </button>

      {isMenuOpen && (
        <nav
          className="absolute right-0 top-14 flex h-svh w-full bg-black/70 backdrop-blur-md"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* <div className="flex-1" onClick={() => setIsMenuOpen(false)} /> */}
          <div className="absolute right-0 top-0 h-full">
            <ul className="flex h-full flex-col items-end gap-6 bg-black/70 px-8 py-4">
              <li className="shadow transition hover:text-green-700 ">
                <Link href={HOME_ROUTE}>Főoldal</Link>
              </li>
              <li className="shadow transition hover:text-green-700 ">
                <Link href={BOOKING_ROUTE}>Időpontfoglalás</Link>
              </li>
              <li className="shadow transition hover:text-green-700 ">
                <Link href={PRICES_ROUTE}>Árlista</Link>
              </li>
              <li className="shadow transition hover:text-green-700 ">
                <Link href={OUR_WORKS_ROUTE}>Munkáink</Link>
              </li>
            </ul>
          </div>
          <div className="h-full" onClick={() => setIsMenuOpen(false)}></div>
        </nav>
      )}
    </div>
  );
};

export default HamburgerMenu;
