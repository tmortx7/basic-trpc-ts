import { z } from "zod";

export const InstrumentTagSchema = z.object({
  tag: z.string().min(1),
  equipmentId: z.string().uuid(),
  instrumenttypeId: z.string().uuid()
})

export const EditInstrumentTagSchema = InstrumentTagSchema.extend({
  id: z.string().uuid()
})

export type IInstrumentTag = z.infer<typeof InstrumentTagSchema>
export type IEditInstrumentTag = z.infer<typeof EditInstrumentTagSchema>