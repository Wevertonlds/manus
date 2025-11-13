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

  // Routers para Properties (Imóveis)
  properties: router({
    list: publicProcedure.query(async () => {
      const { getProperties } = await import("./db");
      return getProperties();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getPropertyById } = await import("./db");
        return getPropertyById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        location: z.string().optional(),
        price: z.number().optional(),
        areaMt2: z.number().optional(),
        bedrooms: z.number().optional(),
        bathrooms: z.number().optional(),
        suites: z.number().optional(),
        garage: z.number().optional(),
        pool: z.number().optional(),
        gym: z.number().optional(),
        bbq: z.number().optional(),
        condominium: z.number().optional(),
        iptu: z.number().optional(),
        yearBuilt: z.number().optional(),
        type: z.string().optional(),
        mainImage: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const { createProperty } = await import("./db");
        return createProperty(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        price: z.number().optional(),
        areaMt2: z.number().optional(),
        bedrooms: z.number().optional(),
        bathrooms: z.number().optional(),
        suites: z.number().optional(),
        garage: z.number().optional(),
        pool: z.number().optional(),
        gym: z.number().optional(),
        bbq: z.number().optional(),
        condominium: z.number().optional(),
        iptu: z.number().optional(),
        yearBuilt: z.number().optional(),
        type: z.string().optional(),
        mainImage: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const { id, ...data } = input;
        const { updateProperty } = await import("./db");
        return updateProperty(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const { deleteProperty } = await import("./db");
        return deleteProperty(input.id);
      }),
  }),

  // Routers para Settings (Redes Sociais)
  settings: router({
    get: publicProcedure.query(async () => {
      const { getSettings } = await import("./db");
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
        const { updateSettings } = await import("./db");
        return updateSettings(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
