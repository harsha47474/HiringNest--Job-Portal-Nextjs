import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar, text, timestamp, mysqlEnum, date, year } from 'drizzle-orm/mysql-core'

export const users = mysqlTable("users", {
  id: int().autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  userName: varchar("username", { length: 255 }).unique().notNull(),
  role: mysqlEnum("role", ["admin", "applicant", "employee"]).default("applicant"),
  password: text("password").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phoneNumber: varchar("phone_number", { length: 255 }),
  deletedAt: timestamp("deleted_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  userAgent: text("user_agent").notNull(),
  ipAddress: varchar("ip_address", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
})

export const employers = mysqlTable("employers", {
  id: int("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  name: varchar("name", { length: 255 }),
  description: text("description"),
  bannerImageUrl: text("banner_image_url"),
  logoUrl: text("logo_url"),
  organizationType: varchar("organization_type", { length: 100 }),
  teamSize: varchar("team_size", { length: 50 }),
  yearOfEstablishment: year("year_of_establishment"), // MySQL YEAR type
  websiteUrl: varchar("website_url", { length: 255 }),
  location: varchar("location", { length: 255 }),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().onUpdateNow().notNull(),
});

export const applicants = mysqlTable("applicants", {
  id: int("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  biography: text("biography"),
  dateOfBirth: date("date_of_birth"),
  nationality: varchar("nationality", { length: 100 }),

  maritalStatus: mysqlEnum("marital_status", ["single", "married", "divorced"]),

  gender: mysqlEnum("gender", ["male", "female", "other"]),

  education: mysqlEnum("education", [
    "none",
    "high school",
    "undergraduate",
    "masters",
    "phd",
  ]),

  experience: text("experience"),
  websiteUrl: varchar("website_url", { length: 255 }),
  location: varchar("location", { length: 255 }),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});


export const usersRelations = relations(users, ({ one, many }) => ({
  // One user can have one employer profile (if role is employer)
  employer: one(employers, {
    fields: [users.id],
    references: [employers.id],
  }),
  // One user can have one applicant profile (if role is applicant)
  applicant: one(applicants, {
    fields: [users.id],
    references: [applicants.id],
  }),
  // One user can have many sessions
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  // Each session belongs to one user
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));