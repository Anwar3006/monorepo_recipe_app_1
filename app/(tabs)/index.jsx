import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";

import { homeStyles } from "../../assets/styles/home.styles";
import {
  useGetCategories,
  useFilterByCategory,
  useGetRandomMeal,
  useGetRandomMeals,
} from "../../hooks/useMealAPI";
import FeaturedRecipeCard from "../../components/FeaturedRecipeCard";
import CategoryFilter from "../../components/CategoryFilter";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import RecipeCard from "../../components/RecipeCard";

const HomeScreen = () => {
  const {
    data: featuredRecipe,
    isLoading: featuredRecipeIsLoading,
    isError: featuredRecipeIsError,
    refetch: featuredRecipeRefetch,
  } = useGetRandomMeal();
  const {
    data: randomRecipes,
    randomRecipesIsLoading,
    randomRecipesIsError,
    refetch: randomRecipesRefetch,
  } = useGetRandomMeals(12);
  const {
    data: categories,
    categoriesIsLoading,
    categoriesIsError,
  } = useGetCategories();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const allLoading =
      featuredRecipeIsLoading || randomRecipesIsLoading || categoriesIsLoading;
    setIsLoading(allLoading);

    const anyError =
      featuredRecipeIsError || randomRecipesIsError || categoriesIsError;
    setHasError(anyError);

    if (anyError) {
      let message = "Something went wrong. Please try again.";
      if (featuredRecipeIsError) message = "Error fetching featured recipe.";
      else if (randomRecipesIsError) message = "Error fetching random recipes.";
      else if (categoriesIsError) message = "Error fetching categories.";
      setErrorMessage(message);
    } else {
      setErrorMessage("");
    }
  }, [
    featuredRecipeIsLoading,
    randomRecipesIsLoading,
    categoriesIsLoading,
    featuredRecipeIsError,
    randomRecipesIsError,
    categoriesIsError,
  ]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([featuredRecipeRefetch(), randomRecipesRefetch()]);
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <View
        style={homeStyles.container}
        className="flex items-center justify-center"
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.textLight }}>
          Loading delicious recipes...
        </Text>
      </View>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <View
        style={homeStyles.container}
        className="flex items-center justify-center"
      >
        <Text className="text-lg my-2" style={{ color: COLORS.text }}>
          💔Oops!
        </Text>
        <Text style={{ color: COLORS.textLight }}>{errorMessage}</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          className={`px-4 py-3 rounded-lg `}
          style={{
            backgroundColor: COLORS.primary,
            marginTop: 20,
          }}
        >
          <Text style={{ color: COLORS.white }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/* Animal Icons */}
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require("../../assets/images/lamb.png")}
            style={{
              width: 100,
              height: 100,
            }}
            contentFit="contain"
          />
          <Image
            source={require("../../assets/images/chicken.png")}
            style={{
              width: 100,
              height: 100,
            }}
            contentFit="contain"
          />
          <Image
            source={require("../../assets/images/pork.png")}
            style={{
              width: 100,
              height: 100,
            }}
            contentFit="contain"
          />
        </View>

        {/* Featured Recipe */}
        {featuredRecipe && (
          <FeaturedRecipeCard featuredRecipe={featuredRecipe} />
        )}

        {/* Categories */}
        {categories && categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}

        {/* Random Recipes or Recipes from selected category */}
        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
          </View>

          <FlatList
            data={randomRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={homeStyles.row}
            contentContainerStyle={homeStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={homeStyles.emptyState}>
                <Ionicons
                  name="restaurant-outline"
                  size={64}
                  color={COLORS.textLight}
                />
                <Text style={homeStyles.emptyTitle}>No Recipes Found</Text>
                <Text style={homeStyles.emptyDescription}>
                  Try a different category
                </Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
