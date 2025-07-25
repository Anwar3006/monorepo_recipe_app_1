import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const favoriteTable = pgTable("favorite", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  recipeId: varchar("recipe_id", { length: 100 }).notNull(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  serving: integer("serving").notNull(),
  cookingTime: integer("cooking_time").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});
