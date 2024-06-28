import { TService } from "@prisma/client";

export type ServiceGroup = {
  name: string;
  services: TService[];
  pricePostfix?: string;
};
