import { z } from "zod";

export const SiteSchema = z.object({
  site: z.string().min(1),
  siteAlias: z.string().min(1),
  description: z.string(),
  deptId: z.string().uuid(),
})

export const EditSiteSchema = SiteSchema.extend({
  id: z.string().uuid(),
})

export type ISite = z.infer<typeof SiteSchema>
export type IEditSite = z.infer<typeof EditSiteSchema>