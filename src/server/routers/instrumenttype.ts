import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { EditInstrumentTypeSchema, InstrumentTypeSchema } from "../../schema/instrumenttype.schema";
import { prisma } from "../prisma";
import { publicProcedure, router } from "../trpc";


const defaultInstrumentTypeSelect =
  Prisma.validator<Prisma.InstrumentTypeSelect>()({
    id: true,
    mvId: true,
    instfunctionId: true,
    description: true,
  });

export const instrumenttypeRouter = router({
  list: publicProcedure.query(() => {
    return prisma.instrumentType.findMany({
      select: defaultInstrumentTypeSelect,
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
      const instx= await prisma.instrumentType.findUnique({
        where: { id },
        select: defaultInstrumentTypeSelect,
      });
      if (!instx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No instrumentType with id '${id}'`,
        });
      }
      return instx;
    }),
  add: publicProcedure
    .input(InstrumentTypeSchema)
    .mutation(async ({ input }) => {
      const instx = await prisma.instrumentType.create({
        data: {
          mvId: input.mvId,
          instfunctionId: input.instfunctionId,
          description: input.description,
        },
        select: defaultInstrumentTypeSelect,
      });
      return instx;
    }),
  edit: publicProcedure
    .input(EditInstrumentTypeSchema)
    .mutation(async ({ input }) => {
      return await prisma.instrumentType.update({
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
      return await prisma.instrumentType.delete({
        where: { id: input.id },
      });
    }),
});

