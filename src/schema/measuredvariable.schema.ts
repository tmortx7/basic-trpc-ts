import { z } from "zod";

export const MeasuredVariableSchema = z.object({
  variable: z.string().min(1),
  mvalias: z.string().min(1),
});

export const EditMeasuredVariableSchema = MeasuredVariableSchema.extend({
  id: z.string().uuid(),
});

export type IMeasuredVariable = z.infer<typeof MeasuredVariableSchema>;
export type IEditMeasuredVarible = z.infer<typeof EditMeasuredVariableSchema>;
