import { router, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prisma";
import { EditInstrumentTagSchema, InstrumentTagSchema } from "../../schema/instrumenttag.schema";


const defaultInstrumentTagSelect =
  Prisma.validator<Prisma.InstrumentTagSelect>()({
    id: true,
    tag: true,
    equipmentId: true,
    instrumenttypeId: true,
  });

export const instrumenttagRouter = router({
  list: publicProcedure.query(() => {
    return prisma.instrumentTag.findMany({
      select: defaultInstrumentTagSelect,
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
      const tagx = await prisma.instrumentTag.findUnique({
        where: { id },
        select: defaultInstrumentTagSelect,
      });
      if (!tagx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No instrumentTag with id '${id}'`,
        });
      }
      return tagx;
    }),
  add: publicProcedure
    .input(InstrumentTagSchema)
    .mutation(async ({ input }) => {
      const tagx = await prisma.instrumentTag.create({
        data: {
          tag: input.tag.toLowerCase(),
          equipmentId: input.equipmentId,
          instrumenttypeId: input.instrumenttypeId
        },
        select: defaultInstrumentTagSelect,
      });
      if (!tagx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Error`,
        });
      }
      return tagx;
    }),
  edit: publicProcedure
    .input(EditInstrumentTagSchema)
    .mutation(async ({ input }) => {
      return await prisma.instrumentTag.update({
        where: {
          id: input.id,
        },
        data: {
          id: input.id,
          tag: input.tag.toLowerCase(),
          equipmentId: input.equipmentId,
          instrumenttypeId: input.instrumenttypeId,
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
      return await prisma.instrumentTag.delete({
        where: { id: input.id },
      });
    }),
});
