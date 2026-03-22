import { z } from "zod";

export const socialSchema = z.object({
  facebook: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  website: z.string().optional(),
});


export const profileDetailSchema = z.object({
  displayName: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
});