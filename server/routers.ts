import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { storageRouter } from "./storage-router";
import {
  getCarrossel,
  createCarrossel,
  updateCarrossel,
  deleteCarrossel,
  getInvestimentos,
  createInvestimento,
  updateInvestimento,
  deleteInvestimento,
  getConfig,
  updateConfig,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  storage: storageRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Routers para Carrossel
  carrossel: router({
    list: publicProcedure.query(async () => {
      return getCarrossel();
    }),
    create: protectedProcedure
      .input(z.object({
        titulo: z.string(),
        descricao: z.string().optional(),
        imagemUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return createCarrossel(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        titulo: z.string().optional(),
        descricao: z.string().optional(),
        imagemUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const { id, ...data } = input;
        return updateCarrossel(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return deleteCarrossel(input.id);
      }),
  }),

  // Routers para Investimentos
  investimentos: router({
    list: publicProcedure.query(async () => {
      return getInvestimentos();
    }),
    create: protectedProcedure
      .input(z.object({
        tipo: z.enum(['lancamentos', 'na_planta', 'aluguel']),
        titulo: z.string(),
        descricao: z.string().optional(),
        imagemUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return createInvestimento(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        tipo: z.enum(['lancamentos', 'na_planta', 'aluguel']).optional(),
        titulo: z.string().optional(),
        descricao: z.string().optional(),
        imagemUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const { id, ...data } = input;
        return updateInvestimento(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return deleteInvestimento(input.id);
      }),
  }),

  // Routers para Config
  config: router({
    get: publicProcedure.query(async () => {
      return getConfig();
    }),
    update: protectedProcedure
      .input(z.object({
        quemSomos: z.string().optional(),
        corPrimaria: z.string().optional(),
        tamanho: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return updateConfig(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
