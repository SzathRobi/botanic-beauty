import { z } from "zod";

export const eventFormSchema = z.object({
  hairdresser: z.enum(["Timi", "nem_Timi"], {
    message: "A mező kitöltése kötelező",
  }),
  service: z.object({
    name: z.string(),
    duration: z.number(),
    price: z.number(),
  }),
  name: z.string().min(1, { message: "A mező kitöltése kötelező" }),
  email: z.string().min(1, { message: "A mező kitöltése kötelező" }),
  phone: z.string().min(1, { message: "A mező kitöltése kötelező" }),
  otherInfo: z.string().nullable(),
});
