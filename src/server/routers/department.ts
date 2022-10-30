import { router, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prisma";
import { DepartmentSchema, EditDepartmentSchema } from "../../schema/department.schema";


const defaultDepartmentSelect =
  Prisma.validator<Prisma.DepartmentSelect>()({
    id: true,
    dept: true,
    deptAlias: true,
    description: true,
  });

export const departmentRouter = router({
  list: publicProcedure.query(() => {
    return prisma.department.findMany({
      select: defaultDepartmentSelect,
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
      const deptx = await prisma.department.findUnique({
        where: { id },
        select: defaultDepartmentSelect,
      });
      if (!deptx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No department with id '${id}'`,
        });
      }
      return deptx;
    }),
  add: publicProcedure
    .input(DepartmentSchema)
    .mutation(async ({ input }) => {
      const deptx = await prisma.department.create({
        data: {
          dept: input.dept.toLowerCase(),
          deptAlias: input.deptAlias.toLowerCase(),
          description: input.description.toLowerCase(),
        },
        select: defaultDepartmentSelect,
      });
      return deptx;
    }),
  edit: publicProcedure
    .input(EditDepartmentSchema)
    .mutation(async ({ input }) => {
      return await prisma.department.update({
        where: {
          id: input.id,
        },
        data: {
          id: input.id,
          dept: input.dept.toLowerCase(),
          deptAlias: input.deptAlias.toLowerCase(),
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
      return await prisma.department.delete({
        where: { id: input.id },
      });
    }),
});
