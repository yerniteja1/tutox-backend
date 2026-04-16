import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const userLogin = pgTable("user_login", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),
  mobileNo: varchar("mobile_no", { length: 15 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),

  role: varchar("role", { length: 20 }).default("student"),

  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const institution = pgTable("institution", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 150 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),

  address: text("address"),
  phone: varchar("phone", { length: 15 }),
  email: varchar("email", { length: 100 }),

  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userInstMap = pgTable("user_inst_map", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull(),

  institutionId: uuid("institution_id")
    .notNull(),

  role: varchar("role", { length: 20 }).notNull(),

  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
});