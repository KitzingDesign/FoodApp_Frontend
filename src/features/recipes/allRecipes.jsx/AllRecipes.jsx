import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../auth/authSlice";
import { useGetRecipesQuery } from "../recipesApiSlice";
import RecipeCard from "../../../components/RecipeCard";

import styles from "./AllRecipes.module.css";

const AllRecipes = () => {
  const userId = Number(useSelector(selectCurrentUserId));
  console.log(userId);
  const { data: recipes = [], error, isLoading } = useGetRecipesQuery(userId);

  console.log(recipes);

  const content = isLoading ? (
    <div>Loading...</div>
  ) : (
    <main className={styles.container}>
      <h1 className={styles.title}>Recipes</h1>
      <span className={styles.spanLink}>/ All Recipes</span>
      <Link to="create" className={styles.addRecipeLink}>
        Add Recipe{" "}
      </Link>
      <div className={styles.gridContainer}>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.recipe_id} recipe={recipe} />
        ))}
      </div>
    </main>
  );
  return content;
};
export default AllRecipes;
