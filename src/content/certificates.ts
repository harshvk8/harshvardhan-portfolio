import { z } from "zod";

export const certificateSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  credentialUrl: z.string().url().optional(),
  skills: z.array(z.string()).default([]),
});

export type Certificate = z.infer<typeof certificateSchema>;

/**
 * Intentionally empty for now. The universe's asteroid belt is a background
 * element labelled "Additional learning" — it suggests that certifications
 * and extra study exist outside the main project universe, but it is NOT
 * clickable. This is deliberate, not an unfinished feature. When this list
 * has real entries, the belt becomes interactive (name, issuer, date,
 * related skills, credential link).
 */
export const certificatesData: z.input<typeof certificateSchema>[] = [];

export const certificates = z.array(certificateSchema).parse(certificatesData);
