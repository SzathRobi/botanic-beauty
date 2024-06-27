import { z } from "zod";

export const eventFormSchema = z.object({
  hairdresser: z.enum(["Timi", "nem_Timi"], {
    message: "A mező kitöltése kötelező",
  }),
  services: z
    .array(
      z.object({ name: z.string(), duration: z.number(), price: z.number() })
    )
    .min(1, { message: "A mező kitöltése kötelező" }),
  name: z.string().min(1, { message: "A mező kitöltése kötelező" }),
  email: z.string().min(1, { message: "A mező kitöltése kötelező" }),
  phone: z.string().min(1, { message: "A mező kitöltése kötelező" }),
  otherInfo: z.string().nullable(),
});
