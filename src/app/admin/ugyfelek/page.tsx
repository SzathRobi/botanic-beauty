import prisma from "@/lib/db";
import CustomersContainer from "./components/CustomersContainer";

const CustomersPage = async () => {
  const customers = await prisma.customer.findMany();

  return (
    <div>
      <CustomersContainer salonCustomers={customers} />
    </div>
  );
};

export default CustomersPage;
