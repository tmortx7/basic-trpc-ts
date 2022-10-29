import { z } from "zod";

export const InstrumentFunctionSchema = z.object({
  instrumentfunction: z.string().min(1),
  alias: z.string().min(1),
});

export const EditInstrumentFunctionSchema = InstrumentFunctionSchema.extend({
  id: z.string().uuid(),
});

export type IInstrumentFunction = z.infer<typeof InstrumentFunctionSchema>;
export type IEditInstrumentFunction = z.infer<
  typeof EditInstrumentFunctionSchema
>;
