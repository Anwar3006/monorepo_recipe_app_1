import axios from "axios";
import { API_URL } from "../constants/api";

export const MyAPI = {
  addFavorite: async (data) => {
    try {
      const result = await axios.post(`${API_URL}/favorites`, data);
      return result.data;
    } catch (error) {
      console.error("Error adding favorites: ", error.message);
    }
  },

  getMyFavorites: async (userId) => {
    try {
      const result = await axios.get(`${API_URL}/favorites/${userId}`);
      return result.data;
    } catch (error) {
      console.error("Error getting favorites: ", error.message);
    }
  },

  removeFavorite: async (userId, recipeId) => {
    try {
      const result = await axios.delete(
        `${API_URL}/favorites/${userId}/${recipeId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error removing favorite: ", error.message);
    }
  },
};
