import e from "express";
import {
  addFavoriteService,
  getAllFavoritesService,
  removeFavoriteService,
} from "./favorites.service.js";

export const addFavorite = async (req, res, next) => {
  try {
    const { userId, recipeId, title, imageUrl, serving, cookingTime } =
      req.body;
    if (
      !userId ||
      !recipeId ||
      !title ||
      !imageUrl ||
      !serving ||
      !cookingTime
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }
    const data = {
      userId,
      recipeId,
      title,
      imageUrl,
      serving,
      cookingTime,
    };
    const result = await addFavoriteService(data);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (
      error.message ===
      "[AddFavoriteService] Error adding favorite: Favorite already exists"
    ) {
      return res.status(409).json({ success: false, error: error.message });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllFavorite = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      page = 1,
      limit = 6,
      sortBy = "created_at",
      sortOrder = "desc",
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit || 6),
      sortBy,
      sortOrder,
    };

    const result = await getAllFavoritesService(userId, options);
    if (result.data.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { userId, recipeId } = req.params;
    const result = await removeFavoriteService(userId, recipeId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
