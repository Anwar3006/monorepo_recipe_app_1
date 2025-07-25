CREATE TABLE "favorite" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(200) NOT NULL,
	"recipe_id" varchar(100) NOT NULL,
	"title" text NOT NULL,
	"image_url" text NOT NULL,
	"serving" integer NOT NULL,
	"cooking_time" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
