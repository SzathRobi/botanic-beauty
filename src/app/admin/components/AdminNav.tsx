import Link from "next/link";

import { auth } from "@/auth";

const AdminNav = async () => {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div>
      <ul className="py-2 sm:pt-16 flex sm:flex-col items-start gap-2 sm:gap-4 px-2 h-full bg-emerald-800 text-white">
        <li>
          <Link
            href="/admin/beosztas"
            className="px-1 sm:px-4 py-2 hover:bg-green-500/20 text-xs md:text-base"
          >
            Beosztás
          </Link>
        </li>
        <li>
          <Link
            href="/admin/foglalasok"
            className="px-1 sm:px-4 py-2 hover:bg-green-500/20 text-xs md:text-base"
          >
            Foglalások
          </Link>
        </li>
        <li>
          <Link
            href="/admin/ugyfelek"
            className="px-1 sm:px-4 py-2 hover:bg-green-500/20 text-xs md:text-base"
          >
            Ügyfelek
          </Link>
        </li>
        <li>
          <Link
            href="/admin/kepfeltoltes"
            className="px-1 sm:px-4 py-2 hover:bg-green-500/20 text-xs md:text-base"
          >
            Képfeltöltés
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminNav;
