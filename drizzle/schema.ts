import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela para slides do carrossel dinâmico
export const carrossel = mysqlTable("carrossel", {
  id: int("id").autoincrement().primaryKey(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  imagemUrl: text("imagemUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Carrossel = typeof carrossel.$inferSelect;
export type InsertCarrossel = typeof carrossel.$inferInsert;

// Tabela para cards de investimentos
export const investimentos = mysqlTable("investimentos", {
  id: int("id").autoincrement().primaryKey(),
  tipo: mysqlEnum("tipo", ["lancamentos", "na_planta", "aluguel"]).notNull(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  imagemUrl: text("imagemUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Investimento = typeof investimentos.$inferSelect;
export type InsertInvestimento = typeof investimentos.$inferInsert;

// Tabela para configurações do site
export const config = mysqlTable("config", {
  id: int("id").autoincrement().primaryKey(),
  quemSomos: text("quemSomos"),
  corPrimaria: varchar("corPrimaria", { length: 7 }).default("#1E40AF"),
  tamanho: int("tamanho").default(16),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Config = typeof config.$inferSelect;
export type InsertConfig = typeof config.$inferInsert;