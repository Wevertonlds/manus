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

// Tabela para cards de investimentos com detalhes completos
export const investimentos = mysqlTable("investimentos", {
  id: int("id").autoincrement().primaryKey(),
  tipo: mysqlEnum("tipo", ["lancamentos", "na_planta", "aluguel"]).notNull(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  imagemUrl: text("imagemUrl"),
  endereco: text("endereco"),
  areaMt2: int("area_m2"),
  banheiros: int("banheiros"),
  quartos: int("quartos"),
  suites: int("suites"),
  garagem: int("garagem"),
  piscina: int("piscina").default(0),
  academia: int("academia").default(0),
  churrasqueira: int("churrasqueira").default(0),
  condominio: int("condominio"),
  iptu: int("iptu"),
  preco: int("preco"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Investimento = typeof investimentos.$inferSelect;
export type InsertInvestimento = typeof investimentos.$inferInsert;

// Tabela para configurações do site
export const config = mysqlTable("config", {
  id: int("id").autoincrement().primaryKey(),
  quemSomos: text("quemSomos"),
  corPrimaria: varchar("corPrimaria", { length: 7 }),
  tamanho: int("tamanho").default(16),
  logo: text("logo"),
  banner: text("banner"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Config = typeof config.$inferSelect;
export type InsertConfig = typeof config.$inferInsert;

// Properties table for real estate listings
export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  price: int("price"),
  areaMt2: int("area_m2"),
  bedrooms: int("bedrooms"),
  bathrooms: int("bathrooms"),
  suites: int("suites"),
  garage: int("garage"),
  pool: int("pool").default(0),
  gym: int("gym").default(0),
  bbq: int("bbq").default(0),
  condominium: int("condominium"),
  iptu: int("iptu"),
  yearBuilt: int("year_built"),
  type: varchar("type", { length: 64 }),
  mainImage: text("main_image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

// Settings table for social media links
export const settings = mysqlTable("settings", {
  id: int("id").autoincrement().primaryKey(),
  whatsapp: varchar("whatsapp", { length: 255 }),
  facebook: varchar("facebook", { length: 255 }),
  instagram: varchar("instagram", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = typeof settings.$inferInsert;
