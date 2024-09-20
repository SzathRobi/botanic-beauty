import Link from "next/link";
import { Album, CalendarDays, ImageUp, Users } from "lucide-react";

import { auth } from "@/auth";
import AdminNavList from "./AdminNavList";

const AdminNav = async () => {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div className="fixed z-20 bottom-0 left-0 w-full md:w-fit md:relative">
      <AdminNavList />
    </div>
  );
};

export default AdminNav;
