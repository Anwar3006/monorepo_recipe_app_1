import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { NODE_ENV, PORT, VERSION } from "./config/env.js";
import logger from "./config/logger.js";
import { testDBConnection } from "./db/testDbConnection.js";
import favoriteRouter from "./modules/favorites/favorites.route.js";
import job from "./config/cron.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Cron job to be run only in production
if (NODE_ENV === "production") {
  job.start();
}

//Route
app.use(`/api/${VERSION}/favorites`, favoriteRouter);

// Healthcheck endpoint to be used by cron job when running in production
app.get(`/api/${VERSION}/health`, (req, res) => {
  res.status(200).json({ message: "Healthy" });
});

app.listen(PORT, async () => {
  const result = await testDBConnection();
  if (!result) {
    logger.error("Database connection failed");
    process.exit(1);
  } else {
    logger.info("Database connection successful");
  }

  logger.info(`Server running in ${NODE_ENV} on port ${PORT}`);
});
