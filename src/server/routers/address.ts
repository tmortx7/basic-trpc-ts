import { router, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prisma";
import { AddressSchema, EditAddressSchema } from "../../schema/address.schema";

const defaultAddressSelect = Prisma.validator<Prisma.AddressSelect>()({
  id: true,
  plusCode: true,
  add1: true,
  add2: true,
  city: true,
  province: true,
  postalCode: true,
  country: true,
  note: true,
  siteId: true,
});

export const addressRouter = router({
  list: publicProcedure.query(() => {
    return prisma.address.findMany({
      select: defaultAddressSelect,
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
      const addx = await prisma.address.findUnique({
        where: { id },
        select: defaultAddressSelect,
      });
      if (!addx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No address with id '${id}'`,
        });
      }
      return addx;
    }),
  add: publicProcedure.input(AddressSchema).mutation(async ({ input }) => {
    const addx = await prisma.address.create({
      data: {
        plusCode: input.plusCode,
        add1: input.add1,
        add2: input.add2,
        city: input.city,
        province: input.province,
        postalCode: input.postalCode,
        country: input.country,
        note: input.note,
        siteId: input.siteId,
      },
      select: defaultAddressSelect,
    });
    return addx;
  }),
  edit: publicProcedure.input(EditAddressSchema).mutation(async ({ input }) => {
    return await prisma.address.update({
      where: {
        id: input.id,
      },
      data: {
        id: input.id,
        plusCode: input.plusCode,
        add1: input.add1,
        add2: input.add2,
        city: input.city,
        province: input.province,
        postalCode: input.postalCode,
        country: input.country,
        note: input.note,
        siteId: input.siteId,
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
      return await prisma.address.delete({
        where: { id: input.id },
      });
    }),
});
