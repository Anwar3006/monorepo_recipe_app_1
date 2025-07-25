import axios from "axios";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const MealAPIRequest = {
  /**
   * Searches for meals by name using the MealDB API.
   *
   * @param {string} query - The name or partial name of the meal to search for.
   * @returns {Promise<Array>} A promise that resolves to an array of meal objects if found, otherwise an empty array.
   * Logs an error message and returns an empty array if the request fails.
   */

  searchMealByName: async (query) => {
    try {
      const result = await axios.get(
        `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
      );
      return result.data.meals || [];
    } catch (error) {
      console.error("Error searching meal by name: ", error);
      return [];
    }
  },

  /**
   * Gets a meal by ID using the MealDB API.
   *
   * @param {string} id - The ID of the meal to get.
   * @returns {Promise<Object|null>} A promise that resolves to the meal object if found, otherwise null.
   * Logs an error message and returns null if the request fails.
   */
  getMealById: async (id) => {
    try {
      const result = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
      return result.data.meals[0] || null;
    } catch (error) {
      console.error("Error getting meal by ID: ", error);
      return null;
    }
  },

  /**
   * Gets a random meal using the MealDB API.
   *
   * @returns {Promise<Object|null>} A promise that resolves to the random meal object if found, otherwise null.
   * Logs an error message and returns null if the request fails.
   */
  getRandomMeal: async () => {
    try {
      const result = await axios.get(`${BASE_URL}/random.php`);
      return result.data.meals[0] || null;
    } catch (error) {
      console.error("Error getting random meal: ", error.message);
      return null;
    }
  },

  /**
   * Gets a specified number of random meals using the MealDB API.
   *
   * @param {number} count - The number of meals to get. Defaults to 6.
   * @returns {Promise<Array>} A promise that resolves to an array of meal objects, or an empty array if the request fails.
   * Logs an error message and returns an empty array if the request fails.
   */
  getRandomMeals: async (count = 6) => {
    try {
      const promises = Array(count)
        .fill()
        .map(() => MealAPIRequest.getRandomMeal());
      const meals = await Promise.all(promises);
      return meals.filter((meal) => meal !== null);
    } catch (error) {
      console.error("Error getting random meals: ", error);
      return [];
    }
  },

  /**
   * Retrieves a list of meal categories using the MealDB API.
   *
   * @returns {Promise<Array>} A promise that resolves to an array of category objects if successful, otherwise an empty array.
   * Logs an error message and returns an empty array if the request fails.
   */
  getCategories: async () => {
    try {
      const result = await axios.get(`${BASE_URL}/categories.php`);
      return result.data.categories || [];
    } catch (error) {
      console.error("Error getting categories: ", error);
      return [];
    }
  },

  /**
   * Filters meals by ingredient using the MealDB API.
   *
   * @param {string} ingredient - The ingredient to filter by.
   * @returns {Promise<Array>} A promise that resolves to an array of meal objects filtered by the ingredient, or an empty array if the request fails.
   * Logs an error message and returns an empty array if the request fails.
   */
  filterByIngredient: async (ingredient) => {
    try {
      const result = await axios.get(
        `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
      );
      return result.data.meals || [];
    } catch (error) {
      console.error("Error filtering by ingredient: ", error);
      return [];
    }
  },

  /**
   * Filters meals by category using the MealDB API.
   *
   * @param {string} category - The category to filter by.
   * @returns {Promise<Array>} A promise that resolves to an array of meal objects filtered by the category, or an empty array if the request fails.
   * Logs an error message and returns an empty array if the request fails.
   */
  filterByCategory: async (category) => {
    try {
      const result = await axios.get(
        `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
      );
      return result.data.meals || [];
    } catch (error) {
      console.error("Error filtering by category: ", error);
      return [];
    }
  },

  transformMealData: (meal) => {
    if (!meal) return null;

    //extract ingredients
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && measure) {
        const measureText =
          measure && measure.trim() ? `${measure.trim()}` : "";
        ingredients.push(`${ingredient.trim()} - ${measureText}`);
      }
    }

    //extract instructions
    const instructions = meal.strInstructions
      ? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim())
      : [];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: meal.strInstructions
        ? meal.strInstructions.substring(0, 120) + "..."
        : "Delicious meal from TheMealDB",
      image: meal.strMealThumb,
      cookTime: ["30 mins", "15 mins", "20 mins", "40 mins"][
        Math.floor(Math.random() * 4)
      ],
      servings: Math.floor(Math.random() * 4) + 1,
      category: meal.strCategory || "Main Course",
      area: meal.strArea,
      ingredients,
      instructions,
      originalData: meal,
    };
  },

  transformCategoriesData: (categories) => {
    if (categories.length === 0) return;

    const tranformedCategories = categories.map((cat, index) => {
      return {
        id: cat.idCategory,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      };
    });

    // console.log(tranformedCategories);

    return tranformedCategories;
  },
};
