import { and, asc, desc, eq } from "drizzle-orm";

import dbClient from "../../db/dbClient.js";
import { favoriteTable } from "./favorites.schema.js";
import logger from "../../config/logger.js";

export const addFavoriteRepository = async (data) => {
  try {
    const inserted = await dbClient
      .insert(favoriteTable)
      .values(data)
      .returning();
    return inserted[0] || null;
  } catch (error) {
    logger.error(
      `[AddFavoriteRepository] Error adding favorite:  ${error.message}`
    );
    throw new Error(
      `[AddFavoriteRepository] Error adding favorite: ${error.message}`
    );
  }
};

export const allFavoritesRepository = async (
  userId,
  { page = 1, limit = 6, sortBy = "created_at", sortOrder = "desc" }
) => {
  try {
    const sortingOrder = sortOrder === "desc" ? desc : asc;
    const offset = (page - 1) * limit;

    const [paginated, totalCount] = await Promise.all([
      dbClient
        .select()
        .from(favoriteTable)
        .where(eq(favoriteTable.userId, userId))
        .limit(limit)
        .offset(offset)
        .orderBy(sortingOrder(`${favoriteTable}.${sortBy}`)),

      dbClient.$count(favoriteTable, eq(favoriteTable.userId, userId)),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: paginated,
      meta: {
        currentPage: page,
        limit,
        totalItems: totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
  } catch (error) {
    logger.error(
      `[AllFavoritesRepository] Error fetching favorites: ${error.message}`
    );
    throw new Error(
      `[AllFavoritesRepository] Error fetching favorites: ${error.message}`
    );
  }
};

export const favoriteRepository = async (userId, recipeId) => {
  try {
    const inserted = await dbClient
      .select()
      .from(favoriteTable)
      .where(
        and(
          eq(favoriteTable.userId, userId),
          eq(favoriteTable.recipeId, recipeId)
        )
      );
    return inserted[0] || null;
  } catch (error) {
    logger.error(
      `[FavoriteRepository] Error fetching favorite: ${error.message}`
    );
    throw new Error(
      `[FavoriteRepository] Error fetching favorite: ${error.message}`
    );
  }
};

export const removeFavoriteRepository = async (userId, recipeId) => {
  try {
    const inserted = await dbClient
      .delete(favoriteTable)
      .where(
        and(
          eq(favoriteTable.userId, userId),
          eq(favoriteTable.recipeId, recipeId)
        )
      )
      .returning();
    return inserted[0] || null;
  } catch (error) {
    logger.error(
      `[RemoveFavoriteRepository] Error removing favorite: ${error.message}`
    );
    throw new Error(
      `[RemoveFavoriteRepository] Error removing favorite: 
      ${error.message}`
    );
  }
};
