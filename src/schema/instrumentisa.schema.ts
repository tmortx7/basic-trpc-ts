import { z } from "zod";

export const InstrumentISASchema = z.object({
  mvId: z.string().uuid(),
  instfunctionId: z.string().uuid(),
  description: z.string().min(1)
})

export const EditInstrumentISASchema = InstrumentISASchema.extend({
  id: z.string().uuid()
})

export type IInstrumentISA = z.infer<typeof InstrumentISASchema>
export type IEditInstrumentISA = z.infer<typeof EditInstrumentISASchema>