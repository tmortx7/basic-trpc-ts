import { router, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prisma";
import { EditInstrumentFunctionSchema, InstrumentFunctionSchema } from "../../schema/instrumentfunction.schema";


const defaultInstrumentFunctionSelect =
  Prisma.validator<Prisma.InstrumentFunctionSelect>()({
    id: true,
    instrumentfunction: true,
    alias: true,
  });

export const instrumentfunctionRouter = router({
  list: publicProcedure.query(() => {
    return prisma.instrumentFunction.findMany({
      select: defaultInstrumentFunctionSelect,
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
      const instx = await prisma.instrumentFunction.findUnique({
        where: { id },
        select: defaultInstrumentFunctionSelect,
      });
      if (!instx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No instrument function with id '${id}'`,
        });
      }
      return instx;
    }),
  add: publicProcedure
    .input(InstrumentFunctionSchema)
    .mutation(async ({ input }) => {
      const instx = await prisma.instrumentFunction.create({
        data: {
          instrumentfunction: input.instrumentfunction.toLowerCase(),
          alias: input.alias.toLowerCase(),
        },
        select: defaultInstrumentFunctionSelect,
      });
      return instx;
    }),
  edit: publicProcedure
    .input(EditInstrumentFunctionSchema)
    .mutation(async ({ input }) => {
      return await prisma.instrumentFunction.update({
        where: {
          id: input.id,
        },
        data: {
          id: input.id,
          instrumentfunction: input.instrumentfunction.toLowerCase(),
          alias: input.alias.toLowerCase(),
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
      return await prisma.instrumentFunction.delete({
        where: { id: input.id },
      });
    }),
});
