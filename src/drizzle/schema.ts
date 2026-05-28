import { int, mysqlTable, varchar, text, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core'

export const users = mysqlTable("users", {
    id: int().autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    userName: varchar("username", {length:255}).unique().notNull(),
    role: mysqlEnum("role", ["admin", "applicant", "employee"]).default("applicant"),
    password: text("password").notNull(),
    email: varchar("email", {length: 255}).notNull().unique(),
    phoneNumber: varchar("phone_number", {length: 255}),
    deletedAt: timestamp("deleted_at"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const sessions = mysqlTable("sessions", {
    id: varchar("id", {length: 255}).primaryKey(),
    userId: int("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
    userAgent: text("user_agent").notNull(),
    ipAddress: varchar("ip_address", {length: 255}).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
})