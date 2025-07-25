import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useClerk } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles";
import { useGetMealById } from "../../hooks/useMealAPI";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAddFavorite, useRemoveFavorite } from "../../hooks/useMyAPI";
import { COLORS } from "../../constants/colors";

const RecipeDetailScreen = () => {
  const { id: recipeId } = useLocalSearchParams();
  const [hasFavorited, setHasFavorited] = useState(false);
  const router = useRouter();

  const { user } = useClerk();
  const {
    data: recipe,
    isLoading: recipeLoading,
    isError: recipeError,
  } = useGetMealById(recipeId);
  const {
    mutate: addFavorite,
    isPending: addFavoritePending,
    isError: addFavoriteError,
  } = useAddFavorite();
  const { mutate: removeFavorite, isError: removeFavoriteError } =
    useRemoveFavorite(user.id, recipeId);

  const favoriteData = recipe &&
    user && {
      userId: user.id,
      recipeId: recipeId,
      title: recipe.title,
      imageUrl: recipe.image,
      serving: recipe.servings,
      cookingTime: recipe.cookTime,
    };

  useEffect(() => {
    if (recipeError || addFavoriteError || removeFavoriteError) {
      Alert.alert("Error", "Something went wrong. Please reload");
    }
  }, [recipeError, addFavoriteError, removeFavoriteError]);

  if (!recipe || recipeLoading)
    return <LoadingSpinner message="Loading recipe..." />;

  const handleToggleFavorite = () => {
    if (hasFavorited && user.id && recipeId) {
      // Remove from favorites
      setHasFavorited(false);
      removeFavorite({ userId: user.id, recipeId: recipeId });
    } else {
      if (favoriteData) {
        // Add to favorites
        setHasFavorited(true);
        addFavorite(favoriteData);
      }
    }
  };

  return (
    <View style={recipeDetailStyles.container}>
      <ScrollView>
        {/* Header */}
        <View style={recipeDetailStyles.headerContainer}>
          <View style={recipeDetailStyles.imageContainer}>
            <Image
              source={{ uri: recipe.image }}
              style={recipeDetailStyles.headerImage}
              contentFit="cover"
            />
          </View>

          <LinearGradient
            // Background Linear Gradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            style={recipeDetailStyles.gradientOverlay}
          />

          <View style={recipeDetailStyles.floatingButtons}>
            <TouchableOpacity
              style={recipeDetailStyles.floatingButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                recipeDetailStyles.floatingButton,
                {
                  backgroundColor: addFavoritePending
                    ? COLORS.background
                    : hasFavorited
                      ? COLORS.primary
                      : "rgba(0, 0, 0, 0.5)",
                },
              ]}
              onPress={handleToggleFavorite}
              disabled={addFavoritePending}
            >
              <Ionicons
                name={
                  addFavoritePending
                    ? "hourglass"
                    : hasFavorited
                      ? "bookmark"
                      : "bookmark-outline"
                }
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>
                {recipe.category}
              </Text>
            </View>
            <Text style={recipeDetailStyles.recipeTitle}>{recipe.title}</Text>
            {recipe.area && (
              <View style={recipeDetailStyles.locationRow}>
                <Ionicons name="location" size={16} color={COLORS.white} />
                <Text style={recipeDetailStyles.locationText}>
                  {recipe.area} Cuisine
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={recipeDetailStyles.contentSection}>
          {/* Quick Stats */}
          <View style={recipeDetailStyles.statsContainer}>
            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="time" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>
                {recipe.cookTime}
              </Text>
              <Text style={recipeDetailStyles.statLabel}>Prep Time</Text>
            </View>

            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#4ECDC4", "#44A08D"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="people" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>
                {recipe.servings}
              </Text>
              <Text style={recipeDetailStyles.statLabel}>Servings</Text>
            </View>
          </View>

          {/* Youtube Video */}
          {recipe.youtubeUrl && (
            <View style={recipeDetailStyles.sectionContainer}>
              <View style={recipeDetailStyles.sectionTitleRow}>
                <LinearGradient
                  colors={["#FF0000", "#CC0000"]}
                  style={recipeDetailStyles.sectionIcon}
                >
                  <Ionicons name="play" size={16} color={COLORS.white} />
                </LinearGradient>

                <Text style={recipeDetailStyles.sectionTitle}>
                  Video Tutorial
                </Text>
              </View>

              <View style={recipeDetailStyles.videoCard}>
                <WebView
                  style={recipeDetailStyles.webview}
                  source={{ uri: recipe.youtubeUrl }}
                  allowsFullscreenVideo
                  mediaPlaybackRequiresUserAction={false}
                />
              </View>
            </View>
          )}

          {/* Ingrdients */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                style={recipeDetailStyles.sectionIcon}
                colors={[COLORS.primary, COLORS.primary + "80"]}
              >
                <Ionicons name="list" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {recipe.ingredients.length}
                </Text>
              </View>
            </View>

            <View style={recipeDetailStyles.ingredientsGrid}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={recipeDetailStyles.ingredientCard}>
                  <View key={index} style={recipeDetailStyles.ingredientNumber}>
                    <Text style={recipeDetailStyles.ingredientNumberText}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text style={recipeDetailStyles.ingredientText}>
                    {ingredient}
                  </Text>
                  <View style={recipeDetailStyles.ingredientCheck}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color={COLORS.text}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Instructions */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                style={recipeDetailStyles.sectionIcon}
                colors={["#9C27B0", "#673AB7"]}
              >
                <Ionicons name="book" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Instructions</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {recipe.instructions.length}
                </Text>
              </View>
            </View>

            <View style={recipeDetailStyles.instructionsContainer}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={recipeDetailStyles.instructionCard}>
                  <LinearGradient
                    style={recipeDetailStyles.stepIndicator}
                    colors={[COLORS.primary, COLORS.primary + "CC"]}
                  >
                    <Text style={recipeDetailStyles.stepNumber}>
                      {index + 1}
                    </Text>
                  </LinearGradient>

                  <View style={recipeDetailStyles.instructionContent}>
                    <Text style={recipeDetailStyles.instructionText}>
                      {instruction}
                    </Text>
                    <View style={recipeDetailStyles.instructionFooter}>
                      <Text style={recipeDetailStyles.stepLabel}>
                        Step {index + 1}
                      </Text>
                      <TouchableOpacity
                        style={recipeDetailStyles.completeButton}
                      >
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={COLORS.text}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={recipeDetailStyles.primaryButton}
            onPress={handleToggleFavorite}
            disabled={addFavoritePending}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primary + "CC"]}
              style={recipeDetailStyles.buttonGradient}
            >
              <Ionicons
                name={hasFavorited ? "heart-dislike" : "heart"}
                size={20}
                color={COLORS.white}
              />
              <Text style={recipeDetailStyles.buttonText}>
                {hasFavorited ? "Remove from Favorites" : "Add to Favorites"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default RecipeDetailScreen;
