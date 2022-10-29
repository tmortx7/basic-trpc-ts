import { router, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../..//server/prisma";
import { EditInstrumentISASchema, InstrumentISASchema } from "../../schema/instrumentisa.schema";


const defaultInstrumentISASelect =
  Prisma.validator<Prisma.InstrumentISASelect>()({
    id: true,
    mvId: true,
    instfunctionId: true,
    description: true,
  });

export const instrumentisaRouter = router({
  list: publicProcedure.query(() => {
    return prisma.instrumentISA.findMany({
      select: defaultInstrumentISASelect,
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
      const instx= await prisma.instrumentISA.findUnique({
        where: { id },
        select: defaultInstrumentISASelect,
      });
      if (!instx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No instrumentISA with id '${id}'`,
        });
      }
      return instx;
    }),
  add: publicProcedure
    .input(InstrumentISASchema)
    .mutation(async ({ input }) => {
      const instx = await prisma.instrumentISA.create({
        data: {
          mvId: input.mvId,
          instfunctionId: input.instfunctionId,
          description: input.description,
        },
        select: defaultInstrumentISASelect,
      });
      return instx;
    }),
  edit: publicProcedure
    .input(EditInstrumentISASchema)
    .mutation(async ({ input }) => {
      return await prisma.instrumentISA.update({
        where: {
          id: input.id,
        },
        data: {
          id: input.id,
          mvId: input.mvId,
          instfunctionId: input.instfunctionId,
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
      return await prisma.instrumentISA.delete({
        where: { id: input.id },
      });
    }),
});

