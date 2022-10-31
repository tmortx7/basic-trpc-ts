import { router, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prisma";
import {
  EditEquipmentSchema,
  EquipmentSchema,
} from "../../schema/equipment.schema";

const defaultEquipmentSelect = Prisma.validator<Prisma.EquipmentSelect>()({
  id: true,
  prefix: true,
  description: true,
  siteId: true,
  equiptypeId: true,
  site: true,
});

export const equipmentRouter = router({
  list: publicProcedure.query(() => {
    return prisma.equipment.findMany({
      select: defaultEquipmentSelect,
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
      const equipx = await prisma.equipment.findUnique({
        where: { id },
        select: defaultEquipmentSelect,
      });
      if (!equipx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No equipment with id '${id}'`,
        });
      }
      return equipx;
    }),
  add: publicProcedure.input(EquipmentSchema).mutation(async ({ input }) => {
    const equipx = await prisma.equipment.create({
      data: {
        prefix: input.prefix.toLowerCase(),
        description: input.description.toLowerCase(),
        siteId: input.siteId,
        equiptypeId: input.equiptypeId,
      },
      select: defaultEquipmentSelect,
    });
    return equipx;
  }),
  edit: publicProcedure
    .input(EditEquipmentSchema)
    .mutation(async ({ input }) => {
      return await prisma.equipment.update({
        where: {
          id: input.id,
        },
        data: {
          id: input.id,
          prefix: input.prefix.toLowerCase(),
          description: input.description.toLowerCase(),
          siteId: input.siteId,
          equiptypeId: input.equiptypeId,
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
      return await prisma.equipment.delete({
        where: { id: input.id },
      });
    }),
});
