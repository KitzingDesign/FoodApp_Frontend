import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { selectCurrentUserId } from "../../auth/authSlice";
import { useGetRecipesQuery } from "../recipesApiSlice";
import RecipeCard from "../../../components/RecipeCard";
import { useParams } from "react-router-dom";
import { useGetCollectionRecipesQuery } from "../../collections/collectionsApiSlice";
import styles from "./AllRecipes.module.css";

const AllRecipes = () => {
  const { collectionId } = useParams(); // Extract collection ID from URL
  const userId = Number(useSelector(selectCurrentUserId));

  const {
    data: recipes = [],
    error,
    isLoading,
  } = collectionId
    ? useGetCollectionRecipesQuery(collectionId)
    : useGetRecipesQuery(userId);

  console.log(recipes);

  useEffect(() => {
    console.log("Recipes in component after fetch:", recipes); // To debug re-renders
  }, [recipes]);

  const content = isLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <Link to="create" className={styles.addRecipeLink}>
        Add Recipe{" "}
      </Link>
      <div className={styles.gridContainer}>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.recipe_id} recipe={recipe} />
        ))}
      </div>
    </>
  );
  return content;
};

export default AllRecipes;
