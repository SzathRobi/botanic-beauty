import BackgroundBlur from "@/components/BackgroundBlur";
import { Service } from "@prisma/client";
import prisma from "@/lib/db";
import ServiceTable from "./components/serviceTable";

const ServicesPage = async () => {
  const services: Service[] = await prisma.service.findMany();

  return (
    <section>
      <BackgroundBlur className="!max-w-full">
        <h1 className="mb-8">Szolgáltatások</h1>

        <ServiceTable services={services} />
      </BackgroundBlur>
    </section>
  );
};

export default ServicesPage;
