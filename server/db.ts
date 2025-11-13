import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, Carrossel, InsertCarrossel, Investimento, InsertInvestimento, InsertConfig, carrossel, investimentos, config, properties, InsertProperty, Property, settings, InsertSetting, Setting } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Queries para Carrossel
export async function getCarrossel() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get carrossel: database not available");
    return [];
  }

  try {
    return await db.select().from(carrossel).orderBy(carrossel.createdAt);
  } catch (error) {
    console.error("[Database] Failed to get carrossel:", error);
    return [];
  }
}

export async function createCarrossel(data: InsertCarrossel) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(carrossel).values(data);
}

export async function updateCarrossel(id: number, data: Partial<InsertCarrossel>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(carrossel).set(data).where(eq(carrossel.id, id));
}

export async function deleteCarrossel(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(carrossel).where(eq(carrossel.id, id));
}

// Queries para Investimentos
export async function getInvestimentos() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get investimentos: database not available");
    return [];
  }

  try {
    return await db.select().from(investimentos).orderBy(investimentos.createdAt);
  } catch (error) {
    console.error("[Database] Failed to get investimentos:", error);
    return [];
  }
}

export async function createInvestimento(data: InsertInvestimento) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(investimentos).values(data);
}

export async function updateInvestimento(id: number, data: Partial<InsertInvestimento>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(investimentos).set(data).where(eq(investimentos.id, id));
}

export async function deleteInvestimento(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(investimentos).where(eq(investimentos.id, id));
}

// Queries para Config
export async function getConfig() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get config: database not available");
    return null;
  }

  try {
    const result = await db.select().from(config).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get config:", error);
    return null;
  }
}

export async function updateConfig(data: Partial<InsertConfig>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getConfig();
  if (existing) {
    return await db.update(config).set(data).where(eq(config.id, existing.id));
  } else {
    return await db.insert(config).values(data as InsertConfig);
  }
}



// Properties queries
export async function getProperties() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(properties);
}

export async function getPropertyById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createProperty(data: InsertProperty) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(properties).values(data);
}

export async function updateProperty(id: number, data: Partial<InsertProperty>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(properties).set(data).where(eq(properties.id, id));
}

export async function deleteProperty(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(properties).where(eq(properties.id, id));
}

// Settings queries
export async function getSettings() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(settings).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateSettings(data: Partial<InsertSetting>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getSettings();
  if (existing) {
    await db.update(settings).set(data).where(eq(settings.id, existing.id));
  } else {
    await db.insert(settings).values(data as InsertSetting);
  }
}
