import Link from "next/link";

import { auth } from "@/auth";

const AdminNav = async () => {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div className="pt-14">
      <ul className="pt-4 flex flex-col items-start gap-4 px-2 h-full bg-emerald-800 text-white">
        <li>
          <Link
            href="/admin/beosztas"
            className="px-4 py-2 hover:bg-green-500/20"
          >
            Beosztás
          </Link>
        </li>
        <li>
          <Link
            href="/admin/foglalasok"
            className="px-4 py-2 hover:bg-green-500/20"
          >
            Foglalások
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminNav;
