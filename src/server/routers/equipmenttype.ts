import { router, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prisma";
import {
  EditEquipmentTypeSchema,
  EquipmentTypeSchema,
} from "../../schema/equipmenttype.schema";

const defaultEquipmentTypeSelect =
  Prisma.validator<Prisma.EquipmentTypeSelect>()({
    id: true,
    equipAlias: true,
    description: true,
  });

export const equipmenttypeRouter = router({
  list: publicProcedure.query(() => {
    return prisma.equipmentType.findMany({
      select: defaultEquipmentTypeSelect,
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
      const equipx = await prisma.equipmentType.findUnique({
        where: { id },
        select: defaultEquipmentTypeSelect,
      });
      if (!equipx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No equipmentType with id '${id}'`,
        });
      }
      return equipx;
    }),
  add: publicProcedure
    .input(EquipmentTypeSchema)
    .mutation(async ({ input }) => {
      const equipx = await prisma.equipmentType.create({
        data: {
          equipAlias: input.equipAlias.toLowerCase(),
          description: input.description.toLowerCase(),
        },
        select: defaultEquipmentTypeSelect,
      });
      return equipx;
    }),
  edit: publicProcedure
    .input(EditEquipmentTypeSchema)
    .mutation(async ({ input }) => {
      return await prisma.equipmentType.update({
        where: {
          id: input.id,
        },
        data: {
          id: input.id,
          equipAlias: input.equipAlias.toLowerCase(),
          description: input.description.toLowerCase(),
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
      return await prisma.equipmentType.delete({
        where: { id: input.id },
      });
    }),
});
