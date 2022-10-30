import { z } from "zod";

export const InstrumentTypeSchema = z.object({
  mvId: z.string().uuid(),
  instfunctionId: z.string().uuid(),
  description: z.string().min(1)
})

export const EditInstrumentTypeSchema = InstrumentTypeSchema.extend({
  id: z.string().uuid()
})

export type IInstrumentType = z.infer<typeof InstrumentTypeSchema>
export type IEditInstrumentType = z.infer<typeof EditInstrumentTypeSchema>