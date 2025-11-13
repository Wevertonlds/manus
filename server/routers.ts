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
  getSettings,
  updateSettings,
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
        endereco: z.string().optional().nullable(),
        areaMt2: z.number().optional().nullable(),
        banheiros: z.number().optional().nullable(),
        quartos: z.number().optional().nullable(),
        suites: z.number().optional().nullable(),
        garagem: z.number().optional().nullable(),
        piscina: z.number().optional().default(0),
        academia: z.number().optional().default(0),
        churrasqueira: z.number().optional().default(0),
        condominio: z.number().optional().nullable(),
        iptu: z.number().optional().nullable(),
        preco: z.number().optional().nullable(),
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
        endereco: z.string().optional().nullable(),
        areaMt2: z.number().optional().nullable(),
        banheiros: z.number().optional().nullable(),
        quartos: z.number().optional().nullable(),
        suites: z.number().optional().nullable(),
        garagem: z.number().optional().nullable(),
        piscina: z.number().optional(),
        academia: z.number().optional(),
        churrasqueira: z.number().optional(),
        condominio: z.number().optional().nullable(),
        iptu: z.number().optional().nullable(),
        preco: z.number().optional().nullable(),
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

  // Routers para Configurações
  config: router({
    get: publicProcedure.query(async () => {
      return getConfig();
    }),
    update: protectedProcedure
      .input(z.object({
        quemSomos: z.string().optional(),
        corPrimaria: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return updateConfig(input);
      }),
  }),

  // Routers para Settings (Redes Sociais)
  settings: router({
    get: publicProcedure.query(async () => {
      return getSettings();
    }),
    update: protectedProcedure
      .input(z.object({
        whatsapp: z.string().optional(),
        facebook: z.string().optional(),
        instagram: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return updateSettings(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
