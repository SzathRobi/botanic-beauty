import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Botanic Beauty | Admin",
};

const AdminPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/bejelentkezes");
  }

  redirect("/admin/beosztas");
};

export default AdminPage;
