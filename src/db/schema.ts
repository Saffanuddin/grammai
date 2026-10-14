import { pgTable, text, integer, boolean, timestamp, serial, jsonb } from "drizzle-orm/pg-core";

export const citizens = pgTable("citizens", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").default(""),
  role: text("role").default("citizen"), // citizen | admin
  state: text("state").default("Telangana"),
  district: text("district").default("Warangal"),
  village: text("village").default("Rampur"),
  occupation: text("occupation").default("Farmer"),
  age: integer("age").default(42),
  gender: text("gender").default("Male"),
  income: integer("income").default(85000),
  category: text("category").default("OBC"),
  landAcres: text("land_acres").default("2.5"),
  isDemo: boolean("is_demo").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const schemesTable = pgTable("schemes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  level: text("level").default("Central"),
  state: text("state").default("All India"),
  benefit: text("benefit").default(""),
  benefitAmount: integer("benefit_amount").default(0),
  description: text("description").default(""),
  verified: boolean("verified").default(true),
  deadline: text("deadline").default(""),
  sourceUrl: text("source_url").default(""),
  data: jsonb("data").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const savedSchemes = pgTable("saved_schemes", {
  id: serial("id").primaryKey(),
  citizenId: text("citizen_id").notNull(),
  schemeId: text("scheme_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const checklists = pgTable("checklists", {
  id: serial("id").primaryKey(),
  citizenId: text("citizen_id").notNull(),
  schemeId: text("scheme_id").notNull(),
  docName: text("doc_name").notNull(),
  hasDoc: boolean("has_doc").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  ref: text("ref").notNull().unique(),
  citizenId: text("citizen_id").default("demo-citizen"),
  citizenName: text("citizen_name").notNull(),
  phone: text("phone").default(""),
  category: text("category").notNull(),
  description: text("description").notNull(),
  village: text("village").notNull(),
  status: text("status").default("Submitted"), // Submitted | Under Review | In Progress | Resolved
  response: text("response").default(""),
  isDemo: boolean("is_demo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  citizenId: text("citizen_id").default("demo-citizen"),
  fileName: text("file_name").notNull(),
  schemeName: text("scheme_name").default(""),
  summary: text("summary").default(""),
  extracted: jsonb("extracted").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const journey = pgTable("journey", {
  id: serial("id").primaryKey(),
  citizenId: text("citizen_id").notNull(),
  schemeId: text("scheme_id").notNull(),
  stage: text("stage").default("Discovered"), // Discovered | Eligibility Checked | Documents Pending | Ready
  eligibility: text("eligibility").default(""), // eligible | partial | not
  score: integer("score").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  phone: text("phone").default(""),
  role: text("role").default("citizen").notNull(),
  image: text("image"),
  provider: text("provider").default("credentials").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: integer("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
