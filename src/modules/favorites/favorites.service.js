import {
  addFavoriteRepository,
  allFavoritesRepository,
  favoriteRepository,
  removeFavoriteRepository,
} from "./favorite.repository.js";

export const addFavoriteService = async (data) => {
  try {
    const { userId, recipeId } = data;
    const favoriteExists = await favoriteRepository(userId, recipeId);
    if (favoriteExists) {
      throw new Error("Favorite already exists");
    }

    const favoriteRecipe = await addFavoriteRepository(data);
    return favoriteRecipe;
  } catch (error) {
    throw new Error(
      `[AddFavoriteService] Error adding favorite: ${error.message}`
    );
  }
};

export const getAllFavoritesService = async (userId, options) => {
  try {
    const allFavoritesRecipe = await allFavoritesRepository(userId, options);
    return allFavoritesRecipe;
  } catch (error) {
    throw new Error(
      `[GetAllFavoritesService] Error fetching favorites: ${error.message}`
    );
  }
};

export const removeFavoriteService = async (userId, recipeId) => {
  try {
    const unfavoritedRecipe = await removeFavoriteRepository(userId, recipeId);
    return unfavoritedRecipe;
  } catch (error) {
    throw new Error(
      `[RemoveFavoriteService] Error removing favorite: ${error.message}`
    );
  }
};
