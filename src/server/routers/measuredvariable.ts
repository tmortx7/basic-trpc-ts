import { router, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../..//server/prisma";
import {
  EditMeasuredVariableSchema,
  MeasuredVariableSchema,
} from "../../schema/measuredvariable.schema";

const defaultMeasuredVariableSelect =
  Prisma.validator<Prisma.MeasuredVariableSelect>()({
    id: true,
    variable: true,
    mvalias: true,
    instruments: true,
  });

export const measuredVariableRouter = router({
  list: publicProcedure.query(() => {
    return prisma.measuredVariable.findMany({
      select: defaultMeasuredVariableSelect,
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
      const measuredVariable = await prisma.measuredVariable.findUnique({
        where: { id },
        select: defaultMeasuredVariableSelect,
      });
      if (!measuredVariable) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No measuredVariable with id '${id}'`,
        });
      }
      return measuredVariable;
    }),
    byVariable: publicProcedure
    .input(
      z.object({
        variable: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { variable } = input;
      const measuredVariable = await prisma.measuredVariable.findUnique({
        where: { variable },
        select: defaultMeasuredVariableSelect,
      });
      if (!measuredVariable) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No measuredVariable with id '${variable}'`,
        });
      }
      return measuredVariable;
    }),
  add: publicProcedure
    .input(MeasuredVariableSchema)
    .mutation(async ({ input }) => {
      const measuredVariable = await prisma.measuredVariable.create({
        data: {
          variable: input.variable.toLowerCase(),
          mvalias: input.mvalias.toLowerCase(),
        },
        select: defaultMeasuredVariableSelect,
      });
      return measuredVariable;
    }),
  edit: publicProcedure
    .input(EditMeasuredVariableSchema)
    .mutation(async ({ input }) => {
      return await prisma.measuredVariable.update({
        where: {
          id: input.id,
        },
        data: {
          id: input.id,
          variable: input.variable.toLowerCase(),
          mvalias: input.mvalias.toLowerCase(),
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
      return await prisma.measuredVariable.delete({
        where: { id: input.id },
      });
    }),
});
