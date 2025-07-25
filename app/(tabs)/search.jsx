import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";

import useDebounce from "../../hooks/useDebounce";
import {
  useFilterByIngredient,
  useGetRandomMeals,
  useSearchMealByName,
} from "../../hooks/useMealAPI";
import { searchStyles } from "../../assets/styles/search.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import RecipeCard from "../../components/RecipeCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [initialPageLoad, setInitialPageLoad] = useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    data: randomRecipes,
    isLoading: randomRecipesIsLoading,
    isError: randomRecipesIsError,
  } = useGetRandomMeals(12);
  const {
    data: recipeByName,
    isLoading: recipeByNameIsLoading,
    isError: recipeByNameIsError,
  } = useSearchMealByName(debouncedSearchQuery, !!debouncedSearchQuery); // Only run query if there's a search term
  const {
    data: recipeByIngredient,
    isLoading: recipeByIngredientIsLoading,
    isError: recipeByIngredientIsError,
  } = useFilterByIngredient(
    debouncedSearchQuery,
    !!debouncedSearchQuery && (!recipeByName || recipeByName.length === 0) // Only run if no name results
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (initialPageLoad) {
      setInitialPageLoad(false);
    }
  };

  // Compute the display data
  const displayRecipes = useMemo(() => {
    // If no search query, show random recipes
    if (!debouncedSearchQuery) {
      return randomRecipes?.filter((recipe) => recipe !== null) || [];
    }

    // If we have results by name, use those first
    if (recipeByName && recipeByName.length > 0) {
      return recipeByName.slice(0, 12);
    }

    // Otherwise, fall back to ingredient search
    if (recipeByIngredient && recipeByIngredient.length > 0) {
      return recipeByIngredient.slice(0, 12);
    }

    // No results found
    return [];
  }, [debouncedSearchQuery, randomRecipes, recipeByName, recipeByIngredient]);

  const isLoading = useMemo(() => {
    if (!debouncedSearchQuery) {
      return randomRecipesIsLoading;
    }

    return (
      recipeByNameIsLoading ||
      (recipeByName?.length === 0 && recipeByIngredientIsLoading)
    );
  }, [
    debouncedSearchQuery,
    randomRecipesIsLoading,
    recipeByNameIsLoading,
    recipeByIngredientIsLoading,
    recipeByName,
  ]);
  const hasError =
    randomRecipesIsError ||
    (debouncedSearchQuery && recipeByNameIsError && recipeByIngredientIsError);

  useEffect(() => {
    if (randomRecipes && initialPageLoad) {
      setInitialPageLoad(false);
    }
  }, [randomRecipes, initialPageLoad]);

  if (hasError) {
    return (
      <View className="flex items-center justify-center">
        <Text className="text-lg my-2" style={{ color: COLORS.text }}>
          💔Oops! There seems to be an error
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading recipes..." />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={searchStyles.container}>
        <View style={searchStyles.searchSection}>
          <View style={searchStyles.searchContainer}>
            <Ionicons
              name="search"
              size={24}
              color={COLORS.textLight}
              style={searchStyles.searchIcon}
            />
            <TextInput
              placeholder="Search recipes by name or ingredient..."
              placeholderTextColor={COLORS.textLight}
              style={searchStyles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={searchStyles.clearButton}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Results */}
        <View style={searchStyles.resultsSection}>
          <View style={searchStyles.resultsHeader}>
            <Text style={searchStyles.resultsTitle}>
              {debouncedSearchQuery
                ? `Search results for "${debouncedSearchQuery}"`
                : "Popular recipes"}
            </Text>
            <Text style={searchStyles.resultsCount}>
              {displayRecipes.length} results
            </Text>
          </View>

          <FlatList
            data={displayRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={searchStyles.row}
            contentContainerStyle={searchStyles.recipesGrid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NoResultsFound />}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchScreen;

const NoResultsFound = () => {
  return (
    <View style={searchStyles.emptyState}>
      <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
      <Text style={searchStyles.emptyTitle}>No recipes found</Text>
      <Text style={searchStyles.emptyDescription}>
        Try adjusting your search or try different keywords
      </Text>
    </View>
  );
};
