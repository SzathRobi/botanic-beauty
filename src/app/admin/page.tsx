import { auth } from "@/auth";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/bejelentkezes");
  }

  redirect("/admin/beosztas");
};

export default AdminPage;
