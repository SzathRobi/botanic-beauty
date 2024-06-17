import { Service } from "@prisma/client";

export type ServiceGroup = {
  name: string;
  services: Service[];
  pricePostfix?: string;
};
