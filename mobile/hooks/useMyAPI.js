import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { MyAPI } from "../services/myApi";

const queryClient = new QueryClient();

export const useAddFavorite = () =>
  useMutation({
    mutationFn: (favoriteData) => MyAPI.addFavorite(favoriteData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["getMyFavorites", variables.userId]);
    },
  });

export const useGetMyFavorites = (userId) =>
  useQuery({
    queryKey: ["getMyFavorites", userId],
    queryFn: () => MyAPI.getMyFavorites(userId),
    select: ({ data, meta }) => ({
      data: Array.isArray(data)
        ? data.map(transformFavorite)
        : [transformFavorite(data)],
      meta,
    }),
    enabled: !!userId, // Only run query if userId exists
  });

export const useRemoveFavorite = () =>
  useMutation({
    mutationFn: ({ userId, recipeId }) =>
      MyAPI.removeFavorite(userId, recipeId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["getMyFavorites", variables.userId]);
    },
  });

const transformFavorite = (favorite) => ({
  ...favorite,
  id: favorite.recipeId,
  image: favorite.imageUrl,
});
