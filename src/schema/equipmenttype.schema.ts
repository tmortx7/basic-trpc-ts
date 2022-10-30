import { z } from "zod";

export const EquipmentTypeSchema = z.object({
  equipAlias: z.string().min(1),
  description: z.string(),
})

export const EditEquipmentTypeSchema = EquipmentTypeSchema.extend({
  id: z.string().uuid(),
})

export type IEquipmentType = z.infer<typeof EquipmentTypeSchema>
export type IEditEquipmentType = z.infer<typeof EditEquipmentTypeSchema>