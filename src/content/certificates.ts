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
 * None yet. The universe renders a decorative asteroid belt regardless;
 * once this has entries, each asteroid becomes a clickable certificate
 * (name, issuer, date, related skills, credential link).
 */
export const certificatesData: z.input<typeof certificateSchema>[] = [];

export const certificates = z.array(certificateSchema).parse(certificatesData);
