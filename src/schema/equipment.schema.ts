import { z } from "zod";

export const EquipmentSchema = z.object({
  prefix: z.string().min(1),
  description: z.string(),
  siteId: z.string().uuid(),
  equiptypeId: z.string().uuid(),
});

export const EditEquipmentSchema = EquipmentSchema.extend({
  id: z.string().uuid(),
});

export type IEquipment = z.infer<typeof EquipmentSchema>;
export type IEditEquipment = z.infer<typeof EditEquipmentSchema>;
