import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  doublePrecision,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const workers = pgTable(
  "workers",
  {
    id: serial("id").primaryKey(),
    registrationId: text("registration_id").notNull().unique(),
    name: text("name").notNull(),
    phone: text("phone").notNull().unique(),
    aadhaar: text("aadhaar").notNull(),
    skill: text("skill").notNull(),
    experience: text("experience").notNull(),
    dailyRate: integer("daily_rate").notNull(),
    city: text("city").notNull(),
    area: text("area").notNull(),
    landmark: text("landmark"),
    languages: text("languages"),
    username: text("username").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    available: boolean("available").notNull().default(true),
    status: text("status").notNull().default("pending"), // pending | approved | rejected
    jobsCompleted: integer("jobs_completed").notNull().default(0),
    ratingAvg: doublePrecision("rating_avg").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),
    lat: doublePrecision("lat").notNull().default(28.6139),
    lng: doublePrecision("lng").notNull().default(77.209),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("workers_status_idx").on(t.status),
    index("workers_skill_idx").on(t.skill),
    index("workers_city_idx").on(t.city),
  ],
);

export const ratings = pgTable(
  "ratings",
  {
    id: serial("id").primaryKey(),
    workerId: integer("worker_id")
      .notNull()
      .references(() => workers.id, { onDelete: "cascade" }),
    employerName: text("employer_name").notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("ratings_worker_idx").on(t.workerId)],
);

export const hireRequests = pgTable(
  "hire_requests",
  {
    id: serial("id").primaryKey(),
    workerId: integer("worker_id")
      .notNull()
      .references(() => workers.id, { onDelete: "cascade" }),
    employerName: text("employer_name").notNull(),
    employerPhone: text("employer_phone").notNull(),
    message: text("message"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("hire_requests_worker_idx").on(t.workerId)],
);

export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  role: text("role").notNull(), // worker | admin
  workerId: integer("worker_id").references(() => workers.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  skill: text("skill"),
  city: text("city"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Worker = typeof workers.$inferSelect;
export type Rating = typeof ratings.$inferSelect;
export type HireRequest = typeof hireRequests.$inferSelect;
export type CommunityPost = typeof communityPosts.$inferSelect;
