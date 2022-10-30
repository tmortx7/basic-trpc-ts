import { z } from "zod";

export const AddressSchema = z.object({
  plusCode: z.string(),
  add1: z.string(),
  add2: z.string(),
  city: z.string(),
  province: z.string(),
  country: z.string(),
  postalCode: z.string(),
  note: z.string(),
  siteId: z.string().uuid(),
})

export const EditAddressSchema = AddressSchema.extend({
  id: z.string().uuid(),
})

export type IAddress = z.infer<typeof AddressSchema>
export type IEditAddress = z.infer<typeof EditAddressSchema>