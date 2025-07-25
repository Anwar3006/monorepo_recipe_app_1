import { useQuery } from "@tanstack/react-query";
import { MealAPIRequest } from "../services/mealApi";

//Search meal by name
export const useSearchMealByName = (query, enabled = true) =>
  useQuery({
    queryKey: ["searchMealByName", query],
    queryFn: async () => await MealAPIRequest.searchMealByName(query),
    select: (data) => {
      if (Array.isArray(data)) {
        return data.map(MealAPIRequest.transformMealData);
      }
      return MealAPIRequest.transformMealData(data);
    },
    enabled: !!query && enabled,
  });

export const useGetMealById = (id) =>
  useQuery({
    queryKey: ["getMealById", id],
    queryFn: () => MealAPIRequest.getMealById(id),
    select: (data) => {
      const result = MealAPIRequest.transformMealData(data);
      const youtubeLink = getYoutubeEmbedLink(result.originalData.strYoutube);
      return {
        ...result,
        youtubeUrl: youtubeLink,
      };
    },
    enabled: !!id,
  });

export const useGetRandomMeal = () =>
  useQuery({
    queryKey: ["getRandomMeal"],
    queryFn: async () => await MealAPIRequest.getRandomMeal(),
    select: MealAPIRequest.transformMealData,
  });

export const useGetRandomMeals = (count) =>
  useQuery({
    queryKey: ["getRandomMeals", count],
    queryFn: () => MealAPIRequest.getRandomMeals(count),
    select: (data) => {
      if (Array.isArray(data)) {
        return data.map(MealAPIRequest.transformMealData);
      }
    },
  });

export const useGetCategories = () =>
  useQuery({
    queryKey: ["getCategories"],
    queryFn: () => MealAPIRequest.getCategories(),
    select: MealAPIRequest.transformCategoriesData,
  });

export const useFilterByIngredient = (ingredient, enabled = true) =>
  useQuery({
    queryKey: ["filterByIngredient", ingredient],
    queryFn: () => MealAPIRequest.filterByIngredient(ingredient),
    select: MealAPIRequest.transformMealData,
    enabled: !!ingredient && enabled,
  });

export const useFilterByCategory = (category) =>
  useQuery({
    queryKey: ["filterByCategory", category],
    queryFn: () => MealAPIRequest.filterByCategory(category),
  });

const getYoutubeEmbedLink = (url) => {
  const videoId = url.split("v=")[1];
  if (!videoId) throw new Error("No video id found");
  return `https://www.youtube.com/embed/${videoId}`;
};
