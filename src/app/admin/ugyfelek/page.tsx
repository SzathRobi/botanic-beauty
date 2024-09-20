import prisma from "@/lib/db";
import CustomersContainer from "./components/CustomersContainer";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const CustomersPage = async () => {
  const session = await auth();

  if (!session?.user)
    redirect("/admin/bejelentkezes?callbackUrl=/admin/ugyfelek");

  const customers = await prisma.customer.findMany();

  return (
    <div className="mb-10">
      <CustomersContainer salonCustomers={customers} />
    </div>
  );
};

export default CustomersPage;
