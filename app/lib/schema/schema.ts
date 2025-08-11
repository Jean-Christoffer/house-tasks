import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(5, "Brukernavnet må være minst 5 tegn"),
  password: z
    .string()
    .min(8, "Passordet må være minst 8 tegn")
    .regex(/[A-Z]/, "Passordet må inneholde minst én stor bokstav")
    .regex(/[a-z]/, "Passordet må inneholde minst én liten bokstav")
    .regex(/[0-9]/, "Passordet må inneholde minst ett tall")
    .regex(/[^A-Za-z0-9]/, "Passordet må inneholde minst ett spesialtegn"),
});
