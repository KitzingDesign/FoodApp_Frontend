import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { selectCurrentUserId } from "../../auth/authSlice";
import { useGetRecipesQuery } from "../recipesApiSlice";
import RecipeCard from "../../../components/RecipeCard";
import { useParams } from "react-router-dom";
import { useGetCollectionRecipesQuery } from "../../collections/collectionsApiSlice";
import styles from "./AllRecipes.module.css";
import Button from "../../../UI/Button";

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
      {/* <Link  className={styles.addRecipeLink}> */}
      <div className={styles.addRecipeLink}>
        <Button
          variant="outline"
          size="medium"
          destination="create"
          aria-label="Add a new recipe"
        >
          Add Recipe
        </Button>
      </div>
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
