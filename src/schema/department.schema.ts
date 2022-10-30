import { z } from "zod";

export const DepartmentSchema = z.object({
  dept: z.string().min(1),
  deptAlias: z.string().min(1),
  description: z.string(),
})

export const EditDepartmentSchema = DepartmentSchema.extend({
  id: z.string().uuid(),
})

export type IDepartment = z.infer<typeof DepartmentSchema>
export type IEditDepartment = z.infer<typeof EditDepartmentSchema>