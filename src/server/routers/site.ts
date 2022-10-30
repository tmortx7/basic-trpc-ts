import { router, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prisma";
import { EditSiteSchema, SiteSchema } from "../../schema/site.schema";


const defaultSiteSelect =
  Prisma.validator<Prisma.SiteSelect>()({
    id: true,
    site: true,
    siteAlias: true,
    description: true,
    deptId: true,
  });

export const siteRouter= router({
  list: publicProcedure.query(() => {
    return prisma.site.findMany({
      select: defaultSiteSelect,
    });
  }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;
      const sitex = await prisma.site.findUnique({
        where: { id },
        select: defaultSiteSelect,
      });
      if (!sitex) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No site with id '${id}'`,
        });
      }
      return sitex;
    }),
  add: publicProcedure
    .input(SiteSchema)
    .mutation(async ({ input }) => {
      const sitex = await prisma.site.create({
        data: {
          site: input.site.toLowerCase(),
          siteAlias: input.siteAlias.toLowerCase(),
          description: input.description.toLowerCase(),
          deptId: input.deptId,
        },
        select: defaultSiteSelect,
      });
      return sitex;
    }),
  edit: publicProcedure
    .input(EditSiteSchema)
    .mutation(async ({ input }) => {
      return await prisma.site.update({
        where: {
          id: input.id,
        },
        data: {
          id: input.id,
          site: input.site.toLowerCase(),
          siteAlias: input.siteAlias.toLowerCase(),
          description: input.description.toLowerCase(),
          deptId: input.deptId,
        },
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.site.delete({
        where: { id: input.id },
      });
    }),
});
