import { Router } from "express";
import {
  addFavorite,
  getAllFavorite,
  removeFavorite,
} from "./favorites.controller.js";

const favoriteRouter = Router();

favoriteRouter.post("/", addFavorite);

favoriteRouter.get("/:userId", getAllFavorite);

favoriteRouter.delete("/:userId/:recipeId", removeFavorite);

export default favoriteRouter;
